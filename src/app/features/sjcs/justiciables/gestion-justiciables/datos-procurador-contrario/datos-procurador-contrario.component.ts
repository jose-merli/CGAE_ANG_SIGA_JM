import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableTelefonoItem } from '../../../../../models/sjcs/JusticiableTelefonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../../../../../_services/authentication.service';
import { Router } from '@angular/router';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { Checkbox, ConfirmDialog } from '../../../../../../../node_modules/primeng/primeng';
import { Dialog } from 'primeng/primeng';
import { ColegiadoItem } from "../../../../../models/ColegiadoItem";


@Component({
  selector: 'app-datos-procurador-contrario',
  templateUrl: './datos-procurador-contrario.component.html',
  styleUrls: ['./datos-procurador-contrario.component.scss']
})
export class DatosProcuradorContrarioComponent implements OnInit {
  generalBody: ColegiadoItem = new ColegiadoItem();

	tipoIdentificacion;
	progressSpinner: boolean = false;
	msgs = [];
	nifRepresentante;

	@Input() modoEdicion;
	@Input() showTarjeta;
	@Input() body: JusticiableItem;
	@Input() checkedViewRepresentante;
	@Input() navigateToJusticiable: boolean = false;
	@Input() fromContrario;

	searchRepresentanteGeneral: boolean = false;
	showEnlaceRepresentante: boolean = false;
	// navigateToJusticiable: boolean = false;
	esMenorEdad: boolean = false;
	idPersona;
	permisoEscritura;
	showTarjetaPermiso: boolean = false;
	representanteValido: boolean = false;
	confirmationAssociate: boolean = false;
	confirmationDisassociate: boolean = false;
	confirmationCreateRepresentante: boolean = false;

	@ViewChild('cdCreateRepresentante') cdCreateRepresentante: Dialog;
	@ViewChild('cdRepresentanteAssociate') cdRepresentanteAssociate: Dialog;
	@ViewChild('cdRepresentanteDisassociate') cdRepresentanteDisassociate: Dialog;

	@Output() newRepresentante = new EventEmitter<JusticiableItem>();
	@Output() viewRepresentante = new EventEmitter<JusticiableItem>();
	@Output() createJusticiableByUpdateRepresentante = new EventEmitter<JusticiableItem>();

  confirmationSave: boolean = false;
  confirmationUpdate: boolean = false;

  menorEdadJusticiable: boolean = false;


  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    
    this.progressSpinner = true;

		this.commonsService
			.checkAcceso(procesos_justiciables.tarjetaProcuradorContrario)
			.then((respuesta) => {
				this.permisoEscritura = respuesta;

				if (this.permisoEscritura == undefined) {
					this.showTarjetaPermiso = false;
					this.progressSpinner = false;
				} else {
					this.showTarjetaPermiso = true;
					this.persistenceService.clearFiltrosAux();
				}

			})
			.catch((error) => console.error(error));

      this.progressSpinner = false;
  }

  search() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			this.persistenceService.clearBody();
			this.router.navigate(['/justiciables'], { queryParams: { rp: '1' } });
		}
  }
  
  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

  disabledSave() {
		if (this.generalBody.numColegiado != undefined && this.generalBody.numColegiado != '' ) {
			return false;
		} else {
			return true;
		}
	}

	disabledDisassociate() {
		if (this.generalBody.numColegiado != undefined && this.generalBody.numColegiado != '') {
			return false;
		} else {
			return true;
		}
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
	
  reject(){
	
  }
	
  rejectAssociate(){
	
  }
	
  rejectDisassociate(){
	
  }
}
