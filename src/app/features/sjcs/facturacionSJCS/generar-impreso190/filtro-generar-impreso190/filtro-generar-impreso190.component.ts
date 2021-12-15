import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { KEY_CODE } from '../../../../../commons/login-develop/login-develop.component';
import { ComboItem } from '../../../../../models/ComboItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { OficioRoutingModule } from '../../../oficio/oficio-routing.module';

@Component({
  selector: 'app-filtro-generar-impreso190',
  templateUrl: './filtro-generar-impreso190.component.html',
  styleUrls: ['./filtro-generar-impreso190.component.scss']
})
export class FiltroGenerarImpreso190Component implements OnInit {

  showDatosGenerales: boolean = true;
  anio = [];
  comboAnio: ComboItem;
  msgs = [];
  @Output() getImpresos = new EventEmitter<boolean>();
  @Input() permisoEscritura;
  constructor(private sigaService: SigaServices) { }

  ngOnInit() {
    this.getComboAnio();
  }

  getComboAnio(){
		this.sigaService.get("impreso190_comboAnio").subscribe(
			data => {
				this.comboAnio = data.combooItems;
			},
			err => {
				console.log(err);
			}
		);
  }

  restablecer(){
    this.anio = undefined;
  }

  buscarImpresos(){
   
      this.getImpresos.emit(true);
 
  }

  onHideshowDatosGenerales(){
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  clear() {
		this.msgs = [];
	}

  //búsqueda con enter
	@HostListener("document:keypress", ["$event"])
	onKeyPress(event: KeyboardEvent) {
		if (event.keyCode === KEY_CODE.ENTER) {
			this.buscarImpresos();
		}
	}
}
