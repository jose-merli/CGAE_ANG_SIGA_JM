import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { Cell, Row, RowGroup } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable-ae.service';
import { TablaResultadoDesplegableComponent } from '../../../../../commons/tabla-resultado-desplegable/tabla-resultado-desplegable.component';
import { TranslateService } from '../../../../../commons/translate';
import { procesos_guardia } from '../../../../../permisos/procesos_guarida';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';

@Component({
  selector: 'app-resultado-asistencia-expres',
  templateUrl: './resultado-asistencia-expres.component.html',
  styleUrls: ['./resultado-asistencia-expres.component.scss']
})
export class ResultadoAsistenciaExpresComponent implements OnInit {
  msgs: Message[] = [];
  @Input() rowGroups: RowGroup[];
  @Input() rowGroupsAux: RowGroup[];
  @Input() initialRowGroups: RowGroup[];
  @Input() comboComisarias = [];
  @Input() comboDelitos = [];
  @Input() comboJuzgadosAE = [];
  @Input() comboSexo = [];
  @Output() saveTableData = new EventEmitter<RowGroup[]>();
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
  @ViewChild(TablaResultadoDesplegableComponent) tabla;
  constructor(private sigaStorageService: SigaStorageService,
    private datepipe: DatePipe,
    private commonServices : CommonsService,
    private persistenceService : PersistenceService,
    private translateService : TranslateService,
    private router: Router) { }

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
        name: this.translateService.instant("formacion.busquedaInscripcion.asistencia")
      },
      {
        id: "idApNombreSexo",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceraasistido")
      },
      {
        id: "delitosYobservaciones",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceradelitosobservaciones")
      },
      {
        id: "ejg",
        name: "EJG"
      },
      {
        id: "actuacion",
        name: this.translateService.instant("justiciaGratuita.oficio.designas.actuaciones.fechaActuacion")
      },
      {
        id: "lugar",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceralugar")
      },
      {
        id: "diligencia",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceradiligencia")
      }
    ];
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if ((this.seleccionarTodo || event) && this.permisoEscrituraAE) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
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
    
    cellAsistido.type = '5InputSelector';
    cellAsistido.value = ['','','','',''];
    cellAsistido.combo = this.comboSexo;
    cellAsistido.size = 445.5;

    cellDelitosObservaciones.type = '2SelectorInput';
    cellDelitosObservaciones.value = ['',''];
    cellDelitosObservaciones.combo = this.comboDelitos;
    cellAsistido.size = 225.75;

    cellEJG.type = 'text';
    cellEJG.value = '';
    cellEJG.size = 225.75;

    cellFechaActuacion.type = 'datePicker';
    cellFechaActuacion.value = '';
    cellFechaActuacion.showTime = true;
    cellFechaActuacion.size = 225.75;

    cellLugar.type = 'buttomSelect';
    cellLugar.value = ['C / J',this.comboComisarias, this.comboJuzgadosAE
                        , 'C'
                        ,''
                      ];
    cellLugar.size = 225.75;

    cellNDiligencia.type = 'input';
    cellNDiligencia.value = '';
    cellNDiligencia.size = 225.75;

    cellAsistido2.type = 'invisible';
    cellAsistido2.value = '';
    cellAsistido2.combo = this.comboSexo;
    cellAsistido2.size = 445.5;

    cellDelitosObservaciones2.type = 'invisible';
    cellDelitosObservaciones2.value = '';
    cellDelitosObservaciones2.combo = this.comboDelitos;
    cellDelitosObservaciones2.size = 225.75;

    cellEJG2.type = 'invisible';
    cellEJG2.value = '';
    cellEJG2.size= 225.75;

    cellFechaActuacion2.type = 'datePicker';
    cellFechaActuacion2.value = '';
    cellFechaActuacion2.showTime = true;
    cellFechaActuacion2.size = 225.75;

    cellLugar2.type = 'buttomSelect';
    cellLugar2.value = ['C / J',this.comboComisarias, this.comboJuzgadosAE
                        , 'C'
                        ,''
                      ];
    cellLugar2.size = 225.75;
    
    cellNDiligencia2.type = 'input';
    cellNDiligencia2.value = '';
    cellNDiligencia2.size = 225.75;

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

  nuevaActuacion(){

    if(this.tabla.selectedArray.length != 0){
      let rowInfoAsistencia = this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows[0];
      let rowToAdd : Row = new Row(); //Continuar y crear fila, despues añadirla al RowGroup y probar
      let cellAsistido : Cell = new Cell();
      let cellDelitosObservaciones : Cell = new Cell();
      let cellEJG : Cell = new Cell();
      let cellFechaActuacion : Cell = new Cell();
      let cellLugar : Cell = new Cell();
      let cellNDiligencia: Cell = new Cell();
      cellAsistido.type = 'invisible';
      cellAsistido.value = '';
      cellAsistido.combo = this.comboSexo;
      cellAsistido.size = 445.5;

      cellDelitosObservaciones.type = 'invisible';
      cellDelitosObservaciones.value = '';
      cellDelitosObservaciones.combo = this.comboDelitos;
      cellDelitosObservaciones.size = 225.75;

      cellEJG.type = 'invisible';
      cellEJG.value = '';
      cellEJG.size = 225.75;

      cellFechaActuacion.type = 'datePicker';
      cellFechaActuacion.value = '';
      cellFechaActuacion.showTime = true;
      cellFechaActuacion.size = 225.75;

      cellLugar.type = 'buttomSelect';
      cellLugar.value = ['C / J', this.comboComisarias, this.comboJuzgadosAE
                          , 'C'
                          ,''
                        ];
      cellLugar.size = 225.75;
      
      cellNDiligencia.type = 'input';
      cellNDiligencia.value = '';
      cellNDiligencia.size = 225.75;
      //Si es un RowGroup que puede estar colapsado lo comprobamos y si es asi la fila que añadimos tambien lo estara
      /*if(this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows.length > 1
          && this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows[1].position == 'collapse'){
        rowToAdd.position = 'collapse';
      }*/
      rowToAdd.cells = [cellAsistido, cellDelitosObservaciones, cellEJG, cellFechaActuacion, cellLugar, cellNDiligencia];
      //this.tabla.rowGroupArrowClick(this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]), this.tabla.selectedArray[0], true);
      this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows.push(rowToAdd);
      this.tabla.totalRegistros = this.rowGroups.length;
    }

  }
  guardar(){

    let rowGroupsToUpdate : RowGroup[] = [];

    if(this.tabla.rowIdsToUpdate && this.tabla.rowIdsToUpdate.length != 0){

      let rowIdsToUpdateNOT_REPEATED = new Set(this.tabla.rowIdsToUpdate);
      this.tabla.rowIdsToUpdate = Array.from(rowIdsToUpdateNOT_REPEATED);
      this.rowGroups.forEach(rowGroup => {

        if(this.tabla.rowIdsToUpdate.includes(rowGroup.id)){
          rowGroupsToUpdate.push(rowGroup);
        }
      });

      this.saveTableData.emit(rowGroupsToUpdate);
    }

    this.tabla.rowIdsToUpdate = [];
  }

  fillFecha(event) {

    this.fechaJustificacion = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
    
  }

  resetTable(){
    this.rowGroups = this.initialRowGroups;
    this.refreshInitialRowGroup.emit(true);
  }
}
