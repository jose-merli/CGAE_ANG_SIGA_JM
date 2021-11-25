import { Component, OnInit, ViewChild } from '@angular/core';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { FiltroBusquedaBaremosComponent } from './filtro-busqueda-baremos/filtro-busqueda-baremos.component';
import { SigaServices } from '../../../../_services/siga.service';

@Component({
  selector: 'app-baremos-de-guardia',
  templateUrl: './baremos-de-guardia.component.html',
  styleUrls: ['./baremos-de-guardia.component.scss']
})
export class BaremosDeGuardiaComponent implements OnInit {

  permisoEscritura: boolean = false;
  mostrarTablaResultados: boolean = false;
  datos;
  @ViewChild(FiltroBusquedaBaremosComponent) filtros: FiltroBusquedaBaremosComponent;
  progressSpinner: boolean;
  msgs: any[];
  constructor(
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaBaremosDeGuardia).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

    }).catch(error => console.error(error));

  }

  getBaremosGuardias(event){
    if(event == true){
      
      console.log(this.filtros.filtros);
      this.progressSpinner = true;
      this.sigaServices.post("baremosGuardia_buscar",this.filtros.filtros).subscribe(
        data =>{
          this.datos = JSON.parse(data.body).baremosRequestItems;
          this.mostrarTablaResultados = true;
					let error = JSON.parse(data.body).error;
          this.progressSpinner = false;

          if (error != undefined && error != null && error.description != null) {
						if (error.code == '200') {
							this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
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
