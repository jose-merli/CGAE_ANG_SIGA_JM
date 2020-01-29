import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tarjeta-resumen-fija',
  templateUrl: './tarjeta-resumen-fija.component.html',
  styleUrls: ['./tarjeta-resumen-fija.component.scss']
})
export class TarjetaResumenFijaComponent implements OnInit {

  @Input() chincheta = false;
  @Input() icono = "cog";
  @Input() titulo;
  @Input() datos;

  iconClass;

  constructor() { }

  ngOnInit() {
    this.iconClass = `fas fa-${this.icono} icon-ficha`;
  }

}
