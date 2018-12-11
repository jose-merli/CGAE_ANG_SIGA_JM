import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SelectItem } from "primeng/components/common/api";
import { SigaServices } from "../../../_services/siga.service";
import { esCalendar } from "../../../utils/calendar";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { BusquedaSancionesItem } from "../../../models/BusquedaSancionesItem";
import { BusquedaSancionesObject } from "../../../models/BusquedaSancionesObject";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { listenToElementOutputs } from "@angular/core/src/view/element";

@Component({
  selector: "app-busqueda-sanciones",
  templateUrl: "./busqueda-sanciones.component.html",
  styleUrls: ["./busqueda-sanciones.component.scss"]
})
export class BusquedaSancionesComponent implements OnInit {
  showBusquedaLetrado: boolean = true;
  showBusquedaColegio: boolean = false;
  showBusquedaSanciones: boolean = false;
  isSearch: boolean = false;
  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  tipo: SelectItem[];
  tipoSancion: SelectItem[];
  estado: SelectItem[];
  origen: SelectItem[];
  colegios: any[] = [];
  colegios_seleccionados: any[] = [];

  es: any = esCalendar;
  fechaDesde: Date;
  fechaHasta: Date;
  fecha: Date;
  fechaArchivadaDesde: Date;
  fechaArchivadaHasta: Date;

  textSelected: String = "{0} opciones seleccionadas";
  textFilter: String = "Elegir";

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  data: any[];
  dataNewElement: any[];
  numSelected: number = 0;
  selectedItem: number = 10;

  body: BusquedaSancionesItem = new BusquedaSancionesItem();
  bodySearch: BusquedaSancionesObject = new BusquedaSancionesObject();

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getComboTipoSancion();
    this.getComboColegios();
    this.getComboEstado();

    this.getDataTable();

    if (sessionStorage.getItem("saveFilters") != null) {
      this.body = JSON.parse(sessionStorage.getItem("saveFilters"));

      if (sessionStorage.getItem("back") == "true") {
        this.body = JSON.parse(sessionStorage.getItem("saveFilters"));
        this.isSearch = true;
        this.search();
      } else {
        if (sessionStorage.getItem("search") != null) {
          this.isSearch = true;
          this.data = JSON.parse(sessionStorage.getItem("search"));
          sessionStorage.removeItem("search");
        }
      }
      sessionStorage.removeItem("saveFilters");
    } else {
      if (sessionStorage.getItem("search") != null) {
        this.isSearch = true;
        this.data = JSON.parse(sessionStorage.getItem("search"));
        sessionStorage.removeItem("search");
        sessionStorage.removeItem("saveFilters");
      }
    }
  }

  getComboTipoSancion() {
    this.sigaServices.get("busquedaSanciones_comboTipoSancion").subscribe(
      n => {
        this.tipoSancion = n.combooItems;
        this.tipo = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEstado() {
    this.estado = [
      { label: "", value: "" },
      { label: "Provisional", value: "Provisional" },
      { label: "Recurrida", value: "Recurrida" },
      { label: "Firme", value: "Firme" },
      { label: "Firme Pdte. Ejecucion", value: "Firme Pdte. Ejecucion" }
    ];
  }

  getComboOrigen() {
    this.origen = [
      { label: "", value: "" },
      { label: "Colegio/consejo", value: "Colegio/consejo" },
      { label: "Juzgado/Tribunal", value: "Juzgado/Tribunal" }
    ];
  }

  getDataTable() {
    this.cols = [
      {
        field: "colegio",
        header: "busquedaSanciones.colegioSancionador.literal"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "tipoSancion",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.tipoSancion.literal"
      },
      {
        field: "refColegio",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.RefColegio.literal"
      },
      {
        field: "fechaDesde",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaDesde"
      },
      {
        field: "fechaHasta",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaHasta"
      },
      {
        field: "rehabilitado",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.sancionesRehabilitadas.literal"
      },
      {
        field: "firmeza",
        header: "menu.expediente.sanciones.firmeza.literal"
      }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }

  search() {
    // Llamada al rest
    this.progressSpinner = true;
    this.selectAll = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.isSearch = true;

    if (this.colegios_seleccionados != undefined) {
      this.body.idColegios = [];
      this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
        this.body.idColegios.push(value.value);
      });
    }

    if (this.fechaDesde != null && this.fechaDesde != undefined) {
      this.body.fechaDesdeDate = new Date(this.fechaDesde);
    } else {
      this.body.fechaDesdeDate = null;
    }

    if (this.fechaHasta != null && this.fechaHasta != undefined) {
      this.body.fechaHastaDate = new Date(this.fechaHasta);
    } else {
      this.body.fechaHastaDate = null;
    }

    if (this.fecha != null && this.fecha != undefined) {
      this.body.fecha = new Date(this.fecha);
    } else {
      this.body.fecha = null;
    }

    if (
      this.fechaArchivadaDesde != null &&
      this.fechaArchivadaDesde != undefined
    ) {
      this.body.fechaArchivadaDesdeDate = new Date(this.fechaArchivadaDesde);
    } else {
      this.body.fechaArchivadaDesdeDate = null;
    }

    if (
      this.fechaArchivadaHasta != null &&
      this.fechaArchivadaHasta != undefined
    ) {
      this.body.fechaArchivadaHastaDate = new Date(this.fechaArchivadaHasta);
    } else {
      this.body.fechaArchivadaHastaDate = null;
    }

    this.sigaServices
      .postPaginado(
        "busquedaSanciones_searchBusquedaSanciones",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.bodySearch = JSON.parse(data["body"]);
          this.data = this.bodySearch.busquedaSancionesItem;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        }
      );
  }

  restore() {
    this.body.nif = "";
    this.body.nombre = "";
    this.body.primerApellido = "";
    this.body.segundoApellido = "";
    this.colegios_seleccionados = [];
    this.body.chkRehabilitado = false;
    this.fecha = undefined;
    this.fechaDesde = undefined;
    this.fechaHasta = undefined;
    this.body.chkArchivadas = false;
    this.fechaArchivadaDesde = undefined;
    this.fechaArchivadaHasta = undefined;
    this.body.estado = "";
    this.body.origen = "";
    this.body.refColegio = "";
    this.body.refConsejo = "";
    this.body.tipo = "";
    this.body.tipoSancion = "";
    sessionStorage.removeItem("saveFilters");
  }

  newRecord() {
    this.router.navigate(["/busquedaGeneral"]);
  }

  onHideBusquedaLetrado() {
    this.showBusquedaLetrado = !this.showBusquedaLetrado;
  }

  onHideBusquedaColegio() {
    this.showBusquedaColegio = !this.showBusquedaColegio;
  }

  onHideBusquedaSanciones() {
    this.showBusquedaSanciones = !this.showBusquedaSanciones;
  }

  // Métodos gestionar tabla
  enablePagination() {
    if (!this.data || this.data.length == 0) return false;
    else return true;
  }

  onRowSelect(selectedDatos) {
    // Guardamos los filtros
    sessionStorage.setItem("saveFilters", JSON.stringify(this.body));

    // Guardamos los datos de la búsqueda
    sessionStorage.setItem("search", JSON.stringify(this.data));

    // Guardamos los datos seleccionados para pasarlos a la otra pantalla
    sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));

    this.router.navigate(["/detalleSancion"]);
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
}
