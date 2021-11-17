import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../commons/translate';
import { FiltrosMonederoItem } from '../../../../models/FiltrosMonederoItem';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaStorageService } from '../../../../siga-storage.service';

@Component({
  selector: 'app-tarjeta-filtro-monedero',
  templateUrl: './tarjeta-filtro-monedero.component.html',
  styleUrls: ['./tarjeta-filtro-monedero.component.scss']
})
export class TarjetaFiltroMonederosComponent implements OnInit {

  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false;

  //Variables buscador
  filtrosMonederoItem: FiltrosMonederoItem = new FiltrosMonederoItem(); //Guarda los valores seleccionados/escritos en los campos
  
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private sigaServices: SigaServices,
    private router: Router, private commonsService: CommonsService, private localStorageService: SigaStorageService,) { }

  ngOnInit() {

    if(sessionStorage.getItem("abogado")){
      let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
			sessionStorage.removeItem("abogado");
    }
    else if(this.localStorageService.isLetrado){
      this.sigaServices.get(this.sigaServices.endpoints.monederosBusqueda_searchListadoMonederos, this.filtrosMonederoItem.fechaDesde)
      this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.localStorageService.idPersona).subscribe(
				n => {
					let data = JSON.parse(n.body).colegiadoItem;
				
				},
				err => {
					this.progressSpinner = false;
				});
    }

    this.filtrosMonederoItem.fechaDesde = new Date(); 

    //En la documentación funcional se pide que por defecto aparezca el campo 
    //con la fecha de dos años antes
    this.filtrosMonederoItem.fechaDesde.setDate(this.filtrosMonederoItem.fechaDesde.getDate() - (1));
  }

  


  // Control de fechas
  getFechaHastaCalendar(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      const one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      const fechaDesde = new Date(fechaInputDesde).getTime();
      const fechaHasta = new Date(fechainputHasta).getTime();
      const msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < one_day) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }

  getFechaDesdeCalendar(fechaInputesde : Date, fechaInputHasta : Date) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      const one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      const fechaDesde = new Date(fechaInputesde).getTime();
      const fechaHasta = new Date(fechaInputHasta).getTime();
      const msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < one_day) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }

  fillFechaDesde(event) {
    this.filtrosMonederoItem.fechaDesde = event;
  }

  fillFechaHasta(event) {
    this.filtrosMonederoItem.fechaHasta = event;
  }

  limpiar() {
    this.filtrosMonederoItem = new FiltrosMonederoItem();
  }


  checkBuscar(){
    if(!this.checkFilters())this.showMessage("error",  this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    else this.buscar();
  }

  buscar() {
    this.busqueda.emit(true);
  }

  checkFilters(){
    if(this.filtrosMonederoItem.fechaDesde != null) return true;
    if(this.filtrosMonederoItem.fechaHasta != null) return true;
    return false;
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

}
