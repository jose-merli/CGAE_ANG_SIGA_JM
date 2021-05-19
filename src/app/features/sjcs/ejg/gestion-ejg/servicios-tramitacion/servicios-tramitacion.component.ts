import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';
import { datos_combos } from '../../../../../utils/datos_combos';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { ColegiadosSJCSItem } from '../../../../../models/ColegiadosSJCSItem';
import { BusquedaColegiadoExpressComponent } from '../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';


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
  isDisabledGuardia: boolean = true;
  destinatario: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  disableBuscar: boolean = false;
  art27: boolean = false;


  body: EJGItem;
  bodyInicial: EJGItem;
  comboTurno = [];
  comboGuardia = [];
  institucionActual;
  comboTipoLetrado = datos_combos.comboTipoLetrado;
  msgs = [];
  nuevo;
  tipoLetrado;

  resaltadoDatosGenerales: boolean = false;

  fichaPosible = {
    key: "serviciosTramitacion",
    activa: false
  }

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

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
      this.usuarioBusquedaExpress = {
        numColegiado: this.body.numColegiado,
        nombreAp: this.body.apellidosYNombre
      };
    } else {
      this.modoEdicion = false;
      this.nuevo = true;
      this.body = new EJGItem();

    }
    this.getComboTurno();

    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      sessionStorage.removeItem('buscadorColegiados');

      if (busquedaColegiado.nombreSolo != undefined) this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombreSolo;
      else this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombre;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;

      this.body.apellidosYNombre = this.usuarioBusquedaExpress.nombreAp;

      if (busquedaColegiado.nColegiado != undefined) this.body.numColegiado = busquedaColegiado.nColegiado;

      this.usuarioBusquedaExpress.numColegiado = this.body.numColegiado;

      //Asignacion de idPersona según el origen de la busqueda.
      this.body.idPersona = busquedaColegiado.idPersona;
      if (this.body.idPersona == undefined) this.body.idPersona = busquedaColegiado.idpersona;
    }

    if (sessionStorage.getItem("idTurno")) {
      this.body.idTurno = sessionStorage.getItem("idTurno");
      sessionStorage.removeItem('idTurno');
    }

    if (sessionStorage.getItem("idGuardia")) {
      this.body.idGuardia = sessionStorage.getItem("idGuardia");
      sessionStorage.removeItem('idGuardia');
    }

    if (sessionStorage.getItem('art27')) {
      sessionStorage.removeItem('art27');
      this.art27 = true;
    }

    this.getComboGuardia();

    if (this.body.idTurno != null && this.body.idTurno != undefined) this.isDisabledGuardia = false;
    /* this.checkBusqueda(); */

    //Si el campo de letrado no esta vacio. Comprobamos si el letrado ha sido seleccionado por
    //el articulo 27-28 para rellenar el checkbox.
    if (this.body.apellidosYNombre != undefined && this.body.apellidosYNombre != null ) this.checkArt27();

  }

  checkArt27() {

      let datos = new ColegiadosSJCSItem();

      //Estado "Ejerciente"
      datos.idEstado = "20";
      datos.idInstitucion =  this.institucionActual;
      datos.idGuardia = [];
      datos.idTurno = [];
      datos.idGuardia.push(this.body.idGuardia);
      datos.idTurno.push(this.body.idTurno);

      this.sigaServices.post("componenteGeneralJG_busquedaColegiadoEJG", datos).subscribe(
        data => {
          this.progressSpinner = false;
          let colegiados = JSON.parse(data.body).colegiadosSJCSItem;

          //Se comprueba si el colegiado esta en el turno y guardia seleccionados
          if (colegiados.length > 0) {
            let presente = false;
            colegiados.forEach(element => {
              if(this.body.apellidosYNombre == element.apellidos+", "+element.nombre) presente=true;
            });
            if(!presente)this.art27=true;
          }
        }
      );

  }

  checkBusqueda() {
    if ((this.body.idTurno != null && this.body.idGuardia != null)
      /* || (this.body.idTurno == null &&this.body.idGuardia == null) */
    ) {
      /* this.disableBuscar= false; */
    }
    /* else this.disableBuscar=true; */
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
    /*  if (this.body.tipoLetrado == "E") {
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
       ); */
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=EJG").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
        this.progressSpinner = false;
        console.log(this.comboTurno);
        // if((this.datosDesgina != null && this.datosDesgina != undefined) && (this.datosDesgina.idTurno != null && this.datosDesgina.idTurno != undefined)){
        //   this.filtro.idTurno = [this.datosDesgina.idTurno];
        // }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
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
          if (sessionStorage.getItem("idGuardia")) {
            this.body.idGuardia = sessionStorage.getItem("idGuardia");
            sessionStorage.removeItem('idGuardia');
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  clearBusqueda() {
    /* this.checkBusqueda(); */
    //Para prevenir que un colegiado se asigne a turnos y guardias que no son suyos.
    this.usuarioBusquedaExpress = {
      numColegiado: '',
      nombreAp: ''
    };
    this.body.idPersona = null;
    this.body.apellidosYNombre = null;
    this.body.numColegiado = null;
  }

  onChangeTurnos() {
    /* this.checkBusqueda(); */
    this.comboGuardia = [];
    this.body.idGuardia = null;
    //Para prevenir que un colegiado se asigne a turnos y guardias que no son suyos.
    this.usuarioBusquedaExpress = {
      numColegiado: '',
      nombreAp: ''
    };
    this.body.idPersona = null;
    this.body.apellidosYNombre = null;
    this.body.numColegiado = null;

    if (this.body.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.body.guardia = "";
    }

  }
  //busqueda express
  /* isBuscar() {
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
          if (this.destinatario)
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
    this.disableBuscar = false;
  } */

  /* isLimpiar() {
    this.body.apellidosYNombre = "";
    this.body.numColegiado = "";
    this.body.idPersona = "";
  } */
  checkPermisosSave() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      } else {
        this.save();
      }
    }
  }
  save() {
    this.progressSpinner = true;

    //this.body.nuevoEJG=!this.modoEdicion;


    this.sigaServices.post("gestionejg_guardarServiciosTramitacion", this.body).subscribe(
      n => {
        this.progressSpinner = false;
        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyInicial = this.body;
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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

  rest() {
    this.body = this.bodyInicial;
    this.usuarioBusquedaExpress = {
      numColegiado: this.body.numColegiado,
      nombreAp: this.body.apellidosYNombre
    };
    /* this.checkBusqueda(); */
  }


  disabledSave() {
    if (this.body.idTurno != null && this.body.idGuardia != null && this.body.apellidosYNombre != null) {
      return false;
    }
    else return true;
  }

  idPersona(event) {
    this.body.idPersona = event;
  }
}
