import { Injectable } from '@angular/core';

@Injectable()
export class RowGroup {
  id: string;
  rows: Row[];
  id2: string;
  id3: string;
  estadoDesignacion: string;
}

export class Row {
  cells: Cell[];
  position: string;
}

export class Cell {
  type: string;
  value: any;
  size: number;
}

export class TablaResultadoDesplegableJEService {
  constructor() { }

  public getTableData(result) {
    let resultado = {
      data: [
        {
          "": [
            {
              a1: [
                { type: '', value: '' , size: ''},
              ],
              position: 'collapse'
            }
          ],
          "1": "",
          "2": "",
          "estadoDesignacion": "",
        },

        {
          "": [
            {
              b1: [
                { type: '', value: '', size: '' },
              ],
              position: 'collapse'
            
            },
          ],
          "1": "",
          "2": "",
          "estadoDesignacion": "",
        },
      ],
    };
  
    resultado = result;
    let rowGroups: RowGroup[] = [];
    resultado.data.forEach((rowGroup, index) => {
      let rowGroupObject: RowGroup = new RowGroup();
      let rows: Row[] = [];
      Array.from(Object.values(rowGroup)[0]).forEach((row) => {
        let rowObject: Row = new Row();
        let cells: Cell[] = [];
        let position: String;
        Array.from(Object.values(row)[0]).forEach((cell) => {
          let cellObject: Cell = new Cell();
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
          cellObject.size = cell['size'];
          cells.push(cellObject);
        });
        rowObject.cells = cells;
        rowObject.position = Object.values(row)[1];
        rows.push(rowObject);
      });

      rowGroupObject.id = Object.keys(rowGroup)[0];
      rowGroupObject.id2 = Object.keys(rowGroup)[1];
      rowGroupObject.id3 = Object.keys(rowGroup)[2];
      rowGroupObject.estadoDesignacion = Object.keys(rowGroup)[3];
      rowGroupObject.rows = rows;

      rowGroups.push(rowGroupObject);
    });
    return rowGroups;
  }
}