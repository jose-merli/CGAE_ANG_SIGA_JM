import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { datos_combos } from '../../../../../utils/datos_combos';

@Component({
  selector: 'app-servicios-tramitacion',
  templateUrl: './servicios-tramitacion.component.html',
  styleUrls: ['./servicios-tramitacion.component.scss']
})
export class ServiciosTramitacionComponent implements OnInit {
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();
  permisoEscritura: boolean = true;
  openFicha: boolean = true;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  buscarDisabled: boolean = false;
  isDisabledGuardia: boolean = true;

  body: EJGItem;
  bodyInicial: EJGItem;
  comboTurno = [];
  comboGuardia = [];
  comboTipoLetrado = datos_combos.comboTipoLetrado;
  msgs = [];
  nuevo;
  tipoLetrado;
  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonServices: CommonsService, private commonsServices: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined)
      // this.permisoEscritura = this.persistenceService.getPermisos()
      // De momento todo disabled, funcionalidades FAC. Cuando esté todo cambiar Permisos. 
      this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      }
    } else {
      this.nuevo = true;
      this.body = new EJGItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
    this.getComboGuardia();
    this.getComboTurno();
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  disabledSave() {

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
      "?idTurno=" + this.body.turno
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
    if (this.body.turno != undefined && this.body.turno != "") {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.body.guardia = "";
    }
  }
  //busqueda express
  isBuscar() {
    if (this.body.numColegiado.length != 0) {
      this.progressSpinner = true;

      this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado", "?colegiadoJGItem=" + this.body.numColegiado).subscribe(
        data => {
          this.progressSpinner = false;

          if (data.colegiadoJGItem.length == 1) {
            this.body.apellidosYNombre = data.colegiadoJGItem[0].nombre;
            this.body.idPersona = data.colegiadoJGItem[0].idPersona;
          } else {
            this.body.apellidosYNombre = "";
            this.body.numColegiado = "";
            this.body.idPersona = "";
          }
        },
        error => {
          this.progressSpinner = false;
          this.body.apellidosYNombre = "";
          this.body.numColegiado = "";
          this.body.idPersona = "";
          console.log(error);
        }
      );
    } else {
      this.progressSpinner = false;
      this.body.apellidosYNombre = "";
      this.body.idPersona = "";
    }
    this.buscarDisabled = false;
  }

  focusNColegiado() {
    this.buscarDisabled = true;
  }

  isLimpiar() {
    this.body.apellidosYNombre = "";
    this.body.numColegiado = "";
    this.body.idPersona = "";
  }
}
