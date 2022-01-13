import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
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
import { PersistenceService } from "../../../_services/persistence.service";

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
  comboguardiaPorTurno: any[] = [];
  textSelected: String = "{0} etiquetas seleccionadas";
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
  customError: string;
  //Diálogo de comunicación
  filtrosComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  first: number = 0;
  clasesComunicaciones: any = [];
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];
  comboTiposAsitencia: any[];

  @Input() permisoEscritura;
  @Input() idPersona;

  @Output() isOpen = new EventEmitter<boolean>();

  institucionActual: any;
  deshabilitarCombCol: boolean = false;
  colegiosSeleccionados: any[] = [];
  radioTarjeta: String = 'ejg';
  showDesignacion: boolean = true;
  showSOJ: boolean = true;
  showAsistencias: boolean = true;
  comboEstadoDesignacion: { label: string; value: string; }[];
  filtroAux: any;
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private persistenceService: PersistenceService
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
    let fecha;
    fecha = new Date();
    this.filtros.anio = fecha.getFullYear();
  }

  changeFilters() {
    let filtrosNuevos = new AsistenciasItem;
    filtrosNuevos.anio = this.filtros.anio;
    filtrosNuevos.numero = this.filtros.numero;
    filtrosNuevos.fechadesde = this.filtros.fechadesde;
    filtrosNuevos.fechahasta = this.filtros.fechahasta;
    filtrosNuevos.idTurno = this.filtros.idTurno;
    filtrosNuevos.idGuardia = undefined;
    filtrosNuevos.nif = this.filtros.nif;
    filtrosNuevos.apellidos = this.filtros.apellidos;
    filtrosNuevos.nombre = this.filtros.nombre;

    this.filtros = new AsistenciasItem;
    this.filtros = filtrosNuevos;
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

  fillFechaAperturaDesde(event) {
    this.filtros.fechaAperturaDesde = event;
  }
  fillFechaAperturaHasta(event) {
    this.filtros.fechaAperturaHasta = event;
  }
  oSnChangeRowsPerPages(event) {
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

  getCombos() {
    this.getComboEstadoDesignacion();
    this.getComboTipoEjg();
    this.getComboTipoEjgColegio();
    this.getComboEstadoEjg();
    this.getComboTipoDesignacion();
    this.getComboTipoSOJ();
    this.getComboComisaria();
    this.getComboJuzgado();
    this.getComboTiposAsistencia();
    this.getComboTurno();
    //  este depende de turno
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

  getComboTiposAsistencia() {
    this.progressSpinner = true;

    this.sigaServices.get("gestionTiposAsistencia_ComboTiposAsistencia").subscribe(
      n => {

        this.comboTiposAsitencia = n.combooItems;
        this.arregloTildesCombo(this.comboTiposAsitencia);

      },
      err => {
        console.log(err);
      }
      , () => {
        this.progressSpinner = false;
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
    // this.sigaServices.getParam("combo_TipoDesignacion", "?idTurno=" + evento.value).subscribe(

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
  getComboguardiaPorTurno(evento) {
    this.filtros.idTurno = evento.value;
    if (evento.value != undefined)
      this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + evento.value).subscribe(
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

  getIdPersona(evento) {
    this.idPersona = evento;
  }

  comprobarCamposCompuestos() {
    let continuar = true;
    if ((this.filtros.anio == undefined || this.filtros.anio == "") && (this.filtros.numero != undefined && this.filtros.undefined != "")) {
      continuar = false;
      this.customError = "scs.busquedaasuntos.error.campoanio";
    }
    if ((this.filtros.anio != undefined && this.filtros.anio != "") && (this.filtros.numero == undefined || this.filtros.numero == "")) {
      continuar = false;
      this.customError = "scs.busquedaasuntos.error.camponumero";
    }

    // if (this.filtros.anioProcedimiento == undefined && this.filtros.numProcedimiento != undefined) {
    //   continuar = false;
    //   this.customError = "scs.busquedaasuntos.error.campoanio";
    // }
    // if (this.filtros.anioProcedimiento != undefined && this.filtros.numProcedimiento == undefined) {
    //   continuar = false;
    //   this.customError = "scs.busquedaasuntos.error.camponumero";
    // }

    // if (this.filtros.numeroDiligencia == undefined && this.filtros.asunto != undefined) {
    //   continuar = false;
    //   this.customError = "scs.busquedaasuntos.error.campondiligencia";
    // }
    // if (this.filtros.numeroDiligencia != undefined && this.filtros.asunto == undefined) {
    //   continuar = false;
    //   this.customError = "scs.busquedaasuntos.error.camponasunto";
    // }
    if (this.filtros.fechaAperturaDesde == undefined && this.filtros.fechaAperturaHasta != undefined) {
      continuar = false;
      this.customError = "scs.busquedaasuntos.error.campofaperturadesde";
    }
    if (this.filtros.fechaAperturaDesde != undefined && this.filtros.fechaAperturaHasta == undefined) {
      continuar = false;
      this.customError = "scs.busquedaasuntos.error.campofaperturahasta";
    }

    // if (this.filtros.anioRegistro == undefined && this.filtros.numProcedimientoRegistro != undefined) {
    //   continuar = false;
    //   this.customError = "scs.busquedaasuntos.error.campoanio";
    // }
    // if (this.filtros.anioRegistro != undefined && this.filtros.numProcedimientoRegistro == undefined) {
    //   continuar = false;
    //   this.customError = "scs.busquedaasuntos.error.camponumero";
    // }

    return continuar;
  }

  isBuscar() {
    if (this.comprobarCamposCompuestos()) {
      this.filtrosTrim();
      this.filtros.radioTarjeta = this.radioTarjeta;
      if (this.idPersona != undefined && this.idPersona != "")
        this.filtros.idPersonaColegiado = this.idPersona;
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux()
      this.isOpen.emit(false)

    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(this.customError));
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
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
    this.filtros = new AsistenciasItem();

    if (!this.deshabilitarCombCol) {
      this.colegiosSeleccionados = [];
    }
  }

  //Elimina los espacios en blancos finales e iniciales de los inputs de los filtros
  filtrosTrim() {
    if (this.filtros.nif != null) {
      this.filtros.nif = this.filtros.nif.trim();
    }
    if (this.filtros.apellidos != null) {
      this.filtros.apellidos = this.filtros.apellidos.trim();
    }
    if (this.filtros.nombre != null) {
      this.filtros.nombre = this.filtros.nombre.trim();
    }
    if (this.filtros.anioRegistro != null) {
      this.filtros.anioRegistro = this.filtros.anioRegistro.trim();
    }
    if (this.filtros.numero != null) {
      this.filtros.numero = this.filtros.numero.trim();
    }
    if (this.filtros.idInstitucion != null) {
      this.filtros.idInstitucion = this.filtros.idInstitucion.trim();
    }
    if (this.filtros.idTurno != null) {
      this.filtros.idTurno = this.filtros.idTurno.trim();
    }
    if (this.filtros.idGuardia != null) {
      this.filtros.idGuardia = this.filtros.idGuardia.trim();
    }
    if (this.filtros.nig != null) {
      this.filtros.nig = this.filtros.nig.trim();
    }
    if (this.filtros.idTipoEjg != null) {
      this.filtros.idTipoEjg = this.filtros.idTipoEjg.trim();
    }
    if (this.filtros.idTipoEjColegio != null) {
      this.filtros.idTipoEjColegio = this.filtros.idTipoEjColegio.trim();
    }
    if (this.filtros.idEstadoPorEjg != null) {
      this.filtros.idEstadoPorEjg = this.filtros.idEstadoPorEjg.trim();
    }
    if (this.filtros.idTipoDesignacion != null) {
      this.filtros.idTipoDesignacion = this.filtros.idTipoDesignacion.trim();
    }
    if (this.filtros.anioProcedimiento != null) {
      this.filtros.anioProcedimiento = this.filtros.anioProcedimiento.trim();
    }
    if (this.filtros.numProcedimiento != null) {
      this.filtros.numProcedimiento = this.filtros.numProcedimiento.trim();
    }
    if (this.filtros.numProcedimientoRegistro != null) {
      this.filtros.numProcedimientoRegistro = this.filtros.numProcedimientoRegistro.trim();
    }
    if (this.filtros.idJuzgado != null) {
      this.filtros.idJuzgado = this.filtros.idJuzgado.trim();
    }
    if (this.filtros.numeroDiligencia != null) {
      this.filtros.numeroDiligencia = this.filtros.numeroDiligencia.trim();
    }
    if (this.filtros.asunto != null) {
      this.filtros.asunto = this.filtros.asunto.trim();
    }
    if (this.filtros.comisaria != null) {
      this.filtros.comisaria = this.filtros.comisaria.trim();
    }

  }

  getColsResults() {

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
    if (this.filtros.tipoCV != "" && this.filtros.tipoCV != null) {
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
    sessionStorage.setItem("filtrosBusquedaAsuntosFichaColegial", JSON.stringify(this.filtros));

    this.getDatosComunicar();
  }

  onRowSelectModelos() { }

  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["filtros"]);
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
            data["filtros"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["filtros"]).keysItem;
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


}
