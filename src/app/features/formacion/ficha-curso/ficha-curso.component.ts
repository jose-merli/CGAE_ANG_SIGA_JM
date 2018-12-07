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
import { TranslateService } from "../../../commons/translate";
import { ConfirmationService } from "../../../../../node_modules/primeng/api";
import { EventoItem } from "../../../models/EventoItem";
import { AuthenticationService } from "../../../_services/authentication.service";
import {
  Droppable,
  Dropdown
} from "../../../../../node_modules/primeng/primeng";

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

  //para deshabilitar combo de visibilidad
  deshabilitarCombVis: boolean = false;

  //para deshabilitar combo de colegios
  deshabilitarCombCol: boolean = false;

  //Formadores
  @ViewChild("tableFormadores")
  tableFormadores;

  //Colegios
  @ViewChild("tableFormadores")
  colegio: Dropdown;

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
  numCheckedTutor: number = 0;

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
    private location: Location,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getFichasPosibles();
    this.getCombosDatosGenerales();
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
      this.curso.fechaImparticionDesdeDate = this.arreglarFecha(
        this.curso.fechaImparticionDesde
      );
      this.curso.fechaImparticionHastaDate = this.arreglarFecha(
        this.curso.fechaImparticionHasta
      );
      this.curso.fechaInscripcionDesdeDate = this.arreglarFecha(
        this.curso.fechaInscripcionDesde
      );
      this.curso.fechaInscripcionHastaDate = this.arreglarFecha(
        this.curso.fechaInscripcionHasta
      );

      if (
        (sessionStorage.getItem("formador") != null ||
          sessionStorage.getItem("formador") != undefined) &&
        sessionStorage.getItem("toBackNewFormador") == "true"
      ) {
        sessionStorage.removeItem("toBackNewFormador");
        this.pressNewFormador = true;
        this.modoEdicionFormador = false;
        this.editFormador = true;
        this.loadNewTrainer(JSON.parse(sessionStorage.getItem("formador")));
      } else {
        this.getTrainers();
      }
    } else {
      this.modoEdicion = false;
      this.curso = new DatosCursosItem();
      //Obligamos a que sea el curso nuevo privado
      this.curso.idVisibilidad = "1";
      let colegio = 1;
      this.onChangeSelectVisibilidadObligate(colegio);
    }
  }

  //TARJETA DATOS GENERALES

  getCombosDatosGenerales() {
    this.getComboEstados();
    this.getComboVisibilidad();
    this.getComboColegios();
    this.getTemas();
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

  onChangeSelectVisibilidad(event) {
    if (event.value == 1) {
      this.deshabilitarCombCol = true;
      this.curso.colegio = this.authenticationService.getInstitucionSession();
    } else {
      this.deshabilitarCombCol = false;
    }
  }

  onChangeSelectVisibilidadObligate(colegio) {
    if (colegio == 1) {
      this.deshabilitarCombCol = true;
      this.curso.colegio = this.authenticationService.getInstitucionSession();
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
      this.curso.idVisibilidad = "0"; //Visibilidad pública
    } else {
      this.deshabilitarCombVis = false;
    }
  }

  saveCourse() {
    let url = "";

    if (this.modoEdicion) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateCourse";
    } else {
      //Mapeamos el formador que queremos insertar nuevo
      url = "fichaCursos_saveCourse";
    }

    this.sigaServices.post(url, this.curso).subscribe(
      data => {
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  announceCourse(){
    // this.curso.idEstado 
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
          this.datosFormadores = n.formadoresCursoItem;

          for (let i = 0; this.datosFormadores.length > i; i++) {
            if (this.datosFormadores[i].tutor == 1) {
              this.datosFormadores[i].flagTutor = true;
              this.numCheckedTutor = 1;
            } else {
              this.datosFormadores[i].flagTutor = false;
            }
          }

          sessionStorage.setItem(
            "datosFormadoresInit",
            JSON.stringify(this.datosFormadores)
          );

          if (
            sessionStorage.getItem("formador") != null ||
            sessionStorage.getItem("formador") != undefined
          ) {
            sessionStorage.removeItem("formador");
            this.tableFormadores.reset();
          }

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
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
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
      },
      {
        field: "flagTutor",
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

  onChangeSelectAllFormadores(event) {
    this.selectMultipleFormadores = !this.selectMultipleFormadores;
    if (this.selectAllFormadores === true) {
      this.selectedDatosFormadores = this.datosFormadores;
      this.numSelectedFormadores = this.datosFormadores.length;
    } else {
      this.selectAllFormadores = false;
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
    this.formadoresUpdate = [];
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
      nombre: "",
      apellidos: "",
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

    for (let i = 0; this.datosFormadores.length > i; i++) {
      if (this.datosFormadores[i].tutor == 1) {
        this.datosFormadores[i].flagTutor = true;
        this.numCheckedTutor = 1;
      } else {
        this.datosFormadores[i].flagTutor = false;
      }
    }

    this.fichasPosibles[2].activa = true;
    this.newFormadorCourse = new FormadorCursoItem();
    if (newformador.idPersona != null && newformador.idPersona != undefined) {
      this.datosFormadores[0].nombre = newformador.nombre;
      this.datosFormadores[0].apellidos = newformador.apellidos;
      this.datosFormadores[0].idPersona = newformador.idPersona;
      this.datosFormadores[0].idInstitucion = newformador.colegio;
      this.datosFormadores[0].idRol = "";
      this.datosFormadores[0].idTipoCoste = "";
      this.datosFormadores[0].idCurso = this.curso.idCurso;
      this.newFormadorCourse.apellidos = newformador.apellidos;
      this.newFormadorCourse.nombre = newformador.nombre;
    } else {
      this.newFormadorCourse.nif = newformador.nif;
      this.newFormadorCourse.tipoIdentificacion =
        newformador.tipoIdentificacion;
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelectedFormadores = selectedDatos.length;
  }

  saveTrainers() {
    this.editFormador = false;
    let formador;
    let url = "";

    if (this.modoEdicionFormador) {
      //Enviamos al back todos los formadores editados
      url = "fichaCursos_updateTrainersCourse";
      formador = new FormadorCursoObject();
      formador.error = new ErrorItem();
      formador.formadoresCursoItem = this.formadoresUpdate;
    } else {
      //Mapeamos el formador que queremos insertar nuevo
      url = "fichaCursos_saveTrainersCourse";
      formador = this.tableFormadores.value[0];
      formador.idRol = this.newFormadorCourse.idRol;
      formador.idTipoCoste = this.newFormadorCourse.idTipoCoste;
      formador.tarifa = this.newFormadorCourse.tarifa;
      formador.nif = this.newFormadorCourse.nif;
      formador.tipoIdentificacion = this.newFormadorCourse.tipoIdentificacion;
      formador.idCurso = this.curso.idCurso;
      formador.nombre = this.newFormadorCourse.nombre;
      formador.apellidos = this.newFormadorCourse.apellidos;
      formador.idInstitucion = null;
    }

    this.sigaServices.post(url, formador).subscribe(
      data => {
        let error = JSON.parse(data.body).error;

        if (error.message != "" && error.message != null) {
          this.showFail(error.message);
        } else {
          this.showSuccess();
        }
        this.editFormador = true;
        this.pressNewFormador = false;
        this.modoEdicionFormador = true;
        sessionStorage.setItem("formador", "true");
        this.getTrainers();
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  //Funciones que controlan los formadores editados
  //Si se edita un campo input de la tabla
  editFormadorTable(event) {
    this.editFormador = true;
    this.modoEdicionFormador = true;

    let idFindFormador = this.formadoresUpdate.findIndex(
      x => x.idPersona === event.data.idPersona && x.idRol === event.data.idRol
    );

    if (idFindFormador == -1) {
      this.addTrainerUpdateList(idFindFormador, event.data);
    } else {
      let id = this.datosFormadores.findIndex(
        x =>
          x.idPersona === event.data.idPersona && x.idRol === event.data.idRol
      );

      this.formadoresUpdate[idFindFormador] = this.datosFormadores[id];
    }
  }

  //Si se selecciona un select de la tabla
  onChangeEdit(event, dato) {
    this.editFormador = true;

    let idFindFormador = this.formadoresUpdate.findIndex(
      x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
    );

    if (idFindFormador == -1) {
      this.addTrainerUpdateList(idFindFormador, dato);
    } else {
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      this.formadoresUpdate[idFindFormador] = this.datosFormadores[id];
    }
  }

  deleteTrainer(selectedFormadores) {
    this.progressSpinner = true;
    let deleteTrainer = new FormadorCursoObject();

    selectedFormadores.forEach(f => {
      let formador = new FormadorCursoItem();
      formador = f;
      deleteTrainer.formadoresCursoItem.push(formador);
    });

    this.sigaServices
      .post("fichaCursos_deleteTrainersCourse", deleteTrainer)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.showSuccessDelete();
          this.getTrainers();
          this.selectMultipleFormadores = false;
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "general.message.error.realiza.accion"
            )
          );
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  onChangeTutor(event, dato) {
    let mess = "";
    this.editFormador = true;

    //COMPROBAMOS QUE SI YA EXISTE UN FORMADOR ASIGNADO COMO TUTOR Y SE QUIERE MARCAR A OTRO FORMADOR SE CAMBIA LA ASIGNACION
    if (this.numCheckedTutor == 1 && dato.flagTutor == true) {
      mess = "¿Estás seguro que desea cambiar el tutor del curso?";

      let icon = "fa fa-edit";
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          //1. Eliminamos el tutor asignado

          //1.1 Buscamos el formador que tiene asignado ese rol
          let idFormadorUnSelect = this.datosFormadores.findIndex(
            x => x.tutor === 1
          );

          //1.2 Buscamos si ese formador se encuentra en la lista de formadores modificados
          let id = this.formadoresUpdate.findIndex(
            x =>
              x.idPersona ==
                this.datosFormadores[idFormadorUnSelect].idPersona &&
              x.idRol == this.datosFormadores[idFormadorUnSelect].idRol
          );

          //1.3 Si no se encuentre en la lista de moficiados, se añade el formador modificado
          if (id == -1) {
            this.datosFormadores[idFormadorUnSelect].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].flagTutor = false;
            this.formadoresUpdate.push(
              this.datosFormadores[idFormadorUnSelect]
            );
            //1.4 Si se encuentra en la lista, modificamos el formador tanto en la lista de formadores modificados
            //y en la lista de formadores
          } else {
            this.formadoresUpdate[id].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].tutor = 0;
            this.datosFormadores[idFormadorUnSelect].flagTutor = false;
          }

          //2. Añadimos el nuevo formador

          //2.1 Buscamos SI el formador que le vamos asignar el tutor se encuentra en la lista de formadores modificados
          let idFindFormador = this.formadoresUpdate.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          //2.2 Buscamos al formador que le vamos asignar el tutor en la tabla de formadores
          let idUpdateFormador = this.datosFormadores.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          //2.3 Si el formador no se encuentra en la tabla de formadores modificados se añade
          if (idFindFormador == -1) {
            this.datosFormadores[idUpdateFormador].tutor = 1;
            this.datosFormadores[idUpdateFormador].flagTutor = true;
            this.addTrainerUpdateList(idFindFormador, dato);
            //2.4 Si se encuentra, se le asigna el valor de tutor en ambas tablas
          } else {
            this.formadoresUpdate[idFindFormador].tutor = 1;
            this.formadoresUpdate[idFindFormador].flagTutor = true;
            this.datosFormadores[idUpdateFormador].tutor = 1;
            this.datosFormadores[idUpdateFormador].flagTutor = true;
          }
        },
        reject: () => {
          //Si cancela la operacion, se restablece los valores
          let id = this.datosFormadores.findIndex(
            x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
          );

          if (this.datosFormadores[id].flagTutor) {
            this.datosFormadores[id].flagTutor = false;
          } else {
            this.datosFormadores[id].flagTutor = true;
          }

          this.msgs = [
            {
              severity: "info",
              summary: "Cancel",
              detail: this.translateService.instant(
                "general.message.accion.cancelada"
              )
            }
          ];
        }
      });
      //SE COMPRUEBA SI SE DESASIGNA UN FORMADOR QUE ES TUTOR
    } else if (this.numCheckedTutor == 1 && dato.flagTutor == false) {
      this.numCheckedTutor = 0;

      //1.1 Se le desasigna en la tabla de formadores
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      this.datosFormadores[id].tutor = 0;
      this.datosFormadores[id].flagTutor = false;

      //1.1 Se busca si ese formador se encuentra en la lista de formadores modificados
      let idFindFormador = this.formadoresUpdate.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      //1.2 Si no existe se añade a la lista de formadores modificados y se le asigna en la tabla de formadores
      if (idFindFormador == -1) {
        this.formadoresUpdate.push(this.datosFormadores[id]);
        //1.3 Si existe se modifica en la tabla
      } else {
        this.formadoresUpdate[id].tutor = 0;
      }
      //SE COMPRUEBA SI NO HAY NINGUN FORMADOR ASIGNADO
    } else {
      this.numCheckedTutor = 1;
      dato.tutor = 1;

      //1.1 Se le asigna en la tabla de formadores
      let id = this.datosFormadores.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );
      this.datosFormadores[id].tutor = 1;
      this.datosFormadores[id].flagTutor = true;

      //1.2 Se busca si esta en la tabla formadores modificados
      let idFindFormador = this.formadoresUpdate.findIndex(
        x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
      );

      //1.2 Si no esta se añade
      if (idFindFormador == -1) {
        this.addTrainerUpdateList(idFindFormador, dato);
      } else {
        let id = this.datosFormadores.findIndex(
          x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
        );
        this.formadoresUpdate[idFindFormador].tutor = 1;
      }
    }
  }

  addTrainerUpdateList(idFindFormador, dato) {
    let id = this.datosFormadores.findIndex(
      x => x.idPersona === dato.idPersona && x.idRol === dato.idRol
    );
    this.formadoresUpdate.push(this.datosFormadores[id]);
  }

  validateForm() {
    if (
      this.newFormadorCourse.idRol == null ||
      this.newFormadorCourse.idTipoCoste == null ||
      this.newFormadorCourse.tarifa == null ||
      this.newFormadorCourse.nombre == null ||
      this.newFormadorCourse.apellidos == null ||
      this.newFormadorCourse.tarifa == "" ||
      this.newFormadorCourse.nombre == "" ||
      this.newFormadorCourse.apellidos == ""
    ) {
      return true;
    } else {
      return false;
    }
  }

  //Sesiones

  getColsResultsSessions() {
    this.colsSessions = [
      {
        field: "fechaInicio",
        header: "agenda.fichaEventos.datosGenerales.fechaInicio"
      },
      {
        field: "fechaFin",
        header: "agenda.fichaEventos.datosGenerales.fechaFin"
      },
      {
        field: "formadores",
        header: "agenda.fichaEventos.datosFormadores.cabecera"
      },
      {
        field: "lugar",
        header: "agenda.fichaEventos.datosGenerales.lugar"
      },
      {
        field: "estado",
        header: "form.busquedaCursos.literal.estado"
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

  getSessions() {
    // this.sigaServices.get("fichaCursos_getSessionsCourse").subscribe(
    //   n => {
    //     this.datosSessions = n.eventNotificationItems;
    //     this.progressSpinner = false;
    //   },
    //   err => {
    //     this.progressSpinner = false;
    //   },
    //   () => {
    //     this.progressSpinner = false;
    //   }
    // );
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
    sessionStorage.setItem("idCurso", this.curso.idCurso);
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

  showFail(msg) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Información",
      detail: msg
    });
  }

  showSuccessDelete() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: "Correcto",
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  clear() {
    this.msgs = [];
  }

  arreglarFecha(fecha) {
    let jsonDate = JSON.stringify(fecha);
    let rawDate = jsonDate.slice(1, -1);
    if (rawDate.length < 14) {
      let splitDate = rawDate.split("/");
      let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
      fecha = new Date((arrayDate += "T00:00:00.001Z"));
    } else {
      fecha = new Date(rawDate);
    }

    return fecha;
  }
}
