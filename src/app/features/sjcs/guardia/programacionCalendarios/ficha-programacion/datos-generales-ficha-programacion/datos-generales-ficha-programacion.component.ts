import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate';
import { DatePipe } from '@angular/common';
import { ConfiguracionCola, GlobalGuardiasService } from '../../../guardiasGlobal.service';


@Component({
  selector: 'app-datos-generales-ficha-programacion',
  templateUrl: './datos-generales-ficha-programacion.component.html',
  styleUrls: ['./datos-generales-ficha-programacion.component.scss']
})
export class DatosGeneralesFichaProgramacionComponent implements OnInit {

  body: GuardiaItem = new GuardiaItem();
  bodyInicial: GuardiaItem = new GuardiaItem();

  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() dataToDuplicate = new EventEmitter<any>();
  @Output() reloadDatos = new EventEmitter<{}>();
  @Input() tarjetaDatosGenerales;
  @Input() datosGeneralesIniciales = {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
  };
  @Input() datosGenerales = {
    'duplicar' : '',
    'tabla': [],
    'turno':'',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
  };
  

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardarDatosCalendario = new EventEmitter<{}>();
  tipoGuardiaResumen = {
    label: "",
    value: "",
  };
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
  comboListaGuardias = [];
  comboConjuntoGuardias = [];
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private translateService: TranslateService,
    private datepipe: DatePipe,
    private globalGuardiasService: GlobalGuardiasService) {
     }


  ngOnInit() {
    this.openFicha = true;
    if (this.datosGenerales != undefined){
    if (this.datosGenerales.fechaProgramacion != null){
      this.datosGenerales.fechaProgramacion = new Date(this.datosGenerales.fechaProgramacion.toString());
    }
    
    console.log('fecha no ok: ', this.datosGenerales.fechaProgramacion)
    //this.getComboListaGuardia();
    this.getComboConjuntouardia();
    this.resaltadoDatos=true;

    this.getCols();
    this.historico = this.persistenceService.getHistorico()
    this.getComboTipoGuardia();

    this.getComboTurno();

    // this.progressSpinner = true;
    this.sigaService.datosRedy$.subscribe(
      data => {
        data = JSON.parse(data.body);
        this.body.idGuardia = data.idGuardia;
        this.body.descripcionFacturacion = data.descripcionFacturacion;
        this.body.descripcion = data.descripcion;
        this.body.descripcionPago = data.descripcionPago;
        this.body.idTipoGuardia = data.idTipoGuardia;
        this.body.idTurno = data.idTurno;
        this.body.nombre = data.nombre;
        this.body.envioCentralita = data.envioCentralita;
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
      });
    }

    console.log('datosGeneralesIniciales!!!!!!!!: ', this.datosGeneralesIniciales)
  }

  fillFechaCalendarioDesde(event) {
    console.log('datosGeneralesIniciales!!!!!!!! 3: ', this.datosGeneralesIniciales)
    if (this.formatDate2(event) != null){
      this.datosGenerales.fechaDesde = this.changeDateFormat(this.formatDate2(event).toString());
    }
    console.log('datosGeneralesIniciales!!!!!!!! 4: ', this.datosGeneralesIniciales)
  }
  fillFechaCalendarioHasta(event) {
    console.log('event: ', event)
    if (this.formatDate2(event) != null){
      this.datosGenerales.fechaHasta = this.changeDateFormat(this.formatDate2(event).toString());
    }
       console.log('datosGenerales.fechaHasta 1: ', this.datosGenerales.fechaHasta)
  }
  fillFechaProgramada(event) {
    console.log('datosGeneralesIniciales!!!!!!!! 1: ', this.datosGeneralesIniciales)
    console.log('OK event: ', event)
    if (event == null){
      this.datosGenerales.fechaProgramacion = null;
    }else{
      this.datosGenerales.fechaProgramacion = new Date(event.toString());
      console.log('OK fecha: ', this.datosGenerales.fechaProgramacion)
    }
    console.log('datosGeneralesIniciales!!!!!!!! 2: ', this.datosGeneralesIniciales)
  }
  
formatDate2(date) {
  const pattern = 'yyyy-MM-dd';
    return this.datepipe.transform(date, pattern);
  }
  changeDateFormat(date1){
    console.log('date1: ', date1)
    let year = date1.substring(0, 4)
    let month = date1.substring(5,7)
    let day = date1.substring(8, 10)
    let date2 = day + '/' + month + '/' + year;
    return date2;
  }
  getComboListaGuardia() {
    let idTurno;
    this.sigaService.getParam(
      "busquedaGuardia_listasGuardia", "?idTurno=" + idTurno).subscribe(
        data => {
          this.comboListaGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboListaGuardias);
        },
        err => {
          console.log(err);
        }
      )

  }

  getComboConjuntouardia() {
    this.progressSpinner = true;
    this.sigaService.get(
      "busquedaGuardia_conjuntoGuardia").subscribe(
        data => {
          this.comboConjuntoGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboConjuntoGuardias);
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      )

  }
  styleObligatorio(evento){
    if(this.resaltadoDatos && (evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios(){
    this.msgs = [{severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios')}];
    this.resaltadoDatos=true;
  }

  abreCierraFicha(key) {
    this.openFicha = !this.openFicha;

    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }


  disabledSave() {
    if (this.permisoEscritura){
          if (this.datosGenerales.fechaHasta && this.datosGenerales.fechaDesde) {
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
        console.log(err);
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
        console.log(err);
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
          console.log(err);
        }
      )

  }

  rest() {
    console.log('Reestablecer: ', this.datosGeneralesIniciales)
    //this.datosGenerales = Object.assign(datosInicialesCopy, {});
    this.reloadDatos.emit(this.datosGeneralesIniciales);
  }


  callSaveService(url) {
    if (this.body.descripcion != undefined) this.body.descripcion = this.body.descripcion.trim();
    if (this.body.nombre != undefined) this.body.nombre = this.body.nombre.trim();
    if (this.body.envioCentralita == undefined) this.body.envioCentralita = false;
    this.sigaService.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.getCols();
          this.body.idGuardia = JSON.parse(data.body).id;
          this.persistenceService.setDatos({
            idGuardia: this.body.idGuardia,
            idTurno: this.body.idTurno
          })
          this.modoEdicionSend.emit(true);
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.guardia.gestion.guardiaCreadaDatosPred"));
        } else this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.resumenTipoGuardiaResumen();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          console.log('err.error - ', err.error)
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
    console.log('datosGenerales.fechaHasta: ', this.datosGenerales.fechaHasta)
    this.progressSpinner = true;
    console.log('DUPLICAR: ', this.datosGenerales.duplicar)
    if (this.datosGenerales.duplicar){
      this.dataToDuplicate.emit(this.datosGenerales);

//TO DO
    }else{
    if(!this.disabledSave()){
      if (this.permisoEscritura && !this.historico) {
        //Guardar sólo actualizará el estado si no tiene estado (creación) o es Pendiente/Programada
        if (this.datosGenerales.estado == "" || this.datosGenerales.estado == "Pendiente" || this.datosGenerales.estado == "Programada"){
          if(this.datosGenerales.fechaProgramacion == undefined || this.datosGenerales.fechaProgramacion == null){
            //Al guardar con Fecha de programación vacía, se pasará al estado Pendiente y fechaProgramacion = hoy
            this.datosGenerales.fechaProgramacion = new Date();
          this.datosGenerales.estado = "Pendiente";
          }else {
            //Al guardar con Fecha de programación rellena, se pasará al estado Programada. 
            this.datosGenerales.estado = "Programada";
          }
          //GUARDAMOS
          this.guardarDatosCalendario.emit(this.datosGenerales)
          this.progressSpinner = false;
        } else{
          this.showMessage('error', 'Error. Debido al estado de la programación, no es posible guardar', '')
          this.progressSpinner = false;
        }
     



        
        let url = "";

        /*if (!this.modoEdicion && this.permisoEscritura) {
          url = "busquedaGuardias_createGuardia";
          this.callSaveService(url);

        } else if (this.permisoEscritura) {
          url = "busquedaGuardias_updateGuardia";
          this.callSaveService(url);
        }*/
      }
    }else{
      this.muestraCamposObligatorios();
    }
  }
  this.progressSpinner = false;
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
    this.tipoGuardiaResumen = this.comboTipoGuardia.filter(it => it.value == this.body.idTipoGuardia)[0]
  }

  clear() {
    this.msgs = [];
  }

  formatDate(date) {
  const pattern = 'yyyy-MM-dd HH:mm:ss-SS';
    return this.datepipe.transform(date, pattern);
  }

  changeListaGuardia(event){
     let idConjuntoGuardiaElegido = event.value;
     let configuracionCola: ConfiguracionCola = {
      'manual': false,
      'porGrupos': false,
      'idConjuntoGuardia': idConjuntoGuardiaElegido,
      "fromCombo": true,
      "minimoLetradosCola": 0
    };
     this.globalGuardiasService.emitConf(configuracionCola);
  }

}