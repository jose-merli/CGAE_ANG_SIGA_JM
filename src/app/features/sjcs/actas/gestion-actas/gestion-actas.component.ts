import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TarjetaListadoEjgsComponent } from './tarjeta-listado-ejgs/tarjeta-listado-ejgs.component';
import { ActasItem } from '../../../../models/sjcs/ActasItem';
import { SigaStorageService } from '../../../../siga-storage.service';
import { SigaServices } from '../../../../_services/siga.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-gestion-actas',
  templateUrl: './gestion-actas.component.html',
  styleUrls: ['./gestion-actas.component.scss']
})
export class GestionActasComponent implements OnInit {

  fichasPosibles;
  datos: ActasItem = new ActasItem();
  modoEdicion: boolean = true;
  institucionActual: any;
  actaItem: ActasItem;
  @ViewChild(TarjetaListadoEjgsComponent) tarjetaListado: TarjetaListadoEjgsComponent;

  expNum:any;
  idInstitucionActual: any;
  constructor(private persistenceService: PersistenceService, private location: Location,
    private localStorageService: SigaStorageService, private sigaServices: SigaServices) { }

  ngOnInit() {
  
      this.datos = new ActasItem();
      this.modoEdicion = false;

      this.sigaServices.get("institucionActual").subscribe(n => { 
        this.idInstitucionActual = n.value 
      });

   
    if(sessionStorage.getItem('actasItem')){
      this.datos = JSON.parse(sessionStorage.getItem('actasItem'));
      console.log(this.actaItem);
      sessionStorage.removeItem('actasItem');
    }
  }

  buscarEJGs(){
    this.tarjetaListado.getEJG(this.datos);
  }

  actaGuardada(event: Boolean){
    if(event){
      this.tarjetaListado.guardado = true;
    }else{
      this.tarjetaListado.guardado = false;
    }
  }

  datosActa(event: ActasItem){
    this.datos = event;
      this.datos.idinstitucion = this.idInstitucionActual;
  }

  expediente(event :string){
    this.expNum = event;
  }
  backTo() {
    this.location.back();
  }

  modoEdicionSend(event) {
    this.modoEdicion = event.modoEdicion;
    this.datos.idacta = event.idacta;
  }
  
  }


