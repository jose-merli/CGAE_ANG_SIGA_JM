import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FicherosDevolucionesItem } from '../../../../../models/FicherosDevolucionesItem';

@Component({
  selector: 'app-ficha-ficheros-devoluciones',
  templateUrl: './ficha-ficheros-devoluciones.component.html',
  styleUrls: ['./ficha-ficheros-devoluciones.component.scss']
})
export class FichaFicherosDevolucionesComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  iconoTarjetaResumen = "clipboard";
  body: FicherosDevolucionesItem = new FicherosDevolucionesItem();
  datos = [];
  enlacesTarjetaResumen = [];

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  backTo() {
    sessionStorage.setItem("volver", "true");
    this.location.back();
  }

}
