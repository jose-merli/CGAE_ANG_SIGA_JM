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

  progressSpinner: boolean = false;
  buscar: boolean = false;

  permisoEscritura: any;

  @ViewChild(FiltrosBusquedaAdeudosComponent) filtros;
  @ViewChild(TablaAdeudosComponent) tabla;
  
  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) {
  }

  ngOnInit() {
    this.buscar = this.filtros.buscar;
  }

  buscarFicherosAdeudos(event) {
    let filtros = JSON.parse(JSON.stringify(this.filtros.body));

    // this.sigaServices.post("filtrosejg_busquedaEJG", filtros).subscribe(
    //   n => {
    //     this.datos = JSON.parse(n.body).ejgItems;
    //     let error = JSON.parse(n.body).error;
    //     this.buscar = true;
    //     if (this.tabla != null && this.tabla != undefined) {
    //       this.tabla.historico = event;
    //       this.tabla.table.sortOrder = 0;
    //       this.tabla.table.sortField = '';
    //       this.tabla.table.reset();
    //       this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
    //     }
    //     //cadena = [];
    //     this.progressSpinner = false;
    //     if (error != null && error.description != null) {
    //       this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
    //     }
    //   },
    //   err => {
    //     this.progressSpinner = false;
    //     console.log(err);
    //   },
    //   () => {
    //     this.progressSpinner = false;
    //     setTimeout(() => {
    //       this.commonsService.scrollTablaFoco('tablaFoco');
    //       this.commonsService.scrollTop();
    //     }, 5);
    //   }
    // );
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