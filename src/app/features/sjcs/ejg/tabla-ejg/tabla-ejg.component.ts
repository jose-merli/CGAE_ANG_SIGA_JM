import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { CommonsService } from '../../../../_services/commons.service';
import { DatePipe } from '../../../../../../node_modules/@angular/common';
import { Dialog } from 'primeng/primeng';
import { saveAs } from "file-saver/FileSaver";
//import moment = require('moment');

@Component({
  selector: 'app-tabla-ejg',
  templateUrl: './tabla-ejg.component.html',
  styleUrls: ['./tabla-ejg.component.scss']
})

export class TablaEjgComponent implements OnInit {
  rowsPerPage: any = [];


  cols;
  msgs;

  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  selectDatos: EJGItem = new EJGItem();
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  historico: boolean = false;
  permisoEscritura: boolean = false;
  buscadores = [];
  message;
  initDatos;
  datosItem: EJGItem;
  nuevo: boolean = false;
  progressSpinner: boolean = false;
  disableAddRemesa: boolean = true;
  disableBotonAnadir: boolean = true;

  ejgObject = [];
  datosFamiliares = [];

  comboRemesa = [];
  fechaEstado = new Date();
  valueComboEstado = "";
  valueComboRemesa;

  //Resultados de la busqueda
  @Input() datos;

  @Input() filtro;
  @Input() remesa;
  @Input() comboEstadoEJG;

  @ViewChild("table") table: DataTable;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();
  @ViewChild("cd") cdCambioEstado: Dialog;
  @ViewChild("cd1") cdAnadirRemesa: Dialog;


  showModalCambioEstado = false;
  showModalAnadirRemesa = false;

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService, private commonServices: CommonsService) {

  }

  ngOnInit() {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }

    this.selectedDatos = [];


    this.showModalCambioEstado = false;
    this.fechaEstado = new Date();
    this.valueComboEstado = "";

    this.getCols();
    this.initDatos = JSON.parse(JSON.stringify((this.datos)));

    if (this.persistenceService.getHistorico() != undefined) {
      this.historico = this.persistenceService.getHistorico();
    }

    this.getComboRemesa();
  }

  //Se activara cada vez que los @Input cambien de valor (ahora unicamente datos)
  ngOnChanges() {
    this.selectedDatos = [];
  }

  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;

      this.datosEJG(evento.data);

    }
  }

  datosEJG(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_datosEJG", selected).subscribe(
      n => {
        this.ejgObject = JSON.parse(n.body).ejgItems;
        this.datosItem = this.ejgObject[0];
        this.persistenceService.setDatos(this.datosItem);
        this.persistenceService.setFiltros(this.filtro);
        this.ngOnInit();
        this.consultaUnidadFamiliar(selected);
        this.commonServices.scrollTop();
      },
      err => {
        this.commonServices.scrollTop();
      }
    );
  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        this.datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(this.datosFamiliares);

        if (sessionStorage.getItem("EJGItem")) {
          sessionStorage.removeItem("EJGItem");
        }

        this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
        this.commonServices.scrollTop();
      },
      err => {
        //console.log(err);
      }
    );
  }

  setItalic(dato) {
    if (dato.fechabaja == null) {
      return false;
    } else {
      return true;
    }
  }

  getCols() {
    this.cols = [
      { field: "turnoDes", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "20%" },
      { field: "turno", header: "dato.jgr.guardia.guardias.turno", width: "10%" },
      { field: "numAnnioProcedimiento", header: "justiciaGratuita.ejg.datosGenerales.annioNum", width: "5%" },
      { field: "apellidosYNombre", header: "busquedaSanciones.detalleSancion.letrado.literal", width: "20%" },
      { field: "fechaApertura", header: "gratuita.busquedaEJG.literal.fechaApertura", width: "10%" },
      { field: "estadoEJG", header: "justiciaGratuita.ejg.datosGenerales.EstadoEJG", width: "15%" },
      { field: "nombreApeSolicitante", header: "administracion.parametrosGenerales.literal.nombre.apellidos", width: "20%" },
    ];

    this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
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
  }

  cancelaCambiarEstados() {
    this.showModalCambioEstado = false;
  }

  cancelaAnadirRemesa() {
    this.showModalAnadirRemesa = false;
  }

  checkCambiarEstados() {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.cambiarEstado");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.cambiarEstados();
        this.cdCambioEstado.hide();
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];

        this.cancelaCambiarEstados();
        this.cdCambioEstado.hide();
      }
    });
  }

  cambiarEstados() {
    this.progressSpinner = true;
    let data = [];
    let ejg: EJGItem;

    for (let i = 0; this.selectedDatos.length > i; i++) {
      ejg = this.selectedDatos[i];
      ejg.fechaEstadoNew = this.fechaEstado;
      ejg.estadoNew = this.valueComboEstado;

      data.push(ejg);
    }

    this.sigaServices.post("gestionejg_cambioEstadoMasivo", data).subscribe(
      n => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      },
      err => {
        //console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      },
      () => {
        this.progressSpinner = false;
        this.busqueda.emit(false);
        this.showModalCambioEstado = false;
        this.selectedDatos = [];
      }
    );
  }

  isSelectMultiple() {
    this.selectAll = false;

    if (this.permisoEscritura) {
      this.selectMultiple = !this.selectMultiple;

      if (!this.selectMultiple) {
        this.selectedDatos = [];
        this.numSelected = 0;
      } else {
        this.selectAll = false;
        this.selectedDatos = [];
        this.numSelected = 0;
      }
    }
  }

  searchHistorical() {
    this.historico = !this.historico;
    this.persistenceService.setHistorico(this.historico);
    this.searchHistoricalSend.emit(this.historico);
    this.selectAll = false;

    if (this.selectMultiple) {
      this.selectMultiple = false;
    }
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.permisoEscritura) {
      if (!this.historico) {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos;
          this.numSelected = this.datos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      } else {
        if (this.selectAll) {
          this.selectMultiple = true;
          this.selectedDatos = this.datos.filter((dato) => dato.fechaBaja != undefined && dato.fechaBaja != null);
          this.numSelected = this.selectedDatos.length;
        } else {
          this.selectedDatos = [];
          this.numSelected = 0;
          this.selectMultiple = false;
        }
      }
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

  checkPermisos() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
      return false;
    } else {
      return true;
    }
  }

  clear() {
    this.msgs = [];
  }

  comunicar() {

  }

  changeEstado() {
    if (this.selectedDatos != null && this.selectedDatos != undefined && this.selectedDatos.length > 0 && this.checkPermisos()) {
      this.showModalCambioEstado = true;
    } else {
      this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("censo.datosBancarios.mensaje.seleccionar.almenosUno"));
    }
  }

  cerrarDialog() {
    this.showModalCambioEstado = false;
  }

  downloadEEJ() {
    let msg = this.commonServices.checkPermisos(this.permisoEscritura, undefined);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.progressSpinner = true;

      let datos = this.selectedDatos;

      datos.forEach(element => {
        element.nif = undefined;
      });

      this.sigaServices.postDownloadFiles("gestionejg_descargarExpedientesJG", this.selectedDatos).subscribe(
        data => {
          if (data.size == 0) {
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          } else {
            this.progressSpinner = false;

            let blob = null;

            let now = new Date();
            let month = now.getMonth() + 1;
            let nombreFichero = "eejg_" + now.getFullYear();

            if (month < 10) {
              nombreFichero = nombreFichero + "0" + month;
            } else {
              nombreFichero += month;
            }

            nombreFichero += now.getDate() + "_" + now.getHours() + "" + now.getMinutes();

            let mime = data.type;
            blob = new Blob([data], { type: mime });
            saveAs(blob, nombreFichero);
          }
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }
      );
    }
  }

  addRemesa() {
    this.showModalAnadirRemesa = true;

    //Queda pendiente añadir el codigo que gestionaria el desplegable si se accede desde una ficha de remesa.
    //El desplegable tendria que tener el valor de la remesa de la que procede y además deshabilitar el desplegable para que no pueda cambiar de valor.
    if (this.remesa != null) {
      this.valueComboRemesa = this.remesa.descripcion;
    }

  }

  checkBotonAnadir() {
    if (this.valueComboRemesa == null) {
      this.disableBotonAnadir = true;
    }
    else this.disableBotonAnadir = false;
  }

  checkAnadirRemesa() {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.anadirExpedienteARemesa");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.anadirRemesa();
        this.cdAnadirRemesa.hide();
        this.cdCambioEstado.hide();
        this.cancelaAnadirRemesa();
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        this.cancelaAnadirRemesa();
        this.cdAnadirRemesa.hide();
        this.cdCambioEstado.hide();
      }
    });
  }

  getComboRemesa() {
    this.sigaServices.get("filtrosejg_comboRemesa").subscribe(
      n => {
        this.comboRemesa = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboRemesa);
      },
      err => {
        //console.log(err);
      }
    );
  }

  anadirRemesa() {
    this.progressSpinner = true;

    //El valor del desplegable del modal se encuentra en la variable valueComboRemesa.
    this.selectedDatos.forEach(it => {
      it.numRegRemesa = this.valueComboRemesa;
    });


    this.sigaServices.post("filtrosejg_anadirExpedienteARemesa", this.selectedDatos).subscribe(
      n => {
        this.progressSpinner = false;
        if (JSON.parse(n.body).status == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          this.busqueda.emit(true);
        } else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.ejg.busqueda.EjgEnRemesa"));
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
    this.seleccion = false;
    this.checkAddRemesa(selectedDatos);
  }

  checkAddRemesa(selectedDatos) {
    /* if (selectedDatos != undefined) {
      //Buscar forma generica parecida a this.translateService.instant() para buscar sus equivalentes en otros idiomas.
      let findDato = this.selectedDatos.find(item => item.estadoEJG != this.comboEstadoEJG[11].label && item.estadoEJG != this.comboEstadoEJG[12].label);
      if(findDato != null){
        this.disableAddRemesa = true;
      }
      else{
        this.disableAddRemesa = false;
      }
    } */
    //Actualmente depende de los valores seleccionados en el filtro. 
    //Esto se debe cambiar al valor de los datos seleccionados adquiriendo las etiquetas que corresponden a los valores 7 y 8 del combo de estadosEJG.
    //Concretamente, se comprobaria si alguno de los ejgs seleccionados tienen un estado ejg distinto a ese y se bloquearia si asi fuera.

    this.disableAddRemesa = false;
    let LRC;
    let LRCAD;

    //Buscamos las etiquetas correspondientes a los valores 7 y 8 
    //que equivaldrian respectivamente a "Listo remitir comisión" y "Listo remitir comisión act. designación" respectivamente 
    this.comboEstadoEJG.forEach(element => {
      if (element.value == "7") LRC = element.label;
      else if (element.value == "17") LRCAD = element.label;
    });

    selectedDatos.forEach(element => {
      if (element.estadoEJG != LRC && element.estadoEJG != LRCAD) this.disableAddRemesa = true;
    });

    /* if(this.filtro.estadoEJG=="7" || this.filtro.estadoEJG=="8"){
      this.disableAddRemesa = false;
    }
    else{
      this.disableAddRemesa = true;
    } */

  }

  fillFechaEstado(event) {
    this.fechaEstado = event;
  }
}
