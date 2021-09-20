import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-solicitud-compra-suscripcion',
  templateUrl: './tarjeta-solicitud-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-solicitud-compra-suscripcion.component.scss']
})
export class TarjetaSolicitudCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  @Input("ficha") ficha : FichaCompraSuscripcionItem; 

  cols = [
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha"},
    { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"},
  ];

  filas: any[] = null;

  progressSpinner : boolean = false;
  showTarjeta: boolean = false;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService,) { }

  ngOnInit() {
    this.processDatos();
  }

  getNSolicitud(){
    this.sigaServices.get('getNSolicitud').subscribe(
      n => {
        this.ficha.nSolicitud = n;
      }
    )
  }

  processDatos(){
    this.filas = [];
    if(this.ficha.fechaSolicitud!=null){
      let fila = [{ fecha: this.ficha.fechaSolicitud , estado: "Solicitado"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaAprobacion!=null){
      let fila = [{ fecha: this.ficha.fechaAprobacion , estado: "Aprobado"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaDenegacion!=null){
      let fila = [{ fecha: this.ficha.fechaDenegacion , estado: "Denegado"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaAnulacion!=null){
      let fila = [{ fecha: this.ficha.fechaAnulacion , estado: "Anulado"}];
      this.filas.push(fila);
    }
  }

  solicitar(){
    this.progressSpinner = true; 
		this.sigaServices.post('facturacion_solicitarCompra', this.ficha).subscribe(
			(n) => {
				if( n.status != 'OK') {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.ficha.idEstadoPeticion = "10";
        }
				this.progressSpinner = false;
			},
			(err) => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
  }

  onHideTarjeta(){
    this.showTarjeta = ! this.showTarjeta;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
