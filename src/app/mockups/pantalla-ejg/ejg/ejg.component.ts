import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-ejg2',
  templateUrl: './ejg.component.html',
  styleUrls: ['./ejg.component.scss']
})
export class EjgComponent2 implements OnInit {
  isDisabled = true;
  rutas = ['SJCS', 'E.J.G'];
  msgs: Message[] = [];
  cFormValidity = true;
  show = false;
  allSelected = false;

  selectorEstados: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  selectores1 = [
    {
      nombre: "Tipo EJG",
      opciones: [
        { label: 'Mercantil', value: 1 },
        { label: 'Oficio Juzgado (Artículo 21)', value: 2 },
        { label: 'Ordinario', value: 3 },
        { label: 'Proced. Enjuiciamiento Rápido', value: 4 },
        { label: 'Reproducidos X archivo CAJ', value: 5 },
        { label: 'Violencia doméstica', value: 6 },
      ]
    },
    {
      nombre: "Tipo EJG Colegio",
      opciones: [
        { label: "Benidorm", value: "4" },
        { label: "Denia", value: "6" },
        { label: "Elda", value: "2" },
        { label: "Ibi", value: "5" },
        { label: "Novelda", value: "3" },
        { label: "Villena", value: "7" },
      ]
    },
    {
      nombre: "Creado desde",
      opciones: [
        { label: 'Manual', value: 1 },
        { label: 'Asistencia', value: 2 },
        { label: 'Designa', value: 3 },
        { label: 'SOJ', value: 4 },
      ]
    },
    {
      nombre: "Estado EJG",
      opciones: [
        { label: "Archivado", value: "12" },
        { label: "Completada solicititud y documentación", value: "2" },
        { label: "Designado Procurador", value: "19" },
        { label: "Devuelto al colegio", value: "21" },
        { label: "Dictaminado", value: "6" },
        { label: "Enviado a Edicto (CAJG)", value: "16" },
        { label: "Generado en Remesa", value: "8" },
        { label: "Impugnable", value: "24" },
        { label: "Impugnado/a", value: "11" },
        { label: "Incidencias", value: "14" },
        { label: "Incidencias Procurador", value: "22" },
        { label: "Listo remitir Comisión", value: "7" },
        { label: "Listo remitir comisión act. designación", value: "17" },
        { label: "Petición de Datos (CAJG)", value: "15" },
        { label: "Petición Procurador", value: "18" },
        { label: "Previsión recibir dictamen", value: "4" },
        { label: "Remitida apertura a CAJG-Reparto Ponente", value: "20" },
        { label: "Remitida apertura a Comisión", value: "0" },
        { label: "Remitido Comisión", value: "9" },
        { label: "Resuelta Impugnación", value: "13" },
        { label: "Resuelto Comisión", value: "10" },
        { label: "Solicitada Documentación", value: "1" },
        { label: "Solicitado ampliación documentación", value: "5" },
        { label: "Solicitud en proceso de Alta", value: "23" },
        { label: "Traslado a Tramitador", value: "3" },

      ]
    }
  ];
  datePickers1 = ["Fecha Apertura desde", "Fecha Apertura hasta", "Fecha Estado desde", "Fecha Estado hasta",
    "Fecha Límite desde", "Fecha Límite hasta"];


  selectores2 = [
    {
      nombre: "Dictamen",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Fundamento Calificación",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Resolución",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Fundamentos Jurídico",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Impugnación",
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: "Fundamento Impugnación",
      opciones: [

        { label: 'Remitida apertura a Comisión', value: 0 },
        { label: 'Solicitada Documentación', value: 1 },
        { label: 'Completada solicititud y documentación', value: 2 },
        { label: 'Traslado a Tramitador', value: 3 },
        { label: 'Previsión recibir dictamen', value: 4 },
        { label: 'Solicitado ampliación documentación', value: 5 },
        { label: 'Dictaminado', value: 6 },
        { label: 'Listo remitir Comisión', value: 7 },
        { label: 'Generado en Remesa', value: 8 },
        { label: 'Remitido Comisión', value: 9 },
        { label: 'Resuelto Comisión', value: 10 },
        { label: 'Impugnado/a', value: 11 },
        { label: 'Archivado', value: 12 },
        { label: 'Resuelta Impugnación', value: 13 },
        { label: 'Incidencias', value: 14 },
        { label: 'Petición de Datos (CAJG)', value: 15 },
        { label: 'Enviado a Edicto (CAJG)', value: 16 },
        { label: 'Listo remitir comisión act. designación', value: 17 },
        { label: 'Petición Procurador', value: 18 },
        { label: 'Designado Procurador', value: 19 },
        { label: 'Remitida apertura a CAJG-Reparto Ponente', value: 20 },
        { label: 'Devuelto al colegio', value: 21 },
        { label: 'Incidencias Procurador', value: 22 },
        { label: 'Solicitud en proceso de Alta', value: 23 },
        { label: 'Impugnable', value: 24 }



      ]
    }
  ];


  datePickers2 = ["Fecha Dictamen desde", "Fecha Dictamen hasta", "Fecha Resolución desde", "Fecha Resolución hasta",
    "Fecha Impugnación desde", "Fecha Impugnación hasta"];


  selectores3 = [
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
      nombre: "Calidad",
      opciones: [
        { label: 'Demandado', value: 1 },
        { label: 'Demandante', value: 2 },
      ]
    },
    {
      nombre: "Preceptivo",
      opciones: [
        { label: "No preceptivo", value: "2" },
        { label: "Preceptivo", value: "1" },
        { label: "Preceptivo solo abogado", value: "3" },
      ]
    },
    {
      nombre: "Renuncia",
      opciones: [
        { label: "Renuncia Designación", value: "2" },
        { label: "Renuncia Honorarios", value: "1" },
      ]
    },
    {
      nombre: "Procedimiento",
      opciones: [
        { label: "(B-05)1337-Juicio con Jurado, auto de sobreseimiento o de apertura del juicio oral", value: "3" },
        { label: "(B-05)1334-Juicio con Jurado, sentencia o resolución fin procedimiento, delitos contra la vida", value: "4" },
        { label: "(B-05)1333-Juicio con Jurado, sentencia o resolución fin procedimiento, resto delitos", value: "5" },
        { label: "(B-05)1238-Juicio rápido sin conformidad", value: "8" },
        { label: "(B-05)1733-P.A., con desplazamiento (delegaciones)  sentencia o resolución fin procedimiento", value: "9" },
        { label: "(B-05)1637-Menores, dictado el auto de archivo o auto de apertura de audiencia.", value: "11" },
        { label: "(B-05)1633-Menores, dictada la sentencia o resolución que pone fin al procedimiento.", value: "12" },
        { label: "APELACION CIVIL", value: "13" },
        { label: "APELACION CIVIL", value: "14" },
        { label: "(B-05)1931-Apelación penal.", value: "15" },
        { label: "(B-05)1634-Apelación en menores", value: "16" },
        { label: "(B-05)2737-Procedimiento ordinario, admisión demanda o contestación", value: "18" },
        { label: "(B-05)2733-Procedimiento ordinario, sentencia o resolución fin procedimiento", value: "19" },
        { label: "(B-05)2833-Verbal, sentencia o resolución fin procedimiento", value: "21" },
        { label: "(B-05)2337-Familia, admisión demanda(contenciosa o de mutuo acuerdo)", value: "22" },
        { label: "(B-05)2533-Familia, mutuo acuerdo sentencia o resolución fin procedimiento", value: "23" },
        { label: "(B-05)2433-Familia, modificación de medidas", value: "25" },
        { label: "(B-05)2631-Medidas provisionales", value: "26" },
        { label: "(B-05)2931-Apelación civil", value: "27" },
      ]
    },
  ];

  selectores4 = [
    {
      nombre: 'Ponente',
      opciones: [
        { label: 'Confirmar y RECONOCER 100%', value: 1 },
        { label: 'Confirmar y RECONOCER 80%', value: 2 },
        { label: 'Confirmar y DENEGAR', value: 3 },
        { label: 'Pendiente CAJG - Otros', value: 4 },
        { label: 'Archivo/s', value: 5 },
        { label: 'Devuelto al Colegio', value: 6 },
        { label: 'Modificar y DENEGAR', value: 7 },
        { label: 'Modificar y RECONOCER CON NOMBRAMIENTO 100%', value: 8 },
        { label: 'Modificar y RECONOCER SIN NOMBRAMIENTO 100%', value: 9 },
        { label: 'Modificar y RECONOCER CON NOMBRAMIENTO 80%","value', value: 10 },
        { label: 'Modificar y RECONOCER SIN NOMBRAMIENTO 80%","value', value: 11 }

      ]
    }
  ];

  datePickers3 = ['Fecha Ponente desde', 'Fecha Ponente hasta'];

  selectores5 = [
    {
      nombre: 'Rol',
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    }
  ];

  selectores6 = [
    {
      nombre: 'Turno',
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: 'Guardia',
      opciones: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    },
    {
      nombre: 'Tipo Letrado',
      opciones: [
        { label: 'Modificar resolución y conceder', value: 1 },
        { label: 'Confirmar resolución y denegar', value: 2 },
        { label: 'Modificar resolución y denegar', value: 3 },
        { label: 'Confirmar resolución y conceder', value: 4 },
        { label: 'null05', value: 5 }
      ]
    }
  ];


  inputs1 = ['Asunto', 'Num/Año Procedimiento', 'NIG'];
  inputs2 = ['Año CAJG', 'Número CAJG', 'Año Acta', 'Número Acta', 'Número Registro Remesa'];
  inputs3 = ['NIF', 'Apellidos', 'Nombre'];

  inputs = [this.inputs1, this.inputs2, this.inputs3];
  selectores = [this.selectores1, this.selectores2, this.selectores3, this.selectores4, this.selectores5, this.selectores6];
  datePickers = [this.datePickers1, this.datePickers2, this.datePickers3];

  cabeceras = [
    {
      id: "colegio",
      name: "Colegio"
    },
    {
      id: "identificacion",
      name: "Nº identificacion"
    },
    {
      id: "nombre",
      name: "Nombre"
    },
    {
      id: "colegiado",
      name: "Nº Colegiado"
    },
    {
      id: "situacion",
      name: "Situación"
    },
    {
      id: "residencia",
      name: "Residencia"
    },
    {
      id: "nacimiento",
      name: "Fecha Nacimiento"
    },
    {
      id: "correo",
      name: "Correo electrónico"
    },
    {
      id: "telefono",
      name: "Teléfono"
    },
    {
      id: "movil",
      name: "Móvil"
    },
    {
      id: "lopd",
      name: "LOPD"
    }
  ];

  elementos = [
    ['ALCALÁ DE HENARES', "78909876R", "ASNDADBH AHDBHAJD JUAN", "1702", "Baja Colegial", "No", "30/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"],
    ['BALCALÁ DE HENARES', "23909876R", "ASNDADBH AHDBHAJD ANA", "1402", "Baja Colegial", "Si", "12/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"]
  ];
  elementosAux = [
    ['ALCALÁ DE HENARES', "78909876R", "ASNDADBH AHDBHAJD JUAN", "1702", "Baja Colegial", "No", "30/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"],
    ['BALCALÁ DE HENARES', "23909876R", "ASNDADBH AHDBHAJD ANA", "1402", "Baja Colegial", "Si", "12/04/1969", "papelera@redabogacia.org", "999999999", "666666666", "No"]
  ];
  constructor() { }

  ngOnInit(): void {
  }
  saveForm($event) {
    this.cFormValidity = $event;
  }
  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
  }

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
