import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-busqueda-certificacion',
  templateUrl: './busqueda-certificacion.component.html',
  styleUrls: ['./busqueda-certificacion.component.scss']
})
export class BusquedaCertificacionComponent implements OnInit {
  @Output() formulario = new EventEmitter<boolean>();
  expanded = true;
  cForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  selectorEstados = [
    { label: 'ABIERTA', value: 1 },
    { label: 'VALIDANDO', value: 2 },
    { label: 'NO_VALIDADA', value: 3 },
    { label: 'VALIDADA', value: 4 },
    { label: 'ENVIANDO', value: 5 },
    { label: 'ENVIO_CON_ERRORES', value: 6 },
    { label: 'CERRADA', value: 7 },
  ];
  selectores = [
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
    },
    {
      nombre: "Facturaciones",
      opciones: [
        { label: 'XXXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Estado",
      opciones: [
        { label: 'XXXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXXX', value: 3 },
      ]
    },
    {
      nombre: "Partida Presupuestaria",
      opciones: [
        { label: 'Ministerio de Justicia (turno de oficio y asistencia al detenido)', value: 1 },
        { label: 'Comunidad Autonóma (asistencia jurídica penitenciaria)', value: 2 },
        { label: 'Institución Municipal (servicios de orientación jurídica)', value: 3 },
      ]
    },
    {
      nombre: "Grupo de Facturación",
      opciones: [
        { label: 'Acompañamiento EPJ', value: 1 },
        { label: 'Asesoram. Arrendatarios', value: 2 },
        { label: 'Coordinadores Escuela', value: 3 },
        { label: 'Genérico', value: 4 },
        { label: 'Penitenciario', value: 5 },
        { label: 'Prueba J.Rápidos', value: 6 },
        { label: 'Prueba VG', value: 7 },
        { label: 'Serv. Interm. Hipotecaria', value: 8 },
        { label: 'SOJ', value: 9 },
      ]
    },
    {
      nombre: "Conceptos",
      opciones: [
        { label: 'TURNOS DE OFICIO', value: 1 },
        { label: 'GUARDIAS / ASISTENCIAS', value: 2 },
        { label: 'EXPEDIENTES SOJ', value: 3 },
        { label: 'EXPEDIENTES EJG', value: 4 },
      ]
    }
  ];

  datepickers = ['Fecha desde Facturaciones', 'Fechas hasta Facturaciones'];

  opcionSeleccionado: string = '0';
  verSeleccion: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;

  }
  sendFom(value: FormGroup) {
    this.formulario.emit(value.valid)
  }

}
