import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Message } from "primeng/components/common/api";
import { Router, RoutesRecognized } from "@angular/router";

@Component({
  selector: 'app-buscador-colegial',
  templateUrl: './buscador-colegial.component.html',
  styleUrls: ['./buscador-colegial.component.scss']
})
export class BuscadorColegialComponent implements OnInit {
  @Input() numColegiado;
  @Input() nombreAp;
  @Input() tarjeta;

  colegiadoForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  msgs: Message[] = [];

  constructor(private router: Router) { }

  ngOnInit() {

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true" && sessionStorage.getItem('usuarioBusquedaExpress')) {

      let usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
      this.colegiadoForm.get('numColegiado').setValue(usuarioBusquedaExpress.numColegiado);
      this.colegiadoForm.get('nombreAp').setValue(usuarioBusquedaExpress.nombreAp);
    }

    if (this.numColegiado) {
      this.colegiadoForm.get('numColegiado').setValue(this.numColegiado);
    }

    if (this.nombreAp) {
      this.colegiadoForm.get('nombreAp').setValue(this.nombreAp);
    }

    this.colegiadoForm.controls['nombreAp'].disable();

  }

  submitForm(form) {

    if (sessionStorage.getItem("tarjeta")) {
      sessionStorage.removeItem("tarjeta");
    }

    if (this.tarjeta) {
      sessionStorage.setItem("tarjeta", this.tarjeta);
    }

    if (form.numColegiado === '' || form.numColegiado === null) {
      this.router.navigate(["/pantallaBuscadorColegiados"]);
    }

  }

  clearForm() {
    this.colegiadoForm.reset();
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
