import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";

import { SigaServices } from "../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { DataTable } from "primeng/datatable";
import { esCalendar } from "../../../utils/calendar";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";
import { MultiSelect, Message } from "primeng/primeng";
import { DatosCursosObject } from "../../../models/DatosCursosObject";
import { AuthenticationService } from "../../../_services/authentication.service";
import { Router } from "../../../../../node_modules/@angular/router";
import { ControlAccesoDto } from "../../../models/ControlAccesoDto";

@Component({
  selector: "app-busqueda-cursos",
  templateUrl: "./busqueda-cursos.component.html",
  styleUrls: ["./busqueda-cursos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaCursosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  progressSpinner: boolean = false;

  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  buscar: boolean = false;

  modoHistorico: boolean = true;

  es: any = esCalendar;

  editar: boolean = true;

  //para p-multiselect de temas
  literalMultiselect = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  selectedTemas: any[] = [];

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstados: any[];
  comboDisponibilidadPlazas: any[];
  comboTemas: any[];

  //para deshabilitar combo de visibilidad
  deshabilitarCombVis: boolean = false;

  //para deshabilitar combo de colegios
  deshabilitarCombCol: boolean = false;

  //Para controlar el rango de precios
  formGroupPrecios: FormGroup;

  body: DatosCursosItem = new DatosCursosItem();
  cursoEncontrado = new DatosCursosObject();

  //Para los mensajes de info
  msgs: Message[] = [];

  activacionEditar: boolean = true;
  camposDesactivados: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private router: Router
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nombreCurso: new FormControl(null, Validators.minLength(3)),
      codigoCurso: new FormControl(null, Validators.minLength(3)),
      nombreApellidosFormador: new FormControl(null, Validators.minLength(3))
    });

    this.formGroupPrecios = new FormGroup({
      precioDesde: new FormControl(null, [
        Validators.min(0),
        this.validatePrecioDesde
      ]),
      precioHasta: new FormControl(null, [
        Validators.min(0),
        this.validatePrecioHasta
      ])
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  @ViewChild("mySelect")
  mySelect: MultiSelect;

  ngOnInit() {
    this.getCombos();
    //Se elimina las variables en la sesion storage para que cuando se busque un nuevo curso
    //Se inicialice todo desde el principio
    sessionStorage.removeItem("abrirFormador");
    sessionStorage.removeItem("datosFormadores");
    sessionStorage.removeItem("datosFormadoresInit");
    sessionStorage.removeItem("formador");
    sessionStorage.removeItem("idCurso");
    sessionStorage.setItem("isFormacionCalendar", "false");
    if (sessionStorage.getItem("filtrosBusquedaCursos") != null) {
      this.body = JSON.parse(sessionStorage.getItem("filtrosBusquedaCursos"));
      sessionStorage.removeItem("filtrosBusquedaCursos");
      this.isBuscar(false);
    }
  }

  ngAfterViewInit() {
    this.mySelect.ngOnInit();
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
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

  onChangeSelectVisibilidad(event) {
    if (event.value == 1) {
      this.deshabilitarCombCol = true;
      this.body.colegio = this.authenticationService.getInstitucionSession();
    } else {
      this.deshabilitarCombCol = false;
    }
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
    this.getComboVisibilidad();
    this.getComboColegios();
    this.getComboEstados();
    this.getComboTemas();
  }

  /* INICIO IMPLEMENTACIÓN NUEVOS COMBOS */
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

  getComboEstados() {
    // obtener estados
    this.sigaServices.get("busquedaCursos_estadosCursos").subscribe(
      n => {
        this.comboEstados = n.combooItems;
        this.arregloTildesCombo(this.comboEstados);

        this.getComboDisponibilidadPlazas(); //Llamado desde aquí para que sea asíncrono y su respectivo select pueda pillar la traducción del placeholder
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboDisponibilidadPlazas() {
    this.comboDisponibilidadPlazas = [
      { label: "", value: "" },
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.arregloTildesCombo(this.comboDisponibilidadPlazas);
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

  /* FIN IMPLEMENTACIÓN NUEVOS COMBOS */

  //Busca cursos según los filtros
  isBuscar(flagArchivado: boolean) {
    this.progressSpinner = true;
    this.buscar = true;

    this.selectAll = false;
    this.selectMultiple = false;

    this.selectedDatos = "";
    this.getColsResults();
    this.filtrosTrim();

    if (flagArchivado) {
      this.body.flagArchivado = null; // Para que los traiga todos, archivados y no archivados
      this.modoHistorico = false;
    } else {
      this.body.flagArchivado = 0; // Para que traiga solamente los NO archivados
      this.modoHistorico = true;
    }

    //Rellenamos el array de temas a partir de la estructura del p-multiselect
    this.body.temas = [];
    this.selectedTemas.forEach(element => {
      this.body.temas.push(element.value);
    });

    this.sigaServices
      .postPaginado("busquedaCursos_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.cursoEncontrado = JSON.parse(data["body"]);
          this.datos = this.cursoEncontrado.cursoItem;
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

  isLimpiar() {
    this.body = new DatosCursosItem();
    this.selectedTemas = [];
  }

  crearCurso() {
    sessionStorage.setItem("modoEdicionCurso", "false");
    this.router.navigate(["fichaCurso"]);
  }

  irEditarCurso(selectedDatos) {
    if (selectedDatos.length >= 1 && this.selectMultiple == false) {
      sessionStorage.setItem("modoEdicionCurso", "true");
      sessionStorage.setItem("cursoSelected", JSON.stringify(selectedDatos));
      console.log(selectedDatos);
      this.router.navigate(["/fichaCurso"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
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

  getColsResults() {
    this.cols = [
      {
        field: "visibilidad",
        header: "form.busquedaCursos.literal.visibilidad"
      },
      {
        field: "codigoCurso",
        header: "form.busquedaCursos.literal.codigoCurso"
      },
      {
        field: "nombreCurso",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "estado",
        header: "form.busquedaCursos.literal.estado"
      },
      {
        field: "precioCurso",
        header: "form.busquedaCursos.literal.precio"
      },
      {
        field: "fechaInscripcion",
        header: "form.busquedaCursos.literal.plazoInscripcion"
      },
      {
        field: "fechaImparticion",
        header: "form.busquedaCursos.literal.fechaInicioFechaFin"
      },
      {
        field: "nombreApellidosFormador",
        header: "form.busquedaCursos.literal.tutorResponsable"
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

  /*
   * DIFERENTES ACCIONES SOBRE CURSOS
   */

  duplicarCursos() {
    this.progressSpinner = true;

    //Llamar al rest de duplicar curso
    this.progressSpinner = false;
  }

  archivarCursos() {
    this.progressSpinner = true;

    this.sigaServices
      .post("busquedaCursos_archivar", this.selectedDatos)
      .subscribe(
        data => {
          this.progressSpinner = false;

          if (data != null) {
            let mensaje: string = "";

            if (data.body == 1) {
              mensaje = "form.busquedaCursos.mensaje.curso.archivado";
            } else {
              mensaje = "form.busquedaCursos.mensaje.cursos.archivados";
            }

            this.mostrarInfoAccionSobreCursos(data.body, mensaje);
            this.isBuscar(!this.modoHistorico);
          }
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

  desarchivarCursos(selectedDatos) {
    this.progressSpinner = true;

    this.sigaServices
      .post("busquedaCursos_desarchivar", this.selectedDatos)
      .subscribe(
        data => {
          this.progressSpinner = false;

          if (data != null) {
            let mensaje: string = "";

            if (data.body == 1) {
              mensaje = "form.busquedaCursos.mensaje.curso.desarchivado";
            } else {
              mensaje = "form.busquedaCursos.mensaje.cursos.desarchivados";
            }

            this.mostrarInfoAccionSobreCursos(data.body, mensaje);
            this.isBuscar(!this.modoHistorico);
          }
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

  anunciarCursos() {
    this.progressSpinner = true;

    //Llamar al rest de anunciar curso/s
    this.progressSpinner = false;
  }

  desanunciarCursos() {
    this.progressSpinner = true;

    //Llamar al rest de desanunciar curso/s
    this.progressSpinner = false;
  }

  finalizarCursos() {
    this.progressSpinner = true;

    //Llamar al rest de finalizar curso/s
    this.progressSpinner = false;
  }

  cancelarCursos() {
    this.progressSpinner = true;

    //Llamar al rest de cancelar curso/s
    this.progressSpinner = false;
  }

  /*
   * FIN DIFERENTES ACCIONES SOBRE CURSOS
   */

  /*
   * Para mostrar notificaciones con respecto a las acciones sobre cursos
   */

  mostrarInfoAccionSobreCursos(numCursos, mensaje) {
    //Por si ha habido error y ha resultado un número negativo
    if (numCursos < 0) {
      numCursos = 0;
    }

    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: "Info",
      detail: numCursos + " " + this.translateService.instant(mensaje)
    });
  }

  //Para limpiar la variable de notificaciones
  clear() {
    this.msgs = [];
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

  validateRangoPrecio(g: FormGroup): { [s: string]: boolean } {
    if (
      g.get("precioDesde").value != null &&
      g.get("precioDesde").value != undefined &&
      g.get("precioHasta").value != null &&
      g.get("precioHasta").value != undefined
    ) {
      if (g.get("precioDesde").value > g.get("precioHasta").value) {
        return {
          validateRangoPrecio: true
        };
      }
    }
    return null;
  }

  validatePrecioDesde(f: FormControl): { [s: string]: boolean } {
    if (f) {
      if (
        f.value != null &&
        f.value != undefined &&
        f.parent.get("precioHasta").value != null &&
        f.parent.get("precioHasta").value != undefined
      ) {
        if (f.value > f.parent.get("precioHasta").value) {
          return {
            validatePrecioDesde: true
          };
        }
      }
    }

    return null;
  }

  validatePrecioHasta(f: FormControl): { [s: string]: boolean } {
    if (f) {
      if (
        f.value != null &&
        f.value != undefined &&
        f.parent.get("precioDesde").value != null &&
        f.parent.get("precioDesde").value != undefined
      ) {
        if (f.value < f.parent.get("precioDesde").value) {
          return {
            validatePrecioHasta: true
          };
        }
      }
    }

    return null;
  }

  changeColsAndData() {
    this.datos = [];
    this.body = new DatosCursosItem();
    this.deshabilitarCombVis = false;
    this.deshabilitarCombCol = false;
    this.selectedTemas = [];
  }

  habilitarComboVis() {
    if (this.activacionEditar) return !this.deshabilitarCombVis;
    else return true;
  }

  habilitarComboCol() {
    if (this.activacionEditar) return !this.deshabilitarCombCol;
    else return true;
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "120";
    let derechoAcceso;
    // this.sigaServices.post("acces_control", controlAcceso).subscribe(
    //   data => {
    //     let permisosTree = JSON.parse(data.body);
    //     let permisosArray = permisosTree.permisoItems;
    //     derechoAcceso = permisosArray[0].derechoacceso;
    //   },
    //   err => {
    //     console.log(err);
    //   },
    //   () => {
    //     if (derechoAcceso == 3) {
    //       this.activacionEditar = true;
    //     } else if (derechoAcceso == 2) {
    //       this.activacionEditar = false;
    //     } else {
    //       sessionStorage.setItem("codError", "403");
    //       sessionStorage.setItem(
    //         "descError",
    //         this.translateService.instant("generico.error.permiso.denegado")
    //       );
    //       this.router.navigate(["/errorAcceso"]);
    //     }
    //   }
    // );
  }
}
