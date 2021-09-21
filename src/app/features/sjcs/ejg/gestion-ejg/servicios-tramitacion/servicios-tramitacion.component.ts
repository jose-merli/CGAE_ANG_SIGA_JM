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

  resaltadoDatos: boolean = false;
  disableNum = false;
  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  isDisabledGuardia: boolean = true;
  destinatario: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  disableBuscar: boolean = false;
  art27: boolean = false;
  //Guarda el valor inicila de art27.
  initArt27;
  //Variable para que se utiliza para notificar que la busqueda de colegiado sigue en proceso 
  //y que no se debe eliminar el progressSpiner.
  buscandoCol: boolean = false;

  body: EJGItem;
  bodyInicial: EJGItem;
  comboTurno = [];
  comboGuardia = [];
  institucionActual;
  comboTipoLetrado = datos_combos.comboTipoLetrado;
  msgs = [];
  nuevo;
  tipoLetrado;

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

    //Proveniente de la busqueda de colegiado sin art 27
    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      sessionStorage.removeItem('buscadorColegiados');

      if (busquedaColegiado.nombreSolo != undefined) this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombreSolo;
      else this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombre;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;

      this.body.apellidosYNombre = this.usuarioBusquedaExpress.nombreAp;

      if (busquedaColegiado.nColegiado != undefined){
        this.body.numColegiado = busquedaColegiado.nColegiado;

        this.usuarioBusquedaExpress.numColegiado = this.body.numColegiado;
      }

      //Asignacion de idPersona según el origen de la busqueda.
      this.body.idPersona = busquedaColegiado.idPersona;
      if (this.body.idPersona == undefined) this.body.idPersona = busquedaColegiado.idpersona;
    }

    //Cuando vuelve de la busqueda general SJCS
    if(sessionStorage.getItem("colegiadoGeneralDesigna")){
      let persona = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"))[0];

      sessionStorage.removeItem('colegiadoGeneralDesigna');

      this.usuarioBusquedaExpress.nombreAp = persona.apellidos + ", " + persona.nombre;

      this.usuarioBusquedaExpress.numColegiado = persona.numeroColegiado;

      this.body.apellidosYNombre = this.usuarioBusquedaExpress.nombreAp;

      this.body.numColegiado = persona.numeroColegiado;

      this.body.idPersona = persona.idPersona;


    }

    //Se comprueba si vueleve de una busqueda de colegiado
    if (sessionStorage.getItem("idTurno")) {
      this.body.idTurno = sessionStorage.getItem("idTurno");
      sessionStorage.removeItem('idTurno');
    }

    //Se comprueba si vueleve de una busqueda de colegiado
    if (sessionStorage.getItem("idGuardia")) {
      this.body.idGuardia = sessionStorage.getItem("idGuardia");
      sessionStorage.removeItem('idGuardia');
    }

    //Se comprueba si vueleve de una busqueda de colegiado con art 27
    if (sessionStorage.getItem('art27')) {
      sessionStorage.removeItem('art27');
      this.art27 = true;
    }

    //Se comprueba si vuelve de una busqueda de colegiado
    //para que se abra la tarjeta y se haga scroll
    if (sessionStorage.getItem('tarjeta') == 'ServiciosTramit') {
      this.abreCierraFicha('serviciosTramitacion');
      let top = document.getElementById("serviciosTramitacion");
      if (top) {
        top.scrollIntoView();
        top = null;
      }
      sessionStorage.removeItem('tarjeta');
      sessionStorage.removeItem('pantalla');
    }

    //Para evitar que se realice una busqueda innecesaria y lance errores por consola cuando no haya ningun turno seleccionado.
    if(this.body.idTurno!=undefined && this.body.idTurno!=null)this.getComboGuardia();

    //Se desbloquea el desplegable de guardia si hay un turno seleccionado al inciar la tarjeta.
    if (this.body.idTurno != undefined && this.body.idTurno != null) this.isDisabledGuardia = false;

    //Comprobamos si el colegiado fue seleccionado por art 27 o no. ES uno de los métodos más lentos del inicio
    if (this.body.apellidosYNombre != undefined && this.body.apellidosYNombre != null  && this.art27 == true) this.checkArt27();
  }

  checkArt27() {

    let datos = new ColegiadosSJCSItem();

   // this.progressSpinner = true;
    //Estado "Ejerciente"
    datos.idEstado = "20";
    datos.idInstitucion = this.institucionActual;
    datos.idGuardia = [];
    datos.idTurno = [];
    datos.idGuardia.push(this.body.idGuardia);
    datos.idTurno.push(this.body.idTurno);

    this.buscandoCol = true;

    this.sigaServices.post("componenteGeneralJG_busquedaColegiadoEJG", datos).subscribe(
      data => {

        let colegiados = JSON.parse(data.body).colegiadosSJCSItem;

        //Se comprueba si el colegiado esta en el turno y guardia seleccionados
        if (colegiados.length > 0) {
          let presente = false;
          colegiados.forEach(element => {
            if (this.body.apellidosYNombre == element.apellidos + ", " + element.nombre) presente = true;
          });
          if (!presente) this.art27 = true;
        }
        //this.progressSpinner = false;
        this.buscandoCol = false;
        this.initArt27 = this.art27;
      }
    );

  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonServices.styleObligatorio(evento);
    }
  }

  styleObligatorioCole(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return "border: 1px solid red !important";
    }
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
    // this.resaltadoDatos = true;
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
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=EJG").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
        //if (!this.buscandoCol) this.progressSpinner = false;
      },
      err => {
       // if (!this.buscandoCol) this.progressSpinner = false;
      }
    );

  }

  getComboGuardia() {
    //this.progressSpinner = true;
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
          //if (!this.buscandoCol) this.progressSpinner = false;
        },
        err => {
          //if (!this.buscandoCol) this.progressSpinner = false;
        }
      );
  }

  clearBusqueda() {
    //Para prevenir que un colegiado se asigne como art 27 de forma erronea.
    this.usuarioBusquedaExpress = {
      numColegiado: '',
      nombreAp: ''
    };
    this.body.idPersona = null;
    this.body.apellidosYNombre = null;
    this.body.numColegiado = null;
  }

  //Cada vez que se cambia el valor del desplegable de turnos
  onChangeTurnos() {
    this.comboGuardia = [];
    this.body.idGuardia = null;

    if (this.body.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.body.guardia = "";
    }
  }

  //COmprobacion de permisos y condiciones cuando se presiona el boton de guardar.
  checkPermisosSave() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
        this.resaltadoDatos = true;
      } else {
        this.save();
      }
    }
  }

  onChange27(){
    this.disableNum=this.art27;
    this.clearBusqueda();
  }

  save() {
    this.progressSpinner = true;

    //this.body.nuevoEJG=!this.modoEdicion;


    this.sigaServices.post("gestionejg_guardarServiciosTramitacion", this.body).subscribe(
      n => {
        
        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyInicial = this.body;
          this.initArt27 = this.art27;
          //Actualizamos la informacion en el body de la pantalla
          this.sigaServices.post("gestionejg_datosEJG", this.bodyInicial).subscribe(
            n => {
              let ejgObject = JSON.parse(n.body).ejgItems;
              let datosItem = ejgObject[0];
              
              this.persistenceService.setDatos(datosItem);
              this.body = this.persistenceService.getDatos();
              this.bodyInicial = JSON.parse(JSON.stringify(this.body));
              this.progressSpinner = false;
            },
            err => {
              this.progressSpinner = false;
            }
          );
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

      },
      err => {
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
    this.art27 = this.initArt27;
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
