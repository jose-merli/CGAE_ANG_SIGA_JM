import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DataTable, ConfirmationService } from '../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../commons/translate';
import { Router } from '../../../../../../node_modules/@angular/router';
import { SigaServices } from '../../../../_services/siga.service';
import { PersistenceService } from '../../../../_services/persistence.service';
import { EJGItem } from '../../../../models/sjcs/EJGItem';
import { CommonsService } from '../../../../_services/commons.service';

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

  ejgObject = [];
  datosFamiliares = [];

  comboEstadoEJG = [];
  fechaEstado = new Date();
  valueComboEstado = "";

  //Resultados de la busqueda
  @Input() datos;

  @ViewChild("table") table: DataTable;
  @Output() searchHistoricalSend = new EventEmitter<boolean>();
  @Output() busqueda = new EventEmitter<boolean>();


  showModalCambioEstado = false;

  constructor(private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef, private router: Router,
    private sigaServices: SigaServices, private persistenceService: PersistenceService, private confirmationService: ConfirmationService, private commonServices: CommonsService) {

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
  }
  
  openTab(evento) {
    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos();
    }
    if (!this.selectAll && !this.selectMultiple) {
      // this.progressSpinner = true;
      this.datosEJG(evento.data);


    } else {
      if (evento.data.fechabaja == undefined && this.historico) {
        this.selectedDatos.pop();
      }
    }
  }

  datosEJG(selected) {
    this.progressSpinner = true;
    
    this.sigaServices.post("gestionejg_datosEJG", selected).subscribe(
      n => {
        this.ejgObject = JSON.parse(n.body).ejgItems;
        this.datosItem = this.ejgObject[0];
        this.persistenceService.setDatos(this.datosItem);
        this.consultaUnidadFamiliar(selected);
        this.commonServices.scrollTop();
      },
      err => {
        console.log(err);
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
        this.router.navigate(['/gestionEjg']);
        this.progressSpinner = false;
        this.commonServices.scrollTop();
      },
      err => {
        console.log(err);
      }
    );
  }

  setItalic(dato) {
    if (dato.fechabaja == null){
      return false;
    }else{
      return true;
    }
  }

  getCols() {
    this.cols = [
      { field: "turnoDes", header: "justiciaGratuita.justiciables.literal.turnoGuardia", width: "20%" },
      { field: "turno", header: "dato.jgr.guardia.guardias.turno", width: "10%" },
      { field: "annio", header: "justiciaGratuita.maestros.calendarioLaboralAgenda.anio", width: "5%" },
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

  getComboEstado() {
    this.progressSpinner=true;

    this.sigaServices.get("filtrosejg_comboEstadoEJG").subscribe(
      n => {
        this.comboEstadoEJG = n.combooItems;
        //this.commonServices.arregloTildesCombo(this.comboEstadoEJG);
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }
    );
  }
  
  cancelaCambiarEstados(){
    this.showModalCambioEstado = false;
  }

  checkCambiarEstados(){
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.cambiarEstado");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.cambiarEstados();
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];

        this.cancelaCambiarEstados();
      }
    });
  }

  cambiarEstados(){
    this.progressSpinner=true;
    let data = [];
    let ejg: EJGItem;

    for(let i=0; this.selectedDatos.length>i; i++){
      ejg = this.selectedDatos[i];
      ejg.fechaEstadoNew=this.fechaEstado;
      ejg.estadoNew=this.valueComboEstado;

      data.push(ejg);
    }

    this.sigaServices.post("gestionejg_cambioEstadoMasivo", data).subscribe(
      n => {
        this.progressSpinner=false;
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.busqueda.emit(false);
        this.showModalCambioEstado = false;
        this.selectedDatos = [];
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
        this.busqueda.emit(false);
        this.showModalCambioEstado = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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
      this.getComboEstado();      
    } else {
      this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("censo.datosBancarios.mensaje.seleccionar.almenosUno"));
    }
  }

  cerrarDialog() {
    this.showModalCambioEstado = false;
  }

  downloadEEJ() {
    this.progressSpinner=true;

    this.sigaServices.post("gestionejg_descargarExpedientesJG", this.selectDatos).subscribe(
      n => {
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }
    );
  }

  addRemesa() {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.cambiarEstado");
    let icon = "fa fa-edit";

    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.anadirRemesa();
      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
      }
    });
  }

  anadirRemesa(){
    this.progressSpinner=true;

    this.sigaServices.post("anadirExpedienteARemesa", this.selectDatos).subscribe(
      n => {
        this.progressSpinner=false;
      },
      err => {
        console.log(err);
        this.progressSpinner=false;
      }
    );
  }
}
