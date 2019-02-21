import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { TranslateService } from "../../../commons/translate/translation.service";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";
import { SubtipoCurricularItem } from "../../../models/SubtipoCurricularItem";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { esCalendar } from "./../../../utils/calendar";
import { SigaServices } from "./../../../_services/siga.service";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { ModelosComunicacionesItem } from "../../../models/ModelosComunicacionesItem";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-colegiados",
  templateUrl: "./busqueda-colegiados.component.html",
  styleUrls: ["./busqueda-colegiados.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaColegiadosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showDatosGeneneralesAvanzado: boolean = false;
  showDatosDireccion: boolean = false;
  progressSpinner: boolean = false;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  msgs: any;

  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: string = "Seleccionar";
  buscar: boolean = false;

  es: any = esCalendar;

  editar: boolean = true;
  noResultsSubtipos: boolean = true;

  comboEtiquetas: any[];
  comboSituacion: any[];
  comboResidencia: any[] = [];
  comboInscrito: any[] = [];
  comboSexo: any[] = [];
  comboEstadoCivil: any[];
  comboCategoriaCurricular: any[];
  comboSubtipoCV: any[];
  comboProvincias: any[];
  comboPoblacion: any[];
  comboTiposDireccion: any[];
  comboTipoCV: any[];
  comboColegios: any[];

  textSelected: String = "{0} etiquetas seleccionadas";
  body: DatosColegiadosItem = new DatosColegiadosItem();
  colegiadoSearch = new DatosColegiadosObject();
  subtipoCurricular: SubtipoCurricularItem = new SubtipoCurricularItem();

  siNoResidencia: any;
  siNoInscrito: any;
  selectedEstadoCivil: any;
  selectedCategoriaCurricular: any;
  selectedSubtipoCV: any;
  selectedProvincia: any;
  selectedPoblacion: any;
  selectedTipoDireccion: any;
  resultadosPoblaciones: any;
  historico: boolean;

  fechaIncorporacionHastaSelect: Date;
  fechaIncorporacionDesdeSelect: Date;
  fechaNacimientoHastaSelect: Date;
  fechaNacimientoDesdeSelect: Date;

  //Diálogo de comunicación
  bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  first: number = 0;
  clasesComunicaciones: any = [];
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  institucionActual: any;
  deshabilitarCombCol: boolean = false;
  colegiosSeleccionados: any[] = [];

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {
    this.currentRoute = this.router.url;

    this.getCombos();
    // sessionStorage.removeItem("esColegiado");
    sessionStorage.removeItem("disabledAction");
    if (sessionStorage.getItem("fechaIncorporacionHastaSelect") != null) {
      this.fechaIncorporacionHastaSelect = new Date(
        JSON.parse(sessionStorage.getItem("fechaIncorporacionHastaSelect"))
      );
      sessionStorage.removeItem("fechaIncorporacionHastaSelect");
    }
    if (sessionStorage.getItem("fechaIncorporacionDesdeSelect") != null) {
      this.fechaIncorporacionDesdeSelect = new Date(
        JSON.parse(sessionStorage.getItem("fechaIncorporacionDesdeSelect"))
      );
      sessionStorage.removeItem("fechaIncorporacionDesdeSelect");
    }
    if (
      sessionStorage.getItem("filtrosBusquedaColegiadosFichaColegial") != null
    ) {
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaColegiadosFichaColegial")
      );
    }

    if (this.body.tipoCV != undefined) {
      this.getComboSubtipoCurricular(this.body.tipoCV);
      this.getComboTipoCurricular(this.body.tipoCV);
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }

  onHideDatosGeneralesAvanzados() {
    this.showDatosGeneneralesAvanzado = !this.showDatosGeneneralesAvanzado;
  }

  onHideDireccion() {
    this.showDatosDireccion = !this.showDatosDireccion;
  }

  irEditarColegiado(id) {
    sessionStorage.setItem("esNuevoNoColegiado", JSON.stringify(false));
    if (id.length >= 1 && this.selectMultiple == false) {
      sessionStorage.removeItem("personaBody");
      sessionStorage.setItem("esColegiado", "true");
      sessionStorage.setItem(
        "filtrosBusquedaColegiados",
        JSON.stringify(this.body)
      );
      sessionStorage.removeItem("fechaIncorporacionDesdeSelect");
      if (
        this.fechaIncorporacionDesdeSelect != null ||
        this.fechaIncorporacionDesdeSelect != undefined
      ) {
        sessionStorage.setItem(
          "fechaIncorporacionDesdeSelect",
          JSON.stringify(this.fechaIncorporacionDesdeSelect)
        );
      }
      sessionStorage.removeItem("fechaIncorporacionHastaSelect");
      if (
        this.fechaIncorporacionHastaSelect != null ||
        this.fechaIncorporacionHastaSelect != undefined
      ) {
        sessionStorage.setItem(
          "fechaIncorporacionHastaSelect",
          JSON.stringify(this.fechaIncorporacionHastaSelect)
        );
      }
      sessionStorage.setItem("personaBody", JSON.stringify(id[0]));
      console.log(id);

      if (id[0].situacion == 30) {
        sessionStorage.setItem("disabledAction", "true");
      } else {
        sessionStorage.setItem("disabledAction", "false");
      }

      this.router.navigate(["/fichaColegial"]);
    } else {
      this.actualizaSeleccionados(this.selectedDatos);
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
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

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_poblacion",
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

  onChangeCodigoPostal(event) {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      let value = this.body.codigoPostal.substring(0, 2);
      if (
        value != this.body.idProvincia ||
        this.body.idProvincia == undefined
      ) {
        this.body.idProvincia = value;
        this.comboPoblacion = [];
        this.isDisabledPoblacion = false;
      }
    }
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = "No hay resultados";
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = "Debe introducir al menos 3 caracteres";
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = "No hay resultados";
    }
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }

  getCombos() {
    this.getComboEtiquetas();
    this.getComboSituacion();
    this.getComboResidencia();
    this.getComboInscrito();
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboProvincias();
    this.getComboTiposDireccion();
    this.getComboColegios();
  }

  getComboColegios() {
    // obtener colegios
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.arregloTildesCombo(this.comboColegios);

        this.getInstitucion();

        if (
          sessionStorage.getItem("filtrosBusquedaColegiadosFichaColegial") !=
          null
        ) {
          this.body.colegio.forEach(element => {
            let labelColegio = this.comboColegios.find(
              item => item.value === element
            ).label;

            this.colegiosSeleccionados.push({
              label: labelColegio,
              value: element
            });
          });
          this.isBuscar();
          sessionStorage.removeItem("filtrosBusquedaColegiadosFichaColegial");
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEtiquetas() {
    // obtener etiquetas
    this.sigaServices.get("busquedaColegiado_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = n.combooItems;
        this.arregloTildesCombo(this.comboEtiquetas);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSituacion() {
    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.arregloTildesCombo(this.comboSituacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboResidencia() {
    this.comboResidencia = [
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.arregloTildesCombo(this.comboResidencia);
  }

  getComboInscrito() {
    this.comboInscrito = [{ label: "Sí", value: 1 }, { label: "No", value: 0 }];

    this.arregloTildesCombo(this.comboInscrito);
  }
  getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" }
    ];
  }

  getComboEstadoCivil() {
    this.sigaServices.get("busquedaColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.arregloTildesCombo(this.comboEstadoCivil);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
        this.arregloTildesCombo(this.comboCategoriaCurricular);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaColegiados_provincias").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposDireccion() {
    this.sigaServices.get("busquedaColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTiposDireccion = n.combooItems;
        this.arregloTildesCombo(this.comboTiposDireccion);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeCategoriaCurricular(event) {
    if (event) {
      this.getComboSubtipoCurricular(event.value);
      this.getComboTipoCurricular(event.value);
    }
  }

  //TipoCurricular
  getComboTipoCurricular(idTipoCV) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_getCurricularTypeCombo",
        "?idTipoCV=" + idTipoCV
      )
      .subscribe(
        n => {
          this.comboTipoCV = n.combooItems;
          this.arregloTildesCombo(this.comboTipoCV);
        },
        error => {},
        () => {}
      );
  }

  //SubtipoCurricular
  getComboSubtipoCurricular(idTipoCV) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_getCurricularSubtypeCombo",
        "?idTipoCV=" + idTipoCV
      )
      .subscribe(
        n => {
          this.comboSubtipoCV = n.combooItems;
          this.arregloTildesCombo(this.comboSubtipoCV);
        },
        error => {},
        () => {}
      );
  }

  //Busca colegiados según los filtros
  isBuscar() {
    if (this.checkFilters()) {
      this.selectAll = false;
      this.historico = false;
      this.buscar = true;
      this.selectMultiple = false;

      this.selectedDatos = "";
      this.getColsResults();
      this.filtrosTrim();
      this.progressSpinner = true;
      this.buscar = true;

      this.body.fechaIncorporacion = [];
      this.body.fechaIncorporacion[1] = this.fechaIncorporacionHastaSelect;
      this.body.fechaIncorporacion[0] = this.fechaIncorporacionDesdeSelect;

      this.body.fechaNacimientoRango = [];
      this.body.fechaNacimientoRango[1] = this.fechaNacimientoHastaSelect;
      this.body.fechaNacimientoRango[0] = this.fechaNacimientoDesdeSelect;

      // if (
      //   this.fechaNacimientoSelect != undefined ||
      //   this.fechaNacimientoSelect != null
      // ) {
      //   this.body.fechaNacimiento = this.fechaNacimientoSelect;
      // } else {
      //   this.body.fechaNacimiento = undefined;
      // }

      this.body.colegio = [];
      this.colegiosSeleccionados.forEach(element => {
        this.body.colegio.push(element.value);
      });

      this.sigaServices
        .postPaginado(
          "busquedaColegiados_searchColegiado",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.colegiadoSearch = JSON.parse(data["body"]);
            this.datos = this.colegiadoSearch.colegiadoItem;
            this.convertirStringADate(this.datos);
            this.table.paginator = true;
            this.body.fechaIncorporacion = [];
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
  }

  convertirStringADate(datos) {
    datos.forEach(element => {
      if (element.fechaNacimiento == "" || element.fechaNacimiento == null) {
        element.fechaNacimientoDate = null;
      } else {
        var posIni = element.fechaNacimiento.indexOf("/");
        var posFin = element.fechaNacimiento.lastIndexOf("/");
        var year = element.fechaNacimiento.substring(posFin + 1);
        var day = element.fechaNacimiento.substring(0, posIni);
        var month = element.fechaNacimiento.substring(posIni + 1, posFin);
        element.fechaNacimientoDate = new Date(year, month, day);
        element.fechaNacimiento = day + "/" + month + "/" + year;
      }
    });
  }

  isLimpiar() {
    this.body = new DatosColegiadosItem();
    this.comboSubtipoCV = [];
    this.fechaIncorporacionDesdeSelect = undefined;
    this.fechaIncorporacionHastaSelect = undefined;
    this.fechaNacimientoDesdeSelect = undefined;
    this.fechaNacimientoHastaSelect = undefined;
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

    if (this.body.numColegiado != null) {
      this.body.numColegiado = this.body.numColegiado.trim();
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
        field: "numColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaCliente.situacion.cabecera"
      },
      {
        field: "situacionResidente",
        header: "censo.busquedaClientes.noResidente"
      },
      {
        field: "fechaNacimientoDate",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      {
        field: "correo",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
      },
      {
        field: "noAparecerRedAbogacia",
        header: "censo.busquedaColegial.lopd"
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

  clear() {
    this.msgs = [];
  }

  checkFilters() {
    if (
      (this.body.nombre == null ||
        this.body.nombre == null ||
        this.body.nombre.trim().length < 3) &&
      (this.body.apellidos == null ||
        this.body.apellidos == null ||
        this.body.apellidos.trim().length < 3) &&
      (this.body.numColegiado == null ||
        this.body.numColegiado == null ||
        this.body.numColegiado.trim().length < 3) &&
      (this.body.codigoPostal == null ||
        this.body.codigoPostal == null ||
        this.body.codigoPostal.trim().length < 3) &&
      (this.body.nif == null ||
        this.body.nif == null ||
        this.body.nif.trim().length < 3) &&
      (this.body.correo == null ||
        this.body.correo == null ||
        this.body.correo.trim().length < 3) &&
      (this.body.movil == null ||
        this.body.movil == null ||
        this.body.movil.trim().length < 3) &&
      (this.body.telefono == null ||
        this.body.telefono == null ||
        this.body.telefono.trim().length < 3) &&
      (this.body.idgrupo == undefined ||
        this.body.idgrupo == null ||
        this.body.idgrupo.length < 1) &&
      (this.fechaIncorporacionDesdeSelect == undefined ||
        this.fechaIncorporacionDesdeSelect == null) &&
      (this.fechaIncorporacionHastaSelect == undefined ||
        this.fechaIncorporacionHastaSelect == null) &&
      (this.body.situacion == undefined || this.body.situacion == null) &&
      (this.body.residencia == undefined || this.body.residencia == null) &&
      (this.body.inscrito == undefined || this.body.inscrito == null) &&
      (this.body.sexo == undefined || this.body.sexo == null) &&
      (this.body.idEstadoCivil == undefined ||
        this.body.idEstadoCivil == null) &&
      (this.fechaNacimientoDesdeSelect == undefined ||
        this.fechaNacimientoDesdeSelect == null) &&
      (this.fechaNacimientoHastaSelect == undefined ||
        this.fechaNacimientoHastaSelect == null) &&
      (this.body.tipoCV == undefined || this.body.tipoCV == null) &&
      (this.body.subtipoCV == undefined ||
        this.body.subtipoCV == null ||
        this.body.subtipoCV.length < 1) &&
      (this.body.tipoDireccion == undefined || this.body.tipoDireccion == null)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.apellidos != undefined) {
        this.body.apellidos = this.body.apellidos.trim();
      }
      if (this.body.numColegiado != undefined) {
        this.body.numColegiado = this.body.numColegiado.trim();
      }
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      return true;
    }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  isDisabledCombos() {
    if (this.body.tipoCV != "" && this.body.tipoCV != null) {
      return false;
    } else {
      return true;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  navigateComunicar(dato) {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    this.getDatosComunicar();
  }

  onRowSelectModelos() {}

  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["body"]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.selectedDatos.forEach(element => {
                  let keysValues = [];
                  this.keys.forEach(key => {
                    if (element[key.nombre] != undefined) {
                      keysValues.push(element[key.nombre]);
                    }
                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
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

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      if (this.institucionActual != "2000") {
        this.colegiosSeleccionados = [
          {
            label: n.label,
            value: this.institucionActual
          }
        ];
        this.deshabilitarCombCol = true;
      }
    });
  }
}
