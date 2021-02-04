import { Component, OnInit, Input } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-impugnacion',
  templateUrl: './impugnacion.component.html',
  styleUrls: ['./impugnacion.component.scss']
})
export class ImpugnacionComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaImpugnacion: string;

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  impugnacion: EJGItem;
  item: EJGItem;
  msgs = [];
  [x: string]: any;
  nuevo;
  comboFundamentoImpug = [];
  comboImpugnacion = [];
  checkmodificable: boolean = false;
  checkmodificableRT: boolean = false;
  impugnacionDesc: String;
  fundImpugnacionDesc: String;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonServices: CommonsService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
   // this.getComboSentidoAuto();
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.impugnacion = this.persistenceService.getDatos();
      if (this.impugnacion.fechaAuto != undefined)
        this.impugnacion.fechaAuto = new Date(this.impugnacion.fechaAuto);
      if (this.impugnacion.fechaPublicacion != undefined)
        this.impugnacion.fechaPublicacion = new Date(this.impugnacion.fechaPublicacion);
    } else {
    this.nuevo = true;
    this.modoEdicion = false;
    this.impugnacion = new EJGItem();
  }
  this.getComboImpugnacion();
  this.getComboFundamentoImpug();
}

getComboImpugnacion() {
  this.sigaServices.get("filtrosejg_comboImpugnacion").subscribe(
    n => {
      this.comboImpugnacion = n.combooItems;
      this.commonServices.arregloTildesCombo(this.comboImpugnacion);
      let impug = this.comboImpugnacion.find(
        item => item.value == this.impugnacion.autoResolutorio
      );
      if(impug != undefined)
        this.impugnacionDesc = impug.label;
    },
    err => {
      console.log(err);
    }
  );
}
onChangeImpugnacion() {
  this.comboFundamentoImpug = [];
  if (this.impugnacion.autoResolutorio != undefined) {
    this.isDisabledFundamentoImpug = false;
    this.getComboFundamentoImpug();
  } else {
    this.isDisabledFundamentoImpug = true;
    this.impugnacion.sentidoAuto = "";
  }
}
getComboFundamentoImpug() {
  this.sigaServices.get("filtrosejg_comboFundamentoImpug").subscribe(
    n => {
      this.comboFundamentoImpug = n.combooItems;
      this.commonServices.arregloTildesCombo(this.comboFundamentoImpug);
      let fundImpug = this.comboFundamentoImpug.find(
        item => item.value == this.impugnacion.sentidoAuto
      );
      if(fundImpug != undefined)
        this.fundImpugnacionDesc = fundImpug.label;
    },
    err => {
      console.log(err);
    }
  );
}

abreCierraFicha() {
    this.openFicha = !this.openFicha;
}
save(){
  if(this.disabledSave()){
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
  clear() {
    this.msgs = [];
  }
  checkPermisosConfirmRest(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmRest();
    }
  }
  confirmRest(){
    let mess = this.translateService.instant(
      "messages.ReestablecerDictamen"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.rest()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  rest(){
  }
  checkPermisosSave(){
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
  disabledSave() {
    if (this.nuevo) {
      if (this.impugnacion.fechaAuto != undefined) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.permisoEscritura) {
        if (this.impugnacion.fechaAuto != undefined) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }
  fillFechaAuto(event){ 
    this.impugnacion.fechaAuto = event;
  }
  fillFechaPublicacion(event){
    this.impugnacion.fechaPublicacion = event;
  }
  onChangeCheckBis(event) {
    this.this.impugnacion.bis = event;
  }
  onChangeCheckRT(event) {
    this.impugnacion.requiereTurn = event;
  }
}
