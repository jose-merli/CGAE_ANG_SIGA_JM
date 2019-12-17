import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { USER_VALIDATIONS } from '../../../../../../properties/val-properties';
import { SigaWrapper } from '../../../../../../wrapper/wrapper.class';

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
  datos: any[] = [];
  selectAll: boolean = false;

  @Input() cerrada;
  @Input() idFacturacion;
  @Input() idEstadoFacturacion;
  @Input() modoEdicion;
  @Input() permisos;

  @ViewChild("table") tabla;
  
  constructor(private sigaService: SigaServices,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
		private persistenceService: PersistenceService) { 
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    this.progressSpinner = true;

    if(!this.modoEdicion){
      this.showFichaConceptos=false;
    }else{
      //this.cargarConceptos();
      //this.cargarGrupos()
      
      this.getCols();
    }
  }

  seleccionaFila(evento) {
    

  }

  nuevo(){

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
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
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
      { field: "conceptos", header: "facturacionSJCS.facturacionesYPagos.conceptos" },
      { field: "grupoTurnos", header: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.grupoTurnos" },
      { field: "importe", header: "facturacionSJCS.facturacionesYPagos.importe" },
      { field: "grupoTurnos", header: "facturacionSJCS.facturacionesYPagos.importePendiente" }
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
