import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output, SimpleChanges,ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { ComboItem } from '../../../../../../models/ComboItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { MovimientosVariosService } from '../../movimientos-varios.service';
import { MovimientosVariosFacturacionItem } from '../../MovimientosVariosFacturacionItem';
import { TarjetaDatosClienteComponent } from '../tarjeta-datos-cliente/tarjeta-datos-cliente.component';

@Component({
  selector: 'app-tarjeta-datos-generales-fiMov',
  templateUrl: './tarjeta-datos-generales.component.html',
  styleUrls: ['./tarjeta-datos-generales.component.scss']
})
export class TarjetaDatosGeneralesComponent implements OnInit {

  msgs;
  datosAux;
  showFichaDatosGen: boolean = false;
  @Input() openDatosGen;

  	@Output() opened = new EventEmitter<Boolean>();
  	@Output() idOpened = new EventEmitter();

  progressSpinner: boolean = false;
  tipos: ComboItem;
  certificaciones: ComboItem;
  partidaPresupuestaria: ComboItem;
  aplicadoEnPago: ComboItem;
  isLetrado: boolean = false;
  datosGenerales: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Input() modoEdicion: boolean;
  @Input() datos;
  @Input() permisoEscritura;
  @Input() showCards;

  constructor( private movimientosVariosService: MovimientosVariosService,  private sigaStorageService: SigaStorageService,private persistenceService: PersistenceService, private commonsService: CommonsService, private sigaService: SigaServices, private translateService: TranslateService,private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
		if (this.openDatosGen == true) {
			if (this.showFichaDatosGen == false) {
			  this.onHideDatosGen();
			}
		}
	}

  ngOnInit() {

    if(this.showCards){
      this.showFichaDatosGen = true;
    }
    if(this.datos != null || this.datos != undefined){
      this.datosAux = JSON.parse(JSON.stringify(this.datos));
    }else{
      this.datos = new MovimientosVariosFacturacionItem();
      this.datosAux = new MovimientosVariosFacturacionItem();
    }
    this.isLetrado = this.sigaStorageService.isLetrado;
  
  
    if(!this.modoEdicion){
      this.showFichaDatosGen=true;
    }

    this.comboTipos();
    this.comboCertificaciones();

  }

  

  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == 'input' && (valor == undefined || valor == null || valor.toString().trim().length == 0)) {
      resp = true;
    }

    return resp;
  }

  comprobarCantidad(event){

    let pattern=/^(-?\d{0,10})?([.]?\d{1,2})?$/;

    if (!pattern.test(event)) {
        this.datos.cantidad="";
      }
  }

  onHideDatosGen() {
    let key = "tarjetaDatosGenerales";
    this.showFichaDatosGen = !this.showFichaDatosGen;

    
		this.opened.emit(this.showFichaDatosGen);
		this.idOpened.emit(key);
  }


  comboTipos(){

    this.progressSpinner = true;

		this.sigaService.get("combo_comboTiposMovVarios").subscribe(
			data => {
				this.tipos = data.combooItems;
				this.commonsService.arregloTildesCombo(this.tipos);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
  }

  comboCertificaciones(){

    this.progressSpinner = true;

		this.sigaService.get("combo_certificacionSJCS").subscribe(
			data => {
				this.certificaciones = data.combooItems;
				this.commonsService.arregloTildesCombo(this.certificaciones);
				this.progressSpinner = false;
			},
			err => {
				console.log(err);
				this.progressSpinner = false;
			}
		);
    this.progressSpinner = false;
  }

  restablecer(){
    this.datos= JSON.parse(JSON.stringify(this.datosAux));
  }

//   guardar(){

//   if(this.datosClientes != null || this.datosClientes != undefined){
//     if((this.datos.descripcion == null || this.datos.descripcion == undefined || this.datos.descripcion == "") || 
//        (this.datos.cantidad == null || this.datos.cantidad == undefined || this.datos.cantidad == "")){
        
//         this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
//     }else{ 
//      let url;
//       if (!this.modoEdicion) {
//         url = "movimientosVarios_saveDatosGenMovimientosVarios";
//       } else {
//         url = "movimientosVarios_updateDatosGenMovimientosVarios";
//       }
//       this.callSaveService(url);
//     }
//   }else{
//      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Deben estar los datos del Cliente rellenos");
//  }
// }

// callSaveService(url) {
//   this.progressSpinner = true;
  
//       this.datosGenerales=JSON.parse(JSON.stringify(this.datos));
      
//       this.datosGenerales.descripcion = this.datos.descripcion;
//       this.datosGenerales.cantidad = this.datos.cantidad;
      
//       if(this.datos.tipo == undefined || this.datos.tipo == null){
//         this.datosGenerales.tipo = null;
//       }else{
//         this.datosGenerales.tipo = this.datos.tipo;
//       }

//       if(this.datos.idFacturacion == undefined || this.datos.idFacturacion == null){
//         this.datosGenerales.idFacturacion = null;
//       }else{
//         this.datosGenerales.idFacturacion = this.datos.idFacturacion;
//       }

//       if(this.datos.motivo == undefined || this.datos.motivo == null){
//         this.datosGenerales.motivo = null;
//       }else{
//         this.datosGenerales.motivo = this.datos.motivo;
//       }

//       if(this.datos.certificacion == undefined || this.datos.certificacion == null){
//         this.datosGenerales.certificacion = null;
//       }else{
//         this.datosGenerales.certificacion = this.datos.certificacion;
//       }

//       if(this.datosClientes.idPersona == undefined || this.datosClientes.idPersona == null){
//         this.datosGenerales.idPersona = null;
//       }else{
//         this.datosGenerales.idPersona = this.datosClientes.idPersona;
//       }

//       this.datosGenerales.fechaAlta=null;

//       if(!this.modoEdicion){
//         this.datosGenerales.nombrefacturacion = null;
//         this.datosGenerales.nombretipo = null;
//         this.datosGenerales.idAplicadoEnPago= null
//         this.datosGenerales.fechaApDesde = null;
//         this.datosGenerales.fechaApHasta = null;
//         this.datosGenerales.idConcepto = null;
//         this.datosGenerales.idPartidaPresupuestaria = null;
//         this.datosGenerales.ncolegiado = null;
//         this.datosGenerales.letrado = null;
//         this.datosGenerales.cantidadAplicada = null;
//         this.datosGenerales.cantidadRestante = null;
//         this.datosGenerales.idInstitucion = null;
//         this.datosGenerales.idMovimiento = null;
//         this.datosGenerales.fechaModificacion = null;
//         this.datosGenerales.usuModificacion = null;
//         this.datosGenerales.contabilizado = null;
//         this.datosGenerales.idGrupoFacturacion = null;
//         this.datosGenerales.historico = null;
//         this.datosGenerales.nif = null;
//         this.datosGenerales.apellido1 = null;
//         this.datosGenerales.apellido2 = null;
//         this.datosGenerales.nombre = null;
//         this.datosGenerales.nombrePago = null;
//       }
      
  
//   this.sigaService.post(url, this.datosGenerales).subscribe(
//     data => {

//       this.datosAux = JSON.parse(JSON.stringify(this.datosGenerales));

//       this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
//       this.progressSpinner = false;
//       this.modoEdicion = true;
//       //this.movimientosVariosService.datosColegiadoFichaColegial(this.datosGenerales);
//       this.router.navigate(["/fichaMovimientosVarios"]);

//     },
//     err => {
//       this.progressSpinner = false;

//       if (err.status == '403' || err.status == 403) {
//         sessionStorage.setItem("codError", "403");
//         sessionStorage.setItem(
//           "descError",
//           this.translateService.instant("generico.error.permiso.denegado")
//         );
//         this.router.navigate(["/errorAcceso"]);
//       } else {

//         if (null != err.error && JSON.parse(err.error).error.description != "") {
//           this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
//         } else {
//           this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
//         }

//       }
//     },
//     () => {
//       this.progressSpinner = false;
//     }
//   );
// }

showMessage(severity, summary, msg) {
  this.msgs = [];
  this.msgs.push({
    severity: severity,
    summary: summary,
    detail: msg
  });
}

clear(){
  this.msgs = [];
}
}
