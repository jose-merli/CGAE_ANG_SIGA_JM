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
}
export class TablaResultadoDesplegableJEService {

  result = {
    data: [
      {
        "D2019/234567 - 03/04/2020": [
          {
            a1: [
              { type: 'text', value: 'E2018/2323' },
              { type: 'text', value: 'SUEICVRE IBPPBT, JUAN MANUEL' },
              { type: 'checkbox', value: 'No' },
              { type: 'textTooltip', value: ['JUZGADO DE LO SOCIAL Nº 5', 'AS5'] },
              { type: 'text', value: '2433423423442' },
              { type: 'text', value: 'P.A. 1521/16 R' },
              { type: 'select', value: '(B-17) 1238' },
              { type: 'datePicker', value: '05/04/2020' },
              { type: 'text', value: '08/04/2020' },
              { type: 'buttom', value: 'Nuevo' },
              { type: 'checkbox', value: 'Si' },
            ],
          },
          {
            a2: [
              { type: 'text', value: 'E2018/2323' },
              { type: 'text', value: 'SUEICVRE IBPPBT, JUAN MANUEL' },
              { type: 'checkbox', value: 'No' },
              { type: 'textTooltip', value: ['JUZGADO DE LO SOCIAL Nº 5', 'AS5'] },
              { type: 'text', value: '2433423423442' },
              { type: 'text', value: 'P.A. 1521/16 R' },
              { type: 'text', value: '(B-17) 1538' },
              { type: 'checkbox', value: 'No' },
              { type: 'text', value: '09/04/2020' },
              { type: 'text', value: 'Incidente (50%)(50%)' },
              { type: 'checkbox', value: 'No' },
            ],
          },
          {
            a3: [
              { type: 'text', value: 'E2018/2323' },
              { type: 'text', value: 'SUEICVRE IBPPBT, JUAN MANUEL' },
              { type: 'checkbox', value: 'Si' },
              { type: 'textTooltip', value: ['JUZGADO DE LO SOCIAL Nº 5', 'AS5'] },
              { type: 'text', value: '2433423423442' },
              { type: 'text', value: 'P.A. 1521/16 R' },
              { type: 'text', value: '(B-17) 1638' },
              { type: 'text', value: '06/04/2020' },
              { type: 'text', value: '09/04/2020' },
              { type: 'text', value: 'Incidente (50%)(50%)' },
              { type: 'checkbox', value: 'Si' },
            ],
          }
        ],
      },
      {
        "D2019/356567 - 06/04/2020": [
          {
            b1: [
              { type: 'text', value: 'E2018/343' },
              { type: 'text', value: 'BIGGYCH NOKTHYOP, PEDRO' },
              { type: 'checkbox', value: 'No' },
              { type: 'textTooltip', value: ['JUZGADO DE LO SOCIAL Nº 5', 'AS5'] },
              { type: 'text', value: '2433423423442' },
              { type: 'text', value: 'D.U. 39/19' },
              { type: 'select', value: '(B-17) 1938' },
              { type: 'datePicker', value: '07/04/2020' },
              { type: 'text', value: '10/04/2020' },
              { type: 'text', value: 'Incidente (50%)(50%)' },
              { type: 'checkbox', value: 'Si' },
            ],
          },
          {
            b2: [
              { type: 'text', value: 'E2018/343' },
              { type: 'text', value: 'BIGGYCH NOKTHYOP, PEDRO' },
              { type: 'checkbox', value: 'Si' },
              { type: 'textTooltip', value: ['JUZGADO DE LO SOCIAL Nº 5', 'AS5'] },
              { type: 'text', value: '2433423423442' },
              { type: 'text', value: 'D.U. 39/19' },
              { type: 'text', value: '(B-18) 2338' },
              { type: 'text', value: '12/04/2020' },
              { type: 'checkbox', value: '' },
              { type: 'text', value: 'Incidente (50%)(50%)' },
              { type: 'checkbox', value: 'Si' },
            ],
          },
          {
            b3: [
              { type: 'text', value: 'E2018/343' },
              { type: 'text', value: 'BIGGYCH NOKTHYOP, PEDRO' },
              { type: 'checkbox', value: 'No' },
              { type: 'textTooltip', value: ['JUZGADO DE LO SOCIAL Nº 5', 'AS5'] },
              { type: 'text', value: '2433423423442' },
              { type: 'text', value: 'D.U. 39/19' },
              { type: 'text', value: '(B-18) 8648' },
              { type: 'text', value: '01/04/2020' },
              { type: 'text', value: '02/04/2020' },
              { type: 'buttom', value: 'Nuevo' },
              { type: 'checkbox', value: 'Si' },
            ],
          },
        ],
      },
    ],
  };
  constructor() { }

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
