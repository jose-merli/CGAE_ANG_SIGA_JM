import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { Location } from '@angular/common';
import { BuscadorColegiadosComponent } from './buscador-colegiados/buscador-colegiados.component';
import { SigaServices } from '../../_services/siga.service';
import { DatosColegiadosItem } from '../../models/DatosColegiadosItem';
import { TranslateService } from '../translate';
import { ColegiadosSJCSItem } from '../../models/ColegiadosSJCSItem';

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

          this.datos=data;
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