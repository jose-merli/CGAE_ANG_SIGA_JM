import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { TranslateService } from "../../../commons/translate/translation.service";
import { SubtipoCurricularItem } from "../../../models/SubtipoCurricularItem";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { esCalendar } from "../../../utils/calendar";
import { SigaServices } from "../../../_services/siga.service";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { ModelosComunicacionesItem } from "../../../models/ModelosComunicacionesItem";
import { AsistenciasItem } from "../../../models/sjcs/AsistenciasItem";

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-filtros-busqueda-asuntos",
  templateUrl: "./filtros-busqueda-asuntos.component.html",
  styleUrls: ["./filtros-busqueda-asuntos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class FiltrosBusquedaAsuntosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showJusticiable: boolean = true;
  showEJG: boolean = true;
  progressSpinner: boolean = false;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  msgs: any;

  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: string = "Seleccionar";
  buscar: boolean = false;

  es: any = esCalendar;

  editar: boolean = true;
  noResultsSubtipos: boolean = true;
  filtros: AsistenciasItem = new AsistenciasItem;
  comboTipoEjg: any[];
  comboTipoEjgColegio: any[];
  comboEstadoEjg: any[] = [];
  TipoDesignacion: any[] = [];
  comboTipoSOJ: any[] = [];
  comboComisaria: any[];
  comboJuzgado: any[];
  comboTurno: any[];
  comboguardiaPorTurno: any[];
  textSelected: String = "{0} etiquetas seleccionadas";
  body: any;
  colegiadoSearch: any;
  subtipoCurricular: SubtipoCurricularItem = new SubtipoCurricularItem();

  siNoResidencia: any;
  siNoInscrito: any;
  selectedEstadoCivil: any;
  selectedCategoriaCurricular: any;
  selectedSubtipoCV: any;
  selectedProvincia: any;
  selectedPoblacion: any;
  selectedTipoDireccion: any;
  resultadosPoblaciones: any;
  historico: boolean;

  fechaIncorporacionHastaSelect: Date;
  fechaIncorporacionDesdeSelect: Date;
  fechaNacimientoHastaSelect: Date;
  fechaNacimientoDesdeSelect: Date;

  //Diálogo de comunicación
  bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  first: number = 0;
  clasesComunicaciones: any = [];
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  @Input() permisoEscritura;

  institucionActual: any;
  deshabilitarCombCol: boolean = false;
  colegiosSeleccionados: any[] = [];
  radioTarjeta: String = 'ejg';
  showDesignacion: boolean = true;
  showSOJ: boolean = true;
  showAsistencias: boolean = true;
  comboEstadoDesignacion: { label: string; value: string; }[];
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {

    this.currentRoute = this.router.url;
    this.progressSpinner = true;
    this.getCombos();

  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }

  onHideJusticiable() {
    this.showJusticiable = !this.showJusticiable;
  }

  onHideEJG() {
    this.showEJG = !this.showEJG;
  }
  onHideAsistencias() {
    this.showAsistencias = !this.showDesignacion;
  }

  onHideSOJ() {
    this.showSOJ = !this.showSOJ;
  }

  onHideDesignacion() {
    this.showDesignacion = !this.showDesignacion;
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

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  arregloTildesCombo(combo) {
    if (combo != undefined)
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
  // getCombos() {
  //   this.getComboEstadoDesignacion();
  //   this.comboTipoEjg = this.getCombo("combo_comboTipoEjg");
  //   this.comboTipoEjgColegio = this.getCombo("combo_comboTipoEjgColegio");
  //   this.arregloTildesCombo(this.comboTipoEjgColegio);
  //   this.comboEstadoEjg = this.getCombo("combo_comboEstadoEjg");
  //   this.arregloTildesCombo(this.comboEstadoEjg);
  //   this.TipoDesignacion = this.getCombo("combo_TipoDesignacion");
  //   this.arregloTildesCombo(this.TipoDesignacion);
  //   this.comboTipoSOJ = this.getCombo("combo_comboTipoSOJ");
  //   this.arregloTildesCombo(this.comboTipoSOJ);
  //   this.comboComisaria = this.getCombo("combo_comboComisaria");
  //   this.arregloTildesCombo(this.comboComisaria);
  //   this.comboJuzgado = this.getCombo("combo_comboJuzgado");
  //   this.arregloTildesCombo(this.comboJuzgado);
  //   this.comboTurno = this.getCombo("combo_turnos");
  //   this.arregloTildesCombo(this.comboTurno);
  //   this.comboguardiaPorTurno = this.getCombo("combo_guardiaPorTurno");
  //   this.arregloTildesCombo(this.comboguardiaPorTurno);
  // }
  getCombos() {
    this.getComboEstadoDesignacion();
    this.getComboTipoEjg();
    this.getComboTipoEjgColegio();
    this.getComboEstadoEjg();
    //this.comboguardiaPorTurno("combo_TipoDesignacion"); falla
    this.getComboTipoSOJ();
    this.getComboComisaria();
    this.getComboJuzgado();
    this.getComboTurno();
    // this.getComboguardiaPorTurno(); este depende de turno
    this.progressSpinner = false;

  }

  getComboEstadoDesignacion() {
    this.comboEstadoDesignacion = [
      { label: "Activo", value: "V" },
      { label: "Anulado", value: "A" },
      { label: "Finalizado", value: "F" }
    ];
    this.arregloTildesCombo(this.comboEstadoDesignacion);
  }

  getComboTipoEjg() {
    this.sigaServices.get("combo_comboTipoEjg").subscribe(
      n => {
        this.comboTipoEjg = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboTipoEjg);
      }
    );
  }
  getComboTipoEjgColegio() {
    this.sigaServices.get("combo_comboTipoEjgColegio").subscribe(
      n => {
        this.comboTipoEjgColegio = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboTipoEjgColegio);
      }
    );
  }
  getComboEstadoEjg() {
    this.sigaServices.get("combo_comboEstadoEjg").subscribe(
      n => {
        this.comboEstadoEjg = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboEstadoEjg);
      }
    );
  }
  getComboTipoDesignacion() {
    this.sigaServices.get("combo_TipoDesignacion").subscribe(
      n => {
        this.TipoDesignacion = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.TipoDesignacion);
      }
    );
  }
  getComboTipoSOJ() {
    this.sigaServices.get("combo_comboTipoSOJ").subscribe(
      n => {
        this.comboTipoSOJ = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboTipoSOJ);
      }
    );
  }
  getComboComisaria() {
    this.sigaServices.get("combo_comboComisaria").subscribe(
      n => {
        this.comboComisaria = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboComisaria);
      }
    );
  }
  getComboJuzgado() {
    this.sigaServices.get("combo_comboJuzgado").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboJuzgado);
      }
    );
  }
  getComboTurno() {
    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.comboTurno = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboTurno);
      }
    );
  }
  getComboguardiaPorTurno() {
    this.sigaServices.get("combo_guardiaPorTurno").subscribe(
      n => {
        this.comboguardiaPorTurno = n.combooItems;
      },
      err => {
        console.log(err);

      }, () => {
        this.arregloTildesCombo(this.comboguardiaPorTurno);
      }
    );
  }


  //Busca asuntos según los filtros
  isBuscar() {
    if (this.checkFilters()) {
      this.selectAll = false;
      this.historico = false;
      this.buscar = true;
      this.selectMultiple = false;

      this.selectedDatos = "";
      this.getColsResults();
      this.filtrosTrim();
      this.progressSpinner = true;
      this.buscar = true;

      this.body.fechaIncorporacion = [];
      this.body.fechaIncorporacion[1] = this.fechaIncorporacionHastaSelect;
      this.body.fechaIncorporacion[0] = this.fechaIncorporacionDesdeSelect;

      this.body.fechaNacimientoRango = [];
      this.body.fechaNacimientoRango[1] = this.fechaNacimientoHastaSelect;
      this.body.fechaNacimientoRango[0] = this.fechaNacimientoDesdeSelect;

      // if (
      //   this.fechaNacimientoSelect != undefined ||
      //   this.fechaNacimientoSelect != null
      // ) {
      //   this.body.fechaNacimiento = this.fechaNacimientoSelect;
      // } else {
      //   this.body.fechaNacimiento = undefined;
      // }

      this.body.colegio = [];
      this.colegiosSeleccionados.forEach(element => {
        this.body.colegio.push(element.value);
      });

      this.sigaServices
        .postPaginado(
          "busquedaAsuntos_searchColegiado",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.colegiadoSearch = JSON.parse(data["body"]);
            this.datos = this.colegiadoSearch.colegiadoItem;
            this.convertirStringADate(this.datos);
            this.table.paginator = true;
            this.body.fechaIncorporacion = [];
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

  convertirStringADate(datos) {
    datos.forEach(element => {
      if (element.fechaNacimiento == "" || element.fechaNacimiento == null) {
        element.fechaNacimientoDate = null;
      } else {
        var posIni = element.fechaNacimiento.indexOf("/");
        var posFin = element.fechaNacimiento.lastIndexOf("/");
        var year = element.fechaNacimiento.substring(posFin + 1);
        var day = element.fechaNacimiento.substring(0, posIni);
        var month = element.fechaNacimiento.substring(posIni + 1, posFin);
        element.fechaNacimientoDate = new Date(year, month - 1, day);
        element.fechaNacimiento = day + "/" + month + "/" + year;
      }
    });
  }

  isLimpiar() {
    this.body = undefined;
    this.fechaIncorporacionDesdeSelect = undefined;
    this.fechaIncorporacionHastaSelect = undefined;
    this.fechaNacimientoDesdeSelect = undefined;
    this.fechaNacimientoHastaSelect = undefined;

    if (!this.deshabilitarCombCol) {
      this.colegiosSeleccionados = [];
    }
  }

  //Elimina los espacios en blancos finales e iniciales de los inputs de los filtros
  filtrosTrim() {
    if (this.body.nif != null) {
      this.body.nif = this.body.nif.trim();
    }

    if (this.body.apellidos != null) {
      this.body.apellidos = this.body.apellidos.trim();
    }

    if (this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }

    if (this.body.numColegiado != null) {
      this.body.numColegiado = this.body.numColegiado.trim();
    }

    if (this.body.codigoPostal != null) {
      this.body.codigoPostal = this.body.codigoPostal.trim();
    }

    if (this.body.correo != null) {
      this.body.correo = this.body.correo.trim();
    }

    if (this.body.movil != null) {
      this.body.movil = this.body.movil.trim();
    }

    if (this.body.telefono != null) {
      this.body.telefono = this.body.telefono.trim();
    }
  }

  getColsResults() {
    this.cols = [
      {
        field: "colegioResultado",
        header: "censo.busquedaClientesAvanzada.literal.colegio"
      },
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden"
      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "numberColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaCliente.situacion.cabecera"
      },
      {
        field: "situacionResidente",
        header: "censo.busquedaClientes.noResidente"
      },
      {
        field: "fechaNacimientoDate",
        header: "censo.consultaDatosColegiacion.literal.fechaNac"
      },
      {
        field: "correo",
        header: "censo.datosDireccion.literal.correo"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
      },
      {
        field: "noAparecerRedAbogacia2",
        header: "censo.busquedaColegial.lopd"
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

  clear() {
    this.msgs = [];
  }

  checkFilters() {
    if (
      (this.body.nombre == null ||
        this.body.nombre == null ||
        this.body.nombre.trim().length < 3) &&
      (this.body.apellidos == null ||
        this.body.apellidos == null ||
        this.body.apellidos.trim().length < 3) &&
      (this.body.numColegiado == null ||
        this.body.numColegiado == null) &&
      (this.body.codigoPostal == null ||
        this.body.codigoPostal == null ||
        this.body.codigoPostal.trim().length < 3) &&
      (this.body.nif == null ||
        this.body.nif == null ||
        this.body.nif.trim().length < 3) &&
      (this.body.correo == null ||
        this.body.correo == null ||
        this.body.correo.trim().length < 3) &&
      (this.body.movil == null ||
        this.body.movil == null ||
        this.body.movil.trim().length < 3) &&
      (this.body.telefono == null ||
        this.body.telefono == null ||
        this.body.telefono.trim().length < 3) &&
      (this.body.idgrupo == undefined ||
        this.body.idgrupo == null ||
        this.body.idgrupo.length < 1) &&
      (this.fechaIncorporacionDesdeSelect == undefined ||
        this.fechaIncorporacionDesdeSelect == null) &&
      (this.fechaIncorporacionHastaSelect == undefined ||
        this.fechaIncorporacionHastaSelect == null) &&
      (this.body.situacion == undefined || this.body.situacion == null) &&
      (this.body.residencia == undefined || this.body.residencia == null) &&
      (this.body.inscrito == undefined || this.body.inscrito == null) &&
      (this.body.sexo == undefined || this.body.sexo == null) &&
      (this.body.idEstadoCivil == undefined ||
        this.body.idEstadoCivil == null) &&
      (this.fechaNacimientoDesdeSelect == undefined ||
        this.fechaNacimientoDesdeSelect == null) &&
      (this.fechaNacimientoHastaSelect == undefined ||
        this.fechaNacimientoHastaSelect == null) &&
      (this.body.tipoCV == undefined || this.body.tipoCV == null) &&
      (this.body.subtipoCV == undefined ||
        this.body.subtipoCV == null ||
        this.body.subtipoCV.length < 1) &&
      (this.body.tipoDireccion == undefined || this.body.tipoDireccion == null)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.apellidos != undefined) {
        this.body.apellidos = this.body.apellidos.trim();
      }
      if (this.body.numColegiado != undefined) {
        this.body.numColegiado = this.body.numColegiado.trim();
      }
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      return true;
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

  isDisabledCombos() {
    if (this.body.tipoCV != "" && this.body.tipoCV != null) {
      return false;
    } else {
      return true;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  navigateComunicar(dato) {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de CENSO es 3
    sessionStorage.setItem("idModulo", '3');
    sessionStorage.setItem("filtrosBusquedaAsuntosFichaColegial", JSON.stringify(this.body));

    this.getDatosComunicar();
  }

  onRowSelectModelos() { }

  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["body"]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.selectedDatos.forEach(element => {
                  let keysValues = [];
                  this.keys.forEach(key => {
                    if (element[key.nombre] != undefined) {
                      keysValues.push(element[key.nombre]);
                    }
                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log(err);
        }
      );
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      if (this.institucionActual != "2000") {
        this.colegiosSeleccionados = [
          {
            label: n.label,
            value: this.institucionActual
          }
        ];
        this.deshabilitarCombCol = true;
      }
    });
  }

  fillFechaIncorporacionDesde(event) {
    this.fechaIncorporacionDesdeSelect = event;
  }

  fillFechaIncorporacionHasta(event) {
    this.fechaIncorporacionHastaSelect = event;

  }

  fillFechaNacimientoDesde(event) {
    this.fechaNacimientoDesdeSelect = event;
  }

  fillFechaNacimientoHasta(event) {
    this.fechaNacimientoHastaSelect = event;
  }

}
