import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MultiSelect } from "primeng/primeng";
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
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { DatosInscripcionObject } from "../../../models/DatosInscripcionObject";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { Location } from "@angular/common";

@Component({
  selector: "app-busqueda-inscripciones",
  templateUrl: "./busqueda-inscripciones.component.html",
  styleUrls: ["./busqueda-inscripciones.component.scss"]
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

  displayMotivo: boolean = false;
  tipoAccion: any = "";

  showGuardar: boolean = false;

  calificacion: boolean = false;
  calificacionEmitidaAux: String;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private location: Location,
    private router: Router
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nombreCurso: new FormControl(null, Validators.minLength(3)),
      codigoCurso: new FormControl(null, Validators.minLength(3)),
      nombreApellidosFormador: new FormControl(null, Validators.minLength(3))
    });
  }

  ngOnInit() {
    this.getCombos();
    if (
      (sessionStorage.getItem("formador") != null ||
        sessionStorage.getItem("formador") != undefined) &&
      sessionStorage.getItem("toBackNewFormador") == "true"
    ) {
      sessionStorage.removeItem("toBackNewFormador");
      this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));
    }
  }

  ngAfterViewInit() {
    this.mySelect.ngOnInit();
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
      { label: "", value: 2 },
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.arregloTildesCombo(this.comboCertificadoEmitido);
  }

  getComboPagada() {
    this.comboPagada = [
      { label: "", value: 0 },
      { label: "Sí", value: 1 },
      { label: "No", value: 2 }
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
        field: "fechaImparticionHastaFormat",
        header: "formacion.busquedaInscripcion.finCurso"
      },
      {
        field: "precioCurso",
        header: "form.busquedaCursos.literal.precio"
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
        header: "formacion.busquedaInscripcion.calificacion"
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
        }
      );
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
    this.progressSpinner = true;
    this.selectedDatos[0].motivo = this.body.motivo;
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

                this.mostrarInfoAccionSobreInscripciones(data.body, mensaje);
              }
            } else if (Array<String>(data.body)) {
              let cadenaId: String = "";
              let listaIds: Array<String> = JSON.parse(data.body);
              listaIds.forEach(element => {
                cadenaId += "<br> - " + element;
              });
              mensaje =
                "Los siguientes cursos no tienen plazas disponibles : " +
                cadenaId;
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
      summary: "Incorrecto",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
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

  onCalificacion() {
    this.calificacion = !this.calificacion;
    if (this.calificacion) {
      this.table.selectionMode = "";
      this.selectedDatos = "";
    } else {
      this.table.selectionMode = "multiple";
    }
  }

  //Para limpiar la variable de notificaciones
  clear() {
    this.msgs = [];
  }

  editarCompleto(event) {
    console.log(event);
    let data = event.data;

    if (data.calificacion != null && data.calificacion != undefined) {
      this.datos.forEach((value: DatosInscripcionItem, key: number) => {
        if (value.idInscripcion == data.idInscripcion) {
          value.calificacion = data.calificacion;
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
    this.progressSpinner = true;
    this.datos.forEach((value: DatosInscripcionItem, key: number) => {
      if (value.editar) {
        if (value.calificacion != null && value.calificacion != undefined) {
        }

        this.sigaServices
          .post("busquedaInscripciones_updateCalificacion", value)
          .subscribe(
            data => {
              this.showSuccess("Calificaciones actualizadas correctamente");
              this.progressSpinner = false;
              this.isBuscar();
            },
            error => {
              this.showFail("Ha ocurrido un error");
              this.progressSpinner = false;
            }
          );
      }
      value.editar = false;
    });

    this.onCalificacion();
    this.progressSpinner = false;
  }

  irEditarInscripcion(selectedDatos) {
    if (selectedDatos.length >= 1 && this.selectMultiple == false) {
      sessionStorage.setItem("modoEdicionInscripcion", "true");
      sessionStorage.setItem(
        "inscripcionCurrent",
        JSON.stringify(selectedDatos[0])
      );
      console.log(selectedDatos);
      sessionStorage.setItem("pantallaListaInscripciones", "true");
      this.router.navigate(["/fichaInscripcion"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  backTo() {
    this.location.back();
  }
}
