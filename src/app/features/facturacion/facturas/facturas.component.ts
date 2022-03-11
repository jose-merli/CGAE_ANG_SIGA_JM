import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../commons/translate';
import { FacturasItem } from '../../../models/FacturasItem';
import { CommonsService } from '../../../_services/commons.service';
import { OldSigaServices } from '../../../_services/oldSiga.service';
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosFacturasComponent } from './filtros-facturas/filtros-facturas.component';
import { TablaFacturasComponent } from './tabla-facturas/tabla-facturas.component';

@Component({
	selector: 'app-facturas',
	templateUrl: './facturas.component.html',
	styleUrls: [ './facturas.component.scss' ]
})
export class FacturasComponent implements OnInit {
	datos:FacturasItem[];
	msgs;
	filtro;

	progressSpinner: boolean = false;
	buscar: boolean = false;
	permisoEscritura: boolean = false;

	@ViewChild(FiltrosFacturasComponent) filtros;
  	@ViewChild(TablaFacturasComponent) tabla;

	constructor(private translateService: TranslateService,
		private sigaServices: SigaServices,
		private commonsService: CommonsService) {
	}

	ngOnInit() {
		this.buscar = false;
		this.permisoEscritura=true //cambiar cuando se implemente los permisos
		if (sessionStorage.getItem('filtrosFacturas')) {
			this.filtros.body = JSON.parse(sessionStorage.getItem('filtrosFacturas'));
			sessionStorage.removeItem('filtrosFacturas');
			this.filtros.body.fechaEmisionDesde = this.transformDate(this.filtros.body.fechaEmisionDesde);
			this.filtros.body.fechaEmisionHasta = this.transformDate(this.filtros.body.fechaEmisionHasta);
	  
			this.buscarFacturas();
		  }

	}

	buscarFacturas() {
		this.filtro = JSON.parse(JSON.stringify(this.filtros.body));

		this.progressSpinner = true;

		this.sigaServices.post("facturacionPyS_getFacturas", this.filtro).subscribe(
		n => {
			this.progressSpinner = false;

			this.datos = JSON.parse(n.body).facturasItems;
			this.buscar = true;
			let error = JSON.parse(n.body).error;

			//console.log(this.datos);

			if (this.tabla != null && this.tabla != undefined) {
			this.tabla.table.sortOrder = 0;
			this.tabla.table.sortField = '';
			this.tabla.table.reset();
			this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
			}

			//comprobamos el mensaje de info de resultados
			if (error!=undefined && error!=null) {
			this.showMessage("info",this.translateService.instant("general.message.informacion"), this.translateService.instant(error.message));
			}

			this.progressSpinner = false;
		},
		err => {
			this.progressSpinner = false;
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
		},
		() => {
			this.progressSpinner = false;
			setTimeout(() => {
			this.commonsService.scrollTablaFoco('tablaFoco');
			this.commonsService.scrollTop();
			}, 5);
		}
		);
	}

	transformNumber(num:string){
		num = parseFloat(num).toFixed(2);
		return num;
	}

	showMessage(severity, summary, msg) {
		this.msgs = [];
		this.msgs.push({
		  severity: severity,
		  summary: summary,
		  detail: msg
		});
	  }
	
	  clear() {
		this.msgs = [];
	  }

	  transformDate(fecha) {
		if (fecha != undefined)
		  fecha = new Date(fecha);
		else
		  fecha = null;
		// fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
		return fecha;
	  }
}
