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
        { label: 'Archivo', value: '3' },
        { label: 'Desfavorable', value: '2' },
        { label: 'Favorable', value: '1' },
        { label: 'Sin dictamen', value: '7' },
      ]
    },
    {
      nombre: "Fundamento Calificación",
      opciones: [
        { label: 'Estimación de la solicitud por no superar los ingresos del solicitante computables según IPREM', value: '1' },
        { label: 'Estimar por (según se especifica en Observaciones)', value: '8' },
      ]
    },
    {
      nombre: "Resolución",
      opciones: [{ "label": "Archivo/s", "value": "5" }, { "label": "Confirmar y DENEGAR", "value": "3" }, { "label": "Confirmar y RECONOCER 100%", "value": "1" }, { "label": "Confirmar y RECONOCER 80%", "value": "2" }, { "label": "Devuelto al Colegio", "value": "6" }, { "label": "Modificar y DENEGAR", "value": "7" }, { "label": "Modificar y RECONOCER CON NOMBRAMIENTO 100%", "value": "8" }, { "label": "Modificar y RECONOCER CON NOMBRAMIENTO 80%", "value": "10" }, { "label": "Modificar y RECONOCER SIN NOMBRAMIENTO 100%", "value": "9" }, { "label": "Modificar y RECONOCER SIN NOMBRAMIENTO 80%", "value": "11" }, { "label": "Pendiente CAJG - Otros", "value": "4" }]
    },
    {
      nombre: "Fundamentos Jurídico",
      opciones: [
        { label: 'XXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXX', value: 2 },
      ]
    },
    {
      nombre: "Impugnación",
      opciones: [{ "label": "Modificar resolución y conceder", "value": "1" }, { "label": "Confirmar resolución y denegar", "value": "2" }, { "label": "Modificar resolución y denegar", "value": "3" }, { "label": "Confirmar resolución y conceder", "value": "4" },]
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
      opciones: [{ "label": "Alfonso Santos Alcalá", "value": "1" }, { "label": "Alicia Vaquero Borrego", "value": "5" }, { "label": "Almudena Vázquez Aransay", "value": "3" }, { "label": "Amparo Guerra Alonso ", "value": "1" }, { "label": "Ana Marín San Román (Abogacía del Estado)", "value": "13" }, { "label": "Ana Sofía Tre Medina", "value": "2" }, { "label": "Andrés Taberne Junquito", "value": "5" }, { "label": "Angel Mínguez Parodi", "value": "3" }, { "label": "Beatriz Sánchez Rodrigo", "value": "2" }, { "label": "Begoña García-Matres Cortés", "value": "10" }, { "label": "Blanca Morera Alfaro", "value": "3" }, { "label": "Capelástegui Pérez-España, Javier  (ICAIB)", "value": "1" }, { "label": "Carlos Pascual Rojo Fuentes", "value": "7" }, { "label": "Carmen Marmol Montoto. Abogacía del Estado.", "value": "9" }, { "label": "Carmen Mendiola Gomez ", "value": "3" }, { "label": "Dª. Ana Isabel Peinado Rivas", "value": "8" }, { "label": "Dª. Ana Sánchez-Andrade Expósito, Abogada Jefe del Estado", "value": "7" }, { "label": "D. EULALIO LLANEZA PEREZ", "value": "11" }, { "label": "D. Fernando de Antonio Jiménez ", "value": "4" }, { "label": "D. FERNANDO LOPEZ GONZALEZ", "value": "15" }, { "label": "D. Francisco Javier de Santos Pérez ", "value": "5" }, { "label": "D. Jesús Besteiro Rivas", "value": "6" }, { "label": "D. Jesús De Mercado De Frutos", "value": "3" }, { "label": "D. Jesús Mª de la Fuente Hormigo", "value": "7" }, { "label": "D. Julián Sanz Gómez ", "value": "2" }, { "label": "D. Julio  Gabriel Sanz Orejudo", "value": "1" }, { "label": "Dª. María Antonia de Frutos García", "value": "11" }, { "label": "D. PABLO ÁLVAREZ BERTRAND (SUPLENTE)", "value": "8" }, { "label": "D. XESÚS CAÑEDO VALLE (SUPLENTE)", "value": "10" }, { "label": "Dª. Yolanda Crespo Aguilera", "value": "10" }, { "label": "Davíd Díaz Hurtado", "value": "10" }, { "label": "Dª.Concepción Marín Morales, en representación del Colegio de Abogados", "value": "6" }, { "label": "Diego Plata Pedrazo. ", "value": "8" }, { "label": "Diego Sánchez de la Parra", "value": "8" }, { "label": "D.Jose Antonio Nuevo Aybar", "value": "2" }, { "label": "DÑA. EVA GARCÍA PÉREZ (SUPLENTE)", "value": "12" }, { "label": "DÑA. ISABEL MARÍA MASCAREÑAS ALONSO", "value": "9" }, { "label": "DÑA. LAURA FERNÁNDEZ-MIJARES SÁNCHEZ (SUPLENTE)", "value": "6" }, { "label": "DÑA. MARÍA LUCÍA ZAPICO BEGEGA", "value": "16" }, { "label": "DÑA. MARIAN GONZALEZ MARTINEZ (SUPLENTE)", "value": "13" }, { "label": "DÑA. MARTA ALVAREZ ARCE", "value": "14" }, { "label": "DÑA. PALOMA VARELA ÁLVAREZ", "value": "7" }, { "label": "DÑA. PILAR MONTERO ORDOÑEZ", "value": "5" }, { "label": "DÑA. SARA FERNÁNDEZ SORDO (SUPLENTE)", "value": "3" }, { "label": "Domínguez Garcés, Almudena (Gerente de Justicia)", "value": "12" }, { "label": "DON JOSE FERNANDO GARCIA ESPINOSA (Vocal)", "value": "5" }, { "label": "DON JOSE LUIS ALONSO TEJUCA (Presidente)", "value": "1" }, { "label": "DON JUAN CARLOS ALMEIDA LORENCES (Vocal)" }]
    }
  ];

  datePickers3 = ['Fecha Ponente desde', 'Fecha Ponente hasta'];

  selectores5 = [
    {
      nombre: 'Rol',
      opciones: [{ "label": "Contrario", "value": "2" }, { "label": "Representante", "value": "3" }, { "label": "Solicitante", "value": "1" }, { "label": "Unidad Familiar", "value": "4" }]
    }
  ];

  selectores6 = [
    {
      nombre: 'Turno',
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
      nombre: 'Guardia',
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
      nombre: 'Tipo Letrado',
      opciones: [
        { label: 'Modificar resolución y conceder', value: 1 },
        { label: 'Confirmar resolución y denegar', value: 2 },
        { label: 'Modificar resolución y denegar', value: 3 },
        { label: 'Confirmar resolución y conceder', value: 4 },
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
      id: "turnoguardiaejg",
      name: "Turno/Guardia EJG"
    },
    {
      id: "turnodesignacion",
      name: "Turno Designación"
    },
    {
      id: "anionumeroejg",
      name: "Año/Número del EJG"
    },
    {
      id: "letradodesignacion",
      name: "Letrado de la designación"
    },
    {
      id: "fechaapertura",
      name: "Fecha Apertura"
    },
    {
      id: "estadoejg",
      name: "Estado del EJG"
    },
    {
      id: "apellidosnombre",
      name: "Apellidos, Nombre"
    },

  ];

  elementos = [
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00068', 'ASNDADBH AHDBHAJD, ANA', '27/05/2018', 'Archivado', 'ASNDADBH AHDBHAJD, JUAN'],
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00070', 'ASNDADBH AHDBHAJD, JUAN', '25/04/2018', 'Archivado', 'ASNDADBH AHDBHAJD, ANA'],
  ];
  elementosAux = [
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00068', 'ASNDADBH AHDBHAJD, ANA', '27/05/2018', 'Archivado', 'ASNDADBH AHDBHAJD, JUAN'],
    ['T.O PENAL NOVELDA/G. Civil Novelda', 'T.O PEN NOVIEMBRE', 'E2018/00070', 'ASNDADBH AHDBHAJD, JUAN', '25/04/2018', 'Archivado', 'ASNDADBH AHDBHAJD, ANA'],
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
