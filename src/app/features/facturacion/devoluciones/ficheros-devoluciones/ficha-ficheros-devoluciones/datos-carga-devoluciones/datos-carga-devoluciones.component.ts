import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Confirmation, ConfirmationService, Message } from 'primeng/primeng';
import { FicherosDevolucionesItem } from '../../../../../../models/FicherosDevolucionesItem';
import { saveAs } from "file-saver/FileSaver";
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Location } from '@angular/common';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-datos-carga-devoluciones',
  templateUrl: './datos-carga-devoluciones.component.html',
  styleUrls: ['./datos-carga-devoluciones.component.scss']
})
export class DatosCargaDevolucionesComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  
  @Input() openTarjetaDatosCarga: boolean;
  @Output() opened = new EventEmitter<boolean>();
  @Output() idOpened = new EventEmitter<boolean>();
  @Output() guardadoSend = new EventEmitter<FicherosDevolucionesItem>();
  @Input() bodyInicial: FicherosDevolucionesItem;
  @Input() modoEdicion: boolean;
  
  @ViewChild("pUploadFile")
  pUploadFile;
  file: File;

  procesoIniciado: boolean = false;

  showModalEliminar: boolean = false;
  confirmImporteTotal: string;

  comision: boolean;
  
  constructor(
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  getFile(event: any) {
    this.progressSpinner = true;

    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );
    
    if (extensionArchivo == null || extensionArchivo.trim() == "" 
          || !/\.(xml|txt|d19)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      this.file = undefined;

      this.progressSpinner = false;
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];

      this.pUploadFile.clear();
      this.progressSpinner = false;
    }
    
  }

  // Guardar y procesar
  save() {
    if (!this.modoEdicion && this.file != undefined) {
      this.progressSpinner = true;

      this.sigaServices.postSendFileAndParameters2("facturacionPyS_nuevoFicheroDevoluciones", this.file, {
        conComision: this.comision != undefined ? this.comision : false
      }).subscribe(
        n => {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("facturacionPyS.ficherosDevoluciones.generando"));
          this.procesoIniciado = true;
          this.progressSpinner = false;
        },
        err => {
          if (err && err.error) {
            let error = err.error;
            if (error && error.error && error.error.message) {
              let message = this.translateService.instant(error.error.message);
          
              if (message && message.trim().length != 0) {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
              } else {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.error.message);
              }
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          }
          
          this.progressSpinner = false;
        }
      );
    }
  }

  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };

    if (this.bodyInicial.nombreFichero) {
      this.progressSpinner = true;
      let descarga =  this.sigaServices.getDownloadFiles("facturacionPyS_descargarFicheroDevoluciones", [{ idDisqueteDevoluciones: this.bodyInicial.idDisqueteDevoluciones }]);
      descarga.subscribe(response => {
        this.progressSpinner = false;

        const file = new Blob([response.body], {type: response.headers.get("Content-Type")});
        let filename: string = response.headers.get("Content-Disposition");
        filename = filename.split(';')[1].split('filename')[1].split('=')[1].trim();

        saveAs(file, filename);
        this.showMessage('success', 'LOG descargado correctamente',  'LOG descargado correctamente' );
      },
      err => {
        this.progressSpinner = false;
        this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
      });
    } else {
      this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
    }
  }

  // Primera confirmación
  confirmEliminar(): void {
    let mess = this.translateService.instant("facturacionPyS.ficherosTransferencias.messages.primeraConfirmacion");
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      key: "first",
      message: mess,
      icon: icon,
      acceptLabel: "Sí",
      rejectLabel: "No",
      accept: () => {
        this.showModalEliminar = true;
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

  // Segunda confirmación

  confirmEliminar2(): void {
    if (!this.disableConfirmEliminar()) {
      this.showModalEliminar = false;
      this.eliminar();
      // this.showMessage("info", this.translateService.instant("general.message.informacion"), "El fichero está siendo eliminado");
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("facturacionPyS.ficherosExp.eliminar.error.importe"));
    }   
  }

  rejectEliminar2(): void {
    this.showModalEliminar = false;
    this.confirmImporteTotal = undefined;
    this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
  }

  disableConfirmEliminar(): boolean {
    return parseFloat(this.confirmImporteTotal) != parseFloat(this.bodyInicial.facturacion);
  }

  // Función de eliminar

  eliminar() {
    this.progressSpinner = true;
    
    let deleteRequest = {
      idDisqueteDevoluciones: this.bodyInicial.idDisqueteDevoluciones
    };

    this.sigaServices.post("facturacionPyS_eliminarFicheroDevoluciones", deleteRequest).subscribe(
      data => {
        sessionStorage.setItem("mensaje", JSON.stringify({
          severity: "success", summary: this.translateService.instant("general.message.correct"), detail: this.translateService.instant("facturacionPyS.ficherosExp.eliminar.exito")
        }));
        sessionStorage.setItem("volver", "true");
        this.backTo();
        this.confirmImporteTotal = undefined;
        this.progressSpinner = false;
      },
      err => {
        this.handleServerSideErrorMessage(err);
        this.confirmImporteTotal = undefined;
        this.progressSpinner = false;
      }
    );
  }

  // Fundiones para mostrar y ocultar los mensajes

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

  handleServerSideErrorMessage(err): void {
    let error = JSON.parse(err.error);
    if (error && error.error && error.error.message) {
      let message = this.translateService.instant(error.error.message);
  
      if (message && message.trim().length != 0) {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), message);
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), error.error.message);
      }
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaDatosCarga;
  }

  abreCierraFicha(key): void {
    this.openTarjetaDatosCarga = !this.openTarjetaDatosCarga;
    this.opened.emit(this.openTarjetaDatosCarga);
    this.idOpened.emit(key);
  }

  backTo() {
    sessionStorage.setItem("volver", "true")
    this.location.back();
  }
}
