import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-gestion-guardia-colegiado',
  templateUrl: './gestion-guardia-colegiado.component.html',
  styleUrls: ['./gestion-guardia-colegiado.component.scss']
})
export class GestionGuardiaColegiadoComponent implements OnInit {

  constructor(private location: Location,) { }

  ngOnInit() {
  }

  backTo(){
    this.location.back();
  }
}
