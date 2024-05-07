import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonsService } from "../../../../_services/commons.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { JusticiableItem } from "../../../../models/sjcs/JusticiableItem";
import { procesos_justiciables } from "../../../../permisos/procesos_justiciables";
import { FiltroJusticiablesComponent } from "./filtro-justiciables/filtro-justiciables.component";
import { TablaJusticiablesComponent } from "./tabla-justiciables/tabla-justiciables.component";

@Component({
  selector: "app-busqueda-justiciables",
  templateUrl: "./busqueda-justiciables.component.html",
  styleUrls: ["./busqueda-justiciables.component.scss"],
})
export class BusquedaJusticiablesComponent implements OnInit {
  datos;
  msgs;
  breadcrumbs = [];
  origen: string = "";
  justiciable: any;

  buscar: boolean = false;
  progressSpinner: boolean = false;

  @ViewChild(FiltroJusticiablesComponent) filtros;
  @ViewChild(TablaJusticiablesComponent) tabla;

  permisoEscritura;
  modoRepresentante: boolean = false;
  searchJusticiable: boolean = true;
  nuevoInteresado: boolean = false;
  nuevoContrario: boolean = false;
  nuevoAsistido: boolean = false;
  nuevoContrarioAsistencia: boolean = false;
  nuevaUniFamiliar: boolean = false;
  nuevoContrarioEJG: boolean = false;
  nuevoSoj: boolean = false;
  nuevoRepresentante: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.justiciables")];

    if (sessionStorage.getItem("creaInsertaJusticiableDesigna")) {
      sessionStorage.removeItem("creaInsertaJusticiableDesigna");
      this.location.back();
    }

    if (sessionStorage.getItem("origin")) {
      this.origen = sessionStorage.getItem("origin");
      sessionStorage.removeItem("origin");
    }

    if (this.origen == "newInteresado") {
      this.nuevoInteresado = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("justiciaGratuita.ejg.busquedaAsuntos.designaciones"), this.translateService.instant("justiciaGratuita.designaciones.interesados"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "newContrario") {
      this.nuevoContrario = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("justiciaGratuita.ejg.busquedaAsuntos.designaciones"), this.translateService.instant("justiciaGratuita.designaciones.contrarios"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "newAsistido") {
      this.nuevoAsistido = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia"), this.translateService.instant("justiciaGratuita.guardia.asistido"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "newContrarioAsistencia") {
      this.nuevoContrarioAsistencia = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"), this.translateService.instant("menu.justiciaGratuita.asistencia"), this.translateService.instant("justiciaGratuita.guardia.contrarios"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "UnidadFamiliar") {
      this.nuevaUniFamiliar = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.ejg"), this.translateService.instant("justiciaGratuita.ejg.unidadfamiliar"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "newContrarioEJG") {
      this.nuevoContrarioEJG = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.ejg"), this.translateService.instant("justiciaGratuita.ejg.contrarios"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "newSoj") {
      this.nuevoSoj = true;
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.soj"), this.translateService.instant("justiciaGratuita.soj.solicitante"), this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else if (this.origen == "newRepresentante") {
      this.modoRepresentante = true;
      this.nuevoRepresentante = true;
      this.justiciable = JSON.parse(sessionStorage.getItem("justiciable"));
      sessionStorage.removeItem("justiciable");
      this.filtros.filtros = this.persistenceService.getFiltrosAux();
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.justiciables"), this.translateService.instant("menu.justiciaGratuita.justiciables.gestionjusticiables"), "Tarjeta Representante", this.translateService.instant("justiciaGratuita.justiciable.seleccion")];
    } else {
      this.searchJusticiable = false;
      this.persistenceService.clearDatosEJG();
      this.filtros.filtros = this.persistenceService.getFiltros();
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.justiciables")];
    }

    this.commonsService.checkAcceso(procesos_justiciables.justiciables).then((respuesta) => {
      this.permisoEscritura = respuesta;
      this.persistenceService.setPermisos(this.permisoEscritura);
      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }
    });
  }

  isOpenReceive(event) {
    this.progressSpinner = true;
    this.search(event);
  }

  search(event) {
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", this.filtros.filtros).subscribe(
      (n) => {
        this.datos = JSON.parse(n.body).justiciableBusquedaItems;
        let error = JSON.parse(n.body).error;
        this.buscar = true;
        this.progressSpinner = false;

        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = "";
          this.tabla.tabla.reset();
          this.tabla.buscadores = this.tabla.buscadores.map((it) => (it = ""));
        }
        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }
      },
      (err) => {
        this.progressSpinner = false;
      },
    );
  }

  insertRepresentante(event: JusticiableItem) {
    // Asociar para Nuevo Representante
    this.persistenceService.clearBody();
    this.persistenceService.setBody(event);
    this.persistenceService.setDatos(this.justiciable);
    this.router.navigate(["/gestionJusticiables"]);
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    if (this.origen == "newInteresado" || this.origen == "newContrario") {
      this.router.navigate(["fichaDesignaciones"]);
    } else if (this.origen == "newAsistido" || this.origen == "newContrarioAsistencia") {
      this.router.navigate(["/fichaAsistencia"]);
    } else if (this.origen == "UnidadFamiliar" || this.origen == "newContrarioEJG") {
      this.router.navigate(["/gestionEjg"]);
    } else if (this.origen == "newSoj") {
      this.router.navigate(["/detalle-soj"]);
    } else if (this.origen == "newRepresentante") {
      this.persistenceService.setDatos(this.justiciable);
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      this.location.back();
    }
  }
}
