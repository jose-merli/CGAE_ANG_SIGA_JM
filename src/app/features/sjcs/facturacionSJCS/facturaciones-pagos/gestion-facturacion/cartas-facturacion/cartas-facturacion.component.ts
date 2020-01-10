import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FacturacionItem } from '../../../../../../models/sjcs/FacturacionItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-cartas-facturacion',
  templateUrl: './cartas-facturacion.component.html',
  styleUrls: ['./cartas-facturacion.component.scss']
})
export class CartasFacturacionComponent implements OnInit {
  progressSpinnerCartas: boolean = false;
  numApuntes = 0;

  @Input() idFacturacion;
  @Input() idEstadoFacturacion;

  constructor(private router: Router, private persistenceService: PersistenceService,
    private sigaService: SigaServices) { }

  ngOnInit() {
    if(undefined!=this.idFacturacion){
      this.serviceNumApuntes();    
    }
  }

  serviceNumApuntes(){
    if(undefined!=this.idFacturacion){
      this.progressSpinnerCartas = true;

      //datos de la facturación
      this.sigaService.getParam("facturacionsjcs_numApuntes", "?idFacturacion=" + this.idFacturacion).subscribe(
        data => {
          this.numApuntes = data.valor;
          this.progressSpinnerCartas = false;
        },	  
        err => {
          console.log(err);
          this.progressSpinnerCartas = false;
        }
      );
    }
  }

  disableEnlaceCartas(){
    if(this.idEstadoFacturacion=='30' || this.idEstadoFacturacion=='20'){
      return false;
    }else{
      return true;
    }
  }

  linkCartasFacturacion(){
    if(undefined!=this.idFacturacion && undefined!=this.idEstadoFacturacion && (this.idEstadoFacturacion=='30' || this.idEstadoFacturacion=='20')){
      let datos= this.persistenceService.getDatos();
      this.persistenceService.setFiltrosAux(this.persistenceService.getFiltros());

      datos.idFacturacion=this.idFacturacion;
      datos.modo="f";

      this.persistenceService.setDatos(datos);
      this.router.navigate(["/cartaFacturacionPago"]);
    }
  }
}
