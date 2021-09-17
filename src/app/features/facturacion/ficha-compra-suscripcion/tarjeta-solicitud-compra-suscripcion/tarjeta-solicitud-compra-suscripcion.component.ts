import { Component, Input, OnInit } from '@angular/core';
import { FichaCompraSuscripcionItem } from '../../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-solicitud-compra-suscripcion',
  templateUrl: './tarjeta-solicitud-compra-suscripcion.component.html',
  styleUrls: ['./tarjeta-solicitud-compra-suscripcion.component.scss']
})
export class TarjetaSolicitudCompraSuscripcionComponent implements OnInit {

  @Input("ficha") ficha : FichaCompraSuscripcionItem; 

  cols = [
    { field: "fecha", header: "censo.resultadosSolicitudesModificacion.literal.fecha"},
    { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado"},
  ];

  filas: any[];

  progressSpinner : boolean = false;
  showTarjeta: boolean = false;

  constructor(
    private sigaServices: SigaServices,) { }

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

  onHideTarjeta(){
    this.showTarjeta = ! this.showTarjeta;
  }

}
