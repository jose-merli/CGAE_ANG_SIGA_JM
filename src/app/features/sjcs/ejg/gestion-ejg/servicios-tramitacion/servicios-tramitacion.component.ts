import { Component, OnInit, Input, Output, EventEmitter,SimpleChanges } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { datos_combos } from '../../../../../utils/datos_combos';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';

@Component({
  selector: 'app-servicios-tramitacion',
  templateUrl: './servicios-tramitacion.component.html',
  styleUrls: ['./servicios-tramitacion.component.scss']
})
export class ServiciosTramitacionComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaServiciosTramitacion: string;

  @Output() modoEdicionSend = new EventEmitter<any>();
  
  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  buscarDisabled: boolean = false;
  isDisabledGuardia: boolean = true;
  destinatario: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();

  body: EJGItem;
  bodyInicial: EJGItem;
  comboTurno = [];
  comboGuardia = [];
  institucionActual = 2000;
  comboTipoLetrado = datos_combos.comboTipoLetrado;
  msgs = [];
  nuevo;
  tipoLetrado;

  resaltadoDatosGenerales: boolean = false;
  
  fichaPosible = {
    key: "serviciosTramitacion",
    activa: false
  }
  
  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaServiciosTramitacion;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonServices: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.modoEdicion = true;
        this.body = this.persistenceService.getDatos();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      }else {
      this.modoEdicion = false;
      this.nuevo = true;
       this.body = new EJGItem();
    }
    this.getComboGuardia();
    this.getComboTurno();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaServiciosTramitacion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  esFichaActiva(key) {

    return this.fichaPosible.activa;
  }
  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "serviciosTramitacion" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }
  clear() {
    this.msgs = [];
  }
  getComboTurno() {
    if (this.body.tipoLetrado == "E") {
      this.tipoLetrado = "2";
    } else if (this.body.tipoLetrado == "D" || this.body.tipoLetrado == "A") { this.tipoLetrado = "1"; }
    this.sigaServices.getParam("filtrosejg_comboTurno",
      "?idTurno=" + this.tipoLetrado).subscribe(
        n => {
          this.comboTurno = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurno);
        },
        err => {
          console.log(err);
        }
      );

  }
  getComboGuardia() {
    this.sigaServices.getParam(
      "combo_guardiaPorTurno",
      "?idTurno=" + this.body.idTurno
    )
      .subscribe(
        col => {
          this.comboGuardia = col.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      );
  }
  onChangeTurnos() {
    this.comboGuardia = [];
    if (this.body.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.body.guardia = "";
    }
  }
  //busqueda express
  isBuscar() {
    let objPersona = null;
    if (this.body.idPersona.length != 0) {
      this.progressSpinner = true;
      objPersona = {
        idPersona: this.body.idPersona,
        idInstitucion: this.institucionActual
      }
      this.sigaServices.post("busquedaPer_institucion", objPersona).subscribe(
        data => {
          let persona = JSON.parse(data["body"]);
          if (persona && persona.colegiadoItem) {
            this.destinatario = persona.colegiadoItem[0];
          } else if (persona && persona.noColegiadoItem) {
            this.destinatario = persona.noColegiadoItem[0];
          }
          if(this.destinatario)
            this.body.apellidosYNombre = this.destinatario.apellidos1 + " " + this.destinatario.apellidos2 + ", " + this.destinatario.soloNombre;
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = true;
        },
        () => {
          //this.buscar();
        }
      );
    } else {
      this.progressSpinner = false;
      this.body.apellidosYNombre = "";
      // this.body.idPersona = "";
    }
    this.buscarDisabled = false;
  }

  isLimpiar() {
    this.body.apellidosYNombre = "";
    this.body.numColegiado = "";
    this.body.idPersona = "";
  }
  checkPermisosSave() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonServices.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }
  save(){
    this.progressSpinner=true;

    this.body.nuevoEJG=!this.modoEdicion;

    this.sigaServices.post("gestionejg_guardarDatosGenerales", this.body).subscribe(
      n => {
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }
    );
  }
  checkPermisosRest() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }
  rest(){
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }
  disabledSave() {
    if (this.nuevo) {
      if (this.body.fechaApertura != undefined) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.permisoEscritura) {
        if (this.body.fechaApertura != undefined) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
}
