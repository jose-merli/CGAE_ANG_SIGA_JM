import { Component, OnInit, Input } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { ResolucionEJGItem } from '../../../../../models/sjcs/ResolucionEJGItem';
@Component({
  selector: 'app-resolucion',
  templateUrl: './resolucion.component.html',
  styleUrls: ['./resolucion.component.scss']
})
export class ResolucionComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaResolucion: string;

  openFicha: boolean = false;
  nuevo;
  body: EJGItem;
  resolucion: ResolucionEJGItem;
  [x: string]: any;
  msgs;
  comboActaAnnio = [];
  comboResolucion = [];
  comboFundamentoJurid = [];
  comboOrigen = [];
  comboPonente = [];
  isDisabledFundamentosJurid: boolean = true;
  fundamentoJuridicoDesc: String;
  ResolDesc: String;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService) { }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
        this.modoEdicion = true;
        this.nuevo = false;
        this.item = this.persistenceService.getDatos();
        this.getResolucion(this.item);
      }else {
      this.modoEdicion = false;
      this.nuevo = true;
      this.resolucion = new ResolucionEJGItem();
    }
    this.getComboPonente();
    this.getComboOrigen();
  }
  getResolucion(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getResolucion", selected).subscribe(
    n => {
      if(n.body){
        this.resolucion = JSON.parse(n.body);
      }else{this.resolucion = new   ResolucionEJGItem();}
     if (this.resolucion.fechaPresentacionPonente != undefined)
        this.resolucion.fechaPresentacionPonente = new Date(this.resolucion.fechaPresentacionPonente);
     if (this.resolucion.fechaResolucionCAJG != undefined)
        this.resolucion.fechaResolucionCAJG = new Date(this.resolucion.fechaResolucionCAJG);
     if (this.resolucion.fechaRatificacion != undefined)
        this.resolucion.fechaRatificacion = new Date(this.resolucion.fechaRatificacion);
     if (this.resolucion.fechaNotificacion != undefined)
        this.resolucion.fechaNotificacion = new Date(this.resolucion.fechaNotificacion);
      this.getComboActaAnnio();
      this.getComboFundamentoJurid();
      this.getComboResolucion();
      this.progressSpinner = false;
      },
      err => {
       console.log(err);
      }
    );
  }
  getComboResolucion() {
    this.sigaServices.get("filtrosejg_comboResolucion").subscribe(
      n => {
        this.comboResolucion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboResolucion);
        let resol = this.comboResolucion.find(
          item => item.value == this.resolucion.idTiporatificacionEJG
        );
        if(resol != undefined)
          this.ResolDesc = resol.label;
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboActaAnnio() {
    this.sigaServices.get("gestionejg_comboActaAnnio").subscribe(
      n => {
        this.comboActaAnnio = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboActaAnnio);
      },
      err => {
        console.log(err);
      }
    );
  }
  onChangeResolucion() {
    this.comboFundamentoJurid = [];
    if (this.resolucion.idTiporatificacionEJG != undefined && this.resolucion.idTiporatificacionEJG != "") {
      this.isDisabledFundamentosJurid = false;
      this.getComboFundamentoJurid();
    } else {
      this.isDisabledFundamentosJurid = true;
      this.resolucion.idFundamentoJuridico = "";
    }
  }
  getComboFundamentoJurid() {
    this.sigaServices
      .getParam(
        "filtrosejg_comboFundamentoJurid",
        "?resolucion=" + this.resolucion.idTiporatificacionEJG
      )
      .subscribe(
        n => {
          this.comboFundamentoJurid = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboFundamentoJurid);
          
          let fJuridico = this.comboFundamentoJurid.find(
            item => item.value == this.resolucion.idFundamentoJuridico
          );
          if(fJuridico != undefined)
            this.fundamentoJuridicoDesc = fJuridico.label;
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
      /*if (this.resolucion.fechaApertura != undefined) { 
        return false;
      } else {
        return true;
      }
      COMPROBAR LOS CAMPOS OBLIGATORIOS (EN PPIO NO HAY)
      */
    } else {
      if (this.permisoEscritura) {
        return false;
        /*if (this.resolucion.fechaApertura != undefined) {
          return false;
        } else {
          return true;
        }*/
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
    this.resolucion.fechaPresentacionPonente = event; 
  }
  fillFechaResCAJG(event){
    this.resolucion.fechaResolucionCAJG = event; 
  }
  fillFechaNotif(event){
    this.resolucion.fechaNotificacion = event;
  }
  fillFechaResFirme(event){
    this.resolucion.fechaRatificacion = event; 
  }
  onChangeCheckT(event) {
    this.resolucion.turnadoRatificacion = event;
  }
  onChangeCheckR(event) {
    this.resolucion.requiereNotificarProc = event;
  }
}
