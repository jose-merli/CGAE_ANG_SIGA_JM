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

    
    if(sessionStorage.getItem("FichaCompraSuscripcion")){
      this.ficha = JSON.parse(sessionStorage.getItem("FichaCompraSuscripcion"));
      sessionStorage.removeItem("FichaCompraSuscripcion")
    }
    //Si vuelve de otra pantalla
    else this.getDatosFicha();
    
  }

  getDatosFicha() {
    this.ficha = JSON.parse(sessionStorage.getItem("cargarFichaCompraSuscripcion"));
    this.progressSpinner = true; 
		this.sigaServices.post('facturacion_getFichaCompraSuscripcion', this.ficha).subscribe(
			(n) => {
				this.ficha = JSON.parse(n.body);
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
