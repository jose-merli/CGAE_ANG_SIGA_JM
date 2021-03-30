import { Injectable } from '@angular/core';
export class Row {
  cells: Cell[];
}
export class Cell {
  type: string;
  value: any;
  combo: Combo[];
  italic: boolean;
}
export class Combo {
  label: string;
  value: string;
}
@Injectable()
export class GestionBajasTemporalesService {
  constructor() { }
  public getTableData(result) {
    let finalRows: Row[] = [];
    result.forEach((rows) => {
      let rowObject: Row = new Row();
      let cells: Cell[] = [];
      rows.forEach((cell) => {
        let cellObject: Cell = new Cell();
        if (cell['type'] == 'multiselect' || cell['type'] == 'select') {
          cellObject.type = cell['type'];
          cellObject.combo = cell['combo'];
          cellObject.value = cell['value'];
        } else {
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
        }
        cellObject.italic = cell['italic'];
        cells.push(cellObject);
      });
      rowObject.cells = cells;
      finalRows.push(rowObject);
    });
    return finalRows;
  }
}
