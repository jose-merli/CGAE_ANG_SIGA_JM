import { ElementRef, Renderer2 } from '@angular/core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { RowGroup } from '../tabla-resultado-desplegable-je.service';
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
  modalStateDisplay = true;
  searchText = [];
  selectedHeader;
  positionsToDelete = [];
  numCabeceras = 0;
  RGid = "inicial";
  down = false;
  @ViewChild('table') table: ElementRef;
  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.numCabeceras = this.cabeceras.length;
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
  }
  getPosition(selectedHeaders) {
    this.positionsToDelete = [];
    if (selectedHeaders != undefined) {
      let i = -1;
      this.cabeceras.forEach(cabecera => {
        selectedHeaders.forEach(selected => {
          if (selectedHeaders != undefined && selectedHeaders.toString().toLowerCase().includes(cabecera.value.toString().toLowerCase())) {
            this.positionsToDelete.push(i);
          }
        })
        i++;
      })
    }
    let mySet = new Set(this.positionsToDelete);
    this.positionsToDelete = [/*...mySet*/];
    return this.positionsToDelete;
  }

  cabeceraOculta(selectedHeaders, cabecera, borderedHeader, borderedCell) {
    let pos;
    let ocultar = false;
    if (selectedHeaders != "" && selectedHeaders != undefined && selectedHeaders.toString().toLowerCase().includes(cabecera.toLowerCase())) {
      ocultar = true;
    }
    pos = this.getPosition(selectedHeaders);
    return ocultar;
  }
  posicionOcultar(z) {
    if (this.positionsToDelete != undefined && this.positionsToDelete != []) {
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

  isPar(numero):boolean {
    return numero % 2 === 0;
  }

  validaCheck(texto) {
    return texto === 'Si';
  }

}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}