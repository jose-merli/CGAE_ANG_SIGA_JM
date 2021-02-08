import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buscador-justificacion-expres',
  templateUrl: './buscador-justificacion-expres.component.html',
  styleUrls: ['./buscador-justificacion-expres.component.scss']
})
export class BuscadorJustificacionExpresComponent implements OnInit {
@Input() datePickers;
@Input() inputs1;
@Input() selectores1;
datePickers1 = [];
datePickers2 = [];
  constructor() { }
  cForm = new FormGroup({
    NIF: new FormControl(''),
    Apellidos: new FormControl(''),
    Nombre: new FormControl(''),
    });
  ngOnInit(): void {
    for(let i = 0; i < this.datePickers.length; i++){
      this.datePickers1 = this.datePickers[0];
      this.datePickers2 = this.datePickers[1];
    }
  }

}
