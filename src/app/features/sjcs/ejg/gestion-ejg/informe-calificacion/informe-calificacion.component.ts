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
  permisoEscritura: boolean = true;
  openFicha: boolean = true;
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
   
    if (this.persistenceService.getPermisos() != undefined)
      // this.permisoEscritura = this.persistenceService.getPermisos()
      // De momento todo disabled, funcionalidades FAC.Cuando esté todo cambiar Permisos. 
      this.permisoEscritura = false;
    if (this.modoEdicion) {
      if (this.persistenceService.getDatos()) {
        this.nuevo = false;
        this.item = this.persistenceService.getDatos();
        this.getDictamen(this.item);
      }
    } else {
      this.nuevo = true;
      this.dictamen = new EJGItem();
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
        this.dictamen = JSON.parse((n.body));
        if (this.dictamen.fechaDictamen != undefined)
          this.dictamen.fechaDictamen = new Date(this.dictamen.fechaDictamen);
        this.getComboTipoDictamen();
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
  disabledSave() {

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
}
