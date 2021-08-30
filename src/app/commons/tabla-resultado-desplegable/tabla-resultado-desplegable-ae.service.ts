import { Injectable } from '@angular/core';
export class RowGroup {
  id: string;
  rows: Row[];
}

export class Row {
  cells: Cell[];
  position: string;
}

export class Cell {
  type: string;
  value: any;
  combo: Combo[];
  size : number;
  showTime : boolean;
}

export class Combo {
  label: string;
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
              { type: 'text', value: '1237 - HBFRBFJ JFJRBFR, SANDRA - MUJER' },
              { type: 'text', value: '' },
              { type: 'link', value: 'E2018/0001' },
              { type: 'text', value: '10/10/2010 9:45' },
              { type: 'textTooltip', value: ['COMISARÍA CENTRO ALICANTE', 'ACCA'] },
              { type: 'number', value: '667890' },
            ],
          },
          {
            a2: [
              { type: 'text', value: '5674 - EFBJB IOPHTY, MANUEL - HOMBRE' },
              { type: 'text', value: '' },
              { type: 'link', value: 'E2018/0001' },
              { type: 'text', value: '10/10/2010 9:45' },
              { type: 'textTooltip', value: ['COMISARÍA CENTRO ALICANTE', 'ACCA'] },
              { type: 'number', value: '667890' },
            ],
          },
          {
            a3: [
              { type: 'text', value: '7856 - VBER OPIUY, JESÚS - HOMBRE' },
              { type: 'text', value: '' },
              { type: 'link', value: 'E2018/0001' },
              { type: 'text', value: '10/10/2010 9:45' },
              { type: 'textTooltip', value: ['COMISARÍA CENTRO ALICANTE', 'ACCA'] },
              { type: 'number', value: '667890' },
            ],
          }
        ],
      },
      {
        "A2019/124": [
          {
            b1: [
              { type: '5InputSelector', value: [3333, 'PEREZ', 'ROMERO', 'JUAN', 'HOMBRE'] },
              { type: '2SelectorInput', value: '' },
              { type: 'link', value: '' },
              { type: 'datePicker', value: '' },
              {
                type: 'buttomSelect', value: ['C / J',
                  {
                    opciones: [
                      { label: 'GUARDIA CIVIL IBI - IGCI', value: 1 },
                      { label: 'POLICIA LOCAL SAX - VPLS', value: 2 },
                      { label: 'SEPRONA ALICANTE - ASA', value: 3 },
                      { label: 'CCOMISARIA PROVINCIAL ALICANTE - ACPA', value: 4 },
                    ]
                  },
                  {
                    opciones: [
                      { label: 'JUZGADO DE LO SOCIAL Nº 5 - AS5', value: 1 },
                      { label: 'JUZGADO DE MENORES Nº 1 - AMN1', value: 2 },
                      { label: 'JUZGADO DE INSTRUCCIÓN Nº 1 - BITR1', value: 3 },
                      { label: 'JUZGADO DE LO PENAL Nº 1 - BP1', value: 4 },
                    ]
                  }
                  , 'C']
              },
              { type: 'input', value: '' },
            ],
          },
          {
            b2: [
              { type: '5InputSelector', value: [2222, 'LOPEZ', 'CALLES', 'ANA', 'MUJER'] },
              { type: '2SelectorInput', value: '' },
              { type: 'link', value: '' },
              { type: 'datePicker', value: '' },
              {
                type: 'buttomSelect', value: ['C / J',
                  {
                    opciones: [
                      { label: 'GUARDIA CIVIL IBI - IGCI', value: 1 },
                      { label: 'POLICIA LOCAL SAX - VPLS', value: 2 },
                      { label: 'SEPRONA ALICANTE - ASA', value: 3 },
                      { label: 'CCOMISARIA PROVINCIAL ALICANTE - ACPA', value: 4 },
                    ]
                  },
                  {
                    opciones: [
                      { label: 'JUZGADO DE LO SOCIAL Nº 5 - AS5', value: 1 },
                      { label: 'JUZGADO DE MENORES Nº 1 - AMN1', value: 2 },
                      { label: 'JUZGADO DE INSTRUCCIÓN Nº 1 - BITR1', value: 3 },
                      { label: 'JUZGADO DE LO PENAL Nº 1 - BP1', value: 4 },
                    ]
                  }
                  , 'C']
              },
              { type: 'input', value: '' },
            ],
          }
        ],
      },
    ],
  };
  constructor() { }

  public getTableData(resultModified) {
    let rowGroups: RowGroup[] = [];
    this.result = resultModified;
    this.result.data.forEach((rowGroup, index) => {
      let rowGroupObject: RowGroup = new RowGroup();
      let rows: Row[] = [];
      Array.from(Object.values(rowGroup)[0]).forEach((row) => {
        let rowObject: Row = new Row();
        rowObject.position = 'collapse';
        let cells: Cell[] = [];
        Array.from(Object.values(row)[0]).forEach((cell) => {
          let cellObject: Cell = new Cell();
          cellObject.type = cell['type'];
          cellObject.value = cell['value'];
          if(cell['combo'] != null && cell['combo'] != undefined){
            cellObject.combo = cell['combo'];
          }
          if(cell['showTime']){
            cellObject.showTime = cell['showTime'];
          }
          if(cell['size']){
            cellObject.size = cell['size'];
          }
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
