import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { ModulosJuzgadoItem } from "../../../../models/sjcs/ModulosJuzgadoItem";
import { procesos_maestros } from "../../../../permisos/procesos_maestros";
import { FiltrosModulosComponent } from "./filtro-busqueda-modulos/filtros-modulos.component";
import { TablaModulosComponent } from "./tabla-modulos/tabla-modulos.component";

@Component({
  selector: "app-busqueda-modulosybasesdecompensacion",
  templateUrl: "./busqueda-modulosybasesdecompensacion.component.html",
  styleUrls: ["./busqueda-modulosybasesdecompensacion.component.scss"],
})
export class MaestrosModulosComponent implements OnInit {
  messageShow: string;
  datos;
  progressSpinner: boolean = false;
  filtrosJuzgado: ModulosJuzgadoItem = new ModulosJuzgadoItem();
  permisoEscritura: boolean = false;
  vieneDeFichaJuzgado: boolean = false;
  isResult: boolean = false;

  @ViewChild(FiltrosModulosComponent) filtros: FiltrosModulosComponent;
  @ViewChild(TablaModulosComponent) tabla: TablaModulosComponent;

  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private commonsService: CommonsService, private persistenceService: PersistenceService, private router: Router) {}

  ngOnInit() {
    this.commonsService
      .checkAcceso(procesos_maestros.modulo)
      .then((respuesta) => {
        this.permisoEscritura = respuesta;
        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
          this.router.navigate(["/errorAcceso"]);
        }
      })
      .catch((error) => console.error(error));

    if (sessionStorage.getItem("vieneDeFichaJuzgado")) {
      this.vieneDeFichaJuzgado = sessionStorage.getItem("vieneDeFichaJuzgado") == "true" ? true : false;
    }
  }

  ngOnDestroy() {
    if (sessionStorage.getItem("vieneDeFichaJuzgado")) {
      sessionStorage.removeItem("vieneDeFichaJuzgado");
    }
  }

  volver() {
    this.router.navigate(["gestionJuzgados"]);
  }

  searchModulos(historico: any) {
    this.progressSpinner = true;
    if (historico != null) {
      this.filtros.filtros.historico = historico;
    }
    this.persistenceService.setFiltros(this.filtros.filtros);

    if (this.vieneDeFichaJuzgado) {
      let filtrosJuzgado: ModulosJuzgadoItem = new ModulosJuzgadoItem();
      filtrosJuzgado.modulo = this.filtros.filtros;
      filtrosJuzgado.idJuzgado = this.persistenceService.getIdJuzgado();
      filtrosJuzgado.historicoJuzgado = this.persistenceService.getHistoricoJuzgado();
      this.sigaServices.post("modulosYBasesDeCompensacion_searchModulosJuzgados", this.filtrosJuzgado).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.isResult = true;
          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.tabla.sortOrder = 0;
            this.tabla.tabla.sortField = "";
            this.tabla.tabla.reset();
            this.tabla.buscadores = this.tabla.buscadores.map((it) => (it = ""));
          }
          this.datos = JSON.parse(n.body).modulosItem;
          this.resetSelect();
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    } else {
      this.sigaServices.post("modulosYBasesDeCompensacion_searchModulos", this.filtros.filtros).subscribe(
        (n) => {
          this.progressSpinner = false;
          this.isResult = true;
          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.tabla.sortOrder = 0;
            this.tabla.tabla.sortField = "";
            this.tabla.tabla.reset();
            this.tabla.buscadores = this.tabla.buscadores.map((it) => (it = ""));
          }
          this.datos = JSON.parse(n.body).modulosItem;

          this.datos.forEach(element => {
            if (element.fechadesdevigor != null) {
              element.fechadesdevigorString = this.formatDate(element.fechadesdevigor).toLocaleDateString();
            }

            if (element.fechahastavigor != null) {
              element.fechahastavigorString = this.formatDate(element.fechahastavigor).toLocaleDateString();
            }
          });

          this.resetSelect();
        },
        (err) => {
          this.progressSpinner = false;
        },
      );
    }
  }

  resetSelect() {
    if (this.tabla != undefined) {
      this.tabla.selectedDatos = [];
      this.tabla.numSelected = 0;
      this.tabla.selectMultiple = false;
      this.tabla.selectAll = false;
    }
  }

  formatDate(date) {
    if (date instanceof Date) {
      return date;
    } else if (typeof date == "number") {
      return new Date(date.valueOf());
    } else {
      var parts = date.split("/");
      var formattedDate = new Date(parts[1] + "/" + parts[0] + "/" + parts[2]);
      return formattedDate;
    }
  }
}
