import { Component, OnInit } from '@angular/core';
import { ListaGuardiasItem } from '../../../../../models/guardia/ListaGuardiasItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-buscador-lista-guardias',
  templateUrl: './buscador-lista-guardias.component.html',
  styleUrls: ['./buscador-lista-guardias.component.scss']
})
export class BuscadorListaGuardiasComponent implements OnInit {

  filtro : ListaGuardiasItem = new ListaGuardiasItem();
  filtroAux : ListaGuardiasItem = new ListaGuardiasItem();
  comboTipo = [];
  comboGrupoZona = [];
  comboZona = [];

  constructor(private sigaServices : SigaServices,
    private commonsService : CommonsService) { }

  ngOnInit() {

    this.comboTipo = [
      {
        label : 'Para comunicación o descarga',
        value : 1
      },
      {
        label : 'Para generación',
        value : 2
      }
    ]



    this.getComboGrupoZona();
  }

  getComboGrupoZona(){
    this.sigaServices.get("combossjcs_comboZonas").subscribe(
      n => {
        this.comboGrupoZona = n.combooItems;

      },
      err => {
        console.log(err);
      },
      ()=>{
        this.commonsService.arregloTildesCombo(this.comboGrupoZona);
      }
    );
  }

  onChangeGrupoZona(){
    if(this.filtro.idGrupoZona){
      this.getComboZona();
    }else{
      this.comboZona = [];
      this.filtro.idZona = '';
    }
  }

  getComboZona(){
    this.sigaServices
      .getParam(
        "combossjcs_comboSubZonas",
        "?idZona=" + this.filtro.idGrupoZona)
      .subscribe(
        n => {
          this.comboZona = n.combooItems;
        },
        err => { 
          console.log(err);
        },
        () => {
          this.commonsService.arregloTildesCombo(this.comboZona);
        }
      );
  }

}
