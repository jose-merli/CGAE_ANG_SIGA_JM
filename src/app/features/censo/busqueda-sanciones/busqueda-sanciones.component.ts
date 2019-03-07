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
  keys: any []= [];

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private authenticationService: AuthenticationService
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
    console.log("array", this.colegios_seleccionados);

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
        console.log(err);
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

  getDataDatesType() {
    this.datesType = [
      { label: "", value: "" },
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
      // Guardamos los filtros
      sessionStorage.setItem("saveFilters", JSON.stringify(this.body));

      // Guardamos los datos seleccionados para pasarlos a la otra pantalla
      sessionStorage.setItem("rowData", JSON.stringify(selectedDatos));

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

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  clear() {
    this.msgs = [];
  }


  navigateComunicar(dato){
    sessionStorage.setItem("saveFilters", JSON.stringify(this.body));
    sessionStorage.setItem("rutaComunicacion",this.currentRoute.toString());
    sessionStorage.setItem("idModulo",'3');
    this.getDatosComunicar();    
  }
  
  getDatosComunicar(){
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
              this.keys.forEach(key =>{
                if(element[key.nombre] != undefined){
                  keysValues.push(element[key.nombre]);
                }            
              })
              datosSeleccionados.push(keysValues);
            });
    
            sessionStorage.setItem("datosComunicar", JSON.stringify(datosSeleccionados));
            this.router.navigate(["/dialogoComunicaciones"]);
          },
          err => {
            console.log(err);
          }
        );   
      },
      err => {
        console.log(err);
      }
    );    
  } 
  fillFechaDesdeDate(event) {
    this.body.fechaDesdeDate = event;
  }

  fillFechaHastaDate(event) {
    this.body.fechaHastaDate = event;
  }

}