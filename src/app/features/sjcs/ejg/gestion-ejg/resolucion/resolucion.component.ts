import { Component, OnInit, Input } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';

@Component({
  selector: 'app-resolucion',
  templateUrl: './resolucion.component.html',
  styleUrls: ['./resolucion.component.scss']
})
export class ResolucionComponent implements OnInit {
  @Input() modoEdicion;
  openFicha: boolean = false;
  permisoEscritura: boolean = false;
  nuevo;
  body: EJGItem;
  [x: string]: any;
  msgs;
  comboAnnioActaFechaRes = [];
  comboResolucion = [];
  comboFundamentoJurid = [];
  comboOrigen = [];
  comboPonente = [];
  isDisabledFundamentosJurid: boolean = true;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService) { }

  ngOnInit() {
    this.getComboPonente();
    this.getComboOrigen();
    this.getComboResolucion();
    if (this.persistenceService.getPermisos() != undefined)
    // this.permisoEscritura = this.persistenceService.getPermisos()
    // De momento todo disabled, funcionalidades FAC.Cuando esté todo cambiar Permisos. 
    this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.body = this.persistenceService.getDatos();
      }
    } else {
      this.nuevo = true;
      this.body = new EJGItem();
    }
  }
  getComboResolucion() {
    this.sigaServices.get("filtrosejg_comboResolucion").subscribe(
      n => {
        this.comboResolucion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboResolucion);
      },
      err => {
        console.log(err);
      }
    );
  }
  onChangeResolucion() {
    if (this.body.resolucion != undefined && this.body.resolucion != "") {
      this.isDisabledFundamentosJurid = false;
      this.getComboFundamentoJurid();
    } else {
      this.isDisabledFundamentosJurid = true;
      this.body.fundamentoJuridico = "";
    }
  }
  getComboFundamentoJurid() {
    this.sigaServices
      .getParam(
        "filtrosejg_comboFundamentoJurid",
        "?resolucion=" + this.body.resolucion
      )
      .subscribe(
        n => {
          this.comboFundamentoJurid = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboFundamentoJurid);
        },
        error => { },
        () => { }
      );
  }
  getComboPonente(){
    this.sigaServices.get("filtrosejg_comboPonente").subscribe(
      n => {
        this.comboPonente = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboPonente);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboOrigen(){
    this.sigaServices.get("gestionejg_comboOrigen").subscribe(
      n => {
        this.comboOrigen = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboOrigen);
      },
      err => {
        console.log(err);
      }
    );
  }
  disabledSave() {
    if (this.nuevo) {
      if (this.body.fechaApertura != undefined) { /*no fechapertura, ver los campos obligatorios*/
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
  checkPermisosOpenActa() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.openActa();
    }
  }
  openActa(){

  }
  clear() {
    this.msgs = [];
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
  fillFechaPresPonente(event) {
    this.body.fechaPonenteDesd = event; //ojo sin desd
  }
  fillFechaResCAJG(event){
    this.body.fechaResolucionDesd = event; //ojo sin desd
  }
  fillFechaNotif(event){
    this.body.fechaResolucionDesd = event; //ojo notif
  }
  fillFechaResFirme(event){
    this.body.fechaResolucionDesd = event; //ojo resolucFirme
  }
}