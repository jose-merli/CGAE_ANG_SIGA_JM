import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { TranslateService } from '../../../../commons/translate';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { CommonsService } from '../../../../_services/commons.service';
import { datos_combos } from '../../../../utils/datos_combos';

@Component({
  selector: 'app-filtros-ejg',
  templateUrl: './filtros-ejg.component.html',
  styleUrls: ['./filtros-ejg.component.scss']
})
export class FiltrosEjgComponent implements OnInit {

  historico: boolean = false;
  msgs: any[] = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  body: EJGItem = new EJGItem();
  bodyAux: EJGItem = new EJGItem();
  nuevo: boolean = true; //ojo no poner a pelo
  inst2000: boolean;
  showdatosIdentificacion: boolean = true;
  showDatosGeneralesEJG: boolean = true;
  showDatosDefensa: boolean = true;
  showCAJG: boolean = true;
  showSolicitante: boolean = true;
  showTramitador: boolean = true;
  //inicializar los combos
  comboProcedimeinto = [];
  comboCalidad = datos_combos.comboCalidad;
  comboPerceptivo = [];
  comboRenuncia = [];
  comboDictamen = [];
  comboFundamentoCalif = [];
  comboResolucion = [];
  comboFundamentosResolucion = [];
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

  isDisabledFundamentosJurid: boolean = true;
  isDisabledFundamentosCalif: boolean = true;
  isDisabledFundamentoImpug: boolean = true;
  @Input() permisos;
  /*Éste método es útil cuando queremos qeremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) { }


  ngOnInit() {
    this.getCombos();

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisos = this.persistenceService.getPermisos();
    }

    if (this.persistenceService.getFiltros() != undefined) {
      this.body = this.persistenceService.getFiltros();

      if (this.persistenceService.getFiltrosAux() != undefined) {
        this.bodyAux = this.persistenceService.getFiltrosAux(); //SEGURO??
      }
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.busqueda.emit(this.historico)

    } else {
      this.body = new EJGItem(); //ponia filtros, yo lo cambie x body. no seguro
      this.bodyAux = new EJGItem(); //SEGURO?
    }
    this.body.annio = new Date().getFullYear().toString();
  }
  getCombos() {

    this.getComboProcedimiento();
    // this.getComboCalidad();
    this.getComboDictamen();
    this.getComboPerceptivo();
    this.getComboRenuncia();
    this.getComboFundamentoCalif();
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
    this.comboFundamentosResolucion = [];

    if (this.body.resolucion != undefined && this.body.resolucion != "") {
      this.isDisabledFundamentosJurid = false;
      this.getComboFundamentoJurid();
    } else {
      this.isDisabledFundamentosJurid = true;
      this.body.fundamentoJuridico = "";
    }
  }

  onChangeDictamen() {
    this.comboFundamentoCalif = [];
    if (this.body.dictamen != undefined && this.body.dictamen != "") {
      this.isDisabledFundamentosCalif = false;
    } else {
      this.isDisabledFundamentosCalif = true;
      this.body.fundamentoCalif = "";

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


  getComboProcedimiento() {
    //   this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
    //     n => {
    //       this.comboProcedimeinto = n.combooItems;
    //       this.commonServices.arregloTildesCombo(this.comboProcedimeinto);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   );
  }
  getComboDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboDictamen = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDictamen);
        this.comboDictamen.push({ label: "Indiferente", value: -1 });
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

  // getComboCalidad() {
  //   this.comboCalidad;
  // }
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
    this.sigaServices.get("filtrosejg_comboFundamentoCalif").subscribe(
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
  getComboResolucion() {
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
  getComboFundamentosResoluc() {

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
  getComboPonente() {
    this.comboPonente;
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
            console.log(err);
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
        console.log(err);
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
        console.log(err);
      }
    );
  }
  // getComboCreadoDesde() {
  //   if (this.nuevo) {


  //   } else {
  //     this.sigaServices.get("filtrosejg_comboCreadoDesde").subscribe(
  //       n => {
  //         this.comboCreadoDesde = n.combooItems;
  //         this.commonServices.arregloTildesCombo(this.comboCreadoDesde);
  //       },
  //       err => {
  //         console.log(err);
  //       }
  //     );
  //   }

  // }
  getComboEstadoEJG() {
    this.sigaServices.get("filtrosejg_comboEstadoEJG").subscribe(
      n => {
        this.comboEstadoEJG = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboEstadoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboTurno() {
    if (this.body.turno != undefined)
      this.getComboGuardia();
  }
  getComboGuardia() {
    this.sigaServices.getParam(
      "combo_guardiaPorTurno",
      "?idTurno=" + this.body.turno
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
  // getComboTipoLetrado() {
  //   this.comboTipoLetrado;
  // }
  getComboJuzgado() {
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

  fillFechaDesde(event) {
    this.body.fechaDictamenDesd = event;
  }
  fillFechaHasta(event) {
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
  getFechaHastaCalendar(fechaInput) {
    let fechaReturn: Date;
    if (
      fechaInput != undefined &&
      fechaInput != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInput).getTime();
      let fechaHasta = new Date(fechaInput).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaReturn = undefined;
      else fechaReturn = new Date(fechaInput);
    }

    return fechaReturn;
  }

  getFechaDesdeCalendar(fechaInput) {
    let fechaReturn: Date;

    if (
      fechaInput != undefined &&
      fechaInput != null
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInput).getTime();
      let fechaHasta = new Date(fechaInput).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaReturn = undefined;
      else fechaReturn = new Date(fechaInput);
      // this.body.fechaDesde.setDate(this.body.fechaDesde.getDate() + 1);
      // this.body.fechaDesde = new Date(this.body.fechaDesde.toString());
    }

    return fechaReturn;
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
    if (this.body.numColegiado != undefined)
      this.body.numColegiado = this.body.numColegiado.trim();
    // if (
    //   (this.filtros.nombre == null || this.filtros.nombre == "" || this.filtros.nombre.length < 3) &&
    //   (this.filtros.apellido1 == null || this.filtros.apellido1 == "" || this.filtros.apellido1.length < 3) &&
    //   (this.filtros.codigoExt == null || this.filtros.codigoExt == "" || this.filtros.codigoExt.length < 3)) {
    //   this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    //   return false;
    // } else {
    return true;
    // }
  }
  //Busca ejg según los filtros
  isBuscar() {

    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.body);
      this.persistenceService.setFiltrosAux(this.body);
      this.bodyAux = this.persistenceService.getFiltrosAux()
      this.busqueda.emit(false)
    }
  }

  isNuevo() {

  }
}
