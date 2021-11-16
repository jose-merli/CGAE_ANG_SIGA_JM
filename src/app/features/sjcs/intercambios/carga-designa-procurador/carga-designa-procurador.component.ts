import { Component, OnInit } from '@angular/core';
import { RemesasResolucionItem } from '../../../../models/sjcs/RemesasResolucionItem';

@Component({
  selector: 'app-carga-designa-procurador',
  templateUrl: './carga-designa-procurador.component.html',
  styleUrls: ['./carga-designa-procurador.component.scss']
})
export class CargaDesignaProcuradorComponent implements OnInit {

  buscar: boolean = false;
  progressSpinner: boolean = false;
  datos;
  msgs;
  filtrosValues: RemesasResolucionItem = new RemesasResolucionItem();
  constructor() { }

  ngOnInit() {
  }
  
  clear() {
    this.msgs = [];
  }
  
  getFiltrosValues(event) {
    this.filtrosValues = JSON.parse(JSON.stringify(event));
   // this.convertArraysToStrings();
   // this.search();
  }
}
