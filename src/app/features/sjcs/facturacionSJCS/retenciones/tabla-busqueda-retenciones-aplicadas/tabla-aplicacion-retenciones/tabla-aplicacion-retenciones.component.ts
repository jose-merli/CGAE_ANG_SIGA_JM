import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { AplicacionRetencionItem } from "../../../../../../models/sjcs/AplicacionRetencionItem";

export interface Col {
  field: string;
  header: string;
  width: string;
}

@Component({
  selector: "app-tabla-aplicacion-retenciones",
  templateUrl: "./tabla-aplicacion-retenciones.component.html",
  styleUrls: ["./tabla-aplicacion-retenciones.component.scss"],
})
export class TablaAplicacionRetencionesComponent implements OnInit, OnChanges {
  @Input() datos: AplicacionRetencionItem[] = [];

  @ViewChild("table") tabla: Table;

  selectedItem: number = 5;
  cols: Col[] = [];
  rowsPerPage: any = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.getColsTablaApliReten();
  }

  getColsTablaApliReten() {
    this.cols = [
      { field: "nombrePago", header: "facturacionSJCS.retenciones.pagoRelacionado", width: "20%" },
      { field: "anioMes", header: "facturacionSJCS.retenciones.anioMes", width: "10%" },
      { field: "importeAntAplicaRetencion", header: "facturacionSJCS.retenciones.impAntRetener", width: "10%" },
      { field: "importeAntRetenido", header: "facturacionSJCS.retenciones.impAntRetenido", width: "10%" },
      { field: "importeSmi", header: "facturacionSJCS.retenciones.smi", width: "10%" },
      { field: "importeAplicaRetencion", header: "facturacionSJCS.retenciones.impMesRetener", width: "10%" },
      { field: "importeRetenido", header: "facturacionSJCS.retenciones.impMesRetenido", width: "10%" },
      { field: "importeTotAplicaRetencion", header: "facturacionSJCS.retenciones.impTotRetener", width: "10%" },
      { field: "importeTotRetenido", header: "facturacionSJCS.retenciones.impTotRetenido", width: "16%" },
    ];

    this.rowsPerPage = [
      {
        label: 5,
        value: 5,
      },
      {
        label: 10,
        value: 10,
      },
      {
        label: 20,
        value: 20,
      },
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.datos && changes.datos.currentValue) {
      this.selectedItem = 10;
    }
  }
}
