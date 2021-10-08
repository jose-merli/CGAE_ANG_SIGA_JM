import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { SelectItem } from 'primeng/api';
import { Message } from 'primeng/components/common/api';
import { FormularioBusquedaGuardiaComponent } from './formulario-busqueda-guardia/formulario-busqueda-guardia.component';

@Component({
  selector: 'app-cargas-masivas-guardia',
  templateUrl: './cargas-masivas-guardia.component.html',
  styleUrls: ['./cargas-masivas-guardia.component.scss']
})
export class CargasMasivasGuardiaComponent implements OnInit {

  msgs: Message[];

  tipo:string = null;
  datos:any[];

  progressSpinner: boolean = false;
  
  showCargasMasivas = false;
  buscar: boolean = false;

  @ViewChild(FormularioBusquedaGuardiaComponent) formularioBusqueda;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
  }

  onChange(event) {
  }
  
  receiveTipo($event) {
    this.tipo = $event;
  }

  receiveDatos($event) {
    this.datos = $event;
  }

  receiveBuscar($event) {
    this.buscar = $event;
  }

	clear() {
		this.msgs = [];
	}
}
