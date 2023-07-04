import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener
} from "@angular/core";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { DatePipe } from "../../../../../node_modules/@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../node_modules/@angular/router";
import {
  DataTable,
  MultiSelect
} from "../../../../../node_modules/primeng/primeng";
import { TranslateService } from "../../../commons/translate";
import { DatosNoColegiadosObject } from "../../../models/DatosNoColegiadosObject";
import { NoColegiadoItem } from "../../../models/NoColegiadoItem";
import { SigaServices } from "../../../_services/siga.service";
import { SubtipoCurricularItem } from "../../../models/SubtipoCurricularItem";
import { CommonsService } from '../../../_services/commons.service';
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-no-colegiados",
  templateUrl: "./busqueda-no-colegiados.component.html",
  styleUrls: ["./busqueda-no-colegiados.component.scss"],
  encapsulation: ViewEncapsulation.None
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
  comboTipoCV: any;
  comboSubtipoCV: any;
  comboSexo: any;
  comboColegios: any[];
  progressSpinner: boolean = false;
  resultadosPoblaciones: any;
  sortO: number = 1;
  editar: boolean = true;
  textFilter: String = "Seleccionar";
  body: NoColegiadoItem = new NoColegiadoItem();
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  isEditable: boolean = false;
  buscar: boolean = false;
  es: any;

  historico: boolean = false;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  cols: any;
  datos: any;
  rowsPerPage: any;
  selectMultiple: boolean = false;
  isMultiple: string = "single";
  selectedItem: number = 10;
  selectAll: boolean = false;
  numSelected: number = 0;

  fechaNacimientoHastaSelect: Date;
  fechaNacimientoDesdeSelect: Date;

  noColegiadoSearch = new DatosNoColegiadosObject();
  subtipoCurricular: SubtipoCurricularItem = new SubtipoCurricularItem();
  subtipoCV: string[];
  noResultsSubtipos: boolean = true;

  msgs: Message[];
  showDatosGeneneralesAvanzado: boolean = false;
  showDatosDireccion: boolean = false;
  showDatosGenerales: boolean = true;

  institucionActual: any;
  deshabilitarCombCol: boolean = false;
  colegiosSeleccionados: any[] = [];

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  currentRoute: String;
  idClaseComunicacion: String;
  keys: any[] = [];

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
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService
  ) {
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3))
    });
  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    sessionStorage.removeItem("busquedaCensoGeneral");
    sessionStorage.removeItem("disabledAction");
    sessionStorage.removeItem("filtrosBusquedaColegiados");
    sessionStorage.removeItem("busqueda");
    sessionStorage.removeItem("esNuevoNoColegiado");
    sessionStorage.removeItem("nuevoNoColegiado");
    sessionStorage.removeItem("nuevoNoColegiadoGen");
    sessionStorage.removeItem('consultasSearch');
    sessionStorage.removeItem("abrirSociedad");
    sessionStorage.removeItem("abrirSolicitudIncorporacion");

    this.getLetrado();

    this.es = this.translateService.getCalendarLocale();
    // sessionStorage.removeItem("esColegiado");
    if (
      sessionStorage.getItem("filtrosBusquedaNoColegiadosFichaColegial") != null
    ) {
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaNoColegiadosFichaColegial")
      );
    }

    // Obtener Combos
    this.progressSpinner = true;
    this.getCombos();
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

  //Funcion que carga todos los combos de los filtros de la pantalla
  getCombos() {
    this.getComboProvincias();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboSexo();
    this.getComboTipoDireccion();
    this.getComboEtiquetas();
    this.getComboColegios();
  }

  getComboColegios() {
    // obtener colegios
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.comboColegios = n.combooItems;
        // this.arregloTildesCombo(this.comboColegios);

        this.getInstitucion();

        if (
          sessionStorage.getItem("filtrosBusquedaNoColegiadosFichaColegial") != null
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
          if (this.body.historico) {
            if (this.checkFiltersInit()) {
              this.isBuscar(true);
            }
          } else {
            if (this.checkFiltersInit()) {
              this.isBuscar(false);
            }
          }
          sessionStorage.removeItem("filtrosBusquedaNoColegiadosFichaColegial");
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  //Funcion que carga combo del campo sexo
  getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" }
    ];
  }

  //Funcion que carga combo del campo estado civil
  getComboEstadoCivil() {
    this.sigaServices.get("busquedaNoColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.arregloTildesCombo(this.comboEstadoCivil);
      },
      err => {
        //console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo etiquetas
  getComboEtiquetas() {
    this.sigaServices.get("busquedaPerJuridica_etiquetas").subscribe(
      n => {

        this.comboEtiquetas = [];
        let array = n.comboItems;

        array.forEach(element => {
          let e = { label: element.label, value: { label: element.label, value: element.value, idInstitucion: element.idInstitucion } };
          this.comboEtiquetas.push(e);
        });

        this.arregloTildesCombo(this.comboEtiquetas);
      },
      err => {
        //console.log(err);
      }
    );
  }

  //Funcion que carga combo del campo tipo direccion
  getComboTipoDireccion() {
    this.sigaServices.get("busquedaNoColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTipoDireccion = n.combooItems;
        this.arregloTildesCombo(this.comboTipoDireccion);
      },
      err => {
        //console.log(err);
      }
    );
  }

  clickFila(event) {
    if (event.data && !event.data.fechaBaja && this.historico)
      this.selectedDatos.pop();
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  //Funcion que carga combo del campo curricular
  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaNoColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
        this.arregloTildesCombo(this.comboCategoriaCurricular);
      },
      err => {
        //console.log(err);
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
        //console.log(err);
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
        error => { },
        () => { }
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

  //Tipo Curricular
  onChangeCategoriaCurricular(event) {
    if (event.value != null) {
      if (event) {
        this.getComboTipoCurricular(event.value);
        this.getComboSubtipoCurricular(event.value);
      }
    }
  }

  //TipoCurricular
  getComboTipoCurricular(idTipoCV) {
    this.sigaServices
      .getParam(
        "busquedaNoColegiados_getCurricularTypeCombo",
        "?idTipoCV=" + idTipoCV
      )
      .subscribe(
        n => {
          this.comboTipoCV = n.combooItems;
          this.arregloTildesCombo(this.comboTipoCV);
        },
        error => { },
        () => { }
      );
  }

  //SubtipoCurricular
  getComboSubtipoCurricular(idTipoCV) {
    this.sigaServices
      .getParam(
        "busquedaNoColegiados_getCurricularSubtypeCombo",
        "?idTipoCV=" + idTipoCV
      )
      .subscribe(
        n => {
          this.comboSubtipoCV = n.combooItems;
          this.arregloTildesCombo(this.comboSubtipoCV);
        },
        error => { },
        () => { }
      );
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
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.almenosTres");
        this.body.idPoblacion = null;
      }
    } else {
      this.comboPoblacion = [];
      this.body.idPoblacion = null;
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
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
    if (!this.historico) {
      if (this.selectAll === true) {
        this.selectMultiple = false;
        this.selectedDatos = this.noColegiadoSearch.noColegiadoItem;
        this.numSelected = this.noColegiadoSearch.noColegiadoItem.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    } else {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.noColegiadoSearch.noColegiadoItem.filter(dato => dato.fechaBaja != undefined && dato.fechaBaja != null)
        this.numSelected = this.selectedDatos.length;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectMultiple = false;
      }
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
    // this.sigaServices.get("getLetrado").scribe(
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
    //     //console.log(err);
    //   }
    // );
  }

  //Busca No colegiados según los filtros
  isBuscar(flagArchivado: boolean) {
    if (this.checkFilters()) {
      this.selectAll = false;
      this.buscar = true;

      if (flagArchivado) {
        this.body.historico = true;
        this.historico = true;
      } else {
        this.body.historico = false;
        this.historico = false;
      }

      this.selectMultiple = false;
      this.selectedDatos = [];
      this.getColsResults();
      this.filtrosTrim();

      this.body.fechaNacimientoRango = [];
      this.body.fechaNacimientoRango[1] = this.fechaNacimientoHastaSelect;
      this.body.fechaNacimientoRango[0] = this.fechaNacimientoDesdeSelect;

      this.progressSpinner = true;

      this.body.colegio = [];
      this.colegiosSeleccionados.forEach(element => {
        this.body.colegio.push(element.value);
      });

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
            //console.log(err);
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

  toHistorico() {
    this.historico = true;
    this.body.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = [];
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
          //console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }

  isLimpiar() {
    this.body = new NoColegiadoItem();
    this.fechaNacimientoDesdeSelect = undefined;
    this.fechaNacimientoHastaSelect = undefined;
  }

  isCrear() {
    // sessionStorage.removeItem("personaBody");
    // sessionStorage.setItem(
    //   "filtrosBusquedaNoColegiados",
    //   JSON.stringify(this.body)
    // );
    // sessionStorage.setItem("esColegiado", "false");
    // sessionStorage.setItem("esNuevoNoColegiado", "true");
    // this.router.navigate(["/fichaColegial"]);
    sessionStorage.removeItem("editedSolicitud");
    sessionStorage.setItem("consulta", "false");
    sessionStorage.setItem("solicitudIncorporacion", "true");
    sessionStorage.setItem("nuevoNoColegiadoGen", "true");

    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");

    let migaPan = this.translateService.instant("censo.busquedaClientes.busquedaNoColegiados.titulo");
    let menuProcede = this.translateService.instant("menu.censo");
    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("menuProcede", menuProcede);

    // this.router.navigate(["/nuevaIncorporacion"]);
    this.router.navigate(["/busquedaGeneral"]);
  }

  deleteSeleccion(selectedDatos) {

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
          //console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.historico = true;
          this.selectedDatos = [];
          this.numSelected = 0;
          this.isBuscar(false);
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
        element.fechaNacimientoDate = null;
      } else {
        var posIni = element.fechaNacimiento.indexOf("-");
        var posFin = element.fechaNacimiento.lastIndexOf("-");
        var year = element.fechaNacimiento.substring(posIni, 0);
        var day = element.fechaNacimiento.substring(
          posFin + 1,
          element.fechaNacimiento.length - 11
        );
        var month = element.fechaNacimiento.substring(posIni + 1, posFin);
        element.fechaNacimientoDate = new Date(year, month - 1, day);
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
      // {
      //   field: "colegioResultado",
      //   header: "censo.busquedaClientesAvanzada.literal.colegio"
      // },
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "fechaNacimientoDate",
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
    id = [id];
    if (id.length >= 1) {
      sessionStorage.removeItem("personaBody");
      sessionStorage.setItem(
        "filtrosBusquedaNoColegiados",
        JSON.stringify(this.body)
      );
      sessionStorage.setItem("esColegiado", "false");
      sessionStorage.setItem("personaBody", JSON.stringify(id[0]));

      if (id[0].fechaBaja != null) {
        sessionStorage.setItem("disabledAction", "true");
      } else {
        sessionStorage.setItem("disabledAction", "false");
      }

      this.router.navigate(["/fichaColegial"]);
    }
  }

  checkFilters() {
    if (
      (this.body.nombre == null ||
        this.body.nombre == null ||
        this.body.nombre.trim().length < 3) &&
      (this.body.apellidos == null ||
        this.body.apellidos == null ||
        this.body.apellidos.trim().length < 3) &&
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
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      return true;
    }
  }

  checkFiltersInit() {
    if (
      (this.body.nombre == null ||
        this.body.nombre == null ||
        this.body.nombre.trim().length < 3) &&
      (this.body.apellidos == null ||
        this.body.apellidos == null ||
        this.body.apellidos.trim().length < 3) &&
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
      return false;
    } else {
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
      this.isBuscar(false);
    }
  }

  onHideDatosGeneralesAvanzados() {
    this.showDatosGeneneralesAvanzado = !this.showDatosGeneneralesAvanzado;
  }

  onHideDireccion() {
    this.showDatosDireccion = !this.showDatosDireccion;
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }


  navigateComunicar(dato) {
    sessionStorage.setItem("filtrosBusquedaNoColegiadosFichaColegial", JSON.stringify(this.body));
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

  fillFechaNacimientoDesde(event) {
    this.fechaNacimientoDesdeSelect = event;
  }

  fillFechaNacimientoHasta(event) {
    this.fechaNacimientoHastaSelect = event;
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

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}