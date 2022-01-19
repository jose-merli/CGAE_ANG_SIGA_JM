import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng';
import { FicherosDevolucionesItem } from '../../../../../../models/FicherosDevolucionesItem';

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
  
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    
  }

  getFile(event: any) {
    let fileList: FileList = event.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    console.log(nombreCompletoArchivo);
    /*
    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(xls)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeArchivo = false;
      this.showMessage(
        "info",
        this.translateService.instant("general.message.informacion"),
        this.translateService.instant(
          "formacion.mensaje.extesion.fichero.erronea"
        )
      );
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.existeArchivo = true;

      this.uploadFile();
    }
    */
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

}
