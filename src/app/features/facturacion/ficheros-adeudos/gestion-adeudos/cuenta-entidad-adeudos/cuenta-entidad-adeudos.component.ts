import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../commons/translate';
import { CuentasBancariasItem } from '../../../../../models/CuentasBancariasItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-cuenta-entidad-adeudos',
  templateUrl: './cuenta-entidad-adeudos.component.html',
  styleUrls: ['./cuenta-entidad-adeudos.component.scss']
})
export class CuentaEntidadAdeudosComponent implements OnInit {
  @Input() bodyInicial: FicherosAdeudosItem;

  progressSpinner: boolean = false;
  body: FicherosAdeudosItem;
  msgs;

  constructor(private sigaServices: SigaServices, private translateService: TranslateService,
    private router: Router) { }

  ngOnInit() {
    this.body =  JSON.parse(JSON.stringify(this.bodyInicial));
  }

  ir(){
    this.progressSpinner=true;

    this.sigaServices.getParam("facturacionPyS_getCuentasBancarias", "?idCuenta=" + this.body.bancosCodigo).subscribe(
      data => {
        this.progressSpinner=false;

        sessionStorage.setItem("cuentaBancariaItem",data.cuentasBancariasITem[0]);
        this.router.navigate(["/fichaCuentaBancaria"]);
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
    );
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