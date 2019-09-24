import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroPrisionesComponent } from './filtro-prisiones/filtro-prisiones.component';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';

@Component({
  selector: 'app-busqueda-prisiones',
  templateUrl: './busqueda-prisiones.component.html',
  styleUrls: ['./busqueda-prisiones.component.scss']
})
export class BusquedaPrisionesComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltroPrisionesComponent) filtros;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_maestros.prisiones)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
      ).catch(error => console.error(error));
  }


  isOpenReceive(event) {
    this.search(event);
  }


  search(event) {
    this.filtros.filtros.historico = event;
    this.progressSpinner = true;

    this.sigaServices.post("busquedaPrisiones_searchPrisiones", this.filtros.filtros).subscribe(
      n => {

        this.datos = JSON.parse(n.body).prisionItems;
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
