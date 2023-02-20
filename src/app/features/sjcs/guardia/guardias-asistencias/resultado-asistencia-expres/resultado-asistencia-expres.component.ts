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
        size: 445.5
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
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceralugar"),
        size: 550
      },
      {
        id: "diligencia",
        name: this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.cabeceradiligencia"),
        size: 100
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
      let rowInfoAsistencia : RowGroup = this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[this.tabla.selectedArray.length-1])
      if((rowInfoAsistencia && rowInfoAsistencia.rows &&
        rowInfoAsistencia.rows[0].cells[2].value) || !rowInfoAsistencia){
        this.disableCrearEJG = true;
      }else{
        this.disableCrearEJG = false;
      }
    } else {
      this.isDisabled = true;
      this.disableCrearEJG = true;
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
    
    cellAsistido.type = '5InputSelector';
    cellAsistido.value = ['','','','',''];
    cellAsistido.combo = this.comboSexo;
    cellAsistido.size = 445.5;

    cellDelitosObservaciones.type = '2SelectorInput';
    cellDelitosObservaciones.value = ['',''];
    cellDelitosObservaciones.combo = this.comboDelitos;
    cellDelitosObservaciones.size = 225.75;

    cellEJG.type = 'text';
    cellEJG.value = '';
    cellEJG.size = 100;

    cellFechaActuacion.type = 'datePickerAsist';
    cellFechaActuacion.value = this.fechaFormateada(this.filtro.diaGuardia);
    cellFechaActuacion.showTime = true;
    cellFechaActuacion.size = 200;

    cellLugar.type = 'buttomSelect';
    cellLugar.value = [this.textoComActivo, this.comboComisarias, this.comboJuzgadosAE
                        , 'C'
                        ,''
                        , 'Asistencia'
                        , 'S' // Indica que la asistencia es nueva, se utiliza al guardar por primera vez la asistencia
                      ];
    cellLugar.size = 550;

    cellNDiligencia.type = 'input';
    cellNDiligencia.value = '';
    cellNDiligencia.size = 100;

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
    cellEJG2.size= 100;

    cellFechaActuacion2.type = 'datePickerAct';
    cellFechaActuacion2.value = this.fechaFormateada(this.filtro.diaGuardia);
    cellFechaActuacion2.showTime = true;
    cellFechaActuacion2.size = 200;

    cellLugar2.type = 'buttomSelect';
    cellLugar2.value = [this.textoComActivo ,this.comboComisarias, this.comboJuzgadosAE
                        , 'C'
                        ,''
                      ];
    cellLugar2.size = 550;
    
    cellNDiligencia2.type = 'input';
    cellNDiligencia2.value = '';
    cellNDiligencia2.size = 100;

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
      cellEJG.size = 100;

      cellFechaActuacion.type = 'datePicker';
      cellFechaActuacion.value = this.fechaFormateada(this.filtro.diaGuardia);
      cellFechaActuacion.showTime = true;
      cellFechaActuacion.size = 200;

      cellLugar.type = 'buttomSelect';
      cellLugar.value = [this.textoComActivo , this.comboComisarias, this.comboJuzgadosAE
                          , 'C'
                          ,''
                          , 'Actuacion'
                        ];
      cellLugar.size = 550;
      
      cellNDiligencia.type = 'input';
      cellNDiligencia.value = '';
      cellNDiligencia.size = 100;
      //Si es un RowGroup que puede estar colapsado lo comprobamos y si es asi la fila que añadimos tambien lo estara
      let index = this.rowGroups.findIndex(rowGroup => rowGroup.id == this.tabla.selectedArray[0]);
      if(this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows.length > 1
          && this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows[1].position == 'collapse'){
          this.tabla.rowGroupArrowClick(this.tabla.rowGroupEl, this.tabla.selectedArray[0]);
          this.tabla.iconClickChange(this.tabla.rowGroupEl.toArray()[index].nativeElement.children[0].children[0].children[0],
                                      this.tabla.rowGroupEl.toArray()[index].nativeElement.children[0].children[0].children[1]);
      }
      rowToAdd.cells = [cellAsistido, cellDelitosObservaciones, cellEJG, cellFechaActuacion, cellLugar, cellNDiligencia];
      this.rowGroups.find(rowGroup => rowGroup.id == this.tabla.selectedArray[0]).rows.push(rowToAdd);
      this.tabla.totalRegistros = this.rowGroups.length;
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
      this.router.navigate(["/gestionEjg"]);
    }else{
      this.showMsg('error', 'Error. Debe seleccionar un registro para poder crear un EJG' ,'')
    }
  }
  guardar(){

    let rowGroupsToUpdate : RowGroup[] = [];

    if (this.compruebaCamposObligatorios()) {
      this.showMsg('error',this.translateService.instant("formacion.mensaje.general.mensaje.error"), this.translateService.instant("general.message.camposObligatorios"));
    } else if (this.tabla.rowIdsToUpdate && this.tabla.rowIdsToUpdate.length != 0) {

      let rowIdsToUpdateNOT_REPEATED = new Set(this.tabla.rowIdsToUpdate);
      this.tabla.rowIdsToUpdate = Array.from(rowIdsToUpdateNOT_REPEATED);
      this.rowGroups.forEach(rowGroup => {

        if(this.tabla.rowIdsToUpdate.includes(rowGroup.id)){
          rowGroupsToUpdate.push(rowGroup);
        }
      });

      if (this.filtro.isSustituto != null) {
        if (this.filtro.idLetradoManual != null) {
          this.checkSustitutoCheckBox.emit();
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
  }

  compruebaCamposObligatorios() {
    let error = false;

    this.rowGroups.forEach(rowGroup => {

      rowGroup.rows.forEach(row => {

        row.cells.forEach(cell => {
          
          if (cell.type == '5InputSelector') {

            cell.value.forEach(val => {

              if (val == undefined || val == '') {
                error = true;
                if(cell.value[0] == undefined || cell.value[0] == ""){
                  error = false;
                }
              }
            });
          }
        });
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
