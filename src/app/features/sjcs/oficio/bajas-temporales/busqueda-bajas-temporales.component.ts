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
  @ViewChild(GestionBajasTemporalesComponent) tablapartida;
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
        if (this.tablapartida != undefined) {
          this.tablapartida.tabla.sortOrder = 0;
          this.tablapartida.tabla.sortField = '';
          this.tablapartida.tabla.reset();
          this.tablapartida.buscadores = this.tablapartida.buscadores.map(it => it = "");
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        setTimeout(() => {
          this.commonsService.scrollTablaFoco('tablaFoco');
        }, 5);
      }
    );
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

  historico(event){
    this.searchPartidas(this.filtros.filtroAux);
  }

jsonToRow(datos){
  console.log(datos);
  let arr = [];
  datos.forEach(element => {

    let italic = (element.eliminado == 1);
    let obj = [
      { type: 'text', value: element.ncolegiado, italic: italic },
      { type: 'text', value: element.apellidos1 +" "+ element.apellidos2 + ", " + element.nombre, italic: italic },
      { type: 'select', combo: this.comboTipo ,value: element.tipo, italic: italic },
      { type: 'input', value: element.descripcion, italic: italic },
      { type: 'datePicker', value: element.fechadesde, italic: italic },
      { type: 'datePicker', value: element.fechahasta, italic: italic },
      { type: 'text', value: element.fechaalta, italic: italic },
      { type: 'text', value: element.validado, italic: italic },
      { type: 'text', value: element.fechabt, italic: italic }
    ];
    arr.push(obj);

  });

  this.rowGroups = this.gbtservice.getTableData(arr);
  this.rowGroupsAux = this.gbtservice.getTableData(arr);
  this.totalRegistros = this.rowGroups.length;
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

  delete(event){
    let array = [];
    event.forEach(element => {
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
  }

denegar(event){
  let array = [];
  event.forEach(element => {
    if(this.datos[element].validado == "Pendiente"){
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
  let x = 0;
  event.forEach(element => {
    if(this.datos[element].validado == "Pendiente"){
      this.datos[element].validado = "Validada";
      array[x] = this.datos[element];
        x=++x;
    }else{
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
      this.progressSpinner = false;
    }
  });
  this.updateBaja(array);
}

anular(event){
  let x = 0;
  let array = [];
  event.forEach(element => {
    if(this.datos[element].validado == "Pendiente"){
      this.datos[element].validado = "Anulada";
      array[x] = this.datos[element];
        x=++x;
    }else{
      this.showMessage({ severity: "error", summary: this.translateService.instant("general.message.incorrect"), msg: this.translateService.instant("general.message.error.realiza.accion")});
      this.progressSpinner = false;
    }
  });
  this.updateBaja(array);
}

  updateBaja(event) {
    this.progressSpinner = true;
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
  }

}
