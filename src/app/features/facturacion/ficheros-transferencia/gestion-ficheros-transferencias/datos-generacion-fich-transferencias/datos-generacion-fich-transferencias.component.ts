import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { FacAbonoItem } from '../../../../../models/sjcs/FacAbonoItem';
import { FicherosAbonosItem } from '../../../../../models/sjcs/FicherosAbonosItem';
import { saveAs } from "file-saver/FileSaver";
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generacion-fich-transferencias',
  templateUrl: './datos-generacion-fich-transferencias.component.html',
  styleUrls: ['./datos-generacion-fich-transferencias.component.scss']
})
export class DatosGeneracionFichTransferenciasComponent implements OnInit {

  @Input() openTarjetaDatosGeneracion;
  @Input() bodyInicial: FicherosAbonosItem;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  openFicha: boolean = true;
  progressSpinner: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = true;

  body: FicherosAbonosItem = new FicherosAbonosItem();

  showModalEliminar: boolean = false;
  confirmImporteTotal: string;

  msgs;

  fichaPosible = {
    key: "datosGeneracion",
    activa: true
  }

  constructor(private confirmationService: ConfirmationService, private translateService: TranslateService,
     private sigaServices: SigaServices) { }

  async ngOnInit() {
    this.body =  JSON.parse(JSON.stringify(this.bodyInicial));

    if(undefined!=this.body.fechaCreacion)
      this.body.fechaCreacion= new Date(this.body.fechaCreacion);
      console.log(this.bodyInicial);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaDatosGeneracion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };

    if (this.bodyInicial.nombreFichero) {
      this.progressSpinner = true;
      let descarga =  this.sigaServices.getDownloadFiles("facturacionPyS_descargarFicheroTransferencias", [{ idDisqueteAbono: this.bodyInicial.idDisqueteAbono }]);
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
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.eliminarDocumentacion");
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
      this.showMessage("info", "Exito", "El importe coincide correctamente");
    } else {
      this.showMessage("info", "Cancelar", "El importe no coincide");
    }   
  }

  rejectEliminar2(): void {
    this.showModalEliminar = false;
    this.confirmImporteTotal = undefined;
    this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
  }

  disableConfirmEliminar(): boolean {
    return parseFloat(this.confirmImporteTotal) != parseFloat(this.bodyInicial.importeTotal);
  }

  // Función de eliminar

  eliminar() {
    // this.sigaServices.post("facturacionPyS_eliminaSerieFacturacion", this.selectedDatos).subscribe(
    //   data => {
    //     this.busqueda.emit();
    //     this.showMessage("success", "Eliminar", "Las series de facturación han sido dadas de baja con exito.");
    //     this.progressSpinner = false;
    //   },
    //   err => {
    //     this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
    //     this.progressSpinner = false;
    //   }
    // );
  }

  // Funciones de utilidad

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

  // Abrir y cerrar ficha

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    if (key == "datosGeneracion" && !this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }
}