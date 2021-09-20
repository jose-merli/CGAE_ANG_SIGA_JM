import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CompensacionFacObject } from '../../../../../../models/sjcs/CompensacionFacObject';
import { CompensacionFacItem } from '../../../../../../models/sjcs/CompensacionFacItem';
import { ParametroItem } from '../../../../../../models/ParametroItem';

@Component({
  selector: 'app-compensacion-factura',
  templateUrl: './compensacion-factura.component.html',
  styleUrls: ['./compensacion-factura.component.scss']
})
export class CompensacionFacturaComponent implements OnInit {

  selectedItem: number = 10;
  rowsPerPage: any = [];
  buscadores = [];
  selectedDatos: CompensacionFacItem[] = [];
  numSelected = 0;
  showFicha: boolean = false;
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  selectionMode: String = "multiple";
  cols;
  msgs;
  permisos;
  compensaciones: CompensacionFacItem[] = []
  nCompensaciones: number = 0;

  @ViewChild("tabla") tabla;

  @Input() idPago;
  @Input() idEstadoPago;
  @Input() modoEdicion;
  @Input() paramDeducirCobroAutom: ParametroItem;
  @Output() facturasMarcadasEvent = new EventEmitter<CompensacionFacItem[]>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaCompFac).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.progressSpinner = false;

      this.getCols();

      if (this.modoEdicion && this.idEstadoPago == '20') {
        this.getCompensacionFacturas(this.paramDeducirCobroAutom.valor.toString());
      }

    }).catch(error => console.error(error));

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  getCols() {
    this.cols = [
      { field: "compensar", header: "facturacionSJCS.facturacionesYPagos.compensar" },
      { field: "numColegiado", header: "facturacionSJCS.facturacionesYPagos.nColegiado" },
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre" },
      { field: "fechaFactura", header: "facturacionSJCS.facturacionesYPagos.fechaFactura" },
      { field: "numeroFactura", header: "facturacionSJCS.facturacionesYPagos.numeroFactura" },
      { field: "importeTotalFactura", header: "facturacionSJCS.facturacionesYPagos.importeTotalFactura" },
      { field: "importePendienteFactura", header: "facturacionSJCS.facturacionesYPagos.importePendienteFactura" },
      { field: "importeCompensado", header: "facturacionSJCS.facturacionesYPagos.impCompensado" },
      { field: "importePagado", header: "facturacionSJCS.facturacionesYPagos.importeDelPago" }
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

  seleccionaFila() {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.compensaciones;
      this.numSelected = this.selectedDatos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onHideFicha() {

    if (!this.modoEdicion) {
      this.showFicha = false;
    } else {
      this.showFicha = !this.showFicha;
    }
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


  getCompensacionFacturas(deducirCobrosAutomatico: string) {

    this.progressSpinner = true;

    this.sigaServices.getParam("pagosjcs_getCompensacionFacturas", `?idPago=${this.idPago}`).subscribe(
      (data: CompensacionFacObject) => {

        this.progressSpinner = false;

        const error = data.error;
        const resp = data.compensaciones;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.compensaciones = resp;
          this.nCompensaciones = resp.length;

          if (deducirCobrosAutomatico == '1') {
            this.compensaciones.forEach(el => {
              el.compensar = true;
            });

            this.facturasMarcadasEvent.emit(this.compensaciones);
          }
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  marcar() {

    if (this.paramDeducirCobroAutom.valor == '0' && !this.isPagoCerrado()) {
      this.selectedDatos.forEach(el => {
        el.compensar = true;
      });
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;

      let marcadas = this.compensaciones.filter(el => el.compensar);
      this.facturasMarcadasEvent.emit(marcadas);
    }

  }

  desmarcar() {

    if (this.paramDeducirCobroAutom.valor == '0' && !this.isPagoCerrado()) {
      this.selectedDatos.forEach(el => {
        el.compensar = false;
      });
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;

      let marcadas = this.compensaciones.filter(el => el.compensar);
      this.facturasMarcadasEvent.emit(marcadas);
    }

  }

  isPagoCerrado() {
    return (this.idEstadoPago == '30');
  }

}
