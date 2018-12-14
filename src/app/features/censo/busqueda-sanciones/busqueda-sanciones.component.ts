import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SelectItem } from "primeng/components/common/api";
import { SigaServices } from "../../../_services/siga.service";
import { esCalendar } from "../../../utils/calendar";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { BusquedaSancionesItem } from "../../../models/BusquedaSancionesItem";
import { BusquedaSancionesObject } from "../../../models/BusquedaSancionesObject";
import { ComboItem } from "./../../../../app/models/ComboItem";

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
    private router: Router
  ) {}

  ngOnInit() {
    this.getComboTipoSancion();

    this.getDataTable();

    if (sessionStorage.getItem("saveFilters") != null) {
      this.body = JSON.parse(sessionStorage.getItem("saveFilters"));

      if (sessionStorage.getItem("back") == "true") {
        this.body = JSON.parse(sessionStorage.getItem("saveFilters"));
        this.transformDates(this.body);

        this.getComboColegios();
      } else {
        this.getComboColegios();

        if (sessionStorage.getItem("search") != null) {
          this.isSearch = true;
          this.data = JSON.parse(sessionStorage.getItem("search"));
          sessionStorage.removeItem("search");
        }
      }
      sessionStorage.removeItem("saveFilters");
    } else {
      this.getComboColegios();

      if (sessionStorage.getItem("search") != null) {
        this.isSearch = true;
        this.data = JSON.parse(sessionStorage.getItem("search"));
        sessionStorage.removeItem("search");
        sessionStorage.removeItem("saveFilters");
      }
    }

    console.log("array", this.colegios_seleccionados);
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

        if (
          sessionStorage.getItem("back") == "true" &&
          this.body.idColegios != undefined
        ) {
          this.getInstitutionSession(this.colegios, this.body.idColegios);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        if (sessionStorage.getItem("back") == "true") {
          this.isSearch = true;
          this.search();
          sessionStorage.removeItem("back");
        }
      }
    );
  }

  getInstitutionSession(colegios, idColegios) {
    var obj: any;
    colegios.forEach(element => {
      idColegios.forEach(element1 => {
        if (element.value == element1) {
          obj = {
            label: element.label,
            value: element1
          };
          this.colegios_seleccionados.push(obj);
        }
      });
    });
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

    this.transformDates(this.body);

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

  transformDates(body) {
    if (body.fechaDesdeDate != null && body.fechaDesdeDate != undefined) {
      body.fechaDesdeDate = new Date(body.fechaDesdeDate);
    } else {
      body.fechaDesdeDate = null;
    }

    if (body.fechaHastaDate != null && body.fechaHastaDate != undefined) {
      body.fechaHastaDate = new Date(body.fechaHastaDate);
    } else {
      body.fechaHastaDate = null;
    }

    if (body.fecha != null && body.fecha != undefined) {
      body.fecha = new Date(body.fecha);
    } else {
      body.fecha = null;
    }

    if (body.fechaAcuerdoHasta != null && body.fechaAcuerdoHasta != undefined) {
      body.fechaAcuerdoHasta = new Date(body.fechaAcuerdoHasta);
    } else {
      body.fechaAcuerdoHasta = null;
    }

    if (
      body.fechaArchivadaDesdeDate != null &&
      body.fechaArchivadaDesdeDate != undefined
    ) {
      body.fechaArchivadaDesdeDate = new Date(body.fechaArchivadaDesdeDate);
    } else {
      body.fechaArchivadaDesdeDate = null;
    }

    if (
      body.fechaArchivadaHastaDate != null &&
      body.fechaArchivadaHastaDate != undefined
    ) {
      body.fechaArchivadaHastaDate = new Date(body.fechaArchivadaHastaDate);
    } else {
      body.fechaArchivadaHastaDate = null;
    }
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
    sessionStorage.setItem("nuevaSancion", "true");
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
