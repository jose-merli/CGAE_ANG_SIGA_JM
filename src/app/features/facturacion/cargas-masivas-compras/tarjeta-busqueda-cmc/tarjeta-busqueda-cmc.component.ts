import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { CargaMasivaItem } from '../../../../models/CargaMasivaItem';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-busqueda-cmc',
  templateUrl: './tarjeta-busqueda-cmc.component.html',
  styleUrls: ['./tarjeta-busqueda-cmc.component.scss']
})
export class TarjetaBusquedaCmcComponent implements OnInit {

  
  msgs: any[];
  fechaCargaDesde: Date;
  fechaCargaHasta: Date;
  @Output() filtrosValues = new EventEmitter<CargaMasivaItem>();
  showTipo: boolean = false;
  @Input("permisoEscritura") permisoEscrituta;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
    
    this.fechaCargaDesde = new Date(); 

    //En la documentación funcional se pide que por defecto aparezca el campo 
    //con la fecha de dos años antes
    this.fechaCargaDesde.setDate(this.fechaCargaDesde.getDate() - (365*2));
  }

  
  fillFechaCargaDesde(event) {
    this.fechaCargaDesde = event;
  }

  fillFechaCargaHasta(event) {
    this.fechaCargaHasta = event;
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
