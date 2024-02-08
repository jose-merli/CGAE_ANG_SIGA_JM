import { Component, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { CommonsService } from '../../../../_services/commons.service';
import { TranslateService } from '../../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { Message } from 'primeng/primeng';
import { procesos_ejg } from '../../../../permisos/procesos_ejg';

@Component({
  selector: 'app-gestion-ejg',
  templateUrl: './gestion-ejg.component.html',
  styleUrls: ['./gestion-ejg.component.scss']
})
export class GestionEjgComponent implements OnInit {

  msgs: Message[];
  body: EJGItem = new EJGItem();
  modoEdicion: boolean = false;
  nuevo: boolean = false;
  progressSpinner = false;
  openTarjetaDatosGenerales: Boolean = true;
  permisos: any = {};
  datosResumen: any;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private router: Router,
    private location: Location,
    private commonsService: CommonsService, private datePipe: DatePipe) { 
      this.permisos = procesos_ejg;
  }

  ngOnInit() {

    this.progressSpinner = true;
    
    this.body = new EJGItem();

    if(this.persistenceService.getDatosEJG()){
      this.body = this.persistenceService.getDatosEJG();
      this.persistenceService.clearDatosEJG();
    } else if (sessionStorage.getItem("EJGItemDesigna") != null && sessionStorage.getItem("EJGItemDesigna") != 'nuevo') {
      this.body = JSON.parse(sessionStorage.getItem("EJGItemDesigna"));
      sessionStorage.removeItem("EJGItemDesigna");
    } else if (sessionStorage.getItem("fichaEJG") != null) {
      this.body = JSON.parse(sessionStorage.getItem("fichaEJG"));
      sessionStorage.removeItem("fichaEJG");
    } else if (sessionStorage.getItem("datosDesdeJusticiable") != null) {
      this.body = JSON.parse(sessionStorage.getItem("datosDesdeJusticiable"));
      sessionStorage.removeItem("datosDesdeJusticiable");
    } else {
      this.nuevo = true;
      this.body.fechaApertura = new Date();

      let parametro = { valor: "TIPO_EJG_COLEGIO"};
      this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
        data => {
          if (data != null && data != undefined) {
            this.body.tipoEJG = JSON.parse(data.body).parametro;
          }
        }
      );
    }

    if (this.body.fechaApertura != undefined && this.body.fechaApertura.constructor === String) {
      this.body.fechaApertura = new Date(this.body.fechaApertura);
    }
    if (this.body.fechapresentacion != undefined && this.body.fechapresentacion.constructor === String) {
      this.body.fechapresentacion = new Date(this.body.fechapresentacion);
    }
    if (this.body.fechalimitepresentacion != undefined && this.body.fechalimitepresentacion.constructor === String) {
      this.body.fechalimitepresentacion = new Date(this.body.fechalimitepresentacion);
    }

    this.updateTarjResumen();
  }

  guardadoSend(event) {
  }

  backTo() {
    this.persistenceService.clearDatos();
    if (sessionStorage.getItem("asistencia")) {
      this.router.navigate(['/fichaAsistencia']);
    }else if (this.persistenceService.getFiltrosEJG() != undefined && this.persistenceService.getFiltrosEJG() != null){
      this.router.navigate(["/ejg"]);
    }else{
      this.location.back();
    }
  }

  updateTarjResumen() {

    this.datosResumen = [
      { label: "EJG", value: this.body.numAnnioProcedimiento },
      { label: "F.apertura", value:  this.datePipe.transform(this.body.fechaApertura, "dd/MM/yyyy")},
      { label: "Solicitante", value: this.body.nombreApeSolicitante },
      { label: "Estado EJG", value: this.body.estadoEJG },
      { label: "Designado", value: this.body.apellidosYNombre },
      { label: "Dictamen", value: this.body.dictamenSing },
      { label: "CAJG", value: this.body.numAnnioResolucion },
      { label: "Impugnación", value: this.body.impugnacionDesc }
    ];
    /*
    this.datosResumen = [
      { label: "Año/Numero EJG", value: this.body.numAnnioProcedimiento },
      { label: "Solicitante", value: this.body.nombreApeSolicitante }, 
      { label: "Estado EJG", value: this.body.estadoEJG },
      { label: "Designado", value: this.body.apellidosYNombre },
      { label: "Dictamen", value: this.body.dictamenSing },
      { label: "CAJG", value: this.body.numAnnioResolucion },
      { label: "Impugnación", value: this.body.impugnacionDesc },
    ];
    */
  }
}
