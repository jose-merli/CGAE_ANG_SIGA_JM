import { Injectable } from '@angular/core';

export class Row {
  id: number;
  cells: Cell[];
  italic: boolean;
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
export class TablaResultadoMixSaltosCompOficioService {

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
        cells.push(cellObject);
      });

      rowObject.id = rows.id;
      rowObject.cells = cells;
      rowObject.italic = rows.italic;
      finalRows.push(rowObject);
    });
    return finalRows;
  }

}
