import { Component, OnInit, Input } from '@angular/core';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-informe-calificacion',
  templateUrl: './informe-calificacion.component.html',
  styleUrls: ['./informe-calificacion.component.scss']
})
export class InformeCalificacionComponent implements OnInit {
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaInformeCalificacion: string;

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  dictamen: EJGItem;
  item: EJGItem;
  msgs = [];
  [x: string]: any;
  nuevo;
  isDisabledFundamentosCalif: boolean = true;
  comboFundamentoCalif = [];
  comboDictamen = [];
  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonServices: CommonsService, private translateService: TranslateService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.item = this.persistenceService.getDatos();
        this.getDictamen(this.item);
      }
    } else {
      this.nuevo = true;
      this.dictamen = new EJGItem();
      this.getComboTipoDictamen();
    }
  }
  ngOnChanges(){
   
  }
  getComboFundamentoCalif() {
    this.sigaServices.getParam(
      "filtrosejg_comboFundamentoCalif",
      "?list_dictamen=" + this.dictamen.iddictamen
    ).subscribe(
      n => {
        // this.isDisabledFundamentosCalif = false;
        this.comboFundamentoCalif = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFundamentoCalif);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboDictamen = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDictamen);
        this.comboDictamen.push({ label: "Indiferente", value: "-1" });
      },
      err => {
        console.log(err);
      }
    );
  }
  getDictamen(selected) {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_getDictamen", selected).subscribe(
    n => {
      if(n.body){
        this.dictamen = JSON.parse(n.body);
      }else{this.dictamen = new EJGItem();}
      if (this.dictamen.fechaDictamen != undefined)
        this.dictamen.fechaDictamen = new Date(this.dictamen.fechaDictamen);
      this.getComboTipoDictamen();
      if(this.dictamen.iddictamen)
        this.getComboFundamentoCalif();
      this.progressSpinner = false;
      },
      err => {
       console.log(err);
      }
    );
  }
  onChangeDictamen() {
    this.comboFundamentoCalif = [];
    if (this.dictamen.iddictamen != undefined) {
      this.isDisabledFundamentosCalif = false;
      this.getComboFundamentoCalif();
    } else {
      this.isDisabledFundamentosCalif = true;
      this.dictamen.fundamentoCalif = "";
    }
  }
  fillFechaDictamen(event) {
    this.dictamen.fechaDictamenDesd = event;
  }
  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }
save(){
  if(this.disabledSave()){
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
confirmDelete() {
  let mess = this.translateService.instant(
    "messages.deleteConfirmation"
  );
  let icon = "fa fa-edit";
  this.confirmationService.confirm({
    message: mess,
    icon: icon,
    accept: () => {
      this.delete()
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
    delete(){

    }
    rest(){
      
    }
    download(){
      
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
  checkPermisosConfirmDelete(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmDelete();
    }
  }
  checkPermisosConfirmRest(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.confirmRest();
    }
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
  checkPermisosDownload(){
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.download();
    }
    }
}
