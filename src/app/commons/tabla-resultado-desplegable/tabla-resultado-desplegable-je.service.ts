import { Injectable } from '@angular/core';

@Injectable()
export class RowGroup {
  id: string;
  rows: Row[];
}

export class Row {
  cells: Cell[];
}

export class Cell {
  type: string;
  value: string;
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
                { type: '', value: '' },
              ],
            }
          ],
        },
        {
          "": [
            {
              b1: [
                { type: '', value: '' },
              ],
            
            },
          ],
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
        Array.from(Object.values(row)[0]).forEach((cell) => {
          let cellObject: Cell = new Cell();
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
          cellObject.size = cell['size'];
          cells.push(cellObject);
        });
        rowObject.cells = cells;
        rows.push(rowObject);
      });
      rowGroupObject.id = Object.keys(rowGroup)[0];
      rowGroupObject.rows = rows;

      rowGroups.push(rowGroupObject);
    });
    return rowGroups;
  }
}