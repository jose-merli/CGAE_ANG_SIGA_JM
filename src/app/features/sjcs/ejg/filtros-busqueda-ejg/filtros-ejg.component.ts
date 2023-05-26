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
import { Location } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { underscore } from '@angular-devkit/core/src/utils/strings';

@Component({
  selector: 'app-filtros-ejg',
  templateUrl: './filtros-ejg.component.html',
  styleUrls: ['./filtros-ejg.component.scss']
})
export class FiltrosEjgComponent implements OnInit {
  progressSpinner: boolean = false;
  historico: boolean = false;
  msgs: any[] = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  body: EJGItem = new EJGItem();
  nuevo: boolean = true;
  inst2000: boolean;
  //permisoEscritura: boolean = false;
  showdatosIdentificacion: boolean = true;
  showDatosGeneralesEJG: boolean = false;
  showDatosDefensa: boolean = false;
  showCAJG: boolean = false;
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
  comboEstadosExpEco = [
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.inicial'), value: '10' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.inicialEsperando'), value: '15' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.espera'), value: '20' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.esperaEsperando'), value: '25' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.pendienteInfo'), value: '23' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.finalizado'), value: '30' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.errorSolicitud'), value: '40' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.errorConsultaInfo'), value: '50' },
    { label: this.translateService.instant('justiciaGratuita.ejg.solicitante.solicitudExpEconomico.estado.caducado'), value: '60' }
  ];
  institucionActual;
  maxDate;
  minDate;
  resaltadoDatos: boolean = false;
  numRemesaRelleno: boolean = false;
  sufijoRemesaRelleno: boolean = false;
  tipoLetradoRelleno: boolean = false;
  idTurnoRelleno: boolean = false;
  numColegiadoRelleno: boolean = false;

  isDisabledFundamentosJurid: boolean = true;
  isDisabledFundamentosCalif: boolean = true;
  isDisabledFundamentoImpug: boolean = true;
  isDisabledGuardia: boolean = true;
  tipoLetrado;

  //Variables para Combo Rol
  selectedItemsRol = [];
  selectedRolVisible = [];
  dropdownList = [];
  selectRoles: boolean = true;



  bodyDictamen = [];
  @Input() permisos;
  @Input() remesa;
  /*Éste método es útil cuando queremos qeremos informar de cambios en los datos desde el hijo,
  por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();
  @Input() permisoEscritura;

  remesaFicha: boolean = false;


  @ViewChild('inputNumero') inputNumero: ElementRef;

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: '',
    idPersona: ''
  };
  datoParaEjg: boolean = false;

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private _elementRef: ElementRef,
    private commonServices: CommonsService,
    private location: Location) { }


  ngOnInit() {
    this.datoParaEjg = sessionStorage.getItem('datoParaEjg') === 'true';
    sessionStorage.removeItem('datoParaEjg');
    sessionStorage.removeItem("modoBusqueda");
    this.progressSpinner = true;
    this.getCombos();

    if (this.remesa != null || this.remesa != undefined) {
      this.remesaFicha = true;
      this.body.informacionEconomica = this.remesa.informacionEconomica;
    }



    //console.log("Viene de la ficha de una remesa? -> ", this.remesaFicha);
    //console.log("Remesa -> ", this.remesa);

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }
    if (this.persistenceService.getFiltrosEJG() != undefined && this.persistenceService.getVolverEJG() != undefined) {
        this.body = this.persistenceService.getFiltrosEJG();
        if (this.body.dictamen != undefined && this.body.dictamen != null && this.body.dictamen != "") this.bodyDictamen = Array.from(this.body.dictamen);
    
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
    
          this.persistenceService.clearFiltrosEJG();
          this.persistenceService.clearVolverEJG();
          this.busqueda.emit(this.historico);
    
    } else {
      this.body = new EJGItem();
      this.body.annio = new Date().getFullYear().toString();
      if (this.remesa != null || this.remesa != undefined) {
        this.body.informacionEconomica = this.remesa.informacionEconomica;
      }
      this.persistenceService.clearFiltrosEJG();
      this.persistenceService.clearVolverEJG();
    }      


    if (sessionStorage.getItem("tarjeta")) {
      this.showTramitador = true;
      sessionStorage.removeItem("tarjeta");
    }

    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;
      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
      this.usuarioBusquedaExpress.idPersona = busquedaColegiado.idPersona;
      this.body.tipoLetrado = "E";
      this.tipoLetrado = "1";
    }

    setTimeout(() => {
      this.inputNumero.nativeElement.focus();
    }, 300);
    this.progressSpinner = false;
  }

  getCombos() {
    this.getComboProcedimiento();
    // this.getComboCalidad();
    this.getComboDictamen();
    this.getComboPerceptivo();
    this.getComboRenuncia();
    this.getComboResolucion();
    this.getComboRenuncia();
    this.getComboImpugnacion();
    this.getComboPonente();
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    // this.getComboCreadoDesde();
    this.getComboEstadoEJG();
    this.getComboTurno();
    // this.getComboGuardia();
    // this.getComboTipoLetrado();
    this.getComboRol();
    this.getComboJuzgado();
    this.getComboColegio();
    // this.getComboFundamentosResoluc();
  }

  onChangeResolucion() {
    //this.comboFundamentosResolucion = [];

    if (this.body.resolucion != undefined && this.body.resolucion != "") {
      this.isDisabledFundamentosJurid = false;
      this.getComboFundamentoJurid();
    } else {
      this.isDisabledFundamentosJurid = true;
      this.body.fundamentoJuridico = "";
    }
  }



  onChangeTipoLetrado() {
    this.comboTurno = [];
    this.tipoLetrado = 0;
    // if (this.body.tipoLetrado != undefined) {
    this.getComboTurno();
    // }
  }

  onChangeDictamen() { 
    this.comboFundamentoCalif = [];
    if (this.bodyDictamen != undefined && /*this.bodyDictamen != [] &&*/ this.bodyDictamen.length != 0) {
      this.isDisabledFundamentosCalif = false;
      this.getComboFundamentoCalif();

    } else {
      this.isDisabledFundamentosCalif = true;
      //this.body.fundamentoCalif = "";
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
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.body.idGuardia = "";
    }
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    if (this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != null
      && this.usuarioBusquedaExpress.numColegiado.trim() != "") {
      this.body.numColegiado = this.usuarioBusquedaExpress.numColegiado;
      this.body.idPersona = this.usuarioBusquedaExpress.idPersona;
      this.body.tipoLetrado = "E";
      this.tipoLetrado = "1";
    } else {
      this.usuarioBusquedaExpress.numColegiado = " ";
      this.body.numColegiado = "";
      this.body.idPersona = "";
      sessionStorage.removeItem("numColegiado");
      this.numColegiadoRelleno = false;
      this.body.tipoLetrado = "";
      this.tipoLetrado = "";
    }
  }

  getComboProcedimiento() {
    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
        n => {
          this.comboProcedimiento = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboProcedimiento);

        },
        err => {
          //console.log(err);
        }
      );
  }
  getComboDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboDictamen.push({ label: "< Indiferente >", value: "-1" });
        this.comboDictamen.push({ label: "< Sin dictamen informado>", value: "0" });
        if (n.combooItems != null && n.combooItems != undefined) {
          n.combooItems.forEach(element => {
            this.comboDictamen.push(element);
          });
          this.commonServices.arregloTildesCombo(this.comboDictamen);
        }
        this.bodyDictamen.push("-1");
      },
      err => {
        //console.log(err);
      }
    );
  }
  getComboRol() {

    this.sigaServices.get("busquedaJusticiables_comboRoles").subscribe(
      n => {
        this.comboRol = n.combooItems;
        // Inicializar Estados Roles.
        this.body.estadosRoles = [];

        this.comboRol.forEach(element => {

          // Combo rol esta activo pasar por defecto los valores sino por defecto
          if (this.selectRoles == false) {
            // Verificar los Roles (SOLICITANTE Y UNIDAD FAMILIAR)
            if (element.value == 1 || element.value == 4) {
              // Añadir en estados roles visibles.
              this.body.estadosRoles.push(element.value);
            }
          }

        });
        this.commonServices.arregloTildesCombo(this.comboRol);

      },
      err => {
        //console.log(err);
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
        //console.log(err);
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
        //console.log(err);
      }
    );
  }
  getComboFundamentoCalif() {

    this.sigaServices.getParam(
      "filtrosejg_comboFundamentoCalif",
      "?list_dictamen=" + this.bodyDictamen.toString()
    ).subscribe(
      n => {
        // this.isDisabledFundamentosCalif = false;
        this.comboFundamentoCalif = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboFundamentoCalif);
      },
      err => {
        //console.log(err);
      }
    );
  }
  getComboResolucion() {
    this.sigaServices.get("filtrosejg_comboResolucion").subscribe(
      n => {
        this.comboResolucion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboResolucion);
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboFundamentoJurid() {
    this.sigaServices
      .getParam(
        "filtrosejg_comboFundamentoJurid",
        "?resolucion=" + this.body.resolucion
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
        //console.log(err);
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
        //console.log(err);
      }
    );
  }
  getComboPonente() {
    this.sigaServices.get("filtrosejg_comboPonente").subscribe(
      n => {
        this.comboPonente = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboPonente);
      },
      err => {
        //console.log(err);
      }
    );
  }
  getComboColegio() {

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.sigaServices.getParam(
        "busquedaCol_colegio",
        "?idInstitucion=" + this.institucionActual).subscribe(
          n => {
            this.comboColegio = n.combooItems;
            this.body.colegio = this.institucionActual;
            this.commonServices.arregloTildesCombo(this.comboColegio);
            if (this.institucionActual == '2000') {
              this.inst2000 = false;
            } else { this.inst2000 = true; }
          },
          err => {
            //console.log(err);
          }
        );

    });
  }

  getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoEJG);
      },
      err => {
        //console.log(err);
      }
    );
  }
  getComboTipoEJGColegio() {
    this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTipoEJGColegio);
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboEstadoEJG() {
    this.sigaServices.get("filtrosejg_comboEstadoEJG").subscribe(
      n => {
        this.comboEstadoEJG = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstadoEJG);

        if (this.remesaFicha) {
          let comboItem = this.comboEstadoEJG.find(comboEstadoEJG => comboEstadoEJG.value == '7');
          let comboItem2 = this.comboEstadoEJG.find(comboEstadoEJG => comboEstadoEJG.value == '17');

          this.comboEstadoEJG[0] = comboItem;
          this.comboEstadoEJG[1] = comboItem2;

          for (; this.comboEstadoEJG.length > 2;) {
            this.comboEstadoEJG.pop();
          }
        }
        //console.log("comboEstadoEJG -> ", this.comboEstadoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTurno() {
    if (this.body.tipoLetrado == "E") {
      this.tipoLetrado = "1";
    } else if (this.body.tipoLetrado == "D" || this.body.tipoLetrado == "A") {
      this.tipoLetrado = "2";
    }
    this.sigaServices.getParam("filtrosejg_comboTurno",
      "?idTurno=" + this.tipoLetrado).subscribe(
        n => {
          this.comboTurno = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurno);
        },
        err => {
          //console.log(err);
        }
      );

  }
  getComboGuardia() {
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
          //console.log(err);
        }
      );
  }

  getComboJuzgado() {
    this.sigaServices.get("filtrosejg_comboJuzgados").subscribe(
      n => {
        this.comboJuzgado = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboJuzgado);
      },
      err => {
        //console.log(err);
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
    //if (this.body.annio != undefined)
    //  this.body.annio = this.body.annio.trim();
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
      (this.body.annio == null || this.body.annio == "" || this.body.annio.length < 3) &&
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
      if (this.disableBuscar() == false) {
        if (this.tipoLetradoRelleno == false && (this.idTurnoRelleno == true && this.numColegiadoRelleno == true)) {
          this.camposObligatoriosTurnoOLetrado();
        } else {
          this.muestraCamposObligatorios();
        }
      } else {
        if (this.usuarioBusquedaExpress.numColegiado != undefined && this.usuarioBusquedaExpress.numColegiado != null
          && this.usuarioBusquedaExpress.numColegiado.trim() != "") {
          this.body.numColegiado = this.usuarioBusquedaExpress.numColegiado;
          this.body.idPersona = this.usuarioBusquedaExpress.idPersona;
        }

        if (sessionStorage.getItem("numColegiado") != undefined && sessionStorage.getItem("numColegiado") != null
          && sessionStorage.getItem("numColegiado").trim() != "") {
          this.body.numColegiado = sessionStorage.getItem("numColegiado");
        }

        if (this.bodyDictamen.toString() != undefined && this.bodyDictamen.toString() != null && this.bodyDictamen.toString() != "") {
          this.body.dictamen = this.bodyDictamen.toString()
        }

        // Verificar que los estados Roles no esten vacios.
        if (this.body.estadosRoles != undefined) {
          // Convertir Array a String para enviar roles.
          this.body.rol = this.body.estadosRoles.sort().toString();
        }

        // Comprobar que Rol esta vacio.
        if(this.body.estadosRoles.length == 0) {
          // Desactivar Rol
          this.selectRoles = true;
          this.body.estadosRoles = [];
        }else{
          this.selectRoles = false;
        }
  
        sessionStorage.setItem(
          "filtrosEJG",
          JSON.stringify(this.body));


        this.busqueda.emit(false);
        this.body.dictamen = "";
        

      }
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
    this.body.idGuardia = "";
    this.body.numColegiado = "";
    this.body.apellidosYNombre = "";
    this.body.tipoLetrado = "";
    this.body.idPersona = "";
    this.numColegiadoRelleno = false;
    this.tipoLetrado = "";
    this.usuarioBusquedaExpress.numColegiado = '';
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.idPersona = '';
    sessionStorage.removeItem("numColegiado");
  }
  clearFilters() {
    this.body = new EJGItem();
    this.persistenceService.clearFiltrosEJG();
    this.inputNumero.nativeElement.focus();
    this.body.annio = new Date().getFullYear().toString();

    this.bodyDictamen = [];

    this.clearFiltersTramitador();
    this.getComboColegio();
    // Actualizar Items por defectos.
    this.getComboRol();
    // Desactivar Roles por defectos.
    this.selectRoles = true;

    if (this.remesa != null || this.remesa != undefined) {
      this.body.informacionEconomica = this.remesa.informacionEconomica;
    }

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
    if (this.permisoEscritura == false) {
      let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
      if (msg != undefined) {
        this.msgs = msg;
      }
    } else {
      this.isNuevo();
    }
    /* let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.isNuevo();
    } */
  }
  isNuevo() {
    if (sessionStorage.getItem("EJGItem")) {
      sessionStorage.removeItem("EJGItem");
    }

    this.persistenceService.clearDatos();
    sessionStorage.setItem("Nuevo", "true");
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

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonServices.styleObligatorio(evento);
    }
  }
  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  camposObligatoriosTurnoOLetrado() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.campoTurnoLetradoObligatorio') }];
    this.resaltadoDatos = true;
  }

  disableBuscar() {
    this.comprobarCamposObligatorios();
    if ((this.numRemesaRelleno == true && this.sufijoRemesaRelleno == false)
      || (this.numRemesaRelleno == false && this.sufijoRemesaRelleno == true)
      || (this.tipoLetradoRelleno == false && (this.idTurnoRelleno == true && this.numColegiadoRelleno == true))) {
      return false;
    } else {
      return true;
    }
  }

  comprobarCamposObligatorios() {
    if ((this.body.numRegRemesa2 == undefined || this.body.numRegRemesa2 == null || this.body.numRegRemesa2 == "")) {
      this.numRemesaRelleno = true;
    } else {
      this.numRemesaRelleno = false;
    }

    if ((this.body.numRegRemesa3 == undefined || this.body.numRegRemesa3 == null || this.body.numRegRemesa3 == "")) {
      this.sufijoRemesaRelleno = true;
    } else {
      this.sufijoRemesaRelleno = false;
    }

    if (this.body.tipoLetrado == undefined || this.body.tipoLetrado == null || this.body.tipoLetrado == "") {
      this.tipoLetradoRelleno = true;
    } else {
      this.tipoLetradoRelleno = false;
    }

    if (this.body.idTurno == undefined || this.body.idTurno == null || this.body.idTurno == "") {
      this.idTurnoRelleno = true;
    } else {
      this.idTurnoRelleno = false;
    }

    if ((this.usuarioBusquedaExpress.numColegiado == undefined || this.usuarioBusquedaExpress.numColegiado == null || this.usuarioBusquedaExpress.numColegiado == "")
      && (this.usuarioBusquedaExpress.nombreAp == undefined || this.usuarioBusquedaExpress.nombreAp == null || this.usuarioBusquedaExpress.nombreAp == "")) {
      this.numColegiadoRelleno = true;
    } else {
      this.numColegiadoRelleno = false;
    }
  }

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
  }

  onChangeRol() {
    if (this.body.nombre == undefined) {
      this.body.nombre = "";
    }
    if (this.body.apellidos == undefined) {
      this.body.apellidos = "";
    }
    if (this.body.nif == undefined) {
      this.body.nif = "";
    }

    if (this.body.nombre.length != 0 ||
      this.body.apellidos.length != 0 ||
      this.body.nif.length != 0) {
      this.selectRoles = false;
    } else {
      this.selectRoles = true;
      this.body.estadosRoles = [];
    }

    if (this.body.nombre.length == 0 ||
      this.body.apellidos.length == 0 ||
      this.body.nif.length == 0) {
      this.getComboRol();
    }

  }
  volver(){
    this.progressSpinner = true;
    this.location.back();
  }



}
