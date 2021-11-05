import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { SaltoCompItem } from '../../../../../../models/guardia/SaltoCompItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { KEY_CODE } from '../../../../maestros/fundamentos-calificacion/fundamentos-calificacion.component';

@Component({
  selector: 'app-filtros-saltos-compensaciones-guardia',
  templateUrl: './filtros-saltos-compensaciones-guardia.component.html',
  styleUrls: ['./filtros-saltos-compensaciones-guardia.component.scss']
})
export class FiltrosSaltosCompensacionesGuardiaComponent implements OnInit {

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: '',
  };
  disabledBusquedaExpress: boolean = false;
  showDatosGenerales: boolean = true;
  showColegiado: boolean = false;
  progressSpinner: boolean = false;

  filtros: SaltoCompItem = new SaltoCompItem();
  filtroAux: SaltoCompItem = new SaltoCompItem();
  historico: boolean = false;

  isDisabledGuardia: boolean = true;

  @Input() permisoEscritura;

  comboGuardias = [];
  comboTurnos = [];

  @Output() isBuscar = new EventEmitter<boolean>();
  @Input()  dataFilterFromColaGuardia = { 'turno': 0,
                                          'guardia': 0,
                                          'colegiado': 0,
                                          'grupo': 0};
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";

  constructor(private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private datepipe : DatePipe) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    this.getComboTurno();
    if (this.persistenceService.getFiltros() != undefined && sessionStorage.getItem("volver")) {
      this.filtros = this.persistenceService.getFiltros();
      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      sessionStorage.removeItem("volver");
      this.isBuscar.emit(this.historico)


    if (this.dataFilterFromColaGuardia != null){
          if (this.dataFilterFromColaGuardia.turno != 0){
            this.filtros.idTurno = [this.dataFilterFromColaGuardia.turno.toString()] ;
          }
          if (this.dataFilterFromColaGuardia.guardia != 0){
            if (this.filtros.idTurno) {
              this.getComboGuardia();
            }
            this.isDisabledGuardia = false;
            this.filtros.idGuardia = [ this.dataFilterFromColaGuardia.guardia.toString()] ;
          }
          if (this.dataFilterFromColaGuardia.colegiado != 0){
            this.filtros.colegiadoGrupo = this.dataFilterFromColaGuardia.colegiado.toString() ;
          }
          if (this.dataFilterFromColaGuardia.grupo != 0){
            this.filtros.grupo = this.dataFilterFromColaGuardia.grupo ;
          }
          this.search();
        }
      }

    if (sessionStorage.getItem("esColegiado") && sessionStorage.getItem("esColegiado") == 'true') {
       this.disabledBusquedaExpress = true;
       this.getDataLoggedUser();
       this.search();
    }

    if (sessionStorage.getItem('buscadorColegiados')) {

      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;

    }
  }

  getComboTurno() {

    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno(event) {
    this.filtros.idGuardia = "";
    this.comboGuardias = [];

    if (this.filtros.idTurno.length != 0) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }
  onChangeGuardia(event){
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        },
        err => {
          console.log(err);
        }
      );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideColegiado() {
    this.showColegiado = !this.showColegiado;
  }

  search() {
    this.filtros.colegiadoGrupo = this.usuarioBusquedaExpress.numColegiado;
    this.persistenceService.setFiltros(this.filtros);
    this.persistenceService.setFiltrosAux(this.filtros);
    this.filtroAux = this.persistenceService.getFiltrosAux()
    this.isBuscar.emit(false);
  }

  fillFechaDesde(event) {
    if(event){
      this.filtros.fechaDesde = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
    }else{
      this.filtros.fechaDesde = ''
    }
  }
  fillFechaHasta(event) {
    if(event){
      this.filtros.fechaHasta = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
    }else{
      this.filtros.fechaHasta = ''
    }
  }

  getFechaHasta(fechaInputDesde, fechainputHasta) {
    if (
      fechaInputDesde != undefined &&
      fechainputHasta != undefined
    ) {
      let one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputDesde).getTime();
      let fechaHasta = new Date(fechainputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechainputHasta = undefined;
    }
    return moment(fechainputHasta,"dd/MM/yyyy").toDate();
  }
  getFechaDesde(fechaInputesde, fechaInputHasta) {
    if (
      fechaInputesde != undefined &&
      fechaInputHasta != undefined
    ) {
      // convertir fechas en milisegundos
      let fechaDesde = new Date(fechaInputesde).getTime();
      let fechaHasta = new Date(fechaInputHasta).getTime();
      let msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < 0) fechaInputesde = undefined;
    }
    return moment(fechaInputesde,"dd/MM/yyyy").toDate();
  }

  clearFilters() {
    this.filtros = new SaltoCompItem();
    this.usuarioBusquedaExpress.nombreAp = '';
    this.usuarioBusquedaExpress.numColegiado = '';
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.search();
    }
  }

  focusInputField(someDropdown) {
    setTimeout(() => {
      someDropdown.filterInputChild.nativeElement.focus();
    }, 300);
  }

  getDataLoggedUser() {

    this.progressSpinner = true;

    this.sigaServices.get("usuario_logeado").subscribe(n => {

      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;

      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(usr => {
        const { numColegiado, nombre } = JSON.parse(usr.body).colegiadoItem[0];
        this.usuarioBusquedaExpress.numColegiado = numColegiado;
        this.usuarioBusquedaExpress.nombreAp = nombre;
        this.showColegiado = true;
        this.progressSpinner = false;
      });

    });

  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
  }

}
