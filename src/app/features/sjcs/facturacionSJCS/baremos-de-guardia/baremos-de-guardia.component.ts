import { Component, OnInit, ViewChild } from '@angular/core';
import { procesos_facturacionSJCS } from '../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { FiltroBusquedaBaremosComponent } from './filtro-busqueda-baremos/filtro-busqueda-baremos.component';
import { SigaServices } from '../../../../_services/siga.service';
import { BaremosGuardiaItem } from '../../../../models/sjcs/BaremosGuardiaItem';
import { Location } from '@angular/common';
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
    private sigaServices: SigaServices,
    private location: Location
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

  getBaremosGuardias(event, historico?:boolean) {
    if (event == true) {


      this.progressSpinner = true;
      let baremoBusqueda: BaremosGuardiaItem = new BaremosGuardiaItem();
      baremoBusqueda.idFacturaciones = [this.filtros.filtros.idFacturaciones.toString()];
      if(this.filtros.filtros.idGuardias && this.filtros.filtros.idGuardias != null){
        baremoBusqueda.idGuardias = this.filtros.filtros.idGuardias;
      }
      if(this.filtros.filtros.idTurnos && this.filtros.filtros.idTurnos != null){
        baremoBusqueda.idTurnos = this.filtros.filtros.idTurnos;
      }

      if (historico) {
        if (historico == true) {
          baremoBusqueda.historico = true;
        } else if (historico == false) {
          baremoBusqueda.historico = false;
        }
      }
      
      this.sigaServices.post("baremosGuardia_buscar", baremoBusqueda).subscribe(
        data => {
          this.datos = JSON.parse(data.body).baremosRequestItems[0].guardiasObj;
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
        err => {
          this.progressSpinner = false;
          if (err && err != undefined && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
      )
    }
  }

  mostrarHistorico(event) {
    let buscar = true;
    if (event == true) {
      this.filtros.filtros.historico = true;
      this.getBaremosGuardias(buscar, true);
    } else if (event == false) {
      this.filtros.filtros.historico = false;
      this.getBaremosGuardias(buscar, false);
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

  backTo() {
		this.location.back();
	}
}
