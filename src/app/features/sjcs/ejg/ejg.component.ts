import { Component, OnInit, ViewChild } from '@angular/core';
import { OldSigaServices } from '../../../_services/oldSiga.service'
import { TranslateService } from '../../../commons/translate';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { TablaEjgComponent } from './tabla-ejg/tabla-ejg.component';
import { FiltrosEjgComponent } from './filtros-busqueda-ejg/filtros-ejg.component';
import * as moment from "moment";
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { EJGItem } from '../../../models/sjcs/EJGItem';
import { procesos_ejg } from '../../../permisos/procesos_ejg';

@Component({
  selector: 'app-ejg',
  templateUrl: './ejg.component.html',
  styleUrls: ['./ejg.component.scss'],

})
export class EJGComponent implements OnInit {

  url;
  datos;
  msgs;
  institucionActual;

  historico: boolean = false;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  remesa;

  permisoEscritura: any;
  

  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  // la particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  // cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
  //  ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
  //  el hijo lo declaramos como @ViewChild(ChildComponent)).

  @ViewChild(FiltrosEjgComponent) filtros;
  @ViewChild(FiltrosEjgComponent) usuarioBusquedaExpress;
  @ViewChild(TablaEjgComponent) tabla;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router) { }

  ngOnInit() {
    this.buscar = this.filtros.buscar

    this.commonsService.checkAcceso(procesos_ejg.ejg)
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
    }).catch(error => console.error(error));

    //Preparacion previa para recibir el valor de remesa si se accede a esta pantalla desde una ficha
    //de remesa.
    if (sessionStorage.getItem("remesa") != null) {
      this.remesa = JSON.parse(sessionStorage.getItem("remesa"));
      sessionStorage.removeItem("remesa");
    }
  }

  searchEJGs(event) {

    this.progressSpinner = true;
    
    this.sigaServices.post("filtrosejg_busquedaEJG", this.filtros.body).subscribe(
      n => {
        this.datos = JSON.parse(n.body).ejgItems;
        let error = JSON.parse(n.body).error;
        this.buscar = true;
        if (this.tabla != null && this.tabla != undefined) {
          this.tabla.historico = event;
          this.tabla.table.sortOrder = 0;
          this.tabla.table.sortField = '';
          this.tabla.table.reset();
          this.tabla.buscadores = this.tabla.buscadores.map(it => it = "");
        }
        this.progressSpinner = false;
        if (error != null && error.description != null) {
          this.showMessageError("info", this.translateService.instant("general.message.informacion"), error.description);
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () =>{
        this.progressSpinner = false;
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
          this.commonsService.scrollTop();
        }, 5);       
      }
    );
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }
  showMessageError(severity, summary, msg) {
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

  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }
}




