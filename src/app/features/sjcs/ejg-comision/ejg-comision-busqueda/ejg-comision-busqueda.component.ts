import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { TranslateService } from '../../../../commons/translate';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { CommonsService } from '../../../../_services/commons.service';
import { datos_combos } from '../../../../utils/datos_combos';
import { KEY_CODE } from '../../../administracion/auditoria/usuarios/auditoria-usuarios.component';
import { MultiSelect } from 'primeng/multiselect';
import { Console } from 'console';
import { ActasItem } from '../../../../models/sjcs/ActasItem';
@Component({
  selector: 'app-ejg-comision-busqueda',
  templateUrl: './ejg-comision-busqueda.component.html',
  styleUrls: ['./ejg-comision-busqueda.component.scss']
})
export class EjgComisionBusquedaComponent implements OnInit {

  progressSpinner: boolean = false;
  historico: boolean = false;
  msgs: any[] = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  body: EJGItem = new EJGItem();
  nuevo: boolean = true;
  inst2000: boolean;
  permisoEscritura: boolean = false;
  showdatosIdentificacion: boolean = false;
  showDatosGeneralesEJG: boolean = false;
  showDatosDefensa: boolean = false;
  showCAJG: boolean = true;
  showSolicitante: boolean = false;
  showTramitador: boolean = false;
  comboProcedimiento = [];
  comboCalidad = datos_combos.comboCalidad;
  comboPerceptivo = [];
  comboRenuncia = [];
  comboDictamen = [];
  comboFundamentoCalif = [];
  comboResolucion = [];
  // comboFundamentosResolucion = [];
  comboFundamentoJurid = [];
  comboImpugnacion = [];
  comboFundamentoImpug = [];
  comboPonente = [];
  comboColegio = [];
  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboCreadoDesde = datos_combos.comboCreadoDesde;
  comboEstadoEJG = [];
  comboTurno = [];
  comboGuardia = [];
  comboTipoLetrado = datos_combos.comboTipoLetrado;
  comboRol = [];
  comboJuzgado = [];
  institucionActual;
  maxDate;
  minDate;

  isDisabledFundamentosJurid: boolean = true;
  isDisabledFundamentosCalif: boolean = true;
  isDisabledFundamentoImpug: boolean = true;
  isDisabledGuardia: boolean = true;
  tipoLetrado;
  @Input() permisos;
  @Input() acta: ActasItem;
  /*Éste método es útil cuando queremos qeremos informar de cambios en los datos desde el hijo,
  por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();


  @ViewChild('inputNumero') inputNumero: ElementRef;

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private _elementRef: ElementRef,
    private commonServices: CommonsService) { }

  ngOnInit() {
    this.getCombos();
    
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    // if (this.persistenceService.getFiltros() != undefined) {
    //   this.body = this.persistenceService.getFiltros();

    //   this.body.annio = this.persistenceService.getFiltros().anioacta;
    if(sessionStorage.getItem("filtrosEJGCom")){
      this.body = JSON.parse(sessionStorage.getItem("filtrosEJGCom"));

      this.body.fechaAperturaDesd = this.transformDate(this.body.fechaAperturaDesd);
      this.body.fechaAperturaHast = this.transformDate(this.body.fechaAperturaHast);
      this.body.fechaEstadoDesd = this.transformDate(this.body.fechaEstadoDesd);
      this.body.fechaEstadoHast = this.transformDate(this.body.fechaEstadoHast);
      this.body.fechaLimiteDesd = this.transformDate(this.body.fechaLimiteDesd);
      this.body.fechaLimiteHast = this.transformDate(this.body.fechaLimiteHast);
      this.body.fechaDictamenDesd = this.transformDate(this.body.fechaDictamenDesd);
      this.body.fechaDictamenHast = this.transformDate(this.body.fechaDictamenHast);
      this.body.fechaImpugnacionDesd = this.transformDate(this.body.fechaImpugnacionDesd);
      this.body.fechaImpugnacionHast = this.transformDate(this.body.fechaImpugnacionHast);
      this.body.fechaPonenteDesd = this.transformDate(this.body.fechaPonenteDesd);
      this.body.fechaPonenteHast = this.transformDate(this.body.fechaPonenteHast);

      // this.persistenceService.clearFiltros();
      sessionStorage.removeItem("filtrosEJGCom");
      this.busqueda.emit(this.historico);

    } else {
      this.body = new EJGItem();
      console.log("Año -> ", new Date().getFullYear().toString());
      this.body.annio = new Date().getFullYear().toString();
    }


    if (sessionStorage.getItem("tarjeta")) {
      this.showTramitador = true;
    }

    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;
      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
    }

    setTimeout(() => {
      this.inputNumero.nativeElement.focus();
    }, 300);
  }

  getCombos() {
    this.getComboProcedimiento();
    this.getComboPerceptivo();
    this.getComboRenuncia();
    this.getComboImpugnacion();
    this.getComboTipoEJG();
    this.getComboPonenteComision();
    this.getComboEstadoEJG();
    this.getComboRol();
    this.cargarComboComision();
  }

  onChangeResolucion() {
    if (this.body.resolucion != undefined && this.body.resolucion != "") {
      this.isDisabledFundamentosJurid = false;
      this.getComboFundamentoJuridComision();
    } else {
      this.isDisabledFundamentosJurid = true;
      this.body.fundamentoJuridico = "";
    }
  }

  onChangeTipoLetrado() {
    this.comboTurno = [];
    this.tipoLetrado = 0;
    // if (this.body.tipoLetrado != undefined) {
    this.getComboTurnoComision();
    // }
  }

  onChangeDictamen() {
    this.comboFundamentoCalif = [];
    if (this.body.dictamen != undefined && this.body.dictamen != "") {
      this.isDisabledFundamentosCalif = false;
      this.getComboFundamentoCalif();

    } else {
      this.isDisabledFundamentosCalif = true;
      this.body.fundamentoCalif = null;

    }
  }
  onChangeImpugnacion() {
    this.comboFundamentoImpug = [];
    if (this.body.impugnacion != undefined && this.body.impugnacion != "") {
      this.isDisabledFundamentoImpug = false;
      this.getComboFundamentoImpug();
    } else {
      this.isDisabledFundamentoImpug = true;
      this.body.fundamentoImpuganacion = "";
    }
  }
  onChangeTurnos() {
    this.comboGuardia = [];
    if (this.body.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardiaComision();
    } else {
      this.isDisabledGuardia = true;
      this.body.guardia = "";
    }
  }

  getComboProcedimiento() {
    this.sigaServices
      .get("busquedaProcedimientos_procedimientos")
      .subscribe(
        n => {
          this.comboProcedimiento = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboProcedimiento);

        },
        err => {
          console.log(err);
        }
      );
  }
  getComboDictamenComision() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamenComision").subscribe(
      n => {
        this.comboDictamen = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDictamen);
        this.comboDictamen.push({ label: "Indiferente", value: "-1" });
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboRol() {
    this.sigaServices.get("busquedaJusticiables_comboRoles").subscribe(
      n => {
        this.comboRol = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboRol);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboPerceptivo() {
    this.sigaServices.get("filtrosejg_comboPreceptivo").subscribe(
      n => {
        this.comboPerceptivo = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboPerceptivo);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboRenuncia() {
    this.sigaServices.get("filtrosejg_comboRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboRenuncia);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboFundamentoCalif() {
    this.sigaServices.getParam(
      "filtrosejg_comboFundamentoCalif",
      "?list_dictamen=" + this.body.dictamen
    ).subscribe(
      n => {
        // this.isDisabledFundamentosCalif = false;
        this.comboFundamentoCalif = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFundamentoCalif);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboResolucionComision() {
    this.sigaServices.get("filtrosejg_comboResolucion").subscribe(
      n => {
        this.comboResolucion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboResolucion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboFundamentoJuridComision() {
    this.sigaServices
      .getParam(
        "filtrosejgcomision_comboFundamentoJuridComision","?resolucion=" + this.body.resolucion
      )
      .subscribe(
        n => {
          this.comboFundamentoJurid = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboFundamentoJurid);
        },
        error => { },
        () => { }
      );
  }
  getComboImpugnacion() {
    this.sigaServices.get("filtrosejg_comboImpugnacion").subscribe(
      n => {
        this.comboImpugnacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboImpugnacion);
        this.comboImpugnacion.push({ label: "Indiferente", value: -1 });
        this.comboImpugnacion.push({ label: "Sin Resolución", value: -2 });
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboFundamentoImpug() {
    this.sigaServices.get("filtrosejg_comboFundamentoImpug").subscribe(
      n => {
        this.comboFundamentoImpug = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFundamentoImpug);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboPonenteComision() {
    this.sigaServices.get("filtrosejgcomision_comboPonenteComision").subscribe(
      n => {
        this.comboPonente = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboPonente);
      },
      err => {
        console.log(err);
      }
    );
  }
  /* getComboColegioComision() {
    console.log("combocolegio start");
    this.sigaServices.get("busquedaCol_colegioComision").subscribe(
      n => {
        console.log("combocolegio enter");
        this.comboColegio = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboColegio);
      },
      err => {
        console.log(err);
      }
    );
  } */

  getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTipoEJGColegioComision() {
    //this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
    this.sigaServices.get("filtrosejg_comboTipoEJGColegioComision").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoEJGColegio);
      },
      err => {
        console.log(err);
      }
    );
  }

  cargarComboComision() {
    this.getComboJuzgadoComision();
    this.getComboDictamenComision();
    this.getComboResolucionComision();
    this.getComboTipoEJGColegioComision();
  }

  getComboEstadoEJG() {
    this.sigaServices.get("filtrosejgcomision_comboEstadoEJGComision").subscribe(
      n => {
        this.comboEstadoEJG = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstadoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTurnoComision() {
    if (this.body.tipoLetrado == "E") {
      this.tipoLetrado = "2";
    } else if (this.body.tipoLetrado == "D" || this.body.tipoLetrado == "A") { this.tipoLetrado = "1"; }
    this.sigaServices.getParam("filtrosejg_comboTurno",
      "?idTurno=" + this.tipoLetrado).subscribe(
        n => {
          this.comboTurno = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurno);
        },
        err => {
          console.log(err);
        }
      );

  }
  getComboGuardiaComision() {
    this.sigaServices.getParam(
      "combo_guardiaPorTurno",
      "?idTurno=" + this.body.idTurno
    )
      .subscribe(
        col => {
          this.comboGuardia = col.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      );
  }

  getComboJuzgadoComision() {
    this.sigaServices.get("filtrosejg_comboJuzgados").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboJuzgado);
      },
      err => {
        console.log(err);
      }
    );
  }

  fillFechaDictamenDesd(event) {
    this.body.fechaDictamenDesd = event;
  }
  fillFechaDictamenHast(event) {
    this.body.fechaDictamenHast = event;
  }
  fillFechaResolucionDesd(event) {
    this.body.fechaResolucionDesd = event;
  }
  fillFechaResolucionHast(event) {
    this.body.fechaResolucionHast = event;
  }
  fillFechaImpugnacionDesd(event) {
    this.body.fechaImpugnacionDesd = event;
  }
  fillFechaImpugnacionHast(event) {
    this.body.fechaImpugnacionHast = event;
  }
  fillFechaPonenteHast(event) {
    this.body.fechaPonenteHast = event;
  }
  fillFechaPonenteDesd(event) {
    this.body.fechaPonenteDesd = event;
  }
  fillFechaAperturaDesd(event) {
    this.body.fechaAperturaDesd = event;
  }
  fillFechaAperturaHast(event) {

    this.body.fechaAperturaHast = event;
  }
  fillFechaEstadoDesd(event) {
    this.body.fechaEstadoDesd = event;
  }
  fillFechaEstadoHast(event) {
    this.body.fechaEstadoHast = event;
  }
  fillFechaLimiteDesd(event) {
    this.body.fechaLimiteDesd = event;
  }
  fillFechaLimiteHast(event) {
    this.body.fechaLimiteHast = event;
  }

  // Control de fechas
  getFechaHastaCalendar(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }

  getFechaDesdeCalendar(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }

  onHideDatosIdentificacion() {
    this.showdatosIdentificacion = !this.showdatosIdentificacion;
  }
  onHideDatosGeneralesEJG() {
    this.showDatosGeneralesEJG = !this.showDatosGeneralesEJG;
  }
  onHideDatosDefensa() {
    this.showDatosDefensa = !this.showDatosDefensa;
  }
  onHideCAJG() {
    this.showCAJG = !this.showCAJG;
  }
  onHideSolicitante() {
    this.showSolicitante = !this.showSolicitante;
  }
  onHideTramitador() {
    this.showTramitador = !this.showTramitador;
  }

  isLimpiar() {
  }

  checkFilters() {
    if (this.body.annio != undefined)
      this.body.annio = this.body.annio.trim();
    if (this.body.numero != undefined)
      this.body.numero = this.body.numero.trim();
    if (this.body.asunto != undefined)
      this.body.asunto = this.body.asunto.trim();
    if (this.body.numAnnioProcedimiento != undefined)
      this.body.numAnnioProcedimiento = this.body.numAnnioProcedimiento.trim();
    if (this.body.nig != undefined)
      this.body.nig = this.body.nig.trim();
    if (this.body.annioCAJG != undefined)
      this.body.annioCAJG = this.body.annioCAJG.trim();
    if (this.body.numCAJG != undefined)
      this.body.numCAJG = this.body.numCAJG.trim();
    if (this.body.annioActa != undefined)
      this.body.annioActa = this.body.annioActa.trim();
    if (this.body.numActa != undefined)
      this.body.numActa = this.body.numActa.trim();
    if (this.body.numRegRemesa1 != undefined)
      this.body.numRegRemesa1 = this.body.numRegRemesa1.trim();
    if (this.body.numRegRemesa2 != undefined)
      this.body.numRegRemesa2 = this.body.numRegRemesa2.trim();
    if (this.body.numRegRemesa3 != undefined)
      this.body.numRegRemesa3 = this.body.numRegRemesa3.trim();
    if (this.body.nif != undefined)
      this.body.nif = this.body.nif.trim();
    if (this.body.apellidos != undefined)
      this.body.apellidos = this.body.apellidos.trim();
    if (this.body.nombre != undefined)
      this.body.nombre = this.body.nombre.trim();

    if (
      (this.body.annio == null || this.body.annio.trim() == "" || this.body.annio.trim().length < 3) &&
      (this.body.numero == null || this.body.numero.trim() == "" || this.body.numero.trim().length < 3) &&
      (this.body.numAnnioProcedimiento == null || this.body.numAnnioProcedimiento.trim() == "" || this.body.numAnnioProcedimiento.trim().length < 3) &&
      (this.body.nig == null || this.body.nig.trim() == "" || this.body.nig.trim().length < 3) &&
      (this.body.annioCAJG == null || this.body.annioCAJG.trim() == "" || this.body.annioCAJG.trim().length < 3) &&
      (this.body.numCAJG == null || this.body.numCAJG.trim() == "" || this.body.numCAJG.trim().length < 3) &&
      (this.body.annioActa == null || this.body.annioActa.trim() == "" || this.body.annioActa.trim().length < 3) &&
      (this.body.numActa == null || this.body.numActa.trim() == "" || this.body.numActa.trim().length < 3) &&
      (this.body.numRegRemesa1 == null || this.body.numRegRemesa1.trim() == "" || this.body.numRegRemesa1.trim().length < 3) &&
      (this.body.numRegRemesa2 == null || this.body.numRegRemesa2.trim() == "" || this.body.numRegRemesa2.trim().length < 3) &&
      (this.body.numRegRemesa3 == null || this.body.numRegRemesa3.trim() == "" || this.body.numRegRemesa3.trim().length < 3) &&
      (this.body.nif == null || this.body.nif.trim() == "" || this.body.nif.trim().length < 3) &&
      (this.body.apellidos == null || this.body.apellidos.trim() == "" || this.body.apellidos.trim().length < 3) &&
      (this.body.nombre == null || this.body.nombre.trim() == "" || this.body.nombre.trim().length < 3) &&
      (this.body.asunto == null || this.body.asunto.trim() == "" || this.body.asunto.trim().length < 3)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      return true;
    }
  }
  //Busca ejg según los filtros
  isBuscar() {
    if (this.checkFilters()) {
      //this.persistenceService.setFiltros(this.body);
      // this.persistenceService.setFiltrosAux(this.body);

      if (this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != null
        && this.usuarioBusquedaExpress.numColegiado.trim() != "") {
        this.body.numColegiado = this.usuarioBusquedaExpress.numColegiado;
      }
      console.log(this.body);

      this.busqueda.emit(false);

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
  clearFiltersTramitador() {
    this.body.idTurno = "";
    this.body.guardia = "";
    this.body.numColegiado = "";
    this.body.apellidosYNombre = "";
    this.body.tipoLetrado = "";
  }
  clearFilters() {
    this.body = new EJGItem();
    this.persistenceService.clearFiltros();
    this.inputNumero.nativeElement.focus();
    this.body.annio = new Date().getFullYear().toString();
    this.showdatosIdentificacion = true;
    this.showDatosGeneralesEJG = false;
    this.showDatosDefensa = false;
    this.showCAJG = false;
    this.showSolicitante = false;
    this.showTramitador = false;
    this.goTop();
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }

  }

  checkPermisosIsNuevo() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.isNuevo();
    }
  }
  isNuevo() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }
  clear() {
    this.msgs = [];
  }

  getPersona(idPersona) {
    // if (idPersona != undefined && idPersona != "")
    this.body.idPersona = idPersona;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }
  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }
}
