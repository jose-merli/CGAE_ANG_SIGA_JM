import { DatePipe } from '@angular/common';
import { ElementRef, Renderer2, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { Cell, Row, RowGroup } from './tabla-resultado-desplegable-je.service';
@Component({
  selector: 'app-tabla-resultado-desplegable',
  templateUrl: './tabla-resultado-desplegable.component.html',
  styleUrls: ['./tabla-resultado-desplegable.component.scss']
})
export class TablaResultadoDesplegableComponent implements OnInit {
  info = new FormControl();
  @Input() cabeceras = [];
  @Input() rowGroups: RowGroup[];
  @Input() rowGroupsAux: RowGroup[];
  @Input() seleccionarTodo = false;
  @Input() pantalla: string = '';
  @Input() s = false;
  @Input() colegiado;
  @Output() anySelected = new EventEmitter<any>();
  @Output() designasToDelete = new EventEmitter<any[]>();
  @Output() actuacionesToDelete = new EventEmitter<any[]>();
  @Output() actuacionToAdd = new EventEmitter<Row>();
  @Output() dataToUpdate = new EventEmitter<RowGroup[]>();
  
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
  @ViewChild('table') table: ElementRef;
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

  @Input() comboModulos: any [];
  @Input() comboJuzgados: any [];
  @Input() comboAcreditacionesPorModulo: any [];
  @Input() comboJuzgadosPorInstitucion: any [];

  @Output() cargaJuzgadosPorInstitucion = new EventEmitter<String>();
  @Output() cargaModulosPorJuzgado = new EventEmitter<String>();
  @Output() cargaAcreditacionesPorModulo = new EventEmitter<String>();

  dataToUpdateArr: RowGroup[] = [];
  constructor(
    private renderer: Renderer2,
    private datepipe: DatePipe
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
    this.cabeceras.forEach(cab => {
      this.selectedHeader.push(cab);
      this.cabecerasMultiselect.push(cab.name);
    });
    this.totalRegistros = this.rowGroups.length;
  }

  selectRow(rowSelected, rowId, child) {
    console.log('rowId: ', rowId)
    console.log('child: ', child)
    this.selected = true;
    if (child != undefined){
      if (this.selecteChild.includes({[rowId] : child})) {
        const i = this.selecteChild.indexOf({[rowId] : child});
        this.selecteChild.splice(i, 1);
      } else {
        this.selecteChild.push({[rowId] : child});
      }
      console.log('this.selecteChild 1: ', this.selecteChild)
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
    } else {
      this.anySelected.emit(false);
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
    } else {
      let j = 0;
      this.rowGroups = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        let resultado;
        for (let i = 0; i < a.rows[j].cells.length; i++) {
          resultado = compare(a.rows[j].cells[i].value, b.rows[j].cells[i].value, isAsc);
        }
        j++;
        return resultado;
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
    console.log(' rowWrapper.children: ',  rowWrapper.children)
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
    if (j == 0) {
      let isReturn = true;
      let isReturnArr = [];
      console.log('this.rowGroupsAux 1: ', this.rowGroupsAux)
      this.rowGroups = this.rowGroupsAux.filter((row) => {
        console.log('row 1: ', row)
        row.rows.forEach(cell => {
          for (let i = 0; i < cell.cells.length; i++) {
            if (
              this.searchText[j] != " " &&
              this.searchText[j] != undefined && !row.id.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
            ) {
              isReturn = false;
            } else {
              isReturn = true;
            }
          }
        })
        if (isReturn) {
          return row;
        }
      });
    } else {
      let isReturn = true;
      let isReturnArr = [];
      this.rowGroups = this.rowGroupsAux.filter((row) => {
        isReturnArr = [];
  
          for (let r = 0; r < row.rows.length; r++) {
          for (let i = 0; i < row.rows[r].cells.length; i++) {
            if (row.rows[r].cells[i].value != null){
            if (
              this.searchText[j] != " " &&
              this.searchText[j] != undefined &&
              this.searchText[j] != null &&
              !row.rows[r].cells[i].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
            ) {
              isReturn = false;
            } else {
              isReturn = true;
            }
            isReturnArr.push(isReturn);
          }
         }
    
        }
        if (isReturnArr.includes(true)) {
          return row;
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
  fillFecha(event, cell, rowId) {
    cell.value = this.datepipe.transform(event, 'dd/MM/yyyy');
    this.rowIdsToUpdate.push(rowId);
  }
  checkBoxChange(event, rowId){
    this.rowIdsToUpdate.push(rowId);
  }

  changeSelect(row, cell, rowId){
    this.rowIdsToUpdate.push(rowId);
  }

  inputChange(vent, rowId){
    this.rowIdsToUpdate.push(rowId);
  }

  ocultarColumna(event) {

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

      if (ocultar) {
        console.log('(event.itemValue.id: ', event.itemValue.id)
        this.renderer.addClass(document.getElementById(event.itemValue.id), "collapse");
        this.itemsaOcultar.push(event.itemValue);
        console.log(' this.columnsSizes: ',  this.columnsSizes)
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

  toDoButton(type, designacion, rowWrapper){
    if (type == 'Nuevo'){

      this.rowGroups.forEach((rowGroup,i) => {
        if (rowGroup.id == designacion){
          let id = Object.keys(rowGroup.rows)[0];
          console.log('id: ', id)
          let newArrayCells: Cell[] = [
            { type: 'checkbox', value: false, size: 50 , combo: null},
            { type: 'multiselect', value: '',size: 153 , combo: {}},
            { type: 'input', value: '', size: 15, combo: null},
            { type: 'input', value: '', size: 153 , combo: null},
            { type: 'select', value: '', size: 153 , combo: null}, //modulo
            { type: 'datePicker', value: '', size: 153 , combo: null},
            { type: 'datePicker', value: '' , size: 153, combo: null},
            { type: 'input', value: '' , size: 50, combo: null},
            // { type: 'checkbox', value: obj.val }
            { type: 'checkbox', value: false, size: 50 , combo: null},
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
            { type: 'invisible', value:  '' , size: 0, combo: null}];
          
          let newRow: Row = {cells: newArrayCells, position: 'noCollapse'};
          rowGroup.rows.push(newRow);
         this.newActuacionesArr.push(newRow);
        }
      })
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

  guardar(){
    //1. Guardar nuevos
    console.log('this.rowGroups: ', this.rowGroups)
    this.newActuacionesArr.forEach( newAct => {
      this.actuacionToAdd.emit(newAct);
    });
    this.newActuacionesArr = []; //limpiamos

    //2. Actualizar editados
    let rowIdsToUpdateNOT_REPEATED = new Set(this.rowIdsToUpdate);
    this.rowIdsToUpdate = Array.from(rowIdsToUpdateNOT_REPEATED);
  console.log('rowIdsToUpdate: ', this.rowIdsToUpdate)
    this.rowGroups.forEach(row => {
      console.log('row.id: ', row.id)
      console.log('this.rowIdsToUpdate.indexOf(row.id.toString()): ', this.rowIdsToUpdate.indexOf(row.id.toString()))
      if(this.rowIdsToUpdate.indexOf(row.id.toString()) >= 0){
        this.dataToUpdateArr.push(row);
        console.log('dataToUpdateArr: ', this.dataToUpdateArr)
      }
    })
    console.log('dataToUpdateArr: ', this.dataToUpdateArr)
    this.dataToUpdate.emit(this.dataToUpdateArr);
    this.rowIdsToUpdate = []; //limpiamos
    //this.dataToUpdateArr = []; //limpiamos
  }

  eliminar(){
    let deletedDesig = [];
    let deletedAct = [];
    this.rowGroups.forEach((rowG, i) => {
      //1. Eliminamos designaciones
      this.selectedArray.forEach(idToDelete => {
      if (rowG.id == idToDelete){
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
          rowG.rows.splice(this.childNumber, 1);
          deletedAct.push(rowG.rows[this.childNumber].cells)
         
        }
        });
      })

    }
    });
    this.totalRegistros = this.rowGroups.length;

    console.log('EMIT deletedAct: ', deletedAct)
    this.actuacionesToDelete.emit(deletedAct);
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}