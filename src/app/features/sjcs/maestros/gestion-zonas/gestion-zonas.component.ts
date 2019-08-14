import { Component, OnInit, HostBinding, ViewChild, AfterViewInit, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { FiltroGestionZonasComponent } from './filtro-gestion-zonas/filtro-gestion-zonas.component';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { TablaGestionZonasComponent } from './tabla-gestion-zonas/tabla-gestion-zonas.component';

@Component({
  selector: 'app-gestion-zonas',
  templateUrl: './gestion-zonas.component.html',
  styleUrls: ['./gestion-zonas.component.scss']
})
export class GestionZonasComponent implements OnInit, AfterViewInit {

  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltroGestionZonasComponent) filtros;

  //comboPartidosJudiciales
  comboPJ;
  msgs;



  constructor(private translateService: TranslateService, private sigaServices: SigaServices) { }


  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.buscar = this.filtros.buscar
  }

  isOpenReceive(event) {
    this.filtros.filtros.historico = false;
    this.searchZonas();
  }


  searchZonas() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionZonas_searchZones", this.filtros.filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).zonasItems;
        this.buscar = true;
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
  }

  searchZonasSend(event) {
    this.filtros.filtros.historico = event;
    this.searchZonas();
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
