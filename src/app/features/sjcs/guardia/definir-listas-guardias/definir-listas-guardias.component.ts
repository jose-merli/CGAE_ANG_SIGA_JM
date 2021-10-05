import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { BuscadorListaGuardiasComponent } from './buscador-lista-guardias/buscador-lista-guardias.component';


@Component({
  selector: 'app-definir-listas-guardias',
  templateUrl: './definir-listas-guardias.component.html',
  styleUrls: ['./definir-listas-guardias.component.scss'],

})
export class DefinirListasGuardiasComponent implements OnInit {

  show : boolean = false;
  msgs : Message[] = [];
  rutas : string [] = []
  progressSpinner : boolean = false;

  @ViewChild(BuscadorListaGuardiasComponent) buscador : BuscadorListaGuardiasComponent;
  constructor(private translateService : TranslateService) {
    
  }

  ngOnInit() {

    this.rutas = ['SJCS',this.translateService.instant("menu.justiciaGratuita.GuardiaMenu"),'Configurar Listado Guardias'];
  }

  showResponse() {
    this.show = true;
  }
  hideResponse() {
    this.show = false;
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

  reset(){
    this.buscador.filtro = Object.assign({}, this.buscador.filtroAux);
  }

  search(){

  }
}
