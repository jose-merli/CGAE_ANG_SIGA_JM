import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../commons/translate';
import { Router } from '../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../_services/siga.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { Identifiers } from '../../../../../node_modules/@angular/compiler';
import { Location } from "@angular/common";



@Component({
  selector: 'app-tabla-generalSJCS',
  templateUrl: './tabla-generalSJCS.component.html',
  styleUrls: ['./tabla-generalSJCS.component.scss']
})
export class TablaGeneralSJCSComponent implements OnInit {


  rowsPerPage: any = [];
  cols;
  msgs;
  @Input() institucionActual;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  message;

  initDatos;
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos;

  @ViewChild("table") table: DataTable;

  @Output() searchHistoricalSend = new EventEmitter<boolean>();


  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));
  }

  backWithData(evento) {

    this.persistenceService.setDatosBusquedaGeneralSJCS(evento.data);
    this.location.back();

  }

  getCols() {

    this.cols = [
      { field: "abreviatura", header: "censo.busquedaClientesAvanzada.literal.colegio" },
      { field: "nColegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado" },
      { field: "descripcion", header: "menu.justiciaGratuita.componentes.estadoColegial" },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      { field: "nombre", header: "administracion.parametrosGenerales.literal.nombre" },
      { field: "inscritoturno", header: "gratuita.busquedaSJCS.tipoFiltro.inscritosTurno" },
      { field: "inscritoguardia", header: "gratuita.busquedaSJCS.tipoFiltro.inscritosGuardia" },
      { field: "guardiasPendientes", header: "gratuita.busquedaSJCS.literal.guardiasPendientes" },
      { field: "telefono", header: "censo.ws.literal.telefono" },

      // { field: "residencia", header: "censo.datosDireccion.literal.provincia" }

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
    this.seleccion = false;
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
