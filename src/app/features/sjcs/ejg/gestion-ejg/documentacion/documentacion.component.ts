import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { TranslateService } from '../../../../../commons/translate';
import { ConfirmationService } from 'primeng/api';
import { CommonsService } from '../../../../../_services/commons.service';
import { DocumentacionEjgItem } from '../../../../../models/sjcs/DocumentacionEjgItem';
import { saveAs } from "file-saver/FileSaver";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.scss']
})
export class DocumentacionComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaDocumentacion;
  @Output() guardadoSend = new EventEmitter<any>();

  @ViewChild('fileInput') fileInput;

  progressSpinner: boolean = false;
  selectMultiple: boolean = false;
  showModalNewDoc: boolean = false;
  required: boolean = false;

  comboPresentador: any [];
  comboTipoDocumentacion: any [];
  comboDocumentos: any [];
  
  cols;
  msgs;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  rowsPerPage: any = [];
  buscadores = [];
  numSelected = 0;
  tiposCabecera = "";
  documentos: DocumentacionEjgItem[] = [];
  documento: DocumentacionEjgItem = new DocumentacionEjgItem();
  documentoInicial: DocumentacionEjgItem;

  constructor(private sigaServices: SigaServices, private persistenceService: PersistenceService,
    private translateService: TranslateService, private confirmationService: ConfirmationService,
    private commonsServices: CommonsService, private router: Router, private datepipe: DatePipe) {
  }

  async ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    await this.getComboPresentador();
    this.getComboTipoDocumentacion();
    this.getDocumentos();
  }

  abreCierraFicha() {
    this.openTarjetaDocumentacion = !this.openTarjetaDocumentacion;
  }

  clear() {
    this.msgs = [];
  }

  actualizaSeleccionados() {
    this.numSelected = this.selectedDatos.length;
    this.selectAll = false;
  }

  openFileSelector(){
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event, documentacion){
    this.progressSpinner = true;
    let ficheroTemporal = event.target.files[0];
    this.sigaServices.postSendFileAndParameters("gestionejg_subirDocumentoEjg", ficheroTemporal, documentacion.idDocumentacion).subscribe(
      data => {
        this.selectedDatos = [];
        if (data["error"].code == 200) {
          this.getDocumentos();
        } else if (data["error"].code == null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), data["error"].message);
          this.progressSpinner = false;
        }
      },
      error => {
        this.selectedDatos = [];
        if (ficheroTemporal.size > 5242880){
          this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.tamMax"));
        } else { 
          this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.ejg.documentacion.errorFich"));
        }
        this.progressSpinner = false;
      }
    );
  }

  download() {
    this.progressSpinner = true;
    this.sigaServices.postDownloadFiles("gestionejg_descargarDocumentosEjg", this.selectedDatos).subscribe(
      data => {
        let blob = null;
        if (this.selectedDatos.length == 1) {
            let mime = data.type;
            blob = new Blob([data], { type: mime });
            saveAs(blob, this.selectedDatos[0].nombreFichero);            
        } else {
          blob = new Blob([data], { type: "application/zip" });
          saveAs(blob, "documentos.zip");
        }
        this.selectedDatos = [];
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("formacion.mensaje.extesion.fichero.erronea"));
      }
    );
  }

  print() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      //this.print();
    }
  }

  deleteDocumentacion() {
    this.progressSpinner = true;
    this.sigaServices.post("gestionejg_eliminarDocumentacionEjg", this.selectedDatos).subscribe(
      data => {
        let resp = data;
        let error = JSON.parse(data.body).error;
        this.selectedDatos = [];
        if (resp.statusText == 'OK') {
          this.showMessage('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          this.getDocumentos();
        } else {
          if (error != null && error.description != null && error.description != '') {
            this.showMessage('error', 'Error', this.translateService.instant(error.description));
          } else {
            this.showMessage('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
          }
        }
        this.progressSpinner = false;
      },
      err => {
        this.selectedDatos = [];
        this.progressSpinner = false;
        this.showMessage('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
      }
    );
  }

  editDocumento(dato: DocumentacionEjgItem = null) {  
    this.showModalNewDoc = true;
    if (dato != null) {
      this.documento = {...dato};
      if (dato.flimite_presentacion != undefined && dato.flimite_presentacion != null){
        this.documento.flimite_presentacion = new Date(dato.flimite_presentacion);
      }
      if (dato.f_presentacion != undefined && dato.f_presentacion != null){
        this.documento.f_presentacion = new Date(dato.f_presentacion);
      }
    } else {
      this.documento = new DocumentacionEjgItem();
    }
    this.getComboDocumentos();
    this.documentoInicial = {...this.documento};
  }

  cerrarNuevoDoc(){
    this.showModalNewDoc = false;
    this.required = false;
    this.selectedDatos = [];
  }

  guardarDoc() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      if (!this.validateDoc()) {
        this.showMessage("error", "Error", this.translateService.instant("general.message.camposObligatorios"));
        this.required = true;
      } else {

        let url = "gestionejg_actualizarDocumentacionEjg";
        let peticion: DocumentacionEjgItem = this.documento;
        if(peticion.idDocumentacion == null){
          url = "gestionejg_crearDocumentacionEjg";
          peticion.anio = Number(this.datos.annio);
          peticion.numero = Number(this.datos.numero);
          peticion.idTipoEjg = Number(this.datos.tipoEJG);
        }
    
        this.sigaServices.post(url, peticion).subscribe(
          data => {

            let resp = data;
            let error = JSON.parse(data.body).error;   
            if (resp.statusText == 'OK') {
              this.selectedDatos = [];
              this.cerrarNuevoDoc();
              this.getDocumentos();
            } else {
              if (error != null && error.description != null && error.description != '') {
                this.showMessage('error', 'Error', this.translateService.instant(error.description));
              } else {
                this.showMessage('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
              }
            }
          },
          err => {
            let unError = JSON.parse(err.error);
            if (unError.error.description == 'justiciaGratuita.oficio.designa.formatoDocumentacionNoValido') {
              this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant('justiciaGratuita.oficio.designa.formatoDocumentacionNoValido'));
            } else {
              this.showMessage('error', 'Error', this.translateService.instant('general.mensaje.error.bbdd'));
            }
            this.cerrarNuevoDoc();
          }
        );
      }
    }
  }

  documentoRest(){
    this.documento = {...this.documentoInicial};
  }

  fillFechaLimPre(event) {
    this.documento.flimite_presentacion = event;
  }

  fillFechaPre(event) {
    this.documento.f_presentacion = event;
  }

  styleObligatorio(evento) {
    return this.required && this.commonsServices.styleObligatorio(evento);
  }

  getComboDocumentos() {
    if (this.documento.idTipoDocumento != null && this.documento.idTipoDocumento != undefined) {
      this.sigaServices.getParam("gestionejg_comboDocumentos", "?idTipoDocumentacion=" + this.documento.idTipoDocumento).subscribe(
        n => {
          this.comboDocumentos = n.combooItems;
          this.commonsServices.arregloTildesCombo(this.comboDocumentos);
          //añadimos el elemento "Todos" que hara que se añadan todos los elementos del combo.
          if (this.comboDocumentos.length > 1) {
            this.comboDocumentos.push({ label: this.translateService.instant('justiciaGratuita.ejg.documentacion.todosDoc'), value: "-1" });
          }
        }
      );
    } else {
      this.comboDocumentos = [];
    }
  }

  private validateDoc() {
    if (this.documento.idTipoDocumento != null && this.documento.presentador != null) {
      return true;
    }
    else return false;
  }

  private getDocumentos() {
    this.sigaServices.post("gestionejg_getDocumentos", this.datos).subscribe(
      n => {
        this.tiposCabecera = "";
        this.documentos = JSON.parse(n.body).ejgDocItems;
        if (this.documentos != null && this.documentos != undefined) {
          this.documentos.forEach(element => {
            if (!element.presentador && element.parentesco) {
              element.presentador_persona = element.presentador_persona + " (" + element.parentesco + " )";
            }
            //Cuando el presentador seleccionado no es un solicitante
            if (element.idMaestroPresentador) {
              element.presentador = element.idMaestroPresentador.toString();
              //Valor de la columna presentador
              this.comboPresentador.forEach(pres => {
                 if (pres.value == element.presentador) element.presentador_persona = pres.label;
              });
            } else if (element.presentador) {
              //Cuando el presentador es un solicitante
              element.presentador = "S_" + element.presentador;
              //Valor de la columna presentador
              this.comboPresentador.forEach(pres => {
                if (pres.value == element.presentador) element.presentador_persona = pres.label;
              });
            }
            if (this.documentos.length <= 3 && this.documentos.length > 0) {
              if (this.tiposCabecera != "") this.tiposCabecera += ", ";
              this.tiposCabecera += element.labelDocumento;
            }
          });
        }
        this.progressSpinner= false;
      }, err => {
        this.progressSpinner= false;
      }
    );
  }

  private async getComboPresentador() {
    await this.sigaServices.get("gestionejg_comboPresentadores").subscribe(
      n => {
        this.comboPresentador = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPresentador);
      }
    );
  }

  private getCols() {
    this.cols = [
      { field: "flimite_presentacion", header: "justiciaGratuita.ejg.datosGenerales.FechaLimPresentacion" },
      { field: "presentador_persona", header: "justiciaGratuita.ejg.documentacion.Presentador" },
      { field: "labelDocumento", header: "justiciaGratuita.ejg.documentacion.Documento" },
      { field: "nombreFichero", header: "facturacion.cmc.fichero" },
      { field: "regEntradaSalida", header: "justiciaGratuita.ejg.documentacion.RegistroEntradaSalida" },
      { field: "f_presentacion", header: "censo.consultaDatosGenerales.literal.fechaPresentacion" },
      { field: "propietarioDes", header: "justiciaGratuita.ejg.documentacion.Propietario" },
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  private getComboTipoDocumentacion() {
    this.sigaServices.get("gestionejg_comboTipoDocumentacion").subscribe(
      n => {
        this.comboTipoDocumentacion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoDocumentacion);
      }
    );
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
}