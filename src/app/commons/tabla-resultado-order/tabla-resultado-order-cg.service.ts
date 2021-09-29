import { Injectable } from '@angular/core';

@Injectable()
export class Row {
  cells: Cell[];
}

export class Cell {
  type: string;
  value: string;
}
export class TablaResultadoOrderCGService {

  result = [
    [
      { type: 'input', value: '1' },
      { type: 'position', value: '1' },
      { type: 'text', value: '9567' },
      { type: 'text', value: 'MARIA FHHGGH FHFHFH' },
      { type: 'text', value: '23/02/2018' },
      { type: 'text', value: '23/02/2020' },
      { type: 'text', value: '1' },
      { type: 'text', value: '1' }
    ],
    [
      { type: 'input', value: '1' },
      { type: 'position', value: '2' },
      { type: 'text', value: '3567' },
      { type: 'text', value: 'ANA FHHGGH FHFHFH' },
      { type: 'text', value: '26/02/2018' },
      { type: 'text', value: '26/02/2020' },
      { type: 'text', value: '2' },
      { type: 'text', value: '2' }
    ],
    [
      { type: 'input', value: '1' },
      { type: 'position', value: '3' },
      { type: 'text', value: '3568' },
      { type: 'text', value: 'VICTOR FHHGGH FHFHFH' },
      { type: 'text', value: '26/02/2018' },
      { type: 'text', value: '26/02/2020' },
      { type: 'text', value: '3' },
      { type: 'text', value: '3' }
    ],
    [
      { type: 'input', value: '1' },
      { type: 'position', value: '4' },
      { type: 'text', value: '3569' },
      { type: 'text', value: 'ROCIO FHHGGH FHFHFH' },
      { type: 'text', value: '26/02/2018' },
      { type: 'text', value: '26/02/2020' },
      { type: 'text', value: '4' },
      { type: 'text', value: '4' }
    ],
    [
      { type: 'input', value: '' },
      { type: 'input', value: '' },
      { type: 'text', value: '6567' },
      { type: 'text', value: 'PACO FHHGGH FHFHFH' },
      { type: 'text', value: '16/02/2018' },
      { type: 'text', value: '16/02/2020' },
      { type: 'text', value: '5' },
      { type: 'text', value: '5' }
    ],
    [
      { type: 'input', value: '2' },
      { type: 'position', value: '1' },
      { type: 'text', value: '2567' },
      { type: 'text', value: 'JUAN FHHGGH FHFHFH' },
      { type: 'text', value: '13/02/2018' },
      { type: 'text', value: '13/02/2020' },
      { type: 'text', value: '1' },
      { type: 'text', value: '1' }
    ],
    [
      { type: 'input', value: '2' },
      { type: 'position', value: '2' },
      { type: 'text', value: '1567' },
      { type: 'text', value: 'SERGIO FHHGGH FHFHFH' },
      { type: 'text', value: '12/02/2018' },
      { type: 'text', value: '12/02/2020' },
      { type: 'text', value: '2' },
      { type: 'text', value: '2' }
    ],
    [
      { type: 'input', value: '2' },
      { type: 'position', value: '3' },
      { type: 'text', value: '4567' },
      { type: 'text', value: 'LUCIA FHHGGH FHFHFH' },
      { type: 'text', value: '12/02/2018' },
      { type: 'text', value: '12/02/2020' },
      { type: 'text', value: '3' },
      { type: 'text', value: '3' }
    ],
    [
      { type: 'input', value: '3' },
      { type: 'position', value: '1' },
      { type: 'text', value: '7567' },
      { type: 'text', value: 'MIGUEL FHHGGH FHFHFH' },
      { type: 'text', value: '12/02/2018' },
      { type: 'text', value: '12/02/2020' },
      { type: 'text', value: '1' },
      { type: 'text', value: '1' }
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

