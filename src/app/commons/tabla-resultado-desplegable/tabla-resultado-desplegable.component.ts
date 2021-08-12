import { DatePipe } from '@angular/common';
import { ElementRef, Renderer2, Output, EventEmitter, SimpleChange, ViewRef } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { Actuacion } from '../../features/sjcs/oficio/designaciones/ficha-designaciones/detalle-tarjeta-actuaciones-designa/detalle-tarjeta-actuaciones-designa.component';
import { ParametroDto } from '../../models/ParametroDto';
import { ParametroRequestDto } from '../../models/ParametroRequestDto';
import { ActuacionDesignaItem } from '../../models/sjcs/ActuacionDesignaItem';
import { DesignaItem } from '../../models/sjcs/DesignaItem';
import { CommonsService } from '../../_services/commons.service';
import { SigaServices } from '../../_services/siga.service';
import { Cell, Row, RowGroup } from './tabla-resultado-desplegable-je.service';
import { PersistenceService } from '../../_services/persistence.service';
import { TranslateService } from '../translate';
@Component({
  selector: 'app-tabla-resultado-desplegable',
  templateUrl: './tabla-resultado-desplegable.component.html',
  styleUrls: ['./tabla-resultado-desplegable.component.scss']
})
export class TablaResultadoDesplegableComponent implements OnInit {
  @ViewChild("table") table;
  info = new FormControl();
  @Input() cabeceras = [];
  @Input() rowGroups: RowGroup[];
  @Input() rowGroupsAux: RowGroup[];
  @Input() seleccionarTodo = false;
  @Input() pantalla: string = '';
  @Input() s = false;
  @Input() colegiado;
  @Input() isLetrado;
  @Input() permisosFichaAct;
  @Input() fechaFiltro;
  turnoAllow;  //to do
  justActivarDesigLetrado;
  activarSubidaJustDesig;
  lastChangePadre;
  lastChangeHijo;
  lastChange = "";
  sumar = false;
  @Output() anySelected = new EventEmitter<any>();
  @Output() designasToDelete = new EventEmitter<any[]>();
  @Output() actuacionesToDelete = new EventEmitter<any[]>();
  @Output() actuacionToAdd = new EventEmitter<Row>();
  @Output() dataToUpdate = new EventEmitter<RowGroup[]>();
  @Output() totalActuaciones = new EventEmitter<Number>();
  @Output() numDesignasModificadas = new EventEmitter<any>();
  @Output() numActuacionesModificadas = new EventEmitter<any>();
  @Output() refreshData = new EventEmitter<boolean>();
  msgs: Message[] = [];
  cabecerasMultiselect = [];
  modalStateDisplay = true;
  searchText = [];
  selectedHeader = [];
  positionsToDelete = [];
  numColumnasChecked = 0;
  selected = false;
  selectedArray = [];
  selecteChild = [];
  RGid = "inicial";
  down = false;
  itemsaOcultar = [];
  textSelected: string = "{0} visibles";
  columnsSizes = [];
  tamanioTablaResultados = 0;
  childNumber = 0 ;
  newActuacionesArr: Row[] = [];
  rowIdsToUpdate = [];
  numperPage = 10;
  from = 0;
  to = 10;
  totalRegistros = 0;
  disableDelete = true;
  idTurno = "";
  rowIdWithNewActuacion = "";
  //@Input() comboAcreditacionesPorModulo: any [];
  @Output() cargaModulosPorJuzgado2 = new EventEmitter<String>();
  @Output() cargaAllModulos = new EventEmitter<boolean>();
  @Output() cargaAcreditacionesPorModulo2 = new EventEmitter<String[]>();
  //@Output() cargaJuzgados = new EventEmitter<boolean>();
  progressSpinner: boolean = false;
  rowValidadas = [];
  comboJuzgados = [];
  @Input() comboModulos = [];
  @Input()comboAcreditacion = [];
  dataToUpdateArr: RowGroup[] = [];
  rowGroupWithNew = "";
  valorParametro: AnalyserNode;
  datosBuscar: any[];
  searchParametros: ParametroDto = new ParametroDto();
  configComboDesigna;
  permisoEscritura;
  constructor(
    private renderer: Renderer2,
    private datepipe: DatePipe,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private router: Router,
    private persistenceService: PersistenceService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService

  ) {

    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if (!event.target.classList.contains("selectedRowClass")) {
          this.selected = false;
          this.selectedArray = [];
          this.selecteChild = [];
        }
      }
    });
  }

  ngOnInit(): void {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (this.pantalla == 'JE'){
      this.rowIdsToUpdate = []; //limpiamos
      this.dataToUpdateArr = []; //limpiamos
      this.newActuacionesArr = []; //limpiamos
      this.rowValidadas = [];
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
      this.getParams("JUSTIFICACION_EDITAR_DESIGNA_LETRADOS");
      this.getParams("CONFIGURAR_COMBO_DESIGNA");
          }
    
    //this.cargaJuzgados.emit(false);
    if (this.comboModulos != undefined && this.comboModulos != []){
      this.searchNuevo(this.comboModulos, []);
    }

    if (this.comboModulos != undefined && this.comboModulos != [] && this.comboAcreditacion != undefined && this.comboAcreditacion != []){
      this.searchNuevo(this.comboModulos, this.comboAcreditacion);
    }
    this.cabeceras.forEach(cab => {
      this.selectedHeader.push(cab);
      this.cabecerasMultiselect.push(cab.name);
    });
    this.totalRegistros = this.rowGroups.length;
  }

  selectRow(rowSelected, rowId, child) {
    if (child == undefined){
      this.disableDelete = true;
    }else{
      this.disableDelete = false;
    }
    this.selected = true;
    if (child != undefined){
      if (this.selecteChild.includes({[rowId] : child})) {
        const i = this.selecteChild.indexOf({[rowId] : child});
        this.selecteChild.splice(i, 1);
      } else {
        this.selecteChild.push({[rowId] : child});
      }
      if (this.selecteChild.length != 0) {
        this.anySelected.emit(true);
      } else {
        this.anySelected.emit(false);
      }
    }
    if (this.selectedArray.includes(rowId)) {
      const i = this.selectedArray.indexOf(rowId);
      this.selectedArray.splice(i, 1);
    } else {
      this.selectedArray.push(rowId);
    }
    if (this.selectedArray.length != 0) {
      this.anySelected.emit(true);
      this.disableDelete = false;
    } else {
      this.anySelected.emit(false);
      this.disableDelete = true;
    }
  }
  isSelected(id) {
    if (this.selectedArray.includes(id)) {
      return true;
    } else {
      return false;
    }
  }
  sortData(sort: Sort) {
    let data: RowGroup[] = [];
    this.rowGroups = this.rowGroupsAux.filter((row) => {
      data.push(row);
    });
    data = data.slice();
    if (!sort.active || sort.direction === '') {
      this.rowGroups = data;
      return;
    }
    if (sort.active == "anio") {
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        resultado = compare(a.id, b.id, isAsc);
        return resultado;
      });
    }else if (this.pantalla == 'JE' && sort.active == "ejgs") {
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        resultado = compare(a.id2, b.id2, isAsc);
        return resultado;
      });
    }else if (this.pantalla == 'JE' && sort.active == "clientes") {
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        resultado = compare(a.id3, b.id3, isAsc);
        return resultado;
      });
    } else {
      let j = 0;
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        let arr = [];

        if (a.rows.length - 1 < j){
          arr = b.rows;
        } else {
          arr = a.rows;
        }
        if ( j <= a.rows.length - 1 && j <= b.rows.length - 1 ){
          for (let i = 0; i < arr[j].cells.length; i++) {
            resultado = compare(a.rows[j].cells[i].value, b.rows[j].cells[i].value, isAsc);
          }
          j++;
          return resultado;
        }
      });
      this.rowGroupsAux = this.rowGroups;
    }
    this.totalRegistros = this.rowGroups.length;
  }
  getPosition(selectedHeaders) {
    this.positionsToDelete = [];
    if (selectedHeaders != undefined) {
      let i = -1;
      this.cabeceras.forEach(cabecera => {
        selectedHeaders.forEach(selected => {

          if (selectedHeaders != undefined && selected != undefined && selected.id != undefined && selected.id.toString().toLowerCase().includes(cabecera.id.toString().toLowerCase())) {
            this.positionsToDelete.push(i);
          }
        })
        i++;
      })
    }
    let mySet = new Set(this.positionsToDelete);
    return this.positionsToDelete;
  }

  cabeceraOculta(selectedHeaders, cabecera) {
    let pos;
    let ocultar = false;
    if (selectedHeaders != "" && selectedHeaders != undefined && selectedHeaders != null && selectedHeaders.length > 0) {
      selectedHeaders.forEach(selectedHeader => {
        if (selectedHeader != undefined && selectedHeader.id != undefined && selectedHeader.id.toString().toLowerCase().includes(cabecera.toLowerCase())) {
          ocultar = true;
        }
      });

    }
    pos = this.getPosition(selectedHeaders);
    this.totalRegistros = this.rowGroups.length;
    return ocultar;
  }
  posicionOcultar(z) {
    if (this.positionsToDelete != undefined && this.positionsToDelete.length > 0) {
      return this.positionsToDelete.includes(z);
    } else {
      return false;
    }
    
  }
  iconClickChange(iconrightEl, iconDownEl) {
    this.renderer.addClass(iconrightEl, 'collapse');
    this.renderer.removeClass(iconDownEl, 'collapse');
  }
  iconClickChange2(iconrightEl, iconDownEl) {
    this.renderer.removeClass(iconrightEl, 'collapse');
    this.renderer.addClass(iconDownEl, 'collapse');

  }
  rowGroupArrowClick(rowWrapper, rowGroupId) {
    this.down = !this.down
    this.RGid = rowGroupId;
    const toggle = rowWrapper;
    for (let i = 0; i < rowWrapper.children.length; i++) {
      if (rowWrapper.children[i].className.includes('child')) {
        this.modalStateDisplay = false;
        rowWrapper.children[i].className.includes('collapse')
          ? this.renderer.removeClass(
            rowWrapper.children[i],
            'collapse'
          )
          : this.renderer.addClass(
            rowWrapper.children[i],
            'collapse'
          );
      } else {
        this.modalStateDisplay = true;
      }
    }
  }
  searchChange(j: any) {
    if (this.pantalla == 'JE') {
      let isReturn = true;
      let sT;
      let isReturnArr = [];
      this.rowGroups = this.rowGroupsAux.filter((row) => {
        isReturnArr = [];
  
          for (let r = 0; r < row.rows.length; r++) {
          for (let i = 0; i < row.rows[r].cells.length; i++) {
            if (row.rows[r].cells[i].value != null && i <= 8){

              //this.searchText.forEach(sT => {
          if ( (i == 8 || i == 0) && (this.searchText[i + 3] == 's' || this.searchText[i + 3] == 'si')){
            sT  = 'true';
          }else if ((i == 8 || i == 0) && (this.searchText[i + 3] == 'n' || this.searchText[i + 3] == 'no')){
            sT  = 'false';
          }else{
            sT = this.searchText[i + 3];
          }
                  if ( 
                    (i == 0 && this.searchText[i] != undefined && !row.id.toLowerCase().includes(this.searchText[0].toLowerCase())) ||
                    (i == 1 && this.searchText[i] != undefined && !row.id2.toLowerCase().includes(this.searchText[1].toLowerCase())) ||
                    (i == 2 && this.searchText[i] != undefined && !row.id3.toLowerCase().includes(this.searchText[2].toLowerCase())) ||
                   
                    (sT != " " &&
                    sT != undefined &&
                    sT != null &&
                    !row.rows[0].cells[i].value.toString().toLowerCase().includes(sT.toLowerCase()))
                  ) {
                    isReturn = false;
                  } else {
                    isReturn = true;
                  }
                //});
            isReturnArr.push(isReturn);
          }
         }
         if (!isReturnArr.includes(false)) {
          return row;
        }
        }
    
      });
    }
    //let self = this;
    /*setTimeout(function () {
      self.setTamanios();
      self.setTamanioPrimerRegistroGrupo();
    }, 1);*/
    this.totalRegistros = this.rowGroups.length;
    
  }

  isPar(numero): boolean {
    return numero % 2 === 0;
  }

  validaCheck(texto) {
    return texto === 'Si';
  }
  fillFecha(event, cell, rowId, row, rowGroup, padre, index) {
    if ((this.lastChangePadre == rowId && padre) || (this.lastChangeHijo == index && !padre)){
      if (this.lastChange == "fillFecha"){
        this.sumar = !this.sumar;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = index;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    }else{
      this.sumar = true;
      if (padre){
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      }else{
        this.lastChangeHijo = index;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }
    console.log('this.isLetrado: ', this.isLetrado)
    this.rowValidadas = [];
    if (row == undefined){
      //designacion
      if(this.isLetrado){
        if (this.justActivarDesigLetrado != "1"){
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          this.rowGroups = this.rowGroupsAux;
          this.refreshData.emit(true);
        }else{
          cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
        }
      }else{
        cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
        if (this.sumar){
          this.rowIdsToUpdate.push(rowId);
        }else{
          this.rowIdsToUpdate = []; //limpiamos
        }
      }
    }else{
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if((this.isLetrado && row.cells[8].value != true && this.turnoAllow) || (!this.isLetrado)){
        if (row.cells[8].value != true){
        cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
        if (this.sumar){
          this.rowIdsToUpdate.push(rowId);
        }else{
          this.rowIdsToUpdate = []; //limpiamos
        }
        } else{
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        }
      }else{
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "fillFecha";
  }

  checkBoxDateChange(event, rowId, cell, row, rowGroup, padre, index){
    if ((this.lastChangePadre == rowId && padre) || (this.lastChangeHijo == index && !padre)){
      if (this.lastChange == "checkBoxDateChange"){
        this.sumar = !this.sumar;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = index;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    }else{
      this.sumar = true;
      if (padre){
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      }else{
        this.lastChangeHijo = index;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }
    this.rowValidadas = [];
    if (row == undefined){
      //designacion
      if(this.isLetrado){
        if (this.justActivarDesigLetrado != "1"){
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
        }else{
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
          if (cell != undefined){
            if (event == true){
              /*Aquellas actuaciones sin fecha de justificación activando el check de las actuaciones se aplicará como fecha de justificación la fecha cumplimentada en el componente de acciones generales del listado*/
              cell.value = this.fechaFiltro;
            }
          }
        }
      }else{
        if (this.sumar){
          this.rowIdsToUpdate.push(rowId);
        }else{
          this.rowIdsToUpdate = []; //limpiamos
        }
          if (cell != undefined){
            if (event == true){
              /*Aquellas actuaciones sin fecha de justificación activando el check de las actuaciones se aplicará como fecha de justificación la fecha cumplimentada en el componente de acciones generales del listado*/
              cell.value = this.fechaFiltro;
            }
          }
      }
    }else{
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if((this.isLetrado && row.cells[8].value != true && this.turnoAllow) || (!this.isLetrado)){
        if (row.cells[8].value  != true){
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
          if (event == true){
            /*Aquellas actuaciones sin fecha de justificación activando el check de las actuaciones se aplicará como fecha de justificación la fecha cumplimentada en el componente de acciones generales del listado*/
            cell.value = this.fechaFiltro;
          }
        }else{
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        }
      }else{
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "checkBoxDateChange";
  }
  checkBoxChange(event, rowId, cell, row, rowGroup, padre, index){
    if ((this.lastChangePadre == rowId && padre) || (this.lastChangeHijo == index && !padre)){
      if (this.lastChange == "checkBoxChange"){
        this.sumar = !this.sumar;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = index;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    }else{
      this.sumar = true;
      if (padre){
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      }else{
        this.lastChangeHijo = index;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }
    this.rowValidadas = [];
    if (row == undefined){
      //designacion
      if(this.isLetrado){
        if (this.justActivarDesigLetrado != "1"){
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
        }else{
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
          if (cell != undefined){
            cell.value[0] = event;
          }
        }
      }else{
        if (this.sumar){
          this.rowIdsToUpdate.push(rowId);
        }else{
          this.rowIdsToUpdate = []; //limpiamos
        }
          if (cell != undefined){
            cell.value[0] = event;
          }
      }
    }else{
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if((this.isLetrado && row.cells[8].value != true && this.turnoAllow) || (!this.isLetrado)){
        if (row.cells[8].value  != true){
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
          if (cell != undefined){
            cell.value[0] = event;
          }
        }else{
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        }
      }else{
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }

    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "checkBoxChange";
  }

  checkBoxChange2(event, rowId, cell, row, rowGroup, padre, index){
    if (cell.value == false && row != undefined && row.cells[35].value == "1"){
      cell.value = !cell.value;
      this.showMsg('error', "No puede desvalidar actuaciones facturadas", '')
    }else{
      if ((this.lastChangePadre == rowId && padre) || (this.lastChangeHijo == index && !padre)){
        if (this.lastChange == "checkBoxChange2"){
          this.sumar = !this.sumar;
          if (padre){
            this.lastChangePadre = rowId;
            this.numDesignasModificadas.emit(this.sumar);
          }else{
            this.lastChangeHijo = index;
            this.numActuacionesModificadas.emit(this.sumar);
          }
        }
      }else{
        this.sumar = true;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = index;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
      this.rowValidadas = [];
      if (row == undefined){
        //designacion
        if(this.isLetrado){
          if (this.justActivarDesigLetrado != "1"){
            cell.value = !cell.value;
            this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
          }else{
            if (this.sumar){
              this.rowIdsToUpdate.push(rowId);
            }else{
              this.rowIdsToUpdate = []; //limpiamos
            }
            if (cell != undefined){
              cell.value = !cell.value;
            }
          }
        }else{
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
            /*if (cell != undefined){
              cell.value = !cell.value;
            }*/
        }
      }else{
        //actuacion
        this.turnoAllow = rowGroup.rows[0].cells[39].value;
        if((this.isLetrado && row.cells[8].value == true && this.turnoAllow) || (!this.isLetrado)){
          /*if (row.cells[8].value  == true){*/
            if (this.sumar){
              this.rowIdsToUpdate.push(rowId);
            }else{
              this.rowIdsToUpdate = []; //limpiamos
            }
            /*if (cell != undefined){
              cell.value = !cell.value;
            }*/
          /*}else{
            this.rowValidadas.push(row);
            cell.value = !cell.value;
            this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
          }*/
        }else{
          cell.value = !cell.value;
          this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
          this.refreshData.emit(true);
        }
      }

      sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
      this.lastChange = "checkBoxChange2";

      if (cell.value == true){
        if (row != undefined){
          row.cells[6].type = 'text';
          row.cells[5].type = 'text';
        }
        
      }else{
        if (row != undefined){
        row.cells[6].type = 'datePicker';
        row.cells[5].type = 'datePicker';
        }
      }
    }
  }
  changeSelect(row, cell, rowId, rowGroup, padre, index){
    if ((this.lastChangePadre == rowId && padre) || ( this.lastChangeHijo == index && !padre)){
      if (this.lastChange == "changeSelect"){
        this.sumar = !this.sumar;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = index;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    }else{
      this.sumar = true;
      if (padre){
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      }else{
        this.lastChangeHijo = index;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }
    if (row == undefined){
      //designacion
      if(this.isLetrado){
        if (this.justActivarDesigLetrado != "1"){
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
        }else{
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
        }
      }else{
        if (this.sumar){
          this.rowIdsToUpdate.push(rowId);
        }else{
          this.rowIdsToUpdate = []; //limpiamos
        }
      }
    }else{
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if((this.isLetrado && row.cells[8].value != true && this.turnoAllow) || (!this.isLetrado)){
        if (row.cells[8].value  != true){
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
        }else{
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        }
      }else{
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "changeSelect";
  }

  inputChange(event, rowId, row, rowGroup, padre, index){
    if ((this.lastChangePadre == rowId && padre) || ( this.lastChangeHijo == index && !padre)){
      if (this.lastChange == "inputChange"){
        this.sumar = !this.sumar;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = index;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    }else{
      this.sumar = true;
      if (padre){
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      }else{
        this.lastChangeHijo = index;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }
    this.rowValidadas = [];
    if (row == undefined){
      //designacion
      if(this.isLetrado){
        if (this.justActivarDesigLetrado != "1"){
          this.showMsg('error', "No tiene permiso para actualizar designaciones", '')
        }else{
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
        }
      }else{
      
          this.rowIdsToUpdate.push(rowId);
     
      }
    }else{
      //actuacion
      this.turnoAllow = rowGroup.rows[0].cells[39].value;
      if((this.isLetrado && row.cells[8].value != true && this.turnoAllow) || (!this.isLetrado)){
        if (row.cells[8].value  != true){
          if (this.sumar){
            this.rowIdsToUpdate.push(rowId);
          }else{
            this.rowIdsToUpdate = []; //limpiamos
          }
        } else{
          this.rowValidadas.push(row);
          this.showMsg('error', "No se pueden actualizar actuaciones validadas", '')
        }
      }else{
        this.showMsg('error', "No tiene permiso para actualizar datos de una actuación", '')
        this.refreshData.emit(true);
      }
    }
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
    this.lastChange = "inputChange";
  }

  ocultarColumna(event) {
    if (this.pantalla == 'JE' && event.itemValue.id == "clientes" || event.itemValue.id == "ejgs"){
      this.showMsg('error', "Clientes y EJG's pertenecen a la columna Año/Número Designación, no pueden ocultarse/mostrarse por sí solas", '')
    }else{

    let tabla = document.getElementById("tablaResultadoDesplegable");

    if (event.itemValue == undefined && event.value.length == 0) {
      this.cabeceras.forEach(element => {
        this.renderer.addClass(document.getElementById(element.id), "collapse");
      });
      this.getPosition(this.cabeceras);
      this.itemsaOcultar = this.cabeceras;
      tabla.setAttribute("style", 'width: 0px !important');
    }

    if (event.itemValue == undefined && event.value.length > 0) {
      this.cabeceras.forEach(element => {
        this.renderer.removeClass(document.getElementById(element.id), "collapse");
      });
      this.getPosition([]);
      this.itemsaOcultar = [];
      this.setTamanioPrimerRegistroGrupo();
      tabla.setAttribute("style", `width: ${this.tamanioTablaResultados}px !important`);
    }

    if (event.itemValue != undefined && event.value.length >= 0) {
      let ocultar = true;
      event.value.forEach(element => {
        if (element.id == event.itemValue.id) {
          ocultar = false;
        }
      });
      if (this.pantalla == 'JE' ){
        /*if (event.itemValue.id == "ejgs" || event.itemValue.id == "clientes"){
          event.itemValue.id = "anio";
        }
        console.log('event.itemValue.id: ', event.itemValue.id)*/
        if (ocultar && event.itemValue.id == "anio"){
          this.ocultarItem("clientes");
          this.ocultarItem("ejgs");
        }else if (!ocultar && event.itemValue.id == "anio"){
          this.mostrarItem("clientes");
          this.mostrarItem("ejgs");
        }
      }
      if (ocultar) {
        this.renderer.addClass(document.getElementById(event.itemValue.id), "collapse");
        this.itemsaOcultar.push(event.itemValue);
        if(this.columnsSizes.length != 0){
          tabla.setAttribute("style", `width: ${tabla.clientWidth - this.columnsSizes.find(el => el.id == event.itemValue.id).size}px !important`);
        }
        
       
      } else {
        this.renderer.removeClass(document.getElementById(event.itemValue.id), "collapse");
        this.itemsaOcultar.forEach((element, index) => {
          if (element.id == event.itemValue.id) {
            this.itemsaOcultar.splice(index, 1);
          }
        });
        if(this.columnsSizes.length != 0){ 
        tabla.setAttribute("style", `width: ${tabla.clientWidth + this.columnsSizes.find(el => el.id == event.itemValue.id).size}px !important`);
        }
      }
      this.getPosition(this.itemsaOcultar);

      if (!ocultar) {
        this.setTamanioPrimerRegistroGrupo();
      }

    }
    this.totalRegistros = this.rowGroups.length;
    }
  }
    mostrarItem(id){
      let tabla = document.getElementById("tablaResultadoDesplegable");
      this.renderer.removeClass(document.getElementById(id), "collapse");
      this.itemsaOcultar.forEach((element, index) => {
        if (element.id == id) {
          this.itemsaOcultar.splice(index, 1);
        }
      });
      if(this.columnsSizes.length != 0){ 
      tabla.setAttribute("style", `width: ${tabla.clientWidth + this.columnsSizes.find(el => el.id == id).size}px !important`);
      }
    }
  ocultarItem(id){
    let tabla = document.getElementById("tablaResultadoDesplegable");
    this.renderer.addClass(document.getElementById(id), "collapse");
        //this.itemsaOcultar.push(event.itemValue);
        if(this.columnsSizes.length != 0){
          tabla.setAttribute("style", `width: ${tabla.clientWidth - this.columnsSizes.find(el => el.id == id).size}px !important`);
        }
  }
  setTamanioPrimerRegistroGrupo() {
    if (this.pantalla == 'AE' || this.pantalla == '') {
      let self = this;
      setTimeout(function () {
        let primerRegistroDelGrupo = document.getElementsByClassName("table-row-header");

        for (let i = 0; i < primerRegistroDelGrupo.length; i++) {
          primerRegistroDelGrupo[i].setAttribute("style", `max-width: ${self.columnsSizes[0].size}px`);
        }
      }, 1);
    }
  }

  ngAfterViewInit(): void {
    this.setTamanios();
    this.tamanioTablaResultados = document.getElementById("tablaResultadoDesplegable").clientWidth;
  }

  setTamanios() {
    if (this.pantalla == 'AE') {

      this.cabeceras.forEach(ind => {
        if (ind.id != 'idApNombreSexo') {
          this.columnsSizes.push({
            id: ind.id,
            size: 225.75
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 225.75px");
        } else {
          this.columnsSizes.push({
            id: ind.id,
            size: 445.5
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 445.5px");
        }
      });

      let primeraColumna = document.getElementsByClassName("table-row-header");
      let columnasHijas = document.getElementsByClassName("table-cell");

      for (let i = 0; i < primeraColumna.length; i++) {
        primeraColumna[i].setAttribute("style", "max-width: 225.75px");
      }


      for (let j = 0; j < columnasHijas.length; j++) {

        if ([0, 6, 12, 18, 24].includes(j)) {
          columnasHijas[j].setAttribute("style", "max-width: 445.5px");
        } else {
          columnasHijas[j].setAttribute("style", "max-width: 225.75px");
        }
      }

    } else if (this.pantalla == '') {

      this.cabeceras.forEach(ind => {
        if (ind.id == 'clientes') {
          this.columnsSizes.push({
            id: ind.id,
            size: 300
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 300px");
        } else if (ind.id == 'finalizado' || ind.id == 'validar') {
          this.columnsSizes.push({
            id: ind.id,
            size: 50
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 50px");
        } else {
          this.columnsSizes.push({
            id: ind.id,
            size: 153.7
          });
          document.getElementById(ind.id).setAttribute("style", "max-width: 153.7px");
        }
      });

      let primeraColumna = document.getElementsByClassName("table-row-header");
      let columnasHijas = document.getElementsByClassName("table-cell");

      for (let i = 0; i < primeraColumna.length; i++) {
        primeraColumna[i].setAttribute("style", "max-width: 153.7px");
      }


      for (let j = 0; j < columnasHijas.length; j++) {

        if ([1, 12, 23, 34, 45, 56].includes(j)) {
          columnasHijas[j].setAttribute("style", "max-width: 300px");
        } else if ([2, 10, 13, 21, 24, 32, 35, 43, 46, 54, 57, 65].includes(j)) {
          columnasHijas[j].setAttribute("style", "max-width: 50px");
        } else {
          columnasHijas[j].setAttribute("style", "max-width: 153.7px");
        }
      }
    }
  }
  setMyStyles(size) {
    let styles = {
      'max-width': size + 'px',
    };
    return styles;
  }
  changeDisplay() {
    return (document.getElementsByClassName("openedMenu").length == 0 && document.documentElement.clientWidth > 1812);
  }

  fromReg(event){
    this.from = Number(event) - 1;
  }

  toReg(event){
    this.to = Number(event);
  }

  perPage(perPage){
    this.numperPage = perPage;
  }

  selectedAll(event) {
    this.seleccionarTodo = event;
    // this.isDisabled = !event;
  }
  colorByStateDesigmacion(state){
    if ( state == 'V'){
      return 'green'; // activa
    }else if ( state == 'F'){
      return 'blue'; // finalizada
    }else if ( state == 'A'){
      return 'red'; // anulada
    } else {
      return 'black';
    }
  } 

  onChangeMulti($event, rowId, cell, z, padre, index){
    if ((padre && this.lastChangePadre == rowId) || ( !padre && this.lastChangeHijo == rowId)){
      if (this.lastChange == "onChangeMulti"){
        this.sumar = !this.sumar;
        if (padre){
          this.lastChangePadre = rowId;
          this.numDesignasModificadas.emit(this.sumar);
        }else{
          this.lastChangeHijo = rowId;
          this.numActuacionesModificadas.emit(this.sumar);
        }
      }
    }else{
      this.sumar = true;
      if (padre){
        this.lastChangePadre = rowId;
        this.numDesignasModificadas.emit(this.sumar);
      }else{
        this.lastChangeHijo = rowId;
        this.numActuacionesModificadas.emit(this.sumar);
      }
    }
	
    if (z == 1) {
      //comboJuzgados
      let juzgado = $event.value;
      if (this.configComboDesigna == "1" || this.configComboDesigna == "2" || this.configComboDesigna == "3"){
        this.cargaModulosPorJuzgado2.emit(juzgado);
        }else if (this.configComboDesigna == "4" || this.configComboDesigna == "5" ){
          this.cargaAllModulos.emit(true);
        }
      
    }else if (z == 4){
      //comboModulos
      let modulo = $event.value;
      let data: String[] = [];

      data.push(modulo);
      data.push(this.newActuacionesArr[0].cells[33].value);
      this.cargaAcreditacionesPorModulo2.emit(data);
    }else if (z == 7){
      //comboAcreditacion
    }

    this.lastChange = "onChangeMulti";
  }

  searchNuevo(comboModulos, comboAcreditacion ){
    let rowGroupFound = false;
    this.rowGroups.forEach((rowGroup,i) => {
      rowGroup.rows.forEach(row =>{
        row.cells.forEach(cell => {
          if (cell.type == 'multiselect2') {
            cell.combo = comboModulos;
            cell.value= comboModulos[0].value;
            rowGroupFound = true;
          }else if (cell.type == 'multiselect3'&& comboAcreditacion[0] != undefined) {
            cell.combo = comboAcreditacion;
            cell.value= comboAcreditacion[0].value;
            rowGroupFound = true;
          } 

        })
        if (comboModulos != [] && comboAcreditacion != [] && rowGroupFound == true){
          this.newActuacionesArr.push(row);
        }
      })
      
      if (rowGroupFound == true){
        rowGroup.rows.forEach(row =>{
        row.position = 'noCollapse';
        });
      }
      rowGroupFound = false;
    });
  }

  newFromSelected(){
    console.log('sessionStorage.getItem(rowIdsToUpdate) ', sessionStorage.getItem('rowIdsToUpdate') );
    if (sessionStorage.getItem('rowIdsToUpdate') != null && sessionStorage.getItem('rowIdsToUpdate') != 'null' && sessionStorage.getItem('rowIdsToUpdate') != '[]'){
      let keyConfirmation = "confirmacionGuardarJustificacionExpress";
        this.confirmationService.confirm({
          key: keyConfirmation,
          message: this.translateService.instant('justiciaGratuita.oficio.justificacion.reestablecer'),
          icon: "fa fa-trash-alt",
          accept: () => {
            this.rowGroups.forEach((rowG, i) => {
              this.selectedArray.forEach(id => {
              if (rowG.id == id){
                //this.toDoButton('Nuevo', rowG.id, rowG, null)
                this.linkFichaActIfPermis(null, rowG);
              }
              });
          });
          },
          reject: () => {
          }
        });
      }else{
      this.rowGroups.forEach((rowG, i) => {
        this.selectedArray.forEach(id => {
        if (rowG.id == id){
          //this.toDoButton('Nuevo', rowG.id, rowG, null)
          this.linkFichaActIfPermis(null, rowG);
        }
        });
    });
    console.log('selectedArray', this.selectedArray)
    console.log('selecteChild', this.selecteChild)
  }
}
  toDoButton(type, designacion, rowGroup, rowWrapper){
    this.turnoAllow = rowGroup.rows[0].cells[39].value;
    if (type == 'Nuevo'){
      this.rowGroupWithNew = rowGroup.id;
     this.rowIdWithNewActuacion = rowGroup.id;
      let desig = rowGroup.rows[0].cells;
      //this.getJuzgados(desig[17].value);

      this.idTurno = desig[17].value;
      this.progressSpinner = true;

      this.sigaServices.get("combo_comboJuzgadoDesignaciones").subscribe(
        n => {
            this.comboJuzgados = n.combooItems;
            if(this.comboJuzgados[0] != undefined){
            this.commonsService.arregloTildesCombo(this.comboJuzgados);
            this.progressSpinner = false;
            if (this.configComboDesigna == "1" || this.configComboDesigna == "2" || this.configComboDesigna == "3"){
              this.cargaModulosPorJuzgado(this.comboJuzgados[0].value, designacion, rowGroup);
            }else if (this.configComboDesigna == "4" || this.configComboDesigna == "5" ){
              this.cargaModulos(designacion, rowGroup);
            }
          }else{
            if (this.configComboDesigna == "1" || this.configComboDesigna == "2" || this.configComboDesigna == "3"){
                this.comboModulos = [];
                let data: String[] = [];
                data.push("0");
                data.push(this.idTurno);
                this.cargaAcreditacionesPorModulo(data, designacion, rowGroup); 
              }else if (this.configComboDesigna == "4" || this.configComboDesigna == "5" ){
                this.cargaModulos(designacion, rowGroup);
              }
            
            this.progressSpinner = false;
          }
         
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );



    }
  }

  colorByStateExpediente(state){
    if ( state == 'DESFAVORABLE'){
      return 'red';
    }else if ( state == 'FAVORABLE'){
      return 'blue'; 
    } else {
      return 'black';
    }
  } 
  searchActuacionwithSameNumDesig(idAcreditacionNew, rowGroupWithNew){
    let esPosibleCrearNuevo = true;
    let nameAcreditacionArr = [];
    let idAcreditacionArr = [];
    this.rowGroups.forEach(rowGroup => {
        if (rowGroup.id == rowGroupWithNew){
          let actuaciones = rowGroup.rows.slice(1, rowGroup.rows.length - 1);
          actuaciones.forEach(rowAct => {
            let idAcre = rowAct.cells[14].value;
            nameAcreditacionArr.push(idAcre);
          })
      }
    })
    nameAcreditacionArr.forEach(nameA =>{
      if (nameA == 'Inic.-Fin'){
        idAcreditacionArr.push('1,0')
      }else if(nameA == 'Inic.'){
        idAcreditacionArr.push('2,0')
      }else if(nameA == 'Fin'){
        idAcreditacionArr.push('3,0')
      }else if(nameA == 'Inic.<2005'){
        idAcreditacionArr.push('10,0')
      }else if(nameA == 'Fin<2005'){
        idAcreditacionArr.push('11,0')
      }else if(nameA == 'Fin sin Inic.'){
        idAcreditacionArr.push('15,0')
      }
    });
    if (idAcreditacionArr.includes(idAcreditacionNew)){
      esPosibleCrearNuevo = false;
    }
    return esPosibleCrearNuevo;
  }
  guardar(){
    let esPosibleCrearNuevo = true;
    let actuaciones;
    //1. Guardar nuevos
    if (this.newActuacionesArr.length != 0){

      let newActuacionesArrNOT_REPEATED = new Set(this.newActuacionesArr);
      this.newActuacionesArr = Array.from(newActuacionesArrNOT_REPEATED);

    this.newActuacionesArr.forEach( newAct => {
      let idAcreditacionNew = newAct.cells[7].value;
      esPosibleCrearNuevo = this.searchActuacionwithSameNumDesig(idAcreditacionNew, this.rowGroupWithNew);
      if(esPosibleCrearNuevo){
        this.actuacionToAdd.emit(newAct);
        this.totalActuaciones.emit(this.newActuacionesArr.length);
      } else{
        this.showMsg('error', "No es posible crear otra actuación con valor de acreditación Inicio/Fin", '')
      }
    });
    }
    

    //2. Actualizar editados
    
    let rowValidadasNOT_REPEATED = new Set(this.rowValidadas);
    this.rowValidadas = Array.from(rowValidadasNOT_REPEATED);

    if(this.rowIdsToUpdate != [] && this.newActuacionesArr.length == 0){
    let rowIdsToUpdateNOT_REPEATED = new Set(this.rowIdsToUpdate);
    this.rowIdsToUpdate = Array.from(rowIdsToUpdateNOT_REPEATED);
    this.rowGroups.forEach(row => {
      if(this.rowIdsToUpdate.indexOf(row.id.toString()) >= 0){
        let rowGroupToUpdate = row;
        actuaciones = row.rows.slice(1, row.rows.length - 1);
          this.rowValidadas.forEach(rowValid => {
            if (rowGroupToUpdate.rows.includes(rowValid)){
            }
          })
          this.rowValidadas = [];
        


        this.dataToUpdateArr.push(row);
      }
    })
    if (this.dataToUpdateArr.length != 0){
    this.dataToUpdate.emit(this.dataToUpdateArr);
    this.numDesignasModificadas.emit(this.rowIdsToUpdate.length);
    this.numActuacionesModificadas.emit(actuaciones.length);
    }


  }
    this.rowIdsToUpdate = []; //limpiamos
    this.dataToUpdateArr = []; //limpiamos
    this.newActuacionesArr = []; //limpiamos
    this.rowValidadas = [];
    sessionStorage.setItem("rowIdsToUpdate", JSON.stringify(this.rowIdsToUpdate));
  }

  eliminar(){
    let deletedDesig = [];
    let deletedAct = [];
    this.rowGroups.forEach((rowG, i) => {
      //1. Eliminamos designaciones
      this.selectedArray.forEach(idToDelete => {
      if (rowG.id == idToDelete){
        this.showMsg('error', "No se pueden eliminar designaciones", '')
        /*this.rowGroups.splice(i, 1);
        deletedDesig.push(rowG.id)
        this.designasToDelete.emit(deletedDesig);*/
        //NO SE PUEDEN ELIMINAR DESIGNACIONES!!
      }
      });
    //2. Eliminamos actuaciones
    if(this.selecteChild != []){


      this.selecteChild.forEach((child) => {
      let rowIdChild = Object.keys(child)[0];
      let rowId = rowIdChild.slice(0, -1);
       this.childNumber =  Number(Object.values(child)[0]);
       this.selectedArray.forEach(idToDelete => {
        if (rowIdChild == idToDelete && rowG.id == rowId){
          this.turnoAllow = rowG.rows[0].cells[39].value;
          //rowG.rows.splice(this.childNumber, 1);
          if (rowG.rows[this.childNumber + 1].cells[8].value == false){
            //actuacion No Validada
            if ((this.isLetrado && this.turnoAllow == "1" ) || (!this.isLetrado)){
              if (rowG.rows[this.childNumber + 1].cells[35].value == "1"){
                this.showMsg('error', "No puede eliminar actuaciones facturadas", '')
                this.refreshData.emit(true);
              }else{
                deletedAct.push(rowG.rows[this.childNumber + 1].cells)
              }
            }else {
              this.showMsg('error', "No tiene permiso para eliminar actuaciones", '')
              this.refreshData.emit(true);
            }
          } else {
            this.showMsg('error', "No se pueden eliminar actuaciones validadas", '')
            this.refreshData.emit(true);
          }
         
          this.totalActuaciones.emit(-1);
         
        }
        });
      })

    }
    });
    this.totalRegistros = this.rowGroups.length;

    if (deletedAct.length != 0){
      let deletedActNOT_REPEATED = new Set(deletedAct);
      deletedAct = Array.from(deletedActNOT_REPEATED);
      this.actuacionesToDelete.emit(deletedAct);
    }
    
    deletedAct = [];
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
  cargaAcreditacionesPorModulo($event, designacion, rowGroup){
    let validacion = false;
    if(this.isLetrado){
      //colegiado
      if (this.turnoAllow != "1"){
        //check desactivado
        validacion = true;
      }
    }else {
    //colegio
    validacion = true;
    }


    this.progressSpinner = true;
    let desig = rowGroup.rows[0].cells;
    this.idTurno = desig[17].value;
    if($event[0] == "0"){
      this.rowGroups.forEach((rowGroup,i) => {
        if (rowGroup.id == designacion){
          let id = Object.keys(rowGroup.rows)[0];
          let newArrayCells: Cell[];
            newArrayCells= [
              { type: 'checkbox', value: false, size: 120 , combo: null},
              { type: 'multiselect1', value: "0", size: 400 , combo: []},
              { type: 'input', value: desig[2].value, size: 200, combo: null},
              { type: 'input', value: desig[3].value, size: 200 , combo: null},//numProc
              { type: 'multiselect2', value: "0", size: 400 , combo: []}, //modulo
              { type: 'datePicker', value: this.formatDate(new Date()), size: 200 , combo: null},
              { type: 'checkbox', value: this.formatDate(new Date()) , size: 200, combo: null},
              { type: 'multiselect3', value: "0" , size: 200, combo: []},
              { type: 'checkbox', value: validacion, size: 80 , combo: null},
              { type: 'invisible', value:  desig[19].value , size: 0, combo: null},//numDesig
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  desig[15].value , size: 0, combo: null},//idJuzgado   
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  '' , size: 0, combo: null},
              { type: 'invisible', value:  desig[10].value , size: 0, combo: null},//anio
              { type: 'invisible', value:  desig[17].value, size: 0, combo: null},//idturno
              { type: 'invisible', value:  desig[13].value , size: 0, combo: null}];//idInstitucion
        
            if(!this.isLetrado || (this.isLetrado && newArrayCells[8].value != true && this.turnoAllow == "1")){
              let newRow: Row = {cells: newArrayCells, position: 'noCollapse'};
              rowGroup.rows.push(newRow);
              this.newActuacionesArr.push(newRow);
            }else{
              this.showMsg('error', "No tiene permiso para añadir actuaciones", '')
              this.rowGroups = this.rowGroupsAux;
              this.refreshData.emit(true);
            }
      
        }
      })
    }else{
      this.sigaServices.getParam("combo_comboAcreditacionesPorModulo", `?idModulo=${$event[0]}&idTurno=${this.idTurno}`).subscribe(
        n => {
          this.comboAcreditacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboAcreditacion);
          this.progressSpinner = false;
                          //this.cargaJuzgados.emit(true);
        //this.comboModulos = [];
        //this.comboAcreditacion = [];
        this.rowGroups.forEach((rowGroup,i) => {
          if (rowGroup.id == designacion){
            let id = Object.keys(rowGroup.rows)[0];
            let newArrayCells: Cell[];
            if(this.comboJuzgados.length != 0){
              newArrayCells= [
                { type: 'checkbox', value: false, size: 120 , combo: null},
                { type: 'multiselect1', value: this.comboJuzgados[0].value, size: 400 , combo: this.comboJuzgados},
                { type: 'input', value: desig[2].value, size: 200, combo: null},
                { type: 'input', value: desig[3].value, size: 200 , combo: null},//numProc
                { type: 'multiselect2', value: this.comboModulos[0].value, size: 400 , combo: this.comboModulos}, //modulo
                { type: 'datePicker', value: this.formatDate(new Date()), size: 200 , combo: null},
                { type: 'checkbox', value: this.formatDate(new Date()) , size: 200, combo: null},
                { type: 'multiselect3', value: this.comboAcreditacion[0].value , size: 200, combo: this.comboAcreditacion},
                { type: 'checkbox', value: validacion, size: 80 , combo: null},
                { type: 'invisible', value:  desig[19].value , size: 0, combo: null},//numDesig
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  desig[15].value , size: 0, combo: null},//idJuzgado   
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  desig[10].value , size: 0, combo: null},//anio
                { type: 'invisible', value:  desig[17].value, size: 0, combo: null},//idturno
                { type: 'invisible', value:  desig[13].value , size: 0, combo: null}];//idInstitucion
            }else{
              newArrayCells = [
                { type: 'checkbox', value: false, size: 120 , combo: null},
                { type: 'multiselect1', value: "0", size: 400 , combo: []},
                { type: 'input', value: desig[2].value, size: 200, combo: null},
                { type: 'input', value: desig[3].value, size: 200 , combo: null},//numProc
                { type: 'multiselect2', value: this.comboModulos[0].value, size: 400 , combo: this.comboModulos}, //modulo
                { type: 'datePicker', value: this.formatDate(new Date()), size: 200 , combo: null},
                { type: 'checkbox', value: this.formatDate(new Date()) , size: 200, combo: null},
                { type: 'multiselect3', value: this.comboAcreditacion[0].value , size: 200, combo: this.comboAcreditacion},
                { type: 'checkbox', value: validacion, size: 80 , combo: null},
                { type: 'invisible', value:  desig[19].value , size: 0, combo: null},//numDesig
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  desig[15].value , size: 0, combo: null},//idJuzgado   
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  '' , size: 0, combo: null},
                { type: 'invisible', value:  desig[10].value , size: 0, combo: null},//anio
                { type: 'invisible', value:  desig[17].value, size: 0, combo: null},//idturno
                { type: 'invisible', value:  desig[13].value , size: 0, combo: null}];//idInstitucion
            }
  
              if(!this.isLetrado || (this.isLetrado && newArrayCells[8].value != true && this.turnoAllow == "1")){
                let newRow: Row = {cells: newArrayCells, position: 'noCollapse'};
                rowGroup.rows.push(newRow);
                this.newActuacionesArr.push(newRow);
              }else{
                this.showMsg('error', "No tiene permiso para añadir actuaciones", '')
                this.rowGroups = this.rowGroupsAux;
                this.refreshData.emit(true);
              }
        
          }
        })
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
    }
    
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }
  cargaModulosPorJuzgado($event, designacion, rowGroup){
    this.progressSpinner = true;
    this.sigaServices.post("combo_comboModulosConJuzgado", $event).subscribe(
      n => {
        this.comboModulos = JSON.parse(n.body).combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        let data: String[] = [];
        let desig = rowGroup.rows[0].cells;
        this.idTurno = desig[17].value;
        data.push(this.comboModulos[0].value);
        data.push(this.idTurno);
        this.cargaAcreditacionesPorModulo(data, designacion, rowGroup); 
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }

  cargaModulos(designacion, rowGroup){
    this.progressSpinner = true;
    this.sigaServices.get("combo_comboModulos").subscribe(
      n => {
        this.progressSpinner = false;
        this.comboModulos = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboModulos);
        let data: String[] = [];
        let desig = rowGroup.rows[0].cells;
        this.idTurno = desig[17].value;
        data.push(this.comboModulos[0].value);
        data.push(this.idTurno);
        this.cargaAcreditacionesPorModulo(data, designacion, rowGroup); 
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }
    );
  }
  

      getParams(param){
        let parametro = new ParametroRequestDto();
        let institucionActual;
        this.sigaServices.get("institucionActual").subscribe(n => {
          institucionActual = n.value;
          parametro.idInstitucion = institucionActual;
          parametro.modulo = "SCS";
          parametro.parametrosGenerales = param;
          this.sigaServices
            .postPaginado("parametros_search", "?numPagina=1", parametro)
            .subscribe(
              data => {
                this.searchParametros = JSON.parse(data["body"]);
                this.datosBuscar = this.searchParametros.parametrosItems;
                this.datosBuscar.forEach(element => {
                  if (element.parametro == param && (element.idInstitucion == 0 || element.idInstitucion == element.idinstitucionActual)) {
                    this.valorParametro = element.valor;
                    if (param == "JUSTIFICACION_EDITAR_DESIGNA_LETRADOS"){
                      this.justActivarDesigLetrado = this.valorParametro;
                  }else if (param == "CONFIGURAR_COMBO_DESIGNA"){
                    this.configComboDesigna = this.valorParametro;
                  }
              }
          });
      });
    });
  }
  
    linkFichaActIfPermis(row, rowGroup){
      if (this.pantalla == 'JE'){
       if (this.permisosFichaAct){
          
          let des: DesignaItem = new DesignaItem();
          if (rowGroup != null){
            des.ano = rowGroup.id.split('\n')[0];
            des.idTurno = rowGroup.rows[0].cells[17].value;
            des.numero = rowGroup.rows[0].cells[19].value;
            des.idInstitucion = rowGroup.rows[0].cells[13].value;
            des.nig = rowGroup.rows[0].cells[2].value;
            des.numProcedimiento = rowGroup.rows[0].cells[3].value;
            des.idJuzgado = rowGroup.rows[0].cells[15].value;
            des.idProcedimiento = rowGroup.rows[0].cells[21].value;
            des.numColegiado = rowGroup.rows[0].cells[38].value;
            des.fechaEntradaInicio = rowGroup.rows[0].cells[9].value;
          }
        
         let act: ActuacionDesignaItem = new ActuacionDesignaItem();
         if (row != null){
          act.idTurno = row.cells[33].value;
          act.anio = row.cells[32].value;
          act.fechaActuacion = row.cells[5].value;
          act.idJuzgado = row.cells[21].value;
          act.idProcedimiento = row.cells[20].value;
          act.nig = row.cells[2].value;
          act.numProcedimiento = row.cells[3].value;
          act.idAcreditacion = row.cells[10].value;
          act.numeroAsunto = row.cells[19].value;
         }else{
          act.idTurno = rowGroup.rows[0].cells[17].value;
          act.anio = rowGroup.rows[0].cells[10].value;
          act.fechaActuacion = rowGroup.rows[0].cells[9].value;
          act.idJuzgado = rowGroup.rows[0].cells[15].value;
          act.idProcedimiento = rowGroup.rows[0].cells[21].value;
          act.nig = rowGroup.rows[0].cells[2].value;
          act.numProcedimiento = rowGroup.rows[0].cells[3].value;
          //act.idAcreditacion = rowGroup.rows[0].cells[10].value;
          //act.numeroAsunto = rowGroup.rows[0].cells[19].value;
         }

          let actuacion: Actuacion = {
            isNew: (row == null),
            designaItem: des,
            actuacion: act,
            relaciones: null
          };
          
          this.searchRelaciones(actuacion);
        }
      }
    }

    searchRelaciones(actuacion: Actuacion) {

        this.progressSpinner = true;
  
        let item = ["D" + actuacion.designaItem.ano, actuacion.designaItem.idTurno, actuacion.designaItem.idInstitucion, actuacion.designaItem.numero];
  
        this.sigaServices.post("designacionesBusquedaRelaciones", item).subscribe(
          n => {
  
            let relaciones = JSON.parse(n.body).relacionesItem;
            let error = JSON.parse(n.body).error;
  
            if (error != null && error.description != null) {
              this.showMsg('info', this.translateService.instant("general.message.informacion"), error.description);
            } else {
              actuacion.relaciones = relaciones;
            }
            this.progressSpinner = false;
            
          },
          err => {
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            sessionStorage.setItem("actuacionDesignaJE", JSON.stringify(actuacion));
            this.router.navigate(['/fichaActDesigna']);
          }
        );
    }
  }
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}