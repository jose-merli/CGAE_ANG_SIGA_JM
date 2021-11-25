import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ViewEncapsulation
} from "@angular/core";
import { Message, MultiSelect, ConfirmationService, Dropdown } from "primeng/primeng";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { DataTable } from "primeng/primeng";
import { DatosInscripcionItem } from "../../../models/DatosInscripcionItem";
import { esCalendar } from "../../../utils/calendar";
import { AuthenticationService } from "../../../_services/authentication.service";
import { SigaServices } from "../../../_services/siga.service";
import { TranslateService } from "../../../commons/translate";
import { Router } from "@angular/router";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { ControlAccesoDto } from "../../../models/ControlAccesoDto";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { DatosInscripcionObject } from "../../../models/DatosInscripcionObject";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { Location } from "@angular/common";
import { CommonsService } from '../../../_services/commons.service';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-inscripciones",
  templateUrl: "./busqueda-inscripciones.component.html",
  styleUrls: ["./busqueda-inscripciones.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaInscripcionesComponent extends SigaWrapper
  implements OnInit {
  showDatosGenerales: boolean = true;
  progressSpinner: boolean = false;
  body: DatosInscripcionItem = new DatosInscripcionItem();
  bodySearch: DatosInscripcionObject = new DatosInscripcionObject();
  cols;
  es: any = esCalendar;
  formBusqueda: FormGroup;
  buscar: boolean = false;

  disabledCalificar: boolean = false;
  valorEstadoCursoFinalizado = "4";

  //para p-multiselect de temas
  literalMultiselect = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  selectedTemas: any[] = [];

  datos: any[];
  numSelected: number = 0;
  fichasPosibles;
  numCheckedTutor: number = 0;

  @ViewChild("table")
  table: DataTable;

  @ViewChild("mySelect")
  mySelect: MultiSelect;

  selectedItem: number = 10;
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  selectedDatos;
  valorCheckPagada: boolean = false;

  editar: boolean = false;

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstadosCursos: any[];
  comboEstadosInscripciones: any[];
  comboTemas: any[];
  comboCertificadoEmitido: any[];
  comboPagada: any[];
  comboCalificacionEmitida: any[];

  //para deshabilitar combo de visibilidad
  deshabilitarCombVis: boolean = false;

  //para deshabilitar combo de colegios
  deshabilitarCombCol: boolean = false;

  msgs: any;

  sortO: any;
  cancelarCursos: any;
  finalizarCursos: any;

  newFormadorCourse: FormadorCursoItem;
  datosFormadores = [];

  inscripcionEncontrado = new DatosInscripcionObject();
  isLetrado: boolean = true;
  displayMotivo: boolean = false;
  tipoAccion: any = "";

  showGuardar: boolean = false;

  calificacion: boolean = false;
  calificacionEmitidaAux: String;
  activacionEditar: boolean = false;


  isCurso: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private location: Location,
    private router: Router,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nombreCurso: new FormControl(null, Validators.minLength(3)),
      codigoCurso: new FormControl(null, Validators.minLength(3)),
      nombreApellidosFormador: new FormControl(null, Validators.minLength(3))
    });
  }
  @ViewChild("dropdown")
  dropdown: Dropdown;

  ngOnInit() {

    this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));

    this.getCombos();
    if (
      (sessionStorage.getItem("formador") != null ||
        sessionStorage.getItem("formador") != undefined) &&
      sessionStorage.getItem("toBackNewFormador") == "true"
    ) {
      sessionStorage.removeItem("toBackNewFormador");

      if (
        sessionStorage.getItem("datosTabla") != null &&
        sessionStorage.getItem("datosTabla") != undefined
      ) {
        // this.datos = JSON.parse(sessionStorage.getItem("datosTabla"));
        this.buscar = true;
        let filtros = JSON.parse(
          sessionStorage.getItem("filtrosBusquedaInscripciones"));

        if (filtros != null && filtros != undefined) {
          this.body = filtros;
          this.parsearFechas(filtros);
        }

        sessionStorage.removeItem("filtrosBusquedaInscripciones");
        sessionStorage.removeItem("datosTabla");

        // this.isBuscar();
      }
      this.isCurso = true;

      this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));
    } else if (
      sessionStorage.getItem("cursoSelected") != null ||
      sessionStorage.getItem("cursoSelected") != undefined
    ) {
      this.body.idCurso = JSON.parse(
        sessionStorage.getItem("cursoSelected")
      ).idCurso;
      this.isCurso = true;
      sessionStorage.removeItem("cursoSelected");

      if (
        sessionStorage.getItem("datosTabla") != null &&
        sessionStorage.getItem("datosTabla") != undefined
      ) {
        // this.datos = JSON.parse(sessionStorage.getItem("datosTabla"));
        this.buscar = true;
        let filtros = JSON.parse(
          sessionStorage.getItem("filtrosBusquedaInscripciones"));

        if (filtros != null && filtros != undefined) {
          this.body = filtros;
          this.parsearFechas(filtros);

        }

        sessionStorage.removeItem("filtrosBusquedaInscripciones");
        sessionStorage.removeItem("datosTabla");
      }
    } else {
      if (
        sessionStorage.getItem("datosTabla") != null &&
        sessionStorage.getItem("datosTabla") != undefined
      ) {
        // this.datos = JSON.parse(sessionStorage.getItem("datosTabla"));
        this.buscar = true;
        let filtros = JSON.parse(
          sessionStorage.getItem("filtrosBusquedaInscripciones"));

        if (filtros != null && filtros != undefined) {
          this.body = filtros;
          this.parsearFechas(filtros);

        }

        sessionStorage.removeItem("filtrosBusquedaInscripciones");
        sessionStorage.removeItem("datosTabla");
      }
    }

    this.selectedDatos = [];
    sessionStorage.removeItem("modoEdicionInscripcion");



    this.checkAcceso();
    if (sessionStorage.getItem("courseCurrent") && this.isCurso) {
      let bodyPerm = JSON.parse(sessionStorage.getItem("courseCurrent"));
      this.body.nombreCurso = bodyPerm.nombreCurso;
      this.body.codigoCurso = bodyPerm.codigoCurso;
      this.isBuscar();
      if (bodyPerm.idEstado == this.valorEstadoCursoFinalizado) {
        this.disabledCalificar = true;
      } else {
        this.disabledCalificar = false;
      }
    }

  }

  parsearFechas(filtros){
    if (filtros.fechaInscripcionDesde != null) {
      this.body.fechaInscripcionDesde = new Date(
        filtros.fechaInscripcionDesde)
      
    }
    if (filtros.fechaInscripcionHasta != null) {
      this.body.fechaInscripcionHasta = new Date(
        filtros.fechaInscripcionHasta)
      
    }
    if (filtros.fechaImparticionDesde != null) {
      this.body.fechaImparticionDesde = new Date(
        filtros.fechaImparticionDesde)
      
    }
    if (filtros.fechaImparticionHasta != null) {
      this.body.fechaImparticionHasta = new Date(
       filtros.fechaImparticionHasta)
      
    }
   }


  clearFilter(dropdown: Dropdown) {
    dropdown.focus();
  }

  ngAfterViewInit() {
    this.mySelect.ngOnInit();
    this.clearFilter(this.dropdown);
  }

  // control de permisos
  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "20B";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso == 3) {
          //permiso total
          this.activacionEditar = true;
        } else if (derechoAcceso == 2) {
          // solo lectura
          this.activacionEditar = false;
        } else {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    );
  }

  /* INICIO IMPLEMENTACIÓN NUEVOS COMBOS */

  getCombos() {
    this.getComboVisibilidad();
    this.getComboColegios();
    this.getComboEstadosCursos();
    this.getComboEstadosInscripciones();
    this.getComboTemas();
    this.getComboCalificacionEmitida();
    this.getComboCertificadoEmitido();
    this.getComboPagada();
    this.getColsResults();
  }

  getComboVisibilidad() {
    // obtener visibilidad
    this.sigaServices.get("busquedaCursos_visibilidadCursos").subscribe(
      n => {
        this.comboVisibilidad = n.combooItems;
        this.arregloTildesCombo(this.comboVisibilidad);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboColegios() {
    // obtener colegios
    this.sigaServices.get("busquedaPer_colegio").subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.arregloTildesCombo(this.comboColegios);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEstadosCursos() {
    // obtener estados
    this.sigaServices.get("busquedaCursos_estadosCursos").subscribe(
      n => {
        this.comboEstadosCursos = n.combooItems;
        this.arregloTildesCombo(this.comboEstadosCursos);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboEstadosInscripciones() {
    // obtener estados
    this.sigaServices
      .get("busquedaInscripciones_estadosInscripciones")
      .subscribe(
        n => {
          this.comboEstadosInscripciones = n.combooItems;
          this.arregloTildesCombo(this.comboEstadosInscripciones);
        },
        err => {
          console.log(err);
        }
      );
  }

  getComboCertificadoEmitido() {
    this.comboCertificadoEmitido = [
      { label: "No", value: 2 },
      { label: "Sí", value: 1 },
      { label: "Todos", value: "" }
    ];

    this.arregloTildesCombo(this.comboCertificadoEmitido);
  }

  getComboPagada() {
    this.comboPagada = [
      { label: "No", value: 2 },
      { label: "Sí", value: 1 }
    ];

    this.arregloTildesCombo(this.comboPagada);
  }

  getComboCalificacionEmitida() {
    // obtener calificaciones emitidas
    this.sigaServices
      .get("busquedaInscripciones_calificacionesEmitidas")
      .subscribe(
        n => {
          this.comboCalificacionEmitida = n.combooItems;
          this.arregloTildesCombo(this.comboCalificacionEmitida);
        },
        err => {
          console.log(err);
        }
      );
    // this.comboCalificacionEmitida = [
    //   { label: "Sin Calificación", value: 1 },
    //   { label: "Suspenso", value: 2 },
    //   { label: "Aprobado", value: 3 },
    //   { label: "Bien", value: 4 },
    //   { label: "Notable", value: 5 },
    //   { label: "Sobresaliente", value: 6 }
    // ];

    // this.arregloTildesCombo(this.comboCalificacionEmitida);
  }

  getComboTemas() {
    // obtener temas
    this.sigaServices.get("busquedaCursos_temasCursos").subscribe(
      n => {
        this.comboTemas = n.combooItems;
        this.arregloTildesCombo(this.comboTemas);
        this.mySelect.ngOnInit();
      },
      err => {
        console.log(err);
      },
      () => {
        this.mySelect.onFilter = function (event) {
          this.visibleOptions = [];
          if (this.copiaSg == undefined) {
            this.copiaSg = [];
            this.copiaSg = this.options;
          } else {
            this.options = this.copiaSg;
          }
          this.options.forEach(element => {
            if (
              element.label.toLowerCase().indexOf(event.currentTarget.value) >=
              0
            ) {
              this.visibleOptions.push(element);
            } else if (
              element.labelSinTilde != undefined &&
              element.labelSinTilde
                .toLowerCase()
                .indexOf(event.currentTarget.value) != -1
            ) {
              this.visibleOptions.push(element);
            }
          });
          this.filtered = true;
          this.filtered = true;
          if (this.visibleOptions.length != 0) {
            this.options = this.visibleOptions;
          }
          if (event.currentTarget.value == "") {
            this.options = this.copiaSg;
          }
        };
      }
    );
  }

  /*
   *
   * Los siguientes métodos son necesarios para obligar a que el rango de fechas introducido sea correcto
   *
   */

  getFechaInscripcionDesde() {
    if (
      this.body.fechaInscripcionDesde != undefined &&
      this.body.fechaInscripcionHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = this.body.fechaInscripcionDesde.getTime();
      let fechaHasta = this.body.fechaInscripcionHasta.getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) this.body.fechaInscripcionDesde = undefined;
    }

    return this.body.fechaInscripcionDesde;
  }

  getFechaInscripcionHasta() {
    if (
      this.body.fechaInscripcionDesde != undefined &&
      this.body.fechaInscripcionHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = this.body.fechaInscripcionDesde.getTime();
      let fechaHasta = this.body.fechaInscripcionHasta.getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) this.body.fechaInscripcionHasta = undefined;
    }
    return this.body.fechaInscripcionHasta;
  }

  getFechaImparticionDesde() {
    if (
      this.body.fechaImparticionDesde != undefined &&
      this.body.fechaImparticionHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = this.body.fechaImparticionDesde.getTime();
      let fechaHasta = this.body.fechaImparticionHasta.getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) this.body.fechaImparticionDesde = undefined;
    }

    return this.body.fechaImparticionDesde;
  }

  getFechaImparticionHasta() {
    if (
      this.body.fechaImparticionDesde != undefined &&
      this.body.fechaImparticionHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = this.body.fechaImparticionDesde.getTime();
      let fechaHasta = this.body.fechaImparticionHasta.getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) this.body.fechaImparticionHasta = undefined;
    }
    return this.body.fechaImparticionHasta;
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

  getColsResults() {
    this.cols = [
      {
        field: "identificacion",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre.apellidos"
      },
      {
        field: "nombreCurso",
        header: "formacion.busquedaInscripcion.nombreCurso"
      },
      {
        field: "estadoCurso",
        header: "formacion.busquedaInscripcion.estadoCurso"
      },
      {
        field: "fechaImparticionDesdeFormat",
        header: "formacion.busquedaInscripcion.inicioCurso"
      },
      {
        field: "fechaSolicitud",
        header: "formacion.busquedaInscripcion.fechaSolicitud"
      },
      {
        field: "estadoInscripcion",
        header: "formacion.busquedaInscripcion.estadoInscripcion"
      },
      {
        field: "minimaAsistencia",
        header: "formacion.busquedaInscripcion.asistencia"
      },
      {
        field: "calificacion",
        header: "formacion.busquedaInscripcion.calificacion",
        idEstadoCurso: "idEstadoCurso",
        idEstadoInscripcion: "idEstadoInscripcion"
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

  //Busca inscripciones según los filtros
  isBuscar() {
    if (this.checkFilters()) {
      if (this.table != null && this.table != undefined) {
        this.table.selectionMode = "multiple";
        this.calificacion = false;
      }

      this.progressSpinner = true;
      this.buscar = true;

      this.selectAll = false;
      this.selectMultiple = false;
      this.numSelected = 0;

      this.selectedDatos = "";
      this.getColsResults();
      this.filtrosTrim();

      //Rellenamos el array de temas a partir de la estructura del p-multiselect
      this.body.temas = [];
      this.selectedTemas.forEach(element => {
        this.body.temas.push(element.value);
      });

      this.sigaServices
        .postPaginado("busquedaInscripciones_search", "?numPagina=1", this.body)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.inscripcionEncontrado = JSON.parse(data["body"]);
            this.datos = this.inscripcionEncontrado.inscripcionItem;
            this.table.paginator = true;
          },
          err => {
            console.log(err);
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

  

  checkFilters() {
    if (this.body.codigoCurso == undefined) this.body.codigoCurso = "";
    if (
      (this.body.visibilidad == undefined || this.body.visibilidad == "") &&
      (this.body.colegio == undefined || this.body.colegio == "") &&
      (this.body.codigoCurso == undefined || this.body.codigoCurso == "" || this.body.codigoCurso.trim().length < 3) &&
      (this.body.nombreCurso == undefined || this.body.nombreCurso == "" || this.body.nombreCurso.trim().length < 3) &&
      (this.body.idEstadoInscripcion == undefined || this.body.idEstadoInscripcion == "") &&
      (this.body.idEstadoCurso == undefined || this.body.idEstadoCurso == "") &&
      (this.body.fechaInscripcionDesde == undefined) &&
      (this.body.fechaInscripcionHasta == undefined) &&
      (this.body.fechaImparticionDesde == undefined) &&
      (this.body.fechaImparticionHasta == undefined) &&
      (this.body.certificadoEmitido == undefined) &&
      (this.body.calificacion == undefined) &&
      (this.body.pagada == undefined) &&
      (this.body.nombreApellidosFormador == undefined || this.body.nombreApellidosFormador == "") &&
      (this.selectedTemas == undefined || this.selectedTemas.length == 0)) {
      this.showSearchIncorrect();
      return false;
    } else {
      if (!this.formBusqueda.valid && this.body.codigoCurso != "") {
        this.showSearchIncorrect();
        return false;
      } else {
        // quita espacios vacios antes de buscar
        if (this.body.nombreCurso != undefined) {
          this.body.nombreCurso = this.body.nombreCurso.trim();
        }
        if (this.body.nombreApellidosFormador != undefined) {
          this.body.nombreApellidosFormador = this.body.nombreApellidosFormador.trim();
        }
        if (this.body.codigoCurso != undefined) {
          this.body.codigoCurso = this.body.codigoCurso.trim();
        }
        return true;
      }

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



  //Elimina los espacios en blancos finales e iniciales de los inputs de los filtros
  filtrosTrim() {
    if (this.body.codigoCurso != null) {
      this.body.codigoCurso = this.body.codigoCurso.trim();
    }

    if (this.body.nombreCurso != null) {
      this.body.nombreCurso = this.body.nombreCurso.trim();
    }
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

  obtenerFormador() {
    sessionStorage.setItem("abrirFormador", "true");
    sessionStorage.setItem("backInscripcion", "true");
    sessionStorage.setItem(
      "filtrosBusquedaInscripciones",
      JSON.stringify(this.body)
    );

    if (this.datos != null && this.datos != undefined) {
      sessionStorage.setItem("datosTabla", JSON.stringify(this.datos));

    }
    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");

    let migaPan = this.translateService.instant("formacion.busquedaInscripcion.cabecera");
    let menuProcede = this.translateService.instant("menu.formacion");
    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("menuProcede", menuProcede);

    this.router.navigate(["/busquedaGeneral"]);
  }

  loadNewTrainer(newformador) {
    this.body.nombreApellidosFormador =
      newformador.nombre + " - " + newformador.apellidos;
    this.body.idFormador = newformador.idPersona;
  }

  changeColsAndData() {
    this.datos = [];
    this.body = new DatosInscripcionItem();
    this.deshabilitarCombVis = false;
    this.deshabilitarCombCol = false;
    this.selectedTemas = [];
    this.clearInformador();
  }

  onChangeSelectColegio(event) {
    if (
      event.value != "" &&
      event.value != this.authenticationService.getInstitucionSession()
    ) {
      //Si elige un colegio que no es el propio, se deshabilita el combo de visibilidad y se selecciona 'Público' por defecto ya que los privados no deben mostrarse
      this.deshabilitarCombVis = true;
      this.body.idVisibilidad = "0"; //Visibilidad pública
    } else {
      this.deshabilitarCombVis = false;
    }
  }

  onChangeSelectVisibilidad(event) {
    if (event.value == 1) {
      this.deshabilitarCombCol = true;
      this.body.colegio = this.authenticationService.getInstitucionSession();
    } else {
      this.deshabilitarCombCol = false;
    }
  }

  abrirPopUpMotivo(accion) {
    this.displayMotivo = true;
    // Accion
    // 0 --> Aprobar
    // 1 --> Cancelar
    // 2 --> Rechazar
    // this.tipoAccion = accion;
    this.selectedDatos[0].tipoAccion = accion;
    this.tipoAccion = accion;
  }

  comprobarCampoMotivo() {
    if (
      this.body.motivo != undefined &&
      this.body.motivo != "" &&
      this.body.motivo.trim() != ""
    ) {
      this.showGuardar = true;
    } else {
      this.showGuardar = false;
    }
  }

  guardarAccion() {
    this.callAction();
    // let mess = "";
    // mess =
    //   "¿Desea enviar un aviso a los incritos que fueron rechazados o cancelados de que existen plazas disponibles?";
    // let icon = "fa fa-edit";

    // if (this.tipoAccion == 2 || this.tipoAccion == 1) {
    //   this.confirmationService.confirm({
    //     message: mess,
    //     icon: icon,
    //     accept: () => {
    //       //Enviar aviso por parametro
    //       this.callAction();
    //     },
    //     reject: () => {
    //       this.msgs = [
    //         {
    //           severity: "info",
    //           summary: this.translateService.instant(
    //             "general.message.cancelado"
    //           ),
    //           detail: "Aviso cancelado"
    //         }
    //       ];
    //       this.callAction();
    //     }
    //   });
    // } else {
    //   this.callAction();
    // }
  }

  callAction() {
    this.selectedDatos[0].motivo = this.body.motivo;
    this.progressSpinner = true;
    this.sigaServices
      .post("busquedaInscripciones_updateEstado", this.selectedDatos)
      .subscribe(
        data => {
          this.progressSpinner = false;

          if (data != null) {
            let mensaje: string = "";
            if (Number(data.body)) {
              if (data.body == 1) {
                if (this.tipoAccion == 0)
                  // Inscripcion aprobada
                  mensaje =
                    "form.busquedaInscripciones.mensaje.inscripcion.aprobada";
                if (this.tipoAccion == 1)
                  // Inscripcion cancelada
                  mensaje =
                    "form.busquedaInscripciones.mensaje.inscripcion.cancelada";
                if (this.tipoAccion == 2)
                  // Inscripcion rechazada
                  mensaje =
                    "form.busquedaInscripciones.mensaje.inscripcion.rechazada";
              } else {
                if (this.tipoAccion == 0)
                  // Inscripciones aprobadas
                  mensaje =
                    "form.busquedaInscripciones.mensaje.inscripciones.aprobadas";
                if (this.tipoAccion == 1)
                  // Inscripciones canceladas
                  mensaje =
                    "form.busquedaInscripciones.mensaje.inscripciones.canceladas";
                if (this.tipoAccion == 2)
                  // Inscripciones rechazadas
                  mensaje =
                    "form.busquedaInscripciones.mensaje.inscripciones.rechazadas";
              }
              this.mostrarInfoAccionSobreInscripciones(data.body, mensaje);
            } else if (Array<String>(data.body)) {
              // let cadenaId: String = "";
              // let listaIds: Array<String> = JSON.parse(data.body);
              // listaIds.forEach(element => {
              //   cadenaId += "<br> - " + element;
              // });
              let mensajeAccion: string;

              if (this.tipoAccion == 0)
                // Inscripcion aprobada
                mensajeAccion = "aprobar";
              if (this.tipoAccion == 1)
                // Inscripcion cancelada
                mensajeAccion = "cancelar";
              if (this.tipoAccion == 2)
                // Inscripcion rechazada
                mensajeAccion = "rechazar";

              mensaje =
                "Uno o varios cursos no permiten " +
                mensajeAccion +
                " inscripciones";

              this.showFail(mensaje);
            }

            this.isBuscar();
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          this.cerrarMotivo();
        }
      );
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  showGenericFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  showMessageCalificacion(mensaje: string, tipo: string) {
    // this.msgs = [];
    this.msgs.push({ severity: tipo, summary: "", detail: mensaje });
  }

  cerrarMotivo() {
    this.displayMotivo = false;
    this.body.motivo = "";
  }

  mostrarInfoAccionSobreInscripciones(numInscripciones, mensaje) {
    //Por si ha habido error y ha resultado un número negativo
    if (numInscripciones < 0) {
      numInscripciones = 0;
    }

    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: "Info",
      detail: numInscripciones + " " + this.translateService.instant(mensaje)
    });
  }

  infoCalificar() {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: "Info",
      detail: this.translateService.instant("message.informativo.busquedaInscripciones.calificacion")
    });
  }

  onCalificacion() {
    this.calificacion = !this.calificacion;

    if (this.calificacion) {
      this.infoCalificar();
    }

    if (this.calificacion) {
      this.table.selectionMode = "";
      this.selectedDatos = [];
    } else {
      this.table.selectionMode = "multiple";
    }
  }

  //Para limpiar la variable de notificaciones
  clear() {
    this.msgs = [];
  }

  editarCompleto(event, dato) {
    console.log(event);
    let data = event;

    if (data != null && data != undefined) {
      this.datos.forEach((value: DatosInscripcionItem, key: number) => {
        if (value.idInscripcion == dato.idInscripcion) {
          let CALIFICACION_REX = /^([0-9]{1})(\.\d{1,2})?$|10$/;
          if (
            !CALIFICACION_REX.test(value.calificacion) &&
            value.calificacion != null
          ) {
            event.currentTarget.value = "10";
            dato.calificacion = 10;
          }
          value.calificacion = dato.calificacion;
          value.editar = true;
        }
      });
    }
  }

  guardarCodigo(event) {
    let data = event.data;
    this.calificacionEmitidaAux = data.calificacion;
  }

  guardarCalificacion() {
    this.msgs = [];
    let CALIFICACION_REX = /^([0-9]{1})(\.\d{1,2})?$|10$/;
    this.progressSpinner = true;
    this.datos.forEach((value: DatosInscripcionItem, key: number) => {
      if (value.editar) {
        // value.calificacion = value.calificacion.replace(",", ".");
        if (
          CALIFICACION_REX.test(value.calificacion) ||
          value.calificacion == null
        ) {
          this.sigaServices
            .post("busquedaInscripciones_updateCalificacion", value)
            .subscribe(
              data => {
                this.showMessageCalificacion(
                  this.translateService.instant(
                    "formacion.mensaje.actualizar.calificacion.correctamente"
                  ),
                  "success"
                );
                this.progressSpinner = false;
                value.editar = false;
                this.isBuscar();
              },
              error => {
                this.showMessageCalificacion(
                  this.translateService.instant(
                    "formacion.mensaje.general.mensaje.error"
                  ),
                  "error"
                );
                this.onCalificacion();
                this.progressSpinner = false;
              }
            );
        } else {
          this.onCalificacion();
          this.showMessageCalificacion(
            this.translateService.instant(
              "formacion.mensaje.general.calificacion.errorea"
            ),
            "error"
          );
          this.progressSpinner = false;
        }
      }
    });

    this.onCalificacion();
    this.progressSpinner = false;
  }

  irEditarInscripcion(selectedDatos) {
    if (selectedDatos.length >= 1) {
      sessionStorage.setItem("modoEdicionInscripcion", "true");
      sessionStorage.setItem(
        "inscripcionCurrent",
        JSON.stringify(selectedDatos[0])
      );
      console.log(selectedDatos);
      sessionStorage.removeItem("isCancelado");
      sessionStorage.setItem("pantallaListaInscripciones", "true");
      sessionStorage.setItem("datosTabla", JSON.stringify(this.datos));
      sessionStorage.setItem(
        "filtrosBusquedaInscripciones",
        JSON.stringify(this.body)
      );
      this.router.navigate(["/fichaInscripcion"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  backTo() {
    sessionStorage.removeItem("cursoSelected");
    // sessionStorage.removeItem("courseCurrent");
    if (
      sessionStorage.getItem("pantallaFichaCurso") != null &&
      sessionStorage.getItem("pantallaFichaCurso") != undefined
    ) {
      sessionStorage.setItem(
        "codigoCursoInscripcion",
        JSON.stringify(this.body.idCurso)
      );
      this.router.navigate(["/fichaCurso"]);
      sessionStorage.removeItem("pantallaFichaCurso");
    } else {
      this.location.back();
    }
    // this.location.back();
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  fillFechaInscripcionDesde(event) {
    this.body.fechaInscripcionDesde = event;
  }

  fillFechaInscripcionHasta(event) {
    this.body.fechaInscripcionHasta = event;
  }

  fillFechaImparticionDesde(event) {
    this.body.fechaImparticionDesde = event;
  }

  fillFechaImparticionHasta(event) {
    this.body.fechaImparticionHasta = event;
  }

  clearInformador() {
    this.body.nombreApellidosFormador = undefined;
    this.body.idFormador = undefined;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      if (!this.displayMotivo) {
        this.isBuscar();
      }
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.mySelect.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}
