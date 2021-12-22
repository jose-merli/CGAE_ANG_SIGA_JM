import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
	AfterViewInit,
	ViewEncapsulation
} from '@angular/core';
import * as moment from 'moment';
import { Calendar } from 'primeng/primeng';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../utils/calendar';
import { SigaServices } from '../../_services/siga.service';

@Component({
	selector: 'app-fecha',
	templateUrl: './fecha.component.html',
	styleUrls: ['./fecha.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FechaComponent implements OnInit, AfterViewInit {
	@Input() value: Date;
	@Output() valueChangeSelected = new EventEmitter();
	@Output() valueChangeInput = new EventEmitter();
	@Output() valueFocus = new EventEmitter();
	@Input() minDate: Date;
	@Input() maxDate: Date;
	@Input() disabled: boolean;
	@Input() showTime: boolean;
	@Input() utc: boolean;
	@Input() selectionMode: string;
	@Input() disabledToday: boolean;
	@Input() disabledDelete: boolean;
	@Input() inputStyleClass: string;
	@Input() appendTo = null;

	es: any = esCalendar;
	fechaSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;

	first: boolean = true;

	@ViewChild('calendar') calendar: Calendar;

	constructor(private service: SigaServices) { }

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

	blur(e) {
		let REGEX = /[a-zA-Z]/;
		//evento necesario para informar de las fechas que metan manualmente (escribiendo o pegando)
		if (!this.fechaSelectedFromCalendar) {
			if (!this.first) {
				let newValue = e.target.value;
				if (this.showTime) {
					if (!REGEX.test(newValue)) {
						let fecha = moment(newValue, 'DD/MM/YYYY hh:mm').toDate();
						this.calendar.onSelect.emit(fecha);
					} else {
						this.calendar.overlayVisible = false;
						this.value = null;
					}
				} else {
					if (newValue != null && newValue != '') {
						if (!REGEX.test(newValue) && newValue.length < 11) {
							let fecha = moment(newValue, 'DD/MM/YYYY').toDate();
							this.calendar.onSelect.emit(fecha);
						} else {
							this.calendar.overlayVisible = false;
							this.value = null;
						}
					}
				}
			} else {
				this.first = false;
			}
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

	borrarFecha() {
		this.value = null;
		this.valueChangeInput.emit(this.value);
		this.fechaSelectedFromCalendar = true;
		this.calendar.onClearButtonClick("");
	}

	fechaHoy() {
		this.value = new Date();
		this.valueChangeSelected.emit(this.value);
		this.calendar.overlayVisible = false;
		this.fechaSelectedFromCalendar = true;
	}

}