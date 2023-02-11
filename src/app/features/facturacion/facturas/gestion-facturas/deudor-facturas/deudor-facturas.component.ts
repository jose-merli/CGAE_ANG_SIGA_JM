import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-deudor-facturas',
  templateUrl: './deudor-facturas.component.html',
  styleUrls: ['./deudor-facturas.component.scss']
})
export class DeudorFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  
  @Input() bodyInicial: FacturasItem;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
  }

  navigateToSociedad() {
    if (this.bodyInicial.idDeudor) {
      this.progressSpinner = true;
    
    this.sigaServices.postPaginado(
      "fichaColegialSociedades_searchSocieties",
      "?numPagina=1", this.bodyInicial.idDeudor).toPromise().then(
      n => {
        let results: any[] = JSON.parse(n.body).busquedaJuridicaItems;
        if (results != undefined && results.length != 0) {
          let sociedadItem: any = results[0];

          sessionStorage.setItem("facturasItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("usuarioBody", JSON.stringify(sociedadItem));
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("usuarioBody")) {
        this.router.navigate(["/fichaPersonaJuridica"]);
      } 
    });
    }
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
