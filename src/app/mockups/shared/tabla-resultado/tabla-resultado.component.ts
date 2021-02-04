import { Component, Input, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-tabla-resultado',
  templateUrl: './tabla-resultado.component.html',
  styleUrls: ['./tabla-resultado.component.scss'],
})

export class TablaResultadoComponent implements OnInit {
  @Input() cabeceras = [];
  @Input() elementos = [];
  @Input() elementosAux = [];
  ids = [];
  sortedData = [];
  searchText = [];
  objArray = [];
  interface = {};
  numColumnas = 0;

  constructor() {
  }
  ngOnInit(): void {
    this.cabeceras.forEach(cab => {
      this.ids.push(cab.id);
    });
    let _temp = {};
    this.ids.forEach(id => {
      _temp[id] = "";
      this.numColumnas = this.numColumnas + 1;
    })
    this.interface = _temp;
    this.elementToSortedData();
  }
  toNumber(variable: any) {
    return Number(variable);
  }
  elementToSortedData() {
    this.objArray = [];
    for (let i = 0; i < this.elementos.length; i++) {
      for (let j = 0; j < this.cabeceras.length; j++) {
        const jReverse = this.numColumnas - 1 - j;
        const campo = this.elementos[i][jReverse].toString();
        this.interface[this.ids[jReverse]] = campo;
      }
      this.objArray.push(Object.assign({}, this.interface));
    }

    this.sortedData = this.objArray.slice();
    console.log("file: tabla-resultado.component.ts ~ line 44 ~ TablaResultadoComponent ~ elementToSortedData ~ this.ids", this.ids);
    console.log("file: tabla-resultado.component.ts ~ line 49 ~ TablaResultadoComponent ~ elementToSortedData ~ this.sortedData", this.sortedData);
  }

  sortData(sort: Sort) {
    const data = this.objArray.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      let resultado;
      this.ids.forEach(id => {
        resultado = compare(a[id], b[id], isAsc);
      })
      return resultado;
    });
  }

  searchChange(i: any) {
    this.elementos = this.elementosAux.filter((row) => {
      let isReturn = true;
      for (let i = 0; i < row.length; i++) {
        if (
          this.searchText[i] != " " &&
          this.searchText[i] != undefined &&
          !row[i].toString().toLowerCase().includes(this.searchText[i].toLowerCase())
        ) {
          isReturn = false;
        }
      }
      if (isReturn) {
        return row;
      }
    });
    this.elementToSortedData();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}