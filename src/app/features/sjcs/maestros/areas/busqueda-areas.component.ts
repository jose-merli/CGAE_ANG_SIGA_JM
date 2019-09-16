import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { FiltroBusquedaAreasComponent } from './filtro-busqueda-areas/filtro-busqueda-areas.component';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { TablaBusquedaAreasComponent } from './tabla-busqueda-areas/tabla-busqueda-areas.component';

@Component({
  selector: 'app-busqueda-areas',
  templateUrl: './busqueda-areas.component.html',
  styleUrls: ['./busqueda-areas.component.scss']
})
export class BusquedaAreasComponent implements OnInit, AfterViewInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltroBusquedaAreasComponent) filtros;

  //comboPartidosJudiciales
  comboPJ;
  msgs;



  constructor(private translateService: TranslateService, private sigaServices: SigaServices) { }


  ngOnInit() {
    this.buscar = this.filtros.buscar
  }

  ngAfterViewInit() {
  }

  // busquedaReceive(event) {
  //   this.searchAreas();
  // }


  searchAreas(event) {
    this.filtros.filtros.historico = event;

    this.progressSpinner = true;

    this.sigaServices.post("fichaAreas_searchAreas", this.filtros.filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).areasItems;
        this.buscar = true;
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  // searchZonasSend(event) {
  //   this.filtros.filtros.historico = event;
  //   this.searchZonas();
  // }

  // showMessage(event) {
  //   this.msgs = [];
  //   this.msgs.push({
  //     severity: event.severity,
  //     summary: event.summary,
  //     detail: event.msg
  //   });
  // }

  clear() {
    this.msgs = [];
  }

}
