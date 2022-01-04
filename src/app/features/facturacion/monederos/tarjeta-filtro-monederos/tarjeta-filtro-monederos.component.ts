import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SigaServices } from '../../../../_services/siga.service';
import { Message } from 'primeng/components/common/api';
import { FiltrosMonederoItem } from '../../../../models/FiltrosMonederoItem';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '@angular/router';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaStorageService } from '../../../../siga-storage.service';

@Component({
  selector: 'app-tarjeta-filtro-monederos',
  templateUrl: './tarjeta-filtro-monederos.component.html',
  styleUrls: ['./tarjeta-filtro-monederos.component.scss']
})
export class TarjetaFiltroMonederosComponent implements OnInit {

  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false;

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  disabledBusquedaExpress: boolean = false;

  //Variables buscador
  filtrosMonederoItem: FiltrosMonederoItem = new FiltrosMonederoItem(); //Guarda los valores seleccionados/escritos en los campos
  
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private translateService: TranslateService, private sigaServices: SigaServices,
    private router: Router, private commonsService: CommonsService, private localStorageService: SigaStorageService,) { }

  ngOnInit() {

    this.filtrosMonederoItem.fechaHasta = new Date(); 

    
    //En la documentación funcional se pide que por defecto aparezca el campo 
    //con la fecha de dos años antes
    let today = new Date();
    this.filtrosMonederoItem.fechaDesde = new Date(new Date().setFullYear(today.getFullYear() - 2));
    //this.filtrosMonederoItem.fechaDesde = new Date(today.valueOf() - (365 * 2 * 24 * 60 * 60 * 1000));

    if(sessionStorage.getItem("filtrosMonedero")){

      this.filtrosMonederoItem = JSON.parse(sessionStorage.getItem("filtrosMonedero"));

      if(this.filtrosMonederoItem.fechaHasta != undefined && this.filtrosMonederoItem.fechaHasta != null){
        this.filtrosMonederoItem.fechaHasta = new Date(this.filtrosMonederoItem.fechaHasta);
      }
      if(this.filtrosMonederoItem.fechaDesde != undefined && this.filtrosMonederoItem.fechaDesde != null){
        this.filtrosMonederoItem.fechaDesde = new Date(this.filtrosMonederoItem.fechaDesde);
      }

      if(this.filtrosMonederoItem.idPersonaColegiado != null && this.filtrosMonederoItem.idPersonaColegiado != undefined){
        this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.filtrosMonederoItem.idPersonaColegiado).subscribe(
          n => {
            let data = JSON.parse(n.body).colegiadoItem;
            this.usuarioBusquedaExpress.nombreAp = data.nombre;
            this.usuarioBusquedaExpress.numColegiado = data.numColegiado;

            this.filtrosMonederoItem.idPersonaColegiado = data.idPersona;
          },
          err => {
            this.progressSpinner = false;
          }
        );
      }

      sessionStorage.removeItem("filtrosMonedero");
      this.busqueda.emit(true);
    }
    else if (sessionStorage.getItem("abogado")) {
     /*  const { nombre, apellidos, nColegiado, idPersona } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));
      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.filtrosMonederoItem.idPersonaColegiado = idPersona; */

    let data = JSON.parse(sessionStorage.getItem("abogado"))[0];
    sessionStorage.removeItem("abogado");
    if (isNaN(data.nif.charAt(0))) {
      this.usuarioBusquedaExpress.nombreAp = data.denominacion;
    }
     if (!isNaN(data.nif.charAt(0))) {
      this.usuarioBusquedaExpress.nombreAp = data.nombre + ", " + data.apellidos;
    }
      
    this.filtrosMonederoItem.idPersonaColegiado = data.idPersona;
    this.usuarioBusquedaExpress.numColegiado = data.nif;

    sessionStorage.removeItem("buscadorColegiados");
  }
    else if(this.localStorageService.isLetrado){
      this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.localStorageService.idPersona).subscribe(
				n => {
					let data = JSON.parse(n.body).colegiadoItem;
					this.usuarioBusquedaExpress.nombreAp = data.nombre;
					this.usuarioBusquedaExpress.numColegiado = data.numColegiado;

          this.filtrosMonederoItem.idPersonaColegiado = data.idPersona;
          
          this.disabledBusquedaExpress = true;
				},
				err => {
					this.progressSpinner = false;
				}
      );

    }

  }

  searchPersona(){
    sessionStorage.setItem("origin", "newCliente");
    this.router.navigate(['/busquedaGeneral']);
  }
  
  limpiarCliente(){
    this.usuarioBusquedaExpress.numColegiado = null;
    this.usuarioBusquedaExpress.nombreAp = null;
    this.filtrosMonederoItem.idPersonaColegiado = null;
  }

  // Control de fechas
  getFechaHastaCalendar(fechaInputDesde : Date, fechainputHasta : Date) : Date{
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

  getFechaDesdeCalendar(fechaInputesde : Date, fechaInputHasta : Date) : Date{
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

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

  limpiar() {
    this.filtrosMonederoItem = new FiltrosMonederoItem();
    this.usuarioBusquedaExpress = {
      numColegiado: "",
      nombreAp: ""
    };
  }

  buscar() {
    this.busqueda.emit(true);
  }

  nuevoMonedero(){
    this.progressSpinner = true;

    sessionStorage.removeItem("FichaMonedero");
   
    this.router.navigate(["/fichaMonedero"]);
      
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
