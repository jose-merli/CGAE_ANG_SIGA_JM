import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Router } from '@angular/router';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Enlace } from '../gestion-facturacion.component'

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit, AfterViewInit {
  progressSpinnerPagos: boolean = false;
  cols;
  msgs;
  rowsPerPage: any = [];
  buscadores = [];
  body = [];
  selectedItem: number = 10;
  showFichaPagos: boolean = false;
  numPagos: number = 0;
  importePagado: number;
  disableNuevo: boolean = false;

  permisos;

  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;

  @Output() addEnlace = new EventEmitter<Enlace>();

  @ViewChild("tabla") tabla;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaService: SigaServices, private router: Router, private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {

    this.progressSpinnerPagos = false;

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaFacTarjetaPagos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.getFacEnableBotonNuevo();
      this.cargaDatos();
      this.getCols();

    }).catch(error => console.error(error));

  }

  getFacEnableBotonNuevo() {
    this.sigaService.get("combo_comboFacturaciones").subscribe(
      data => {
        const facturaciones = data.combooItems;
        this.commonsService.arregloTildesCombo(facturaciones);
        const arrayFac = facturaciones.map(el => el.value);
        if(this.idFacturacion != undefined && !arrayFac.includes(this.idFacturacion)) {
          this.disableNuevo = true;
        }
      },
      err => {
        if (null != err.error) {
          console.log(err.error);
        }
      });
  }

  cargaDatos() {
    if (undefined != this.idFacturacion) {
      this.progressSpinnerPagos = true;

      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_datospagos", "?idFacturacion=" + this.idFacturacion).subscribe(
        data => {
          this.progressSpinnerPagos = false;

          let importePagado = 0;

          if (undefined != data.pagosjgItem && data.pagosjgItem.length > 0) {
            let datos = data.pagosjgItem;

            datos.forEach(el => {

              let importeHito = el[this.getImporteHito(el.idHitoGeneral)];
              importePagado += parseFloat(importeHito);

            });

            this.body = JSON.parse(JSON.stringify(datos));
            this.numPagos = datos.length;
            this.importePagado = importePagado;
          }
        },
        err => {
          console.log(err);
          this.progressSpinnerPagos = false;
        }
      );
    }
  }

  nuevo() {
    this.router.navigate(['/fichaPagos'], {
      queryParams: { 'idFacturacion': this.idFacturacion }
    });
  }

  disabledNuevo() {
    return  this.disableNuevo;
  }

  onHideDatosGenerales() {

    if (this.modoEdicion) {
      this.showFichaPagos = !this.showFichaPagos;
    }

  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  seleccionaFila(evento) {
    console.debug(evento.data.nombre);
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

  getImporteHito(idHito: string): string {

    let importe = '';

    switch (idHito) {
      case '10':
        importe = 'importeOficio';
        break;
      case '20':
        importe = 'importeGuardia';
        break;
      case '30':
        importe = 'importesOJ';
        break;
      case '40':
        importe = 'importeEJG';
        break;
      default:
        importe = 'importePagado';
    }

    return importe;
  }

  getCols() {
    this.cols = [
      { field: "nombre", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.nombre", width: "30%" },
      { field: "desConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos", width: "25%" },
      { field: "porcentaje", header: "facturacionSJCS.facturacionesYPagos.porcentaje", width: "10%" },
      { field: "importePagado", header: "facturacionSJCS.facturacionesYPagos.cantidad", width: "10%" },
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "15%" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "10%" }
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

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaFactPagosFac',
      ref: document.getElementById('facSJCSFichaFactPagosFac')
    };

    this.addEnlace.emit(enlace);
  }
}
