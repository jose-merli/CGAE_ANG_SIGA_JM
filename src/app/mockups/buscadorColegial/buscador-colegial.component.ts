import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Message } from "primeng/components/common/api";

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
  msgs: Message[] = [];

  ngOnInit() {
    this.colegiadoForm.controls['nombreAp'].disable();
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
}
