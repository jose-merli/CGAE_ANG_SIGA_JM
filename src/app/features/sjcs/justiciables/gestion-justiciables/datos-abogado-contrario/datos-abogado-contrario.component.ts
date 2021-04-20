import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { ColegiadoItem } from "../../../../../models/ColegiadoItem";
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { SigaServices } from '../../../../../_services/siga.service';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { ConfirmationService } from 'primeng/api';
import { SigaConstants } from '../../../../../utils/SigaConstants';
import { procesos_justiciables } from '../../../../../permisos/procesos_justiciables';
import { DatosColegiadosItem } from '../../../../../models/DatosColegiadosItem';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-datos-abogado-contrario',
  templateUrl: './datos-abogado-contrario.component.html',
  styleUrls: ['./datos-abogado-contrario.component.scss']
})
export class DatosAbogadoContrarioComponent implements OnInit {

  generalBody: ColegiadoItem = new ColegiadoItem();
  navigateToColegiado: Boolean = false;
  progressSpinner: Boolean = true;

  idPersona: String = '';
  msgs: Message[] = [];
  nifRepresentante: String = '';

  showTarjetaPermiso: boolean = false;
  showEnlaceAbogado: boolean = false;
	confirmationDisassociate: boolean = false;
  permisoEscritura;

  @Input() body: JusticiableItem;
  @Input() modoEdicion;
  @Input() showTarjeta;
  @Input() fromContrario;

  
	@Output() viewAbogado = new EventEmitter<ColegiadoItem>();

  constructor(
		private router: Router,
		private sigaServices: SigaServices,
		private persistenceService: PersistenceService,
		private confirmationService: ConfirmationService,
		private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
  }


  onHideTarjeta() {
		if (this.modoEdicion) {
			this.showTarjeta = !this.showTarjeta;
		}
  }
  
  navigateToAbogado() {
		if (
			this.generalBody.idPersona != undefined &&
			this.generalBody.idPersona != null &&
			this.generalBody.idPersona != ''
		) {
			this.commonsService.scrollTop();
			this.idPersona = this.generalBody.idPersona;
			this.viewAbogado.emit(this.generalBody);
		}
  }

  validateShowEnlaceAbogado() {
		if (
			this.generalBody != undefined &&
			this.generalBody.numColegiado != undefined &&
			this.generalBody.numColegiado != null &&
			this.generalBody.numColegiado != ''
		) {
			this.showEnlaceAbogado = true;
		} else {
			this.showEnlaceAbogado = false;
		}
	}
  

  disabledSave() {
		if (this.generalBody.idPersona != undefined && this.generalBody.idPersona != '' ) {
			return false;
		} else {
			return true;
		}
  }

  checkPermisosRest() {
		let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			this.rest();
		}
  }
  
  rest() {
		if (!this.permisoEscritura) {
			this.showMessage(
				'error',
				this.translateService.instant('general.message.incorrect'),
				this.translateService.instant('general.message.noTienePermisosRealizarAccion')
			);
		} else {
			if (this.generalBody.colegiado != undefined) {
				this.searchColegiado();
			} else {
				this.generalBody = new ColegiadoItem();
				this.nifRepresentante = undefined;
			}
		}
  }
  
  searchColegiado() {
		this.progressSpinner = true;
    let request = [this.generalBody.idPersona, this.generalBody.idInstitucion];
    let cole: DatosColegiadosItem = new DatosColegiadosItem();
    cole.idPersona=this.generalBody.idPersona.toString();
    cole.idInstitucion=this.generalBody.idInstitucion.toString();

		/* this.sigaServices.post('busquedaCensoGeneral_searchColegiado', request).subscribe(
			(n) => {
				this.generalBody = JSON.parse(n.body).justiciable;
				this.nifRepresentante = this.generalBody.nif;
				this.persistenceService.clearBody();
				this.progressSpinner = false;
				// this.navigateToJusticiable = false;
				this.compruebaDNI();
			},
			(err) => {
				this.progressSpinner = false;
				console.log(err);
			}
		); */
  }
  
  checkPermisosDisassociate() {
		let msg = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

		if (msg != undefined) {
			this.msgs = msg;
		} else {
			if (this.disabledDisassociate()) {
				this.msgs = this.commonsService.checkPermisoAccion();
			} else {
				this.callConfirmationDisassociate();
			}
		}
  }
  
  disabledDisassociate() {
		if (this.generalBody.idPersona != undefined && this.generalBody.idPersona != '') {
			return false;
		} else {
			return true;
		}
  }
  
  callConfirmationDisassociate() {

		this.progressSpinner = false;
		this.confirmationDisassociate = true;

		this.confirmationService.confirm({
			key: 'cdRepresentanteDisassociate',
			message: this.translateService.instant(
				'gratuita.personaJG.mensaje.actualizarJusticiableParaTodosAsuntos'
			),
			icon: 'fa fa-search ',
			accept: () => {
				if (
					this.body.edad == undefined ||
					(this.body.edad != undefined && JSON.parse(this.body.edad) > SigaConstants.EDAD_ADULTA)
				) {
					this.callServiceDisassociate();
				} else {
					this.showMessage(
						'error',
						this.translateService.instant('general.message.incorrect'),
						this.translateService.instant(
							'justiciaGratuita.justiciables.message.asociarRepresentante.menorJusticiable'
						)
					);
				}
			},
			reject: () => { }
		});
  }
  
  callServiceDisassociate() {
    this.progressSpinner = true;
    
    let data = sessionStorage.getItem("designaItemLink");
    
    //let request = [ this.generalBody.idInstitucion,  this.idPersona, this.body.anio,  this.body.idTurno, this.body.numero]
    //this.sigaServices.post("designaciones_deleteContrario", request).subscribe(
		this.sigaServices.post('gestionJusticiables_disassociateRepresentante', this.body).subscribe(
			(n) => {
				this.showMessage(
					'success',
					this.translateService.instant('general.message.correct'),
					this.translateService.instant('general.message.accion.realizada')
				);
				this.generalBody = new ColegiadoItem();
				this.nifRepresentante = undefined;
				this.persistenceService.setBody(this.generalBody);
				this.body.idrepresentantejg = undefined;
				this.showEnlaceAbogado = false;
				this.progressSpinner = false;
			},
			(err) => {
				this.progressSpinner = false;
				this.translateService.instant('general.message.error.realiza.accion');
			}
		);
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
