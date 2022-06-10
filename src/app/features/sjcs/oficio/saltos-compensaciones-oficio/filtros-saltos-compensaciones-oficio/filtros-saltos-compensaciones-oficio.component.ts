import { DatePipe } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { SaltoCompItem } from '../../../../../models/guardia/SaltoCompItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
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
  showColegiado: boolean = true;
  progressSpinner: boolean = false;
  filtros: SaltoCompItem = new SaltoCompItem();
  filtroAux: SaltoCompItem = new SaltoCompItem();
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  comboTurnos = [];
  textFilter: string = "Seleccionar";
  textSelected: String = "{0} turnos seleccionados";
  isLetrado:boolean = false;

  @Input() isNewFromOtherPage: boolean = false;
  @Input() activacionEditar: boolean = false;

  @Output() isBuscar = new EventEmitter<boolean>();

  constructor(
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private datepipe: DatePipe,
    private localStorageService: SigaStorageService
  ) { }

  ngOnInit() {
    sessionStorage.removeItem("volver");
    sessionStorage.removeItem("modoBusqueda");
    this.isLetrado = this.localStorageService.isLetrado;
    if (this.isLetrado) {
      this.disabledBusquedaExpress = true;
      this.getDataLoggedUser();
    }

    this.getComboTurno();

    if (sessionStorage.getItem("filtrosSaltosCompOficio") && sessionStorage.getItem("volver") == 'true') {

      this.filtros = JSON.parse(sessionStorage.getItem("filtrosSaltosCompOficio"));
      this.usuarioBusquedaExpress.numColegiado = sessionStorage.getItem("numColegiado");

      if (sessionStorage.getItem("historicoSaltosCompOficio")) {
        this.historico = "true" == sessionStorage.getItem("historicoSaltosCompOficio");
      }
      this.isBuscar.emit(this.historico)
      sessionStorage.removeItem("volver");
      sessionStorage.removeItem("numColegiado");
    }

    if (sessionStorage.getItem('buscadorColegiados')) {

      const { nombre, apellidos, nColegiado } = JSON.parse(sessionStorage.getItem('buscadorColegiados'));

      this.usuarioBusquedaExpress.nombreAp = `${apellidos}, ${nombre}`;
      this.usuarioBusquedaExpress.numColegiado = nColegiado;
      this.showColegiado = true;

      sessionStorage.removeItem('buscadorColegiados');

      this.search();
    }

  }

  getComboTurno() {

    this.sigaServices.get("inscripciones_comboTurnos").subscribe(
      n => {
        this.comboTurnos = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      },
      err => {
        //console.log(err);
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
    sessionStorage.setItem("numColegiado", this.usuarioBusquedaExpress.numColegiado);

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
