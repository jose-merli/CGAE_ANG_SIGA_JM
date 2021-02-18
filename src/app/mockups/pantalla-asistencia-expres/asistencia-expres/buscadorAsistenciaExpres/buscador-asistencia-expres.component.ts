import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-buscador-asistencia-expres',
  templateUrl: './buscador-asistencia-expres.component.html',
  styleUrls: ['./buscador-asistencia-expres.component.scss']
})
export class BuscadorAsistenciaExpresComponent implements OnInit {
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  expanded = true;
  datos;
  aeForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  @Input() modoBusqueda: string;
  modoBusquedaB: boolean = true;
  @Input() titulo: string;
  msgs: Message[] = [];
  rutas: string[] = ['SJCS', 'Guardia', 'Asistencias'];


  constructor(private router: Router) {
    this.datos = {
      radios: [],
      dropdowns: [
        {
          label: "Turno",
          options: [
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
          label: "Guardia",
          options: [
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
          label: "Tipo Asistencia Colegio",
          options: [{ label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },]
        },
      ],
      dropdowns2: [
        {
          label: "Letrado de Guardia",
          options: [{ label: 'XXXXXXXXXXX', value: 1 },
          { label: 'XXXXXXXXXXX', value: 2 },
          { label: 'XXXXXXXXXXX', value: 3 },]
        }
      ]
    };
  }

  ngOnInit(): void {
    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }
    this.titulo = 'Datos Comunes';
  }
  opcionSeleccionado: string = '0';
  verSeleccion: string = '';

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;

  }

  showMsg() {
    this.msgs = [];
    this.msgs.push({
      severity: "info",
      summary: 'Información buscada',
      detail: 'Mostrando información buscada'
    });
  }

  clear() {
    this.msgs = [];
  }

  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/pantallaBuscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }

}
