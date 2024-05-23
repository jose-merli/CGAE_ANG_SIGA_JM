import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../_services/commons.service";
import { NotificationService } from "../../../../_services/notification.service";
import { PersistenceService } from "../../../../_services/persistence.service";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { JusticiableBusquedaItem } from "../../../../models/sjcs/JusticiableBusquedaItem";
import { JusticiableItem } from "../../../../models/sjcs/JusticiableItem";
import { procesos_justiciables } from "../../../../permisos/procesos_justiciables";
import { TablaJusticiablesComponent } from "./tabla-justiciables/tabla-justiciables.component";

@Component({
  selector: "app-busqueda-justiciables",
  templateUrl: "./busqueda-justiciables.component.html",
  styleUrls: ["./busqueda-justiciables.component.scss"],
})
export class BusquedaJusticiablesComponent implements OnInit {
  datos;
  breadcrumbs = [];
  origen: string = "";
  originjusticiable: string = "";
  justiciable: any;
  filtros: JusticiableBusquedaItem = new JusticiableBusquedaItem();

  buscar: boolean = false;
  progressSpinner: boolean = false;

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

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService, private router: Router, private location: Location, private notificationService: NotificationService) {}

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
    } else if (this.origen == "newUnidadFamiliar") {
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
      this.originjusticiable = sessionStorage.getItem("originjusticiable");
      sessionStorage.removeItem("originjusticiable");
      let filtrosInicio: JusticiableBusquedaItem = new JusticiableBusquedaItem();
      if (this.persistenceService.getFiltrosAux()) {
        this.filtros = this.persistenceService.getFiltrosAux();
        this.filtros = { ...filtrosInicio, ...this.filtros };
        this.search(this.filtros);
      }
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.justiciables"), this.translateService.instant("menu.justiciaGratuita.justiciables.gestionjusticiables"), this.translateService.instant("justiciaGratuita.justiciable.seleccion.representante")];
    } else {
      this.searchJusticiable = false;
      let filtrosInicio: JusticiableBusquedaItem = new JusticiableBusquedaItem();
      if (this.persistenceService.getFiltros()) {
        this.filtros = this.persistenceService.getFiltros();
        this.filtros = { ...filtrosInicio, ...this.filtros };
        this.search(this.filtros);
      }
      this.breadcrumbs = [this.translateService.instant("menu.justiciaGratuita"), this.translateService.instant("menu.justiciaGratuita.justiciables")];
    }

    this.commonsService.checkAcceso(procesos_justiciables.justiciables).then((respuesta) => {
      this.permisoEscritura = respuesta;
      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }
    });
  }

  search(event: JusticiableBusquedaItem) {
    this.progressSpinner = true;
    this.sigaServices.post("busquedaJusticiables_searchJusticiables", event).subscribe(
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
          this.notificationService.showInfo(this.translateService.instant("general.message.informacion"), error.description);
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
    this.persistenceService.clearFiltrosAux();
    this.persistenceService.setBody(event);
    this.persistenceService.setDatos(this.justiciable);
    sessionStorage.setItem("origin", this.originjusticiable);
    this.router.navigate(["/gestionJusticiables"]);
  }

  backTo() {
    if (this.origen == "newInteresado" || this.origen == "newContrario") {
      this.router.navigate(["fichaDesignaciones"]);
    } else if (this.origen == "newAsistido" || this.origen == "newContrarioAsistencia") {
      this.router.navigate(["/fichaAsistencia"]);
    } else if (this.origen == "newUnidadFamiliar" || this.origen == "newContrarioEJG") {
      this.router.navigate(["/gestionEjg"]);
    } else if (this.origen == "newSoj") {
      this.router.navigate(["/detalle-soj"]);
    } else if (this.origen == "newRepresentante") {
      this.persistenceService.clearFiltrosAux();
      this.persistenceService.setDatos(this.justiciable);
      sessionStorage.setItem("origin", this.originjusticiable);
      sessionStorage.setItem("abrirTarjetaJusticiable", "tarjetaRepresentante");
      this.router.navigate(["/gestionJusticiables"]);
    } else {
      this.location.back();
    }
  }
}
