import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Location } from '@angular/common'
import { FiltroBuscadorProcuradorComponent } from './filtro/filtro.component';
import { TablaBuscadorProcuradorComponent } from './tabla/tabla.component';
import { SigaServices } from '../../_services/siga.service';
import { CommonsService } from '../../_services/commons.service';
import { PersistenceService } from '../../_services/persistence.service';
import { TranslateService } from '../translate';
import { Router } from '../../../../node_modules/@angular/router';
import { ProcuradoresItem } from '../../models/sjcs/ProcuradoresItem';
import { ProcuradoresObject } from '../../models/sjcs/ProcuradoresObject';
import { procesos_maestros } from '../../permisos/procesos_maestros';
import { endpoints_componentes } from '../../utils/endpoints_components';

@Component({
  selector: 'app-buscador-procuradores',
  templateUrl: './buscador-procuradores.component.html',
  styleUrls: ['./buscador-procuradores.component.scss']
})
export class BuscadorProcuradoresComponent implements OnInit {

  @ViewChild(FiltroBuscadorProcuradorComponent) filtros;
  @ViewChild(TablaBuscadorProcuradorComponent) tabla;
  comboColegios = [];
  @Input() proceso: string;
  msgs = [];
  datos;
  buscar = false;
  progressSpinner: boolean = false;
  institucionActual;
  permisoEscritura: boolean = false

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private persistenceService: PersistenceService,
    private translateService: TranslateService, private router: Router, private location: Location
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(this.proceso)
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
        this.getInstitucion();
      }
      ).catch(error => console.error(error));

  }


  isOpenReceive(event) {
    this.search(event);
  }

  searchHistorico(event) {
    this.search(event)
  }



  backTo() {
    this.location.back();
  }


  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.sigaServices.post("busquedaProcuradores_searchProcuradoresComp", this.filtros.filtroAux).subscribe(
      n => {

        this.datos = JSON.parse(n.body).procuradorItems;
        this.datos = this.datos.map(it => {
          it.nColegiado = +it.nColegiado;
          return it;
        })
        this.buscar = true;
        this.progressSpinner = false;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
        }
        this.resetSelect();
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
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
  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.getComboColegios();
    });

  }
  getComboColegios() {
    //Aqui vemos si el combo es de una institucion en concreto de forma que disableamos y establecemos el valor.
    // En caso de que sea la institucion General activamos el combo con multiselect

    this.sigaServices.getParam(
      "busquedaCol_colegio",
      "?idInstitucion=" + this.institucionActual).subscribe(
        n => {
          this.comboColegios = n.combooItems;
          this.commonsService.arregloTildesCombo(this.filtros.comboColegios);

          if (this.institucionActual == "2000") {
            this.filtros.institucionGeneral = true;

          } else {
            this.filtros.filtros.inst = n.combooItems;
          }


        },
        err => {
          //console.log(err);
        }
      );
  }
  clear() {
    this.msgs = [];
  }


}
