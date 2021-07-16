import { Component, OnInit, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { ConceptoPagoItem } from '../../../../../../models/sjcs/ConceptoPagoItem';
import { ConceptoPagoObject } from '../../../../../../models/sjcs/ConceptoPagoObject';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-conceptos-pagos',
  templateUrl: './conceptos-pagos.component.html',
  styleUrls: ['./conceptos-pagos.component.scss']
})
export class ConceptosPagosComponent implements OnInit {

  showFichaCriterios: boolean = false;
  progressSpinner: boolean = false;
  selectedItem: number = 10;
  rowsPerPage: any = [];
  buscadores = [];
  cols;
  msgs;
  permisos;
  body: ConceptoPagoItem[];
  bodyAux: ConceptoPagoItem[];

  @Input() idEstadoPago;
  @Input() idPago;
  @Input() idFacturacion;

  @ViewChild("tabla") tabla;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaService: SigaServices) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaConPagos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.progressSpinner = false;
      this.getCols();

      if (undefined != this.idPago && null != this.idPago) {
        this.cargaDatos();
      }

    }).catch(error => console.error(error));

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  getCols() {
    this.cols = [
      { field: "desConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
      { field: "importeFacturado", header: "facturacionSJCS.facturacionesYPagos.totalFacturado" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente" },
      { field: "porcentajeApagar", header: "facturacionSJCS.facturacionesYPagos.aPagarPorcentaje" },
      { field: "cantidadApagar", header: "facturacionSJCS.facturacionesYPagos.aPagarCantidad" }
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

  cargaDatos() {

    this.progressSpinner = true;

    this.sigaService.getParam("pagosjcs_getConceptosPago", `?idPago=${this.idPago}&idFacturacion=${this.idFacturacion}`).subscribe(
      data => {

        this.progressSpinner = false;

        const resp: ConceptoPagoObject = data;
        const error = resp.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.body = [];
          this.bodyAux = [];
          resp.listaConceptos.forEach(el => {
            if (el.porcentajeApagar == null) {
              el.porcentajeApagar = "0.00";
            }
          });
          this.body = resp.listaConceptos;
          this.bodyAux = resp.listaConceptos;
        }
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  guardar() {

    if (!this.disabledGuardar()) {

      this.progressSpinner = true;

      this.sigaService.post("pagosjcs_saveConceptoPago", this.body).subscribe(
        data => {

          this.progressSpinner = false;

          const resp = JSON.parse(data.body);
          const error = resp.error;

          if (error && null != error && null != error.description) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
          } else {
            console.log(resp);
          }

        },
        err => {
          this.progressSpinner = false
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      );

    }

  }

  restablecer() {

  }

  disabledRestablecer() {
    return JSON.stringify(this.body) == JSON.stringify(this.bodyAux);
  }

  disabledGuardar() {
    return JSON.stringify(this.body) == JSON.stringify(this.bodyAux);
  }

  modificaPorcentaje(porcentaje: Number, dato) {

    if (porcentaje != undefined && porcentaje != null) {

      if (porcentaje > 100 || porcentaje < 0) {
        dato.porcentajeApagar = Number.parseFloat("0").toFixed(2);
      } else {
        dato.porcentajeApagar = porcentaje.toFixed(2);
      }

    }
  }

}
