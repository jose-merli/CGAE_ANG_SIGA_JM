import { Component, OnInit, ViewChild } from "@angular/core";
import { DatosInscripcionItem } from "../../../models/DatosInscripcionItem";
import { SigaServices } from "../../../_services/siga.service";
import { DataTable } from "../../../../../node_modules/primeng/primeng";
import { esCalendar } from "../../../utils/calendar";

@Component({
  selector: "app-busqueda-inscripciones",
  templateUrl: "./busqueda-inscripciones.component.html",
  styleUrls: ["./busqueda-inscripciones.component.scss"]
})
export class BusquedaInscripcionesComponent implements OnInit {
  showDatosGenerales;
  body: DatosInscripcionItem = new DatosInscripcionItem();
  cols;

  @ViewChild("table")
  table: DataTable;

  selectedItem: number = 10;
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  selectedDatos;

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstados: any[];
  comboTemas: any[];
  comboCertificadoEmitido: any[];
  comboCalificacionEmitida: any[];

  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.getCombos();
  }

  /* INICIO IMPLEMENTACIÓN NUEVOS COMBOS */

  getCombos() {
    this.getComboVisibilidad();
    this.getComboColegios();
    this.getComboEstados();
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

  getComboEstados() {
    // obtener estados
    this.sigaServices.get("busquedaCursos_estadosCursos").subscribe(
      n => {
        this.comboEstados = n.combooItems;
        this.arregloTildesCombo(this.comboEstados);
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
    this.comboCalificacionEmitida = [
      { label: "Sin Calificación", value: 1 },
      { label: "Suspenso", value: 2 },
      { label: "Aprobado", value: 3 },
      { label: "Bien", value: 4 },
      { label: "Notable", value: 5 },
      { label: "Sobresaliente", value: 6 }
    ];

    this.arregloTildesCombo(this.comboCalificacionEmitida);
  }

  getComboTemas() {
    // obtener temas
    this.sigaServices.get("busquedaCursos_temasCursos").subscribe(
      n => {
        this.comboTemas = n.combooItems;
        this.arregloTildesCombo(this.comboTemas);
        // this.mySelect.ngOnInit();
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
        field: "inicioCurso",
        header: "formacion.busquedaInscripcion.inicioCurso"
      },
      {
        field: "finCurso",
        header: "formacion.busquedaInscripcion.finCurso"
      },
      {
        field: "precio",
        header: "form.busquedaCursos.literal.precio"
      },
      {
        field: "fechaSolicitud",
        header: "censo.nuevaSolicitud.fechaSolicitud"
      },
      {
        field: "estadoInscripcion",
        header: "formacion.fichaInscripcion.estadoInscripcion"
      },
      {
        field: "asistencia",
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
}
