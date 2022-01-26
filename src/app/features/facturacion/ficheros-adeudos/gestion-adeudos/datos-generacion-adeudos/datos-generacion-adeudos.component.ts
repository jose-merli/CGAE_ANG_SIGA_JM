import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";
import { Location } from '@angular/common';

@Component({
  selector: 'app-datos-generacion-adeudos',
  templateUrl: './datos-generacion-adeudos.component.html',
  styleUrls: ['./datos-generacion-adeudos.component.scss']
})
export class DatosGeneracionAdeudosComponent implements OnInit {

  @Input() bodyInicial: FicherosAdeudosItem;
  @Input() modoEdicion;
  @Input() openTarjetaDatosGeneracion;
  @Input() permisoEscritura;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<string>();
  @Output() guardadoSend = new EventEmitter<FicherosAdeudosItem>();
  @Output() refreshData = new EventEmitter<void>();

  openFicha: boolean = true;
  progressSpinner: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = true;

  body: FicherosAdeudosItem;

  fechaHoy = new Date();
  minDateRecibos = new Date();
  minDateRecurrentes = new Date();
  minDateCOR = new Date();
  minDateB2B = new Date();

  msgs;

  primerosRecibosSEPA=0;
  recibosRecurrentesSEPA=0;
  recibosCORSEPA=0;
  recibosB2BSEPA=0;

  showModalEliminar: boolean = false;
  confirmImporteTotal: string;

  fichaPosible = {
    key: "datosGeneracion",
    activa: true
  }

  constructor(private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private commonsServices: CommonsService, private translateService: TranslateService,
    private localStorageService: SigaStorageService, private location: Location) { }

  async ngOnInit() {
    this.cargaDatosSEPA();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bodyInicial && changes.bodyInicial.currentValue) {
      this.rest();
    }
  }

  cargaDatosSEPA(){
    this.progressSpinner=true;
    
    this.sigaServices.get("facturacionPyS_parametrosSEPA").subscribe(
      n => {
        let data = n.combooItems;
        console.log(data);
        
        for(let i=0; data.length>i; i++){
          
          if(data[i].value=="SEPA_DIAS_HABILES_PRIMEROS_RECIBOS"){
            this.primerosRecibosSEPA = parseFloat(data[i].label);
            this.minDateRecibos = new Date(this.fechaHoy.getTime()+(this.primerosRecibosSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_RECURRENTES"){
            this.recibosRecurrentesSEPA = parseFloat(data[i].label);
            this.minDateRecurrentes = new Date(this.fechaHoy.getTime()+(this.recibosRecurrentesSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_COR1"){
            this.recibosCORSEPA = parseFloat(data[i].label);
            this.minDateCOR = new Date(this.fechaHoy.getTime()+(this.recibosCORSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_B2B"){
            this.recibosB2BSEPA = parseFloat(data[i].label);
            this.minDateB2B = new Date(this.fechaHoy.getTime()+(this.recibosB2BSEPA*24*60*60*1000));
          }
        }

        this.progressSpinner=false;
      },
      err => {
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };

    if (this.bodyInicial.nombreFichero) {
      this.progressSpinner = true;
      let descarga =  this.sigaServices.getDownloadFiles("facturacionPyS_descargarFicheroAdeudos", [{ idDisqueteCargos: this.bodyInicial.idDisqueteCargos }]);
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
    return parseFloat(this.confirmImporteTotal) != parseFloat(this.bodyInicial.totalRemesa);
  }

  // Función de eliminar

  eliminar() {
    this.progressSpinner = true;
    this.sigaServices.post("facturacionPyS_eliminarFicheroAdeudos", this.bodyInicial).subscribe(
      data => {
        this.showMessage("success", this.translateService.instant("general.message.correct"), "El fichero de adeudos ha sido eliminado con exito.");
        this.backTo();
        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  rest(){
    this.body =  JSON.parse(JSON.stringify(this.bodyInicial));
    this.resaltadoDatos = false;

    this.arreglaFechas();
  }

  arreglaFechas(){
    if(undefined!=this.body.fechaCreacion)
    this.body.fechaCreacion= new Date(this.body.fechaCreacion);

    if (undefined!=this.body.fechaUltimaModificacion)
      this.body.fechaUltimaModificacion= new Date(this.body.fechaUltimaModificacion);

    if (undefined!=this.body.fechaPresentacion)
      this.body.fechaPresentacion= new Date(this.body.fechaPresentacion)
    
    if (undefined!=this.body.fechaRecibosPrimeros)
      this.body.fechaRecibosPrimeros= new Date(this.body.fechaRecibosPrimeros)
    
    if (undefined!=this.body.fechaRecibosRecurrentes)
      this.body.fechaRecibosRecurrentes= new Date(this.body.fechaRecibosRecurrentes)
    
    if (undefined!=this.body.fechaRecibosCOR)
      this.body.fechaRecibosCOR= new Date(this.body.fechaRecibosCOR)
    
    if (undefined!=this.body.fechaRecibosB2B)
      this.body.fechaRecibosB2B= new Date(this.body.fechaRecibosB2B)
  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.notChangedDate(this.body.fechaPresentacion, this.bodyInicial.fechaPresentacion)
        && this.notChangedDate(this.body.fechaRecibosPrimeros, this.bodyInicial.fechaRecibosPrimeros)
        && this.notChangedDate(this.body.fechaRecibosRecurrentes, this.bodyInicial.fechaRecibosRecurrentes)
        && this.notChangedDate(this.body.fechaRecibosCOR, this.bodyInicial.fechaRecibosCOR)
        && this.notChangedDate(this.body.fechaRecibosB2B, this.bodyInicial.fechaRecibosB2B);
  }

  notChangedDate(value1: Date, value2: Date): boolean {
    return value1 == value2 || value1 == undefined && value2 == undefined || new Date(value1).getTime() == new Date(value2).getTime();
  }

  isValid(): boolean {
    return this.body.fechaRecibosRecurrentes != undefined && this.body.fechaPresentacion != undefined && this.body.fechaRecibosPrimeros != undefined && this.body.fechaRecibosB2B != undefined && this.body.fechaRecibosCOR != undefined;
  }

  save(){
    if (this.isValid() &&  !this.deshabilitarGuardado()) {
      console.log(this.body);
     this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
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

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  esFichaActiva(key) {
    return this.openTarjetaDatosGeneracion;
  }

  abreCierraFicha(key) {
    this.openTarjetaDatosGeneracion = !this.openTarjetaDatosGeneracion;
    this.opened.emit(this.openTarjetaDatosGeneracion);
    this.idOpened.emit(key);
  }

  fillFecha(event, campo) {
    if(campo==='fechaPresentacion'){
      this.body.fechaPresentacion = event;
      
      if (this.body.fechaPresentacion) {
        this.body.fechaRecibosPrimeros = new Date(this.body.fechaPresentacion.getTime()+(this.primerosRecibosSEPA*24*60*60*1000));
        this.minDateRecibos = this.body.fechaRecibosPrimeros;

        this.body.fechaRecibosRecurrentes = new Date(this.body.fechaPresentacion.getTime()+(this.recibosRecurrentesSEPA*24*60*60*1000));
        this.minDateRecurrentes = this.body.fechaRecibosRecurrentes;

        this.body.fechaRecibosCOR = new Date(this.body.fechaPresentacion.getTime()+(this.recibosCORSEPA*24*60*60*1000));
        this.minDateCOR = this.body.fechaRecibosCOR;

        this.body.fechaRecibosB2B = new Date(this.body.fechaPresentacion.getTime()+(this.recibosB2BSEPA*24*60*60*1000));
        this.minDateB2B = this.body.fechaRecibosB2B;
      }

    }else if(campo==='fechaRecibosPrimeros'){
      this.body.fechaRecibosPrimeros = event;
    
    }else if(campo==='fechaRecibosRecurrentes'){
      this.body.fechaRecibosRecurrentes = event;
    
    }else if(campo==='fechaRecibosCOR'){
      this.body.fechaRecibosCOR = event;
    
    }else if(campo==='fechaRecibosB2B'){
      this.body.fechaRecibosB2B = event;
    }
  }

  backTo() {
    sessionStorage.setItem("volver", "true")
    this.location.back();
  }
}