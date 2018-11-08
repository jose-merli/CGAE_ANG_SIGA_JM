import { Component, OnInit, ViewChild } from "@angular/core";
import { SigaServices } from "../../../_services/siga.service";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import { Router } from "../../../../../node_modules/@angular/router";
import { esCalendar } from "../../../utils/calendar";
import { Location } from "@angular/common";
import { FormadorCursoItem } from "../../../models/FormadorCursoItem";
import { Table } from "../../../../../node_modules/primeng/table";
import { FormadorCursoObject } from "../../../models/FormadorCursoObject";
import { ErrorItem } from "../../../models/ErrorItem";

@Component({
  selector: "app-ficha-curso",
  templateUrl: "./ficha-curso.component.html",
  styleUrls: ["./ficha-curso.component.scss"]
})
export class FichaCursoComponent implements OnInit {
  openFicha;
  fichasPosibles;
  msgs;
  results;
  es: any = esCalendar;
  marginPx = "4px";
  bw = "white";

  modoEdicion: boolean = false;
  progressSpinner: boolean = false;
  curso: DatosCursosItem;
  temasSuggest;

  // COMBOS
  comboVisibilidad: any[];
  comboColegios: any[];
  comboEstados: any[];
  comboDisponibilidadPlazas: any[];
  comboTemas: any[];

  //Generales
  backgroundColor;

  //Formadores
  @ViewChild("tableFormadores")
  tableFormadores;

  colsFormadores;
  selectedItemFormadores;
  datosFormadores = [];
  selectedDatosFormadores;
  selectAllFormadores: any;
  selectedFormadores: number = 10;
  selectMultipleFormadores: boolean = false;
  numSelectedFormadores: number = 0;
  comboFormadores;
  rowsPerPage;
  editFormador: boolean = false;
  modoEdicionFormador: boolean = true;
  pressNewFormador: boolean = false;
  newFormadorCourse: FormadorCursoItem;
  comboRoles;
  comboTipoCoste;
  formadoresUpdate = [];

  //Sesiones
  colsSessions;
  selectedItemSessions;
  datosSessions = [];
  selectedDatosSessions;
  selectAllSessions: any;
  selectedSessions: number = 10;
  selectMultipleSessions: boolean = false;
  numSelectedSessions: number = 0;
  comboSessions;

  //Certificados
  colsCertificates;
  selectedItemCertificates;
  datosCertificates = [];
  selectedDatosCertificates;
  selectAllCertificates: any;
  selectedCertificates: number = 10;
  selectMultipleCertificates: boolean = false;
  numSelectedCertificates: number = 0;
  comboCertificates;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getComboVisibilidad();
    this.getColsResultsFormadores();
    this.getColsResultsSessions();
    this.getColsResultsCertificates();
    this.getComboRoles();
    this.getComboTipoCoste();
    sessionStorage.removeItem("isFormacionCalendar");
    sessionStorage.removeItem("abrirFormador");
    //Comprobamos si estamos en modoEdición o en modo Nuevo
    if (sessionStorage.getItem("modoEdicionCurso") == "true") {
      this.modoEdicion = true;
      this.curso = JSON.parse(sessionStorage.getItem("cursoSelected"))[0];
      this.curso.idCurso = "2";
      if (
        sessionStorage.getItem("formador") == null ||
        sessionStorage.getItem("formador") == undefined
      ) {
        this.getTrainers();
      }
    } else {
      this.modoEdicion = false;
      this.curso = new DatosCursosItem();
    }

    if (
      sessionStorage.getItem("formador") != null ||
      sessionStorage.getItem("formador") != undefined
    ) {
      this.pressNewFormador = true;
      this.modoEdicionFormador = false;
      this.editFormador = true;
      this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));
    }
  }

  //TARJETA DATOS GENERALES

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

  getTemas() {
    this.backgroundColor = this.getRandomColor();
    this.temasSuggest = [
      {
        idTema: "1",
        nombre: "Cocina",
        color: ""
      },
      {
        idTema: "2",
        nombre: "Astrología",
        color: ""
      },
      {
        idTema: "3",
        nombre: "Estética",
        color: ""
      }
    ];
  }

  //TARJETA FORMADORES

  getTrainers() {
    this.sigaServices
      .getParam(
        "fichaCursos_getTrainersCourse",
        "?idCurso=" + this.curso.idCurso
      )
      .subscribe(
        n => {
          this.datosFormadores = n.formadorCursoItem;
          sessionStorage.setItem(
            "datosFormadoresInit",
            JSON.stringify(this.datosFormadores)
          );
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  getColsResultsFormadores() {
    this.colsFormadores = [
      {
        field: "nombreCompleto",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        select: "idRol",
        field: "rol",
        header: "administracion.usuarios.literal.rol"
      },
      {
        select: "idTipoCoste",
        field: "tipoCoste",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      {
        field: "tarifa",
        header: "general.boton.actualizarTarifa"
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

  isSelectMultipleFormadores() {
    this.selectMultipleFormadores = !this.selectMultipleFormadores;
    if (!this.selectMultipleFormadores) {
      this.selectedDatosFormadores = [];
      this.numSelectedFormadores = 0;
    } else {
      this.selectAllFormadores = false;
      this.selectedDatosFormadores = [];
      this.numSelectedFormadores = 0;
    }
  }

  onChangeSelectAllFormadoress() {
    if (this.selectAllFormadores === true) {
      this.selectMultipleFormadores = false;
      this.selectedDatosFormadores = this.datosFormadores;
      this.numSelectedFormadores = this.datosFormadores.length;
    } else {
      this.selectedDatosFormadores = [];
      this.numSelectedFormadores = 0;
    }
  }

  getComboRoles() {
    this.sigaServices.get("fichaCursos_getRolesTrainers").subscribe(
      n => {
        this.comboRoles = n.combooItems;
        this.arregloTildesCombo(this.comboRoles);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTipoCoste() {
    this.sigaServices.get("fichaCursos_getTypeCostTrainers").subscribe(
      n => {
        this.comboTipoCoste = n.combooItems;
        this.arregloTildesCombo(this.comboTipoCoste);
      },
      err => {
        console.log(err);
      }
    );
  }

  irEditarFormador() {
    if (this.editFormador) {
      this.editFormador = false;
    } else {
      this.editFormador = true;
    }
  }

  restTrainer() {
    this.datosFormadores = JSON.parse(
      sessionStorage.getItem("datosFormadoresInit")
    );
    this.selectMultipleFormadores = false;
    this.pressNewFormador = false;
    this.editFormador = false;
    this.tableFormadores.reset();
  }

  newTrainer() {
    sessionStorage.setItem("abrirFormador", "true");
    this.router.navigate(["/busquedaGeneral"]);
    this.pressNewFormador = true;
    this.modoEdicionFormador = false;
    this.editFormador = true;
    this.newFormadorCourse = new FormadorCursoItem();
    let newFormadorCourse = {
      idCurso: "",
      idRol: "",
      rol: "",
      nombreCompleto: "",
      tarifa: "",
      idTipoCoste: "",
      tipoCoste: "",
      idPersona: "",
      idInstitucion: ""
    };

    this.datosFormadores = [newFormadorCourse, ...this.datosFormadores];
    sessionStorage.setItem(
      "datosFormadores",
      JSON.stringify(this.datosFormadores)
    );
  }

  loadNewTrainer(newformador) {
    this.datosFormadores = JSON.parse(
      sessionStorage.getItem("datosFormadores")
    );
    this.newFormadorCourse = new FormadorCursoItem();
    this.datosFormadores[0].nombreCompleto =
      newformador[0].nombre + " " + newformador[0].apellidos;
    this.datosFormadores[0].idPersona = newformador[0].idPersona;
    this.datosFormadores[0].idInstitucion = newformador[0].colegio;
    this.datosFormadores[0].idRol = "";
    this.datosFormadores[0].idTipoCoste = "";
    this.datosFormadores[0].idCurso = this.curso.idCurso;
    this.fichasPosibles[2].activa = true;
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelectedFormadores = selectedDatos.length;
  }

  saveTrainers() {
    this.editFormador = false;
    let formador;
    let url = "";

    if (this.modoEdicionFormador) {
      url = "fichaCursos_updateTrainersCourse";
      formador = new FormadorCursoObject();
      formador.error = new ErrorItem();
      formador.formadoresCursoItem = this.datosFormadores;
    } else {
      url = "fichaCursos_saveTrainersCourse";
      formador = this.tableFormadores.value[0];
      formador.idRol = this.newFormadorCourse.idRol;
      formador.idTipoCoste = this.newFormadorCourse.idTipoCoste;
      formador.tarifa = this.newFormadorCourse.tarifa;
    }

    this.sigaServices.post(url, formador).subscribe(
      data => {
        this.editFormador = false;
        this.pressNewFormador = false;
        sessionStorage.removeItem("formador");
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  editFormadorTable(event) {
    this.editFormador = true;
    this.modoEdicionFormador = true;

    // this.datosFormadores.forEach(element => {
    //   let idFindFormador = this.formadoresUpdate.findIndex(
    //     x => x.idPersona === element.idPersona
    //   );

    //   if (idFindFormador == undefined) {
    //     this.formadoresUpdate.push(this.datosFormadores[idFindFormador]);
    //   }
    // });
  }

  onChangeEdit(event, dato) {
    this.editFormador = true;

    let idFindFormador = this.formadoresUpdate.findIndex(
      x => x.idPersona === dato.idPersona
    );

    if (idFindFormador == -1) {
      this.formadoresUpdate.push(this.datosFormadores[idFindFormador]);
    }
  }

  prueba(event) {
    console.log(event);
  }

  deleteTrainer() {}

  //Sesiones

  getColsResultsSessions() {
    this.colsSessions = [
      {
        field: "fechaInicio",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "fechaFin",
        header: "Rol"
      },
      {
        field: "formadores",
        header: "Formadores"
      },
      {
        field: "lugar",
        header: "Lugar"
      },
      {
        field: "estado",
        header: "Estado"
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

  isSelectMultipleSessions() {
    this.selectMultipleFormadores = !this.selectMultipleSessions;
    if (!this.selectMultipleSessions) {
      this.selectedDatosSessions = [];
      this.numSelectedSessions = 0;
    } else {
      this.selectAllSessions = false;
      this.selectedDatosSessions = [];
      this.numSelectedSessions = 0;
    }
  }

  onChangeSelectAllSessions() {
    if (this.selectAllSessions === true) {
      this.selectMultipleSessions = false;
      this.selectedDatosSessions = this.datosSessions;
      this.numSelectedSessions = this.datosSessions.length;
    } else {
      this.selectedDatosSessions = [];
      this.numSelectedSessions = 0;
    }
  }

  newSession() {
    sessionStorage.setItem("isFormacionCalendar", "true");
    this.router.navigate(["/fichaEventos"]);
  }

  //Certificados

  getColsResultsCertificates() {
    this.colsCertificates = [
      {
        field: "certificado",
        header: "menu.certificados"
      },
      {
        field: "precio",
        header: "form.busquedaCursos.literal.precio"
      },
      {
        field: "calificacion",
        header: "gratuita.EJG.InformeCalificacion"
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

  isSelectMultipleCertificates() {
    this.selectMultipleFormadores = !this.selectMultipleCertificates;
    if (!this.selectMultipleCertificates) {
      this.selectedDatosCertificates = [];
      this.numSelectedCertificates = 0;
    } else {
      this.selectAllCertificates = false;
      this.selectedDatosCertificates = [];
      this.numSelectedCertificates = 0;
    }
  }

  onChangeSelectAllCertificates() {
    if (this.selectAllCertificates === true) {
      this.selectMultipleCertificates = false;
      this.selectedDatosCertificates = this.datosCertificates;
      this.numSelectedCertificates = this.datosCertificates.length;
    } else {
      this.selectedDatosCertificates = [];
      this.numSelectedCertificates = 0;
    }
  }

  //FUNCIONES GENERALES
  getFichasPosibles() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: false
      },
      {
        key: "price",
        activa: false
      },
      {
        key: "formadores",
        activa: false
      },
      {
        key: "inscription",
        activa: false
      },
      {
        key: "certificate",
        activa: false
      },
      {
        key: "session",
        activa: false
      },
      {
        key: "communications",
        activa: false
      },
      {
        key: "carga",
        activa: false
      }
    ];
  }

  //Funciones controlan las fichas
  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
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

  backTo() {
    this.location.back();
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

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return "#" + ("000000" + color).slice(-6);
  }
}
