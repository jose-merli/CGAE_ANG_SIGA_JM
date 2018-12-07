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
        field: "estado",
        header: "censo.busquedaSolicitudesModificacion.literal.estado"
      },
      {
        field: "refConsejo",
        header:
          "menu.expediente.sanciones.busquedaPorColegio.RefConsejo.literal"
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
      this.body.fechaDesde = new Date(this.fechaDesde);
    } else {
      this.body.fechaDesde = null;
    }

    if (this.fechaHasta != null && this.fechaHasta != undefined) {
      this.body.fechaHasta = new Date(this.fechaHasta);
    } else {
      this.body.fechaHasta = null;
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
      this.body.fechaArchivadaDesde = new Date(this.fechaArchivadaDesde);
    } else {
      this.body.fechaArchivadaDesde = null;
    }

    if (
      this.fechaArchivadaHasta != null &&
      this.fechaArchivadaHasta != undefined
    ) {
      this.body.fechaArchivadaHasta = new Date(this.fechaArchivadaHasta);
    } else {
      this.body.fechaArchivadaHasta = null;
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
    this.fecha = null;
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.body.chkArchivadas = false;
    this.fechaArchivadaDesde = null;
    this.fechaArchivadaHasta = null;
    this.body.estado = "";
    this.body.origen = "";
    this.body.refColegio = "";
    this.body.refConsejo = "";
    this.body.tipo = "";
    this.body.tipoSancion = "";
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

  redirectTo(selectedDatos) {
    if (!this.selectMultiple) {
      sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));

      this.router.navigate(["/detalleSancion"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
}
