import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../_services/siga.service";
import { TranslateService } from "../../../commons/translate";
import { SolicitudIncorporacionObject } from "../../../models/SolicitudIncorporacionObject";
import { SolicitudIncorporacionItem } from "../../../models/SolicitudIncorporacionItem";
import { Message } from "primeng/components/common/api";
export enum KEY_CODE { ENTER = 13 }

@Component({
  selector: "app-solicitudes-incorporacion",
  templateUrl: "./solicitudes-incorporacion.component.html",
  styleUrls: ["./solicitudes-incorporacion.component.scss"]
})
export class SolicitudesIncorporacionComponent implements OnInit {

  es: any;
  fichaAbierta: boolean = true;
  formBusqueda: FormGroup;
  body: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  bodySearch: SolicitudIncorporacionObject = new SolicitudIncorporacionObject();
  identificacionValida: boolean;
  buscar: boolean = false;
  progressSpinner: boolean = false;
  private DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";
  tiposSolicitud: any;
  estadosSolicitud: any;
  msgs: Message[] = [];
  busqueda: boolean = false;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {
    this.formBusqueda = this.formBuilder.group({
      fechaDesde: new FormControl(null, Validators.required),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3))
    });
  }

  ngOnInit() {
    this.es = this.translateService.getCalendarLocale();
    this.cargarCombos();
    this.cols = [
      { field: "numeroIdentificacion", header: "Nº Identificación" },
      { field: "apellidos", header: "Apellidos" },
      { field: "nombre", header: "Nombre" },
      { field: "numColegiado", header: "Nº colegiado previsto" },
      { field: "correoElectronico", header: "Tipo Solicitud" },
      { field: "fechaSolicitud", header: "Fecha Solicitud" },
      { field: "estadoSolicitud", header: "Estado" },
      { field: "fechaEstado", header: "Fecha Estado" }
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
    this.filtrosSession();
  }
  filtrosSession() {
    if (sessionStorage.getItem("filtros") != null) {
      this.body = JSON.parse(sessionStorage.getItem("filtros"));
      this.body.fechaDesde = new Date(this.body.fechaDesde);
      this.body.fechaHasta = new Date(this.body.fechaHasta);
      this.buscarSolicitudes();

      sessionStorage.removeItem("filtros");
    }
  }
  cargarCombos() {
    this.sigaServices
      .get("solicitudInciporporacion_tipoSolicitud").subscribe(result => {
        this.tiposSolicitud = result.combooItems;
      },
        error => {
          console.log(error);
        });

    this.sigaServices
      .get("solicitudInciporporacion_estadoSolicitud").subscribe(result => {
        this.estadosSolicitud = result.combooItems;
      },
        error => {
          console.log(error);
        });
  }
  buscarSolicitudes() {
    this.buscar = true;
    this.progressSpinner = true;
    this.sigaServices.postPaginado("solicitudInciporporacion_searchSolicitud", "?numPagina=1", this.body).subscribe(result => {
      this.bodySearch = JSON.parse(result["body"]);
      this.datos = [];
      this.datos = this.bodySearch.solIncorporacionItems;
      this.datos.forEach(element => {
        element.fechaSolicitud = new Date(element.fechaSolicitud);
        element.fechaEstado = new Date(element.fechaEstado);
      });
      this.progressSpinner = false;
    },
      error => {
        console.log(error);
      });
    sessionStorage.setItem("filtros", JSON.stringify(this.body));
  }

  isBuscar(): boolean {
    if (!this.formBusqueda.invalid && this.checkIdentificacion(this.body.numeroIdentificacion)) {
      return false;
    } else {
      return true;
    }
  }

  irNuevaSolicitud() {
    sessionStorage.removeItem("editedSolicitud");
    sessionStorage.setItem("consulta", "false");
    this.router.navigate(["/nuevaIncorporacion"]);
  }
  irDetalleSolicitud(item) {

    if (item && item.length > 0) {
      var enviarDatos = null;
      enviarDatos = item[0];
      sessionStorage.setItem("editedSolicitud", JSON.stringify(enviarDatos));
      sessionStorage.setItem("consulta", "true");
      sessionStorage.setItem("filtros", JSON.stringify(this.body));
    } else {
      sessionStorage.setItem("consulta", "false");
    }
    this.router.navigate(["/nuevaIncorporacion"]);
  }

  abrirCerrarFicha() {
    this.fichaAbierta = !this.fichaAbierta;
  }

  checkIdentificacion(doc: String) {
    if (doc && doc.length > 0 && doc != undefined) {
      if (doc.length == 10) {
        return this.isValidPassport(doc);
      } else {
        if (doc.substring(0, 1) == "1" || doc.substring(0, 1) == "2" || doc.substring(0, 1) == "3" || doc.substring(0, 1) == "4" || doc.substring(0, 1) == "5" || doc.substring(0, 1) == "6"
          || doc.substring(0, 1) == "7" || doc.substring(0, 1) == "8" || doc.substring(0, 1) == "9" || doc.substring(0, 1) == "0") {
          return this.isValidDNI(doc);
        } else {
          return this.isValidNIE(doc);
        }
      }
    } else {
      return true;
    }
  }

  isValidPassport(dni: String): boolean {
    return (
      dni && typeof dni === "string" && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni)
    );
  }

  isValidNIE(nie: String): boolean {
    return (
      nie &&
      typeof nie === "string" &&
      /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie)
    );
  }

  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === "string" &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() ===
      this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }

  restablecerCampos() {
    this.body = new SolicitudIncorporacionItem();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.numSelected = this.bodySearch.solIncorporacionItems.length;
      this.selectMultiple = false;
      this.selectedDatos = this.bodySearch.solIncorporacionItems;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  activarPaginacion() {
    if (
      !this.bodySearch.solIncorporacionItems ||
      this.bodySearch.solIncorporacionItems.length == 0
    )
      return false;
    else return true;
  }
  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }
}
