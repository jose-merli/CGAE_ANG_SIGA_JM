import { Component, OnInit, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { FacturacionItem } from '../../../../../../models/sjcs/FacturacionItem';
import { ComboItem } from '../../../../../../models/ComboItem';
import { esCalendar, catCalendar, euCalendar, glCalendar } from '../../../../../../utils/calendar';
import { USER_VALIDATIONS } from '../../../../../../properties/val-properties';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { SigaWrapper } from "../../../../../../wrapper/wrapper.class";
import { Calendar } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';

@Component({
  selector: 'app-datos-facturacion',
  templateUrl: './datos-facturacion.component.html',
  styleUrls: ['./datos-facturacion.component.scss']
})
export class DatosFacturacionComponent extends SigaWrapper implements OnInit {
  //FECHAS
	value: Date;
	valueChangeSelected = new EventEmitter();
	valueChangeInput = new EventEmitter();
	valueFocus = new EventEmitter();
	es: any = esCalendar;
	fechaSelectedFromCalendar: boolean = false;
	currentLang;
	yearRange: string;
	minDate: Date;
	maxDate: Date;
	showTime: boolean;
	calendar: Calendar;
  
  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;
  @Input() permisos;

  @Output() changeCerrada = new EventEmitter<boolean>();
  @Output() changeModoEdicion = new EventEmitter<boolean>();
  @Output() changeEstadoFacturacion = new EventEmitter<String>();
  @Output() changeIdFacturacion = new EventEmitter<String>();

  showFichaFacturacion: boolean = true;
  progressSpinner: boolean = false;
  checkRegularizar:boolean = false;
  checkVisible:boolean = false;
  checkRegularizarInicial:boolean = false;
  checkVisibleInicial:boolean = false;
  selectedItem: number = 10;

  body: FacturacionItem = new FacturacionItem();
  bodyAux: FacturacionItem = new FacturacionItem();

  partidaPresupuestaria: ComboItem;
  estadosFacturacion= [];
  cols;
  msgs;  

  @ViewChild("table") tabla;

  constructor(private sigaService: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService) { 
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    this.progressSpinner = true;
    this.getRangeYear();   

    this.comboPartidasPresupuestarias();

    if (undefined == this.idFacturacion) {
      this.body=new FacturacionItem();
      this.bodyAux=new FacturacionItem();
    } else {
      this.cargaDatos();
    }

    this.getCols();
  }

  cargaDatos(){
    this.progressSpinner = true;

    //datos de la facturación
		this.sigaService.getParam("facturacionsjcs_datosfacturacion", "?idFacturacion=" + this.idFacturacion).subscribe(
			data => {
        this.progressSpinner = false;

        this.body = new FacturacionItem();

        if(undefined != data.facturacionItem && data.facturacionItem.length>0){
          let datos=data.facturacionItem[0];
          this.body = JSON.parse(JSON.stringify(datos));

          if(undefined!=data.facturacionItem[0].fechaDesde){
            this.body.fechaDesde = new Date(data.facturacionItem[0].fechaDesde);
          }

          if(undefined!=data.facturacionItem[0].fechaHasta){
            this.body.fechaHasta = new Date(data.facturacionItem[0].fechaHasta);
            this.minDate = new Date(data.facturacionItem[0].fechaDesde);
          }

          if(undefined!=data.facturacionItem[0].fechaEstado){
            this.body.fechaEstado = new Date(data.facturacionItem[0].fechaEstado);
          }

          if(undefined!=data.facturacionItem[0].regularizacion){
            if(data.facturacionItem[0].regularizacion=='1'){
              this.checkRegularizar=true;
              this.checkRegularizarInicial=true;
            }else{
              this.checkRegularizar=false;
              this.checkRegularizarInicial=false;
            }
          }

          if(undefined!=data.facturacionItem[0].visible){
            if(data.facturacionItem[0].visible=='1'){
              this.checkVisible=true;
              this.checkVisibleInicial=true;
            }else{
              this.checkVisible=false;
              this.checkVisibleInicial=false;
            }
          }

          this.bodyAux = new FacturacionItem();
          this.bodyAux=JSON.parse(JSON.stringify(datos));

          if(undefined!=data.facturacionItem[0].fechaDesde){
            this.bodyAux.fechaDesde = new Date(data.facturacionItem[0].fechaDesde);
          }

          if(undefined!=data.facturacionItem[0].fechaHasta){
            this.bodyAux.fechaHasta = new Date(data.facturacionItem[0].fechaHasta);
            this.minDate = new Date(data.facturacionItem[0].fechaDesde);
          }

          if(undefined!=data.facturacionItem[0].fechaEstado){
            this.bodyAux.fechaEstado = new Date(data.facturacionItem[0].fechaEstado);
          }
        }
			},	  
			err => {
        this.progressSpinner = false;
        if(null!=err.error){
          console.log(err.error);
        } 
			}
    );
    
    this.historicoEstados();
  }

  historicoEstados(){
    if(undefined!=this.body.idFacturacion){
      this.progressSpinner = true;

      this.sigaService.getParam("facturacionsjcs_historicofacturacion", "?idFacturacion=" + this.body.idFacturacion).subscribe(
        data => {
          this.progressSpinner = false;

          this.estadosFacturacion = data.facturacionItem;
        },	  
        err => {
          this.progressSpinner = false;
          if(null!=err.error){
            console.log(err.error);
          } 
        }
      );
    }
  }  

  comboPartidasPresupuestarias(){
		this.sigaService.getParam("combo_partidasPresupuestarias", "?importe=1").subscribe(
			data => {
			  this.partidaPresupuestaria = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.partidaPresupuestaria);
			},	  
			err => {
			  if(null!=err.error){
          console.log(err.error);
        } 
			}
		);
  }
  
  borrarFecha() {
		this.value = null;
		this.valueChangeInput.emit(this.value);
		this.fechaSelectedFromCalendar = true;
		this.calendar.onClearButtonClick("");
	}
 
  save(){
    let url = "";
    if ((!this.cerrada && JSON.stringify(this.body) != JSON.stringify(this.bodyAux) && this.body.nombre.trim()!="") || (this.checkRegularizar!=this.checkRegularizarInicial) || (this.checkVisible!=this.checkVisibleInicial)){
      if(undefined==this.body.regularizacion){
        this.body.regularizacion="0";
      }

      if(this.checkRegularizar){
        this.body.regularizacion="1";
      }else{
        this.body.regularizacion="0";
      }

      if(this.checkVisible){
        this.body.visible="1";
      }else{
        this.body.visible="0";
      }

      if(undefined==this.body.visible){
        this.body.regularizacion="0";
      }

      if (!this.modoEdicion) {
        url = "facturacionsjcs_saveFacturacion";
        this.body.prevision="0";
        this.callSaveService(url);
      } else {
        url = "facturacionsjcs_updateFacturacion";
        this.callSaveService(url);
      }
    }
  }

  callSaveService(url) {
    this.progressSpinner=true;
    this.sigaService.post(url, this.body).subscribe(
      data => {
        if (!this.modoEdicion) {
          this.body.idFacturacion=JSON.parse(data.body).id;

          this.changeModoEdicion.emit(true);
        }
        
        this.checkRegularizarInicial=this.checkRegularizar;
        this.checkVisibleInicial=this.checkVisible;

        this.bodyAux = new FacturacionItem();
        this.bodyAux=JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;

        this.changeIdFacturacion.emit(this.body.idFacturacion);
        this.changeEstadoFacturacion.emit("10");
        this.changeCerrada.emit(false);
        this.historicoEstados();
      },
      err => {
        if (null!=err.error && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }

        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  ejecutar(){
    if((this.modoEdicion && this.idEstadoFacturacion=="10") || (this.modoEdicion && this.idEstadoFacturacion=="20")){
      this.callEjecutarService();
    }
  }

  callEjecutarService(){
    this.progressSpinner=true;
    this.sigaService.post("facturacionsjcs_ejecutarfacturacion", this.body.idFacturacion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;

        this.changeEstadoFacturacion.emit("50");
        this.changeCerrada.emit(true);
        this.historicoEstados();
      },
      err => {
        if (null!=err.error && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  reabrir(){
    if(this.modoEdicion && this.idEstadoFacturacion=="20"){
      this.callReabrirService();
    }
  }

  callReabrirService(){
    this.progressSpinner=true;
    this.sigaService.post("facturacionsjcs_reabrirfacturacion", this.body.idFacturacion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;

        this.historicoEstados();
        this.changeEstadoFacturacion.emit("10");
        this.changeCerrada.emit(false);
      },
      err => {
        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  simular(){
    if(this.modoEdicion && this.idEstadoFacturacion=="10"){
      this.callSimularService();
    }
  }

  callSimularService(){
    this.progressSpinner=true;
    this.sigaService.post("facturacionsjcs_simularfacturacion", this.body.idFacturacion).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;

        this.historicoEstados();
        this.changeEstadoFacturacion.emit("50");
        this.changeCerrada.emit(true);
      },
      err => {
        if (null!=err.error && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
  disabledSimular(){
    if(this.modoEdicion && this.idEstadoFacturacion=="10"){
      return false;
    }else{
      return true;
    }
  }

  disabledReabrir(){
    if(this.modoEdicion && this.idEstadoFacturacion=="20"){
      return false;
    }else{
      return true;
    }
  }

  disabledEjecutar(){
    if((this.modoEdicion && this.idEstadoFacturacion=="10") || (this.modoEdicion && this.idEstadoFacturacion=="20")){
      return false;
    }else{
      return true;
    }
  }

  disabledSave() {
    if(this.modoEdicion){

      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux) || this.checkRegularizarInicial!=this.checkRegularizar || this.checkVisibleInicial!=this.checkVisible) && (undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idPartidaPresupuestaria) && (undefined != this.body.fechaDesde) && (undefined !=this.body.fechaHasta) && (this.idEstadoFacturacion=="10" || this.idEstadoFacturacion=="50")) {
        return false;
      } else { 
        return true; 
      }
    }else{
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") && (undefined != this.body.idPartidaPresupuestaria) && (undefined != this.body.fechaDesde) && (undefined !=this.body.fechaHasta)) {
        return false;
      } else { 
        return true; 
      }
    }
  }

  disabledRestablecer() {
    if(this.modoEdicion){
      if ((JSON.stringify(this.body) != JSON.stringify(this.bodyAux) || this.checkRegularizarInicial!=this.checkRegularizar || this.checkVisibleInicial!=this.checkVisible) && (this.idEstadoFacturacion=="10" || this.idEstadoFacturacion=="50")) {
        return false;
      } else { 
        return true; 
      }
    }else{
      if ((undefined != this.body.nombre && this.body.nombre.trim() != "") || (undefined != this.body.idPartidaPresupuestaria) || (undefined != this.body.fechaDesde) || (undefined !=this.body.fechaHasta || this.checkRegularizarInicial!=this.checkRegularizar || this.checkVisibleInicial!=this.checkVisible)) {
        return false;
      } else { 
        return true; 
      }
    }
  }

  restablecer(){
    if(this.modoEdicion){
      this.body = new FacturacionItem();
      this.checkRegularizar=false;
      this.checkVisible=false;
      this.estadosFacturacion=[];
      this.changeCerrada.emit(false);
    }else{
      this.body=JSON.parse(JSON.stringify(this.bodyAux));

      if(undefined != this.body){

        if(undefined!=this.body.fechaDesde){
          this.body.fechaDesde = new Date(this.bodyAux.fechaDesde);
        }

        if(undefined!=this.body.fechaHasta){
          this.body.fechaHasta = new Date(this.bodyAux.fechaHasta);
          this.minDate = new Date(this.body.fechaDesde);
        }

        if(undefined!=this.body.fechaEstado){
          this.body.fechaEstado = new Date(this.bodyAux.fechaEstado);
        }

        if(undefined!=this.body.regularizacion){
          if(this.body.regularizacion=='1'){
            this.checkRegularizar=true;
          }else{
            this.checkRegularizar=false;
          }
        }

        if(undefined!=this.body.visible){
          if(this.body.visible=='1'){
            this.checkVisible=true;
          }else{
            this.checkVisible=false;
          }
        }
      }
    }
	}
  
  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {
    this.cols = [
      { field: "fechaEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
      { field: "desEstado", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.estado" }
    ];
  }
  
  getLenguage() {
		this.sigaService.get('usuario').subscribe((response) => {
			this.currentLang = response.usuarioItem[0].idLenguaje;

			switch (this.currentLang) {
				case '1':
					this.es = esCalendar;
					break;
				case '2':
					this.es = catCalendar;
					break;
				case '3':
					this.es = euCalendar;
					break;
				case '4':
					this.es = glCalendar;
					break;
				default:
					this.es = esCalendar;
					break;
			}
		});
  }
    
  ngAfterViewInit(): void {
		this.getLenguage();
	}

	getRangeYear() {
		let today = new Date();
		let year = today.getFullYear();
		this.yearRange = year - 80 + ':' + (year + 20);
  }
  
  onHideDatosGenerales() {
    this.showFichaFacturacion = !this.showFichaFacturacion;
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

  fillFechaDesde(event) {
		this.body.fechaDesde = event;
    if(this.body.fechaHasta < this.body.fechaDesde){
      this.body.fechaHasta = undefined;
    }
    this.minDate=this.body.fechaDesde;
	}

	fillFechaHasta(event) {
    this.body.fechaHasta = event;
  }

  change(newValue) {
		//evento que cambia el value de la fecha
		if (!this.showTime) {
			this.fechaSelectedFromCalendar = true;
			this.value = new Date(newValue);
			let year = this.value.getFullYear();
			if (year >= year - 80 && year <= year + 20) {
				if (this.minDate) {
					if (this.value >= this.minDate) {
						this.valueChangeSelected.emit(this.value);
					} else {
						this.borrarFecha();
					}
				} else {
					this.valueChangeSelected.emit(this.value);
				}
			} else {
				this.borrarFecha();
			}
		} else {
			this.valueChangeSelected.emit(this.value);
		}
  }
}
