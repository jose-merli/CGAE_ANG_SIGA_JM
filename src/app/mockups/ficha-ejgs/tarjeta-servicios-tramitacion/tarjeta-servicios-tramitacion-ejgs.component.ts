import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-tarjeta-servicios-tramitacion-ejgs',
  templateUrl: './tarjeta-servicios-tramitacion-ejgs.component.html',
  styleUrls: ['./tarjeta-servicios-tramitacion-ejgs.component.scss']
})
export class TarjetaServiciosTramitacionEjgsComponent implements OnInit {

  msgs: Message[] = [];

  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  selectores = [
    {
      nombre: "Turno",
      opciones: [
        { label: 'XXXXXXXXXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXXXXXXXXX', value: 3 }
      ]
    },
    {
      nombre: "Guardia",
      opciones: [
        { label: 'XXXXXXXXXXXXXXXXXXX', value: 1 },
        { label: 'XXXXXXXXXXXXXXXXXXX', value: 2 },
        { label: 'XXXXXXXXXXXXXXXXXXX', value: 3 }
      ]
    }
  ];

  checkboxs = ['Incluir salto', 'Asignar colegiado automáticamente al guardar'];

  dgForm = new FormGroup({
  });

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }
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

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail,
    });
  }

  clear() {
    this.msgs = [];
  }

}
