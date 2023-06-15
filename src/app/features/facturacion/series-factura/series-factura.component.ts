import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosSeriesFacturaComponent } from './filtros-series-factura/filtros-series-factura.component';
import { TablaSeriesFacturaComponent } from './tabla-series-factura/tabla-series-factura.component';


@Component({
  selector: 'app-series-factura',
  templateUrl: './series-factura.component.html',
  styleUrls: ['./series-factura.component.scss'],

})
export class SeriesFacturaComponent implements OnInit {

  url;
  datos;
  msgs;

  progressSpinner: boolean = false;
  buscar: boolean = false; 

  permisoEscritura: boolean;

  @ViewChild(FiltrosSeriesFacturaComponent) filtros;
  @ViewChild(TablaSeriesFacturaComponent) tabla;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService
    //public sigaServices: OldSigaServices
    ) {
    // this.url = sigaServices.getOldSigaUrl("seriesFactura");
  }

  ngOnInit() {
    //this.buscar = this.filtros.buscar; // cambiar
    this.permisoEscritura = true; // Es necesario comprobar permisos

    this.persistenceService.setPermisos(this.permisoEscritura);
  }

  searchSeriesFacturas(): void {
    let filtros = JSON.parse(JSON.stringify(this.filtros.body));
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_getSeriesFacturacion", filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).serieFacturacionItems;

        // Ordenamos los tipos incluidos por orden alfabético
        this.datos.forEach(element => {
          if (element.tiposIncluidos != undefined) {
            element.tiposIncluidos.sort((a, b) => a < b ? -1 : 1);
          }
        });

        let error = JSON.parse(n.body).error;

        this.buscar = true;
        
        if (this.tabla != undefined) {
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }
        
        this.progressSpinner = false;
        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);
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

  clear() {
    this.msgs = [];
  }

}
