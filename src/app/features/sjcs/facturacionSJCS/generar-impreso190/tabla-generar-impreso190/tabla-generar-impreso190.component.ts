import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { Impreso190Item } from '../../../../../models/sjcs/Impreso190Item';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-tabla-generar-impreso190',
  templateUrl: './tabla-generar-impreso190.component.html',
  styleUrls: ['./tabla-generar-impreso190.component.scss']
})
export class TablaGenerarImpreso190Component implements OnInit {

  selectedDatos = [];
  selectedItem: number = 10;
  rowsPerPage: any = [];
  cols;
  msgs;
  selectionMode: String = "multiple";
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;
  selectAll: boolean = false;
  first = 0;
  initDatos: any;
  buscadores = [];
  isNuevo = false;
  impresoConf = new Impreso190Item;
  newImpreso = new Impreso190Item;
  progressSpinner;
  fechaGen;
  constructor(private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private confirmationService: ConfirmationService,
    private datepipe: DatePipe) { }

  @Input() datos;
  @Input() permisoEscritura;
  @Output() getImpresoRefresh = new EventEmitter<boolean>();
  @ViewChild("tabla") tabla;
  @ViewChild("tablaFoco") tablaFoco: ElementRef;

  ngOnInit() {

    if (this.persistenceService.getPaginacion() != undefined) {
      let paginacion = this.persistenceService.getPaginacion();
      this.persistenceService.clearPaginacion();

      this.first = paginacion.paginacion;
      this.selectedItem = paginacion.selectedItem;
    }

    this.getCols();
    if (this.datos != null || this.datos != undefined) {
      this.initDatos = JSON.parse(JSON.stringify((this.datos)));
    }
  }

  getCols() {

    this.cols = [
      { field: "anio", header: "justiciaGratuita.sjcs.designas.DatosIden.ano", width: "5%" },
      { field: "nomFichero", header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero", width: "15%" },
      { field: "telefonoContacto", header: "censo.ws.literal.telefono", width: "10%" },
      { field: "nombreContacto", header: "censo.usuario.nombre", width: "15%" },
      { field: "apellido1Contacto", header: "censo.busquedaClientes.literal.apellido1", width: "15%" },
      { field: "apellido2Contacto", header: "censo.busquedaClientes.literal.apellido2", width: "15%" },
      { field: "fechageneracion", header: "justiciaGratuita.remesas.tabla.FechaGeneracion", width: "15%" },
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

  confirmDelete() {
    let mess = this.translateService.instant(
      'impreso190.mensajeConf.eliminar'
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: 'delImpreso',
      message: mess,
      icon: icon,
      accept: () => {
        this.delImpreso();

      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        this.restablecer()

      }
    });
  }

  delImpreso() {
    this.progressSpinner = true;
    this.sigaServices.post("impreso190_eliminar",this.selectedDatos).subscribe(
      data =>{
        let error = JSON.parse(data.body).error;
					if (error != undefined && error != null && error.description != null) {
						if (error.code == '200') {
							this.showMessage("success", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
						} else {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
						}
					}
          this.restablecer();
          this.progressSpinner = false;
      },
      err => {
        
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.restablecer()
        this.progressSpinner = false;
      }
    )
    
  }

  nuevoImpreso() {
    this.isNuevo = true;
    this.progressSpinner = true
    this.getImpresoConf();

    this.progressSpinner = false;
    let dummy = {
      anio: "",
      nomFichero: "",
      telefonoContacto: "",
      nombreContacto: "",
      apellido1Contacto: "",
      apellido2Contacto: "",
      fechageneracion: "",
      nuevoRegistro: true
    };

    this.datos = [dummy, ...this.datos];

  }

  confirmSave() {
    let mess = this.translateService.instant(
      'impreso190.mensajeConf.generar'
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: 'addImpreso',
      message: mess,
      icon: icon,
      accept: () => {
        this.guardarImpreso();

      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        this.restablecer()

      }
    });
  }
  guardarImpreso() {
    this.isNuevo = false;
    this.progressSpinner = true;
    this.sigaServices.post("impreso190_generar",this.newImpreso).subscribe(
      data =>{
        let error = JSON.parse(data.body).error;
					if (error != undefined && error != null && error.description != null) {
						if (error.code == '200') {
							this.showMessage("success", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
						} else {
							this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
						}
					}
          this.restablecer();
          this.progressSpinner = false;
      },
      err => {
        
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.restablecer()
        this.progressSpinner = false;
      }
    )
  }

  confirmDescarga() {
    let mess = this.translateService.instant(
      'impreso190.mensajeConf.descargar'
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: 'downImpreso',
      message: mess,
      icon: icon,
      accept: () => {
        this.descargarImpreso();

      },
      reject: () => {
        this.msgs = [{
          severity: "info",
          summary: "Cancel",
          detail: this.translateService.instant("general.message.accion.cancelada")
        }];
        this.restablecer()

      }
    });
  }
  descargarImpreso() {
  
    this.progressSpinner = true;

    this.sigaServices.postDownloadFiles("impreso190_descargar", this.selectedDatos).subscribe(
      data => {

        let blob = null;

        if (this.selectedDatos.length == 1) {

          let mime = ".txt";
          blob = new Blob([data], { type: mime });
          saveAs(blob, this.selectedDatos[0].nomFichero + ".txt");
        } else {

          blob = new Blob([data], { type: "application/zip" });
          saveAs(blob, "Impresos_190.zip");
        }
        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }
 
  getMimeType(extension: string): string {

    let mime: string = "";

    switch (extension.toLowerCase()) {

      case ".doc":
        mime = "application/msword";
        break;
      case ".docx":
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".pdf":
        mime = "application/pdf";
        break;
      case ".jpg":
        mime = "image/jpeg";
        break;
      case ".png":
        mime = "image/png";
        break;
      case ".rtf":
        mime = "application/rtf";
        break;
      case ".txt":
        mime = "text/plain";
        break;
    }

    return mime;
  }

  restablecer() {
    this.isNuevo = false;
    this.selectedDatos = []
    this.getImpresoRefresh.emit(true);
  }

  selectDesSelectFila() {
    this.numSelected = this.selectedDatos.length;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.tabla.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
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

  getImpresoConf() {
    this.progressSpinner = true;
    const datepipe = new DatePipe('en-US');
    this.sigaServices.get("impreso190_searchConfImpreso190").subscribe(
      data => {
        this.impresoConf = JSON.parse(JSON.stringify(data.impreso190Item))[0];
        let anio = new Date().getFullYear();

        this.newImpreso.fechageneracion = new Date(this.impresoConf.fechageneracion);
        this.newImpreso.anio = (anio -1).toString();
        this.newImpreso.nomFicheroOriginal = this.impresoConf.nomFichero;
        this.newImpreso.telefonoContacto = this.impresoConf.telefonoContacto;
        this.newImpreso.nombreContacto = this.impresoConf.nombreContacto;
        this.newImpreso.apellido1Contacto = this.impresoConf.apellido1Contacto
        this.newImpreso.apellido2Contacto = this.impresoConf.apellido2Contacto
        this.newImpreso.apellido2Contacto = this.impresoConf.apellido2Contacto
        let error = JSON.parse(JSON.stringify(data.error));
        
        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }

        this.progressSpinner = false;
      },
      err => {
        
        if (err != undefined && JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      }
    )
    this.progressSpinner = false;
  }

  formatDate(date) {

    const pattern = 'dd/MM/yyyy hh:mm:ss';

    return this.datepipe.transform(date, pattern);

  }
  
  fillFecha(event) {
    this.newImpreso.fechageneracion = event;
  }
}
