import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-filtros-saltos-compensaciones-oficio',
  templateUrl: './filtros-saltos-compensaciones-oficio.component.html',
  styleUrls: ['./filtros-saltos-compensaciones-oficio.component.scss']
})
export class FiltrosSaltosCompensacionesOficioComponent implements OnInit {

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
  comboGuardias = [];
  comboTurnos = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} turnos seleccionados";

  @Input() isNewFromOtherPage: boolean = false;

  @Output() isBuscar = new EventEmitter<boolean>();

  constructor(
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private datepipe: DatePipe,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.getComboTurno();

    if (sessionStorage.getItem("filtrosSaltosCompOficio") && !this.isNewFromOtherPage) {

      this.filtros = JSON.parse(sessionStorage.getItem("filtrosSaltosCompOficio"));

      if (sessionStorage.getItem("historicoSaltosCompOficio")) {
        this.historico = "true" == sessionStorage.getItem("historicoSaltosCompOficio");
      }
      this.isBuscar.emit(this.historico)

    }

    if (sessionStorage.getItem("esColegiado") && sessionStorage.getItem("esColegiado") == 'true') {
      /*this.disabledBusquedaExpress = true;
      this.getDataLoggedUser();*/
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

  onChangeTurno() {
    this.filtros.idGuardia = "";
    this.comboGuardias = [];

    if (this.filtros.idTurno) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_comboGuardia_Nogrupo", "?idTurno=" + this.filtros.idTurno).subscribe(
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

  formatDate(date) {

    const pattern = 'dd/MM/yyyy';

    if (typeof date === 'string') {
      return date;
    }

    return this.datepipe.transform(date, pattern);

  }

  search() {
    this.filtros.colegiadoGrupo = this.usuarioBusquedaExpress.numColegiado;

    if (this.filtros.fechaDesde != undefined && this.filtros.fechaDesde != null && this.filtros.fechaDesde != '') {
      this.filtros.fechaDesde = this.formatDate(this.filtros.fechaDesde);
    }

    if (this.filtros.fechaHasta != undefined && this.filtros.fechaHasta != null && this.filtros.fechaHasta != '') {
      this.filtros.fechaHasta = this.formatDate(this.filtros.fechaHasta);
    }

    sessionStorage.setItem("filtrosSaltosCompOficio", JSON.stringify(this.filtros));
    sessionStorage.setItem("filtrosAuxSaltosCompOficio", JSON.stringify(this.filtros));
    this.filtroAux = JSON.parse(sessionStorage.getItem("filtrosAuxSaltosCompOficio"));
    this.isBuscar.emit(false);
  }

  fillFechaDesde(event) {
    this.filtros.fechaDesde = event;
  }
  fillFechaHasta(event) {
    this.filtros.fechaHasta = event;
  }

  maxDate() {
    if (this.filtros.fechaHasta == null || this.filtros.fechaHasta == undefined) {
      return undefined;
    }
    return new Date(this.filtros.fechaHasta);
  }

  minDate() {
    if (this.filtros.fechaDesde == null || this.filtros.fechaDesde == undefined) {
      return undefined;
    }
    return new Date(this.filtros.fechaDesde);
  }

  clearFilters() {
    this.filtros = new SaltoCompItem();
    if (sessionStorage.getItem("filtrosSaltosCompOficio")) {
      sessionStorage.removeItem("filtrosSaltosCompOficio");
    }
    if (sessionStorage.getItem("filtrosAuxSaltosCompOficio")) {
      sessionStorage.removeItem("filtrosAuxSaltosCompOficio");
    }
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
