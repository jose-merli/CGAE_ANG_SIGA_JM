import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aplicacionEnPagos',
  templateUrl: './aplicacionEnPagos.component.html',
  styleUrls: ['./aplicacionEnPagos.component.scss']
})
export class AplicacionEnPagosComponent implements OnInit {
  isDisabled = true;
  show = true;
  cFormValidity = true;
  modoBusqueda = 'a';
  modoBusquedaB = false;
  allSelected = false;
  rutas: string[] = ['SJCS', 'Buscar retenciones'];
  radios = [
    { label: 'Retención', value: 'b' },
    { label: 'Aplicación en Pagos', value: 'a' }
  ];
  cabeceras = [
    {
      id: "nColegiado",
      name: "Nº Colegiado"
    },
    {
      id: "ApsNombre",
      name: "Apellidos, Nombre"
    },
    {
      id: "fechIni",
      name: "Fecha Inicio"
    },
    {
      id: "destinatario",
      name: "Destinatario"
    },
    {
      id: "añoMes",
      name: "Año/Mes"
    },
    {
      id: "retenido",
      name: "Importe Retenido"
    },
    {
      id: "fechaRetencion",
      name: "Fecha Retención"
    },
    {
      id: "importePago",
      name: "Importe pago"
    },
    {
      id: "pago",
      name: "Pago"
    }
  ];
  elementos = [
    ["5553", "GARCÍA, PÉREZ, JUAN", "01/01/2019", 'AEAT', "2019/01", "-100,00", "06/12/2018", "5.437,34", "Pago primer trimestre TO 2019"]
  ];
  elementosAux = [
    ["5553", "GARCÍA, PÉREZ, JUAN", "01/01/2019", 'AEAT', "2019/01", "-100,00", "06/12/2018", "5.437,34", "Pago primer trimestre TO 2019"]
  ];

  selectores1 = [
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
  datePickers1 = [];
  inputs1 = ["NIF", "Apellidos", "Nombre", "Número de colegiado"];
  selectores2 = [
    {
      nombre: "Tipo retención",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Destinatario",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Pago de aplicación",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    }
  ];
  datePickers2 = [];
  inputs2 = ["Número de Abono"];
  selectores = [this.selectores1, this.selectores2];
  datePickers = [this.datePickers1, this.datePickers2];
  inputs = [this.inputs1, this.inputs2];
  emptyAccordions = [];
  constructor() { }
  selectedAll(event) {
    this.allSelected = event;
    this.isDisabled = !event;
  }
  notifyAnySelected(event) {
    if (this.allSelected || event) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
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

}
