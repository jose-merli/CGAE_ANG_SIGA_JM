import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { EJGRemesaItem } from '../../../../models/sjcs/EJGRemesaItem';
import { RemesasItem } from '../../../../models/sjcs/RemesasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';
import { TarjetaEjgsComponent } from './tarjeta-ejgs/tarjeta-ejgs.component';

@Component({
  selector: 'app-ficha-remesas',
  templateUrl: './ficha-remesas.component.html',
  styleUrls: ['./ficha-remesas.component.scss']
})
export class FichaRemesasComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
  @ViewChild(TarjetaEjgsComponent) tarjetaEJGs: TarjetaEjgsComponent;
  progressSpinner: boolean = false;
  remesa;
  msgs;
  item;
  remesaTabla;
  remesaItem: RemesasItem = new RemesasItem();
  ejgItem;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) { }

  ngOnInit() {
    if(localStorage.getItem('ficha') == "registro"){
      this.item = localStorage.getItem('remesaItem');
      console.log("Item -> ", this.item);
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      console.log("Item en JSON -> ", this.remesaTabla);
    }else if(localStorage.getItem('ficha') == "nuevo"){
      this.remesaItem.descripcion = "";
    }
    localStorage.removeItem('ficha');
  }

  save() {
    if (this.tarjetaDatosGenerales.remesaTabla != null) {
      this.remesa = {
        'idRemesa': this.tarjetaDatosGenerales.remesaTabla[0].idRemesa,
        'descripcion': this.tarjetaDatosGenerales.remesaTabla[0].descripcion
      };
    } else if (this.tarjetaDatosGenerales.remesaItem != null) {
      this.remesa = {
        'idRemesa': 0,
        'descripcion': this.tarjetaDatosGenerales.remesaItem.descripcion,
        'numero': this.tarjetaDatosGenerales.remesaItem.numero
      };
    }

    this.progressSpinner = true;

    this.sigaServices.post("ficharemesas_guardarRemesa", this.remesa).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.remesa.idRemesa = JSON.parse(data.body).id;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      },
      () => {
        this.tarjetaDatosGenerales.listadoEstadosRemesa(this.remesa);
        this.progressSpinner = false;
      }
    );
  }

  checkPermisosDelete() {
    let msg = this.commonsService.checkPermisos(this.tarjetaEJGs.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (((!this.tarjetaEJGs.selectMultiple || !this.tarjetaEJGs.selectAll) && (this.tarjetaEJGs.selectedDatos == undefined || this.tarjetaEJGs.selectedDatos.length == 0)) || !this.tarjetaEJGs.permisos) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.confirmDelete();
      }
    }
  }

  confirmDelete() {
    console.log("Se ha pulsado el botón eliminar. Registro seleccionado -> ", this.tarjetaEJGs.selectedDatos);
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
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  selectedRow(selectedDatos) {
    if (this.tarjetaEJGs.selectedDatos == undefined) {
      this.tarjetaEJGs.selectedDatos = []
    }
    if (selectedDatos != undefined) {
      this.tarjetaEJGs.numSelected = selectedDatos.length;
      if (this.tarjetaEJGs.numSelected == 1) {
        this.tarjetaEJGs.selectMultiple = false;
      } else {
        this.tarjetaEJGs.selectMultiple = true;
      }
    }
  }

  delete() {
    let del : EJGRemesaItem[] = [];
    let ejgItem: EJGRemesaItem[] = [];
    del = this.tarjetaEJGs.selectedDatos;
    console.log("Registro seleccionado -> ", del);
    let i = 0;
    this.tarjetaEJGs.selectedDatos.forEach(element => {
      ejgItem[i] =
      {
        'identificadorEJG': (element.identificadorEJG != null && element.identificadorEJG != undefined) ? element.identificadorEJG.toString() : element.identificadorEJG,
        'idEjgRemesa': (element.idEjgRemesa != null && element.idEjgRemesa != undefined) ? element.idEjgRemesa.toString() : element.idEjgRemesa,
        'anioEJG': (element.anioEJG != null && element.anioEJG != undefined) ? element.anioEJG.toString() : element.anioEJG,
        'numeroEJG': (element.numeroEJG != null && element.numeroEJG != undefined) ? element.numeroEJG.toString() : element.numeroEJG,
        'idTipoEJG': (element.idTipoEJG != null && element.idTipoEJG != undefined) ? element.idTipoEJG.toString() : element.idTipoEJG
      };
      i++;
    });
    
    this.sigaServices.post("ficharemesa_borrarExpedientesRemesa", ejgItem).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
        this.tarjetaEJGs.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), JSON.parse(err.error).error.description);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.tarjetaEJGs.selectMultiple = false;
        this.tarjetaEJGs.selectAll = false;
        this.tarjetaEJGs.getEJGRemesa(this.tarjetaEJGs.remesaTabla[0]);
      }
    );
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
