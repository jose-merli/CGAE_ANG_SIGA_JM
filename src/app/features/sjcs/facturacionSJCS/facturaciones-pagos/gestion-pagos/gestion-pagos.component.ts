import { Component, OnInit, ViewChild } from '@angular/core';
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaWrapper } from '../../../../../wrapper/wrapper.class';
import { Location } from "@angular/common";

import { CompensacionFacturaComponent } from './compensacion-factura/compensacion-factura.component';
import { ConfiguracionFicherosComponent } from './configuracion-ficheros/configuracion-ficheros.component';
import { DatosPagosComponent } from './datos-pagos/datos-pagos.component';
import { CriteriosFacturacionComponent } from './criterios-facturacion/criterios-facturacion.component';
import { DetallePagoComponent } from './detalle-pago/detalle-pago.component';

@Component({
  selector: 'app-gestion-pagos',
  templateUrl: './gestion-pagos.component.html',
  styleUrls: ['./gestion-pagos.component.scss']
})
export class GestionPagosComponent extends SigaWrapper  implements OnInit {
  msgs;
  permisos;

  @ViewChild(CompensacionFacturaComponent) compensacion;
  @ViewChild(ConfiguracionFicherosComponent) baremos;
  @ViewChild(DatosPagosComponent) cartas;
  @ViewChild(CriteriosFacturacionComponent) conceptos;
  @ViewChild(DetallePagoComponent) datosFac;

  constructor(private location: Location, private persistenceService: PersistenceService) { 
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    if (undefined != this.persistenceService.getPermisos()) {
			this.permisos = this.persistenceService.getPermisos();
    }
  }

  volver(){
    this.location.back();
  }

  spinnerGlobal(){
    return false;
    /*if(this.modoEdicion){
      if(this.conceptos != undefined || this.baremos != undefined || this.pagos != undefined || this.cartas != undefined){
        if(this.datosFac.progressSpinnerDatos || this.conceptos.progressSpinnerConceptos || this.baremos.progressSpinnerBaremos || this.pagos.progressSpinnerPagos || this.cartas.progressSpinnerCartas){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }

    }else{
      if(this.datosFac.progressSpinnerDatos){
        return true;
      }else{
        return false;
      }
    }*/
  }

  clear() {
		this.msgs = [];
  }
}
