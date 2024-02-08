import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from 'primeng/components/common/api';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';
import { Location } from '@angular/common'

@Component({
  selector: 'app-datos-generales-ejg',
  templateUrl: './datos-generales-ejg.component.html',
  styleUrls: ['./datos-generales-ejg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesEjgComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() nuevo;
  @Input() openTarjetaDatosGenerales: boolean = false;
  @Output() guardadoSend = new EventEmitter<any>();

  @ViewChild('someDropdown') someDropdown: MultiSelect;

  datosIniciales : EJGItem = new EJGItem();
  msgs: Message[] = [];
  maxLengthNum: number = 5;
  resumen: any = {
    tipoEJGDesc: "",
    tipoEJGColDesc: "",
    turnoEJGDesc: "",
    turnoGuardiaEJGDesc: "",
    numColegiado: ""
  };
  usuarioBusquedaExpress = {
    numColegiado: "",
    nombreAp: ""
  };

  disabledNumEJG: boolean = true;
  progressSpinner: boolean = false;
  isDisabledGuardia: boolean = true;
  permisoEscritura: boolean = false;
  tieneAsocDes: boolean = false;
  art27: boolean = false;

  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboPrestaciones = [];
  comboTurno = [];
  comboGuardia = [];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private location: Location,
    private router: Router) { }

  async ngOnInit() {

    this.datosIniciales = {...this.datos};

    this.getPermisoEscritura();
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    this.getComboPrestaciones();
    this.getComboTurno();
    if (this.datos.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    }
    this.updateResumen();
  }

  //Eventos
  abreCierraFicha() {
    this.openTarjetaDatosGenerales = !this.openTarjetaDatosGenerales;
  }

  disableEnableNumEJG() {
    this.commonsServices.checkAcceso(procesos_ejg.cambioNumEJG).then(
      respuesta => {
        if (respuesta) {
          this.disabledNumEJG = !this.disabledNumEJG;
        } else {
          this.msgs = this.commonsServices.checkPermisos(false, undefined);
        }
      }
    );
  }

  styleObligatorio(evento) {
    return this.commonsServices.styleObligatorio(evento);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    } else {
      return false;
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();
    }, 300);
  }

  onChangeTurnos() {
    this.comboGuardia = [];
    this.datos.idGuardia = null;
    if (this.datos.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.datos.guardia = "";
    }
  }

  rest(){
    this.datos = {...this.datosIniciales};
  }

  save(){

  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.datos.numColegiado = event.nColegiado;
    this.datos.apellidosYNombre = event.nombreAp;
  }

  setIdPersona(event) {
    this.datos.idPersona = event;
  }

  asociarDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //Esto determina que en la pantalla de busqueda de asuntos no se pueda cambiar de la pocion de designaciones
      sessionStorage.setItem("radioTajertaValue", 'des');
      //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
      sessionStorage.setItem("EJG", JSON.stringify(this.datos));
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  createDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      sessionStorage.setItem("nuevaDesigna", "true");
      //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
      sessionStorage.setItem("EJG", JSON.stringify(this.datos));
      if (this.art27) sessionStorage.setItem("Art27", "true");
      this.router.navigate(["/fichaDesignaciones"]);
    }
  }

  addExp() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //Comprobamos si el EJG tiene una designacion asociada
      if (this.tieneAsocDes) {
        this.progressSpinner = true;
        this.sigaServices.post("gestionejg_getDatosExpInsos", this.datos).subscribe(
          n => {
            let datos = JSON.parse(n.body).expInsosItems;
            if (datos != null && datos != undefined) {
            sessionStorage.setItem("expedienteInsos", JSON.stringify(datos[0]));
            this.router.navigate(["/addExp"]);
            } else {
            this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
            }
            this.progressSpinner = false;
          },
          err => {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            this.progressSpinner = false;
          }
        );
      } else {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.datosGenerales.noDesignaEjg') }];
      }
    }
  }

  comunicar() {
    let msg = this.commonsServices.checkPermisos(this.modoEdicion, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
      //IDMODULO de SJCS es 10
      //sessionStorage.setItem("idModulo", '10');
      this.getDatosComunicar();
    }
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    /*
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(
          data["body"]
        ).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
          data => {
            this.keys = JSON.parse(data["body"]).keysItem;
            let keysValues = [];
            this.keys.forEach(key => {
              if (this.datos[key.nombre] != undefined) {
                keysValues.push(this.datos[key.nombre]);
              } else if (key.nombre == "num" && this.datos["numero"] != undefined) {
                keysValues.push(this.datos["numero"]);
              } else if (key.nombre == "anio" && this.datos["annio"] != undefined) {
                keysValues.push(this.datos["annio"]);
              } else if (key.nombre == "idtipoejg" && this.datos["tipoEJG"] != undefined) {
                keysValues.push(this.datos["tipoEJG"]);
              } else if (key.nombre == "identificador") {
                keysValues.push(this.datos["numAnnioProcedimiento"]);
              }
            });
            datosSeleccionados.push(keysValues);
            sessionStorage.setItem("datosComunicar", JSON.stringify(datosSeleccionados));
            this.router.navigate(["/dialogoComunicaciones"]);
          }
        );
      }
    );
    */
  }

  setFecha(event, campo){
    this.datos[campo] = event;
  }

  setDatosEjg(){
    this.persistenceService.setDatosEJG(this.datos);
  }

  clear() {
    this.msgs = [];
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  private getParamMaxLengthNum() {
    let parametro = {valor: "LONGITUD_CODEJG"};
    this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
      data => {
        this.maxLengthNum = JSON.parse(data.body).parametro;
      }
    );
  }

  private getComboGuardia() {
    this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + this.datos.idTurno).subscribe(
      col => {
        this.comboGuardia = col.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboGuardia);
      }
    );
  }

  private getPermisoEscritura(){
    this.commonsServices.checkAcceso(procesos_ejg.datosGenerales).then(
      respuesta => {
        this.permisoEscritura = respuesta;
      }
    );
  }

  private getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJG);
      }
    );
  }

  private getComboTipoEJGColegio() {
    this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJGColegio);
      }
    );
  }

  private getComboPrestaciones() {
    this.sigaServices.get("filtrosejg_comboPrestaciones").subscribe(
      n => {
        this.comboPrestaciones = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPrestaciones);
        if(this.nuevo){
          this.comboPrestaciones.forEach(element => {
            this.datos.prestacion.push(element.value);
          });
        }
      }
    );
  }

  private getComboTurno() {
    if (this.datos.idTurno == null) {
      this.datos.idTurno = "1";
    }
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=EJG&idTurno=" + this.datos.idTurno).subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTurno);
      }
    );
  }

  private updateResumen() {
    if(this.datos != undefined && this.datos != null){
      if (this.datos.numColegiado != null && this.datos.numColegiado != undefined) {
        this.resumen.numColegiado = this.datos.numColegiado;
      }
      if (this.datos.tipoEJG != null && this.datos.tipoEJG != undefined) {
        this.comboTipoEJG.forEach(element => {
          if (element.value == this.datos.tipoEJG){
            this.resumen.tipoEJGDesc = element.label;
          }
        });
      }
      if (this.datos.tipoEJGColegio != null && this.datos.tipoEJGColegio != undefined) {
        this.comboTipoEJGColegio.forEach(element => {
          if (element.value == this.datos.tipoEJGColegio){
            this.resumen.tipoEJGColDesc = element.label;
          }
        });
      }
      if (this.datos.idTurno != null && this.datos.idTurno != undefined) {
        this.comboTurno.forEach(element => {
          if (element.value == this.datos.idTurno){
            this.resumen.turnoEJGDesc = element.label;
          }
        });
      }
      if (this.datos.idGuardia != null && this.datos.idGuardia != undefined) {
        this.comboGuardia.forEach(element => {
          if (element.value == this.datos.idGuardia) {
            this.resumen.turnoGuardiaEJGDesc = element.label;
          }
        });
      }
    }
  }
}