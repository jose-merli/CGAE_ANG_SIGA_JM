
import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroFundamentosCalificacionComponent } from './filtro-fundamentos-calificacion/filtro-fundamentos-calificacion.component';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../commons/translate';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TablaFundamentosCalificacionComponent } from './tabla-fundamentos-calificacion/tabla-fundamentos-calificacion.component';

@Component({
  selector: 'app-fundamentos-calificacion',
  templateUrl: './fundamentos-calificacion.component.html',
  styleUrls: ['./fundamentos-calificacion.component.scss']
})
export class FundamentosCalificacionComponent implements OnInit {

  @ViewChild(FiltroFundamentosCalificacionComponent) filtros
  @ViewChild(TablaFundamentosCalificacionComponent) tabla

  msgs = [];
  datos;
  buscar;
  progressSpinner: boolean = false;

  permisoEscritura: boolean = false

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private persistenceService: PersistenceService,
    private translateService: TranslateService, private router: Router
  ) { }

  ngOnInit() {

    // this.commonsService.checkAcceso(procesos_maestros.juzgados)
    //   .then(respuesta => {
    //   this.permisoEscritura = respuesta;

    //   this.persistenceService.setPermisos(this.permisoEscritura);

    //   if (this.permisoEscritura == undefined) {
    //   sessionStorage.setItem("codError", "403");
    //   sessionStorage.setItem(
    //   "descError",
    //   this.translateService.instant("generico.error.permiso.denegado")
    //   );
    //   this.router.navigate(["/errorAcceso"]);
    //   }
    //   }
    //   ).catch(error => console.error(error));

  }

  isOpenReceive(event) {
    this.search(event);
  }

  searchHistorico(event) {

    console.log(this.filtros.comboAux)
    if (this.filtros.comboAux != null && this.filtros.comboAux != undefined) {
      this.filtros.filtros.descripcionDictamen = this.filtros.comboAux
    }
    this.search(event)
  }

  search(event) {
    this.filtros.filtros.historico = event;

    this.progressSpinner = true;
    console.log(this.filtros.filtros)
    this.sigaServices.post("busquedaFundamentosCalificacion_searchFundamentos", this.filtros.filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).fundamentosCalificacionesItems;
        this.buscar = true;
        this.progressSpinner = false;
        this.tabla.historico = event
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
