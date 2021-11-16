import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosBusquedaAdeudosComponent } from './filtros-busqueda-adeudos/filtros-busqueda-adeudos.component';
import { TablaAdeudosComponent } from './tabla-adeudos/tabla-adeudos.component';

@Component({
  selector: 'app-ficheros-adeudoss',
  templateUrl: './ficheros-adeudos.component.html',
  styleUrls: ['./ficheros-adeudos.component.scss'],

})

export class FicherosAdeudosComponent implements OnInit {

  datos;
  msgs;
  filtro;

  progressSpinner: boolean = false;
  buscar: boolean = false;
  permisoEscritura: boolean = false;

  @ViewChild(FiltrosBusquedaAdeudosComponent) filtros;
  @ViewChild(TablaAdeudosComponent) tabla;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) {
  }

  ngOnInit() {
    this.buscar = false;
    this.permisoEscritura=true //cambiar cuando se implemente los permisos
  }

  buscarFicherosAdeudos(event) {
    this.filtro = JSON.parse(JSON.stringify(this.filtros.body));

    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_getFicherosAdeudos", this.filtro).subscribe(
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