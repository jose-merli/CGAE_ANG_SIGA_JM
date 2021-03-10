import { Component, EventEmitter, Input, OnInit, Output, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-busqueda-ejg',
  templateUrl: './busqueda-ejg.component.html',
  styleUrls: ['./busqueda-ejg.component.scss']
})
export class BusquedaEJGComponent implements OnInit {

  expanded = true;
  expandedTra = false;
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };

  @Output() formulario = new EventEmitter<boolean>();
  cForm = new FormGroup({
    anio: new FormControl(''),
    numero: new FormControl(''),
  });
  @Input() selectorEstados = [];
  @Input() selectores = [];
  @Input() datePickers = [];
  @Input() inputs = [];

  @ViewChild('numero') numero: ElementRef;

  selectores1 = [];
  selectores2 = [];
  selectores3 = [];
  selectores4 = [];
  selectores5 = [];
  selectores6 = [];
  datePickers1 = [];
  datePickers2 = [];
  datePickers3 = [];
  inputs1 = [];
  inputs2 = [];
  inputs3 = [];

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.checkLastRoute();

    if (sessionStorage.getItem('esBuscadorColegiados') == "true") {
      this.expandedTra = true;

      if (sessionStorage.getItem('usuarioBusquedaExpress')) {
        this.usuarioBusquedaExpress = JSON.parse(sessionStorage.getItem('usuarioBusquedaExpress'));
      }
    }

    for (let i = 0; i < this.selectores.length; i++) {
      this.selectores1 = this.selectores[0];
      this.selectores2 = this.selectores[1];
      this.selectores3 = this.selectores[2];
      this.selectores4 = this.selectores[3];
      this.selectores5 = this.selectores[4];
      this.selectores6 = this.selectores[5];
    }
    for (let i = 0; i < this.datePickers.length; i++) {
      this.datePickers1 = this.datePickers[0];
      this.datePickers2 = this.datePickers[1];
      this.datePickers3 = this.datePickers[2];
    }
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs1 = this.inputs[0];
      this.inputs2 = this.inputs[1];
      this.inputs3 = this.inputs[2];
    }

    this.cForm.get('anio').setValue(new Date().getFullYear().toString());
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

  ngAfterViewInit(): void {
    this.numero.nativeElement.focus();
  }

}
