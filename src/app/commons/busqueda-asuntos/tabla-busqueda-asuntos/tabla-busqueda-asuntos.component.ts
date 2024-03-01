import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DataTable } from '../../../../../node_modules/primeng/primeng';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { AsuntosJusticiableItem } from '../../../models/sjcs/AsuntosJusticiableItem';


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
  selectedDatos:any[] = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
 
  permisoEscritura: boolean = true;
  datosInicio: boolean = false;
  datos = [];
  idPersona;
  showTarjetaPermiso: boolean = true;

  @ViewChild("table") table: DataTable;
  @Input() showTarjeta;
  @Input() body;
  @Input() modoEdicion;
  @Input() radioTarjeta;
  @Input() fromJusticiable;
  @Input() data: AsuntosJusticiableItem = null;
  @Output() elementoAsociado = new EventEmitter<String[]>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private persistenceService: PersistenceService, private location: Location, private sigaServices: SigaServices) { }

  ngOnInit() {
    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.body != undefined) {
      this.datos = this.body;
    } else {
      this.datos = [];
    }
  }

  getCols() {
    if(this.radioTarjeta=='ejg' || this.radioTarjeta=='asi'){
      this.cols =  [
        { field: "anio", header: "justiciaGratuita.sjcs.designas.DatosIden.ano", width: "10%" },
        { field: "numero", header: "gratuita.busquedaAsistencias.literal.numero", width: "10%" },
        { field: "dilnigproc", header: 'justiciaGratuita.ejg.busquedaAsuntos.diliNumProc', width: "25%"},
        { field: "juzgado", header: "justiciaGratuita.ejg.datosGenerales.Juzgado", width: "20%" },
        { field: "tipo", header: "censo.nuevaSolicitud.tipoSolicitud", width: "20%" },
        { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "25%" },
        { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
      ];
    }

    if(this.radioTarjeta=='des'){
      this.cols =  [
        { field: "anio", header: "justiciaGratuita.sjcs.designas.DatosIden.ano", width: "10%" },
        { field: "numero", header: "gratuita.busquedaAsistencias.literal.numero", width: "10%" },
        { field: "dilnigproc", header: 'justiciaGratuita.ejg.busquedaAsuntos.nigNumProc', width: "25%"},
        { field: "juzgado", header: "justiciaGratuita.ejg.datosGenerales.Juzgado", width: "20%" },
        { field: "tipo", header: "censo.nuevaSolicitud.tipoSolicitud", width: "20%" },
        { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "25%" },
        { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
      ];
    }

    if(this.radioTarjeta=='soj'){
      this.cols =  [
        { field: "anio", header: "justiciaGratuita.sjcs.designas.DatosIden.ano", width: "10%" },
        { field: "numero", header: "gratuita.busquedaAsistencias.literal.numero", width: "10%" },
        // { field: "dilnigproc", header: "sjcs.oficio.designaciones.relaciones.numDiligNigNproc", width: "25%"},
        { field: "juzgado", header: "justiciaGratuita.ejg.datosGenerales.Juzgado", width: "20%" },
        { field: "tipo", header: "censo.nuevaSolicitud.tipoSolicitud", width: "20%" },
        { field: "turnoGuardia", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "25%" },
        { field: "letrado", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
      ];
    }

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
    //     //console.log(err);
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

  openTab(event) {
     this.elementoAsociado.emit(event.data);
  }
}