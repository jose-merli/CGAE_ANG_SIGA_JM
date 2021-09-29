import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltrosSaltosCompensacionesGuardiaComponent } from './filtros-saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia.component';
import { TablaSaltosCompensacionesGuardiaComponent } from './tabla-saltos-compensaciones-guardia/tabla-saltos-compensaciones-guardia.component';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';

@Component({
  selector: 'app-saltos-compensaciones-guardia',
  templateUrl: './saltos-compensaciones-guardia.component.html',
  styleUrls: ['./saltos-compensaciones-guardia.component.scss']
})
export class SaltosCompensacionesGuardiaComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosSaltosCompensacionesGuardiaComponent) filtros;
  @ViewChild(TablaSaltosCompensacionesGuardiaComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_guardia.saltos_compensaciones)
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
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaSaltosCompG_searchSaltosYComp", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).saltosCompItems;
        this.buscar = true;

        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        this.progressSpinner = false;
        this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
    }
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
