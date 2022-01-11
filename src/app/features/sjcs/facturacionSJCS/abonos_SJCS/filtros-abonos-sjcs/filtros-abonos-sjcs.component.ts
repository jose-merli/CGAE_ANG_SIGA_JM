import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../models/ColegiadoItem';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';



@Component({
  selector: 'app-filtros-abonos-sjcs',
  templateUrl: './filtros-abonos-sjcs.component.html',
  styleUrls: ['./filtros-abonos-sjcs.component.scss'],

})
export class FiltrosAbonosSCJSComponent implements OnInit {

  ;
  progressSpinner: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = true;
  showColegiado: boolean = true;
  showSociedad:boolean = true;

  body:any;
  //filtros:FacAbonoItem = new FacAbonoItem(); //Complementar atributos
  filtros:any;

  combo;
  comboGrupoFacturacion = [];
  
  msgs;


  constructor( private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private commonServices: CommonsService) {
   
  }

  ngOnInit() {
  }

  clear(){}

  fillFecha(){

  }

  onHideDatosGenerales(){

  }
  onHideDatosAgrupacion(){}

  onHideColegiado(){}

  onHideSociedad(){}

  clearFilters(){}

  searchAbonosSJCS(){}

  getComboGrupoFacturacion() {
    this.sigaServices.get("").subscribe(
      n => {
        this.comboGrupoFacturacion = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboGrupoFacturacion);
      },
      err => {
        console.log(err);
      }
    );
  }
}
