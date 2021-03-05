import { ElementRef, Renderer2, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { RowGroup } from './tabla-resultado-desplegable-je.service';
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
  @Output() anySelected = new EventEmitter<any>();
  cabecerasMultiselect = [];
  modalStateDisplay = true;
  searchText = [];
  selectedHeader = [];
  positionsToDelete = [];
  numColumnasChecked = 0;
  selected = false;
  selectedArray = [];
  RGid = "inicial";
  down = false;
  @ViewChild('table') table: ElementRef;
  itemsaOcultar = [];
  textSelected: string = "{0} visibles";


  constructor(
    private renderer: Renderer2
  ) {
    this.renderer.listen('window', 'click', (event: { target: HTMLInputElement; }) => {
      for (let i = 0; i < this.table.nativeElement.children.length; i++) {

        if (!event.target.classList.contains("selectedRowClass")) {
          this.selected = false;
          this.selectedArray = [];
        }
      }
    });
  }

  ngOnInit(): void {
    this.cabeceras.forEach(cab => {
      this.selectedHeader.push(cab);
      this.cabecerasMultiselect.push(cab.name);
    });
  }

  selectRow(rowSelected, rowId) {
    this.selected = true;
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
    console.log('data: ', data)
    data = data.slice();
    console.log('data slice: ', data)
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
    if (j == 0) {
      let isReturn = true;
      let isReturnArr = [];
      this.rowGroups = this.rowGroupsAux.filter((row) => {
        row.rows.forEach(cell => {
          for (let i = 0; i < cell.cells.length; i++) {
            if (
              this.searchText[j] != " " &&
              this.searchText[j] != undefined && !row.id.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
            ) {
              isReturn = false;
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
        row.rows.forEach(cell => {
          for (let i = 0; i < cell.cells.length; i++) {
            if (
              this.searchText[j] != " " &&
              this.searchText[j] != undefined &&
              !cell.cells[i].value.toString().toLowerCase().includes(this.searchText[j].toLowerCase())
            ) {
              isReturn = false;
            } else {
              isReturn = true;
            }
            isReturnArr.push(isReturn);
          }
        })
        if (isReturnArr.includes(true)) {
          return row;
        }
      });
    }
  }

  isPar(numero): boolean {
    return numero % 2 === 0;
  }

  validaCheck(texto) {
    return texto === 'Si';
  }

  ocultarColumna(event) {

    if (event.itemValue == undefined && event.value.length == 0) {
      this.cabeceras.forEach(element => {
        this.renderer.addClass(document.getElementById(element.id), "collapse");
      });
      this.getPosition(this.cabeceras);
      this.itemsaOcultar = this.cabeceras;
    }

    if (event.itemValue == undefined && event.value.length > 0) {
      this.cabeceras.forEach(element => {
        this.renderer.removeClass(document.getElementById(element.id), "collapse");
      });
      this.getPosition([]);
      this.itemsaOcultar = [];
    }

    if (event.itemValue != undefined && event.value.length >= 0) {

      let ocultar = true;
      event.value.forEach(element => {
        if (element.id == event.itemValue.id) {
          ocultar = false;
        }
      });

      if (ocultar) {
        this.renderer.addClass(document.getElementById(event.itemValue.id), "collapse");
        this.itemsaOcultar.push(event.itemValue);
      } else {
        this.renderer.removeClass(document.getElementById(event.itemValue.id), "collapse");
        this.itemsaOcultar.forEach((element, index) => {
          if (element.id == event.itemValue.id) {
            this.itemsaOcultar.splice(index, 1);
          }
        });

      }

      this.getPosition(this.itemsaOcultar);

    }

  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}