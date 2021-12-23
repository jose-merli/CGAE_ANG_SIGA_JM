import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { DataTable } from "primeng/datatable";
import { Message, MultiSelect, ConfirmationService, Dropdown } from "primeng/primeng";
import { TranslateService } from "../../../commons/translate/translation.service";
import { ControlAccesoDto } from "../../../models/ControlAccesoDto";
import { DatosCursosItem } from "../../../models/DatosCursosItem";
import { DatosCursosObject } from "../../../models/DatosCursosObject";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { esCalendar } from "../../../utils/calendar";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { AuthenticationService } from "../../../_services/authentication.service";
import { SigaServices } from "../../../_services/siga.service";
import { CommonsService } from '../../../_services/commons.service';

export enum KEY_CODE {
  ENTER = 13
}

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

  isLetrado: boolean = true;

  textSelected: String = this.translateService.instant(
    "general.mensaje.0.etiquetas.seleccionadas"
  );
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

  activacionEditar: boolean = false;
  camposDesactivados: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
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

  @ViewChild("dropdown")
  dropdown: Dropdown;

  ngOnInit() {
    sessionStorage.removeItem("isCancelado");
    this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    this.getCombos();
    //Se elimina las variables en la sesion storage para que cuando se busque un nuevo curso
    //Se inicialice todo desde el principio
    this.initSessionStorage();
    sessionStorage.setItem("isFormacionCalendar", "false");

    if (sessionStorage.getItem("filtrosBusquedaCursosFichaCursos") != null) {
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaCursosFichaCursos")
      );
      sessionStorage.removeItem("filtrosBusquedaCursosFichaCursos");

      this.isBuscar(false);
    }

    if (sessionStorage.getItem("filtrosBusquedaCursos") != null) {
      this.body = JSON.parse(sessionStorage.getItem("filtrosBusquedaCursos"));
      sessionStorage.removeItem("filtrosBusquedaCursos");
      this.isBuscar(false);
    }
    this.getColsResults();
    this.filtrosTrim();
    this.selectedDatos = [];

    this.checkAcceso();
    // this.mySelect.focus();
  }

  clearFilter(dropdown: Dropdown) {
    dropdown.focus();
  }

  ngAfterViewInit() {
    // this.mySelect.ngOnInit();
    this.clearFilter(this.dropdown);
  }

  //CONTROL DE PERMISOS

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "20A";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        //console.log(err);
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

  initSessionStorage() {
    sessionStorage.removeItem("abrirFormador");
    sessionStorage.removeItem("datosFormadores");
    sessionStorage.removeItem("datosFormadoresInit");
    sessionStorage.removeItem("formador");
    sessionStorage.removeItem("idCurso");
    sessionStorage.removeItem("isFormacionCalendarByStartInscripcion");
    sessionStorage.removeItem("isFormacionCalendarByEndInscripcion");
    sessionStorage.removeItem("courseCurrent");
    sessionStorage.removeItem("isInscripcion");
    sessionStorage.removeItem("pantallaFichaCurso");
    sessionStorage.removeItem("filtrosBusquedaInscripciones");

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

      if(!this.modoHistorico){
        this.selectedDatos = this.datos.filter(dato => dato.flagArchivado == 1);
        this.numSelected = this.selectedDatos.length;
      }else{
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      }

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
      this.body.colegio = undefined;
    }
  }

  onChangeSelectColegio(event) {
    if (event.value != undefined &&
      event.value != this.authenticationService.getInstitucionSession()) {
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
        //console.log(err);
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
        //console.log(err);
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
        //console.log(err);
      }
    );
  }

  getComboDisponibilidadPlazas() {
    this.comboDisponibilidadPlazas = [
      { label: "No", value: 0 },
      { label: "Sí", value: 1 }
    ];

    this.arregloTildesCombo(this.comboDisponibilidadPlazas);
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
        //console.log(err);
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

  /* FIN IMPLEMENTACIÓN NUEVOS COMBOS */

  //Busca cursos según los filtros
  isBuscar(flagArchivado: boolean) {
    if (this.checkFilters()) {
      this.progressSpinner = true;
      this.buscar = true;

      this.selectAll = false;
      this.selectMultiple = false;

      this.selectedDatos = [];
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
        this.body.temas.push(element);
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
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            setTimeout(() => {
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
      (this.body.codigoCurso == undefined || this.body.codigoCurso == "") &&
      (this.body.nombreCurso == undefined || this.body.nombreCurso == "") &&
      (this.body.idEstado == undefined || this.body.idEstado == "") &&
      (this.body.precioDesde == undefined) &&
      (this.body.precioHasta == undefined) &&
      (this.body.plazasDisponibles == undefined) &&
      (this.body.fechaInscripcionDesdeDate == undefined) &&
      (this.body.fechaInscripcionHastaDate == undefined) &&
      (this.body.fechaImparticionDesdeDate == undefined) &&
      (this.body.fechaImparticionHastaDate == undefined) &&
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

  isLimpiar() {
    this.body = new DatosCursosItem();
    this.selectedTemas = [];
  }

  crearCurso() {
    sessionStorage.setItem("modoEdicionCurso", "false");
    sessionStorage.setItem(
      "filtrosBusquedaCursos",
      JSON.stringify(this.body)
    );
    this.router.navigate(["fichaCurso"]);
  }

  irEditarCurso(selectedDatos) {
    sessionStorage.removeItem("isCancelado");
    if (selectedDatos.length >= 1 && this.selectMultiple == false) {
      if (selectedDatos[0].idEstado != "5") {
        sessionStorage.setItem("isCancelado", "false");
      }
      if (selectedDatos[0].flagArchivado == 1) {
        sessionStorage.setItem("isCancelado", "true");
      } else {
        sessionStorage.setItem("isCancelado", "false");
      }


      sessionStorage.setItem("modoEdicionCurso", "true");

      sessionStorage.setItem("rutaVolver", "/buscarCursos");
      sessionStorage.setItem("courseCurrent", JSON.stringify(selectedDatos[0]));
      sessionStorage.setItem(
        "filtrosBusquedaCursos",
        JSON.stringify(this.body)
      );
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
        header: "formacion.fichaCursos.datosGenerales.visibilidad"
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
        header: "form.busquedaCursos.literal.precio",
        value1: "precioDesde",
        value2: "precioHasta"
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

  duplicateCourse() {
    let curso = this.selectedDatos[0];
    curso.idCurso = undefined;

    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = this.selectedDatos;

    if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
      this.showMessage(
        "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
      );
    } else {
      sessionStorage.setItem("duplicarCurso", "true");
      sessionStorage.setItem("modoEdicionCurso", "false");
      sessionStorage.setItem("courseCurrent", JSON.stringify(curso));
      sessionStorage.setItem("filtrosBusquedaCursos", JSON.stringify(this.body));
      this.router.navigate(["fichaCurso"]);
    }
  }

  disabledDuplicate() {
    if (
      (this.selectedDatos != null && this.selectedDatos.length == 1)
    )
      return false;
    else return true;
  }

  archivarCursos() {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = this.selectedDatos;

    this.progressSpinner = true;

    this.sigaServices
      .post("busquedaCursos_archivar", this.selectedDatos)
      .subscribe(
        data => {
          this.progressSpinner = false;

          if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
            this.showMessage(
              "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
            );
          } else {
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
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  desarchivarCursos(selectedDatos) {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = this.selectedDatos;

    this.progressSpinner = true;

    this.sigaServices
      .post("busquedaCursos_desarchivar", this.selectedDatos)
      .subscribe(
        data => {
          this.progressSpinner = false;

          if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
            this.showMessage(
              "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
            );
          } else {
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
          }
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  anunciarCursos() {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = this.selectedDatos;

    this.sigaServices.post("fichaCursos_announceCourse", cursoDTO).subscribe(
      data => {
        this.progressSpinner = false;
        this.isBuscar(false);

        if (JSON.parse(data.body).error.code == null) {
          if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
            this.showMessage(
              "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
            );
          } else {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          }
        } else if (JSON.parse(data.body).error.code == 200) {
          this.showMessage(
            "success",
            this.translateService.instant("general.message.correct"),
            JSON.parse(data.body).error.description
          );
        } else if (JSON.parse(data.body).error.code == 400) {
          this.showMessage(
            "error",
            this.translateService.instant("general.message.incorrect"),
            JSON.parse(data.body).error.description
          );
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  desanunciarCursos() {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = this.selectedDatos;

    this.sigaServices.post("fichaCursos_releaseCourse", cursoDTO).subscribe(
      data => {
        this.progressSpinner = false;
        this.isBuscar(false);

        if (JSON.parse(data.body).error.code == null) {
          if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
            this.showMessage(
              "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
            );
          } else {
            this.showMessage(
              "info",
              this.translateService.instant("general.message.informacion"),
              JSON.parse(data.body).error.description
            );
          }
        } else if (JSON.parse(data.body).error.code == 200) {
          this.showMessage(
            "success",
            this.translateService.instant("general.message.correct"),
            JSON.parse(data.body).error.description
          );
        } else if (JSON.parse(data.body).error.code == 400) {
          this.showMessage(
            "error",
            this.translateService.instant("general.message.incorrect"),
            JSON.parse(data.body).error.description
          );
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  finalizarCursos() {
    let mess = this.translateService.instant(
      "formacion.finalizar.curso.emitir.certificados"
    );

    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        let cursoDTO = new DatosCursosObject();
        cursoDTO.cursoItem = [];
        cursoDTO.cursoItem = this.selectedDatos;

        this.sigaServices.post("fichaCursos_finishCourse", cursoDTO).subscribe(
          data => {
            this.progressSpinner = false;
            this.isBuscar(false);

            if (JSON.parse(data.body).error.code == null) {
              if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
                this.showMessage(
                  "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
                );
              } else {
                this.showMessage(
                  "info",
                  this.translateService.instant("general.message.informacion"),
                  JSON.parse(data.body).error.description
                );
              }
            } else if (JSON.parse(data.body).error.code == 200) {
              this.showMessage(
                "success",
                this.translateService.instant("general.message.correct"),

                JSON.parse(data.body).error.description
              );
            } else if (JSON.parse(data.body).error.code == 400) {
              this.showMessage(
                "error",
                this.translateService.instant("general.message.incorrect"),
                JSON.parse(data.body).error.description
              );
            }
          },
          err => {
            this.progressSpinner = false;
          }
        );
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: this.translateService.instant("general.message.cancelado"),
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  cancelarCursos() {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = this.selectedDatos;

    if (cursoDTO.cursoItem[0].idInstitucion != this.authenticationService.getInstitucionSession()) {
      this.showMessage(
        "error", "Error", this.translateService.instant("formacion.busquedaCursos.mensaje.otraInstitucion")
      );
    } else {
      this.callCancelarCursos();
    }
    // let mess = "";

    // if (this.selectedDatos.length > 1) {
    //   mess = "¿Desea comunicar la cancelación de los cursos?";
    // } else {
    //   mess = "¿Desea comunicar la cancelación del curso?";
    // }

    // let icon = "fa fa-edit";
    // this.confirmationService.confirm({
    //   message: mess,
    //   icon: icon,
    //   accept: () => {
    //     this.callCancelarCursos();
    //   },
    //   reject: () => {
    //     this.msgs = [
    //       {
    //         severity: "info",
    //         summary: this.translateService.instant("general.message.cancelado"),
    //         detail: "Aviso cancelado"
    //       }
    //     ];
    //     this.callCancelarCursos();
    //   }
    // });
  }

  callCancelarCursos() {
    let cursoDTO = new DatosCursosObject();
    cursoDTO.cursoItem = [];
    cursoDTO.cursoItem = this.selectedDatos;

    this.sigaServices.post("fichaCursos_cancelCourse", cursoDTO).subscribe(
      data => {
        this.progressSpinner = false;
        this.isBuscar(false);
        if (JSON.parse(data.body).error.code == null) {
          this.showMessage(
            "info",
            this.translateService.instant("general.message.informacion"),
            JSON.parse(data.body).error.description
          );
        } else if (JSON.parse(data.body).error.code == 200) {
          this.showMessage(
            "success",
            this.translateService.instant("general.message.correct"),
            JSON.parse(data.body).error.description
          );
        } else if (JSON.parse(data.body).error.code == 400) {
          this.showMessage(
            "error",
            this.translateService.instant("general.message.incorrect"),
            JSON.parse(data.body).error.description
          );
        }
      },
      err => {
        this.progressSpinner = false;
      }
    );
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
      summary: this.translateService.instant("general.message.informacion"),
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
      let fechaDesde = this.body.fechaInscripcionDesdeDate.getTime();
      let fechaHasta = this.body.fechaInscripcionHastaDate.getTime();
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
      let fechaDesde = this.body.fechaInscripcionDesdeDate.getTime();
      let fechaHasta = this.body.fechaInscripcionHastaDate.getTime();
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
      let fechaDesde = this.body.fechaImparticionDesdeDate.getTime();
      let fechaHasta = this.body.fechaImparticionHastaDate.getTime();
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
      let fechaDesde = this.body.fechaImparticionDesdeDate.getTime();
      let fechaHasta = this.body.fechaImparticionHastaDate.getTime();
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

  // habilitarComboVis() {
  //   if (this.activacionEditar) return !this.deshabilitarCombVis;
  //   else return true;
  // }

  // habilitarComboCol() {
  //   if (this.activacionEditar) return !this.deshabilitarCombCol;
  //   else return true;
  // }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  fillFechaInscripcionDesdeDate(event) {
    this.body.fechaInscripcionDesdeDate = event;
  }

  fillFechaInscripcionHastaDate(event) {
    this.body.fechaInscripcionHastaDate = event;
  }

  fillFechaImparticionDesdeDate(event) {
    this.body.fechaImparticionDesdeDate = event;
  }

  fillFechaImparticionHastaDate(event) {
    this.body.fechaImparticionHastaDate = event;
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar(false);
    }
  }

  clickFila(event) {
    if (event.data && event.data.flagArchivado == 0 && !this.modoHistorico)
      this.selectedDatos.pop();
  }

  focusInputField() {
    setTimeout(() => {
      this.mySelect.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}
