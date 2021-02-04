import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-datos-generales-ejg',
  templateUrl: './datos-generales-ejg.component.html',
  styleUrls: ['./datos-generales-ejg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesEjgComponent implements OnInit {
  //Resultados de la busqueda
  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaDatosGenerales: string;
  @Output() modoEdicionSend = new EventEmitter<any>();
  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  body: EJGItem;
  bodyInicial: EJGItem;
  msgs = [];
  nuevo;
  textSelected;
  tipoEJGDesc;
  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboPrestaciones = [];
  comboTipoExpediente = [];
  tipoExpedienteDes: string;
  showTipoExp: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService) { }

  ngOnInit() {
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    this.getComboPrestaciones();
    this.getComboTipoExpediente();
      if (this.persistenceService.getDatos()) {
        this.modoEdicion = true;
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
        if (this.body.fechalimitepresentacion != undefined)
          this.body.fechalimitepresentacion = new Date(this.body.fechalimitepresentacion);
        if (this.body.fechapresentacion != undefined)
          this.body.fechapresentacion = new Date(this.body.fechapresentacion);
        if (this.body.fechaApertura != undefined)
          this.body.fechaApertura = new Date(this.body.fechaApertura);
        if (this.body.idTipoExpediente != undefined)
          this.showTipoExp = true;
      }else {
      this.nuevo = true;
      this.modoEdicion = false;
       this.body = new EJGItem();
       this.showTipoExp = false;
      // this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }

  getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        this.tipoEJGDesc = n.combooItems[0].label;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoEJGColegio() {
    this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJGColegio);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoExpediente(){
    this.sigaServices.get("gestionejg_comboTipoExpediente").subscribe(
      n => {
        this.comboTipoExpediente = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoExpediente);
        let tipoExp = this.comboTipoExpediente.find(
          item => item.value == this.body.idTipoExpediente
        );
        if(tipoExp != undefined)
          this.tipoExpedienteDes = tipoExp.label;
      },
      err => {
        console.log(err);
      }
    );
    }
  getComboPrestaciones() {
    this.sigaServices.get("filtrosejg_comboPrestaciones").subscribe(
      n => {
        this.comboPrestaciones = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPrestaciones);
        this.body.prestacion = n.combooItems.map(it => it.value.toString());
        // this.textSelected = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  fillFechaApertura(event) {
    this.body.fechaApertura = event;
  }
  fillFechaPresentacion(event) {
    this.body.fechapresentacion = event;
  }
  fillFechaLimPresentacion(event) {
    this.body.fechalimitepresentacion = event;
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
  checkPermisosSave() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsServices.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }
  save(){

  }
  checkPermisosRest() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }
  rest(){

  }
  checkPermisosComunicar(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.comunicar();
    }
  }
  comunicar(){

  }
  checkPermisosAsociarDes(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDes();
    }
  }
  asociarDes(){
    
  }
  checkPermisosCreateDes(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.createDes();
    }
  }
  createDes(){
    
  }
  checkPermisosAddExp(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.addExp();
    }
  }
  addExp(){
    
  }
}
