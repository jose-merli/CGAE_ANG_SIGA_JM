import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-facturacion-adeudos',
  templateUrl: './facturacion-adeudos.component.html',
  styleUrls: ['./facturacion-adeudos.component.scss']
})

export class FacturacionAdeudosComponent implements OnInit {

  @Input() bodyInicial: FicherosAdeudosItem;

  progressSpinner: boolean = false;
  body: FicherosAdeudosItem;
  msgs;

  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
  }

  ir() {
    //   sessionStorage.setItem("idInstitucionFichaColegial", idInstitucion.toString());
    //   this.router.navigate(["/turnoOficioCenso"]);

    if (this.bodyInicial.idprogramacion) {
      this.progressSpinner = true;
      let filtros = { idSerieFacturacion: this.bodyInicial.idseriefacturacion, idProgramacion: this.bodyInicial.idprogramacion };

      this.sigaServices.post("facturacionPyS_getFacturacionesProgramadas", filtros).toPromise().then(
        n => {
          let results: FacFacturacionprogramadaItem[] = JSON.parse(n.body).facturacionprogramadaItems;
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
          this.router.navigate(["/fichaFacturaciones"]);
        }
      });
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

  clear() {
    this.msgs = [];
  }
}
