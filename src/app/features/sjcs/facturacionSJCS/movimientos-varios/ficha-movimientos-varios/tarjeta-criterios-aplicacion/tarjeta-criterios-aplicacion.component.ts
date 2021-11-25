import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { ComboItem } from '../../../../../../models/ComboItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { MovimientosVariosFacturacionItem } from '../../MovimientosVariosFacturacionItem';

@Component({
  selector: 'app-tarjeta-criterios-aplicacion',
  templateUrl: './tarjeta-criterios-aplicacion.component.html',
  styleUrls: ['./tarjeta-criterios-aplicacion.component.scss']
})
export class TarjetaCriteriosAplicacionComponent implements OnInit {

  progressSpinner: boolean = false;
  showFichaCriteriosAplicacion: boolean = false;
  datosAux;
  msgs;
  gruposFacturacion: ComboItem;
	facturacion: ComboItem;
	concepto: ComboItem;
	partidaPresupuestaria: ComboItem;

   datosCriteriosAplicacion: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
   idFacturacionNueva;
	isLetrado: boolean = false;

	@Input() datos;
	@Input() modoEdicion: boolean;
	@Input() datosClientes;
	@Input() permisoEscritura;

  constructor(private sigaService: SigaServices,
		private commonsService: CommonsService, private sigaStorageService: SigaStorageService, private router: Router, private translateService: TranslateService) { }

  ngOnInit() {

	this.isLetrado = this.sigaStorageService.isLetrado;
	
	if(this.datos!= null || this.datos != undefined){
        this.datosAux = JSON.parse(JSON.stringify(this.datos));
	}else{
		this.datos = new MovimientosVariosFacturacionItem();
	}
    	this.comboFacturacionApInicial();
		this.comboGruposTurnos();
		this.comboConcepto();
    	this.comboPartidasPresupuestarias();


  }


   restablecer(){
 	this.datos = JSON.parse(JSON.stringify(this.datosAux));
  }

  onHideCriteriosAplicacion(){
    this.showFichaCriteriosAplicacion = !this.showFichaCriteriosAplicacion;
  }

  comboPartidasPresupuestarias() {
		this.progressSpinner = true;

		this.sigaService.get("combo_partidasPresupuestarias").subscribe(
			data => {
				this.partidaPresupuestaria = data.combooItems;
				this.commonsService.arregloTildesCombo(this.partidaPresupuestaria);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
	}


  comboFacturacionApInicial(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboFactMovimientos").subscribe(
			data => {
				this.facturacion = data.combooItems;
				this.commonsService.arregloTildesCombo(this.facturacion);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);

    this.progressSpinner = false;
  }

  comboGruposTurnos(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboAgrupacionEnTurnos").subscribe(
			data => {
				this.gruposFacturacion = data.combooItems;
				this.commonsService.arregloTildesCombo(this.gruposFacturacion);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);

    this.progressSpinner = false;
  }

  comboConcepto(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboFactConceptos").subscribe(
			data => {
				this.concepto = data.combooItems;
				this.commonsService.arregloTildesCombo(this.concepto);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
  }

  guardar(){

	   let url;
		if (!this.modoEdicion) {
		  url = "movimientosVarios_saveCriteriosMovimientosVarios";
		} else {
		  url = "movimientosVarios_updateCriteriosMovimientosVarios";
		}
		this.callSaveService(url);
	
  }
  
  callSaveService(url) {
	this.progressSpinner = true;
	 this.datosCriteriosAplicacion=JSON.parse(JSON.stringify(this.datos));

	 if(this.datos.idMovimiento == null || this.datos.idMovimiento == undefined){
		 this.datosCriteriosAplicacion.idMovimiento = null;
	 }else{
		this.datosCriteriosAplicacion.idMovimiento = this.datos.idMovimiento;
	 }

	 if(this.datos.idGrupoFacturacion == null || this.datos.idGrupoFacturacion == undefined){
		this.datosCriteriosAplicacion.idGrupoFacturacion = null;
	}else{
	   this.datosCriteriosAplicacion.idGrupoFacturacion = this.datos.idGrupoFacturacion;
	}

	if(this.datos.idFacturacion == undefined || this.datos.idFacturacion == null){
        this.datosCriteriosAplicacion.idFacturacion = null;
      }else{
        this.datosCriteriosAplicacion.idFacturacion = this.datos.idFacturacion;
      }

	  if(this.datos.idConcepto == undefined || this.datos.idConcepto == null){
        this.datosCriteriosAplicacion.idConcepto = null;
      }else{
        this.datosCriteriosAplicacion.idConcepto = this.datos.idConcepto;
      }

	  if(this.datos.idPartidaPresupuestaria == undefined || this.datos.idPartidaPresupuestaria == null){
        this.datosCriteriosAplicacion.idPartidaPresupuestaria = null;
      }else{
        this.datosCriteriosAplicacion.idPartidaPresupuestaria = this.datos.idPartidaPresupuestaria;
      }     
     

      if(this.datosClientes.idPersona == undefined || this.datosClientes.idPersona == null){
        this.datosCriteriosAplicacion.idPersona = null;
      }else{
        this.datosCriteriosAplicacion.idPersona = this.datosClientes.idPersona;
      }

      if(!this.modoEdicion){
		this.datosCriteriosAplicacion.descripcion = null;
		this.datosCriteriosAplicacion.cantidad = null;
		this.datosCriteriosAplicacion.tipo = null;
		this.datosCriteriosAplicacion.motivo = null;
		this.datosCriteriosAplicacion.certificacion=null;
		this.datosCriteriosAplicacion.fechaAlta=null;
        this.datosCriteriosAplicacion.nombrefacturacion = null;
        this.datosCriteriosAplicacion.nombretipo = null;
        this.datosCriteriosAplicacion.idAplicadoEnPago= null
        this.datosCriteriosAplicacion.fechaApDesde = null;
        this.datosCriteriosAplicacion.fechaApHasta = null;
        this.datosCriteriosAplicacion.idFacturacionApInicial = null;
        this.datosCriteriosAplicacion.ncolegiado = null;
        this.datosCriteriosAplicacion.letrado = null;
        this.datosCriteriosAplicacion.cantidadAplicada = null;
        this.datosCriteriosAplicacion.cantidadRestante = null;
        this.datosCriteriosAplicacion.idInstitucion = null;
        this.datosCriteriosAplicacion.fechaModificacion = null;
        this.datosCriteriosAplicacion.usuModificacion = null;
        this.datosCriteriosAplicacion.contabilizado = null;
        this.datosCriteriosAplicacion.historico = null;
        this.datosCriteriosAplicacion.nif = null;
        this.datosCriteriosAplicacion.apellido1 = null;
        this.datosCriteriosAplicacion.apellido2 = null;
        this.datosCriteriosAplicacion.nombre = null;
        this.datosCriteriosAplicacion.nombrePago = null;
      }
      

	this.sigaService.post(url, this.datosCriteriosAplicacion).subscribe(
	  data => {

		this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
		this.progressSpinner = false;
	  },
	  err => {
		this.progressSpinner = false;
  
		if (err.status == '403' || err.status == 403) {
		  sessionStorage.setItem("codError", "403");
		  sessionStorage.setItem(
			"descError",
			this.translateService.instant("generico.error.permiso.denegado")
		  );
		  this.router.navigate(["/errorAcceso"]);
		} else {
  
		  if (null != err.error && JSON.parse(err.error).error.description != "") {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
		  } else {
			this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
		  }
  
		}
	  },
	  () => {
		this.progressSpinner = false;
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

}
