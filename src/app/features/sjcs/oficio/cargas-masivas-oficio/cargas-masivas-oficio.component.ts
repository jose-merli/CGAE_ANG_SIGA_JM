import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
<<<<<<< HEAD
import { SelectItem } from 'primeng/api';
import {FormularioBusquedaComponent} from './formulario-busqueda/formulario-busqueda.component';
import { FormularioSubidaComponent } from './formulario-subida/formulario-subida.component';
=======
import { Message, SelectItem } from 'primeng/api';
>>>>>>> 5b87a209d5c075cac1f4ebf635bb8d5e25baed36

@Component({
  selector: 'app-cargas-masivas-oficio',
  templateUrl: './cargas-masivas-oficio.component.html',
  styleUrls: ['./cargas-masivas-oficio.component.scss']
})
export class CargasMasivasOficioComponent implements OnInit {
<<<<<<< HEAD
  msgs: any[];

  tipo:string = null;
  datos:any[];
=======
  msgs: Message[] = [];
  progressSpinner: boolean = false;
>>>>>>> 5b87a209d5c075cac1f4ebf635bb8d5e25baed36
  
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
