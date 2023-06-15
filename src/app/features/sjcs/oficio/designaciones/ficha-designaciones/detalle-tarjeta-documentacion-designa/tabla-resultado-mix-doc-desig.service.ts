import { Injectable } from '@angular/core';

export class Row {
  id: number;
  cells: Cell[];
}

export class Cell {
  type: string;
  value: any;
  combo: Combo[];
  header: string;
  disabled: boolean;
}

export class Combo {
  label: string;
  value: string;
}

@Injectable()
export class TablaResultadoMixDocDesigService {

  constructor() { }

  public getTableData(result) {
    let finalRows: Row[] = [];
    result.forEach((rows) => {
      let rowObject: Row = new Row();
      let cells: Cell[] = [];
      rows.row.forEach((cell) => {
        let cellObject: Cell = new Cell();
        if (cell['type'] == 'multiselect' || cell['type'] == 'select') {
          cellObject.type = cell['type'];
          cellObject.combo = cell['combo'];
          cellObject.value = cell['value'];
        } else {
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
        }
        cellObject.header = cell['header'];
        cellObject.disabled = cell['disabled'];
        cells.push(cellObject);
      });

      rowObject.id = rows.id;
      rowObject.cells = cells;
      finalRows.push(rowObject);
    });
    return finalRows;
  }

}
