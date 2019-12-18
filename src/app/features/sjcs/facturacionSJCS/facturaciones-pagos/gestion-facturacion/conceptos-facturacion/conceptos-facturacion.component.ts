import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { USER_VALIDATIONS } from '../../../../../../properties/val-properties';
import { SigaWrapper } from '../../../../../../wrapper/wrapper.class';
import { ComboItem } from '../../../../../../models/ComboItem';
import { FacturacionItem } from '../../../../../../models/sjcs/FacturacionItem';

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
  selectionMode: string = "single";

  body = [];
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

  seleccionaFila(evento) {
    if (evento != undefined) {
      this.numSelected = evento.length;
    }
  }

  nuevo(){
    this.tabla.sortOrder = 0;
    this.tabla.sortField = '';
    this.tabla.reset();
    this.nuevoConcepto = true;

    this.selectionMode = "single";

    if (undefined==this.body || null!=this.body || this.body.length<0) {
      this.body = [];
    }

    let concepto = {
      idConcepto: undefined,
      idGrupo: undefined,
      importeTotal: "0",
      importePendiente: "0",
      editable: true
    };

    if (this.body.length == 0) {
      this.body.push(concepto);
    } else {
      this.body = [concepto, ...this.body];
    }
  }

  disabled(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      return false;
    }else{
      return true;
    }
  }

  disabledEliminar(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      return false;
    }else{
      return true;
    }
  }

  disabledRestablecer(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      return false;
    }else{
      return true;
    }
  }

  disabledGuardar(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      return false;
    }else{
      return true;
    }
  }

  disabledNuevo(){
    if(this.modoEdicion && this.idEstadoFacturacion=='10'){
      return false;
    }else{
      return true;
    }
  }
  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
  }

  changeConcepto(dato) {
    /*let findDato = this.datosInicial.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

    if (findDato != undefined) {
      if (dato.idCosteFijo != findDato.idCosteFijo) {

        let findUpdate = this.updateCosteFijo.find(item => item.descripcion === dato.descripcion && item.tipoAsistencia === dato.tipoAsistencia && item.tipoActuacion === dato.tipoActuacion);

        if (findUpdate == undefined) {
          this.updateCosteFijo.push(dato);
        }
      }
    }*/
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
    //this.tabla.reset();
  }

  onChangeSelectAllCurriculares() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.body;
      this.numSelected = this.body.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    if (this.permisos && !this.disabled()) {
      this.selectMultiple = !this.selectMultiple;
      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectedDatos = [];
        this.numSelected = 0;
        this.selectAll = false;
      }
    }
    
    // this.volver();
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

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant("general.message.incorrect")
    });
  }
}
