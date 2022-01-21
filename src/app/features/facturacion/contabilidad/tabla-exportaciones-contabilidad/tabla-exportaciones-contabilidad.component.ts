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
import { truncate } from 'fs';


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
  @Input() disabledNuevo : boolean = false;
  @Input() enabledSave: boolean = false;
  editar:boolean = false;

  newRegister:FacRegistroFichContaItem = new FacRegistroFichContaItem();

  constructor(
    private persistenceService: PersistenceService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private datepipe: DatePipe,
    private commonsServices: CommonsService
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
  restablecer(){
    this.busqueda.emit()
  }

  getNewFacRegistroFichConta() {
    this.progressSpinner = true;
    this.newRegister = new FacRegistroFichContaItem();
    this.sigaServices.get("facturacionPyS_maxIdContabilidad").subscribe(
      n => {
        this.newRegister = n.facRegistroFichConta[0]
        this.new(this.newRegister);
        this.progressSpinner = false;
      },
      err => {
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

 
  //DATOS DE PRUEBA CON LA INSTITUCION 2011 YA QUE LA 2005 NO TIENE NINGUN DATO
  datosPrueba = [{"idContabilidad":219,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1392591600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1391554800000,"fechaExportacionHasta":1392505200000,"numAsientos":1567,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"219_17-02-2014.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":216,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1391468400000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1388703600000,"fechaExportacionHasta":1388876400000,"numAsientos":7722,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"216_04-02-2014.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":214,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1391468400000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1388962800000,"fechaExportacionHasta":1389049200000,"numAsientos":54,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"214_04-02-2014.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":213,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1391468400000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1388530800000,"fechaExportacionHasta":1388876400000,"numAsientos":18069,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"213_04-02-2014.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":212,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1391468400000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1391209200000,"fechaExportacionHasta":1391382000000,"numAsientos":34,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"212_04-02-2014.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":209,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1386802800000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1385852400000,"fechaExportacionHasta":1386284400000,"numAsientos":10367,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"209_12-12-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":206,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1384470000000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1383260400000,"fechaExportacionHasta":1384038000000,"numAsientos":10202,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"206_15-11-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":204,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1384124400000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1380664800000,"fechaExportacionHasta":1380664800000,"numAsientos":7352,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"204_11-11-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":200,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1382392800000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1380578400000,"fechaExportacionHasta":1381788000000,"numAsientos":19265,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"200_22-10-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":198,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1381183200000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1377986400000,"fechaExportacionHasta":1379196000000,"numAsientos":9910,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"198_08-10-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":197,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1379541600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1375740000000,"fechaExportacionHasta":1377900000000,"numAsientos":268,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"197_19-09-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":196,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1376949600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1375308000000,"fechaExportacionHasta":1375653600000,"numAsientos":9815,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"196_20-08-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":194,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1374703200000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1372629600000,"fechaExportacionHasta":1373839200000,"numAsientos":18795,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"194_25-07-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":193,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1372802400000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1371333600000,"fechaExportacionHasta":1372543200000,"numAsientos":50,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"193_03-07-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":191,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1370469600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1368655200000,"fechaExportacionHasta":1369951200000,"numAsientos":209,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"191_06-06-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":190,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1370469600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1367359200000,"fechaExportacionHasta":1368568800000,"numAsientos":10086,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"190_06-06-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":189,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1368136800000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1366063200000,"fechaExportacionHasta":1367272800000,"numAsientos":81,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"189_10-05-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":187,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1366236000000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1364767200000,"fechaExportacionHasta":1365976800000,"numAsientos":18529,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"187_18-04-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":183,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1360105200000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1358290800000,"fechaExportacionHasta":1359586800000,"numAsientos":1680,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"183_06-02-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":182,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1360105200000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1356994800000,"fechaExportacionHasta":1358204400000,"numAsientos":16914,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"182_06-02-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":181,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1357167600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1355180400000,"fechaExportacionHasta":1356908400000,"numAsientos":193,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"181_03-01-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null},{"idContabilidad":180,"idContabilidadDesde":0,"idContabilidadHasta":0,"fechaCreacion":1357167600000,"fechaCreacionDesde":null,"fechaCreacionHasta":null,"fechaExportacionDesde":1354316400000,"fechaExportacionHasta":1355094000000,"numAsientos":9607,"numAsientosDesde":0,"numAsientosHasta":0,"fechaModificacion":null,"nombreFichero":"180_03-01-2013.xls","estado":3,"nombreEstado":"FINALIZADO","nuevo":false,"fechabaja":null}];
  
  new(idNew:FacRegistroFichContaItem){
    this.disabledNuevo = true;
    this.enabledSave = true;
    this.editar = true;
    idNew.fechaCreacion = this.transformDate(new Date());
    idNew.nuevo = true;
    idNew.nombreFichero = this.nombreFichero();

    //Fecha desde: en caso de registro nuevo, será un selector de fecha obligatorio, que por defecto se cargará 
    //con la siguiente fecha a la última “fecha hasta” exportada que no esté de baja.
    let ultimaFechaHasta: Date;
    this.datos.forEach(registro =>{
      if(registro.fechaBaja != null){
        if(ultimaFechaHasta < registro.fechaExportacionHasta){
          ultimaFechaHasta = registro.fechaExportacionHasta;
        }
      }
    })

    //Añadir 1 dia a la ultima fecha hasta exportada.(Si no hay ninguna exportacion anterior se establece al dia de hoy)
    if(!this.checkCampoEsVacio(ultimaFechaHasta)){
      idNew.fechaExportacionDesde.setDate(ultimaFechaHasta.getDate() + 1);
    }else{
      idNew.fechaExportacionDesde = new Date();
    }

    this.datos.unshift(idNew);
   
  }

  checkCampoEsVacio(campo){
    if(campo != "" && campo != null && campo != undefined){
      return false;
    }else{
      return true;
    }
  }

  checkObligatorios(){
    if(this.datos[0].nuevo == true && !this.checkCampoEsVacio(this.datos[0].nombreFichero) && !this.checkCampoEsVacio(this.datos[0].fechaExportacionDesde)){
      this.guardar();
    }else{
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    }
  }

  styleObligatorio(campo){
    return this.commonsServices.styleObligatorio(campo);
  }

  guardar(){
    this.disabledNuevo = false;
    this.enabledSave = false;
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_guardarRegistroFichConta", this.newRegister).subscribe(
      n => {
        if(n.status == 200)
          this.showMessage("error", this.translateService.instant("general.message.correct"), this.translateService.instant("Actualizado Correctamente"));
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

}