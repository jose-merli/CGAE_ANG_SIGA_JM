import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { BuscadorColegiadosComponent } from './buscador-colegiados/buscador-colegiados.component';
import { SigaServices } from '../../_services/siga.service';
import { TranslateService } from '../translate';
import { ColegiadosSJCSItem } from '../../models/ColegiadosSJCSItem';
import { ResultadoBuscadorColegiadosComponent } from './resultado-buscador-colegiados/resultado-buscador-colegiados.component';

@Component({
  selector: 'app-pantalla-buscador-colegiados',
  templateUrl: './pantalla-buscador-colegiados.component.html',
  styleUrls: ['./pantalla-buscador-colegiados.component.scss']
})
export class PantallaBuscadorColegiadosComponent implements OnInit {
  progressSpinner: boolean = false;
  msgs: Message[] = [];
  show = false;

  datos: ColegiadosSJCSItem = new ColegiadosSJCSItem();

  @ViewChild(BuscadorColegiadosComponent) filtro;
  @ViewChild(ResultadoBuscadorColegiadosComponent) tabla;

  constructor(private location: Location, private sigaServices: SigaServices, private translateService: TranslateService) { }

  ngOnInit() {
    if (sessionStorage.getItem('usuarioBusquedaExpress')) {
      sessionStorage.removeItem('usuarioBusquedaExpress')
    }
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  showResponse() {
    this.show = true;
  }

  hideResponse() {
    this.show = false;
  }

  goBack() {
    this.location.back();
  }

  buscar(){
    if(this.filtro.filtro.length!=0){
      this.progressSpinner = true;
      
      this.sigaServices.post("busquedaColegiadoEJG", this.filtro.filtro).subscribe(
        data => {
          this.progressSpinner = false;
          this.show=true;
          this.datos = JSON.parse(data.body).colegiadosSJCSItem;
          let error = JSON.parse(data.body).error;

          if (this.tabla != null && this.tabla != undefined) {
            this.tabla.table.sortOrder = 0;
            this.tabla.table.sortField = '';
            this.tabla.table.reset();
            this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
          }

          if (error != null && error.description != null) {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
          }
        },
        error => {
          this.progressSpinner = false;
          console.log(error);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}