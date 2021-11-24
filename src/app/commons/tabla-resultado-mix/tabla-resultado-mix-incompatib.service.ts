import { Injectable } from '@angular/core';

@Injectable()
export class Row {
  id: number;
  cells: Cell[];
}

export class Cell {
  type: string;
  value: any;
  combo: Combo[];
  size: number;
  disabled : boolean;
}

export class Combo {
  label: string;
  value: string;
}
export class TablaResultadoMixIncompService {

  /*result = [
    id: 1,
    cells: 
    [ 
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: 'Designación' },
      { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                     {label: "Fact Ayto. Alicante - As. Joven", value: "2"}] },
      { type: 'input', value: 'documentoX.txt' },
      { type: 'input', value: 'Euskara ResultadoConsulta' }
    ],
    id: 2,
    cells: 
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: 'Designación' },
      { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                    {label: "Fact Ayto. Alicante - As. Joven", value: "2"}]},
      { type: 'input', value: 'documentoX.txt' },
      { type: 'input', value: 'Euskara ResultadoConsulta' }
    ],
    id: 3,
    cells: 
    [
      { type: 'text', value: '28/08/2007' },
      { type: 'text', value: 'Designación' },
      { type: 'multiselect', combo: [{label: "Fact Ayto. Alicante - As. Joven", value: "1"},
                                    {label: "Fact Ayto. Alicante - As. Joven", value: "2"}] },
      { type: 'input', value: 'documentoX.txt' },
      { type: 'input', value: 'Euskara ResultadoConsulta' }
    ]
  ];*/
  constructor() { }

  public getTableData(result) {
    let finalRows: Row[] = [];
    result.forEach((rows => {
      let rowObject: Row = new Row();
      let cells: Cell[] = [];
      rows.cells.forEach((cell) => {
        let cellObject: Cell = new Cell();
        if (cell['type'] == 'multiselect') {
          cellObject.type = cell['type'];
          cellObject.combo = cell['combo'];
          cellObject.value = cell['value'];
          cellObject.size = cell['size'];
          cellObject.disabled = cell['disabled'];
        } else {
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
          cellObject.size = cell['size'];
          cellObject.disabled = cell['disabled'];
        }
        cells.push(cellObject);
      });
      rowObject.id = rows.id;
      rowObject.cells = cells;
      finalRows.push(rowObject);
    }));
    return finalRows;
}

}