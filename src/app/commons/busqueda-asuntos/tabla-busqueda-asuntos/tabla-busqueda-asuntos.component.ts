import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { DataTable } from '../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../translate';
import { Router } from '../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../_services/siga.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { ProcuradoresItem } from '../../../models/sjcs/ProcuradoresItem';
import { ProcuradoresObject } from '../../../models/sjcs/ProcuradoresObject';
import { JusticiableItem } from '../../../models/sjcs/JusticiableItem';
import { CommonsService } from '../../../_services/commons.service';

@Component({
  selector: 'app-tabla-busqueda-asuntos',
  templateUrl: './tabla-busqueda-asuntos.component.html',
  styleUrls: ['./tabla-busqueda-asuntos.component.scss']
})
export class TablaBusquedaAsuntosComponent implements OnInit {

  rowsPerPage: any = [];
  cols = [];
  msgs;
  progressSpinner: boolean = false;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  permisoEscritura: boolean = true;
  datos = [];
  datosInicio: boolean = false;

  idPersona;
  showTarjetaPermiso: boolean = true;


  @ViewChild("table") table: DataTable;
  @Input() showTarjeta;
  @Input() body;
  @Input() modoEdicion;
  @Input() fromJusticiable;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService) { }

  ngOnInit() {

    // this.commonsService.checkAcceso(procesos_justiciables.tarjetaAsuntos)
    //   .then(respuesta => {

    //     this.permisoEscritura = respuesta;

    //     if (this.permisoEscritura == undefined) {
    //       this.showTarjetaPermiso = false;
    //     } else {
    //       this.showTarjetaPermiso = true;
    this.getCols();

    //     }
    //   }
    //   ).catch(error => console.error(error));

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.body != undefined) {
      this.datos = this.body;
    } else {
      this.datos = [];
    }
  }

  getCols() {

    this.cols = [
      { field: "asunto", header: "justiciaGratuita.justiciables.literal.asuntos", width: "5%" },
      { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha", width: "5%" },
      { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "10%" },
      { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "15%" },
      { field: "interesado", header: "justiciaGratuita.justiciables.literal.interesados", width: "20%" },
      { field: "datosInteres", header: "justiciaGratuita.justiciables.literal.datosInteres", width: "20%" }

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

  search(event) {
    this.persistenceService.setBody(JSON.stringify(event));
    // this.progressSpinner = true;

    // this.sigaServices.post("gestionJusticiables_searchAsuntosJusticiable", this.body.idpersona).subscribe(
    //   n => {

    //     this.datos = JSON.parse(n.body).asuntosJusticiableItems;
    //     this.progressSpinner = false;

    //   },
    //   err => {
    //     this.progressSpinner = false;
    //     console.log(err);
    //   });
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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

  openTab() {

  }
}