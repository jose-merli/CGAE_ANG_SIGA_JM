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
  cols;
  es: any = esCalendar;
  formBusqueda: FormGroup;
  buscar: boolean = false;
  selectedTemas: any[] = [];
  datos: any[];
  numSelected: number = 0;

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

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstadosCursos: any[];
  comboEstadosInscripciones: any[];
  comboTemas: any[];
  comboCertificadoEmitido: any[];
  comboCalificacionEmitida: any[];

  msgs: any;
  clear: any;
  sortO: any;
  cancelarCursos: any;
  finalizarCursos: any;
  
  inscripcionEncontrado = new DatosInscripcionObject();

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
  }

  ngOnInit() {
    this.getCombos();
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
      { label: "Sí", value: 1 },
      { label: "No", value: 0 }
    ];

    this.arregloTildesCombo(this.comboCertificadoEmitido);
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
  isBuscar(flagArchivado: boolean) {
    this.progressSpinner = true;
    this.buscar = true;

    this.selectAll = false;
    this.selectMultiple = false;

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
}
