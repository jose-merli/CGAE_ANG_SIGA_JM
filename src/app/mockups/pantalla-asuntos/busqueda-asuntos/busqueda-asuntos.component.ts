import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-busqueda-asuntos',
  templateUrl: './busqueda-asuntos.component.html',
  styleUrls: ['./busqueda-asuntos.component.scss']
})
export class BusquedaAsuntosComponent implements OnInit {

  expanded = true;
  expandedTra = false;

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  @Output() formulario = new EventEmitter<boolean>();

  cForm = new FormGroup({
    NIF: new FormControl(''),
    Apellidos: new FormControl(''),
    Nombre: new FormControl(''),
  });

  @Input() datos = [];
  @Input() selectorEstados = [];
  @Input() selectores = [];
  @Input() datePickers = [];
  @Input() emptyAccordions = [];
  @Input() modoBusqueda;

  datosFiltroDesignaciones = {};
  datosFiltroAsistencias = {};

  titulosInputInteresados = ["Identificación", "Apellidos", "Nombre"];
  titulosInputTramitacion = ["NIF", "Apellidos", "Nombre", "Número de colegiado"];

  inputsDivididosAsis = ["Año / Número Asistencia", "Número Procedimiento"];

  selectores2 = [];
  datePickers2 = [];
  selectorSOJ =
    {
      nombre: "Tipo SOJ",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    };

  selectorEJG =
    {
      nombre: "Tipo EJG",
      opciones: [
        { label: 'XXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXX', value: 3 },
      ]
    };


  constructor(private router: Router) { }

  ngOnInit(): void {

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true") {
      this.expandedTra = true;

      if (sessionStorage.getItem('usuarioBusquedaExpress')) {
        this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
      }
    }

    this.selectores2 = this.selectores[0];
    this.datePickers2 = this.datePickers[0];
    this.datosFiltroDesignaciones = this.datos[0];
    this.datosFiltroAsistencias = this.datos[1];
  }

  sendFom(value: FormGroup) {
    this.formulario.emit(value.valid)
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
