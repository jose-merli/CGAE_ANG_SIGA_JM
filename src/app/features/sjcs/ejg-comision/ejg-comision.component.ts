import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../commons/translate';
import { SigaServices } from '../../../_services/siga.service';
import { CommonsService } from '../../../_services/commons.service';
import { PersistenceService } from '../../../_services/persistence.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { TablaEjgComisionComponent } from './tabla-ejg-comision/tabla-ejg-comision.component';
import { EjgComisionBusquedaComponent } from './ejg-comision-busqueda/ejg-comision-busqueda.component';
import { procesos_comision } from '../../../permisos/procesos_comision';
import { ActasItem } from '../../../models/sjcs/ActasItem';
import { Location } from '@angular/common';


@Component({
  selector: 'app-ejg-comision',
  templateUrl: './ejg-comision.component.html',
  styleUrls: ['./ejg-comision.component.scss']
})
export class EjgComisionComponent implements OnInit {
  url;
  datos = "";
  msgs;
  institucionActual;pac

  historico: boolean = false;
  progressSpinner: boolean = false;
  buscar: boolean = false;
  remesa;

  permisoEscritura: any;

  acta: ActasItem = null;
  
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  // la particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  // cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
  //  ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
  //  el hijo lo declaramos como @ViewChild(ChildComponent)).

  @ViewChild(EjgComisionBusquedaComponent) filtros;
  @ViewChild(EjgComisionBusquedaComponent) usuarioBusquedaExpress;
  @ViewChild(TablaEjgComisionComponent) tabla;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.commonsService.checkAcceso(procesos_comision.ejgComision)
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

      //Preparacion previa para recibir el valor de remesa si se accede a esta pantalla desde una ficha
      //de remesa.
      if (sessionStorage.getItem("remesa") != null) {
        this.remesa = JSON.parse(sessionStorage.getItem("remesa"));
        sessionStorage.removeItem("remesa");
      }
       
      if(sessionStorage.getItem("acta") != null){
        this.acta = JSON.parse(sessionStorage.getItem("acta"));
        sessionStorage.removeItem("acta");
        console.log("El acta es -> ", this.acta);
      }
        
      
  }

  searchEJGs(event) {

    // Creamos una copia de los filtros y modificamos los elementos de selección múltiple (cambiamos los arrays por strings separados por ',')
    let filtros = JSON.parse(JSON.stringify(this.filtros.body));
    this.progressSpinner = true;

    if (filtros.tipoEJG) {
      if (filtros.tipoEJG.length > 0) {
        filtros.tipoEJG = filtros.tipoEJG.toString();
      } else {
        filtros.tipoEJG = undefined;
      }
    }

    if (filtros.tipoEJGColegio) {
      if (filtros.tipoEJGColegio.length > 0) {
        filtros.tipoEJGColegio = filtros.tipoEJGColegio.toString();
      } else {
        filtros.tipoEJGColegio = undefined;
      }
    }

    if (filtros.creadoDesde) {
      if (filtros.creadoDesde.length > 0) {
        let cadena = "";
        filtros.creadoDesde.forEach((el: string, i: number) => {
          cadena += "'" + el + "'";
          if (i < filtros.creadoDesde.length - 1) {
            cadena += ", ";
          }
        });
        filtros.creadoDesde = cadena;
      } else {
        filtros.creadoDesde = undefined;
      }
    }

    if (filtros.estadoEJG) {
      if (filtros.estadoEJG.length > 0) {
        filtros.estadoEJG = filtros.estadoEJG.toString();
      } else {
        filtros.estadoEJG = undefined;
      }
    }

    this.sigaServices.post("filtrosejgcomision_busquedaEJGComision", filtros).subscribe(
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
        //cadena = [];
        this.progressSpinner = false;
        if (error != null && error.description != null) {
          this.showMessageError("info", this.translateService.instant("general.message.informacion"), error.description);
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
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
    return fecha;
  }

  backTo() {
    localStorage.setItem('actasItem', JSON.stringify(this.acta));
    this.location.back();
  }
}
