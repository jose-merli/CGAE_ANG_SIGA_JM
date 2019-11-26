import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { JusticiableObject } from '../../../../../models/sjcs/JusticiableObject';
import { DataTable } from 'primeng/primeng';
import { Router } from '@angular/router';
import { JusticiableBusquedaObject } from '../../../../../models/sjcs/JusticiableBusquedaObject';

@Component({
  selector: 'app-tabla-justiciables',
  templateUrl: './tabla-justiciables.component.html',
  styleUrls: ['./tabla-justiciables.component.scss']
})
export class TablaJusticiablesComponent implements OnInit {

  rowsPerPage: any = [];
  cols;
  msgs;

  selectedItem: number = 10;
  selectedDatos = [];
  numSelected = 0;
  historico: boolean = false;

  initDatos;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = false;

  //Resultados de la busqueda
  @Input() datos;
  @Input() modoRepresentante;

  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

  }


  openTab(evento) {

    if (!this.modoRepresentante) {
      this.persistenceService.clearDatos();
      this.persistenceService.setDatos(evento);
      this.persistenceService.clearBody();
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      this.persistenceService.clearBody();
      this.persistenceService.setBody(evento);
      this.router.navigate(["/gestionJusticiables"]);
    }

  }

  getCols() {

    this.cols = [
      { field: "nif", header: "censo.fichaCliente.literal.identificacion", width: "10%" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
      { field: "fechaModificacion", header: "censo.datosDireccion.literal.fechaModificacion", width: "10%" },
      { field: "asuntos", header: "justiciaGratuita.justiciables.literal.asuntos", width: "30%" },
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
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
