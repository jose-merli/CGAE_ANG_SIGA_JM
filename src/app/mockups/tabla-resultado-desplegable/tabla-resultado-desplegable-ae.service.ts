import { Injectable } from '@angular/core';
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
}
@Injectable()
export class TablaResultadoDesplegableAEService {

  result = {
    data: [
      {
        "A2019/123": [
          {
            a1: [
              { type: 'text', value: 'SANDRA SFDSGDS DSGDGSF' },
              { type: 'text', value: '' },
              { type: 'link', value: 'E2018/0001' },
              { type: 'text', value: '10/10/2010 9:45' },
              { type: 'text', value: 'COMISARÍA CENTRO ALICANTE' },
              { type: 'number', value: '667890' },
            ],
          },
          {
            a2: [
              { type: 'text', value: 'SANDRA SFDSGDS DSGDGSF' },
              { type: 'text', value: '' },
              { type: 'link', value: 'E2018/0001' },
              { type: 'text', value: '10/10/2010 9:45' },
              { type: 'text', value: 'COMISARÍA CENTRO ALICANTE' },
              { type: 'number', value: '667890' },
            ],
          },
          {
            a3: [
              { type: 'text', value: 'SANDRA SFDSGDS DSGDGSF' },
              { type: 'text', value: '' },
              { type: 'link', value: 'E2018/0001' },
              { type: 'text', value: '10/10/2010 9:45' },
              { type: 'text', value: 'COMISARÍA CENTRO ALICANTE' },
              { type: 'number', value: '667890' },
            ],
          }
        ],
      },
      {
        "A2019/124": [
          {
            b1: [
              { type: '5InputSelector', value: [123, 'PEREZ', 'ROMERO', 'JUAN', 'HOMBRE'] },
              { type: '2SelectorInput', value: '' },
              { type: 'link', value: '' },
              { type: 'datePicker', value: '' },
              { type: 'buttomSelect', value: ['C / J', 'COMISARÍA CENTRO ALICANTE', 'PRUEBA J', 'C'] },
              { type: 'input', value: '' },
            ],
          },
          {
            b2: [
              { type: '5InputSelector', value: [123, 'PEREZ', 'ROMERO', 'JUAN', 'HOMBRE'] },
              { type: '2SelectorInput', value: '' },
              { type: 'link', value: '' },
              { type: 'datePicker', value: '' },
              { type: 'buttomSelect', value: ['C / J', 'COMISARÍA CENTRO ALICANTE', 'PRUEBA J', 'C'] },
              { type: 'input', value: '' },
            ],
          }
        ],
      },
    ],
  };
  constructor() {}

  public getTableData() {
    let rowGroups: RowGroup[] = [];

    this.result.data.forEach((rowGroup, index) => {
      let rowGroupObject: RowGroup = new RowGroup();
      let rows: Row[] = [];
      Array.from(Object.values(rowGroup)[0]).forEach((row) => {
        let rowObject: Row = new Row();
        let cells: Cell[] = [];
        Array.from(Object.values(row)[0]).forEach((cell) => {
          let cellObject: Cell = new Cell();
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
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
