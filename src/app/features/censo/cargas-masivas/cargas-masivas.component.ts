import { AfterContentInit, Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TranslateService } from '../../../commons/translate/translation.service';

@Component({
	selector: 'app-cargas-masivas',
	templateUrl: './cargas-masivas.component.html',
	styleUrls: ['./cargas-masivas.component.scss']
})
export class CargasMasivasComponent implements OnInit, AfterContentInit {
	cargasMasivas: SelectItem[];
	msgs: any[];
	showCargasMasivas: boolean = false;
	enableGF: boolean = false;
	enableCV: boolean = false;
	progressSpinner: boolean = false;
	selectedTipoCarga: string;
	cargaMasivaGF: string = this.translateService.instant('menu.cen.cargaMasivaGruposFijos');
	cargaMasivaCV: string = this.translateService.instant('menu.cen.cargaMasivaDatosCurriculares');


	constructor(private translateService: TranslateService) { }

	ngOnInit() {
		// Abrir tarjeta
		this.showCargasMasivas = true;

		this.cargasMasivas = [
			{
				label: this.cargaMasivaCV,
				value: 'CV'
			},
			{
				label: this.cargaMasivaGF,
				value: 'GF'
			},
		];
	}

	ngAfterContentInit() {
		// this.cargasMasivas = [
		// 	{
		// 		label: this.translateService.instant('menu.cen.cargaMasivaGruposFijos'),
		// 		value: 'GF'
		// 	},
		// 	{
		// 		label: this.translateService.instant('menu.cen.cargaMasivaDatosCurriculares'),
		// 		value: 'CV'
		// 	}
		// ];
	}

	onHideCargasMasivas() {
		this.showCargasMasivas = !this.showCargasMasivas;
	}

	onChange(event) {
		if (event == 'GF') {
			this.enableGF = true;
		} else {
			this.enableGF = false;
		}

		if (event == 'CV') {
			this.enableCV = true;
		} else {
			this.enableCV = false;
		}
	}
	clear() {
		this.msgs = [];
	}
}
