import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacion';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-conceptos-pagos',
  templateUrl: './conceptos-pagos.component.html',
  styleUrls: ['./conceptos-pagos.component.scss']
})
export class ConceptosPagosComponent implements OnInit {
  showFichaCriterios: boolean = false;
  progressSpinnerCriterios: boolean = false;

  selectedItem: number = 10;
  rowsPerPage: any = [];
  buscadores = [];

  cols;
  msgs;
  permisos;

  @ViewChild("tabla") tabla;

  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaConPagos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.progressSpinnerCriterios = false;
      this.getCols();

    }).catch(error => console.error(error));

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
