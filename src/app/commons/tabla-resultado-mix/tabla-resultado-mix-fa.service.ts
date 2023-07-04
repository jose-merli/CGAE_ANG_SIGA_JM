import { Injectable } from '@angular/core';

@Injectable()

export class Row {
  cells: Cell[];
}

export class Cell {
  type: string;
  value: string;
}
export class TablaResultadoMixFAService {

  result = [
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: '2 Inic. DILIGENCIAS INDETERMINADAS' },
      { type: 'text', value: 'Justificación Actuación' },
      { type: 'text', value: 'documentoX.txt' },
      { type: 'input', value: '' }
    ],
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: '2 Inic. DILIGENCIAS INDETERMINADAS' },
      { type: 'text', value: 'Justificación Actuación' },
      { type: 'text', value: 'TOLEDO_30112015_REV2_59722.xls' },
      { type: 'input', value: 'hsbdgfdgsfdgs' }
    ],
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: '2 Inic. DILIGENCIAS INDETERMINADAS' },
      { type: 'select', value: 'Justificación Actuación' },
      { type: 'download', value: 'TOLEDO_30112015_REV2_59722.xls' },
      { type: 'input', value: '' }
    ]
  ];
  constructor() { }

  public getTableData() {
    let finalRows: Row[] = [];
    this.result.forEach((rows) => {
      let rowObject: Row = new Row();
      let cells: Cell[] = [];
      rows.forEach((cell) => {
        let cellObject: Cell = new Cell();
        cellObject.type = cell['type'];
        cellObject.value = cell['value'];
        cells.push(cellObject);
      });
      rowObject.cells = cells;
      finalRows.push(rowObject);
    });
    return finalRows;
  }
}
