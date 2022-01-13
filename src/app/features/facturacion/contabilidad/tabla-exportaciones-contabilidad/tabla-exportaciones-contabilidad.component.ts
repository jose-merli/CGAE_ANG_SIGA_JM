import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FacRegistroFichContaItem } from '../../../../models/FacRegistroFichContaItem';
import { Router } from '@angular/router';
import { DataTable, Message } from 'primeng/primeng';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { DatePipe } from '@angular/common';
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from '../../../../_services/siga.service';
import { Console } from 'console';


@Component({
  selector: 'app-tabla-exportaciones-contabilidad',
  templateUrl: './tabla-exportaciones-contabilidad.component.html',
  styleUrls: ['./tabla-exportaciones-contabilidad.component.scss'],

})
export class TablaExportacionesContabilidadComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  permisoEscritura: boolean = true;

  //Resultados de la busqueda
  @Input() datos: FacRegistroFichContaItem[];
  @Input() filtro;
  @Output() busqueda = new EventEmitter<boolean>();
  
  // Elementos para la tabla
  @ViewChild("table") table: DataTable;
  rowsPerPage = [];
  selectedItem: number = 10;
  selectedDatos = [];
  cols = [];
  buscadores = [];
  selectAll: boolean;
  selectMultiple: boolean;
  disabledNuevo : boolean = false;
  enabledSave:boolean = false;
  editar:boolean = false;

  newRegister:FacRegistroFichContaItem = new FacRegistroFichContaItem();

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe
  ) { }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.getCols();
  }

  // Se actualiza cada vez que cambien los inputs
  ngOnChanges() {
    this.selectedDatos = [];
    console.log("CA")
  }

  // Definición de las columnas
  getCols() {
    this.cols = [
      { field: "idContabilidad", header: this.translateService.instant("justiciaGratuita.oficio.designas.contrarios.identificador"), width: "10%" },
      { field: "fechaCreacion", header: this.translateService.instant("informesycomunicaciones.enviosMasivos.fechaCreacion"), width: "10%" },
      { field: "nombreFichero", header: this.translateService.instant("censo.cargaMasivaDatosCurriculares.literal.nombreFichero"), width: "40%" },
      { field: "fechaExportacionDesde", header: this.translateService.instant("administracion.auditoriaUsuarios.fechaDesde"), width: "10%" }, 
      { field: "fechaExportacionHasta", header: this.translateService.instant("administracion.auditoriaUsuarios.fechaHasta"), width: "10%" },
      { field: "numAsientos", header: this.translateService.instant("facturacion.contabilidad.tabla.numAsientos"), width: "10%" }, 
      { field: "nombreEstado", header: this.translateService.instant("censo.fichaIntegrantes.literal.estado"), width: "10%" }, 
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
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 30,
        value: 30
      },
    ];
  }

  // Abrir ficha de fichero de devoluciones
  openTab(dato) {


  }

  // Resultados por página
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // Checkbox de seleccionar todo
  onChangeSelectAll(): void {
      if (this.selectAll) {
        this.selectMultiple = true;
        this.selectedDatos = this.datos;
      } else {
        this.selectedDatos = [];
        this.selectMultiple = false;
      }
  }

  fillFechaNew(event, campo) {
     if(campo === 'exportacionDesde')
        this.newRegister.fechaExportacionDesde = event;
    else if(campo === ' exportacionHasta')
       this.newRegister.fechaExportacionHasta = event;
}

  // FUnciones de utilidad

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
  confirmDescargar(){

  }

  new(idNew:FacRegistroFichContaItem){
    console.log(this.selectedDatos)
    this.disabledNuevo = true;
    this.enabledSave = true;
    this.editar = true;
    idNew.fechaCreacion = this.transformDate(new Date());
    idNew.nuevo = true;
    idNew.nombreFichero = this.nombreFichero()
    this.datos.unshift(idNew)
   
  }

  guardar(){
    this.disabledNuevo = false;
    this.enabledSave = false;
    this.progressSpinner = true;


    this.sigaServices.post("facturacionPyS_guardarRegistroFichConta", this.newRegister).subscribe(
      n => {
        if(n.status == 200)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("Actualizado Correctamente"));
        if(n.status == 400)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));

        this.progressSpinner = false;

      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);
      }
    );
    
  
  }

  descargar(){

  }

  getNewFacRegistroFichConta() {
    this.progressSpinner = true;
    this.newRegister = new FacRegistroFichContaItem();
    this.sigaServices.get("facturacionPyS_maxIdContabilidad").subscribe(
      n => {
        console.log(n)
       this.newRegister = n.facRegistroFichConta[0]
        this.new(this.newRegister);
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

   transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  nombreFichero(){
    let name = "";
    name += this.newRegister.idContabilidad.toString() + "_";
    name += this.datepipe.transform(new Date(), 'dd-MM-yyyy');
    name += ".xls"
    return name
  }

}