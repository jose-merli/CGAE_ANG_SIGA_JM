import { Injectable } from '@angular/core';

@Injectable()

export class Row {
  cells: Cell[];
}

export class Cell {
  type: string;
  value: string;
}
export class TablaResultadoMixFCService {

  result = [
            [
              { type: 'text', value: 'SERVICIO ASESORAMIENTO AL JOVEN ALICANTE' },
              { type: 'text', value: 'Asesoramiento al joven' },
              { type: 'text', value: 'Si' },
              { type: 'text', value: '13' }
            ],
            [
              { type: 'text', value: 'SERVICIO ASESORAMIENTO AL JOVEN ALICANTE' },
              { type: 'text', value: 'Asesoramiento al joven' },
              { type: 'text', value: 'No' },
              { type: 'text', value: '10' }
            ],
            [
              { type: 'select', value: 'SERVICIO ASESORAMIENTO AL JOVEN ALICANTE' },
              { type: 'select', value: 'Asesoramiento al joven' },
              { type: 'select', value: 'No' },
              { type: 'text', value: '25' },
            ]
          ];
  constructor() {}

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
