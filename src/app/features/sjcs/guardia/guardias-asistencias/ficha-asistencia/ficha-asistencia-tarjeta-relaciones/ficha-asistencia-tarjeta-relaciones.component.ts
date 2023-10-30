import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { DataTable } from 'primeng/primeng';
import { TranslateService } from '../../../../../../commons/translate';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { EJGItem } from '../../../../../../models/sjcs/EJGItem';
import { RelacionesItem } from '../../../../../../models/sjcs/RelacionesItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-relaciones',
  templateUrl: './ficha-asistencia-tarjeta-relaciones.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-relaciones.component.scss']
})
export class FichaAsistenciaTarjetaRelacionesComponent implements OnInit {

  msgs: Message[] = [];
  @Input() modoLectura: boolean;
  @Input() asistencia: TarjetaAsistenciaItem;
  @Input() editable: boolean;
  @Output() refreshTarjetas = new EventEmitter<string>();
  rows: number = 10;
  rowsPerPage = [
    {
      label: 10,
      value: 10
    },
    {
      label: 20,
      value: 20
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 40,
      value: 40
    }
  ];
  columnas = [];
  seleccionMultiple: boolean = false;
  seleccionarTodo: boolean = false;
  progressSpinner: boolean = false;
  numSeleccionado: number = 0;
  selectedDatos: RelacionesItem[] = [];
  relaciones: RelacionesItem[] = [];
  disableDelete: boolean = true;
  disableDesigna: boolean = false;
  disableEJG: boolean = false;
  @ViewChild("table") table: DataTable;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {
    //console.log('modoLectura RELACIONES: ', this.modoLectura)
    this.getRelaciones();

  }

  getRelaciones() {

    if (this.asistencia) {

      //this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchRelaciones", "?anioNumero=" + this.asistencia.anioNumero).subscribe(
        n => {
          this.relaciones = n.relacionesItem;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
          this.checkRelaciones();
        }
      );

    }

  }
  checkRelaciones() {

    if (this.relaciones) {
      if (this.relaciones.find(relacion => relacion.sjcs.charAt(0) == 'E')) { //Si hay algun EJG asociado no permitimos que se asocien mas
        this.disableEJG = true;
      } else {
        this.disableEJG = false;
      }
      if (this.relaciones.find(relacion => relacion.sjcs.charAt(0) == 'D')) { //Si hay alguna Designa asociada no permitimos que se asocien mas
        this.disableDesigna = true;
      } else {
        this.disableDesigna = false;
      }
    } else {
      this.disableEJG = false;
      this.disableDesigna = false;
    }

  }

  onClickEnlace(relacion: RelacionesItem) {

    let tipoAsunto = relacion.sjcs.charAt(0);

    if ('D' == tipoAsunto) { //Si empieza por D es una Designacion, redirigimos a la ficha

      let desItem: any = new DesignaItem();
      let ape = relacion.letrado.split(',')[0].split(' - ')[1];
      desItem.ano = relacion.anio;
      desItem.numero = relacion.numero;
      desItem.idInstitucion = relacion.idinstitucion;
      desItem.idTurno = relacion.idturnodesigna;
      desItem.codigo = relacion.codigo;
      desItem.descripcionTipoDesigna = relacion.destipo
      desItem.fechaEntradaInicio = this.datePipe.transform(relacion.fechaasunto, 'dd/MM/yyyy');
      desItem.nombreTurno = relacion.descturno;
      desItem.nombreProcedimiento = relacion.dilnigproc.split(' / ')[2];
      desItem.nombreColegiado = relacion.letrado;
      desItem.apellido1Colegiado = ape.split(' ')[0];
      desItem.apellido2Colegiado = ape.split(' ')[1];
      //Se cambia el valor del campo ano para que se procese de forma adecuada 
      //En la ficha en las distintas tarjetas para obtener sus valores
      desItem.ano = 'D' + desItem.ano + '/' + desItem.codigo;

      let request = [desItem.ano, desItem.idTurno, desItem.numero];
        this.sigaServices.post("designaciones_busquedaDesignacionActual", request).subscribe(
          data => {
            let datos = JSON.parse(data.body);
            //Se cambia el valor del campo ano para que se procese de forma adecuada 
            //En la ficha en las distintas tarjetas para obtener sus valores
            //
            datos.descripcionTipoDesigna = desItem.descripcionTipoDesigna;
            datos.fechaEntradaInicio = desItem.fechaEntradaInicio;
            datos.nombreColegiado = desItem.nombreColegiado;
            datos.nombreProcedimiento = desItem.nombreProcedimiento;
            datos.nombreTurno = desItem.nombreTurno;
            datos.idInstitucion = desItem.idInstitucion;
            datos.idTurno = desItem.idTurno;
            desItem = datos;
            desItem.anio = desItem.ano;
            desItem.idProcedimiento = desItem.idProcedimiento;
            desItem.numProcedimiento = desItem.numProcedimiento;
            desItem.ano = 'D' + desItem.anio + '/' + desItem.codigo;

            sessionStorage.setItem('backAsistencia',JSON.stringify(true));
            sessionStorage.setItem('designaItemLink', JSON.stringify(desItem));
            sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
            sessionStorage.setItem("nuevaDesigna", "false");
            this.router.navigate(['/fichaDesignaciones']);
          });

    } else if ('E' == tipoAsunto) { //Si empieza por E es un EJG, redirigimos a la ficha
      this.progressSpinner = true;
      let ejgItem = new EJGItem();
      ejgItem.annio = relacion.anio;
      ejgItem.numero = relacion.codigo;
      ejgItem.idInstitucion = relacion.idinstitucion;
      ejgItem.tipoEJG = relacion.idtipo;

      let result;
      // al no poder obtener todos los datos del EJG necesarios para obtener su informacion
      //se hace una llamada a al base de datos pasando las claves primarias y obteniendo los datos necesarios
      this.sigaServices.post("filtrosejg_busquedaEJG", ejgItem).subscribe(
        n => {
          result = JSON.parse(n.body).ejgItems;
          sessionStorage.setItem("EJGItemDesigna", JSON.stringify(result[0]));
          let error = JSON.parse(n.body).error;

          this.progressSpinner = false;
          if (error != null && error.description != null) {
            this.showMsg("info", this.translateService.instant("general.message.informacion"), error.description);
          }
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        },
        () => {
          this.router.navigate(["/gestionEjg"]);
        }
      );

    }

  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        let datosFamiliares: any[] = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(datosFamiliares);

        if (sessionStorage.getItem("EJGItem")) {
          sessionStorage.removeItem("EJGItem");
        }

        sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
        this.router.navigate(['/gestionEjg']);
        this.commonsService.scrollTop();
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  asociarDesignacion() {
    sessionStorage.setItem("radioTajertaValue", 'des');
    sessionStorage.setItem("Asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    this.router.navigate(["/busquedaAsuntos"]);
  }

  asociarEJG() {
    sessionStorage.setItem("radioTajertaValue", 'ejg');
    sessionStorage.setItem("Asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    this.router.navigate(["/busquedaAsuntos"]);
  }

  crearEJG() {
    sessionStorage.setItem("asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    sessionStorage.setItem("Nuevo", "true");
    this.router.navigate(["/gestionEjg"]);
  }

  crearDesignacion() {
    sessionStorage.setItem("asistencia", JSON.stringify(this.asistencia));
    sessionStorage.setItem("nuevaDesigna", "true");
    sessionStorage.setItem("idAsistencia", this.asistencia.anioNumero);
    this.router.navigate(["/fichaDesignaciones"]);
  }

  eliminarRelacion() {
    this.confirmationService.confirm({
      key: "confirmEliminar",
      message: this.translateService.instant("messages.deleteConfirmation"),
      icon: "fa fa-question-circle",
      accept: () => { this.executeEliminarRelacion(); },
      reject: () => { this.showMsg('info', "Cancel", this.translateService.instant("general.message.accion.cancelada")); }
    });
  }

  executeEliminarRelacion() {
    this.progressSpinner = true;
    let relaciones: RelacionesItem[] = [];
    if (Array.isArray(this.selectedDatos)) {
      relaciones = this.selectedDatos;
    } else {
      relaciones.push(this.selectedDatos);
    }

    this.sigaServices
      .postPaginado("busquedaGuardias_eliminarRelacion", "?anioNumero=" + this.asistencia.anioNumero, relaciones)
      .subscribe(
        n => {
          let result = JSON.parse(n["body"]);
          if (result.error) {
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.getRelaciones();
            this.refreshTarjetas.emit(result.id);
            sessionStorage.removeItem("datosEJG");
          }

        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  onChangeRowsPerPages(event) {
    this.rows = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSeleccionMultiple() {
    if (this.table.selectionMode == 'single') {
      this.table.selectionMode = 'multiple';
      this.seleccionMultiple = true;
    } else {
      this.table.selectionMode = 'single';
      this.seleccionMultiple = false;
    }
    this.selectedDatos = [];
    this.numSeleccionado = 0;
    this.disableDelete = true;
  }

  onChangeSeleccionarTodo() {
    if (this.seleccionarTodo) {
      this.selectedDatos = this.relaciones;
      this.numSeleccionado = this.selectedDatos.length;
      this.disableDelete = true;
    } else {
      this.selectedDatos = [];
      this.numSeleccionado = 0;
      this.disableDelete = true;
    }
  }

  onSelectRow(relacion: RelacionesItem) {

    if (this.table.selectionMode == 'single') {
      this.numSeleccionado = 1;
    } else {
      this.numSeleccionado = this.selectedDatos.length;
    }
    this.disableDelete = false;
  }

  actualizaSeleccionados() {
    if (this.table.selectionMode == 'single') {
      this.numSeleccionado = 0;
      this.disableDelete = true;
    } else {
      this.numSeleccionado = this.selectedDatos.length;
      if (this.numSeleccionado <= 0) {
        this.disableDelete = true;
      }
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

}
