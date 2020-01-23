import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-criterios-facturacion',
  templateUrl: './criterios-facturacion.component.html',
  styleUrls: ['./criterios-facturacion.component.scss']
})
export class CriteriosFacturacionComponent implements OnInit {
  showFichaCriterios: boolean = false;
  progressSpinnerCriterios: boolean = false;
  
  selectedItem: number = 10;
  rowsPerPage: any = [];
  buscadores = [];
  
  cols;  

  @ViewChild("tabla") tabla;

  @Input() permisos;
  
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.progressSpinnerCriterios=false;
    this.getCols();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  getCols() {
    this.cols = [
      { field: "descConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.importe" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.importePendiente" },      
      { field: "descGrupo", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.grupoTurnos" }
    ];

    this.cols.forEach(it => this.buscadores.push(""));
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

  onHideDatosGenerales() {
    this.showFichaCriterios = !this.showFichaCriterios;
  }
}
