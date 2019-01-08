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
import { TranslateService } from "../../../commons/translate";
import { PersonaObject } from "../../../models/PersonaObject";

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
  editar: boolean = false;

  persona: PersonaItem = new PersonaItem();
  bodySearch: PersonaObject = new PersonaObject();
  inscripcion: DatosInscripcionItem = new DatosInscripcionItem();
  curso: DatosCursosItem = new DatosCursosItem();
  isAdministrador: boolean = false;
  isNuevoNoColegiado: boolean = false;

  rowsPerPage;
  cols;

  comboEstados: any[];
  comboPrecio: any[];
  comboModoPago: any[];

  comboTipoIdentificacion: SelectItem[];
  selectedTipoIdentificacion: any = {};

  guardarPersona: boolean = false;
  inscripcionInsertada: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private cardService: cardService,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getComboEstados();
    this.getComboPrecio();
    this.getComboModoPago();

    // Se accede a la ficha de inscripcion desde la busqueda de inscripciones
    if (sessionStorage.getItem("modoEdicionInscripcion") == "true") {
      this.modoEdicion = true;
      this.inscripcion = JSON.parse(
        sessionStorage.getItem("inscripcionCurrent")
      );

      // Cargamos la persona con el idPersona que obtenemos de la inscripcion
      // this.cargaPersonaInscripcion();

      this.searchCourse(this.inscripcion.idCurso);
      sessionStorage.removeItem("modoEdicionInscripcion");

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
        this.modoEdicion = false;
        sessionStorage.removeItem("idCursoInscripcion");
        sessionStorage.removeItem("pantallaListaInscripciones");
        
        // Al volver de la busqueda de la persona, entrará por este if
        if (
          (sessionStorage.getItem("formador") != null ||
            sessionStorage.getItem("formador") != undefined) &&
          sessionStorage.getItem("toBackNewFormador") == "true"
        ) {
          this.cargaInscripcion();

          this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));

          this.modoEdicion = true;
          this.inscripcionInsertada = true;
          this.isNuevoNoColegiado = true;
          this.fichasPosibles[2].activa = true;

          sessionStorage.removeItem("formador");
          sessionStorage.removeItem("toBackNewFormador");

          // Si no existe idPersona significa que venimos de busquedaGeneral y que queremos guardar una nueva persona
          if (
            this.persona.idPersona == null ||
            this.persona.idPersona == undefined
          ) {
            this.editar = true;
            this.isNuevoNoColegiado = true;
          }

          // Este sería el caso de ir a la pantalla de busqueda general y pulsar el boton volver
        } else if (sessionStorage.getItem("toBackNewFormador") == "true") {
          this.cargaInscripcion();
          if (
            sessionStorage.getItem("personaInscripcionActual") != null &&
            sessionStorage.getItem("personaInscripcionActual") != undefined
          ) {
            let compruebaString = sessionStorage.getItem(
              "personaInscripcionActual"
            );
            if (compruebaString != "{}") {
              this.persona = JSON.parse(
                sessionStorage.getItem("personaInscripcionActual")
              );
              this.obtenerTiposIdentificacion();
              this.guardarPersona = true;
            }

            sessionStorage.removeItem("personaInscripcionActual");
          }
          this.inscripcionInsertada = true;
          this.modoEdicion = true;
          sessionStorage.removeItem("toBackNewFormador");
          this.fichasPosibles[2].activa = true;
          this.isNuevoNoColegiado = true;
        }
      } else {
        if (
          sessionStorage.getItem("inscripcionActual") != null &&
          sessionStorage.getItem("inscripcionActual") != undefined
        ) {
          this.inscripcion = JSON.parse(
            sessionStorage.getItem("inscripcionActual")
          );
          this.inscripcionInsertada = true;
          this.modoEdicion = true;
          sessionStorage.removeItem("inscripcionActual");
        }
      }
    }

    this.compruebaAdministrador();
  }

  cargaInscripcion() {
    this.inscripcion = JSON.parse(sessionStorage.getItem("inscripcionActual"));

    this.inscripcion.fechaSolicitudDate = new Date(
      this.inscripcion.fechaSolicitudDate
    );
    this.inscripcion.fechaSolicitud = new Date(this.inscripcion.fechaSolicitud);

    sessionStorage.removeItem("inscripcionActual");
  }

  compruebaAdministrador() {
    this.sigaServices.get("busquedaInscripciones_isAdministrador").subscribe(
      data => {
        if (data != undefined && data != null) {
          this.isAdministrador = JSON.parse(data);
        }

        if (!this.isNuevoNoColegiado) {
          if (this.modoEdicion) {
            this.cargaPersonaInscripcion();
          } else {
            if (this.isAdministrador) this.persona = new PersonaItem();
            else this.cargarPersonaNuevaInscripcion();
          }
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

            this.guardarPersona = true;
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
    if (
      this.inscripcion.idPersona != null &&
      this.inscripcion.idPersona != undefined
    ) {
      // Cargamos los datos de la persona asignada a dicha inscripcion
      this.sigaServices
        .post("accesoFichaPersona_searchPersona", this.inscripcion.idPersona)
        .subscribe(
          data => {
            if (data != undefined && data != null) {
              this.persona = JSON.parse(data["body"]);
              this.obtenerTiposIdentificacion();

              this.guardarPersona = true;
            }
          },
          error => {
            console.log(error);
          }
        );
    }
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
        activa: false
      },
      {
        key: "inscripcion",
        activa: true
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

  abreCierraFichaPersonal(key) {
    if (this.inscripcionInsertada || this.modoEdicion) {
      let fichaPosible = this.getFichaPosibleByKey(key);
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
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
    if (
      sessionStorage.getItem("pantallaListaInscripciones") != null &&
      sessionStorage.getItem("pantallaListaInscripciones") != undefined
    ) {
      this.router.navigate(["/buscarInscripciones"]);
      sessionStorage.removeItem("pantallaListaInscripciones");
    } else if (
      sessionStorage.getItem("pantallaFichaCurso") != null &&
      sessionStorage.getItem("pantallaFichaCurso") != undefined
    ) {
      this.router.navigate(["/fichaCurso"]);
      sessionStorage.removeItem("pantallaFichaCurso");
    } else {
      this.location.back();
    }
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
      JSON.stringify(this.inscripcion.idCurso)
    );
    sessionStorage.setItem(
      "inscripcionActual",
      JSON.stringify(this.inscripcion)
    );
    sessionStorage.setItem("isInscripcion", JSON.stringify(true));
    sessionStorage.setItem("modoEdicionCurso", JSON.stringify(true));
    this.router.navigate(["/fichaCurso"]);
  }

  searchCourse(idCurso) {
    this.progressSpinner = true;
    this.sigaServices.post("fichaInscripcion_searchCourse", idCurso).subscribe(
      data => {
        this.progressSpinner = false;
        this.curso = JSON.parse(data.body);
        this.inscripcion.idCurso = this.curso.idCurso;

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

  guardarInscripcion() {
    let url = "";

    this.inscripcion.fechaSolicitudDate = this.inscripcion.fechaSolicitud;

    // if (!this.modoEdicion && this.isAdministrador) {
    //Tendremos que hacer update
    url = "fichaInscripcion_saveInscripcion";
    // }

    this.sigaServices.post(url, this.inscripcion).subscribe(
      data => {
        this.inscripcion.idInscripcion = JSON.parse(
          data["body"]
        ).combooItems[0].value;

        this.progressSpinner = false;

        this.inscripcionInsertada = true;
        this.modoEdicion = true;
        this.showSuccess();
      },
      err => {
        this.progressSpinner = false;
        this.showFail("La acción no se ha realizado correctamente");
        this.inscripcionInsertada = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail(msg) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Información",
      detail: msg
    });
  }

  isSearch() {
    sessionStorage.setItem("abrirFormador", "true");
    sessionStorage.setItem("backFichaInscripcion", "true");
    sessionStorage.setItem("idCursoInscripcion", this.curso.idCurso);

    // Transformamos las fechas para que a la vuelta tengan el formato correcto
    this.inscripcion.fechaSolicitud = this.transformaFecha(
      this.inscripcion.fechaSolicitud
    );
    this.inscripcion.fechaSolicitudDate = this.transformaFecha(
      this.inscripcion.fechaSolicitud
    );

    sessionStorage.setItem(
      "inscripcionActual",
      JSON.stringify(this.inscripcion)
    );
    if (this.persona != null && this.persona != undefined)
      sessionStorage.setItem(
        "personaInscripcionActual",
        JSON.stringify(this.persona)
      );

    this.router.navigate(["/busquedaGeneral"]);
  }

  loadNewTrainer(newformador) {
    this.persona = newformador;
    this.obtenerTiposIdentificacion();
    if (this.persona.nif != null && this.persona.nif != undefined) {
      this.guardarPersona = true;
    }
  }

  actualizaPersona() {
    if (
      this.editar &&
      this.persona.nombre != undefined &&
      this.persona.apellido1
    ) {
      if (this.persona.apellido2 == undefined) {
        this.persona.apellido2 = "";
      }
      this.crearNotarioYGuardar();
    } else {
      this.inscripcion.idPersona = this.persona.idPersona;
      this.sigaServices
        .post("fichaInscripcion_updateInscripcion", this.inscripcion)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.guardarPersona = false;
            this.showSuccess();
          },
          err => {
            this.progressSpinner = false;
            this.showFail("La acción no se ha realizado correctamente");
            this.inscripcionInsertada = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    }
  }

  crearNotarioYGuardar() {
    this.sigaServices.post("fichaPersona_crearNotario", this.persona).subscribe(
      data => {
        this.persona.idPersona = JSON.parse(data["body"]).combooItems[0].value;

        this.progressSpinner = true;

        this.sigaServices
          .post("fichaInscripcion_guardarPersona", this.persona)
          .subscribe(
            data => {
              this.progressSpinner = false;
              this.editar = false;

              // Ultimo paso para actualizar el idPersona con la inscripcion
              this.inscripcion.idPersona = this.persona.idPersona;
              this.sigaServices
                .post("fichaInscripcion_updateInscripcion", this.inscripcion)
                .subscribe(
                  data => {
                    this.progressSpinner = false;
                    this.guardarPersona = false;
                    this.showSuccess();
                  },
                  err => {
                    this.progressSpinner = false;
                    this.showFail("La acción no se ha realizado correctamente");
                    this.inscripcionInsertada = false;
                  },
                  () => {
                    this.progressSpinner = false;
                  }
                );
            },
            error => {
              this.bodySearch = JSON.parse(error["error"]);
              this.showFail(JSON.stringify(this.bodySearch.error.message));
              console.log(error);

              this.showFail("Ha habido un error al crear el notario");
              this.progressSpinner = false;
            },
            () => {
              this.progressSpinner = false;
            }
          );
      },
      error => {
        console.log(error);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  activarGuardarNotarioNoExistente(event) {
    if (
      this.editar &&
      this.persona.nombre != undefined &&
      this.persona.nombre.trim() != "" &&
      this.persona.apellido1 != undefined &&
      this.persona.apellido1 != ""
    ) {
      this.guardarPersona = true;
    } else {
      if (this.editar) {
        this.guardarPersona = false;
      }
    }
  }

  transformaFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(fecha);
    }
    return fecha;
  }
}
