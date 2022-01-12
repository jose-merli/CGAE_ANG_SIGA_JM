import { Component, OnInit } from '@angular/core';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';



@Component({
  selector: 'app-ficha-abonos-sjcs',
  templateUrl: './ficha-abonos-sjcs.component.html',
  styleUrls: ['./ficha-abonos-sjcs.component.scss'],

})
export class FichaAbonosSCJSComponent implements OnInit {

  url;
  datos:FacAbonoItem;
  progressSpinner:boolean= false;
  constructor( ) {
   
  }

  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("abonosSJCSItem")) {
      this.datos = JSON.parse(sessionStorage.getItem("abonosSJCSItem"));
      sessionStorage.removeItem("abonosSJCSItem");
    } 

 


    this.progressSpinner = false;
  }




}
