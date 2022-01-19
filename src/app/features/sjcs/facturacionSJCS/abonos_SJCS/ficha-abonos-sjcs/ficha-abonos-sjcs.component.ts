import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { SigaServices } from '../../../../../_services/siga.service';



@Component({
  selector: 'app-ficha-abonos-sjcs',
  templateUrl: './ficha-abonos-sjcs.component.html',
  styleUrls: ['./ficha-abonos-sjcs.component.scss'],

})
export class FichaAbonosSCJSComponent implements OnInit {

  url;
  datos:FacAbonoItem;
  progressSpinner:boolean= false;

  body: FacturasItem;
  
  constructor(
    private location: Location,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private datepipe: DatePipe
  ) { }
  ngOnInit() {
    this.progressSpinner = true;

    if (sessionStorage.getItem("abonosSJCSItem")) {
      this.datos = JSON.parse(sessionStorage.getItem("abonosSJCSItem"));
      sessionStorage.removeItem("abonosSJCSItem");
    } 
    this.getDatosFactura(this.datos.idAbono);
 


    this.progressSpinner = false;
  }
  getDatosFactura(idFactura): Promise<any> {
    return this.sigaServices.getParam("facturacionPyS_getFactura", `?idFactura=${idFactura}&tipo=ABONO`).toPromise().then(
      n => {
        let datos: FacturasItem[] = n.facturasItems;

        if (datos == undefined || datos.length == 0) {
          return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
        }

        this.body = datos[0];
      }, err => { 
        return Promise.reject(this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }




}
