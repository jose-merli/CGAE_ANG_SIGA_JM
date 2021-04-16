import { Component, OnInit, Input } from '@angular/core';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';

@Component({
  selector: 'app-datos-abogado-contrario',
  templateUrl: './datos-abogado-contrario.component.html',
  styleUrls: ['./datos-abogado-contrario.component.scss']
})
export class DatosAbogadoContrarioComponent implements OnInit {


  showTarjetaPermiso: boolean = false;

  @Input() body: JusticiableItem;
  @Input() modoEdicion;
  @Input() showTarjeta;

  constructor() { }

  ngOnInit() {
  }

}
