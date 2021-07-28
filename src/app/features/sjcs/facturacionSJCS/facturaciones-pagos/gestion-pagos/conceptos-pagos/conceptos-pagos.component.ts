import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { ComboItem } from '../../../../../../models/ComboItem';
import { Error } from "../../../../../../models/Error";
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
  conceptos: ConceptoPagoItem[] = [];
  comboConceptos: ComboItem[] = [];
  body: ConceptoPagoItem[];
  bodyAux: ConceptoPagoItem[];
  disableNuevo: boolean = false;
  selectionMode = 'multiple';
  selectedDatos: ConceptoPagoItem[] = [];
  numConceptos: number;

  @Input() idEstadoPago;
  @Input() idPago;
  @Input() idFacturacion;

  @Output() editing = new EventEmitter<boolean>();

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
        this.getComboConceptos();
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
      { field: "porcentajeApagar", header: "facturacionSJCS.facturacionesYPagos.porcentaje" },
      { field: "cantidadApagar", header: "facturacionSJCS.facturacionesYPagos.cantidad" },
      { field: "cantidadRestante", header: "facturacionSJCS.facturacionesYPagos.restante" }
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

  seleccionaFila(event) {

    if (event.data.nuevo) {
      this.selectedDatos.pop();
    }

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
        const error: Error = resp.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.body = [];
          this.bodyAux = [];

          resp.listaConceptos.forEach(el => {

            el.nuevo = false;
            el.cantidadRestante = el.importePendiente;
            el.porcentajeRestante = el.porcentajePendiente;

            // eliminamos los conceptos que ya estén del combo

            let indice = this.comboConceptos.findIndex(c => c.value == el.idConcepto);

            if (indice != -1) {
              this.comboConceptos.splice(indice, 1);
            }

          });

          this.comboConceptos.length == 0 ? this.disableNuevo = true : this.disableNuevo = false;

          this.body = JSON.parse(JSON.stringify(resp.listaConceptos));
          this.bodyAux = JSON.parse(JSON.stringify(resp.listaConceptos));
          this.numConceptos = this.body.length;
        }
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  comprobaciones(nuevos: ConceptoPagoItem[]) {

    let valido = true;

    nuevos.forEach(el => {
      if (el.idConcepto == undefined || el.idConcepto == null || el.idConcepto.trim().length == 0) {
        valido = false;
      }
    });

    if (!valido) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }

    return valido;

  }

  guardar() {

    if (!this.disabledGuardar()) {

      let nuevos = this.body.filter(el => el.nuevo);

      if (this.comprobaciones(nuevos)) {

        this.progressSpinner = true;

        this.sigaService.post("pagosjcs_saveConceptoPago", nuevos).subscribe(
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
          },
          () => {
            this.getComboConceptos();
          }
        );

      }

    }

  }

  eliminar() {

    if (!this.disabledEliminar()) {
      this.progressSpinner = true;

      this.sigaService.post("pagosjcs_deleteConceptoPago", this.selectedDatos).subscribe(
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
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        },
        () => {
          this.getComboConceptos();
          this.selectedDatos = [];
        }
      );
    }

  }

  nuevo() {

    if (!this.disabledNuevo()) {

      let concepto: ConceptoPagoItem = new ConceptoPagoItem();
      concepto.idPagosjg = this.idPago;
      concepto.idFacturacion = this.idFacturacion;
      concepto.porcentajeApagar = "0.00";
      concepto.cantidadApagar = 0.00;
      concepto.nuevo = true;

      if (this.body.length == 0) {
        this.body.push(concepto);
      } else {
        this.body = [concepto, ...this.body];
      }

    }

  }

  restablecer() {
    if (!this.disabledRestablecer()) {
      this.body = JSON.parse(JSON.stringify(this.bodyAux));
    }
  }

  disabledRestablecer() {

    let disable = (JSON.stringify(this.body) == JSON.stringify(this.bodyAux)) || this.isPagoCerradoOejecutado();

    if (!disable) {
      this.editing.emit(true);
    } else {
      this.editing.emit(false);
    }

    return disable;
  }

  disabledGuardar() {
    return (JSON.stringify(this.body) == JSON.stringify(this.bodyAux)) || this.isPagoCerradoOejecutado();
  }

  disabledNuevo() {
    return this.disableNuevo || this.isPagoCerradoOejecutado();
  }

  disabledEliminar() {
    return (this.selectedDatos.length == 0) || this.isPagoCerradoOejecutado();
  }

  getComboConceptos() {

    this.conceptos = [];

    this.progressSpinner = true;

    this.sigaService.getParam("pagosjcs_comboConceptoPago", `?idFacturacion=${this.idFacturacion}&idPago=${this.idPago}`).subscribe(
      (data: ConceptoPagoObject) => {
        this.progressSpinner = false;

        const resp: ConceptoPagoItem[] = data.listaConceptos;
        const error: Error = data.error;

        if (error && null != error && null != error.description) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(error.description.toString()));
        } else {
          this.conceptos = resp;
          this.transformaAcomboConceptos();
          this.commonsService.arregloTildesCombo(this.comboConceptos);
          this.cargaDatos();
        }

      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  transformaAcomboConceptos() {

    this.comboConceptos = [];

    this.conceptos.forEach(el => {

      if (this.comboConceptos.find(el2 => el2.value == el.idConcepto) == undefined) {

        this.comboConceptos.push({
          label: el.desConcepto,
          value: el.idConcepto,
          local: ""
        });

      }

    });
  }

  changePorcentajeApagar(cantidad, dato: ConceptoPagoItem) {

    if (cantidad.trim().length > 0 && !isNaN(cantidad) && parseFloat(cantidad) >= 0) {
      const porcentaje = cantidad * 100 / dato.importeFacturado;

      if (porcentaje > dato.porcentajePendiente) {
        dato.porcentajeApagar = 0.00;
        dato.cantidadApagar = 0.00;
      } else {
        dato.porcentajeApagar = porcentaje.toFixed(2);
      }


    } else {
      dato.porcentajeApagar = 0.00;
      dato.cantidadApagar = 0.00;
    }

    dato.cantidadRestante = dato.importePendiente - dato.cantidadApagar;
    dato.porcentajeRestante = (dato.cantidadRestante * 100 / dato.importeFacturado).toFixed(2);

  }

  modificaPorcentaje(porcentaje: number, dato: ConceptoPagoItem) {

    if (porcentaje != undefined && porcentaje != null) {

      if (porcentaje > 100 || porcentaje < 0) {
        dato.porcentajeApagar = Number.parseFloat("0").toFixed(2);
      } else {
        dato.porcentajeApagar = porcentaje.toFixed(2);
      }

    } else {
      dato.porcentajeApagar = Number.parseFloat("0").toFixed(2);
    }

    this.changeCantidadApagar(dato);
  }

  changeCantidadApagar(dato) {

    let porcentaje = parseFloat(dato.porcentajeApagar);
    let cantidad = porcentaje * dato.importeFacturado / 100;

    if (cantidad > dato.importePendiente) {
      dato.cantidadApagar = 0.00;
    } else {
      dato.cantidadApagar = cantidad.toFixed(2);
    }

    dato.cantidadRestante = dato.importePendiente - dato.cantidadApagar;
    dato.porcentajeRestante = (dato.cantidadRestante * 100 / dato.importeFacturado).toFixed(2);

  }

  cambioConcepto(event, dato) {

    let valor = event.value;

    if (null != valor) {
      let concepto = this.conceptos.find(el => el.idConcepto == valor);
      dato.importeFacturado = concepto.importeFacturado;
      dato.importePendiente = concepto.importePendiente;
      dato.porcentajePendiente = concepto.porcentajePendiente;
      dato.cantidadRestante = concepto.importePendiente;
      dato.porcentajeRestante = concepto.porcentajePendiente;
    } else {
      dato.importeFacturado = null;
      dato.importePendiente = null;
      dato.porcentajePendiente = null;
      dato.cantidadRestante = null;
      dato.porcentajeRestante = null;
    }

  }

  isPagoCerradoOejecutado() {
    return (this.idEstadoPago == '30' || this.idEstadoPago == '20');
  }

}
