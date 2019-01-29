import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
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
import { ControlAccesoDto } from "../../../models/ControlAccesoDto";

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

  datosCertificates = [];
  colsCertificates;
  selectedCertificates: number = 10;
  generarCertificado: boolean = false;
  checkCertificadoAutomatico: boolean = false;

  rowsPerPage: any = [];
  cols;
  activacionEditar: boolean = false;
  comboEstados: any[];
  comboPrecio: any[];
  comboModoPago: any[];

  comboTipoIdentificacion: SelectItem[];
  selectedTipoIdentificacion: any = {};

  guardarPersona: boolean = false;
  inscripcionInsertada: boolean = false;

  minDateFechaSolicitud: Date;

  isLetrado: boolean = false;
  desactivarBotones: boolean = false;

  checkBody: DatosInscripcionItem = new DatosInscripcionItem();

  //Certificados
  @ViewChild("tableCertificates")
  tableCertificates;

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private cardService: cardService,
    private router: Router,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getComboEstados();
    this.getComboPrecio();
    this.getComboModoPago();
    this.getColsResultsCertificates();

    // Se accede a la ficha de inscripcion desde la busqueda de inscripciones
    if (sessionStorage.getItem("modoEdicionInscripcion") == "true") {
      this.modoEdicion = true;
      this.inscripcion = JSON.parse(
        sessionStorage.getItem("inscripcionCurrent")
      );

      this.checkMinimaAsistencia();
      this.controlCertificadoAutomatico();

      this.searchCourse(this.inscripcion.idCurso);

      // Se accede a la ficha de inscripcion para crearla
      // Para cargar los datos del curso nos enviaran el idCurso
      // y rellenaremos nuestro objeto inscripcion con los datos necesarios del curso
    } else {
      if (
        sessionStorage.getItem("idCursoInscripcion") != undefined &&
        sessionStorage.getItem("idCursoInscripcion") != null
      ) {
        this.minDateFechaSolicitud = new Date();

        let idCurso = sessionStorage.getItem("idCursoInscripcion");
        this.curso.idCurso = idCurso;
        this.searchCourse(idCurso);

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

          // this.modoEdicion = true;
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

          this.checkMinimaAsistencia();
          this.controlCertificadoAutomatico();

          this.inscripcion.fechaSolicitud = this.transformaFecha(
            this.inscripcion.fechaSolicitud
          );
          this.inscripcion.fechaSolicitudDate = this.transformaFecha(
            this.inscripcion.fechaSolicitud
          );

          this.inscripcionInsertada = true;
          this.modoEdicion = true;
          sessionStorage.removeItem("inscripcionActual");
        }

        if (
          sessionStorage.getItem("courseCurrent") != null &&
          sessionStorage.getItem("courseCurrent") != undefined
        ) {
          this.curso = JSON.parse(sessionStorage.getItem("courseCurrent"));
          this.getCertificatesCourse();
          this.compruebaGenerarCertificado();
        }
      }
    }

    this.compruebaAdministrador();

    this.checkAcceso();

    if (
      this.inscripcion.idInscripcion != null &&
      this.inscripcion.idInscripcion != undefined
    ) {
      this.modoEdicion = true;
    } else {
      this.modoEdicion = false;
    }

    // Si es un colegiado y es un letrado, no podrá guardar/restablecer datos de la inscripcion/personales
    if (
      sessionStorage.getItem("isLetrado") != null &&
      sessionStorage.getItem("isLetrado") != undefined
    ) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }
    if (this.isLetrado && !this.modoEdicion) {
      this.desactivarBotones = false;
    } else if (!this.isLetrado && !this.modoEdicion) {
      this.desactivarBotones = false;
    } else {
      this.desactivarBotones = true;
    }

    // Guardamos la inscripcion para la funcioanlidad de "restablecer"
    this.checkBody = JSON.parse(JSON.stringify(this.inscripcion));
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

  cargaInscripcion() {
    this.inscripcion = JSON.parse(sessionStorage.getItem("inscripcionActual"));

    this.inscripcion.fechaSolicitudDate = this.transformaFecha(
      this.inscripcion.fechaSolicitudDate
    );
    this.inscripcion.fechaSolicitud = this.transformaFecha(
      this.inscripcion.fechaSolicitud
    );

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
        if (this.modoEdicion) {
          this.isAdministrador = false;
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
    this.inscripcion.idInstitucion = this.curso.idInstitucion;
    // Por defecto debe aparecer como estado pendiente de aprobacion
    if (this.inscripcion.idEstadoInscripcion == null) {
      this.inscripcion.idEstadoInscripcion = "1";
    }
    if (
      this.inscripcion.fechaSolicitud == null ||
      this.inscripcion.fechaSolicitud == undefined
    ) {
      this.inscripcion.fechaSolicitud = new Date();
    }

    // Guardamos la inscripcion para la funcioanlidad de "restablecer"
    this.checkBody = JSON.parse(JSON.stringify(this.inscripcion));
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
        key: "certificado",
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
      sessionStorage.setItem("isInscripcion", JSON.stringify(true));
      sessionStorage.setItem(
        "codigoCursoInscripcion",
        JSON.stringify(this.inscripcion.idCurso)
      );
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

    sessionStorage.removeItem("modoEdicionInscripcion");
    sessionStorage.removeItem("pantallaListaInscripciones");
    
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

        this.getCertificatesCourse();
        this.compruebaGenerarCertificado();
        this.cargarDatosCursoInscripcion();
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

    // if (!this.modoEdicion && this.isAdministrador) {this.inscripcion.fechaSolicitudDate = this.inscripcion.fechaSolicitud;
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

  mensajeCertificadoEmitido() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Información",
      detail: this.translateService.instant(
        "Ya se ha realizado una solicitud de certificado previa"
      )
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
    this.persona.apellido1 = newformador.primerApellido;
    this.persona.apellido2 = newformador.segundoApellido;

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

  getCertificatesCourse() {
    // obtener certificaciones
    this.sigaServices
      .getParam(
        "fichaCursos_getCertificatesCourse",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.datosCertificates = n.certificadoCursoItem;
          sessionStorage.setItem(
            "datosCertificatesInit",
            JSON.stringify(this.datosCertificates)
          );
        },
        err => {
          console.log(err);
        }
      );
  }

  getColsResultsCertificates() {
    this.colsCertificates = [
      {
        field: "nombreCertificado",
        header: "menu.certificados"
      },
      {
        field: "precio",
        header: "form.busquedaCursos.literal.precio"
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

  onChangeRowsPerPages(event) {
    this.selectedCertificates = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableCertificates.reset();
  }

  compruebaGenerarCertificado() {
    // idEstado = 4 --> Estado finalizado

    // Controlamos cuando debe estar habilitado el botón de generar certificado
    if (
      this.curso.idEstado == "4" &&
      (this.inscripcion.calificacion != null &&
        this.inscripcion.calificacion != undefined &&
        this.inscripcion.calificacion != "")
    )
      this.generarCertificado = true;
    else this.generarCertificado = false;

    // Controlamos cuando debe estar habilitado el check de generar certificado automaticamente
    if (this.curso.idEstado == "4") {
      this.checkCertificadoAutomatico = true;
    } else {
      this.checkCertificadoAutomatico = false;
    }
  }

  actualizarCertificado() {
    if (this.inscripcion.isCertificadoAutomatico)
      this.inscripcion.emitirCertificado = 1;
    else this.inscripcion.emitirCertificado = 0;

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

  controlCertificadoAutomatico() {
    // Controlamos el check de certificado automatico
    if (this.inscripcion.emitirCertificado == 1)
      this.inscripcion.isCertificadoAutomatico = true;
    else this.inscripcion.isCertificadoAutomatico = false;
  }

  generarSolicitudCertificado() {
    if (this.inscripcion.certificadoEmitido == 1) {
      this.mensajeCertificadoEmitido();
    } else {
      this.progressSpinner = true;
      this.sigaServices
        .post("fichaInscripcion_generarSolicitudCertificados", this.inscripcion)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.guardarPersona = false;
            this.inscripcion.certificadoEmitido = 1;
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

  checkMinimaAsistencia() {
    this.progressSpinner = true;
    this.sigaServices
      .post("fichaInscripcion_checkMinimaAsistencia", this.inscripcion)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.inscripcion.checkMinimaAsistencia = JSON.parse(data.body);
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  guardarTODO() {
    let isSave: boolean = false;
    // Comprobar fecha de solicitud de la inscripcion que este rellena
    if (
      this.inscripcion.fechaSolicitud != null &&
      this.inscripcion.fechaSolicitud != undefined
    ) {
      let url = "";
      if (
        this.inscripcion.idInscripcion == null ||
        this.inscripcion.idInscripcion == undefined
      ) {
        url = "fichaInscripcion_saveInscripcion";
        isSave = true;
      } else {
        url = "fichaInscripcion_updateInscripcion";
        isSave = false;
      }

      this.inscripcion.fechaSolicitudDate = this.inscripcion.fechaSolicitud;

      // Si es una persona nueva (no existe en CEN_PERSONA, CEN_CLIENTE, CEN_NO_COLEGIADO), tendremos que crear la persona en las distintas tablas
      if (
        this.editar &&
        this.persona.nombre != undefined &&
        this.persona.apellido1
      ) {
        if (this.persona.apellido2 == undefined) {
          this.persona.apellido2 = "";
        }

        // Se inserta la persona en CEN_PERSONA y CEN_CLIENTE
        this.sigaServices
          .post("fichaPersona_crearNotario", this.persona)
          .subscribe(
            data => {
              this.persona.idPersona = JSON.parse(
                data["body"]
              ).combooItems[0].value;

              this.progressSpinner = true;

              // Se inserta en CEN_NO_COLEGIADO
              this.sigaServices
                .post("fichaInscripcion_guardarPersona", this.persona)
                .subscribe(
                  data => {
                    // Una vez que hemos insertado la nueva persona procedemos a inserta la inscripcion con el idPersona
                    this.inscripcion.idPersona = this.persona.idPersona;

                    this.sigaServices.post(url, this.inscripcion).subscribe(
                      data => {
                        if (isSave) {
                          this.inscripcion.idInscripcion = JSON.parse(
                            data["body"]
                          ).combooItems[0].value;
                        } else {
                          this.inscripcion.idInscripcion = JSON.parse(
                            data["body"]
                          ).id;
                        }

                        this.progressSpinner = false;

                        this.inscripcionInsertada = true;
                        this.modoEdicion = true;

                        this.isAdministrador = false;
                        this.desactivarBotones = true;

                        this.searcInscripcion();
                        this.showSuccess();
                      },
                      err => {
                        this.progressSpinner = false;
                        this.showFail(
                          "La acción no se ha realizado correctamente"
                        );
                        this.inscripcionInsertada = false;
                      },
                      () => {
                        this.progressSpinner = false;
                      }
                    );

                    this.progressSpinner = false;
                    this.editar = false;
                  },
                  error => {
                    this.bodySearch = JSON.parse(error["error"]);
                    this.showFail(
                      JSON.stringify(this.bodySearch.error.message)
                    );
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
      } else if (
        (this.persona.idPersona != null &&
          this.persona.idPersona != undefined) ||
        (this.inscripcion.idPersona != null &&
          this.inscripcion.idPersona != undefined)
      ) {
        // Si la persona ya existe en CEN_PERSONA, CEN_CLIENTE, CEN_NO_COLEGIADO asignaremos el idPersona a la inscripcion
        this.inscripcion.idPersona = this.persona.idPersona;

        this.sigaServices.post(url, this.inscripcion).subscribe(
          data => {
            if (isSave) {
              this.inscripcion.idInscripcion = JSON.parse(
                data["body"]
              ).combooItems[0].value;
            } else {
              this.inscripcion.idInscripcion = JSON.parse(data["body"]).id;
            }

            this.progressSpinner = false;

            this.inscripcionInsertada = true;
            this.modoEdicion = true;

            this.isAdministrador = false;
            this.desactivarBotones = true;

            this.searcInscripcion();
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
      } else {
        this.showFail("Datos de la persona errónea");
      }
    } else {
      this.showFail(
        "Debe de introducir una fecha de solicitud para la inscripción"
      );
    }
  }

  restablecer() {
    this.inscripcion = JSON.parse(JSON.stringify(this.checkBody));
    this.inscripcion.fechaSolicitud = this.arreglarFecha(
      this.inscripcion.fechaSolicitud
    );
  }

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate;
    if (jsonDate.length == 30) {
      rawDate = jsonDate.slice(3, -3);
    } else {
      rawDate = jsonDate.slice(1, -1);
    }
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }

  searcInscripcion() {
    this.sigaServices
      .post(
        "busquedaInscripciones_selectInscripcionByPrimaryKey",
        this.inscripcion
      )
      .subscribe(
        data => {
          this.inscripcion = JSON.parse(data["body"]);
          this.inscripcion.fechaSolicitud = this.arreglarFecha(
            this.inscripcion.fechaSolicitud
          );
          this.progressSpinner = false;
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
