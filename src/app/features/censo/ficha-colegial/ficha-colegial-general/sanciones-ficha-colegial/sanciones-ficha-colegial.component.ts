import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { DataTable } from "primeng/primeng";
import { SigaServices } from "../../../../../_services/siga.service";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { BusquedaSancionesItem } from "../../../../../models/BusquedaSancionesItem";
import { BusquedaSancionesObject } from "../../../../../models/BusquedaSancionesObject";
import { FichaColegialColegialesItem } from "../../../../../models/FichaColegialColegialesItem";
import { FichaColegialGeneralesItem } from "../../../../../models/FichaColegialGeneralesItem";

@Component({
  selector: "app-sanciones-ficha-colegial",
  templateUrl: "./sanciones-ficha-colegial.component.html",
  styleUrls: ["./sanciones-ficha-colegial.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SancionesFichaColegialComponent implements OnInit {
  esNewColegiado: boolean = false;
  activacionEditar: boolean = true;
  desactivarVolver: boolean = true;
  emptyLoadFichaColegial: boolean = false;
  activacionTarjeta: boolean = false;
  openFicha: boolean = false;
  fichasPosibles = [
    {
      key: "sanciones",
      activa: false,
    },
  ];
  message;
  messageNoContent;
  progressSpinner: boolean = false;
  selectedItemSanciones: number = 10;
  colsSanciones;
  mostrarNumero: Boolean = false;
  tarjetaSancionesNum: string;
  @Input() tarjetaSanciones: string;
  selectedDatosSanciones;
  bodySanciones: BusquedaSancionesItem = new BusquedaSancionesItem();
  dataSanciones: any[] = [];
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  checkGeneralBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  colegialesBody: FichaColegialColegialesItem = new FichaColegialColegialesItem();
  bodySearchSanciones: BusquedaSancionesObject = new BusquedaSancionesObject();
  mostrarDatosSanciones: boolean = false;
  DescripcionSanciones;
  rowsPerPage;
  @ViewChild("tableSanciones")
  tableSanciones: DataTable;
  @Input() openSanci;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  disabledAction: boolean = false;
  constructor(private sigaServices: SigaServices, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem("disabledAction") == "true") {
      // Esto disablea tela de cosas funciona como medio permisos.
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
    this.getCols();
    if (sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != undefined && JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.checkGeneralBody = new FichaColegialGeneralesItem();

      if (sessionStorage.getItem("personaBody") != null && sessionStorage.getItem("personaBody") != "undefined") {
        this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.checkGeneralBody = JSON.parse(sessionStorage.getItem("personaBody"));
        this.colegialesBody = JSON.parse(sessionStorage.getItem("personaBody"));
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.openSanci == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha("sanciones");
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.esNewColegiado = true;
      this.activacionEditar = false;
      this.emptyLoadFichaColegial = false;
      this.desactivarVolver = false;
      this.activacionTarjeta = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionEditar = true;
      this.esNewColegiado = false;
      this.activacionTarjeta = true;
    }
    if (this.tarjetaSanciones == "3" || this.tarjetaSanciones == "2") {
      this.searchSanciones();
    }
  }
  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    if (key == "generales" && !this.activacionTarjeta && !this.emptyLoadFichaColegial) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
  getCols() {
    this.colsSanciones = [
      {
        field: "colegio",
        header: "busquedaSanciones.colegioSancionador.literal",
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre",
      },
      {
        field: "tipoSancion",
        header: "menu.expediente.sanciones.busquedaPorColegio.tipoSancion.literal",
      },
      {
        field: "refColegio",
        header: "menu.expediente.sanciones.busquedaPorColegio.RefColegio.literal",
      },
      {
        field: "fechaDesde",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaDesde",
      },
      {
        field: "fechaHasta",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaHasta",
      },
      {
        field: "rehabilitado",
        header: "menu.expediente.sanciones.busquedaPorColegio.sancionesRehabilitadas.literal",
      },
      {
        field: "firmeza",
        header: "menu.expediente.sanciones.firmeza.literal",
      },
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10,
      },
      {
        label: 20,
        value: 20,
      },
      {
        label: 30,
        value: 30,
      },
      {
        label: 40,
        value: 40,
      },
    ];
  }
  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter((elto) => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }
  enablePagination() {
    if (!this.dataSanciones || this.dataSanciones.length == 0) return false;
    else return true;
  }

  onRowSelectSanciones(selectedDatos) {
    // Guardamos los filtros
    sessionStorage.setItem("saveFilters", JSON.stringify(this.bodySanciones));

    // Guardamos los datos seleccionados para pasarlos a la otra pantalla
    sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));
    sessionStorage.setItem("permisoTarjeta", this.tarjetaSanciones);

    this.router.navigate(["/detalleSancion"]);
  }

  searchSanciones() {
    // Llamada al rest
    this.mostrarNumero = false;
    this.bodySanciones.chkArchivadas = undefined;
    this.bodySanciones.idPersona = this.generalBody.idPersona;
    this.bodySanciones.nif = this.generalBody.nif;
    this.bodySanciones.tipoFecha = "";
    this.bodySanciones.chkFirmeza = undefined;
    // this.bodySanciones.idColegios = [];
    // this.bodySanciones.idColegios.push(this.generalBody.i.idInstitucion);

    this.transformDates(this.bodySanciones);

    this.sigaServices.postPaginado("busquedaSanciones_searchBusquedaSanciones", "?numPagina=1", this.bodySanciones).subscribe(
      (data) => {
        this.bodySearchSanciones = JSON.parse(data["body"]);
        this.dataSanciones = this.bodySearchSanciones.busquedaSancionesItem;
        this.progressSpinner = false;
      },
      (err) => {
        this.progressSpinner = false;
        this.mostrarNumero = true;
      },
      () => {
        if (this.dataSanciones.length > 0) {
          this.mostrarDatosSanciones = true;
          this.DescripcionSanciones = this.dataSanciones[0];
        }
        if (this.dataSanciones.length == 0) {
          this.message = this.dataSanciones.length.toString();
          this.messageNoContent = this.translateService.instant("general.message.no.registros");
          this.mostrarNumero = true;
        } else {
          this.message = this.dataSanciones.length.toString();
          this.mostrarNumero = true;
        }
        this.progressSpinner = false;
      },
    );
  }

  transformDates(bodySanciones) {
    if (bodySanciones.fechaDesdeDate != null && bodySanciones.fechaDesdeDate != undefined) {
      bodySanciones.fechaDesdeDate = new Date(bodySanciones.fechaDesdeDate);
    } else {
      bodySanciones.fechaDesdeDate = null;
    }

    if (bodySanciones.fechaHastaDate != null && bodySanciones.fechaHastaDate != undefined) {
      bodySanciones.fechaHastaDate = new Date(bodySanciones.fechaHastaDate);
    } else {
      bodySanciones.fechaHastaDate = null;
    }

    if (bodySanciones.fechaArchivadaDesdeDate != null && bodySanciones.fechaArchivadaDesdeDate != undefined) {
      bodySanciones.fechaArchivadaDesdeDate = new Date(bodySanciones.fechaArchivadaDesdeDate);
    } else {
      bodySanciones.fechaArchivadaDesdeDate = null;
    }

    if (bodySanciones.fechaArchivadaHastaDate != null && bodySanciones.fechaArchivadaHastaDate != undefined) {
      bodySanciones.fechaArchivadaHastaDate = new Date(bodySanciones.fechaArchivadaHastaDate);
    } else {
      bodySanciones.fechaArchivadaHastaDate = null;
    }
  }

  onChangeRowsPerPagesSanciones(event) {
    this.selectedItemSanciones = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSanciones.reset();
  }
  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }
}
