import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';
import { CommonsService } from '../../_services/commons.service';
import { PersistenceService } from '../../_services/persistence.service';
import { SigaServices } from '../../_services/siga.service';
import { TranslateService } from '../../commons/translate';
import { FiltrosGeneralSJCSComponent } from './filtros-generalSJCS/filtros-generalSJCS.component';
import { TablaGeneralSJCSComponent } from './tabla-generalSJCS/tabla-generalSJCS.component';

@Component({
  selector: 'app-busqueda-generalSJCS',
  templateUrl: './busqueda-generalSJCS.component.html',
  styleUrls: ['./busqueda-generalSJCS.component.scss']
})
export class BusquedaGeneralSJCSComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;
  institucionActual: any;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosGeneralSJCSComponent) filtros;
  @ViewChild(TablaGeneralSJCSComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router,
    private location: Location) { }


  ngOnInit() {
  }


  isOpenReceive(event) {
    this.search(event);
  }


  backTo() {
    this.location.back();
  }

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("componenteGeneralJG_busquedaGeneralSJCS", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).colegiadosSJCSItem;
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      });
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
    }
  }
  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }
  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
  }

}
