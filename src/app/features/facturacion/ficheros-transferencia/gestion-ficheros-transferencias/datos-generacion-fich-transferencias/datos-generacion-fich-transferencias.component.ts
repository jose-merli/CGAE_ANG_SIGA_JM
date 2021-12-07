import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { FicherosAbonosItem } from '../../../../../models/sjcs/FicherosAbonosItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generacion-fich-transferencias',
  templateUrl: './datos-generacion-fich-transferencias.component.html',
  styleUrls: ['./datos-generacion-fich-transferencias.component.scss']
})
export class DatosGeneracionFichTransferenciasComponent implements OnInit {

  @Input() openTarjetaDatosGeneracion;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();

  openFicha: boolean = true;
  progressSpinner: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = true;

  body: FicherosAbonosItem = new FicherosAbonosItem();

  msgs;

  fichaPosible = {
    key: "datosGeneracion",
    activa: true
  }

  constructor(private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private commonsServices: CommonsService, private translateService: TranslateService,
    private localStorageService: SigaStorageService) { }

  async ngOnInit() {
    // await this.rest();

    // if(this.body.idInstitucion)
    //   this.cargaDatosSEPA(this.body.idInstitucion);
    // else 
    //   this.cargaDatosSEPA(this.localStorageService.institucionActual);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaDatosGeneracion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  descargarFichero(){

  }

  confirmEliminar(): void {
    let mess = this.translateService.instant("justiciaGratuita.ejg.message.eliminarDocumentacion");
    let icon = "fa fa-eraser";

    this.confirmationService.confirm({
      //key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.progressSpinner = true;
        this.eliminar();
      },
      reject: () => {
        this.showMessage("info", "Cancelar", this.translateService.instant("general.message.accion.cancelada"));
      }
    });
  }

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