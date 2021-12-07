import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-facturacion-facturas',
  templateUrl: './facturacion-facturas.component.html',
  styleUrls: ['./facturacion-facturas.component.scss']
})
export class FacturacionFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  
  @Input() bodyInicial: FacturasItem;
  
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  navigateToFacturacion() {
    this.progressSpinner = true;
    let filtros = { idSerieFacturacion: this.bodyInicial.idSerieFacturacion, idProgramacion: this.bodyInicial.idFacturacion };

    this.sigaServices.post("facturacionPyS_getFacturacionesProgramadas", filtros).toPromise().then(
      n => {
        let results: FacFacturacionprogramadaItem[] = JSON.parse(n.body).serieFacturacionItems;
        if (results != undefined && results.length != 0) {
          let facturacionProgramadaItem: FacFacturacionprogramadaItem = results[0];

          sessionStorage.setItem("facturaItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("facturacionProgramadaItem", JSON.stringify(facturacionProgramadaItem));
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("facturacionProgramadaItem")) {
        this.router.navigate(["/fichaFactProgramadas"]);
      } 
    });
  }

  // Mensajes en pantalla

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
}
