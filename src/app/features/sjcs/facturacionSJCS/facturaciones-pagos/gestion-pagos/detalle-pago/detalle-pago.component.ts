import { Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { StringObject } from '../../../../../../models/StringObject';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Enlace } from '../gestion-pagos.component';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.scss']
})
export class DetallePagoComponent implements OnInit, OnChanges, AfterViewInit {

  progressSpinner: boolean = false;
  permisos;
  numApuntes: String = '0';
  msgs: Message[] = [];

  @Input() idPago;
  @Input() idEstadoPago;
  @Input() modoEdicion;
  @Output() addEnlace = new EventEmitter<Enlace>();

  @ViewChild("tabla") tabla;

  constructor(private commonsService: CommonsService,
    private translateService: TranslateService, private router: Router,
    private sigaService: SigaServices) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaPagosTarjetaCartasPagos).then(respuesta => {

      this.permisos = respuesta;

      if (this.permisos == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      this.progressSpinner = false;

      if (this.modoEdicion) {
        this.cargarDatosIniciales();
      }

    }).catch(error => console.error(error));

  }

  cargarDatosIniciales() {
    this.getNumApuntesPago();
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

  getNumApuntesPago() {

    this.progressSpinner = true;

    this.sigaService.getParam("pagosjcs_getNumApuntesPago", `?idPago=${this.idPago}`).subscribe(
      (data: StringObject) => {
        this.progressSpinner = false;
        this.numApuntes = data.valor;
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );

  }

  linkCartasPago() {

    if (this.idPago != undefined && this.idPago != null && this.idEstadoPago != undefined && this.idEstadoPago != null) {

      const datosCartasPago = {
        idPago: this.idPago,
        idEstadoPago: this.idEstadoPago,
        modoBusqueda: 'p'
      };

      sessionStorage.setItem("datosCartasPago", JSON.stringify(datosCartasPago));

      this.router.navigate(["/cartaFacturacionPago"]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.modoEdicion && changes.modoEdicion.currentValue && changes.modoEdicion.currentValue == true) {
      this.cargarDatosIniciales();
    }
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaPagosDetaPago',
      ref: document.getElementById('facSJCSFichaPagosDetaPago')
    };

    this.addEnlace.emit(enlace);
  }

}
