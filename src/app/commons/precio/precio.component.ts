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
	selector: 'app-precio',
	templateUrl: './precio.component.html',
	styleUrls: ['./precio.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PrecioComponent implements OnInit, AfterViewInit {
	@Input() value: String;
	@Input() selectedDatos: any[];
	@Input() dato: any;
	@Input() maxLength: any;
	@Input() porcentaje: any;
	@Input() nuevo: boolean;
	@Input() id: String;

	@Output() valueChangeInput = new EventEmitter();
	@Input() disabled: boolean;
	precioSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;
	maxLengthComa: any;
	maxLengthOriginal: any;
	first: boolean = true;

	@ViewChild('importe') importe;

	constructor(private service: SigaServices) { }

	ngOnInit() {
		this.maxLengthOriginal = this.maxLength;
		if (this.porcentaje) {
			this.maxLengthComa = this.maxLength + 2;
		} else {
			this.maxLength++;
			this.maxLengthComa = this.maxLength + 3;
		}
	}

	ngAfterViewInit(): void {
	}

	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
			return true;
		}
		else {
			return false;

		}
	}

	validateImporte() {
		if (!this.nuevo) {
			this.dato.numero = "" + this.importe.nativeElement.value;
			if (this.dato.numero.split(",").length - 1 > 1) {
				let partePrimera = this.dato.numero.split(",");
				this.dato.numero = partePrimera[0];
			}
			if (this.dato.numero.includes(",")) {
				this.maxLength = this.maxLengthComa;
				let partes = this.dato.numero.split(",");
				let numero = + partes[0];
				if (partes[1].length > 0) {
					if (partes[0] == "") {
						partes[0] = "0";
					}
					let primeraParte = partes[0].substring(0, this.maxLengthOriginal);
					let segundaParte = partes[1].substring(0, 2);
					this.dato.numero = primeraParte + "," + segundaParte;
				}
				if (numero < 0) {
					this.dato.numero = "0";
				}
			} else {
				this.maxLength = this.maxLengthOriginal;
				this.dato.numero = this.dato.numero.substring(0, this.maxLengthOriginal);

				let numero = + this.dato.numero;
				if (numero < 0) {
					this.dato.numero = "0";
				}
			}
			this.importe.nativeElement.value = this.dato.numero;
			this.dato.valorNum = this.dato.numero;
			this.valueChangeInput.emit(this.dato);

		} else {
			this.dato.numero = "" + this.importe.nativeElement.value;
			if (this.dato.numero.includes(",")) {
				this.maxLength = this.maxLengthComa;
				let partes = this.dato.numero.split(",");
				partes[0].substring(0, this.maxLengthOriginal - 1);
				if (partes[1].length > 0) {
					if (partes[0] == "") {
						partes[0] = "0";
					}
					let segundaParte = partes[1].substring(0, 2);
					this.dato.numero = partes[0] + "," + segundaParte;
					// this.importe.nativeElement.value = this.modulosItem.importe;
				}
				let numero = + partes[0];
				if (partes[1].length > 0) {
					if (partes[0] == "") {
						partes[0] = "0";
					}
					let primeraParte = partes[0].substring(0, this.maxLengthOriginal);
					let segundaParte = partes[1].substring(0, 2);
					this.dato.numero = primeraParte + "," + segundaParte;
				}
			} else {
				this.maxLength = this.maxLengthOriginal;
				this.dato.numero = this.dato.numero.substring(0, this.maxLengthOriginal);

			}
			// this.dato.numero = this.dato.numero.substring(0, this.maxLengthOriginal);
			this.importe.nativeElement.value = this.dato.numero;
			this.dato.valorNum = this.dato.numero;
		}
		if (this.dato.numero > 100 && this.porcentaje) {
			this.dato.numero = 100;
			this.importe.nativeElement.value = this.dato.numero;

		}
	}

}
