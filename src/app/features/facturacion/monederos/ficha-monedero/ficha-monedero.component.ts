import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { FichaMonederoItem } from '../../../../models/FichaMonederoItem';
import { SigaStorageService } from '../../../../siga-storage.service';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ficha-monedero',
  templateUrl: './ficha-monedero.component.html',
  styleUrls: ['./ficha-monedero.component.scss']
})
export class FichaMonederoComponent implements OnInit {

  msgs : Message[];
  
  progressSpinner: boolean = false;

  ficha: FichaMonederoItem = new FichaMonederoItem;
  resaltadoDatos: boolean = false;

  esColegiado: boolean; // Con esta variable se determina si el usuario conectado es un colegiado o no.

  @ViewChild("propietario") tarjProp;
  @ViewChild("movimientos") tarjMov;

  constructor(private location: Location, 
    private sigaServices: SigaServices, private translateService: TranslateService,
    private commonsService : CommonsService,
    private localStorageService: SigaStorageService,) { }

  ngOnInit() {
    if(this.localStorageService.isLetrado){
      this.esColegiado = true;
    }
    else{
      this.esColegiado = false;
    }

    sessionStorage.removeItem("origin");

    if(sessionStorage.getItem("FichaMonedero")){
      this.ficha = JSON.parse(sessionStorage.getItem("FichaMonedero"));
      sessionStorage.removeItem("FichaMonedero");
    }
  }

  

  actualizarFicha(){
    this.progressSpinner = true;

    this.sigaServices.post('PyS_getFichaCompraSuscripcion', this.ficha).subscribe(
      (n) => {

        if( n.status != 200) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.ficha = JSON.parse(n.body);
        }

        this.progressSpinner = false;
          
      },
      (err) => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  scrollToOblig(element : string){
    this.resaltadoDatos = true;
    this.commonsService.scrollTablaFoco(element);
    // if(element == "servicios"){
    //   this.tarjServicios.showTarjeta = true;
    // }
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
