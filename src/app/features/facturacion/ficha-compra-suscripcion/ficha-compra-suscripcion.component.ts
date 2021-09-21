import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FichaCompraSuscripcionItem } from '../../../models/FichaCompraSuscripcionItem';
import { SigaServices } from '../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../commons/translate';

@Component({
  selector: 'app-ficha-compra-suscripcion',
  templateUrl: './ficha-compra-suscripcion.component.html',
  styleUrls: ['./ficha-compra-suscripcion.component.scss']
})
export class FichaCompraSuscripcionComponent implements OnInit {

  msgs : Message[];
  
  progressSpinner: boolean = false;

  ficha: FichaCompraSuscripcionItem = new FichaCompraSuscripcionItem;

  @ViewChild("cliente") tarjCliente;


  constructor(private location: Location, 
    private sigaServices: SigaServices, private translateService: TranslateService,) { }

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

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}
