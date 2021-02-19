import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-buscador-justificacion-expres',
  templateUrl: './buscador-justificacion-expres.component.html',
  styleUrls: ['./buscador-justificacion-expres.component.scss']
})
export class BuscadorJustificacionExpresComponent implements OnInit {
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  expanded = true;
  @Input() datePickers;
  @Input() inputs1;
  @Input() selectores1;
  datePickers1 = [];
  datePickers2 = [];
  constructor(private router: Router) { }
  cForm = new FormGroup({
    NIF: new FormControl(''),
    Apellidos: new FormControl(''),
    Nombre: new FormControl(''),
  });
  ngOnInit(): void {
    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {
      this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
    }
    for (let i = 0; i < this.datePickers.length; i++) {
      this.datePickers1 = this.datePickers[0];
      this.datePickers2 = this.datePickers[1];
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

}
