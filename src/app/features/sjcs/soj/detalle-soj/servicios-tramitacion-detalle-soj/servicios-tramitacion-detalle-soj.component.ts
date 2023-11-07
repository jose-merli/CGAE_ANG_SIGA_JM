import { Component, OnChanges, OnInit, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { ColegiadosSJCSItem } from '../../../../../models/ColegiadosSJCSItem';
import { TranslateService } from '../../../../../commons/translate';

@Component({
  selector: 'app-servicios-tramitacion-detalle-soj',
  templateUrl: './servicios-tramitacion-detalle-soj.component.html',
  styleUrls: ['./servicios-tramitacion-detalle-soj.component.scss']
})
export class ServiciosTramitacionDetalleSojComponent implements OnInit, OnChanges {

  progressSpinner: boolean = false;
  msgs: any[];
  body;
  comboTurno = [];
  comboGuardia = [];
  isDisabledGuardia: boolean = true;
  art27: boolean = false;
  //Guarda el valor inicila de art27.
  initArt27;
  institucionActual;
  //Variable para que se utiliza para notificar que la busqueda de colegiado sigue en proceso 
  //y que no se debe eliminar el progressSpiner.
  buscandoCol: boolean = false;

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  @Input() bodyInicial: FichaSojItem;
  @Input() permisoEscritura: boolean;
  @Output() restablecerDatos = new EventEmitter<any>();

  constructor(private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService) { }



  ngOnInit() {
    this.body = new FichaSojItem();
    this.progressSpinner = true;
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.progressSpinner = false;
    });


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bodyInicial != undefined) {
      this.initBody();
    }
  }

  initBody(): void {
    if (this.bodyInicial.fechaApertura != undefined) {
      this.bodyInicial.fechaApertura = new Date(this.bodyInicial.fechaApertura);
    }
    if(this.body == undefined)
    this.body = new FichaSojItem();
    if(this.body != undefined && this.bodyInicial != undefined)
    Object.assign(this.body, this.bodyInicial);
    //Se comprueba si vuelve de una busqueda de colegiado
    if (sessionStorage.getItem("idTurno")) {
      this.body.idTurno = sessionStorage.getItem("idTurno");
      sessionStorage.removeItem('idTurno');
    }

    //Se comprueba si vueleve de una busqueda de colegiado
    if (sessionStorage.getItem("idGuardia")) {
      this.body.idGuardia = sessionStorage.getItem("idGuardia");
      sessionStorage.removeItem('idGuardia');
    }
    // Obtener Combo de Turnos y Posteriormente de Guardia.
    if(!sessionStorage.getItem("nuevoSOJ")){
      this.getComboTurno();
    }
    
    //Para evitar que se realice una busqueda innecesaria y lance errores por consola cuando no haya ningun turno seleccionado.
    if (this.body.idTurno != undefined && this.body.idTurno != null) {
      this.getComboGuardia();
    }
    //Proveniente de la busqueda de colegiado sin art 27
    if (sessionStorage.getItem("buscadorColegiados")) {

      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

      sessionStorage.removeItem('buscadorColegiados');

      if (busquedaColegiado.nombreSolo != undefined) this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombreSolo;
      else this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.apellidos + ", " + busquedaColegiado.nombre;

      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;

      this.body.nombreAp = this.usuarioBusquedaExpress.nombreAp;

      if (busquedaColegiado.nColegiado != undefined) {
        this.body.ncolegiado = busquedaColegiado.nColegiado;
        this.usuarioBusquedaExpress.numColegiado = this.body.ncolegiado;
      }

      //Asignacion de idPersona según el origen de la busqueda.
      this.body.idPersona = busquedaColegiado.idPersona;
      if (this.body.idPersona == undefined) this.body.idPersona = busquedaColegiado.idpersona;
    }

    // Numero Colegiado para SOJ
    if (this.body.ncolegiado != null || this.body.ncolegiado != undefined) {
      this.usuarioBusquedaExpress.numColegiado = this.body.ncolegiado;
    }

    // Nombre Apellido para SOJ
    if (this.body.nombreAp != null || this.body.nombreAp != undefined) {
      this.usuarioBusquedaExpress.nombreAp = this.body.nombreAp;
    }
    //Se comprueba si vueleve de una busqueda de colegiado con art 27
    if (sessionStorage.getItem('art27')) {
      sessionStorage.removeItem('art27');
      this.art27 = true;
    }
    //Se desbloquea el desplegable de guardia si hay un turno seleccionado al inciar la tarjeta.
    if (this.body.idTurno != undefined && this.body.idTurno != null) {
      this.isDisabledGuardia = false;
    }
    //Comprobamos si el colegiado fue seleccionado por art 27 o no. ES uno de los métodos más lentos del inicio
    if (this.body.apellidosYNombre != undefined && this.body.apellidosYNombre != null && this.art27 == true) {
      this.checkArt27();
    }
  }

  setIdPersona(event){
    this.body.idPersona = event;
  }

  clear() {
    this.msgs = [];
  }

  clearBusqueda() {
    //Para prevenir que un colegiado se asigne como art 27 de forma erronea.
    this.usuarioBusquedaExpress = {
      numColegiado: '',
      nombreAp: ''
    };
    this.body.idPersona = null;
    this.body.nombreAp = null;
    this.body.ncolegiado = null;
  }

  getComboTurno() {
    this.progressSpinner = true;
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=EJG&idTurno=" + this.body.idTurno).subscribe(
      n => {

        this.comboTurno = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurno);
        this.progressSpinner = false;
      },
      err => {

      }
    );
    
  }

  getComboGuardia() {
    this.progressSpinner = true;
    this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + this.body.idTurno)
      .subscribe(
        col => {
          this.comboGuardia = col.combooItems;
          this.commonsService.arregloTildesCombo(this.comboGuardia);
          if (sessionStorage.getItem("idGuardia")) {
            this.body.idGuardia = sessionStorage.getItem("idGuardia");
            sessionStorage.removeItem('idGuardia');
          }
          this.progressSpinner = false;
        },
        err => {
        }
      );
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
      this.body.idTurno = "";
    }
  }

  checkArt27() {

    let datos = new ColegiadosSJCSItem();

    //this.progressSpinner = true;
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
            if (this.body.nombreAp == element.apellidos + ", " + element.nombre) presente = true;
          });
          if (!presente) this.art27 = true;
        }
        this.progressSpinner = false;
        this.buscandoCol = false;
        this.initArt27 = this.art27;
      }
    );

  }

  checkPermisosRest() {
    // Restablecer Datos de la Base de Datos.
    if (sessionStorage.getItem("sojItemLink")) {
      sessionStorage.setItem("sojItemLink", JSON.stringify(this.body));
      this.art27 = false;
      this.restablecerDatos.emit(this.body);
    }
  }

  rest() {
    this.body = this.bodyInicial;
    this.usuarioBusquedaExpress.numColegiado = this.body.ncolegiado;
    this.usuarioBusquedaExpress.nombreAp = this.body.nombreAp;
    this.art27 = this.initArt27;
  }

  //COmprobacion de permisos y condiciones cuando se presiona el boton de guardar.
  checkPermisosSave() {
    if (this.permisoEscritura) {
      this.save();
    }
  }

  showMessage(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }


  save() {
    this.progressSpinner = true;
    //this.body.nuevoEJG=!this.modoEdicion;
    this.sigaServices.post("gestionSoj_guardarServiciosTramitacion", this.body).subscribe(
      n => {

        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.bodyInicial = this.body;
          this.initArt27 = this.art27;
          //Actualizamos la informacion en el body de la pantalla
          this.sigaServices.post("gestionJusticiables_getDetallesSoj", this.bodyInicial).subscribe(
            data => {
              let responseBody = JSON.parse(data.body);
              if (responseBody != undefined && responseBody.fichaSojItems != undefined && responseBody.fichaSojItems.length != 0) {
                this.body = responseBody.fichaSojItems[0];
              }
              this.progressSpinner = false;
            },
            err => {
              //console.log(err);
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            },
            () => {
              this.progressSpinner = false;
            }
          )
        }
        else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

      },
      err => {
        this.progressSpinner = false;

        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  changeColegiado(event) {
    this.body.ncolegiado = event.nColegiado;
    this.body.nombreAp = event.nombreAp;

    if (this.esCadenaVacia(this.body.ncolegiado) || this.esCadenaVacia(this.body.nombreAp)) {
      this.body.idPersona = undefined;
    }

  }

  esCadenaVacia(value: string): boolean {
    return value == undefined || value.trim().length == 0;
  }

}




