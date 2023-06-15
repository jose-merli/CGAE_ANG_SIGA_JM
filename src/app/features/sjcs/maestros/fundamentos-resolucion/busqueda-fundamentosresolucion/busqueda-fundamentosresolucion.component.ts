import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FiltrosFundamentosresolucionComponent } from './filtros-fundamentosresolucion/filtros-fundamentosresolucion.component';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { TablaFundamentosresolucionComponent } from './tabla-fundamentosresolucion/tabla-fundamentosresolucion.component';

@Component({
	selector: 'app-busqueda-fundamentosresolucion',
	templateUrl: './busqueda-fundamentosresolucion.component.html',
	styleUrls: ['./busqueda-fundamentosresolucion.component.scss']
})
export class BusquedaFundamentosresolucionComponent implements OnInit {
	buscar: boolean = false;
	historico: boolean = false;
	permisoEscritura: boolean = false;
	datos;
	msgs;
	progressSpinner: boolean = false;

	@ViewChild(FiltrosFundamentosresolucionComponent) filtros;
	@ViewChild(TablaFundamentosresolucionComponent) tabla;

	constructor(
		private sigaServices: SigaServices,
		private commonsService: CommonsService,
		private persistenceService: PersistenceService,
		private translateService: TranslateService,
		private router: Router
	) { }

	ngOnInit() {
		this.commonsService
			.checkAcceso(procesos_maestros.fundamentoResolucion)
			.then((respuesta) => {
				this.permisoEscritura = respuesta;

				this.persistenceService.setPermisos(this.permisoEscritura);

				if (this.permisoEscritura == undefined) {
					sessionStorage.setItem('codError', '403');
					sessionStorage.setItem(
						'descError',
						this.translateService.instant('generico.error.permiso.denegado')
					);
					this.router.navigate(['/errorAcceso']);
				}
			})
			.catch((error) => console.error(error));
	}

	isOpenReceive(event) {
		this.search(event);
	}

	searchHistorico(event) {
		this.search(event);
	}

	search(event) {
		this.filtros.filtroAux.historico = event;
		this.persistenceService.setHistorico(event);
		this.progressSpinner = true;

		this.sigaServices
			.post('gestionFundamentosResolucion_searchFundamentosResolucion', this.filtros.filtroAux)
			.subscribe(
				(n) => {
					this.datos = JSON.parse(n.body).fundamentoResolucionItems;
					this.buscar = true;
					if (this.tabla != null && this.tabla != undefined) {
						this.tabla.historico = event;
					}
					if (this.tabla && this.tabla.table) {
						this.tabla.table.sortOrder = 0;
						this.tabla.table.sortField = '';
						this.tabla.table.reset();
						this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
					}
					this.progressSpinner = false;

				},
				(err) => {
					this.progressSpinner = false;
					//console.log(err);
				}
			);
	}
	clear() {
		this.msgs = [];
	}
}
