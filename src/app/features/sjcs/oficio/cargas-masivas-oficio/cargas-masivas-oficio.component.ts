import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { SelectItem } from 'primeng/api';
import {FormularioBusquedaComponent} from './formulario-busqueda/formulario-busqueda.component';
import { FormularioSubidaComponent } from './formulario-subida/formulario-subida.component';

@Component({
  selector: 'app-cargas-masivas-oficio',
  templateUrl: './cargas-masivas-oficio.component.html',
  styleUrls: ['./cargas-masivas-oficio.component.scss']
})
export class CargasMasivasOficioComponent implements OnInit {
  msgs: any[];

  tipo:string = null;
  datos:any[];
  
  showCargasMasivas = false;
  buscar: boolean = false;

  @ViewChild(FormularioBusquedaComponent) formularioBusqueda;

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
