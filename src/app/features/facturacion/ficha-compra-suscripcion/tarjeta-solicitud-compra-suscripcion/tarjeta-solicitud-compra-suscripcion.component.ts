import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { FilaHistoricoPeticionItem } from '../../../../models/FilaHistoricoPeticionItem';
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
  @Output() actualizaFicha = new EventEmitter<Boolean>();

  cols = [
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha"},
    { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"},
  ];

  filas: FilaHistoricoPeticionItem[] = [];

  permisoSolicitarCompra;
  permisoAprobarCompra;

  progressSpinner : boolean = false;
  showTarjeta: boolean = false;
  esColegiado: boolean = this.localStorageService.isLetrado;

  constructor(
    private sigaServices: SigaServices, private translateService: TranslateService, 
    private commonsService: CommonsService, private router: Router,
    private localStorageService: SigaStorageService,) { }

  ngOnInit() {
    this.processHist();
    this.checkPermisos();
  }

  ngOnChanges(changes: SimpleChanges){
    this.processHist();
  }

  processHist(){
    this.filas = [];
    if(this.ficha.fechaPendiente!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaPendiente;
      fila.estado = this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.pendiente");
      this.filas.push(fila);
    }
    if(this.ficha.fechaDenegada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaDenegada;
      fila.estado = this.translateService.instant("facturacion.productos.denegada");
      this.filas.push(fila);
    }
    if(this.ficha.fechaAceptada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaAceptada;
      fila.estado = this.translateService.instant("facturacion.productos.aceptada");
      this.filas.push(fila);
    }
    if(this.ficha.fechaSolicitadaAnulacion!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaSolicitadaAnulacion;
      fila.estado = this.translateService.instant("facturacion.productos.anulacionSolicitada");
      this.filas.push(fila);
    }
    if(this.ficha.fechaAnulada!=null){
      let fila = new FilaHistoricoPeticionItem();
      fila.fecha = this.ficha.fechaAnulada;
      fila.estado = this.translateService.instant("facturacion.productos.anulada");
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

  checkAprobar(){
    let msg = null;
    if(this.ficha.productos!= null) msg = this.commonsService.checkPermisos(this.permisoAprobarCompra, undefined);
    // else msg = this.commonsService.checkPermisos(this.permisoAprobarSuscripcion, undefined);

    if (msg != null) {
      this.msgs = msg;
    }  else {
			if(this.ficha.productos!= null)this.aprobarCompra();
      // else this.aprobarSuscripcion();
		}
  }

  solicitarCompra(){
    this.progressSpinner = true; 
		this.sigaServices.post('PyS_solicitarCompra', this.ficha).subscribe(
			(n) => {
				if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          
          //Se actualiza la información de la ficha
          this.actualizaFicha.emit();
        }
				this.progressSpinner = false;
			},
			(err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
				this.progressSpinner = false;
			}
		);
  }

  aprobarCompra(){
    this.progressSpinner = true; 
		this.sigaServices.post('PyS_solicitarCompra', this.ficha).subscribe(
			(n) => {
				if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          
          //Se actualiza la información de la ficha
          this.actualizaFicha.emit();
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

  getPermisoAprobar(){
    this.commonsService
			.checkAcceso(procesos_PyS.fichaCompraSuscripcion)
			.then((respuesta) => {
				this.permisoAprobarCompra = respuesta;
			})
			.catch((error) => console.error(error));
  }
}
