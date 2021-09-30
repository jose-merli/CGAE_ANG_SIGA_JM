import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { EJGRemesaItem } from '../../../../models/sjcs/EJGRemesaItem';
import { RemesasItem } from '../../../../models/sjcs/RemesasItem';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaDatosGeneralesComponent } from './tarjeta-datos-generales/tarjeta-datos-generales.component';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TarjetaEjgsComponent } from './tarjeta-ejgs/tarjeta-ejgs.component';
import { RemesasBusquedaItem } from '../../../../models/sjcs/RemesasBusquedaItem';
import { declaredViewContainer } from '@angular/core/src/view/util';
import { Button } from 'selenium-webdriver';

@Component({
  selector: 'app-ficha-remesas',
  templateUrl: './ficha-remesas.component.html',
  styleUrls: ['./ficha-remesas.component.scss']
})
export class FichaRemesasComponent implements OnInit {

  @ViewChild(TarjetaDatosGeneralesComponent) tarjetaDatosGenerales: TarjetaDatosGeneralesComponent;
  @ViewChild(TarjetaEjgsComponent) tarjetaEJGs: TarjetaEjgsComponent;
  botonValidar: boolean = false;
  guardado: boolean = false;
  progressSpinner: boolean = false;
  msgs;
  item;
  remesaTabla;
  remesaItem: RemesasItem = new RemesasItem();
  ejgItem;
  tipoPCAJG;
  remesa: { idRemesa: any; descripcion: string; numero: number; };
  checkAccionesRemesas;
  acciones: boolean = false;

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.botonValidar = false;

    if (localStorage.getItem('ficha') == "registro") {
      this.item = localStorage.getItem('remesaItem');
      console.log("Item -> ", this.item);
      localStorage.removeItem('remesaItem');
      this.remesaTabla = JSON.parse(this.item);
      console.log("Item en JSON -> ", this.remesaTabla);
      this.guardado = true;
      this.checkAcciones();
    } else if (localStorage.getItem('ficha') == "nuevo") {
      this.remesaItem.descripcion = "";
    }
    localStorage.removeItem('ficha');

    this.remesa = {
      'idRemesa': 0,
      'descripcion': "",
      'numero': 0
    }
  }

  checkAcciones() {
    console.log("Dentro del checkAcciones --> ", this.tarjetaDatosGenerales);
    let remesaCheckAcciones;

    if (this.remesaTabla != null) {
      remesaCheckAcciones =
      {
        'estado': (this.remesaTabla.estado != null && this.remesaTabla.estado != undefined) ? this.remesaTabla.estado.toString() : this.remesaTabla.estado,
      };
    }else if(this.remesaItem != null){
      remesaCheckAcciones =
      {
        'estado': (this.tarjetaDatosGenerales.resultado[0].estado != null && this.tarjetaDatosGenerales.resultado[0].estado != undefined) ? this.tarjetaDatosGenerales.resultado[0].estado.toString() : this.tarjetaDatosGenerales.resultado[0].estado,
      };
    }

    this.sigaServices
      .post("ficharemesas_checkAcciones", remesaCheckAcciones)
      .subscribe(
        n => {
          console.log("Dentro de la respuesta. Contenido --> ", JSON.parse(n.body).checkAccionesRemesas);

          this.checkAccionesRemesas = JSON.parse(n.body).checkAccionesRemesas;
          
          if(this.checkAccionesRemesas.length == 0){
            this.acciones = false;
          }else{
            this.acciones = true
          }
        },
        error => {},
        () => { }
      );
      
  }

  save() {
    if (this.tarjetaDatosGenerales.remesaTabla != null) {
      this.remesa = {
        'idRemesa': this.tarjetaDatosGenerales.remesaTabla[0].idRemesa,
        'descripcion': this.tarjetaDatosGenerales.remesaTabla[0].descripcion,
        'numero':this.tarjetaDatosGenerales.remesaTabla[0].numero
      };
    } else if (this.tarjetaDatosGenerales.remesaItem != null) {
      this.remesa = {
        'idRemesa': (this.remesa.idRemesa != null && this.remesa.idRemesa != undefined) ? this.remesa.idRemesa.toString() : 0,
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
        this.tarjetaDatosGenerales.listadoEstadosRemesa(this.remesa, true);
        this.progressSpinner = false;
        this.guardado = true;
      }
    );
  }

  checkPermisosDelete(evento) {
    let msg = this.commonsService.checkPermisos(this.tarjetaEJGs.permisos, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (((!this.tarjetaEJGs.selectMultiple || !this.tarjetaEJGs.selectAll) && (this.tarjetaEJGs.selectedDatos == undefined || this.tarjetaEJGs.selectedDatos.length == 0)) || !this.tarjetaEJGs.permisos) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.confirmDelete(evento);
      }
    }
  }

  confirmDelete(evento) {
    console.log("Se ha pulsado el botón eliminar. Registro seleccionado -> ", this.tarjetaEJGs.selectedDatos);
    let mess = this.translateService.instant(
      "messages.deleteConfirmation"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        if (evento) {
          this.deleteRemesa();
        } else {
          this.deleteExpediente();
        }

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

  deleteRemesa() {
    let del: RemesasItem[] = [];
    console.log("Remesa -> ", del);
    if (this.remesaTabla != null) {
      del[0] =
      { 
        'idRemesa': (this.remesaTabla.idRemesa != null && this.remesaTabla.idRemesa != undefined) ? this.remesaTabla.idRemesa.toString() : this.remesaTabla.idRemesa,
        'descripcion': (this.remesaTabla.descripcion != null && this.remesaTabla.descripcion != undefined) ? this.remesaTabla.descripcion.toString() : this.remesaTabla.descripcion,
        'ficha': true
      };
    } else if (this.remesaItem != null) {
      del[0] =
      {
        'idRemesa': (this.remesa.idRemesa != null && this.remesa.idRemesa != undefined) ? this.remesa.idRemesa : this.remesa.idRemesa,
        'descripcion': (this.remesaItem.descripcion != null && this.remesaItem.descripcion != undefined) ? this.remesaItem.descripcion.toString() : this.remesaItem.descripcion,
        'ficha': true
      };
    }

    this.sigaServices.post("listadoremesas_borrarRemesa", del).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), JSON.parse(data.body).error.description);
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
        this.router.navigate(["/remesas"]);
      }
    );
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

  deleteExpediente() {
    let ejgItem: EJGRemesaItem[] = [];
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

    this.sigaServices.post("ficharemesas_borrarExpedientesRemesa", ejgItem).subscribe(
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

  openTab() {
    this.router.navigate(["/ejg"]);
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
