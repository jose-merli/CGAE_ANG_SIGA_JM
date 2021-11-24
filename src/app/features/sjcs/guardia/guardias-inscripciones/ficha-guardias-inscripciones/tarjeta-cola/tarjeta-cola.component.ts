import { Component, OnInit, Input } from '@angular/core';
import { CommonsService } from '../../../../../../_services/commons.service';

@Component({
  selector: 'app-tarjeta-cola',
  templateUrl: './tarjeta-cola.component.html',
  styleUrls: ['./tarjeta-cola.component.scss']
})
export class TarjetaColaComponent implements OnInit {

  @Input() chincheta = false;
  @Input() icono = "cog";
  @Input() titulo;
  @Input() datos;
  permisosTarjeta: boolean = true;
  iconClass;
  datosVacio: String;
  constructor(
    private commonsService: CommonsService,
  ) { }

  ngOnInit() {
    if(this.datos == undefined){
     this.datos = [
      {
        label: "Sin información disponible"
      },
    ]
    }
    this.iconClass = `fas fa-${this.icono} icon-ficha`;
  }

}
