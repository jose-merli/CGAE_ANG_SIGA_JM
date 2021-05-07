import { Component, OnInit, Input } from '@angular/core';
import { CommonsService } from '../../../../../../_services/commons.service';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';

@Component({
  selector: 'app-tarjeta-cola-fija',
  templateUrl: './tarjeta-cola-fija.component.html',
  styleUrls: ['./tarjeta-cola-fija.component.scss']
})
export class TarjetaColaFijaComponent implements OnInit {

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
