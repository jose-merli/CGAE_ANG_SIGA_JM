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
  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  impugnacion: EJGItem;
  item: EJGItem;
  msgs = [];
  [x: string]: any;
  nuevo;
  comboSentidoAuto = [];
  comboAutoRes = [];
  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonServices: CommonsService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
   // this.getComboSentidoAuto();
   // this.getComboAutoRes();
    if (this.persistenceService.getDatos()) {
      this.nuevo = false;
      this.modoEdicion = true;
      this.item = this.persistenceService.getDatos();
      this.impugnacion = this.persistenceService.getDatos();

     // this.getImpugnacion(this.item);
    } else {
    this.nuevo = true;
    this.modoEdicion = false;
    this.impugnacion = new EJGItem();
  }
}
getComboSentidoAuto() {
  this.sigaServices.get("busquedaFundamentosCalificacion_comboSentidoAuto").subscribe(
    n => {
      this.comboSentidoAuto = n.combooItems;
      this.commonServices.arregloTildesCombo(this.comboSentidoAuto);
    },
    err => {
      console.log(err);
    }
  );
}
getComboAutoRes() {
  this.sigaServices.get("busquedaFundamentosCalificacion_comboAutoRes").subscribe(
    n => {
      this.comboAutoRes = n.combooItems;
      this.commonServices.arregloTildesCombo(this.comboAutoRes);
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
  fillFechaAuto(event){
    this.imugnacion.fechaDictamenDesd = event; //ojo
  }
  fillFechaPublicacion(event){
    this.impugnacion.fechaDictamenDesd = event; //ojo
  }
}
