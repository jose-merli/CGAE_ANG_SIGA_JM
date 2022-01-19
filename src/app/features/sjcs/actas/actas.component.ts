import { Component, OnInit, ViewChild } from '@angular/core';
import { FiltroActasComponent } from './filtro-actas/filtro-actas.component';
import { TablaActasComponent } from './tabla-actas/tabla-actas.component';
import { PersistenceService } from '../../../_services/persistence.service';
import { TranslateService } from '../../../commons/translate';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { procesos_comision } from '../../../permisos/procesos_comision';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-actas',
  templateUrl: './actas.component.html',
  styleUrls: ['./actas.component.scss']
})
export class ActasComponent implements OnInit {

  buscar: boolean = false;
  historico: boolean = false;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltroActasComponent) filtros : FiltroActasComponent;
  @ViewChild(TablaActasComponent) tabla;

  //comboPartidosJudiciales
  comboPJ;
  msgs;
  permisoEscritura;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private datepipe: DatePipe,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }


  ngOnInit() {

    this.commonsService.checkAcceso(procesos_comision.actas)
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

  actaBorrada(event){
    this.search(event);
  }

  search(event) {
    this.progressSpinner = true;
    this.sigaServices.post("filtrosacta_busquedaActas", this.filtros.datosFiltro).subscribe(
      n => {
        this.datos = JSON.parse(n.body).actasItems;
        this.buscar = true;

        this.datos.forEach(element => {
          element.fecharesolucion = this.formatDate(element.fecharesolucion);
          element.fechareunion = this.formatDate(element.fechareunion);
        });

        console.log("Busqueda Actas -> ", this.datos);

        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
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
      this.tabla.table.sortOrder = 0;
      this.tabla.table.sortField = '';
      this.tabla.table.reset();
      this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");

    }
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);    
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
