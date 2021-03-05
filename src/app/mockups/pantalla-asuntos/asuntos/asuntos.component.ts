import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss']
})
export class AsuntosComponent implements OnInit {

  rutas = ['SJCS', 'EJGs', 'Relacionar asunto'];
  allSelected = false;
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'a';
  radios = [
    { label: 'Designaciones', value: 'a' },
    { label: 'SOJ', value: 'b' },
    { label: 'Asistencias', value: 'c' },
    { label: 'EJGs', value: 'd' }
  ];
  cabeceras = [
    {
      id: "anio",
      name: "Año"
    },
    {
      id: "num",
      name: "Número"
    },
    {
      id: "nProc",
      name: "Nº Procedimiento/Año/NIG"
    },
    {
      id: "juzgado",
      name: "Juzgado"
    },
    {
      id: "tipo",
      name: "Tipo"
    },
    {
      id: "turnoGuard",
      name: "Turno/Guardia"
    },
    {
      id: "letrado",
      name: "Letrado"
    }
  ];

  elementos = [
    ["2018", "345", "UH5657", 'SDEGFSAGDASG', "XXX", "111111", "SFSADG DFSGDFGDG ANA"],
    ["2020", "789", "JV8765", 'DASGSDGSG', "BBB", "222222", "EWRFASWF DGSDEG JESÚS"]
  ];

  elementosAux = [
    ["2018", "345", "UH5657", 'SDEGFSAGDASG', "XXX", "111111", "SFSADG DFSGDFGDG ANA"],
    ["2020", "789", "JV8765", 'DASGSDGSG', "BBB", "222222", "EWRFASWF DGSDEG JESÚS"]
  ];


  datosFiltroDesignaciones = {
    inputsDivididos: ["Año / Número", "Número procedimiento"],
    inputs: ["NIG"],
    datepickers: ["Fecha Apertura Desde", "Fecha Apertura Hasta"],
    selectores: [
      {
        nombre: "Tipo",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      },
      {
        nombre: "Juzgado",
        opciones: [
          { label: "AS5-JUZGADO DE LO SOCIAL Nº 5", value: "40" },
          { label: "AS6-JUZGADO DE LO SOCIAL Nº 6", value: "41" },
          { label: "AS7-JUZGADO DE LO SOCIAL Nº 7", value: "42" },
          { label: "AMC1-JUZGADO DE LO MERCANTIL Nº 1", value: "43" },
          { label: "AMC2-JUZGADO DE LO MERCANTIL Nº 2", value: "44" },
          { label: "AMN1-JUZGADO DE MENORES Nº 1", value: "45" },
          { label: "AMN2-JUZGADO DE MENORES Nº 2", value: "46" },
          { label: "AMN3-JUZGADO DE MENORES Nº 3", value: "47" },
          { label: "AVM1-JUZGADO DE VIOLENCIA SOBRE LA MUJER Nº 1", value: "48" },
          { label: "ACA1-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 1", value: "50" },
          { label: "ACA2-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 2", value: "51" },
          { label: "ACA3-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 3", value: "52" },
          { label: "BITA1-JUZGADO DE 1ª INSTANCIA Nº 1", value: "54" },
          { label: "BITA2-JUZGADO DE 1ª INSTANCIA Nº 2", value: "55" },
          { label: "BITA3-JUZGADO DE 1ª INSTANCIA Nº 3", value: "56" },
          { label: "BITR1-JUZGADO DE INSTRUCCIÓN Nº 1", value: "57" },
          { label: "BITR2-JUZGADO DE INSTRUCCIÓN Nº 2", value: "58" },
          { label: "BITR3-JUZGADO DE INSTRUCCIÓN Nº 3", value: "59" },
          { label: "BITR4-JUZGADO DE INSTRUCCIÓN Nº 4", value: "60" },
          { label: "BITA4-JUZGADO DE 1ª INSTANCIA Nº 4 (antiguo Instrucción 5)", value: "61" },
          { label: "BS1-JUZGADO DE LO SOCIAL Nº 1", value: "62" },
          { label: "BP1-JUZGADO DE LO PENAL Nº 1", value: "63" },
          { label: "BP2-JUZGADO DE LO PENAL Nº 2", value: "64" },
          { label: "DII1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "65" },
          { label: "DII2-JUZGADO DE 1ª INST. E INSTRUC. Nº 2", value: "66" },
          { label: "DII3-JUZGADO DE 1ª INST. E INSTRUC. Nº 3", value: "67" },
          { label: "DII4-JUZGADO DE 1ª INST. E INSTRUC. Nº 4", value: "68" },
          { label: "DII5-JUZGADO DE 1ª INST. E INSTRUC. Nº 5", value: "69" },
          { label: "DII6-JUZGADO DE 1ª INST. E INSTRUC. Nº 6", value: "70" },
          { label: "DII7-JUZGADO DE 1ª INST. E INSTRUC. Nº 7", value: "71" },
          { label: "EII1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "72" },
          { label: "EII2-JUZGADO DE 1ª INST. E INSTRUC. Nº 2", value: "73" },
          { label: "EII3-JUZGADO DE 1ª INST. E INSTRUC. Nº 3", value: "74" },
          { label: "EII4-JUZGADO DE 1ª INST. E INSTRUC. Nº 4", value: "75" },
          { label: "III1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "76" },
        ]
      },
      {
        nombre: "Estado",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      }
    ]
  };

  datosFiltroAsistencias = {
    inputsDivididos: ["Año / Número", "Número procedimiento"],
    inputs: ["Número Diligencia / Asunto"],
    datepickers: ["Fecha Apertura Desde", "Fecha Apertura Hasta"],
    selectores: [
      {
        nombre: "Tipo",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      },
      {
        nombre: "Juzgado",
        opciones: [
          { label: "AS5-JUZGADO DE LO SOCIAL Nº 5", value: "40" },
          { label: "AS6-JUZGADO DE LO SOCIAL Nº 6", value: "41" },
          { label: "AS7-JUZGADO DE LO SOCIAL Nº 7", value: "42" },
          { label: "AMC1-JUZGADO DE LO MERCANTIL Nº 1", value: "43" },
          { label: "AMC2-JUZGADO DE LO MERCANTIL Nº 2", value: "44" },
          { label: "AMN1-JUZGADO DE MENORES Nº 1", value: "45" },
          { label: "AMN2-JUZGADO DE MENORES Nº 2", value: "46" },
          { label: "AMN3-JUZGADO DE MENORES Nº 3", value: "47" },
          { label: "AVM1-JUZGADO DE VIOLENCIA SOBRE LA MUJER Nº 1", value: "48" },
          { label: "ACA1-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 1", value: "50" },
          { label: "ACA2-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 2", value: "51" },
          { label: "ACA3-JUZGADO DE LO CONTENCIOSO-ADMVO. Nº 3", value: "52" },
          { label: "BITA1-JUZGADO DE 1ª INSTANCIA Nº 1", value: "54" },
          { label: "BITA2-JUZGADO DE 1ª INSTANCIA Nº 2", value: "55" },
          { label: "BITA3-JUZGADO DE 1ª INSTANCIA Nº 3", value: "56" },
          { label: "BITR1-JUZGADO DE INSTRUCCIÓN Nº 1", value: "57" },
          { label: "BITR2-JUZGADO DE INSTRUCCIÓN Nº 2", value: "58" },
          { label: "BITR3-JUZGADO DE INSTRUCCIÓN Nº 3", value: "59" },
          { label: "BITR4-JUZGADO DE INSTRUCCIÓN Nº 4", value: "60" },
          { label: "BITA4-JUZGADO DE 1ª INSTANCIA Nº 4 (antiguo Instrucción 5)", value: "61" },
          { label: "BS1-JUZGADO DE LO SOCIAL Nº 1", value: "62" },
          { label: "BP1-JUZGADO DE LO PENAL Nº 1", value: "63" },
          { label: "BP2-JUZGADO DE LO PENAL Nº 2", value: "64" },
          { label: "DII1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "65" },
          { label: "DII2-JUZGADO DE 1ª INST. E INSTRUC. Nº 2", value: "66" },
          { label: "DII3-JUZGADO DE 1ª INST. E INSTRUC. Nº 3", value: "67" },
          { label: "DII4-JUZGADO DE 1ª INST. E INSTRUC. Nº 4", value: "68" },
          { label: "DII5-JUZGADO DE 1ª INST. E INSTRUC. Nº 5", value: "69" },
          { label: "DII6-JUZGADO DE 1ª INST. E INSTRUC. Nº 6", value: "70" },
          { label: "DII7-JUZGADO DE 1ª INST. E INSTRUC. Nº 7", value: "71" },
          { label: "EII1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "72" },
          { label: "EII2-JUZGADO DE 1ª INST. E INSTRUC. Nº 2", value: "73" },
          { label: "EII3-JUZGADO DE 1ª INST. E INSTRUC. Nº 3", value: "74" },
          { label: "EII4-JUZGADO DE 1ª INST. E INSTRUC. Nº 4", value: "75" },
          { label: "III1-JUZGADO DE 1ª INST. E INSTRUC. Nº 1", value: "76" },
        ]
      },
      {
        nombre: "Centro de Detención",
        opciones: [
          { label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },
        ]
      }
    ]
  };

  selectores2 = [
    {
      nombre: "Turno",
      opciones: [
        { value: "2005,1511", label: 'ARTICULO 27/28 ALICANTE' },
        { value: "2005,1516", label: 'ARTICULO 27/28 BENIDORM' },
        { value: "2005,1512", label: 'ARTICULO 27/28 DENIA' },
        { value: "2005,1513", label: 'ARTICULO 27/28 ELDA' },
        { value: "2005,1514", label: 'ARTICULO 27/28 IBI' },
        { value: "2005,1515", label: 'ARTICULO 27/28 NOVELDA' },
        { value: "2005,1517", label: 'ARTICULO 27/28 VILLENA' },
        { value: "2005,4271", label: 'BOLSA ESPECIALISTAS EN ASILO BENIDORM' },
        { value: "2005,4272", label: 'BOLSA ESPECIALISTAS EN ASILO DENIA' },
        { value: "2005,3510", label: 'INSTITUTO MEDIACION ICALI - LISTADO GENERAL' },
        { value: "2005,3675", label: 'INSTITUTO MEDIACION ICALI - MEDIACION CIVIL Y MERCANTIL' },
        { value: "2005,4115", label: 'INSTITUTO MEDIACION ICALI - MEDIACION CON LA ADMINISTRACION PUBLICA' },
        { value: "2005,3677", label: 'INSTITUTO MEDIACION ICALI - MEDIACION CONCURSAL' },
        { value: "2005,3679", label: 'INSTITUTO MEDIACION ICALI - MEDIACION FAMILIAR' },
        { value: "2005,3676", label: 'INSTITUTO MEDIACION ICALI - MEDIACION ORGANIZACIONES COMPLEJAS' },
        { value: "2005,3678", label: 'INSTITUTO MEDIACION ICALI - MEDIACION PENAL Y PENITENCIARIA' },
        { value: "2005,3931", label: 'INSTITUTO MEDIACION ICALI - MEDIACION TRAFICO' },

      ]
    },
    {
      nombre: "Guardia",
      opciones: [
        { value: "694", label: 'C. Provincial-Benalúa' },
        { value: "1494", label: 'C. Provincial-Benalúa(FS/Fest)' },
        { value: "695", label: 'C.Norte/Pascual Pérez' },
        { value: "1495", label: 'C.Norte/Pascual Pérez(FS/Fest)' },
        { value: "1316", label: 'G. dobles PENAL ant. a 2010' },
        { value: "699", label: 'G.C/Pol. Local Alic' },
        { value: "1496", label: 'G.C/Pol. Local Alic (FS/Fest)' },
        { value: "700", label: 'G.C/Pol. Local S.V' },
        { value: "1497", label: 'G.C/Pol. Local S.V (FS/Fest)' },
        { value: "1325", label: 'Guard. Refuerzo Penal Alicante' },
        { value: "697", label: 'Juz. Alicante (Inc)' },
        { value: "1498", label: 'Juz. Alicante (Inc) (FS/Fest)' },
        { value: "698", label: 'Juz.San Vicente(Inc)' },
        { value: "1499", label: 'Juz.San Vicente(Inc) (FS/Fest)' },
        { value: "767", label: 'L.Re2(Pref. Inv V.G)' },
        { value: "1501", label: 'L.Re2(Pref. Inv V.G) (FS/Fest)' },
        { value: "701", label: 'Letrado Reserva' },
        { value: "1500", label: 'Letrado Reserva (FS/Fest)' },
      ]
    }
  ];

  datePickers2 = [];
  selectores = [this.selectores2];
  datePickers = [this.datePickers2];
  emptyAccordions = ["Datos Defensa", "CAJG"];

  datos = [this.datosFiltroDesignaciones, this.datosFiltroAsistencias];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.showMsg('info', 'Este buscador puede ser accedido desde varios lugares', '');
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }
  saveForm($event) {
    this.cFormValidity = $event;
  }

  changeTab() {
    this.hideResponse();
  }

  selectedAll(event) {
    this.allSelected = event;
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

}
