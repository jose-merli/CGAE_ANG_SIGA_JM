import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-asuntos',
  templateUrl: './asuntos.component.html',
  styleUrls: ['./asuntos.component.scss']
})
export class AsuntosComponent implements OnInit {
  allSelected = false;
  msgs: Message[] = [];
  show = false;
  cFormValidity = true;
  modoBusqueda = 'a';
  modoBusquedaB = false;
  radios = [
    { label: 'Designaciones', value: 'a' },
    { label: 'SOJ', value: 'b' },
    { label: 'Asistencias', value: 'c' }
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

  selectores1 = [
    {
      nombre: "Tipo Designación",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Estado Designación",
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
    }
  ];
  datePickers1 = ["Fecha Apertura Designación"];


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
    },
    {
      nombre: "Colegio",
      opciones: [
        { label: 'A CORUÑA', value: '1' },
        { label: 'ALAVA', value: '2' },
        { label: 'ALBACETE', value: '3' },
        { label: 'ALCALÁ DE HENARES', value: '4' },
        { label: 'ALCOY', value: '5' },
        { label: 'ALICANTE', value: '6' },
        { label: 'ALMERÍA', value: '7' },
        { label: 'ALZIRA', value: '8' },
        { label: 'ANTEQUERA', value: '9' },
        { label: 'AVILA', value: '10' },
        { label: 'BADAJOZ', value: '11' },
        { label: 'BALEARES', value: '12' },
        { label: 'BARCELONA', value: '13' },
        { label: 'BURGOS', value: '14' },
        { label: 'CÁCERES', value: '15' },
        { label: 'CÁDIZ', value: '16' },
        { label: 'C.ANDALUZ', value: '17' },
        { label: 'CANTABRIA', value: '18' },
        { label: 'C.ARAGÓN', value: '19' },
        { label: 'CARTAGENA', value: '20' },
        { label: 'CASTELLÓN', value: '21' },
        { label: 'C.CANARIO', value: '22' },
        { label: 'C.CASTILLA LA MANCHA', value: '23' },
        { label: 'C.CASTILLA Y LEÓN', value: '24' },
        { label: 'C.CATALUNYA', value: '25' },
        { label: 'CEUTA', value: '26' },
        { label: 'C.GALEGA', value: '27' },
        { label: 'CIUDAD REAL', value: '28' },
        { label: 'C.MADRID', value: '29' },
        { label: 'COMISION TOLEDO', value: '30' },
        { label: 'CÓRDOBA', value: '31' },
        { label: 'CUENCA', value: '32' },
        { label: 'C.VALENCI', value: '33' },
        { label: 'ELCHE', value: '34' },
        { label: 'ESTELLA', value: '35' },
        { label: 'EUSKAL K.', value: '36' },
        { label: 'FERROL', value: '37' },
        { label: 'FIGUERES', value: '38' },
        { label: 'GENERAL', value: '39' },
        { label: 'GIJÓN', value: '40' },
        { label: 'GIPUZKOA', value: '41' },
        { label: 'GIRONA', value: '42' },
        { label: 'GRANADA', value: '43' },
        { label: 'GRANOLLERS', value: '44' },
        { label: 'GUADALAJARA', value: '45' },
        { label: 'HUELVA', value: '46' },
        { label: 'HUESCA', value: '47' },
        { label: 'IT-CGAE', value: '48' },
        { label: 'JAÉN', value: '49' },
        { label: 'JEREZ DE LA FRONTERA', value: '50' },
        { label: 'LA RIOJA', value: '51' },
        { label: 'LANZAROTE', value: '52' },
        { label: 'LAS PALMAS', value: '53' },
        { label: 'LEÓN', value: '54' },
        { label: 'LLEIDA', value: '55' },
        { label: 'LORCA', value: '56' },
        { label: 'LUCENA', value: '57' },
        { label: 'LUGO', value: '58' },
        { label: 'MADRID', value: '59' },
        { label: 'MÁLAGA', value: '60' },
        { label: 'MANRESA', value: '61' },
        { label: 'MATARÓ', value: '62' },
        { label: 'MELILLA', value: '63' },
        { label: 'MURCIA', value: '64' },
        { label: 'ORIHUELA', value: '65' },
        { label: 'OURENSE', value: '66' },
        { label: 'OVIEDO', value: '67' },
        { label: 'PALENCIA', value: '68' },
        { label: 'PAMPLONA', value: '69' },
        { label: 'PONTEVEDRA', value: '70' },
        { label: 'REUS', value: '71' },
        { label: 'SABADELL', value: '72' },
        { label: 'SALAMANCA', value: '73' },
        { label: 'SANT FELIU', value: '74' },
        { label: 'SANTA CRUZ DE LA PALMA', value: '75' },
        { label: 'SANTA CRUZ DE TENERIFE', value: '76' },
        { label: 'SANTIAGO', value: '77' },
        { label: 'SEGOVIA', value: '78' },
        { label: 'SEVILLA', value: '79' },
        { label: 'SORIA', value: '80' },
        { label: 'SUECA', value: '81' },
        { label: 'TAFALLA', value: '82' },
        { label: 'TALAVERA DE LA REINA', value: '83' },
        { label: 'TARRAGONA', value: '84' },
        { label: 'TERRASSA', value: '85' },
        { label: 'TERUEL', value: '86' },
        { label: 'TOLEDO', value: '87' },
        { label: 'TORTOSA', value: '88' },
        { label: 'TUDELA', value: '89' },
        { label: 'VALENCIA', value: '90' },
        { label: 'VALLADOLID', value: '91' },
        { label: 'VIC', value: '92' },
        { label: 'VIGO', value: '93' },
        { label: 'VIZCAYA', value: '94' },
        { label: 'ZAMORA', value: '95' },
        { label: 'ZARAGOZA', value: '96' },
      ]
    }
  ];
  datePickers2 = [];
  selectores = [this.selectores1, this.selectores2];
  datePickers = [this.datePickers1, this.datePickers2];
  emptyAccordions = ["Datos Defensa", "CAJG"];
  constructor() { }

  ngOnInit(): void {
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
    if (this.modoBusqueda === 'b') {
      this.modoBusquedaB = true;
    } else if (this.modoBusqueda === 'a') {
      this.modoBusquedaB = false;
    }
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
