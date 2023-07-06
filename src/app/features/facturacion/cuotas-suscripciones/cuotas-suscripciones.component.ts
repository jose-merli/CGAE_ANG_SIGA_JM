import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../commons/translate';
import { FiltrosSuscripcionesItem } from '../../../models/FiltrosSuscripcionesItem';
import { ListaSuscripcionesItem } from '../../../models/ListaSuscripcionesItem';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { SigaServices } from '../../../_services/siga.service';
import { TarjetaFiltroCuotasSuscripcionesComponent } from './tarjeta-filtro-cuotas-suscripciones/tarjeta-filtro-cuotas-suscripciones.component';
import { TarjetaListaCuotasSuscripcionesComponent } from './tarjeta-lista-cuotas-suscripciones/tarjeta-lista-cuotas-suscripciones.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cuotas-suscripciones',
  templateUrl: './cuotas-suscripciones.component.html',
  styleUrls: ['./cuotas-suscripciones.component.scss']
})
export class CuotasSuscripcionesComponent implements OnInit {

  msgs : Message[] = [];
  
  progressSpinner: boolean = false;

  listaSuscripciones: ListaSuscripcionesItem[];
  filtrosSuscripciones: FiltrosSuscripcionesItem;

  muestraTablaSuscripciones: boolean = false;
  fromFichaCen: boolean = false;

  @ViewChild(TarjetaFiltroCuotasSuscripcionesComponent) filtrosBusqueda;
  @ViewChild(TarjetaListaCuotasSuscripcionesComponent) listaBusqueda;
  
  //Suscripciones
  subscriptionSuscripcionesBusqueda: Subscription;

  constructor(private commonsService:CommonsService, private sigaServices: SigaServices,
    private translateService: TranslateService, private persistenceService: PersistenceService,
    private location: Location) { }

  ngOnInit() {
    if(sessionStorage.getItem("fromFichaCen")){
      this.fromFichaCen = true;
      sessionStorage.removeItem("fromFichaCen");
    }
  }

  
  ngOnDestroy() {
    if (this.subscriptionSuscripcionesBusqueda)
      this.subscriptionSuscripcionesBusqueda.unsubscribe();
  }

  busquedaSuscripciones(event) {
    this.progressSpinner = true;
    this.filtrosSuscripciones = this.filtrosBusqueda.filtrosSuscripciones;

    sessionStorage.setItem("filtroBusqSuscripcion",JSON.stringify(this.filtrosBusqueda.filtrosSuscripciones));

    this.subscriptionSuscripcionesBusqueda = this.sigaServices.post("PyS_getListaSuscripciones", this.filtrosSuscripciones).subscribe(
      listaSuscripcionesDTO => {

        

        if (JSON.parse(listaSuscripcionesDTO.body).error.code == 200){
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

          this.listaSuscripciones = JSON.parse(listaSuscripcionesDTO.body).listaSuscripcionesItems;
          this.muestraTablaSuscripciones= true;
          this.listaBusqueda.suscripcionesTable.reset();
          setTimeout(() => {
            this.commonsService.scrollTablaFoco('tablaSuscripciones');
          }, 5);
        }
        else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
      }, () => {
        this.progressSpinner = false;
      });;
  }

  
  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }

  backTo(){
    this.location.back();
  }
}