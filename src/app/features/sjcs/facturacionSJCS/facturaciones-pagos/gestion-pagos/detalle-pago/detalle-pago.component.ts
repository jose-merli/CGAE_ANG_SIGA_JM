import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { StringObject } from '../../../../../../models/StringObject';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-pago',
  templateUrl: './detalle-pago.component.html',
  styleUrls: ['./detalle-pago.component.scss']
})
export class DetallePagoComponent implements OnInit {

  progressSpinner: boolean = false;
  permisos;
  numApuntes: String = '0';
  msgs: Message[] = [];

  @Input() idPago;
  @Input() idEstadoPago;

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
      this.getNumApuntesPago();

    }).catch(error => console.error(error));

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

}
