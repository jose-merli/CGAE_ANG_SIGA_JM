import { Component, OnInit, Output } from '@angular/core';
import { Location } from "@angular/common";
import { USER_VALIDATIONS } from '../../../../../properties/val-properties';
import { SigaWrapper } from "../../../../../wrapper/wrapper.class";
import { PersistenceService } from '../../../../../_services/persistence.service';
import { FacturacionItem } from '../../../../../models/sjcs/FacturacionItem';

@Component({
  selector: 'app-gestion-facturacion',
  templateUrl: './gestion-facturacion.component.html',
  styleUrls: ['./gestion-facturacion.component.scss']
})
export class GestionFacturacionComponent extends SigaWrapper implements OnInit {
  progressSpinner: boolean = false;
  datos: FacturacionItem = new FacturacionItem();
  
  cerrada;
  idFacturacion;
  idEstadoFacturacion;
  modoEdicion;
  permisos;

  constructor(private location: Location, private persistenceService: PersistenceService) { 
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    if (undefined!=this.persistenceService.getPermisos()) {
			this.permisos = this.persistenceService.getPermisos();
		}

    if (undefined != this.persistenceService.getPermisos()) {
			this.permisos = this.persistenceService.getPermisos();
    }
    
    if (null !=this.persistenceService.getDatos()) {
      this.datos = this.persistenceService.getDatos();
      this.idFacturacion=this.datos.idFacturacion;
      this.idEstadoFacturacion=this.datos.idEstado;
    }

    if (undefined == this.idFacturacion) {
      this.modoEdicion = false;
      this.cerrada=false;
    } else {
      if(undefined!=this.idEstadoFacturacion){
        if(this.idEstadoFacturacion=='10'){
          this.cerrada=false;
        }else{
          this.cerrada=true;
        }
      }

      this.modoEdicion = true;
    }    
  }

  volver(){
    this.location.back();
  }

  changeModoEdicion(event){
    this.modoEdicion=event;
  }

  changeEstadoFacturacion(event){
    this.idEstadoFacturacion=event;
  }

  changeCerrada(event){
    this.cerrada=event;
  }

  changeIdFacturacion(event){
    this.idFacturacion=event;
  }
}
