import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Confirmation, ConfirmationService, Message } from 'primeng/primeng';
import { FicherosDevolucionesItem } from '../../../../../../models/FicherosDevolucionesItem';
import { saveAs } from "file-saver/FileSaver";
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { Location } from '@angular/common';

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
  file;

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

    console.log(nombreCompletoArchivo);
    
    if (extensionArchivo == null || extensionArchivo.trim() == "" 
          || !/\.(xls)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      this.file = undefined;

      this.progressSpinner = false;
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];

      this.progressSpinner = false;
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
      this.showMessage("info", this.translateService.instant("general.message.informacion"), "El fichero está siendo eliminado");
    } else {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El importe introducido no coincide con el importe total del fichero");
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
    this.sigaServices.post("facturacionPyS_eliminarFicheroDevoluciones", this.bodyInicial).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), "El fichero de transferencias ha sido eliminado con exito.");
        this.backTo();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
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
