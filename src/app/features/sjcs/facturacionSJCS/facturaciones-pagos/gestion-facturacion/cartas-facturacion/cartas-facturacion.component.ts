import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FacturacionItem } from '../../../../../../models/sjcs/FacturacionItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';

@Component({
  selector: 'app-cartas-facturacion',
  templateUrl: './cartas-facturacion.component.html',
  styleUrls: ['./cartas-facturacion.component.scss']
})
export class CartasFacturacionComponent implements OnInit {

  @Input() idFacturacion;
  @Input() idEstadoFacturacion;

  constructor(private router: Router, private persistenceService: PersistenceService) { }

  ngOnInit() {
    
  }

  linkCartasFacturacion(){
    if(undefined!=this.idFacturacion && undefined!=this.idEstadoFacturacion){
      let datos = new FacturacionItem(); 
      datos.idFacturacion=this.idFacturacion;
      datos.idEstado=this.idEstadoFacturacion;

      this.persistenceService.setDatos(datos);
      this.router.navigate(["/cartaFacturacionPago"], { queryParams: { modo: "f" } });
    }
  }
}
