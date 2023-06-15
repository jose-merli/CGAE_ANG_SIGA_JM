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
	selector: 'app-tabla',
	templateUrl: './tabla.component.html',
	styleUrls: ['./tabla.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class TablaComponent implements OnInit, AfterViewInit {
	@Input() value: any[];
	@Input() selection: String;
	@Input() selectionMode: String;
	@Input() selectedDatos: any[];
	@Input() dato: any;
	@Input() maxLength: any;
	@Input() porcentaje: any;
	@Input() nuevo: boolean;
	@Input() permisos: boolean;
	@Input() historico: boolean;
	@Input() id: String;
	@Input() rows: String;
	@Input() columns: any[];

	@Output() valueChangeInput = new EventEmitter<any>();
	@Input() disabled: boolean;
	tablaSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;
	maxLengthComa: any;
	maxLengthOriginal: any;
	first: boolean = true;

	@ViewChild('table') table;
	numSelected: any;
	seleccion: boolean;
	rowsPerPage: { label: number; value: number; }[];
	selectAll: boolean;
	selectMultiple: boolean;
	changeDetectorRef: any;
	selectedItem: any;

	constructor(private service: SigaServices) { }

	ngOnInit() {
		this.maxLengthOriginal = this.maxLength;
		if (this.porcentaje) {
			this.maxLengthComa = this.maxLength + 2;
		} else {
			this.maxLength++;
			this.maxLengthComa = this.maxLength + 3;
		}
		this.rowsPerPage = [
			{
				label: 10,
				value: 10
			},
			{
				label: 20,
				value: 20
			},
			{
				label: 30,
				value: 30
			},
			{
				label: 40,
				value: 40
			}
		];
	}

	isSelectMultiple() {
		if (this.permisos) {
			this.selectAll = false;
			this.selectMultiple = !this.selectMultiple;
			if (!this.selectMultiple) {
				this.selectedDatos = [];
				this.numSelected = 0;
			} else {
				// this.pressNew = false;
				this.selectAll = false;
				this.selectedDatos = [];
				this.numSelected = 0;
			}
		}
		// this.volver();
	}

	onChangeRowsPerPages(event) {
		this.selectedItem = event.value;
		this.changeDetectorRef.detectChanges();
		this.table.reset();
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


	onChangeSelectAll() {
		if (this.permisos) {
			if (this.selectAll === true) {
				this.selectMultiple = false;
				this.selectedDatos = this.value;
				this.numSelected = this.value.length;
				if (this.historico) {
					this.selectedDatos = this.value.filter(dato => dato.fechabaja != undefined && dato.fechabaja != null);
				} else {
					this.selectedDatos = this.value;
				}
			} else {
				this.selectedDatos = [];
				this.numSelected = 0;
			}

		}
	}


	setItalic(dato) {
		if (dato.fechabaja == null) return false;
		else return true;
	}


	actualizaSeleccionados(selectedDatos) {
		this.numSelected = selectedDatos.length;
		this.seleccion = false;
	}

	editAreas(event) {
		this.valueChangeInput.emit(event);
	}
}
