import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';
import { FiltrosFacturacionesComponent } from './filtros-facturaciones/filtros-facturaciones.component';
import { TablaFacturacionesComponent } from './tabla-facturaciones/tabla-facturaciones.component';

@Component({
  selector: 'app-facturaciones',
  templateUrl: './facturaciones.component.html',
  styleUrls: ['./facturaciones.component.scss']
})
export class FacturacionesComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;

  buscar: boolean = false;
  datos: FacFacturacionprogramadaItem[] = [];

  @ViewChild(FiltrosFacturacionesComponent) filtros;
  @ViewChild(TablaFacturacionesComponent) tabla;

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private commonsService: CommonsService
  ) { }

  ngOnInit() {
  }

  searchFacturacionProgramada() {
    let filtros = JSON.parse(JSON.stringify(this.filtros.body));
    this.progressSpinner = true;

    this.sigaServices.post("facturacionPyS_getFacturacionesProgramadas", filtros).subscribe(
      n => {
        this.datos = JSON.parse(n.body).facturacionprogramadaItems;

        console.log(this.datos);

        this.buscar = true;
        
        // Descomentar cuando funcione la tabla de facturaciones.
        /*
        if (this.tabla != undefined) {
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }
        */
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);
      }
    );
  }

  // Funciones de utilidad

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
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
