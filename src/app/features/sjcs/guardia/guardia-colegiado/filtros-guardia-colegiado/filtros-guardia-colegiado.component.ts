import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate';
import { GuardiaColegiadoItem } from '../../../../../models/guardia/GuardiaColegiadoItem';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { MultiSelect } from 'primeng/primeng';

@Component({
  selector: 'app-filtros-guardia-colegiado',
  templateUrl: './filtros-guardia-colegiado.component.html',
  styleUrls: ['./filtros-guardia-colegiado.component.scss']
})
export class FiltrosGuardiaColegiadoComponent implements OnInit {
  msgs;
  progressSpinner: boolean = false;
  showDatosGenerales: boolean = false;
  filtros = new GuardiaItem();
  filtroAux = new GuardiaItem();
  comboTurno;
  comboGuardia;
  isDisabledGuardia;
  comboValidar = [
    { label: 'SI', value: 1 },
    { label: 'NO', value: 0 }
  ];
  disabledBusquedaExpress: boolean = false;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  KEY_CODE = {
    ENTER: 13
  }
  permisos;
  @Input() permisoEscritura;
  @Input() isColegiado;
  @Input() colegiadoInfo;

  @Output() isOpen = new EventEmitter<boolean>();
  isColeg: boolean;
  colegInfo;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) { }

  ngOnInit() {
    
    this.getCombos()
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
   
    this.isColeg = JSON.parse(this.isColegiado);
    this.colegInfo = JSON.parse(this.colegiadoInfo);
    
      if(this.isColeg){
        this.usuarioBusquedaExpress.numColegiado = this.colegInfo.numColegiado
        this.usuarioBusquedaExpress.nombreAp = this.colegInfo.nombre
        this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
      }
    
    this.showDatosGenerales = true;
    if (sessionStorage.getItem("buscadorColegiados")) {
      let busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem("buscadorColegiados");

      this.usuarioBusquedaExpress.nombreAp = busquedaColegiado.nombre + " " + busquedaColegiado.apellidos;
      this.usuarioBusquedaExpress.numColegiado = busquedaColegiado.nColegiado;
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
    }
  }

  getCombos(){
    this.getComboTurno();
    if(this.filtros.idTurno != null || this.filtros.idTurno != undefined){
      this.getComboGuardia();
    }
    
  }

  search() {
    
      this.isOpen.emit(false);

  }

  getComboTurno() {
    this.sigaServices.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          console.log(err);
        }
      )

  }

  onChangeTurnos() {
    this.filtros.idGuardia = "";
    this.comboGuardia = [];

    if (this.filtros.idTurno) {
      this.getComboGuardia();
    }
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
  }

  clear() {
    this.msgs = [];
  }

  rest() {
    if(this.isColeg){
      this.filtros = new GuardiaItem();
      this.filtros.numColegiado = this.usuarioBusquedaExpress.numColegiado;
    }else{
      this.usuarioBusquedaExpress.nombreAp = '';
      this.usuarioBusquedaExpress.numColegiado = '';
      this.filtros = new GuardiaItem();
    }
    
  }

  fillFechaDesde(event) {
    this.filtros.fechadesde = event;
  }

  fillFechaHasta(event) {
    this.filtros.fechahasta = event;
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }
  showMessageError(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
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

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === this.KEY_CODE.ENTER) {
      this.search();
    }
  }

  focusInputField(multiSelect: MultiSelect) {
    setTimeout(() => {
      multiSelect.filterInputChild.nativeElement.focus();
    }, 300);
  }


}
