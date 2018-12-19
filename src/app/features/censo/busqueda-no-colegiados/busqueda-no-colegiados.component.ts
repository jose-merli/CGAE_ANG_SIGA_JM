import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { esCalendar } from "../../../utils/calendar";
import { Router } from "../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../_services/siga.service";
import { TranslateService } from "../../../commons/translate";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { DataTable } from "../../../../../node_modules/primeng/primeng";
import { NoColegiadoItem } from "../../../models/NoColegiadoItem";
import { DatosNoColegiadosObject } from "../../../models/DatosNoColegiadosObject";
import { DatePipe } from "../../../../../node_modules/@angular/common";
import { ComboItem } from "../../administracion/parametros/parametros-generales/parametros-generales.component";

@Component({
  selector: "app-busqueda-no-colegiados",
  templateUrl: "./busqueda-no-colegiados.component.html",
  styleUrls: ["./busqueda-no-colegiados.component.scss"]
})
export class BusquedaNoColegiadosComponent implements OnInit {
  formBusqueda: FormGroup;
  comboEtiquetas: any;
  textSelected: String = "{0} etiquetas seleccionadas";
  comboEstadoCivil: any;
  comboProvincias: any;
  comboPoblacion: any;
  comboTipoDireccion: any;
  comboCategoriaCurricular: any;
  comboSexo: any;
  progressSpinner: boolean = false;
  resultadosPoblaciones: any;

  editar: boolean = true;
  textFilter: String = "Elegir";
  body: NoColegiadoItem = new NoColegiadoItem();
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  isEditable: boolean = false;
  buscar: boolean = false;
  es: any;

  historico: boolean = false;

  cols: any;
  datos: any;
  rowsPerPage: any;
  selectMultiple: boolean = false;
  isMultiple: string = "single";
  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected: number = 0;
  fechaNacimientoSelect: Date;
  fechaNacimientoSelectOld: Date;

  noColegiadoSearch = new DatosNoColegiadosObject();

  msgs: Message[];

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: true
    },
    {
      key: "avanzado",
      activa: false
    },
    {
      key: "direccion",
      activa: false
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private datePipe: DatePipe,
    private confirmationService: ConfirmationService
  ) {
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3))
    });
  }

  ngOnInit() {
    this.getLetrado();
    // Obtener Combos
    this.getCombos();
    this.es = this.translateService.getCalendarLocale();
    // sessionStorage.removeItem("esColegiado");
    if (sessionStorage.getItem("filtrosBusquedaNoColegiados") != null) {
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaNoColegiados")
      );
      sessionStorage.removeItem("filtrosBusquedaNoColegiados");
      this.isBuscar();
    }
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
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

  //Funcion que carga todos los combos de los filtros de la pantalla
  getCombos() {
    this.getComboProvincias();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboSexo();
    this.getComboTipoDireccion();
    this.getComboEtiquetas();
  }

  //Funcion que carga combo del campo sexo
  getComboSexo() {
    this.comboSexo = [
      { label: "", value: null },
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" }
    ];
  }

  //Funcion que carga combo del campo estado civil
  getComboEstadoCivil() {
    this.sigaServices.get("busquedaNoColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo etiquetas
  getComboEtiquetas() {
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo tipo direccion
  getComboTipoDireccion() {
    this.sigaServices.get("busquedaNoColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTipoDireccion = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo curricular
  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaNoColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo provincias
  getComboProvincias() {
    this.sigaServices.get("busquedaNoColegiados_provincias").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo poblacion
  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaNoColegiados_poblacion",
        "?idProvincia=" + this.body.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
        },
        error => {},
        () => {}
      );
  }

  //Funcion que carga la provincia al cambiar el campo codigo postal
  onChangeCodigoPostal(event) {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      let value = this.body.codigoPostal.substring(0, 2);
      if (
        value != this.body.idProvincia ||
        this.body.idProvincia == undefined
      ) {
        this.body.idProvincia = value;
        this.isDisabledPoblacion = false;
        this.comboPoblacion = [];
      }
    }
  }

  //Funcion que valida el codido postal
  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  //Funcion que busca poblacion según la provincia seleccionada
  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null) {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = "No hay resultados";
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
        this.body.idPoblacion = null;
      }
    } else {
      this.comboPoblacion = [];
      this.body.idPoblacion = null;
      this.resultadosPoblaciones = "No hay resultados";
    }
  }

  //Opción tabla de seleccionar varias filas
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

  //Opción tabla de seleccionar todas las filas
  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.noColegiadoSearch.noColegiadoItem;
      this.numSelected = this.noColegiadoSearch.noColegiadoItem.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  //Paginator
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelect(event) {
    if (this.selectMultiple == false) {
      this.selectedDatos = this.selectedItem;
    } else {
      this.isSelectMultiple();
    }
  }

  clear() {
    this.msgs = [];
  }

  getLetrado() {
    if (JSON.parse(sessionStorage.getItem("isLetrado")) == true) {
      this.isEditable = true;
    } else {
      this.isEditable = false;
    }
    // let isLetrado: ComboItem;
    // this.sigaServices.get("getLetrado").subscribe(
    //   data => {
    //     isLetrado = data;
    //     if (isLetrado.value == "S") {
    //       sessionStorage.setItem("isLetrado", "true");
    //       this.isEditable = true;
    //     } else {
    //       sessionStorage.setItem("isLetrado", "false");
    //       this.isEditable = false;
    //     }
    //   },
    //   err => {
    //     sessionStorage.setItem("isLetrado", "true");
    //     this.isEditable = true;
    //     console.log(err);
    //   }
    // );
  }

  //Busca No colegiados según los filtros
  isBuscar() {
    this.selectAll = false;
    this.historico = false;
    this.buscar = true;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.getColsResults();
    this.filtrosTrim();

    if (
      this.fechaNacimientoSelect != undefined ||
      this.fechaNacimientoSelect != null
    ) {
      this.body.fechaNacimiento = this.datePipe.transform(
        this.fechaNacimientoSelect,
        "dd/MM/yyyy"
      );
    } else {
      this.body.fechaNacimiento = null;
    }

    this.progressSpinner = true;
    this.buscar = true;

    this.sigaServices
      .postPaginado(
        "busquedaNoColegiados_searchNoColegiado",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.noColegiadoSearch = JSON.parse(data["body"]);
          this.datos = this.noColegiadoSearch.noColegiadoItem;
          this.convertirStringADate(this.datos);
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  toHistorico() {
    this.historico = true;
    this.body.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.filtrosTrim();
    this.selectAll = false;
    this.sigaServices
      .postPaginado(
        "busquedaNoColegiados_searchNoColegiado",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.noColegiadoSearch = JSON.parse(data["body"]);
          this.datos = this.noColegiadoSearch.noColegiadoItem;
          this.convertirStringADate(this.datos);
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.body.historico = false;
        }
      );
  }

  isLimpiar() {
    this.body = new NoColegiadoItem();
    this.fechaNacimientoSelect = null;
  }

  isCrear() {
    sessionStorage.removeItem("personaBody");
    sessionStorage.setItem(
      "filtrosBusquedaNoColegiados",
      JSON.stringify(this.body)
    );
    sessionStorage.setItem("esColegiado", "false");
    sessionStorage.setItem("esNuevoNoColegiado", "true");
    this.router.navigate(["/fichaColegial"]);
  }

  deleteSeleccion(selectedDatos) {
    console.log("SE", selectedDatos);
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.removeColegiado(selectedDatos);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  removeColegiado(selectedDatos) {
    this.progressSpinner = true;

    let item = new NoColegiadoItem();

    item.idPersonas = [];

    selectedDatos.forEach(element => {
      item.idPersonas.push(element.idPersona);
    });

    this.sigaServices
      .post("busquedaNocolegiado_deleteNoColegiado", item)
      .subscribe(
        data => {
          this.progressSpinner = false;
          if (selectedDatos.length == 1) {
            this.showSuccess(
              this.translateService.instant("messages.deleted.success")
            );
          } else {
            this.showSuccess(
              selectedDatos.length +
                " " +
                this.translateService.instant(
                  "messages.deleted.selected.success"
                )
            );
          }
        },
        error => {
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.historico = true;
          this.selectedDatos = [];
          this.numSelected = 0;
          this.isBuscar();
        }
      );
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  isCancelar() {
    this.isEditable = false;
  }

  convertirStringADate(datos) {
    datos.forEach(element => {
      if (element.fechaNacimiento == "" || element.fechaNacimiento == null) {
        element.fechaNacimiento = null;
      } else {
        var year = element.fechaNacimiento.substring(0, 4);
        var month = element.fechaNacimiento.substring(5, 7);
        var day = element.fechaNacimiento.substring(8, 10);
        element.fechaNacimiento = "";
        element.fechaNacimiento = day + "/" + month + "/" + year;
      }
    });
  }

  //Elimina los espacios en blancos finales e iniciales de los inputs de los filtros
  filtrosTrim() {
    if (this.body.nif != null) {
      this.body.nif = this.body.nif.trim();
    }

    if (this.body.apellidos != null) {
      this.body.apellidos = this.body.apellidos.trim();
    }

    if (this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }

    if (this.body.codigoPostal != null) {
      this.body.codigoPostal = this.body.codigoPostal.trim();
    }

    if (this.body.correo != null) {
      this.body.correo = this.body.correo.trim();
    }

    if (this.body.movil != null) {
      this.body.movil = this.body.movil.trim();
    }

    if (this.body.telefono != null) {
      this.body.telefono = this.body.telefono.trim();
    }
  }

  getColsResults() {
    this.cols = [
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "fechaNacimiento",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      { field: "correo", header: "censo.datosDireccion.literal.correo" },
      { field: "telefono", header: "censo.ws.literal.telefono" },
      { field: "movil", header: "censo.datosDireccion.literal.movil" }
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

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  irEditarNoColegiado(id) {
    if (id.length >= 1 && this.selectMultiple == false) {
      sessionStorage.removeItem("personaBody");
      sessionStorage.setItem(
        "filtrosBusquedaNoColegiados",
        JSON.stringify(this.body)
      );
      sessionStorage.setItem("esColegiado", "false");
      sessionStorage.setItem("personaBody", JSON.stringify(id[0]));
      console.log(id);
      this.router.navigate(["/fichaColegial"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }
}
