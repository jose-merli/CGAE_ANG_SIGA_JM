import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ViewEncapsulation
} from "@angular/core";
import { SelectItem } from "primeng/components/common/api";
import { SigaServices } from "../../../_services/siga.service";
import { esCalendar } from "../../../utils/calendar";
import { TranslateService } from "../../../commons/translate/translation.service";
import { Router } from "@angular/router";
import { BusquedaSancionesItem } from "../../../models/BusquedaSancionesItem";
import { BusquedaSancionesObject } from "../../../models/BusquedaSancionesObject";
import { ComboItem } from "./../../../../app/models/ComboItem";
import { AuthenticationService } from "../../../_services/authentication.service";
import { CommonsService } from '../../../_services/commons.service';
import { MultiSelect } from 'primeng/multiselect';
@Component({
  selector: "app-busqueda-sanciones",
  templateUrl: "./busqueda-sanciones.component.html",
  styleUrls: ["./busqueda-sanciones.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaSancionesComponent implements OnInit {
  showBusquedaLetrado: boolean = true;
  showBusquedaColegio: boolean = false;
  showBusquedaSanciones: boolean = false;
  isSearch: boolean = false;
  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
  selectAll: boolean = false;
  isHistory: boolean = false;
  hideHistory: boolean = false;
  disabledColegio: boolean = false;
  tipo: SelectItem[];
  tipoSancion: SelectItem[];
  estado: SelectItem[];
  origen: SelectItem[];
  datesType: SelectItem[];
  colegios: any[] = [];
  colegios_seleccionados: any[] = [];
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  msgs: any;
  es: any = esCalendar;

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

  isLetrado: boolean = false;

  currentRoute: String;
  idClaseComunicacion: String;
  keys: any[] = [];
  sortO: number = 1;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.getComboTipoSancion();
    this.getDataDatesType();

    this.getDataTable();

    if (sessionStorage.getItem("saveFilters") != null) {
      this.body = JSON.parse(sessionStorage.getItem("saveFilters"));

      if (sessionStorage.getItem("back") == "true") {
        this.body = JSON.parse(sessionStorage.getItem("saveFilters"));
        if(this.body.chkArchivadas == true){
          this.historico();
        }
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

    if (
      sessionStorage.getItem("SancionInsertada") != null &&
      sessionStorage.getItem("SancionInsertada") != undefined &&
      sessionStorage.getItem("SancionInsertada") == "true"
    ) {
      this.showSuccess("Operación realizada satisfactoriamente");
      sessionStorage.removeItem("SancionInsertada");
    }

    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
  }

  getComboTipoSancion() {
    this.sigaServices.get("busquedaSanciones_comboTipoSancion").subscribe(
      n => {
        this.tipoSancion = n.combooItems;
        this.tipo = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboColegios() {
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.colegios = n.combooItems;
        this.disabledColegio = false;
        if (this.authenticationService.getInstitucionSession() != "2000") {
          this.colegios = [];
          n.combooItems.forEach(element => {
            if (
              this.authenticationService.getInstitucionSession() ==
              element.value
            ) {
              this.colegios.push(element);
              this.disabledColegio = true;
              this.colegios_seleccionados.push(element);
            }
          });
        }
        if (
          sessionStorage.getItem("back") == "true" &&
          this.body.idColegios != undefined
        ) {
          this.getInstitutionSession(this.colegios, this.body.idColegios);
        }
      },
      err => {
        //console.log(err);
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
  getColegioFilter() { }
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
        field: "fechaDesdeDate",
        header: "censo.busquedaSolicitudesTextoLibre.literal.fechaDesde"
      },
      {
        field: "fechaHastaDate",
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

  getDataDatesType() {
    this.datesType = [
      { label: "Acuerdo", value: "Acuerdo" },
      { label: "Fin", value: "Fin" },
      { label: "Firmeza", value: "Firmeza" },
      { label: "Imposición", value: "Imposicion" },
      { label: "Inicio", value: "Inicio" },
      { label: "Rehabilitado", value: "Rehabilitado" },
      { label: "Resolución", value: "Resolucion" }
    ];
  }

  search() {
    // Llamada al rest
    if (this.checkFilters()) {
      if (!this.isHistory) {
        this.body.chkArchivadas = false;
      } else {
        this.body.chkArchivadas = undefined;
      }

      this.progressSpinner = true;
      this.selectAll = false;
      this.selectMultiple = false;
      this.selectedDatos = "";
      this.isSearch = true;

      if (this.datesType != undefined && this.body.tipoFecha == undefined) {
        this.body.tipoFecha = "";
      }

      if (this.colegios_seleccionados != undefined) {
        this.body.idColegios = [];
        this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
          this.body.idColegios.push(value.value);
        });
      }

      this.transformDates(this.body);

      this.sigaServices
        .postPaginado(
          "busquedaSanciones_searchBusquedaSancionesBBDD",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.bodySearch = JSON.parse(data["body"]);
            this.data = this.bodySearch.busquedaSancionesItem;
            this.convertirStringADate(this.data);
            this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            setTimeout(()=>{
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
    }

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

  convertirStringADate(data) {
    data.forEach(element => {
      if (element.fechaDesde == "" || element.fechaDesde == null) {
        element.fechaDesdeDate = null;
      } else {
        var posIni = element.fechaDesde.indexOf("/");
        var posFin = element.fechaDesde.lastIndexOf("/");
        var year = element.fechaDesde.substring(posFin + 1);
        var day = element.fechaDesde.substring(0, posIni);
        var month = element.fechaDesde.substring(posIni + 1, posFin);
        element.fechaDesdeDate = new Date(year, month - 1, day);
      }

      if (element.fechaHasta == "" || element.fechaHasta == null) {
        element.fechaHastaDate = null;
      } else {
        var posIni = element.fechaHasta.indexOf("/");
        var posFin = element.fechaHasta.lastIndexOf("/");
        var year = element.fechaHasta.substring(posFin + 1);
        var day = element.fechaHasta.substring(0, posIni);
        var month = element.fechaHasta.substring(posIni + 1, posFin);
        element.fechaHastaDate = new Date(year, month - 1, day);
      }
    });
  }

  restore() {
    this.body.nif = "";
    this.body.nombre = "";
    this.body.primerApellido = "";
    this.body.segundoApellido = "";
    if (!this.disabledColegio) {
      this.colegios_seleccionados = [];
    }
    this.body.chkRehabilitado = false;
    this.body.fechaDesdeDate = undefined;
    this.body.fechaHastaDate = undefined;
    this.body.refColegio = "";
    this.body.refConsejo = "";
    this.body.tipoSancion = "";
    this.body.tipoFecha = "";

    sessionStorage.removeItem("saveFilters");
  }

  newRecord() {
    sessionStorage.setItem("nuevaSancion", "true");

    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");

    let migaPan = this.translateService.instant("menu.expedientes.sanciones");
    let menuProcede = this.translateService.instant("menu.censo");
    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("menuProcede", menuProcede);

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
    if (!this.selectMultiple) {
      if(this.isHistory){
        this.body.chkArchivadas = true;
      }
      // Guardamos los filtros
      sessionStorage.setItem("saveFilters", JSON.stringify(this.body));

      // Guardamos los datos seleccionados para pasarlos a la otra pantalla
      sessionStorage.setItem("rowData", JSON.stringify(selectedDatos[0]));

      this.router.navigate(["/detalleSancion"]);

      sessionStorage.removeItem("nuevaSancion");
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  setItalic(datoH) {
    if (datoH.archivada == "No") return false;
    else return true;
  }

  historico() {
    this.body.chkArchivadas = true;
    this.isHistory = true;
    this.hideHistory = true;
    this.search();
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
      this.numSelected = 0;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }
  onChangeSelectAll() {
    if (!this.isHistory) {
      if (this.selectAll === true) {
        this.selectMultiple = false;
        this.selectedDatos = this.data;
        this.numSelected = this.data.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    } else {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.data.filter(dato => dato.archivada == 'Sí')
        this.numSelected = this.selectedDatos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
      }
    }
  }
  updateRegistry(selectedDatos) {
    this.body = new BusquedaSancionesItem();

    this.body = selectedDatos;
    this.body.restablecer = true;

    this.sigaServices
      .post("busquedaSanciones_updateSanction", this.body)
      .subscribe(
        data => { },
        error => { },
        () => {
          this.search();
        }
      );
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  clickFila(event) {
    if (event.data && event.data.archivada == 'No' && this.isHistory){
      this.selectedDatos.pop();
    }
      
  }
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  clear() {
    this.msgs = [];
  }


  navigateComunicar(dato) {
    sessionStorage.setItem("saveFilters", JSON.stringify(this.body));
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    sessionStorage.setItem("idModulo", '3');
    this.getDatosComunicar();
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
          data => {
            this.keys = JSON.parse(data['body']).keysItem;
            this.selectedDatos.forEach(element => {
              let keysValues = [];
              this.keys.forEach(key => {
                if (element[key.nombre] != undefined) {
                  keysValues.push(element[key.nombre]);
                }
              })
              datosSeleccionados.push(keysValues);
            });

            sessionStorage.setItem("datosComunicar", JSON.stringify(datosSeleccionados));
            this.router.navigate(["/dialogoComunicaciones"]);
          },
          err => {
            //console.log(err);
          }
        );
      },
      err => {
        //console.log(err);
      }
    );
  }
  fillFechaDesdeDate(event) {
    this.body.fechaDesdeDate = event;
  }

  fillFechaHastaDate(event) {
    this.body.fechaHastaDate = event;
  }



  checkFilters() {
    if (
      (this.body.nif == null ||
        this.body.nif == undefined ||
        this.body.nif.trim().length < 3) &&
      (this.body.nombre == null ||
        this.body.nombre == undefined ||
        this.body.nombre.trim().length < 3) &&
      (this.body.primerApellido == null ||
        this.body.primerApellido == undefined ||
        this.body.primerApellido.trim().length < 3) &&
      (this.body.segundoApellido == null ||
        this.body.segundoApellido == undefined ||
        this.body.segundoApellido.trim().length < 3) &&
      (this.body.refConsejo == null ||
        this.body.refConsejo == undefined ||
        this.body.refConsejo.trim().length < 3) &&
      (this.body.refColegio == null ||
        this.body.refColegio == undefined ||
        this.body.refColegio.trim().length < 3) &&
      (this.body.tipoFecha == null ||
        this.body.tipoFecha == undefined) &&
      (this.body.fechaDesdeDate == null ||
        this.body.fechaDesdeDate == undefined) &&
      (this.body.fechaHastaDate == null ||
        this.body.fechaHastaDate == undefined) &&
      (this.body.tipoSancion == null ||
        this.body.tipoSancion == undefined)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.primerApellido != undefined) {
        this.body.primerApellido = this.body.primerApellido.trim();
      }
      if (this.body.segundoApellido != undefined) {
        this.body.segundoApellido = this.body.segundoApellido.trim();
      }
      if (this.body.refColegio != undefined) {
        this.body.refColegio = this.body.refColegio.trim();
      }
      if (this.body.refConsejo != undefined) {
        this.body.refConsejo = this.body.refConsejo.trim();
      }
      return true;
    }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}