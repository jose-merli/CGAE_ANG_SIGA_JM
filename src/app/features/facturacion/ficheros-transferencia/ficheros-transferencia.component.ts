import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosBusquedaTransferenciasComponent } from './filtros-busqueda-transferencias/filtros-busqueda-transferencias.component';
import { TablaFicherosTransferenciasComponent } from './tabla-ficheros-transferencias/tabla-ficheros-transferencias.component';


@Component({
  selector: 'app-ficheros-transferencia',
  templateUrl: './ficheros-transferencia.component.html',
  styleUrls: ['./ficheros-transferencia.component.scss'],

})
export class FicherosTransferenciaComponent implements OnInit {
  datos;
  msgs;
  filtro;

  progressSpinner: boolean = false;
  buscar: boolean = false;
  permisoEscritura: boolean = false;

  @ViewChild(FiltrosBusquedaTransferenciasComponent) filtros;
  @ViewChild(TablaFicherosTransferenciasComponent) tabla;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService) {
  }

  ngOnInit() {
    this.buscar = false;
    this.permisoEscritura=true //cambiar cuando se implemente los permisos
  }

  buscarFicheros(event) {
    this.filtro = JSON.parse(JSON.stringify(this.filtros.body));

    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_getFicherosTransferencias", this.filtro).subscribe(
      n => {
        this.progressSpinner = false;

        this.datos = JSON.parse(n.body).ficherosAdeudosItems;
        this.buscar = true;
        let error = JSON.parse(n.body).error;

        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        //comprobamos el mensaje de info de resultados
        if (error!=undefined && error!=null) {
          this.showMessage("info",this.translateService.instant("general.message.informacion"), this.translateService.instant(error.message));
        }

        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
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