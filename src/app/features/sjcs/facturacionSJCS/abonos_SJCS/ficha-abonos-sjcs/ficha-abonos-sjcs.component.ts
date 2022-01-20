import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FacturasItem } from '../../../../../models/FacturasItem';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { SigaServices } from '../../../../../_services/siga.service';
import { PagoAbonosSJCSComponent } from './pago-abonos-sjcs/pago-abonos-sjcs.component';



@Component({
  selector: 'app-ficha-abonos-sjcs',
  templateUrl: './ficha-abonos-sjcs.component.html',
  styleUrls: ['./ficha-abonos-sjcs.component.scss'],

})
export class FichaAbonosSCJSComponent implements OnInit {

  url;
  datos:FacAbonoItem;
  progressSpinner:boolean= false;
  iconoTarjetaResumen = "clipboard";
  body: FacturasItem;
  enlacesTarjetaResumen = [];
  datosImportantes=[];

  @ViewChild(PagoAbonosSJCSComponent)pagoPadre;

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
    this.updateTarjetaResumen();
    this.updateEnlacesTarjetaResumen();

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
 // Transformar fecha
 transformDate(fecha) {
  if (fecha != undefined)
    fecha = new Date(fecha);
  else
    fecha = null;
  fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
  return fecha;
}
  updateTarjetaResumen(): void {
    this.datosImportantes = [
      {
        label: "Número Factura",
        value: this.datos.numeroAbono
      },
      {
        label: "Fecha Emisión",
        value: this.datos.fechaEmision
      }
    ]
  }

  updateEnlacesTarjetaResumen(): void {
    this.enlacesTarjetaResumen = [];

    this.enlacesTarjetaResumen.push({
      label: "facturacion.productos.Cliente",
      value: document.getElementById("colegiado"),
      nombre: "cliente",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacionSJCS.tabla.abonosSJCS.pagoSJCS",
      value: document.getElementById("pago"),
      nombre: "pago",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacionSJCS.filtros.abonosSJCS.sociedad",
      value: document.getElementById("sociedad"),
      nombre: "sociedad",
    });

    this.enlacesTarjetaResumen.push({
      label: "general.message.datos.generales",
      value: document.getElementById("datosGenerales"),
      nombre: "datosGenerales",
    });

    this.enlacesTarjetaResumen.push({
      label: "facturacion.facturas.estadosPagos.literal",
      value: document.getElementById("estadosPagos"),
      nombre: "estadosPagos",
    });


    this.enlacesTarjetaResumen.push({
        label: "facturacion.facturas.observacionesRect.literal",
        value: document.getElementById("observaciones"),
        nombre: "observacionesRectificativa",
    });
    

    this.enlacesTarjetaResumen.push({
      label: "facturacion.facturas.lineasRect.literal",
      value: document.getElementById("lineas"),
      nombre: "lineas",
    });


  }


}
