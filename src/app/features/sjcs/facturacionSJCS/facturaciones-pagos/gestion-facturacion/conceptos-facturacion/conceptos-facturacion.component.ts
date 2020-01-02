import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { USER_VALIDATIONS } from '../../../../../../properties/val-properties';
import { SigaWrapper } from '../../../../../../wrapper/wrapper.class';
import { ComboItem } from '../../../../../../models/ComboItem';

@Component({
  selector: 'app-conceptos-facturacion',
  templateUrl: './conceptos-facturacion.component.html',
  styleUrls: ['./conceptos-facturacion.component.scss']
})
export class ConceptosFacturacionComponent extends SigaWrapper implements OnInit {
  progressSpinner: boolean = false;
  cols;
  msgs; 
  showFichaConceptos: boolean = true;
  rowsPerPage: any = [];
  buscadores = [];
  selectedItem: number = 10;
  selectedDatos = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  //datos: any[] = [];
  selectAll: boolean = false;
  nuevoConcepto: boolean = false;
  modificaConcepto: boolean = false;
  selectionMode: string = "single";
  idConcepto: string = undefined;
  idGrupo: string = undefined;
  idConceptoOld: string = undefined;
  idGrupoOld: string = undefined;

  body = [];
  bodyUpdate;
  bodyAux = [];

  //COMBOS
  conceptos: ComboItem;
  grupoTurnos: ComboItem;

  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;
  @Input() permisos;

  @ViewChild("tabla") tabla;
  
  constructor(private sigaService: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
		private persistenceService: PersistenceService) { 
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    this.progressSpinner = true;

    this.comboConceptos();
    this.comboGruposTurnos();    

    this.cargaDatos();
    
    this.getCols();
  }

  comboConceptos(){
    this.sigaService.get("combo_comboFactConceptos").subscribe(
			data => {
			  this.conceptos = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.conceptos);
			},	  
			err => {
			  console.log(err);
			}
		);
  }

  comboGruposTurnos(){
    this.sigaService.get("combo_grupoFacturacion").subscribe(
			data => {
			  this.grupoTurnos = data.combooItems;
			  this.commonsService.arregloTildesCombo(this.grupoTurnos);
			},	  
			err => {
			  console.log(err);
			}
		);
  }

  cargaDatos(){
    if(undefined!=this.idFacturacion){
      this.progressSpinner = true;
      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_tarjetaConceptosfac", "?idFacturacion=" + this.idFacturacion).subscribe(
        data => {
          this.progressSpinner = false;

          if(undefined != data.facturacionItem && data.facturacionItem.length>0){
            let datos=data.facturacionItem;

            datos.forEach(element => {
              if(element.importeTotal!=undefined){
                element.importeTotalFormat = element.importeTotal.replace(".", ",");
              
                if (element.importeTotalFormat[0] == '.' || element.importeTotalFormat[0] == ','){
                  element.importeTotalFormat = "0".concat(element.importeTotalFormat)
                }
              }else{
                element.importeTotalFormat = 0;
              }				

              if(element.importePendiente!=undefined){
                element.importePendienteFormat = element.importePendiente.replace(".", ",");
                
                if (element.importePendienteFormat[0] == '.' || element.importePendienteFormat[0] == ','){
                  element.importePendienteFormat = "0".concat(element.importePendienteFormat)
                }
              }else{
                element.importePendienteFormat = 0;
              }
            });
            
            this.body = JSON.parse(JSON.stringify(datos));
            this.bodyAux=JSON.parse(JSON.stringify(datos));
          }
        },	  
        err => {
          this.progressSpinner = false;
          console.log(err);
        }
      );
    }
  }

  seleccionaFila(evento){
    if(undefined!=evento.data.idConcepto && undefined!=evento.data.idGrupo && this.idEstadoFacturacion=='10' && !this.selectMultiple){
      this.body.forEach(element => {
        element.editable = false;
        
        if(undefined==this.idConceptoOld){
          this.idConceptoOld=evento.data.idConcepto;
        }

        if(undefined==this.idGrupoOld){
          this.idGrupoOld=evento.data.idGrupo;
        }
      });

      this.numSelected = evento.length;
      this.seleccion = true;
      this.modificaConcepto=true;
      evento.data.editable=true;
    }
  }

  disabled(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      return false;
    }else{
      return true;
    }
  }

  eliminar(){
    if(!this.cerrada && undefined!=this.selectedDatos){      
      this.callServiceEliminar();
    }
  }

  callServiceEliminar(){
    this.progressSpinner=true;

    if(undefined!=this.selectedDatos && this.selectedDatos.length>0){
      this.sigaService.post("facturacionsjcs_deleteConceptosFac", this.selectedDatos).subscribe(
        data => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;

          this.selectedDatos=[];
          this.selectMultiple=false;
          this.selectAll=false;
          this.idGrupo=undefined;
          this.idConcepto=undefined;
          this.cargaDatos();
          this.idConceptoOld=undefined;
          this.idGrupoOld=undefined;
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
  }

  disabledEliminar(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      if(!this.nuevoConcepto && !this.modificaConcepto && (this.selectMultiple || this.selectAll)){
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }

  restablecer(){
    this.body=JSON.parse(JSON.stringify(this.bodyAux));
    this.bodyUpdate=[];
    this.modificaConcepto=false;
    this.nuevoConcepto=false;
    this.idGrupo=undefined;
    this.idConcepto=undefined;
    this.idGrupoOld=undefined;
    this.idConceptoOld=undefined;

    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.buscadores = this.buscadores.map(it => it = "");
  }

  disabledRestablecer(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10' && (this.nuevoConcepto || this.modificaConcepto)){
      return false;
    }else{
      return true;
    }
  }

  guardar(){
    this.bodyUpdate = {
      idConcepto: undefined,
      idGrupo: undefined,
      importeTotal: undefined,
      importePendiente: undefined,
      idFacturacion: undefined,
      idConceptoOld: undefined,
      idGrupoOld: undefined
    };

    if(!this.cerrada && undefined!=this.idConcepto && undefined!=this.idGrupo){
      this.bodyUpdate.idConcepto=this.idConcepto;
      this.bodyUpdate.idGrupo=this.idGrupo;   
      this.bodyUpdate.idFacturacion=this.idFacturacion;   
      
      if(this.modificaConcepto){
        this.bodyUpdate.idConceptoOld=this.idConceptoOld;
        this.bodyUpdate.idGrupoOld=this.idGrupoOld;
        this.callServiceGuardar("facturacionsjcs_updateConceptosFac");
      }else{
        this.callServiceGuardar("facturacionsjcs_saveConceptosFac");
      }
    }
  }

  callServiceGuardar(url){
    this.progressSpinner=true;

    this.sigaService.post(url, this.bodyUpdate).subscribe(
      data => {
        this.body.push(this.bodyUpdate);

        this.bodyAux=JSON.parse(JSON.stringify(this.body));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;

        this.bodyUpdate=[];
        this.modificaConcepto=false;
        this.nuevoConcepto=false;
        this.idGrupo=undefined;
        this.idConcepto=undefined;
        this.cargaDatos();
        this.idConceptoOld=undefined;
        this.idGrupoOld=undefined;
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

  disabledGuardar(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10' && (this.nuevoConcepto || this.modificaConcepto)){
      if(undefined!=this.idConcepto && undefined!=this.idGrupo){
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }

  nuevo(){
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.nuevoConcepto = true;

    if (undefined==this.body || null==this.body || this.body.length<1) {
      this.body = [];
    }else{
      this.body.forEach(element => {
        element.editable = false;
      });
    }

    let concepto = {
      idConcepto: undefined,
      idGrupo: undefined,
      importeTotal: "0",
      importePendiente: "0",
      editable: true,
      idConceptoOld: undefined,
      idGrupoOld: undefined
    };

    if (this.body.length == 0) {
      this.body.push(concepto);
    } else {
      this.body = [concepto, ...this.body];
    }
  }

  disabledNuevo(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      if(this.nuevoConcepto || this.modificaConcepto || this.selectMultiple || this.selectAll){
        return true;
      }else{
        return false;
      }
    }else{
      return true;
    }
  }

  changeCombo(dato) {
    if (undefined!= dato.idConcepto && null!=dato.idConcepto){
      this.idConcepto=dato.idConcepto;
    }
    
    if (undefined!=dato.idGrupo && null!=dato.idGrupo){
      this.idGrupo=dato.idGrupo;
    }
  }

  onHideDatosGenerales() {
    this.showFichaConceptos = !this.showFichaConceptos;
    
    if (undefined != this.persistenceService.getPermisos()) {
			this.permisos = this.persistenceService.getPermisos();
		}
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
  }

  onChangeSelectAll() {
    if (this.selectAll === true && !this.modificaConcepto && !this.nuevoConcepto) {
      this.selectMultiple = false;
      this.selectedDatos = this.body;
      this.numSelected = this.body.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    if (this.permisos && !this.disabled() && !this.modificaConcepto && !this.nuevoConcepto) {
      this.selectMultiple = !this.selectMultiple;
      
      if (!this.selectMultiple) {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode="single";
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectionMode="multiple";
      }
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

  setItalic(dato) {
    if (dato.fechabaja == null) return false;
    else return true;
  }

  getCols() {
    this.cols = [
      { field: "descConcepto", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
      { field: "descGrupo", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.grupoTurnos" },
      { field: "importeTotal", header: "facturacionSJCS.facturacionesYPagos.importe" },
      { field: "importePendiente", header: "facturacionSJCS.facturacionesYPagos.importePendiente" }
    ];

    this.cols.forEach(it => this.buscadores.push(""));
    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];
  }
}
