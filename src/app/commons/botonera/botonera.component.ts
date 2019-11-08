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
import { TranslateService } from '../translate/translation.service';

@Component({
	selector: 'app-botonera',
	templateUrl: './botonera.component.html',
	styleUrls: ['./botonera.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BotoneraComponent implements OnInit {
	@Input() value: any[];
	@Input() botones: any[];

	@Output() clickEvent = new EventEmitter<any>();
	@Input() disabled: boolean;
	botoneraSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;
	maxLengthComa: any;
	maxLengthOriginal: any;
	first: boolean = true;
	botonesPosible;
	numSelected: any;
	seleccion: boolean;
	rowsPerPage: { label: number; value: number; }[];
	selectAll: boolean;
	selectMultiple: boolean;
	changeDetectorRef: any;
	selectedItem: any;

	constructor(private service: SigaServices,
		private translateService: TranslateService
	) { }

	ngOnInit() {


	}
	ngAfterViewChecked() {
		setTimeout(() => {
			for (let i in this.botones) {
				if (this.translateService.instant(this.botones[i].label) != undefined)
					this.botones[i].label = this.translateService.instant(this.botones[i].label);
			}
		});
	}
	buttonAction(button) {
		this.clickEvent.emit(button.identity);
	}
}
