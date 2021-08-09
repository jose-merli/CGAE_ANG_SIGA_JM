import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
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
import { DatePipe, Location } from '@angular/common';
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
  @ViewChild(GestionBajasTemporalesComponent) tablapartida: GestionBajasTemporalesComponent;
  //comboPartidosJudiciales
  msgs;
  permisoEscritura: any;

  comboTipo = [
    { label: "Vacaciones", value: "V" },
    { label: "Maternidad", value: "M" },
    { label: "Baja", value: "B" },
    { label: "Suspensión por sanción", value: "S" }
  ];

  seleccionarTodo = false;
  totalRegistros = 0;
  rowGroups: Row[];
  rowGroupsAux: Row[];
  selectedRow: Row;
  cabeceras = [
    { id: "ncolegiado", name: "facturacionSJCS.facturacionesYPagos.numColegiado" },
    { id: "nombre", name: "busquedaSanciones.detalleSancion.letrado.literal" },
    { id: "tiponombre", name: "justiciaGratuita.oficio.bajasTemporales.tipoBaja" },
    { id: "descripcion", name: "administracion.auditoriaUsuarios.literal.motivo" },
    { id: "fechadesdeSinHora", name: "facturacion.seriesFacturacion.literal.fInicio" },
    { id: "fechahastaSinHora", name: "censo.consultaDatos.literal.fechaFin" },
    { id: "fechaaltaSinHora", name: "formacion.busquedaInscripcion.fechaSolicitud" },
    { id: "validado", name: "censo.busquedaSolicitudesModificacion.literal.estado" },
    { id: "fechaestadoSinHora", name: "facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado" },
  ];

  @Output() nuevo = new EventEmitter<any>();

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private router: Router,
    private gbtservice: GestionBajasTemporalesService,
    private datePipe: DatePipe,
    private location: Location) { }


  ngOnInit() {
    this.commonsService.checkAcceso(procesos_oficio.bajastemporales)
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

  search(event) {
    this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    this.filtros.filtroAux.historico = event;
    this.persistenceService.setHistorico(event);
    this.progressSpinner = true;
    this.buscar = false;

    this.sigaServices.post("bajasTemporales_busquedaBajasTemporales", this.filtros.filtroAux).subscribe(
      n => {
        let error = JSON.parse(n.body).error;
        this.datos = JSON.parse(n.body).bajasTemporalesItem;
        this.datos.forEach(element => {
          element.fechadesdeSinHora = element.fechadesde;
          element.fechahastaSinHora = this.formatDateSinHora(element.fechahasta);
          element.fechaaltaSinHora = this.formatDateSinHora(element.fechaalta);
          element.fechadesde = this.formatDate(element.fechadesde);
          element.fechahasta = this.formatDate(element.fechahasta);
          element.fechaalta = this.formatDate(element.fechaalta);
          element.fechabt = this.formatDate(element.fechabt);

          element.fechaestadoSinHora = this.formatDateSinHora(element.fechaestado);
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

        if (error != null && error.description != null) {
          this.msgs = [];
          this.msgs.push({
            severity: "info",
            summary: this.translateService.instant("general.message.informacion"),
            detail: error.description
          });
        }
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }, () => {
        setTimeout(() => {
          this.tablapartida.tablaFoco.nativeElement.scrollIntoView();
        }, 5);

        this.progressSpinner = false;
      }
    );
  }

  searchHistorico(event) {
    this.search(event);
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy HH:mm:ss';
    return this.datePipe.transform(date, pattern);
  }

  formatDateSinHora(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

  jsonToRow(datos) {
    let arr = [];
    let nombreApell;

    datos.forEach((element, index) => {
      let italic = (element.eliminado == 1);
      if (element.apellidos1 != null) {
        nombreApell = element.apellidos1;
      }

      if (element.apellidos2 != null) {
        nombreApell += " " + element.apellidos2;
      }

      if (element.nombre != null) {
        nombreApell += ", " + element.nombre;
      }
      if (element.eliminado == 1) {
        let descripcionTipoBaja = this.getDescripcionTipoBaja(element.tipo);
        let obj = [
          { type: 'text', value: element.ncolegiado },
          { type: 'text', value: nombreApell },
          { type: 'text', value: descripcionTipoBaja },
          { type: 'text', value: element.descripcion },
          { type: 'text', value: this.formatDateSinHora(element.fechadesdeSinHora) },
          { type: 'text', value: element.fechahastaSinHora },
          { type: 'text', value: element.fechaaltaSinHora },
          { type: 'text', value: element.validado },
          { type: 'text', value: element.fechaestadoSinHora },
          { type: 'text', value: element.idpersona },
          { type: 'text', value: element.fechabt },
          { type: 'text', value: element.nuevo }
        ];
        let superObj = {
          id: index,
          italic: italic,
          row: obj
        };

        arr.push(superObj);
      } else {
        let obj = [
          { type: 'text', value: element.ncolegiado },
          { type: 'text', value: nombreApell },
          { type: 'select', combo: this.comboTipo, value: element.tipo },
          { type: 'input', value: element.descripcion },
          { type: 'text', value: this.formatDateSinHora(element.fechadesdeSinHora) },
          { type: 'datePickerFin', value: [element.fechahastaSinHora, new Date(element.fechadesdeSinHora)] },
          { type: 'text', value: element.fechaaltaSinHora },
          { type: 'text', value: element.validado },
          { type: 'text', value: element.fechaestadoSinHora },
          { type: 'text', value: element.idpersona },
          { type: 'text', value: element.fechabt },
          { type: 'text', value: element.nuevo }
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

  modDatos(event) {
    let array = [];
    let array2 = [];

    event.forEach(element => {
      element.cells.forEach(dato => {
        array.push(dato.value);
      });
      array2.push(array);
      array = [];
    });
    this.guardar(array2);
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

  estadoPendiente(event) {
    let encontrado: boolean = false;
    event.forEach(element => {
      if (this.datos[element] == undefined || this.datos[element].validado == "Pendiente") {
        encontrado = true;
      }
    });
    if (encontrado) {
      this.tablapartida.isDisabled = false;
    }
    else {
      this.tablapartida.isDisabled = true;
    }

  }

  delete(event) {
    let array = [];
    event.forEach(element => {
      /* if(this.datos[element].fechadesde != null){
         this.datos[element].fechadesde= this.datos[element].fechadesde //this.transformaFecha(this.datos[element].fechadesde);
       }
       if(this.datos[element].fechahasta != null){
         this.datos[element].fechahasta= this.datos[element].fechahasta //this.transformaFecha(this.datos[element].fechahasta);
       }
       if(this.datos[element].fechaalta != null){
         this.datos[element].fechaalta= this.datos[element].fechaalta //this.transformaFecha(this.datos[element].fechaalta);
       }
       if(this.datos[element].fechabt != null){
         this.datos[element].fechabt= this.datos[element].fechabt //this.transformaFecha(this.datos[element].fechabt);
       }
       if(this.datos[element].fechaestado != null){
         this.datos[element].fechaestado= this.datos[element].fechaestado //this.transformaFecha(this.datos[element].fechaestado);
       }*/
      array.push(this.datos[element]);
    });

    this.progressSpinner = true;
    this.sigaServices.post("bajasTemporales_deleteBajaTemporal", array).subscribe(
      data => {
        array = [];
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.search(this.filtros.filtroAux.historico);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));

        this.progressSpinner = false;
      }
    );
  }

  denegar(event) {
    let array = [];
    event.forEach(element => {
      if (this.datos[element].validado == "Pendiente") {
        /*if(this.datos[element].fechadesde != null){
          this.datos[element].fechadesde= this.datos[element].fechadesde //this.transformaFecha(this.datos[element].fechadesde);
        }
        if(this.datos[element].fechahasta != null){
          this.datos[element].fechahasta= this.datos[element].fechahasta //this.transformaFecha(this.datos[element].fechahasta);
        }
        if(this.datos[element].fechaalta != null){
          this.datos[element].fechaalta= this.datos[element].fechaalta //this.transformaFecha(this.datos[element].fechaalta);
        }
        if(this.datos[element].fechabt != null){
          this.datos[element].fechabt= this.datos[element].fechabt //this.transformaFecha(this.datos[element].fechabt);
        }
        if(this.datos[element].fechaestado != null){
          this.datos[element].fechaestado= this.datos[element].fechaestado //this.transformaFecha(this.datos[element].fechaestado);
        }*/
        this.datos[element].validado = "Denegada";
        let tmp = this.datos[element];
        delete tmp.tiponombre;
        array.push(tmp);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    });
    this.updateBaja(array);
  }

  validar(event) {
    let array = [];
    event.forEach(element => {
      if (this.datos[element].validado == "Pendiente") {
        /*if(this.datos[element].fechadesde != null){
          this.datos[element].fechadesde= this.datos[element].fechadesde //this.transformaFecha(this.datos[element].fechadesde);
        }
        if(this.datos[element].fechahasta != null){
          this.datos[element].fechahasta= this.datos[element].fechahasta //this.transformaFecha(this.datos[element].fechahasta);
        }
        if(this.datos[element].fechaalta != null){
          this.datos[element].fechaalta= this.datos[element].fechaalta //this.transformaFecha(this.datos[element].fechaalta);
        }
        if(this.datos[element].fechabt != null){
          this.datos[element].fechabt= this.datos[element].fechabt //this.transformaFecha(this.datos[element].fechabt);
        }
        if(this.datos[element].fechaestado != null){
          this.datos[element].fechaestado= this.datos[element].fechaestado //this.transformaFecha(this.datos[element].fechaestado);
        }*/
        this.datos[element].validado = "Validada";
        let tmp = this.datos[element];
        delete tmp.tiponombre;
        array.push(tmp);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    });
    this.updateBaja(array);
  }

  anular(event) {
    let array = [];
    event.forEach(element => {
      if (this.datos[element].validado == "Pendiente") {
        /*if(this.datos[element].fechadesde != null){
          this.datos[element].fechadesde= this.datos[element].fechadesde //this.transformaFecha(this.datos[element].fechadesde);
        }
        if(this.datos[element].fechahasta != null){
          this.datos[element].fechahasta= this.datos[element].fechahasta //this.transformaFecha(this.datos[element].fechahasta);
        }
        if(this.datos[element].fechaalta != null){
          this.datos[element].fechaalta= this.datos[element].fechaalta //this.transformaFecha(this.datos[element].fechaalta);
        }
        if(this.datos[element].fechabt != null){
          this.datos[element].fechabt= this.datos[element].fechabt //this.transformaFecha(this.datos[element].fechabt);
        }
        if(this.datos[element].fechaestado != null){
          this.datos[element].fechaestado = this.datos[element].fechaestado //this.transformaFecha(this.datos[element].fechaestado);
        }*/
        this.datos[element].validado = "Anulada";
        let tmp = this.datos[element];
        delete tmp.tiponombre;
        array.push(tmp);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    });
    this.updateBaja(array);
  }

  backTo() {
    this.location.back();
  }

  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length == 10) {
        fecha = rawDate += " 00:00:00";
      } else {
        fecha = rawDate;
      }
      return fecha;
    }
  }

  guardar(event) {
    this.progressSpinner = true;
    let listaPrueba = [];
    let nuevaBaja = [];
    let bajaTemporal = new BajasTemporalesItem();

    event.forEach(element => {
      if (element.length != 10) {
        bajaTemporal.ncolegiado = element[0];
        bajaTemporal.nombre = element[1];
        bajaTemporal.tipo = element[2];
        bajaTemporal.descripcion = element[3];
        bajaTemporal.fechadesde = this.transformaFecha(element[4]);
        if (Array.isArray(element[5])) {
          bajaTemporal.fechahasta = this.transformaFecha(element[5][0]);
        } else {
          bajaTemporal.fechahasta = this.transformaFecha(element[5]);
        }
        bajaTemporal.fechaalta = this.transformaFecha(element[6]);
        bajaTemporal.validado = element[7];
        bajaTemporal.idpersona = element[9];
        bajaTemporal.fechabt = this.transformaFecha(element[10]);

        listaPrueba.push(bajaTemporal);
        bajaTemporal = new BajasTemporalesItem();
      } else {
        bajaTemporal.ncolegiado = element[0];
        bajaTemporal.nombre = element[1];
        bajaTemporal.tipo = element[2];
        bajaTemporal.descripcion = element[3];
        bajaTemporal.fechadesde = this.transformaFecha(element[4]);
        if (Array.isArray(element[5])) {
          bajaTemporal.fechahasta = this.transformaFecha(element[5][0]);
        } else {
          bajaTemporal.fechahasta = this.transformaFecha(element[5]);
        }
        bajaTemporal.fechaalta = this.transformaFecha(element[6]);
        bajaTemporal.validado = element[7];

        nuevaBaja.push(bajaTemporal);
        bajaTemporal = new BajasTemporalesItem();
      }

    });

    if (nuevaBaja.length != 0) {
      nuevaBaja.forEach(element => {
        /*if(element.fechadesde != null || element.fechadesde != ""){
          element.fechadesde= element.fechadesde //this.transformaFecha(element.fechadesde);
        }
        if(element.fechahasta != null || element.fechahasta != ""){
          element.fechahasta= element.fechahasta //this.transformaFecha(element.fechahasta);
        }
        if(element.fechaalta != null || element.fechaalta != ""){
          element.fechaalta= element.fechaalta //this.transformaFecha(element.fechaalta);
        }*/
        if (element.validado == "Denegada") {
          element.validado = "0";
        }
        if (element.validado == "Validada") {
          element.validado = "1";
        }
        if (element.validado == "Anulada") {
          element.validado = "3";
        }
        if (element.validado == "Pendiente") {
          element.validado = "2";
        }

      });

      this.sigaServices.post("bajasTemporales_nuevaBajaTemporal", nuevaBaja).subscribe(
        data => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
          this.search(this.filtros.filtroAux.historico);
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        }
      );

    }

    if (listaPrueba.length != 0) {
      listaPrueba.forEach(element => {
        /*if(element.fechadesde != null){
          element.fechadesde=element.fechadesde //this.transformaFecha(element.fechadesde);
        }
        if(element.fechahasta != null){
          element.fechahasta=element.fechahasta //this.transformaFecha(element.fechahasta);
        }
        if(element.fechaalta != null){
          element.fechaalta=element.fechaalta //this.transformaFecha(element.fechaalta);
        }*/
        if (element.validado == "Denegada") {
          element.validado = "0";
        }
        if (element.validado == "Validada") {
          element.validado = "1";
        }
        if (element.validado == "Anulada") {
          element.validado = "3";
        }
        if (element.validado == "Pendiente") {
          element.validado = "2";
        }
      });

      this.sigaServices.post("bajasTemporales_saveBajaTemporal", listaPrueba).subscribe(
        data => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.progressSpinner = false;
          this.search(this.filtros.filtroAux.historico);
        },
        err => {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          this.progressSpinner = false;
        }
      );
    }
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
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.search(this.filtros.filtroAux.historico);
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false;
      }
    );
  }

  getDescripcionTipoBaja(tipo) {

    let descripcion;
    this.comboTipo.forEach((comboItem) => {
      if (comboItem.value == tipo) {
        descripcion = comboItem.label;
      }
    });
    return descripcion;
  }
}