import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { SigaServices } from '../../../../_services/siga.service';
import { FiltroGenerarImpreso190Component } from './filtro-generar-impreso190/filtro-generar-impreso190.component';
import { TablaGenerarImpreso190Component } from './tabla-generar-impreso190/tabla-generar-impreso190.component';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { Router } from '@angular/router';


@Component({
  selector: 'app-generar-impreso190',
  templateUrl: './generar-impreso190.component.html',
  styleUrls: ['./generar-impreso190.component.scss'],

})
export class GenerarImpreso190Component implements OnInit {


  progressSpinner;
  msgs;
  datos
  permisoEscritura;


  @ViewChild(FiltroGenerarImpreso190Component) filtros: FiltroGenerarImpreso190Component;
  @ViewChild(TablaGenerarImpreso190Component) tabla: TablaGenerarImpreso190Component;
  buscar: boolean;

  constructor(
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router) {

  }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_facturacionSJCS.generarImpreso190).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

    }).catch(error => console.error(error));

    this.getImpresos(true);
  }

  getImpresos(event){
    let anio = (this.filtros.anio != null && this.filtros.anio != undefined && this.filtros.anio.length != 0) ? this.filtros.anio.toString() : this.filtros.anio;

    if(anio == undefined || anio == null || anio.length == 0){
      this.showMessage("error", "Incorrecto", this.translateService.instant("cen.busqueda.error.busquedageneral"));
      event = false;
    }

    if(event == true){
      this.progressSpinner = true;

      this.sigaServices.post("impreso190_searchImpresos", anio).subscribe(
        data =>{
          this.datos = JSON.parse(data.body).impreso190Item;
					this.buscar = true;
					let error = JSON.parse(data.body).error;
          this.progressSpinner = false;

          if (error != undefined && error != null && error.description != null) {
						if (error.code == '200') {
							this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
              this.filtros.getComboAnio();
						} else {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
						}
					}
        },
        err =>{
          this.progressSpinner = false;
          if (err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
      )
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
