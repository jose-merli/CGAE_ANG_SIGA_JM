import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { TranslateService } from '../../../../commons/translate';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { CommonsService } from '../../../../_services/commons.service';

@Component({
  selector: 'app-filtros-ejg',
  templateUrl: './filtros-ejg.component.html',
  styleUrls: ['./filtros-ejg.component.scss']
})
export class FiltrosEjgComponent implements OnInit {

  historico: boolean = false;
  msgs: any[] = [];
  editar: boolean = true;
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";
  body: EJGItem = new EJGItem();
  bodyAux: EJGItem = new EJGItem();

  showdatosIdentificacion: boolean = true;
  showDatosGeneralesEJG: boolean = true;
  showDatosDefensa: boolean = true;
  showCAJG: boolean = true;
  showSolicitante: boolean = true;
  showTramitador: boolean = true;
  //inicializar los combos
  comboProcedimeinto = [];
  comboCalidad = [];
  comboPerceptivo = [];
  comboRenuncia = [];
  comboDictamen = [];
  comboFundamentoCalif = [];
  comboResolucion = [];
  comboFundamentoJurid = [];
  comboImpugnacion = [];
  comboFundamentoImput = [];
  comboPonente = [];
  comboColegio = [];
  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboCreadoDesde = [];
  comboEstadoEJG = [];
  comboTurno = [];
  comboGuardia = [];
  comboTipoLetrado = [];
  comboRol = [];
  comboJuzgado = [];
  @Input() permisos;
  /*Éste método es útil cuando queremos queremos informar de cambios en los datos desde el hijo,
    por ejemplo, si tenemos un botón en el componente hijo y queremos actualizar los datos del padre.*/
  @Output() busqueda = new EventEmitter<boolean>();

  constructor(private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
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
  }
  getCombos() {
    this.getComboProcedimiento();
    this.getComboCalidad();
    this.getComboDictamen();
    this.getComboPerceptivo();
    this.getComboRenuncia();
    this.getComboFundamentoCalif();
    this.getComboResolucion();
    this.getComboRenuncia();
    this.getComboImpugnacion();
    this.getComboFundamentoImput();
    this.getComboPonente();
    this.getComboColegio();
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    this.getComboCreadoDesde();
    this.getComboEstadoEJG();
    this.getComboTurno();
    this.getComboGuardia();
    this.getComboTipoLetrado();
    this.getComboRol();
    this.getComboJuzgado();
  }

  getComboProcedimiento() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboProcedimeinto = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboProcedimeinto);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboDictamen() {
    this.sigaServices.get("busquedaFundamentosCalificacion_comboDictamen").subscribe(
      n => {
        this.comboDictamen = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboDictamen);
      },
      err => {
        console.log(err);
      }
    );
  }
  getComboRol() {
    this.comboRol;
  }

  getComboCalidad() {
    this.comboCalidad;
  }
  getComboPerceptivo() {
    this.comboPerceptivo;
  }
  getComboRenuncia() {
    this.comboRenuncia;
  }
  getComboFundamentoCalif() {
    this.comboFundamentoCalif;
  }
  getComboResolucion() {
    this.comboResolucion;
  }
  getComboFundamentoJurid() {
    this.comboFundamentoJurid;
  }
  getComboImpugnacion() {
    this.comboImpugnacion;
  }
  getComboFundamentoImput() {
    this.comboFundamentoImput;
  }
  getComboPonente() {
    this.comboPonente;
  }
  getComboColegio() {
    this.comboColegio;
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
    this.comboTipoEJGColegio;
  }
  getComboCreadoDesde() {
    this.comboCreadoDesde;
  }
  getComboEstadoEJG() {
    this.comboEstadoEJG;
  }
  getComboTurno() {
    this.comboTurno;
  }
  getComboGuardia() {
    this.comboGuardia;
  }
  getComboTipoLetrado() {
    this.comboTipoLetrado;
  }
  getComboJuzgado() {
    this.comboJuzgado;
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
    // quita espacios vacios antes de buscar, METERSELO A TODOS LOS CAMPOS
    if (this.body.nombre != undefined && this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }
    return true;
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
