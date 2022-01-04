import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { CargaMasivaItem } from '../../../../models/CargaMasivaItem';
import { FiltrosBusquedaCargasMasivasComprasItem } from '../../../../models/FiltrosBusquedaCargasMasivasComprasItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-busqueda-cmc',
  templateUrl: './tarjeta-busqueda-cmc.component.html',
  styleUrls: ['./tarjeta-busqueda-cmc.component.scss']
})
export class TarjetaBusquedaCmcComponent implements OnInit {

  
  msgs: any[];
  filtrosBusquedaCargaMasivasCompras: FiltrosBusquedaCargasMasivasComprasItem = new FiltrosBusquedaCargasMasivasComprasItem(); //Guarda los valores seleccionados/escritos en los campos
  @Output() filtrosValues = new EventEmitter<CargaMasivaItem>();
  showTipo: boolean = false;
  @Input("permisoEscritura") permisoEscrituta;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {

    //En la documentación funcional se pide que por defecto aparezca el campo 
    //con la fecha de dos años antes
    let today = new Date();
    this.filtrosBusquedaCargaMasivasCompras.fechaCargaDesde = new Date(new Date().setFullYear(today.getFullYear() - 2));
  }

  
  fillFechaCargaDesde(event) {
    this.filtrosBusquedaCargaMasivasCompras.fechaCargaDesde = event;
  }

  fillFechaCargaHasta(event) {
    this.filtrosBusquedaCargaMasivasCompras.fechaCargaHasta = event;
  }

  limpiar() {
    this.filtrosBusquedaCargaMasivasCompras = new FiltrosBusquedaCargasMasivasComprasItem();

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

  search() {
    this.filtrosValues.emit();
  }

  abreCierraTipo(){
    this.showTipo=!this.showTipo;
  }
  
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

	clear() {
		this.msgs = [];
  }


}
