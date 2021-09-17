import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FichaCompraSuscripcionItem } from '../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-ficha-compra-suscripcion',
  templateUrl: './ficha-compra-suscripcion.component.html',
  styleUrls: ['./ficha-compra-suscripcion.component.scss']
})
export class FichaCompraSuscripcionComponent implements OnInit {

  progressSpinner: boolean = false;

  ficha: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem;



  constructor(private location: Location, 
    private sigaServices: SigaServices,) { }

  ngOnInit() {
    
  }

  getDatosFicha() {
		this.sigaServices.get('facturacion_getFichaCompraSuscripcion').subscribe(
			(n) => {
				let data = JSON.parse(n.body);
        this.ficha.nSolicitud = data.nSolicitud;
        this.ficha.usuModificacion
				this.progressSpinner = false;
			},
			(err) => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
	}

  backTo(){
    this.location.back();
  }
}
