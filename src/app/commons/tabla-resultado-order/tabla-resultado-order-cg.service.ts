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

constructor() {}

public getTableData(result) {
  if ( result != undefined){
  console.log('result: ', result)
let finalRows: Row[] = [];
result.forEach((rows) => {    
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
}

