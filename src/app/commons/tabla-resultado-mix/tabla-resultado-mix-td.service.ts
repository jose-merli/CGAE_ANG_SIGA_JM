import { Injectable } from '@angular/core';

@Injectable()
export class Row {
  cells: Cell[];
}

export class Cell {
  type: string;
  value: string;
}
export class TablaResultadoMixTDService {

  result = [
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: 'Designación' },
      { type: 'text', value: 'Justificante de actuación' },
      { type: 'text', value: 'documentoX.txt' },
      { type: 'input', value: 'Euskara ResultadoConsulta' }
    ],
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: 'Designación' },
      { type: 'text', value: 'Solicitud de Justicia Gratuita' },
      { type: 'text', value: 'documentoY.xls' },
      { type: 'input', value: 'Euskara ResultadoConsulta' }
    ],
    [
      { type: 'datePicker', value: '28/08/2007' },
      { type: 'select', value: 'Asesoramiento al joven' },
      { type: 'select', value: 'Solicitud de Justicia Gratuita' },
      { type: 'download', value: 'documentoX.txt' },
      { type: 'input', value: 'Euskara ResultadoConsulta' }
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

