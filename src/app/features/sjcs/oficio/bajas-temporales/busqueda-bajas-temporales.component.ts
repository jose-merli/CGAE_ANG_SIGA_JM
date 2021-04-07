import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { CommonsService } from '../../../../_services/commons.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { Router } from '@angular/router';
// import { FiltrosTurnos } from './filtros-turnos/filtros-turnos.component';
// import { TablaTurnosComponent } from './gestion-turnos/gestion-turnos.component';
import { procesos_oficio } from '../../../../permisos/procesos_oficio';
import { FiltrosBajasTemporales } from './filtros-inscripciones/filtros-bajas-temporales.component';
import { GestionBajasTemporalesComponent } from './gestion-bajas-temporales/gestion-bajas-temporales.component';
import { Row, GestionBajasTemporalesService } from './gestion-bajas-temporales/gestion-bajas-temporales.service';
import { DatePipe } from '@angular/common';
import { BajasTemporalesItem } from '../../../../models/sjcs/BajasTemporalesItem';

@Component({
  selector: 'app-bajas-temporales',
  templateUrl: './busqueda-bajas-temporales.component.html',
  styleUrls: ['./busqueda-bajas-temporales.component.scss'],

})
export class BajasTemporalesComponent implements OnInit {
  buscar: boolean = false;
  messageShow: string;

  datos;
  progressSpinner: boolean = false;
  //Mediante esta sentencia el padre puede acceder a los datos y atributos del hijo
  /*a particularidad de éste método es que tenemos que esperar a que la vista esté totalmente 
  cargada para acceder a los atributos del hijo. Para ello creamos un método de Angular llamado
   ngAfterViewInit() en el que simplemente inicializamos la variable con el valor del atributo del hijo 
   el hijo lo declaramos como @ViewChild(ChildComponent)).*/

  @ViewChild(FiltrosBajasTemporales) filtros;
  @ViewChild(GestionBajasTemporalesComponent) tablapartida:GestionBajasTemporalesComponent;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;

  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];

  isDisabled;
  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  selectedRow: Row;
  cabeceras = [
    { id: "ncolegiado", name: "facturacionSJCS.facturacionesYPagos.numColegiado" },
    { id: "nombre", name: "busquedaSanciones.detalleSancion.letrado.literal" },
    { id: "tiponombre", name: "dato.jgr.guardia.guardias.turno" },
    { id: "descripcion", name: "administracion.auditoriaUsuarios.literal.motivo" },
    { id: "fechadesde", name: "facturacion.seriesFacturacion.literal.fInicio" },
    { id: "fechahasta", name: "censo.consultaDatos.literal.fechaFin" },
    { id: "fechaalta", name: "formacion.busquedaInscripcion.fechaSolicitud" },
    { id: "validado", name: "censo.busquedaSolicitudesModificacion.literal.estado" },
    { id: "fechabt", name: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
  ];

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router,
    private gbtservice : GestionBajasTemporalesService,
    private datePipe: DatePipe) { }


  ngOnInit() {
    this.commonsService.checkAcceso(procesos_oficio.inscripciones)
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
  }

  ngAfterViewInit() {
  }

  searchPartidas(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;

    this.sigaServices.post("bajasTemporales_busquedaBajasTemporales", this.filtros.filtroAux).subscribe(
      n => {
        this.datos = JSON.parse(n.body).bajasTemporalesItem;
        this.datos.forEach(element => {

          element.fechadesde = this.formatDate(element.fechadesde);
          element.fechahasta = this.formatDate(element.fechahasta);
          element.fechaalta = this.formatDate(element.fechaalta);
          element.fechabt = this.formatDate(element.fechabt);
          element.fechaestado = this.formatDate(element.fechaestado);

          if (element.tipo == "V") {
            element.tiponombre = "Vacaciones";
          }
          if (element.tipo == "M") {
            element.tiponombre = "Maternidad";
          }
          if (element.tipo == "B") {
            element.tiponombre = "Baja";
          }
          if (element.tipo == "S") {
            element.tiponombre = "Suspensión por sanción";
          }

          if (element.validado == "0") {
            element.validado = "Denegada";
          }
          if (element.validado == "1") {
            element.validado = "Validada";
          }
          if (element.validado == "2" || element.validado == null) {
            element.validado = "Pendiente";
          }
          if (element.validado == "3") {
            element.validado = "Anulada";
          }
          element.ncolegiado = +element.ncolegiado;

        });
        this.jsonToRow(this.datos);
        this.buscar = true;
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        setTimeout(() => {
          this.tablapartida.tablaFoco.nativeElement.scrollIntoView();
        }, 5);
      }
    );
  }

  searchHistorico(event){
    this.searchPartidas(event);
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

jsonToRow(datos){
  console.log(datos);
  let arr = [];

  datos.forEach((element, index) => {
    let italic = (element.eliminado == 1);
    if(element.eliminado == 1){
      let obj = [
        { type: 'text', value: element.ncolegiado},
        { type: 'text', value: element.apellidos1 +" "+ element.apellidos2 + ", " + element.nombre},
        { type: 'text', value: element.tiponombre},
        { type: 'text', value: element.descripcion},
        { type: 'text', value: element.fechadesde},
        { type: 'text', value: element.fechahasta},
        { type: 'text', value: element.fechaalta},
        { type: 'text', value: element.validado},
        { type: 'text', value: element.fechaestado}
      ];
      let superObj = {
        id: index,
        italic: italic,
        row: obj
      };

      arr.push(superObj);
    }else{
      let obj = [
        { type: 'text', value: element.ncolegiado},
        { type: 'text', value: element.apellidos1 +" "+ element.apellidos2 + ", " + element.nombre},
        { type: 'select', combo: this.comboTipo ,value: element.tipo},
        { type: 'input', value: element.descripcion},
        { type: 'datePicker', value: element.fechadesde},
        { type: 'datePicker', value: element.fechahasta},
        { type: 'text', value: element.fechaalta},
        { type: 'text', value: element.validado},
        { type: 'text', value: element.fechaestado}
      ];
      let superObj = {
        id: index,
        italic: italic,
        row: obj
      };

      arr.push(superObj);
    }
  });

  this.rowGroups = this.gbtservice.getTableData(arr);
  this.rowGroupsAux = this.gbtservice.getTableData(arr);
  this.totalRegistros = this.rowGroups.length;
}

modDatos(event){
  console.log(event);

  let array = [];
  let array2 = [];

  event.forEach(element => {
    element.cells.forEach(dato => {
      array.push(dato.value);
    });
    array2.push(array);
    array=[];
  });
  console.log(array);
  console.log(array2);
  this.guardar(array2);
}

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  clear() {
    this.msgs = [];
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }
    return fecha;
  }

  delete(event){
    let array = [];
    event.forEach(element => {
      if(this.datos[element].fechadesde != null){
        this.datos[element].fechadesde=this.transformaFecha(this.datos[element].fechadesde);
      }
      if(this.datos[element].fechahasta != null){
        this.datos[element].fechahasta=this.transformaFecha(this.datos[element].fechahasta);
      }
      if(this.datos[element].fechaalta != null){
        this.datos[element].fechaalta=this.transformaFecha(this.datos[element].fechaalta);
      }
      if(this.datos[element].fechabt != null){
        this.datos[element].fechabt=this.transformaFecha(this.datos[element].fechabt);
      }
      if(this.datos[element].fechaestado != null){
        this.datos[element].fechaestado=this.transformaFecha(this.datos[element].fechaestado);
      }
      array.push(this.datos[element]);
    });
    
    this.progressSpinner = true;
    this.sigaServices.post("bajasTemporales_deleteBajaTemporal", array).subscribe(
      data => {
        array = [];
        this.showMessage({ severity: "success", summary: this.translateService.instant("general.message.correct"), msg: this.translateService.instant("general.message.accion.realizada")});
        this.progressSpinner = false;
      },
      err => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
        
        this.progressSpinner = false;
      }
    );
    this.searchPartidas(this.filtros.filtroAux.historico);
  }

denegar(event){
  let array = [];
  event.forEach(element => {
    if(this.datos[element].validado == "Pendiente"){
      if(this.datos[element].fechadesde != null){
        this.datos[element].fechadesde=this.transformaFecha(this.datos[element].fechadesde);
      }
      if(this.datos[element].fechahasta != null){
        this.datos[element].fechahasta=this.transformaFecha(this.datos[element].fechahasta);
      }
      if(this.datos[element].fechaalta != null){
        this.datos[element].fechaalta=this.transformaFecha(this.datos[element].fechaalta);
      }
      if(this.datos[element].fechabt != null){
        this.datos[element].fechabt=this.transformaFecha(this.datos[element].fechabt);
      }
      if(this.datos[element].fechaestado != null){
        this.datos[element].fechaestado=this.transformaFecha(this.datos[element].fechaestado);
      }
      this.datos[element].validado = "Denegada";
      let tmp = this.datos[element];
      delete tmp.tiponombre;
      array.push(tmp);
    }else{
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
      this.progressSpinner = false;
    }
  });
  this.updateBaja(array);
}

validar(event){
  let array = [];
  event.forEach(element => {
    if(this.datos[element].validado == "Pendiente"){
      if(this.datos[element].fechadesde != null){
        this.datos[element].fechadesde=this.transformaFecha(this.datos[element].fechadesde);
      }
      if(this.datos[element].fechahasta != null){
        this.datos[element].fechahasta=this.transformaFecha(this.datos[element].fechahasta);
      }
      if(this.datos[element].fechaalta != null){
        this.datos[element].fechaalta=this.transformaFecha(this.datos[element].fechaalta);
      }
      if(this.datos[element].fechabt != null){
        this.datos[element].fechabt=this.transformaFecha(this.datos[element].fechabt);
      }
      if(this.datos[element].fechaestado != null){
        this.datos[element].fechaestado=this.transformaFecha(this.datos[element].fechaestado);
      }
      this.datos[element].validado = "Validada";
      let tmp = this.datos[element];
      delete tmp.tiponombre;
      array.push(tmp);
    }else{
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
      this.progressSpinner = false;
    }
  });
  this.updateBaja(array);
}

anular(event){
  let array = [];
  event.forEach(element => {
    if(this.datos[element].validado == "Pendiente"){
      if(this.datos[element].fechadesde != null){
        this.datos[element].fechadesde=this.transformaFecha(this.datos[element].fechadesde);
      }
      if(this.datos[element].fechahasta != null){
        this.datos[element].fechahasta=this.transformaFecha(this.datos[element].fechahasta);
      }
      if(this.datos[element].fechaalta != null){
        this.datos[element].fechaalta=this.transformaFecha(this.datos[element].fechaalta);
      }
      if(this.datos[element].fechabt != null){
        this.datos[element].fechabt=this.transformaFecha(this.datos[element].fechabt);
      }
      if(this.datos[element].fechaestado != null){
        this.datos[element].fechaestado =this.transformaFecha(this.datos[element].fechaestado);
      }
      this.datos[element].validado = "Anulada";
      let tmp = this.datos[element];
      delete tmp.tiponombre;
      array.push(tmp);
    }else{
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
      this.progressSpinner = false;
    }
  });
  this.updateBaja(array);
}

guardar(event) {
// let listaPrueba: BajasTemporalesItem[]=[];
let listaPrueba = [];
let bajaTemporal = new BajasTemporalesItem();
event.forEach(element => {
  bajaTemporal.ncolegiado = element[0];
  bajaTemporal.nombre = element[1];
  bajaTemporal.tipo = element[2];
  bajaTemporal.descripcion = element[3];
  bajaTemporal.fechadesde = element[4];
  bajaTemporal.fechahasta = element[5];
  bajaTemporal.fechaalta = element[6];
  bajaTemporal.validado = element[7];
  bajaTemporal.fechabt = element[8];

  listaPrueba.push(bajaTemporal);
  bajaTemporal = new BajasTemporalesItem();
});

  listaPrueba.forEach(element => {
  if(element.fechadesde != null){
    element.fechadesde=this.transformaFecha(element.fechadesde);
  }
  if(element.fechahasta != null){
    element.fechahasta=this.transformaFecha(element.fechahasta);
  }
  if(element.fechaalta != null){
    element.fechaalta=this.transformaFecha(element.fechaalta);
  }
  // if(element.fechaestado != null){
  //   element.fechaestado=this.transformaFecha(element.fechaestado);
  // }
  // if(element.fechaestado != null){
  //   element.fechaestado=this.transformaFecha(element.fechaestado);
  // }
  if (element.validado == "Denegada") {
    element.validado  = "0";
  }
  if (element.validado  == "Validada") {
    element.validado  = "1";
  }
  if (element.validado  == "Anulada") {
    element.validado  = "3";
  }
  if (element.validado  == "Pendiente") {
    element.validado  = "2";
  }
});
    this.sigaServices.post("bajasTemporales_saveBajaTemporal", listaPrueba).subscribe(
      data => {
          this.showMessage({ severity: "success", summary: this.translateService.instant("general.message.correct"), msg: this.translateService.instant("general.message.accion.realizada")});
          this.progressSpinner = false;
          this.searchPartidas(this.filtros.filtroAux);
    },
    err => {
        this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
        this.progressSpinner = false;
      }
    );
}

  updateBaja(event) {
    this.progressSpinner = true;

    event.forEach(element => {
      if (element.validado == "Denegada") {
        element.validado = "0";
      }
      if (element.validado == "Validada") {
        element.validado = "1";
      }
      if (element.validado == "Anulada") {
        element.validado = "3";
      }
    });
    
      this.sigaServices.post("bajasTemporales_updateBajaTemporal", event).subscribe(
        data => {
            this.showMessage({ severity: "success", summary: this.translateService.instant("general.message.correct"), msg: this.translateService.instant("general.message.accion.realizada")});
            this.progressSpinner = false;
      },
      err => {
          this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
          this.progressSpinner = false;
        }
      );
      this.searchPartidas(this.filtros.filtroAux.historico);
  }

}
