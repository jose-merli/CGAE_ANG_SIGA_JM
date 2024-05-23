import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { CommonsService } from "../../../../../_services/commons.service";
import { PersistenceService } from "../../../../../_services/persistence.service";
import { ModulosItem } from "../../../../../models/sjcs/ModulosItem";

const enum KEY_CODE {
  ENTER = 13,
}

@Component({
  selector: "app-filtros-modulos",
  templateUrl: "./filtros-modulos.component.html",
  styleUrls: ["./filtros-modulos.component.scss"],
})
export class FiltrosModulosComponent implements OnInit {
  showDatosGenerales: boolean = true;
  filtros: ModulosItem = new ModulosItem();
  jurisdicciones: any[] = [];
  vieneDeFichaJuzgado: boolean = false;

  @Input() permisos: boolean = false;
  @Output() searchModulos = new EventEmitter<any>();

  constructor(private router: Router, private persistenceService: PersistenceService, private commonsService: CommonsService) {}

  ngOnInit() {
    if (sessionStorage.getItem("vieneDeFichaJuzgado")) {
      this.vieneDeFichaJuzgado = true;
    }
    if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros();
      this.buscar();
    }
  }

  checkPermisosNewModulo() {
    if (this.commonsService.checkPermisosService(this.permisos)) {
      this.newModulo();
    }
  }

  newModulo() {
    this.persistenceService.setFiltros(this.filtros);
    this.router.navigate(["/gestionModulos"]);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  checkFilters() {
    // quita espacios vacios antes de buscar
    if (this.filtros.nombre != undefined && this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.codigo != undefined && this.filtros.codigo != null) {
      this.filtros.codigo = this.filtros.codigo.trim();
    }
  }

  buscar() {
    this.checkFilters();
    this.searchModulos.emit(null);
  }

  clearFilters() {
    this.filtros = new ModulosItem();
    this.persistenceService.clearFiltros();
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.buscar();
    }
  }
}
