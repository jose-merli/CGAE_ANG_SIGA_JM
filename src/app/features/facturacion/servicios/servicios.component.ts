import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '../../../commons/translate';
import { ListaServiciosDTO } from '../../../models/ListaServiciosDTO';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit, OnDestroy, AfterViewChecked {
  //Variables generales app
  msgs = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false; //Para mostrar/no mostrar el spinner de carga

  //Variables busqueda
  serviceData: any[] = [];
  muestraTablaServicios: boolean = false;

  //Suscripciones
  subscriptionServiciosBusqueda: Subscription;

  constructor(public sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscriptionServiciosBusqueda)
      this.subscriptionServiciosBusqueda.unsubscribe();
  }

  //INICIO SERVICIOS
  listaServiciosDTO: ListaServiciosDTO;
  serviceDataConHistorico: any[] = [];
  serviceDataSinHistorico: any[] = [];
  busquedaServicios(event) {
    this.progressSpinner = true;
    let filtrosServicios = JSON.parse(sessionStorage.getItem("filtrosServicios"));

    this.subscriptionServiciosBusqueda = this.sigaServices.post("serviciosBusqueda_busqueda", filtrosServicios).subscribe(
      listaServiciosDTO => {

        this.listaServiciosDTO = JSON.parse(listaServiciosDTO.body);

        if (JSON.parse(listaServiciosDTO.body).error.code == 500) {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }

        this.showTablaServicios(true);
        this.serviceDataSinHistorico = [];
        this.commonsService.scrollTablaFoco("tablaServicios");
        this.progressSpinner = false;
      },
      err => {
        this.commonsService.scrollTablaFoco("tablaServicios");
        this.progressSpinner = false;
      }, () => {
        this.serviceDataConHistorico = this.listaServiciosDTO.listaServiciosItems;

        if (this.serviceDataConHistorico) {
          this.serviceDataConHistorico.forEach(servicio => {
            if (servicio.fechabaja == null) {
              this.serviceDataSinHistorico.push(servicio);
            }
          });
        }

        this.serviceData = this.serviceDataSinHistorico;

        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaServicios');
        }, 5);
      });;
  }
  //FIN SERVICIOS

  //INICIO METODOS
  showTablaServicios(mostrar) {
    this.muestraTablaServicios = mostrar;
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
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
  //FIN METODOS

}
