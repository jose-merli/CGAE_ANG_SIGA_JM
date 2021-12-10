import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { DatosColegiadosItem } from '../../../../../models/DatosColegiadosItem';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-cliente-facturas',
  templateUrl: './cliente-facturas.component.html',
  styleUrls: ['./cliente-facturas.component.scss']
})
export class ClienteFacturasComponent implements OnInit {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  
  @Input() bodyInicial: FacturasItem;
  
  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigateToCliente() {
    this.progressSpinner = true;

    sessionStorage.setItem("consulta", "true");
    let filtros = { idPersona: this.bodyInicial.idCliente };

    this.sigaServices.postPaginado("busquedaColegiados_searchColegiadoFicha", "?numPagina=1", filtros).toPromise().then(
      n => {
        console.log(n)
        let results: DatosColegiadosItem[] = JSON.parse(n.body).colegiadoItem;
        console.log(results)
        if (results != undefined && results.length != 0) {
          let datosColegiado: DatosColegiadosItem = results[0];

          sessionStorage.setItem("facturaItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("personaBody", JSON.stringify(datosColegiado));
          sessionStorage.setItem("filtrosBusquedaColegiados", JSON.stringify(filtros));
          sessionStorage.setItem("solicitudAprobada", "true");
          sessionStorage.setItem("origin", "Cliente");
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    ).then(() => this.progressSpinner = false).then(() => {
      if (sessionStorage.getItem("personaBody")) {
        this.router.navigate(["/fichaColegial"]);
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
