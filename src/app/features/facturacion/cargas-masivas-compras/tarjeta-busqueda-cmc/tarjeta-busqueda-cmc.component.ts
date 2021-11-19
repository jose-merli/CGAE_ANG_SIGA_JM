import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  filtro: CargaMasivaItem = new CargaMasivaItem();
  @Output() filtrosValues = new EventEmitter<CargaMasivaItem>();
  showTipo: boolean = false;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
  }

  
  fillFechaCarga(event) {
    this.filtro.fechaCarga = event;
  }

  search() {
    this.filtrosValues.emit(this.filtro);
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
