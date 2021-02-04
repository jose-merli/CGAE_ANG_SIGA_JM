import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-buscador-colegial',
  templateUrl: './buscador-colegial.component.html',
  styleUrls: ['./buscador-colegial.component.scss']
})
export class BuscadorColegialComponent implements OnInit {
  @Input() numColegiado;
  @Input() nombreAp;
  colegiadoForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });

  ngOnInit() {
    this.colegiadoForm.controls['nombreAp'].disable();
  }
}
