import { Component, OnInit } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { DatosInscripcionItem } from "../../../models/DatosInscripcionItem";
import { esCalendar } from "../../../utils/calendar";
import { Location } from "@angular/common";
import { PersonaItem } from "../../../models/PersonaItem";
import { SelectItem } from "primeng/api";
import { cardService } from "../../../_services/cardSearch.service";
import { Router } from "@angular/router";
import { DatosCursosItem } from "../../../models/DatosCursosItem";

@Component({
  selector: "app-ficha-inscripcion",
  templateUrl: "./ficha-inscripcion.component.html",
  styleUrls: ["./ficha-inscripcion.component.scss"]
})
export class FichaInscripcionComponent implements OnInit {
  historico: boolean = false;
  openFicha: boolean = false;
  progressSpinner: boolean = false;
  closeFicha: boolean = true;
  fichasPosibles;
  msgs;
  modoEdicion: boolean = false;
  es: any = esCalendar;
  isValidate: boolean;
  isEditable: boolean = false;

  persona: PersonaItem = new PersonaItem();
  inscripcion: DatosInscripcionItem = new DatosInscripcionItem();
  curso: DatosCursosItem = new DatosCursosItem();
  isAdministrador: Boolean = false;

  rowsPerPage;
  cols;

  comboEstados: any[];
  comboPrecio: any[];
  comboModoPago: any[];

  comboTipoIdentificacion: SelectItem[];
  selectedTipoIdentificacion: any = {};

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private cardService: cardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getComboEstados();
    this.getComboPrecio();
    this.getComboModoPago();
    this.compruebaAdministrador();

    // Se accede a la ficha de inscripcion desde la busqueda de inscripciones
    if (sessionStorage.getItem("modoEdicionInscripcion") == "true") {
      this.modoEdicion = true;
      this.inscripcion = JSON.parse(
        sessionStorage.getItem("inscripcionCurrent")
      );

      // Cargamos la persona con el idPersona que obtenemos de la inscripcion
      this.cargaPersonaInscripcion();

      // Se accede a la ficha de inscripcion para crearla
      // Para cargar los datos del curso nos enviaran el idCurso
      // y rellenaremos nuestro objeto inscripcion con los datos necesarios del curso
    } else {
      if (
        sessionStorage.getItem("idCursoInscripcion") != undefined &&
        sessionStorage.getItem("idCursoInscripcion") != null
      ) {
        let idCurso = sessionStorage.getItem("idCursoInscripcion");
        this.searchCourse(idCurso);
        this.cargarDatosCursoInscripcion();
      }

      // Intentamos cargar los datos de la persona que se ha logueado mediante el token llamando al back
      if (!this.isAdministrador) this.cargarPersonaNuevaInscripcion();
    }
  }

  compruebaAdministrador() {
    this.sigaServices.get("busquedaInscripciones_isAdministrador").subscribe(
      data => {
        if (data != undefined && data != null) {
          this.isAdministrador = JSON.parse(data);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cargarPersonaNuevaInscripcion() {
    this.sigaServices
      .post("busquedaInscripciones_searchPersona", this.inscripcion.idPersona)
      .subscribe(
        data => {
          if (data != undefined && data != null) {
            this.persona = JSON.parse(data["body"]);
            this.obtenerTiposIdentificacion();
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  cargarDatosCursoInscripcion() {
    // Cargamos los datos obtenidos de bbdd del curso a nuestra inscripcion
    this.inscripcion.codigoCurso = this.curso.idCurso;
    this.inscripcion.nombreCurso = this.curso.nombreCurso;
    this.inscripcion.fechaImparticionDesdeFormat = this.curso.fechaImparticionDesde;
    this.inscripcion.fechaImparticionHastaFormat = this.curso.fechaImparticionHasta;
    this.inscripcion.temas = this.curso.temas;
    this.inscripcion.estadoCurso = this.curso.estado;
    this.inscripcion.idEstadoCuso = this.curso.idEstado;
    this.inscripcion.minimaAsistencia = this.curso.minimoAsistencia;
    // Por defecto debe aparecer como estado pendiente de aprobacion
    this.inscripcion.idEstadoInscripcion = "1";
    this.inscripcion.fechaSolicitud = new Date();
  }

  cargaPersonaInscripcion() {
    // Cargamos los datos de la persona asignada a dicha inscripcion
    this.sigaServices
      .post("accesoFichaPersona_searchPersona", this.inscripcion.idPersona)
      .subscribe(
        data => {
          if (data != undefined && data != null) {
            this.persona = JSON.parse(data["body"]);
            this.obtenerTiposIdentificacion();
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  getComboEstados() {
    // obtener estados
    this.sigaServices
      .get("busquedaInscripciones_estadosInscripciones")
      .subscribe(
        n => {
          this.comboEstados = n.combooItems;
          this.arregloTildesCombo(this.comboEstados);
        },
        err => {
          console.log(err);
        }
      );
  }

  getComboPrecio() {
    this.comboPrecio = [
      { label: "Pago Total", value: 0 },
      { label: "Pago Plazos", value: 1 }
    ];

    this.arregloTildesCombo(this.comboPrecio);
  }

  getComboModoPago() {
    this.comboModoPago = [
      { label: "Domiciliación", value: 0 },
      { label: "Contado", value: 1 },
      { label: "Transferencia", value: 2 }
    ];

    this.arregloTildesCombo(this.comboPrecio);
  }

  //FUNCIONES GENERALES
  getFichasPosibles() {
    this.fichasPosibles = [
      {
        key: "curso",
        activa: true
      },
      {
        key: "inscripcion",
        activa: false
      },
      {
        key: "personales",
        activa: false
      },
      {
        key: "pago",
        activa: false
      },
      {
        key: "certificados",
        activa: false
      }
    ];
  }

  //Funciones controlan las fichas
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
    this.openFicha = !this.openFicha;
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

  clear() {
    this.msgs = [];
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

  backTo() {
    this.location.back();
  }

  obtenerTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.comboTipoIdentificacion = n.combooItems;

        // obtener la identificacion a seleccionar
        if (this.persona.tipoIdentificacion != undefined) {
          let ident = this.comboTipoIdentificacion.find(
            item => item.value == this.persona.tipoIdentificacion
          );

          this.selectedTipoIdentificacion = ident.value;
        } else {
          let ident: SelectItem;
          ident.value = "";
          this.selectedTipoIdentificacion = ident;
        }

        this.comprobarValidacion();
      },
      err => {
        console.log(err);
      }
    );
  }

  comprobarValidacion() {
    if (
      (this.persona.tipoIdentificacion != undefined ||
        this.persona.tipoIdentificacion != null) &&
      this.persona.nif != undefined &&
      this.persona.nombre != undefined &&
      this.persona.nombre.trim() != "" &&
      this.persona.apellido1 != undefined &&
      this.persona.apellido2 != ""
    ) {
      this.isValidate = true;
    } else {
      this.isValidate = false;
    }

    this.cardService.newCardValidator$.subscribe(data => {
      data.map(result => {
        result.cardNotario = this.isValidate;
      });
      console.log(data);
    });
  }

  irFichaCurso() {
    sessionStorage.setItem(
      "codigoCursoInscripcion",
      JSON.stringify(this.inscripcion.codigoCurso)
    );
    sessionStorage.setItem("isInscripcion", JSON.stringify(true));
    this.router.navigate(["/fichaCurso"]);
  }

  searchCourse(idCurso) {
    this.progressSpinner = true;
    this.sigaServices.post("fichaCursos_searchCourse", idCurso).subscribe(
      data => {
        this.progressSpinner = false;
        this.curso = JSON.parse(data.body);

        if (this.curso.fechaInscripcionDesdeDate != null) {
          this.curso.fechaInscripcionDesdeDate = new Date(
            this.curso.fechaInscripcionDesdeDate
          );
        }

        if (this.curso.fechaInscripcionHastaDate != null) {
          this.curso.fechaInscripcionHastaDate = new Date(
            this.curso.fechaInscripcionHastaDate
          );
        }
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
}
