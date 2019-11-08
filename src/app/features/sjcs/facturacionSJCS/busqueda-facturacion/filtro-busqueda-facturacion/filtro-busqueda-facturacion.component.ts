import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";
import { USER_VALIDATIONS } from "../../../../../properties/val-properties";
import { Calendar } from 'primeng/primeng';
import { SigaServices } from '../../../../../_services/siga.service';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../utils/calendar';

@Component({
	selector: 'app-filtro-busqueda-facturacion',
	templateUrl: './filtro-busqueda-facturacion.component.html',
  	styleUrls: ['./filtro-busqueda-facturacion.component.scss']
})
export class FiltroBusquedaFacturacionComponent extends SigaWrapper implements OnInit {
	selectedValue: string="facturacion";
  	showDatosGenerales: boolean = true;  
	value: Date;
	valueChangeSelected = new EventEmitter();
	valueChangeInput = new EventEmitter();
	valueFocus = new EventEmitter();
	es: any = esCalendar;
	fechaSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;
	first: boolean = true;
	minDate: Date;
	maxDate: Date;
	disabled: boolean;
	showTime: boolean;
	calendar: Calendar;

	constructor(private service: SigaServices) { 
		super(USER_VALIDATIONS);
	}

	ngOnInit() {
		this.getRangeYear();
	}

	ngAfterViewInit(): void {
		this.getLenguage();
	}

	getRangeYear() {
		let today = new Date();
		let year = today.getFullYear();
		this.yearRange = year - 80 + ':' + (year + 20);
	}

  	onHideDatosGenerales() {
    	this.showDatosGenerales = !this.showDatosGenerales;
  	}

  	borrarFecha() {
		this.value = null;
		this.valueChangeInput.emit(this.value);
		this.fechaSelectedFromCalendar = true;
		this.calendar.onClearButtonClick("");
	}

  	getLenguage() {
		this.service.get('usuario').subscribe((response) => {
			this.currentLang = response.usuarioItem[0].idLenguaje;

			switch (this.currentLang) {
				case '1':
					this.es = esCalendar;
					break;
				case '2':
					this.es = catCalendar;
					break;
				case '3':
					this.es = euCalendar;
					break;
				case '4':
					this.es = glCalendar;
					break;
				default:
					this.es = esCalendar;
					break;
			}
		});
  	}
  
	fechaHoy() {
		this.value = new Date();
		this.valueChangeSelected.emit(this.value);
		this.calendar.overlayVisible = false;
		this.fechaSelectedFromCalendar = true;
	}

  	change(newValue) {
		//evento que cambia el value de la fecha
		if (!this.showTime) {
			this.fechaSelectedFromCalendar = true;
			this.value = new Date(newValue);
			let year = this.value.getFullYear();
			if (year >= year - 80 && year <= year + 20) {
				if (this.minDate) {
					if (this.value >= this.minDate) {
						this.valueChangeSelected.emit(this.value);
					} else {
						this.borrarFecha();
					}
				} else {
					this.valueChangeSelected.emit(this.value);
				}
			} else {
				this.borrarFecha();
			}
		} else {
			this.valueChangeSelected.emit(this.value);
		}
  	}
  
  	input(e) {
		this.fechaSelectedFromCalendar = false;
		this.valueChangeInput.emit(this.value);
		//evento necesario para informar de las fechas que borren manualmente (teclado)
		if (e.inputType == 'deleteContentBackward' && !this.showTime) {
			this.borrarFecha();
		}
	}

	focus(e) {
		this.valueFocus.emit(e);
	}
}