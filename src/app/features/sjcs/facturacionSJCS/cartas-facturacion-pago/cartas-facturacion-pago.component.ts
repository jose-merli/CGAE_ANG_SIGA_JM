import { Component, OnInit, ViewChild } from '@angular/core';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacion';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { TranslateService } from '../../../../commons/translate';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from "@angular/common";
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroCartasFacturacionPagoComponent } from './filtro-cartas-facturacion-pago/filtro-cartas-facturacion-pago.component';
import { TablaCartasFacturacionPagoComponent } from './tabla-cartas-facturacion-pago/tabla-cartas-facturacion-pago.component';

@Component({
  selector: 'app-cartas-facturacion-pago',
  templateUrl: './cartas-facturacion-pago.component.html',
  styleUrls: ['./cartas-facturacion-pago.component.scss']
})
export class CartasFacturacionPagoComponent implements OnInit {

  permisoEscritura: boolean = false;
  datos = [];
  buscar: boolean = false;
  progressSpinner: boolean = false;
  activaVolver: boolean = false;
  modoBusqueda: string;
  msgs = [];

  @ViewChild(FiltroCartasFacturacionPagoComponent) filtros;
  @ViewChild(TablaCartasFacturacionPagoComponent) tabla;

  constructor(private commonsService: CommonsService, private persistenceService: PersistenceService,
    private translateService: TranslateService, private router: Router, private activatedRoute: ActivatedRoute,
    private location: Location, private sigaServices: SigaServices) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_facturacionSJCS.cartasFacturacionPago)
      .then(respuesta => {

        this.permisoEscritura = respuesta;

        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }
      }
    ).catch(error => console.error(error));
    
    this.activaVolver=false;
    
    //Viene de ficha de facturación 
    if (undefined!=this.persistenceService.getDatos()) {
      let datos = this.persistenceService.getDatos();
      let isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
      this.activaVolver=true;

      //Si es letrado no puede ver las cartas de facturacion de las ficha de facturacion 
      if(undefined!=datos.idFacturacion && null!=datos.idFacturacion && !isLetrado){
        datos.modoBusqueda=datos.modo;
        this.filtros.filtros.idFacturacion=datos.idFacturacion;
        this.persistenceService.setFiltros(datos);

        this.search(datos.modo);
      }
    }
  }

  volver(){
    this.persistenceService.setFiltros(this.persistenceService.getFiltrosAux());
    this.location.back();
  }

  desactivaVolver(){
    this.activaVolver=false;
  }

  search(event) {

    this.modoBusqueda = event;
    this.buscar = true;

    if (event == "f") {    
      this.searchFacturacion();
    } else if (event == "p") {
      this.searchPago();
    }
  }

  changeModoBusqueda(){
    this.buscar = false;
  }

  searchFacturacion() {

    this.progressSpinner = true;

    this.sigaServices.post("facturacionsjcs_buscarCartasfacturacion", this.filtros.filtros).subscribe(
      data => {

        let datos = JSON.parse(data["body"]);
        let error = JSON.parse(data.body).error;

        this.datos = datos.cartasFacturacionPagosItems;

        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
        }

        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
      }
    );

  }

  searchPago() {

    this.progressSpinner = true;

    this.sigaServices.post("facturacionsjcs_buscarCartaspago", this.filtros.filtros).subscribe(
      data => {
        let datos = JSON.parse(data["body"]);
        let error = JSON.parse(data.body).error;
        this.datos = datos.cartasFacturacionPagosItems;
        if (this.tabla != undefined) {
          this.tabla.tabla.sortOrder = 0;
          this.tabla.tabla.sortField = '';
          this.tabla.tabla.reset();
        }
        this.progressSpinner = false;

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

      },
      err => {
        console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
      }
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

  clear(){
    this.msgs = [];
  }

}
