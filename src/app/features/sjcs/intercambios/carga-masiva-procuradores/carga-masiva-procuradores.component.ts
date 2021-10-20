import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { TarjetaFicheroModeloComponent } from './tarjeta-fichero-modelo/tarjeta-fichero-modelo.component';

@Component({
  selector: 'app-carga-masiva-procuradores',
  templateUrl: './carga-masiva-procuradores.component.html',
  styleUrls: ['./carga-masiva-procuradores.component.scss']
})
export class CargaMasivaProcuradoresComponent implements OnInit {

  msgs;

  tipo:string = null;
  datos:any[];

  progressSpinner: boolean = false;
  
  showCargasMasivas = false;
  buscar: boolean = false;

  @ViewChild(TarjetaFicheroModeloComponent) ficheroModelo;

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
