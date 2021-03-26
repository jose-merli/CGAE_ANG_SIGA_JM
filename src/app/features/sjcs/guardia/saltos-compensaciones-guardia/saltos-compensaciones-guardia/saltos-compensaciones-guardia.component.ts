import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { SaltoCompObject } from '../../../../../models/guardia/SaltoCompObject';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { FiltrosSaltosCompensacionesGuardiaComponent } from './filtros-saltos-compensaciones-guardia/filtros-saltos-compensaciones-guardia.component';
import { TablaSaltosCompensacionesGuardiaComponent } from './tabla-saltos-compensaciones-guardia/tabla-saltos-compensaciones-guardia.component';
@Component({
  selector: 'app-saltos-compensaciones-guardia',
  templateUrl: './saltos-compensaciones-guardia.component.html',
  styleUrls: ['./saltos-compensaciones-guardia.component.scss']
})
export class SaltosCompensacionesGuardiaComponent implements OnInit {

  buscar: boolean = false;
  historico;

  datos;

  progressSpinner: boolean = false;

  @ViewChild(FiltrosSaltosCompensacionesGuardiaComponent) filtros: FiltrosSaltosCompensacionesGuardiaComponent;
  @ViewChild(TablaSaltosCompensacionesGuardiaComponent) tabla: TablaSaltosCompensacionesGuardiaComponent;

  //comboPartidosJudiciales
  comboPJ;
  msgs;

  permisoEscritura;

  showResults: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private datepipe: DatePipe) { }


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


  isBuscar(event) {
    this.search(event);
  }

  searchHistory(event) {
    this.search(event);
  }

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.postPaginado("saltosCompensacionesGuardia_buscar", "?numPagina=1", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).saltosCompItems;
        console.log("file: saltos-compensaciones-guardia.component.ts ~ line 81 ~ SaltosCompensacionesGuardiaComponent ~ search ~ this.datos", this.datos)
        this.modifyData(this.datos);
        this.buscar = true;

        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }

        this.showResults = true;
        this.resetSelect();

        let error = JSON.parse(n.body).error;

        if (error != null && error.description != null) {
          this.showMessage({ severity: "info", summary: this.translateService.instant("general.message.informacion"), msg: error.description });
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.mensaje.error.bbdd") });
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.tabla.tablaFoco.nativeElement.scrollIntoView();
        }, 5);

      }
    );
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

  formatDate(date) {

    const pattern = 'dd/MM/yyyy';

    return this.datepipe.transform(date, pattern);

  }

  formatName(name: string) {
    const array = name.split(' ');
    let resp = '';

    switch (array.length) {
      case 1: resp = array[0];
        break;
      case 2: resp = `${array[1]}, ${array[0]}`;
        break;
      case 3: resp = `${array[1]} ${array[2]}, ${array[0]}`;
        break;
    }

    return resp;
  }

  modifyData(datos) {

    datos.forEach(dato => {

      // if (dato.saltoCompensacion == 'C') {
      //   dato.saltoCompensacion = 'Compensación';
      // } else if (dato.saltoCompensacion == 'S') {
      //   dato.saltoCompensacion = 'Salto';
      // }

      dato.fecha = this.formatDate(dato.fecha);

      if (dato.fechaUso != undefined && dato.fechaUso != null) {
        dato.fechaUso = this.formatDate(dato.fechaUso);
      }

      if (dato.grupo != undefined && dato.grupo != null) {
        dato.nColegiado = dato.grupo;
        dato.letrado = dato.letradosGrupo;
      } else {
        dato.nColegiado = dato.colegiadoGrupo;
        dato.letrado = [dato.letrado];
      }



      // dato.editable = true; 

    });

  }

}
