import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { procesos_PyS } from '../../../../permisos/procesos_PyS';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
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

  filas: any[] = [];

  permisoSolicitarCompra;

  progressSpinner : boolean = false;
  showTarjeta: boolean = false;
  esColegiado: boolean;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService, 
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService,) { }

  ngOnInit() {
    this.esColegiado = this.localStorageService.isLetrado;
    this.processDatos();
    this.checkPermisos();
  }

  processDatos(){
    //Pendiente etiquetas para los estados
    this.filas = [];
    if(this.ficha.fechaPendiente!=null){
      let fila = [{ fecha: this.ficha.fechaPendiente , estado: "Solicitada"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaDenegada!=null){
      let fila = [{ fecha: this.ficha.fechaDenegada , estado: "Denegada"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaAceptada!=null){
      let fila = [{ fecha: this.ficha.fechaAceptada , estado: "Acaptada"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaSolicitadaAnulacion!=null){
      let fila = [{ fecha: this.ficha.fechaSolicitadaAnulacion , estado: "Solicitada anulación"}];
      this.filas.push(fila);
    }
    if(this.ficha.fechaAnulada!=null){
      let fila = [{ fecha: this.ficha.fechaAnulada , estado: "Anulada"}];
      this.filas.push(fila);
    }
  }

  checkPermisos(){
    this.getPermisoSolicitarCompra();
  }

  checkSolicitarCompra(){
    let msg = this.commonsService.checkPermisos(this.permisoSolicitarCompra, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    }  else {
			this.solicitarCompra();
		}
  }

  solicitarCompra(){
    this.progressSpinner = true; 
		this.sigaServices.post('PyS_solicitarCompra', this.ficha).subscribe(
			(n) => {
				if( n.status != 'OK') {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
				this.progressSpinner = false;
			},
			(err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
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
  
  getPermisoSolicitarCompra(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoSolicitarCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }
}
