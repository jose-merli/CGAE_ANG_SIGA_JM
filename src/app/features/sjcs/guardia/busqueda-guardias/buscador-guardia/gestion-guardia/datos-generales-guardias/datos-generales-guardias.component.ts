import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';

@Component({
  selector: 'app-datos-generales-guardias',
  templateUrl: './datos-generales-guardias.component.html',
  styleUrls: ['./datos-generales-guardias.component.scss']
})
export class DatosGeneralesGuardiasComponent implements OnInit {

  @Input() datos: GuardiaItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

}
