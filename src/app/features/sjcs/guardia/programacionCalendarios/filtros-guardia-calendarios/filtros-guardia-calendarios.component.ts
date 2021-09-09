import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { CalendarioProgramadoItem } from '../../../../../models/guardia/CalendarioProgramadoItem';
import { GuardiaItem } from '../../../../../models/guardia/GuardiaItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { AcreditacionesItem } from '../../../../../models/sjcs/AcreditacionesItem';
import { ConfiguracionCola, GlobalGuardiasService } from '../../guardiasGlobal.service';

@Component({
  selector: 'app-filtros-guardia-calendarios',
  templateUrl: './filtros-guardia-calendarios.component.html',
  styleUrls: ['./filtros-guardia-calendarios.component.scss']
})
export class FiltrosGuardiaCalendarioComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs = [];

  filtros = new CalendarioProgramadoItem();
  filtroAux = new CalendarioProgramadoItem();
  historico: boolean = false;

  isDisabledZona: boolean = true;
  isDisabledMateria: boolean = true;
  resultadosZonas: any;
  resultadosAreas: any;
  @Input() permisoEscritura;
  @Output() isOpen = new EventEmitter<boolean>();
  @Output() filtrosValues = new EventEmitter<CalendarioProgramadoItem>();

  comboTurno = [];
  comboGuardia = [];
  comboConjuntoGuardias = [];
  comboListaGuardias = [];
  comboEstado = [];
  
  KEY_CODE = {
    ENTER: 13
  }

  textFilter: string = "Seleccionar";
  textSelected: String = "{0} etiquetas seleccionadas";

  constructor(private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService,
    private globalGuardiasService: GlobalGuardiasService) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }


    this.getComboTurno()
    this.getComboEstado();
    this.getComboConjuntouardia();

    if (sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia") != null) {

      this.filtros = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaGuardiasFichaGuardia")
      );
      if (this.filtros){
        console.log('this.filtros.idGuardia: ', this.filtros.idGuardia)
        console.log('this.filtros.idTurno: ', this.filtros.idTurno)
        this.getComboGuardia();
        this.search();
        sessionStorage.removeItem("filtrosBusquedaGuardiasFichaGuardia");
      }
  

     

      if (this.persistenceService.getHistorico() != undefined) {
        this.historico = this.persistenceService.getHistorico();
      }
      this.isOpen.emit(this.historico)

    } else {
      this.filtros = new CalendarioProgramadoItem();
    }

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

  getComboEstado() {
    this.sigaServices.get("busquedaGuardia_estado").subscribe(
      n => {
        this.comboEstado = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.filtros.idGuardia = "";
    this.comboGuardia = [];

    if (this.filtros.idTurno) {
      this.getComboGuardia();
      //this.getComboListaGuardia();
    } 
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

  getComboConjuntouardia() {
    this.sigaServices.get(
      "busquedaGuardia_conjuntoGuardia").subscribe(
        data => {
          this.comboConjuntoGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboConjuntoGuardias);
        },
        err => {
          console.log(err);
        }
      )

  }
  
  //SE USA?
  getComboListaGuardia() {
    this.sigaServices.getParam(
      "busquedaGuardia_listasGuardia", "?idTurno=" + this.filtros.idTurno).subscribe(
        data => {
          this.comboListaGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboListaGuardias);
        },
        err => {
          console.log(err);
        }
      )

  }
  fillFechaCalendarioDesde(event) {
    this.filtros.fechaCalendarioDesde = event;
  }
  fillFechaCalendarioHasta(event) {
    this.filtros.fechaCalendarioHasta = event;
  }

  getFechaCalendarioHasta(fechaInputDesde, fechainputHasta) {
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
    return fechainputHasta;
  }
  getFechaCalendarioDesde(fechaInputesde, fechaInputHasta) {
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
    return fechaInputesde;
  }


  fillFechaProgramadaDesde(event) {
    this.filtros.fechaProgramadaDesde = event;
  }
  fillFechaProgramadaHasta(event) {
    this.filtros.fechaProgramadaHasta = event;
  }

  getFechaProgramadaHasta(fechaInputDesde, fechainputHasta) {
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
    return fechainputHasta;
  }
  getFechaProgramadaDesde(fechaInputesde, fechaInputHasta) {
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
    return fechaInputesde;
  }


  search() {
console.log('search')
    if (this.checkFilters()) {
      this.persistenceService.setFiltros(this.filtros);
      this.persistenceService.setFiltrosAux(this.filtros);
      this.filtroAux = this.persistenceService.getFiltrosAux();
      sessionStorage.setItem('filtrosBusquedaGuardias', JSON.stringify(this.filtros));
      this.isOpen.emit(false)
      this.filtrosValues.emit(Object.assign({},this.filtros));
      console.log('search ok', this.filtrosValues)
    }

  }

  nuevo() {
    let configuracionCola: ConfiguracionCola = {
      'manual': false,
      'porGrupos': false,
      'idConjuntoGuardia': null,
      "fromCombo": false
    };
     this.globalGuardiasService.emitConf(configuracionCola);
    let dataToSend = {
      'duplicar' : '',
      'tabla': [],
      'turno':'',
      'nombre': '',
      'generado': '',
      'numGuardias': '',
      'listaGuarias': {},
      'fechaDesde': '',
      'fechaHasta': '',
      'fechaProgramacion': null,
      'estado': '',
      'observaciones': '',
      'idCalendarioProgramado': null,
      'idTurno': '',
      'idGuardia': '',
    };
    this.persistenceService.setDatos(dataToSend);

    this.router.navigate(["/fichaProgramacion"]);
    /*if (this.permisoEscritura) {
      this.persistenceService.clearDatos();
      this.router.navigate(["/gestionGuardias"]);
    }*/
  }

  checkFilters() {

    if ((this.filtros.estado == null || this.filtros.estado == undefined) &&
      (this.filtros.fechaCalendarioDesde == null || this.filtros.fechaCalendarioDesde == undefined) &&
      (this.filtros.fechaCalendarioHasta == null || this.filtros.fechaCalendarioHasta == undefined) &&
      (this.filtros.fechaProgramadaDesde == null || this.filtros.fechaProgramadaDesde == undefined) &&
      (this.filtros.fechaProgramadaHasta == null || this.filtros.fechaProgramadaHasta == undefined) &&
      (this.filtros.listaGuardias == null || this.filtros.listaGuardias == undefined) &&
      (this.filtros.idTurno == null || this.filtros.idTurno == undefined) &&
      (this.filtros.idGuardia == null || this.filtros.idGuardia == undefined)) {

      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.filtros.guardia != undefined && this.filtros.guardia != null) {
        this.filtros.guardia = this.filtros.guardia.trim();
      }

      return true;
    }
  }

  clearFilters() {
    this.filtros = new CalendarioProgramadoItem();
    this.persistenceService.clearFiltros();
    this.isDisabledZona = true;
  }


  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  rest() {
    this.filtros = new CalendarioProgramadoItem();
    this.isDisabledMateria = true;
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
