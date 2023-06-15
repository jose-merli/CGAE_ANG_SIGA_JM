import { Injectable } from '@angular/core';

@Injectable()
export class RowGroup {
  id: string;
  rows: Row[];
  id2: string;
  id3: string;
  estadoDesignacion: string;
  estadoEx: string;
  resolucionDesignacion:String;
}

export class Row {
  cells: Cell[];
  position: string;
}

export class Cell {
  type: string;
  value: any;
  size: number;
  combo: Combo[];
  disabled: boolean;
}

export class Combo {
  label: string;
  value: string;
}
export class TablaResultadoDesplegableJEService {
  constructor() { }

  public getTableData(result) {
    let resultado = {
      data: [
        {
          "": [
            {
              a1: [
                { type: '', value: '' , size: '', combo: [{label: "", value: ""},
                                                  {label: "", value: ""}]},
              ],
              position: 'collapse'
            }
          ],
          "1": "",
          "2": "",
          "estadoDesignacion": "",
          "estadoEx": "",
          "resolucionDesignacion":""
        },

        {
          "": [
            {
              b1: [
                { type: '', value: '', size: '' , combo: [{label: "", value: ""},
                {label: "", value: ""}]},
              ],
              position: 'collapse'
            
            },
          ],
          "1": "",
          "2": "",
          "estadoDesignacion": "",
          "estadoEx": "",
          "resolucionDesignacion":""
        },
      ],
    };
  
    resultado = result;
    let rowGroups: RowGroup[] = [];
    resultado.data.forEach((rowGroup, index) => {
      let rowGroupObject: RowGroup = new RowGroup();
      let rows: Row[] = [];
      Array.from(Object.values(rowGroup)[0]).forEach((row) => {
        let rowObject: Row = new Row();
        let cells: Cell[] = [];
        let position: String;
        Array.from(Object.values(row)[0]).forEach((cell) => {
          let cellObject: Cell = new Cell();
          cellObject.type = cell['type'];
          if (cell['value'] != null && cell['value'] != 'null'){
            cellObject.value = cell['value'];
          } else {
            cellObject.value = '';
          }
          cellObject.size = cell['size'];
          cellObject.combo = cell['combo'];
          cells.push(cellObject);
        });
        rowObject.cells = cells;
        rowObject.position = Object.values(row)[1];
        rows.push(rowObject);
      });

      rowGroupObject.id = Object.keys(rowGroup)[0];
      rowGroupObject.id2 = Object.keys(rowGroup)[1];
      rowGroupObject.id3 = Object.keys(rowGroup)[2];
      rowGroupObject.estadoDesignacion = Object.keys(rowGroup)[3];
      rowGroupObject.estadoEx = Object.keys(rowGroup)[4];
      rowGroupObject.resolucionDesignacion = Object.keys(rowGroup)[5];
      
      rowGroupObject.rows = rows;

      rowGroups.push(rowGroupObject);
    });
    return rowGroups;
  }
}