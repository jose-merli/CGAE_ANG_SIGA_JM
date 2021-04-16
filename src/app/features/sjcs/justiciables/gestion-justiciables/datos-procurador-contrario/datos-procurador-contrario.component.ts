import { Component, OnInit, Input } from '@angular/core';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';

@Component({
  selector: 'app-datos-procurador-contrario',
  templateUrl: './datos-procurador-contrario.component.html',
  styleUrls: ['./datos-procurador-contrario.component.scss']
})
export class DatosProcuradorContrarioComponent implements OnInit {

  showTarjetaPermiso: boolean = false;

  @Input() body: JusticiableItem;
  @Input() modoEdicion;
  @Input() showTarjeta;

  constructor() { }

  ngOnInit() {
  }

}
