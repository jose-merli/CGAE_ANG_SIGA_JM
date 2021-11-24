import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CertificacionFacItem } from '../../../../../../models/sjcs/CertificacionFacItem';

@Component({
  selector: 'app-tarjeta-datos-generales',
  templateUrl: './tarjeta-datos-generales.component.html',
  styleUrls: ['./tarjeta-datos-generales.component.scss']
})
export class TarjetaDatosGeneralesComponent implements OnInit {
  progressSpinner;
  permisos;
  datos = new CertificacionFacItem;
  listaEstados = new CertificacionFacItem;
  @Input() idCertificacion;
  @Input() modoEdicion;
  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @ViewChild("tabla") tabla;
  msgs: any[];
  cols;
  first = 0;
  constructor() { }

  ngOnInit() {
    this.getListEstados();
    if(this.listaEstados != null || this.listaEstados != undefined){
      this.getCols();
    }
    
  }

  getCols(){
    
    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado", width: "33%" },
      { field: "proceso", header: "facturacionSJCS.fichaCertificacion.proceso", width: "20%" },
      { field: "estado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado", width: "20%" },
      
    ];
   
}

getListEstados(){

}

  descargar(){

  }

  subirFichero(){

  }
  reabrir(){

  }
  cerrarEnviar(){

  }
  save(){

  }
  restablecer(){

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
}
