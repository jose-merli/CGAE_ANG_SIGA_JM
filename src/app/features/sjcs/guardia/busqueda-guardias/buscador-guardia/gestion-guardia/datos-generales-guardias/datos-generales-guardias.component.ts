import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { endpoints_guardia } from '../../../../../../../utils/endpoints_guardia';
import { TranslateService } from '../../../../../../../commons/translate';
import { SigaStorageService } from '../../../../../../../siga-storage.service';
import { CalendarioProgramadoItem } from '../../../../../../../models/guardia/CalendarioProgramadoItem';

@Component({
  selector: 'app-datos-generales-guardias',
  templateUrl: './datos-generales-guardias.component.html',
  styleUrls: ['./datos-generales-guardias.component.scss']
})
export class DatosGeneralesGuardiasComponent implements OnInit {

  body: GuardiaItem = new GuardiaItem();
  bodyInicial: GuardiaItem = new GuardiaItem();

  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Input() tarjetaDatosGenerales;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  tipoGuardiaResumen : string = '';
  @Input() openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  datos = [];
  cols;
  comboTipoGuardia = [];
  comboGuardia = [];
  comboTurno = [];
  progressSpinner;
  msgs;
  resaltadoDatos: boolean = false;
  controlCargaInicial: boolean = false;
  isLetrado : boolean = false;
  @Input() idTurnoFromFichaTurno = null;
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private translateService: TranslateService,
    private sigaStorageService : SigaStorageService) { }


  ngOnInit() {
    this.resaltadoDatos=true;
    this.isLetrado = this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona;
    this.getCols();
    this.historico = this.persistenceService.getHistorico()
    this.getComboTipoGuardia();

    this.getComboTurno();
    // this.progressSpinner = true;
    /*if (sessionStorage.getItem("filtrosDatosGeneralesGuardia")) {
      this.body = new GuardiaItem();
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosDatosGeneralesGuardia")
      );
    }*/
    if (this.controlCargaInicial == false) {

      if (sessionStorage.getItem("crearGuardiaFromFichaTurno") != null) {
        if (this.idTurnoFromFichaTurno != null){
          this.body.idTurno =  this.idTurnoFromFichaTurno;
          this.modoEdicion = false;
          this.permisoEscritura = true;
        }
        this.getComboTipoGuardia();
        this.getComboTurno();

        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      }

      this.sigaService.datosRedy$.subscribe(
        data => {
          data = JSON.parse(data.body);
          this.body.idGuardia = data.idGuardia;
          this.body.descripcionFacturacion = data.descripcionFacturacion;
          this.body.descripcion = data.descripcion;
          this.body.descripcionPago = data.descripcionPago;
          this.body.idTipoGuardia = data.idTipoGuardia;
          if (this.idTurnoFromFichaTurno != null){
            this.body.idTurno =  this.idTurnoFromFichaTurno;
            this.permisoEscritura = true;
          }else{
            this.body.idTurno = data.idTurno;
          }
          this.body.nombre = data.nombre;
          this.body.envioCentralita = data.envioCentralita;
          this.getComboTipoGuardia();

          this.getComboTurno();
          //Informamos de la guardia de la que hereda si existe.
          if (data.idGuardiaPrincipal && data.idTurnoPrincipal)
            this.datos.push({
              vinculacion: 'Principal',
              turno: data.idTurnoPrincipal,
              guardia: data.idGuardiaPrincipal
            })
          if (data.idGuardiaVinculada && data.idTurnoVinculada) {
            let guardias = data.idGuardiaVinculada.split(",");
            let turno = data.idTurnoVinculada.split(",");
            this.datos = guardias.map(function (x, i) {
              return { vinculacion: "Vinculada", guardia: x, turno: turno[i] }
            });
            this.datos.pop()
          }
        
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.progressSpinner = false;
          this.controlCargaInicial = true;
          sessionStorage.setItem("DatosGeneralesGuardia",JSON.stringify(this.body));
        });
      }
  }

  ngAfterViewInit() {
    if (sessionStorage.getItem("primeraVezCrearGuardiaFromFichaTurno") != null) {
      sessionStorage.removeItem("primeraVezCrearGuardiaFromFichaTurno");
    }
  }

  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    let msg = this.translateService.instant('general.message.camposObligatorios');
    this.msgs = [{severity: "error", summary: "Error", detail: msg}];
    this.resaltadoDatos=true;
  }

  abreCierraFicha(key) {
    this.openFicha = !this.openFicha;

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }


  disabledSave() {
    if (this.permisoEscritura){
      /*if (!this.historico && (this.body.nombre && this.body.nombre.trim())
        && (this.body.descripcion && this.body.descripcion.trim()) && !(this.body.idTurnoPrincipal && !this.body.idGuardiaPrincipal)
        && (this.body.idTurno) && (JSON.stringify(this.body) != JSON.stringify(this.bodyInicial))) {*/
          if (!this.historico && (this.body.nombre && this.body.nombre.trim())
        && (this.body.descripcion && this.body.descripcion.trim()) && !(this.body.idTurnoPrincipal && !this.body.idGuardiaPrincipal)
        && (this.body.idTurno)) {
        return false;
      } else return true;
    }
    else
      return true;
  }

  getCols() {
    if (!this.modoEdicion)
      this.cols = [
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
    else
      this.cols = [
        { field: "vinculacion", header: "justiciaGratuita.guardia.gestion.vinculacion" },
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
  }


  getComboTipoGuardia() {
    this.sigaService.get("busquedaGuardia_tiposGuardia").subscribe(
      n => {
        this.comboTipoGuardia = n.combooItems;

        this.commonServices.arregloTildesCombo(this.comboTipoGuardia);
        this.resumenTipoGuardiaResumen();

      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboTurno() {
    this.sigaService.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        //console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.body.idGuardia = "";
    this.comboGuardia = [];

    if (this.body.idTurnoPrincipal) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {
    this.sigaService.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.body.idTurnoPrincipal).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          //console.log(err);
        }
      )

  }

  rest() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }


  callSaveService(url) {
    let filtros = new GuardiaItem();
    filtros.idGuardia = this.body.idGuardia;
    filtros.descripcionFacturacion = this.body.descripcionFacturacion;
    filtros.descripcion = this.body.descripcion;
    filtros.descripcionPago = this.body.descripcionPago;
    filtros.idTipoGuardia = this.body.idTipoGuardia;
    filtros.idTurno = this.body.idTurno;
    filtros.nombre = this.body.nombre;
    filtros.envioCentralita = this.body.envioCentralita;
    //sessionStorage.setItem('filtrosDatosGeneralesGuardia', JSON.stringify(filtros));

    if (this.body.descripcion != undefined) this.body.descripcion = this.body.descripcion.trim();
    if (this.body.nombre != undefined) this.body.nombre = this.body.nombre.trim();
    if (this.body.envioCentralita == undefined) this.body.envioCentralita = false;
    this.progressSpinner = true;
    this.sigaService.post(url, this.body).subscribe(
      data => {
        let respuesta = JSON.parse(data.body);
        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.getCols();
          this.persistenceService.setDatos({
            idGuardia: respuesta.id,
            idTurno: this.body.idTurno
          })
          this.modoEdicionSend.emit(true);
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.guardia.gestion.guardiaCreadaDatosPred"));
        } else{
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.modoEdicionSend.emit(false);
        } 

        this.resumenTipoGuardiaResumen();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          //console.log('err.error - ', err.error)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  save() {
    if(!this.disabledSave()){
      if (this.permisoEscritura && !this.historico) {
        let url = "";

        if (!this.modoEdicion && this.permisoEscritura) {
          url = "busquedaGuardias_createGuardia";
          this.callSaveService(url);

        } else if (this.permisoEscritura) {
          url = "busquedaGuardias_updateGuardia";
          this.callSaveService(url);
        }
      }
    }else{
      this.muestraCamposObligatorios();
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  resumenTipoGuardiaResumen() {
    let i = this.comboTipoGuardia.filter(it => it.value == this.body.idTipoGuardia)[0];
    if (i != undefined){
      this.tipoGuardiaResumen = i.label;
    }
  }

  clear() {
    this.msgs = [];
  }

}