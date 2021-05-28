import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { UnidadFamiliarEJGItem } from '../../../../../models/sjcs/UnidadFamiliarEJGItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-unidad-familiar',
  templateUrl: './datos-unidad-familiar.component.html',
  styleUrls: ['./datos-unidad-familiar.component.scss']
})
export class DatosUnidadFamiliarComponent implements OnInit {

  solicitantePrincipal:String = "";
  solicitanteBox: boolean = false;
  incapacitado: boolean = false;
  cirExcep: boolean = false;
  selectedGrupoL: String = null;
  selectedParentesco: String = null;
  selectedTipoIng: String = null;

  comboGrupoLaboral: any = [];
  comboParentesco: any = [];
  comboTipoIng: any = [];

	progressSpinner: boolean = false;
	permisoEscritura: boolean = false;
  generalBody: UnidadFamiliarEJGItem;

  showTarjeta: boolean = false;

  @Input() modoEdicion;
	@Input() showTarjetaPermiso;
	@Input() body: JusticiableItem;
	@Input() checkedViewRepresentante;
	@Input() navigateToJusticiable: boolean = false;
	@Input() fromUniFamiliar: boolean = false;
  
  
  constructor(private router: Router,
		private sigaServices: SigaServices,
		private persistenceService: PersistenceService,
		private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
    this.progressSpinner = true;

    this.getComboGruposLaborales();
    this.getComboParentesco();
    this.getComboTiposIngresos();

		/* this.commonsService
			.checkAcceso(procesos_justiciables.tarjetaAbogadoContrario)
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
			.catch((error) => console.error(error)); */
    /* Proviene de un EJG */
		if (this.fromUniFamiliar) {
			this.showTarjetaPermiso = true;
			this.permisoEscritura = true;
		}
		
    //Familiar que se ha seleccionado en el EJG
		if (sessionStorage.getItem("Familiar")) {
			let data = JSON.parse(sessionStorage.getItem("Familiar"));
			sessionStorage.removeItem("Familiar");
      this.generalBody = data;
			/* this.generalBody.nombreColegio = data.colegio;
			this.generalBody.numColegiado = data.numeroColegiado;
			this.generalBody.estadoColegial = data.situacion;
			this.generalBody.nombre = data.nombre;
			this.generalBody.nif = data.nif;
			this.generalBody.idPersona = data.idPersona; */

      if (this.generalBody.uf_solicitante == "1"){
        this.solicitantePrincipal = "SI";
        this.solicitanteBox = true;
      }
      else {
        this.solicitantePrincipal = "NO";
        this.solicitanteBox = false;
      }

			this.permisoEscritura = true;
			//this.contrario.emit(true);
		}
    this.progressSpinner = false;
  }

  onHideTarjeta() {
		this.showTarjeta = !this.showTarjeta;
	}

  save(){}

  rest(){}

  getComboGruposLaborales(){
  this.sigaServices.get("gestionJusticiables_comboGruposLaborales").subscribe(
    n => {
      this.comboGrupoLaboral = n.combooItems;
      this.commonsService.arregloTildesCombo(this.comboGrupoLaboral);
    },
    err => {
    }
  );
  }

  getComboParentesco(){
    this.sigaServices.get("gestionJusticiables_comboParentesco").subscribe(
      n => {
        this.comboParentesco = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboParentesco);
      },
      err => {
      }
    );
    }

    getComboTiposIngresos(){
      this.sigaServices.get("gestionJusticiables_comboTiposIngresos").subscribe(
        n => {
          this.comboTipoIng = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboTipoIng);
        },
        err => {
        }
      );
      }

}
