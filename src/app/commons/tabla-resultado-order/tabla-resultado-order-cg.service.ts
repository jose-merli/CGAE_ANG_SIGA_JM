import { Injectable } from '@angular/core';

@Injectable()
export class Row {
  cells: Cell[];
}

export class Cell {
  type: string;
  value: any;
  combo: any [];
  hiddenValue: any;
  required : boolean;
}
export class TablaResultadoOrderCGService {

constructor() {}

public getTableData(result) {
      if ( result != undefined){
    let finalRows: Row[] = [];
    result.forEach((rows) => {    
    let rowObject: Row = new Row();
    let cells: Cell[] = [];
    rows.cells.forEach((cell) => {
      let cellObject: Cell = new Cell();
      cellObject.type = cell['type'];
      cellObject.value = cell['value'];
      cellObject.combo = cell['combo'];
      cellObject.hiddenValue = cell['hiddenValue'];
      cellObject.required = cell['required']
      cells.push(cellObject);
    });
    rowObject.cells = cells;
    finalRows.push(rowObject);
    });
    return finalRows;
    }
  }  
}

