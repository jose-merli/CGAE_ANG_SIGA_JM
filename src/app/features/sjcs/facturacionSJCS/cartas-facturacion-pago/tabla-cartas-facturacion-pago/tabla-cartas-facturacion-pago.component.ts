import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Table } from '../../../../../../../node_modules/primeng/table';

@Component({
  selector: 'app-tabla-cartas-facturacion-pago',
  templateUrl: './tabla-cartas-facturacion-pago.component.html',
  styleUrls: ['./tabla-cartas-facturacion-pago.component.scss']
})
export class TablaCartasFacturacionPagoComponent implements OnInit {

  msgs = [];
  rowsPerPage: any = [];
  cols;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;

  progressSpinner: boolean = false;

  @ViewChild("table") tabla: Table;
  @Input() datos = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.getCols();
  }

  clear() {
    this.msgs = [];
  }

  getCols() {
    this.cols = [
      { field: "ncolegiado", header: "censo.resultadosSolicitudesModificacion.literal.nColegiado", width: "10%" },
      { field: "nombreCol", header: "justiciaGratuita.justiciables.literal.colegiado", width: "20%" },
      { field: "nombreFac", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.facturacion", width: "20%" },
      { field: "importeOficio", header: "menu.justiciaGratuita.Turnos", width: "10%" },
      { field: "importeGuardia", header: "menu.justiciaGratuita.guardia.guardias", width: "10%" },
      { field: "importeEjg", header: "justiciaGratuita.ejg.datosGenerales.EJG", width: "10%" },
      { field: "importeSoj", header: "censo.busquedaClientes.noResidente", width: "10%" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.total", width: "10%" }

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
    this.tabla.reset();
  }


}
