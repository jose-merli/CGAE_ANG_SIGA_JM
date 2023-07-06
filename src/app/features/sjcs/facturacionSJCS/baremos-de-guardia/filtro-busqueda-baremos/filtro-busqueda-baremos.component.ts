import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Message, MultiSelect, SelectItem } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { Router } from '@angular/router';
import { BaremosGuardiaItem } from '../../../../../models/sjcs/BaremosGuardiaItem';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-filtro-busqueda-baremos',
  templateUrl: './filtro-busqueda-baremos.component.html',
  styleUrls: ['./filtro-busqueda-baremos.component.scss']
})
export class FiltroBusquedaBaremosComponent implements OnInit {

  showDatosGenerales: boolean = true;
  msgs: Message[] = [];
  progressSpinner: boolean = false;
  filtros: BaremosGuardiaItem = new BaremosGuardiaItem();
  comboFacturacion: SelectItem[] = [];
  comboTurno: SelectItem[] = [];
  comboGuardia: SelectItem[] = [];

  @Input() permisoEscritura: boolean = false;

  @Output() mostrarTablaResultadosEvent = new EventEmitter<boolean>();

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("tarjetaBaremosFichaGuardia")) {
      let datos = JSON.parse(sessionStorage.getItem("tarjetaBaremosFichaGuardia"));
      sessionStorage.removeItem("tarjetaBaremosFichaGuardia");
      this.filtros.idTurnos = [datos.idTurno];
      this.filtros.idGuardias = [datos.idGuardia];
      this.getComboTurno();
      this.getComboGuardia([datos.idTurno]);
      this.getComboFacturacion();
      this.filtros.idFacturaciones = ['0'];
      this.buscar();
    } else if(sessionStorage.getItem("tarjetaBaremosFacturacion")){
      let idFacturacion:String = sessionStorage.getItem("tarjetaBaremosFacturacion")
      sessionStorage.removeItem("tarjetaBaremosFacturacion");
      this.getComboTurno();
      this.getComboFacturacion();
      this.filtros.idFacturaciones = [idFacturacion];
      this.buscar();
    } else if (this.persistenceService.getFiltros() != undefined) {
      this.filtros = this.persistenceService.getFiltros(); 
      this.persistenceService.clearFiltros();
      if(this.filtros.idFacturaciones == undefined || this.filtros.idFacturaciones == null){
        this.filtros.idFacturaciones = ['0'];
      }
      this.getComboTurno();
      this.getComboFacturacion();
      this.buscar();

    } else{
      this.getComboTurno();
      this.getComboFacturacion();
      this.filtros.idFacturaciones = ['0'];
      this.buscar();
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  focusInputField(someMultiselect: MultiSelect) {
    setTimeout(() => {
      someMultiselect.filterInputChild.nativeElement.focus();
    }, 300);
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

  getComboFacturacion() {

    this.progressSpinner = true;

    this.sigaServices.get("combo_comboFacBaremos").subscribe(
      data => {
        this.comboFacturacion = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboFacturacion);
        this.comboFacturacion.unshift({ label: 'Actual', value: '0' });
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  getComboTurno() {

    this.progressSpinner = true;

    this.sigaServices.get("combo_turnos").subscribe(
      data => {
        this.comboTurno = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTurno);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  onChangeTurno(event) {

    this.comboGuardia = [];

    if (event.value && event.value.toString().length > 0) {
      this.getComboGuardia(event.value);
    }

  }

  getComboGuardia(idTurnos: string[]) {

    this.progressSpinner = true;

    const idTurnosStr = idTurnos.toString();

    this.sigaServices.getParam("combo_guardiaPorTurno", `?idTurno=${idTurnosStr}`).subscribe(
      data => {
        this.comboGuardia = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboGuardia);
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );

  }

  disabledComboGuardia(): boolean {

    if (this.filtros && this.filtros.idTurnos && this.filtros.idTurnos != null && this.filtros.idTurnos.length == 0) {
      return true;
    }
    return false;
  }

  hayCamposRellenos(): boolean {

   /*  if (this.filtros && (
      (this.filtros.idFacturaciones && this.filtros.idFacturaciones.length > 0) ||
      (this.filtros.idTurnos && this.filtros.idTurnos.length > 0) ||
      (this.filtros.idGuardias && this.filtros.idGuardias.length > 0)
    )) {
      return true;
    }

    return false; */
    if (this.filtros && (
      (this.filtros.idFacturaciones && this.filtros.idFacturaciones.length > 0)
    )) {
      return true;
    }

    return false;
  }

  limpiar() {
    this.filtros = new BaremosGuardiaItem();
    this.mostrarTablaResultadosEvent.emit(false);
  }

  nuevo() {
    sessionStorage.setItem('modoEdicionBaremo', "false");
    this.router.navigate(['/fichaBaremosDeGuardia']);
  }

  buscar() {

    if (this.hayCamposRellenos()) {
      this.persistenceService.setFiltros(this.filtros);
      this.filtros.historico = false;
      this.mostrarTablaResultadosEvent.emit(true);
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("cen.busqueda.error.busquedageneral"));
    }

  }

}