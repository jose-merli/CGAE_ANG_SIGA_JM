import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroJuzgadosComponent } from './filtro-juzgados/filtro-juzgados.component';
import { PersistenceService } from '../../../../_services/persistence.service';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-busqueda-juzgados',
  templateUrl: './busqueda-juzgados.component.html',
  styleUrls: ['./busqueda-juzgados.component.scss']
})
export class BusquedaJuzgadosComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;
  progressSpinner: boolean = false;

  @ViewChild(FiltroJuzgadosComponent) filtros;

  //comboPartidosJudiciales
  comboPJ;
  msgs;



  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices) { }


  ngOnInit() {
  }


  isOpenReceive(event) {
    this.search(event);
  }


  search(event) {
    this.filtros.filtros.historico = event;
    this.progressSpinner = true;
    
    this.sigaServices.post("busquedaJuzgados_searchJudged", this.filtros.filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).juzgadoItems;
        this.buscar = true;
        this.progressSpinner = false;

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }
    );
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
