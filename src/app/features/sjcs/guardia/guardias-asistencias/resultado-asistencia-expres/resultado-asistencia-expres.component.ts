import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { Cell, Row, RowGroup } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';
import { TablaResultadoDesplegableComponent } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable.component';
import { TranslateService } from '../../../../../commons/translate';
import { FiltroAsistenciaItem } from '../../../../../models/guardia/FiltroAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import * as moment from 'moment';

@Component({
  selector: 'app-resultado-asistencia-expres',
  templateUrl: './resultado-asistencia-expres.component.html',
  styleUrls: ['./resultado-asistencia-expres.component.scss']
})
export class ResultadoAsistenciaExpresComponent implements OnInit, AfterViewInit {
  msgs: Message[] = [];
  @Input() rowGroups: RowGroup[];
  @Input() rowGroupsAux: RowGroup[];
  @Input() initialRowGroups: RowGroup[];
  @Input() comboComisarias = [];
  @Input() comboDelitos = [];
  @Input() comboJuzgadosAE = [];
  @Input() comboSexo = [];
  @Input() filtro : FiltroAsistenciaItem;
  @Output() saveTableData = new EventEmitter<RowGroup[]>();
  @Output() checkSustitutoCheckBox = new EventEmitter();
  @Output() search = new EventEmitter<boolean>();
  @Output() refreshInitialRowGroup = new EventEmitter<boolean>();
  showDatos: boolean = false;
  modoBusqueda: string = 'b';
  modoBusquedaB: boolean = true;
  selectAll = false;
  isDisabled = true;
  selectMultiple = false;
  titulo = "Asistencias";
  pantalla = 'AE';
  isLetrado : boolean = false;
  fechaJustificacion;
  cabeceras = [];
  seleccionarTodo = false;
  resultModified;
  permisoEscrituraAE : boolean = false;
  disableCrearEJG : boolean = false;
  textoComActivo: string = '[Com] / Juz';
  textoJuzActivo: string = 'Com / [Juz]';
  @ViewChild(TablaResultadoDesplegableComponent) tabla : TablaResultadoDesplegableComponent;
  constructor(private sigaStorageService: SigaStorageService,
    private datepipe: DatePipe,
    private commonServices : CommonsService,
    private persistenceService : PersistenceService,
    private translateService : TranslateService,
    private router: Router,) { }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.commonServices.scrollTablaFoco('tablaFoco2');
    }, 5);
  }

  ngOnInit(): void {
    //this.rowGroups = this.trdService.getTableData(this.resultModified);
    //this.rowGroupsAux = this.trdService.getTableData(this.resultModified);
    this.isLetrado = this.sigaStorageService.isLetrado;
    this.fechaJustificacion = this.datepipe.transform(new Date(), 'dd/MM/yyyy');

    this.commonServices.checkAcceso(procesos_guardia.asistencias_express)
    .then(respuesta => {

      this.permisoEscrituraAE = respuesta;

      this.persistenceService.setPermisos(this.permisoEscrituraAE);

       if (this.permisoEscrituraAE == undefined) {
         sessionStorage.setItem("codError", "403");
         sessionStorage.setItem(
           "descError",
           this.translateService.instant("generico.error.permiso.denegado")
         );
         this.router.navigate(["/errorAcceso"]);
       }

    }).catch(error => console.error(error));

    this.cabeceras = [
      {
        id: "asistencia",
        name: this.translateService.instant("formacion.busquedaInscripcion.asistencia"),
        size: 100
      },
      {
        id: "idApNombreSexo",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceraasistido") + " (*)",
        size: 545.5
      },
      {
        id: "delitosYobservaciones",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceradelitosobservaciones"),
        size: 225.75
      },
      {
        id: "ejg",
        name: "EJG",
        size: 100
      },
      {
        id: "actuacion",
        name: this.translateService.instant("dato.jgr.guardia.saltcomp.fecha") + " (*)",
        size: 200
      },
      {
        id: "lugar",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceracomisariajuzgado"),
        size: 400
      },
      {
        id: "diligencia",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceradiligencia"),
        size: 150
      }
    ];
  }

  ngOnChanges() {
    if (this.tabla.selectedArray.length == 1) {
      this.isDisabled = false;
      this.disableCrearEJG = false;
    } else {
      this.isDisabled = true;
      this.disableCrearEJG = true;
    }
    // si no hay registros añadir nueva asistencia
    if ( this.rowGroups.length === 0 && this.comboComisarias.length > 0 &&  this.comboJuzgadosAE.length > 0){
      this.nuevaAsistencia();
    }
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if ((this.seleccionarTodo || event) && this.permisoEscrituraAE) {
      this.isDisabled = false;
      let rowInfoAsistencia : RowGroup = this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[this.tabla.selectedArray.length-1])
      if((rowInfoAsistencia && rowInfoAsistencia.rows &&
        rowInfoAsistencia.rows[0].cells[2].value) || !rowInfoAsistencia){
        this.disableCrearEJG = true;
      }else{
        this.disableCrearEJG = false;
      }
    } else {
      if (this.tabla.selectedArray.length == 1) {
        this.isDisabled = false;
        this.disableCrearEJG = false;
      } else {
        this.isDisabled = true;
        this.disableCrearEJG = true;
      }
    }

    if (this.tabla.selectedArray.length != 1) {
      this.isDisabled = true;
      this.disableCrearEJG = true;
    }
    
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  nuevaAsistencia(){

    let rowGroup : RowGroup = new RowGroup();
    let row1 : Row = new Row();
    let row2 : Row = new Row();
    let cellAsistido : Cell = new Cell();
    let cellDelitosObservaciones : Cell = new Cell();
    let cellEJG : Cell = new Cell();
    let cellFechaActuacion : Cell = new Cell();
    let cellLugar : Cell = new Cell();
    let cellNDiligencia: Cell = new Cell();
    let cellAsistido2 : Cell = new Cell();
    let cellDelitosObservaciones2 : Cell = new Cell();
    let cellEJG2 : Cell = new Cell();
    let cellFechaActuacion2 : Cell = new Cell();
    let cellLugar2 : Cell = new Cell();
    let cellNDiligencia2: Cell = new Cell();
    
    // datos asistencía
    cellAsistido.type = '6InputSelector';
    cellAsistido.value = ['','','','','',''];
    cellAsistido.combo = this.comboSexo;
    cellAsistido.size = 545.5;

    cellDelitosObservaciones.type = '2SelectorInput';
    cellDelitosObservaciones.value = ['',''];
    cellDelitosObservaciones.combo = this.comboDelitos;
    cellDelitosObservaciones.size = 225.75;

    cellEJG.type = 'text';
    cellEJG.value = '';
    cellEJG.size = 100;

    cellFechaActuacion.type = 'dateAndTime';
    cellFechaActuacion.value = [ this.fechaFormateada(this.filtro.diaGuardia), '00:00'];
    cellFechaActuacion.size = 200;

    cellLugar.type = 'ComJuzSelect';
    cellLugar.value = [this.comboComisarias, this.comboJuzgadosAE
                        , '' // valor comisaria
                        , '' // valor juzgado
                        , 'CJ' // indica que se seleccionan la comisaria y juzgado
                        , 'Asistencia' // indica si que es una asistencia y no una actuación
                        , 'S' // Indica que la asistencia es nueva, se utiliza al guardar por primera vez la asistencia
                      ];
    cellLugar.size = 400;

    cellNDiligencia.type = '2input';
    cellNDiligencia.value = ['', ''];
    cellNDiligencia.size = 150;

    // datos asistencia
    cellAsistido2.type = 'invisible';
    cellAsistido2.value = '';
    cellAsistido2.combo = this.comboSexo;
    cellAsistido2.size = 545.5;

    cellDelitosObservaciones2.type = 'invisible';
    cellDelitosObservaciones2.value = '';
    cellDelitosObservaciones2.combo = this.comboDelitos;
    cellDelitosObservaciones2.size = 225.75;

    cellEJG2.type = 'invisible';
    cellEJG2.value = '';
    cellEJG2.size= 100;

    cellFechaActuacion2.type = 'dateAndTime';
    cellFechaActuacion2.value = [ this.fechaFormateada(this.filtro.diaGuardia), '00:00'];
    cellFechaActuacion2.showTime = true;
    cellFechaActuacion2.size = 200;

    cellLugar2.type = 'ComJuzSelect';
    cellLugar2.value = [this.comboComisarias, this.comboJuzgadosAE
                        , '' // valor comisaria
                        , '' // valor juzgado
                        , 'C' // se seleciona comisaría solo
                      ];
    cellLugar2.size = 400;
    
    cellNDiligencia2.type = '2input';
    cellNDiligencia2.value = [''];
    cellNDiligencia2.size = 150;

    row1.cells = [cellAsistido, cellDelitosObservaciones, cellEJG, cellFechaActuacion, cellLugar, cellNDiligencia];
    row2.cells = [cellAsistido2, cellDelitosObservaciones2, cellEJG2, cellFechaActuacion2, cellLugar2, cellNDiligencia2];
    row1.position = 'collapse';
    row2.position = 'collapse';
    rowGroup.rows = [row1, row2];
    rowGroup.id = '';
    if(this.rowGroups){
      this.rowGroups.unshift(rowGroup);
      this.tabla.totalRegistros = this.rowGroups.length;
    }
  }

  guardarFiltroAE(){
    sessionStorage.setItem("filtroAsistenciaExpres", JSON.stringify(this.filtro));
  }

  nuevaActuacion(){

    if(this.tabla.selectedArray.length != 0){
      let rowToAdd : Row = new Row(); //Continuar y crear fila, despues añadirla al RowGroup y probar
      let cellAsistido : Cell = new Cell();
      let cellDelitosObservaciones : Cell = new Cell();
      let cellEJG : Cell = new Cell();
      let cellFechaActuacion : Cell = new Cell();
      let cellLugar : Cell = new Cell();
      let cellNDiligencia: Cell = new Cell();
      let rowGroup: RowGroup;
      cellAsistido.type = 'invisible';
      cellAsistido.value = '';
      cellAsistido.combo = this.comboSexo;
      cellAsistido.size = 545.5;

      cellDelitosObservaciones.type = 'invisible';
      cellDelitosObservaciones.value = '';
      cellDelitosObservaciones.combo = this.comboDelitos;
      cellDelitosObservaciones.size = 225.75;

      cellEJG.type = 'invisible';
      cellEJG.value = '';
      cellEJG.size = 100;

      cellFechaActuacion.type = 'dateAndTime';
      cellFechaActuacion.value = [ this.fechaFormateada(this.filtro.diaGuardia), '00:00'];
      cellFechaActuacion.showTime = true;
      cellFechaActuacion.size = 200;

      cellLugar.type = 'ComJuzSelect';
      cellLugar.value = [this.comboComisarias, this.comboJuzgadosAE
                          ,'' // valor comisaria
                          ,'' // valor juzgado
                          ,'C' // indica que se seleciona la comisaría
                          , 'Actuacion' // indica que es una actuación
                        ];
      cellLugar.size = 400;
      
      cellNDiligencia.type = '2input';
      cellNDiligencia.value = ['', ''];
      cellNDiligencia.size = 150;
      //Si es un RowGroup que puede estar colapsado lo comprobamos y si es asi la fila que añadimos tambien lo estara
      let index = this.rowGroups.findIndex(rowGroup => rowGroup.id == this.tabla.selectedArray[0]);
      if(this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows.length > 1
          && this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows[1].position == 'collapse'){
          this.tabla.nuevaActuacion = true;
          this.tabla.rowGroupArrowClick(this.tabla.rowGroupEl, this.tabla.selectedArray[0]);
          this.tabla.iconClickChange(this.tabla.rowGroupEl.toArray()[index].nativeElement.children[0].children[0].children[0],
                                      this.tabla.rowGroupEl.toArray()[index].nativeElement.children[0].children[0].children[1]);
      }
      rowToAdd.cells = [cellAsistido, cellDelitosObservaciones, cellEJG, cellFechaActuacion, cellLugar, cellNDiligencia];
      rowGroup =  this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]);

      this.copyValuesAsistenciaToActuacion(rowGroup, rowToAdd);
      rowGroup.rows.push(rowToAdd);
      this.tabla.totalRegistros = this.rowGroups.length;
    }

  }
  copyValuesAsistenciaToActuacion(rowGroup: RowGroup, rowAtuacion : Row){
    // copia los valores de la celdas de lugar y Número Diligencia/Procedimiento
    let cellLugar, CellNumDilProc: Cell;
    let comisaria, juzgado, numDili, NumProce;
    if (rowGroup.rows.length > 1){
      cellLugar = rowGroup.rows[0].cells[4]
      CellNumDilProc = rowGroup.rows[0].cells[5]

      comisaria = cellLugar.value[2];
      juzgado = cellLugar.value[3];
      numDili = CellNumDilProc.value[0];
      NumProce = CellNumDilProc.value[1];

      if (juzgado != null && juzgado!=''){
        rowAtuacion.cells[4].value[2]='';
        rowAtuacion.cells[4].value[3]=juzgado;
        rowAtuacion.cells[4].value[4]='J';

        rowAtuacion.cells[5].value[0]=''
        rowAtuacion.cells[5].value[1]=NumProce

      }else if (comisaria != null && comisaria!= ''){
        rowAtuacion.cells[4].value[2]=comisaria;
        rowAtuacion.cells[4].value[3]='';
        rowAtuacion.cells[4].value[4]='C';

        rowAtuacion.cells[5].value[0]=numDili
        rowAtuacion.cells[5].value[1]=''
      }
    }
  }
  crearEJG(){
    if(this.filtro && this.tabla.selectedArray.length>0){
      let asistencia : TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
      let idAsistencia : string = this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[this.tabla.selectedArray.length-1]).id;
      idAsistencia = idAsistencia.substring(1);
      asistencia.anioNumero = idAsistencia;
      asistencia.fechaAsistencia = this.filtro.diaGuardia + ' 00:00';
      sessionStorage.setItem("asistencia", JSON.stringify(asistencia));
      sessionStorage.setItem("modoBusqueda","b");
      sessionStorage.setItem("filtroAsistencia", JSON.stringify(this.filtro));
      sessionStorage.setItem("Nuevo","true");
      // Necesario ya que si el servicio de persistencia tiene datos, se cargará un EJG anterior
      this.persistenceService.setDatos(null);
      this.persistenceService.clearDatosEJG();
      this.router.navigate(["/gestionEjg"]);
    }else{
      this.showMsg('error', 'Error. Debe seleccionar un registro para poder crear un EJG' ,'')
    }
  }

  guardar(){
    let rowGroupsToUpdate : RowGroup[] = [];
    if(this.fechaJustificacion != "" && this.fechaJustificacion != null){
      if (this.compruebaCamposObligatorios()) {
        this.showMsg('error',this.translateService.instant("formacion.mensaje.general.mensaje.error"), this.translateService.instant("general.message.camposObligatorios"));
      } else if (this.tabla.rowIdsToUpdate && this.tabla.rowIdsToUpdate.length != 0) {

      let rowIdsToUpdateNOT_REPEATED = new Set(this.tabla.rowIdsToUpdate);
      this.tabla.rowIdsToUpdate = Array.from(rowIdsToUpdateNOT_REPEATED);
      this.rowGroups.forEach(rowGroup => {

        if(this.tabla.rowIdsToUpdate.includes(rowGroup.id)){
          rowGroupsToUpdate.push(rowGroup);
        }

        rowGroup.rows[1].cells[3] = rowGroup.rows[0].cells[3];
        this.copyValuesAsistenciaToActuacion(rowGroup, rowGroup.rows[1]);
      });

      if (this.filtro.isSustituto != null) {
        if (this.filtro.idLetradoManual != null) {
          this.checkSustitutoCheckBox.emit();
          //controlar fecha con el instance of date y setearla "bonita"
          let fechaPlana;
          rowGroupsToUpdate.forEach(rowGroupTU => {
            if(!(rowGroupTU.rows[0].cells[3].value[0] instanceof Date)){
              if(rowGroupTU.rows[0].cells[3].value[0] != undefined) {
                fechaPlana = rowGroupTU.rows[0].cells[3].value[0].target.value;
              } else{
                fechaPlana = rowGroupTU.rows[0].cells[3].value[0];
              }
              rowGroupTU.rows[0].cells[3].value[0] = moment(fechaPlana, 'DD/MM/YYYY').toDate();
            } 
            
            if(!(rowGroupTU.rows[1].cells[3].value[0] instanceof Date)){
              if(rowGroupTU.rows[1].cells[3].value[0] != undefined ) {
                fechaPlana = rowGroupTU.rows[1].cells[3].value[0].target.value;
              } else{
                fechaPlana = rowGroupTU.rows[1].cells[3].value[0];
              }
              rowGroupTU.rows[1].cells[3].value[0] = moment(fechaPlana, 'DD/MM/YYYY').toDate();
            }
          });
          sessionStorage.setItem("asistenciasGuardar", JSON.stringify(rowGroupsToUpdate));
        } else {
          this.showMsg('error', 'Debe seleccionar un colegiado para realizar el refuerzo/sustitución' ,'')
        }
        
      } else {
        this.saveTableData.emit(rowGroupsToUpdate);
      }
    } else {
      this.showMsg('warn',this.translateService.instant("formacion.mensaje.general.mensaje.warn"), this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.realizarModificacion"));
    }
    this.tabla.rowIdsToUpdate = [];
    } else {
      
      this.showMsg('error', this.translateService.instant("sjcs.asistenciaexpres.asignarfechavalidacion") ,'');
    }
  }

  compruebaCamposObligatorios() {
    let error = false;

    this.rowGroups.forEach(rowGroup => {

      rowGroup.rows.forEach((row, index) => {

        if (index != 1) {
          row.cells.forEach(cell => {
            
            if (cell.type == '5InputSelector' || cell.type == '6InputSelector' ) {

              cell.value.forEach((val, index) => {

                if ((val == undefined || val == '') && index != 2) {
                  error = true;
                  if(cell.value[0] == undefined || cell.value[0] == ""){
                    error = false;
                  }
                }
              });
            
            } else if (cell.type == 'actuacionSelect' || cell.type == 'asuntoSelect') {

              if (cell.value.length >= 3  ){
                let comisaria = cell.value[2];
                let juzgado = cell.value[3];
                // obligatorio tener soleccionado al menos uno
                if ((comisaria == undefined || comisaria == '') && (juzgado == undefined || juzgado == '') ) {
                  error = true;
                }
              }
            }
            else if (cell.type == 'a') {

            }
          });
        }
      });
    });

    return error;
  }

  fillFecha(event) {
    if(event){
      this.fechaJustificacion = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
    }else{
      this.fechaJustificacion = '';
    }
    
  }

  resetTable(){
    this.rowGroups = this.initialRowGroups;
    this.refreshInitialRowGroup.emit(true);
  }

  fechaFormateada(dateString) {
    var dateParts = dateString.split("/");
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    return dateObject;
  }
}
