import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';

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
  @Output() idOpened = new EventEmitter<Boolean>();
  // @Output() guardadoSend = new EventEmitter<any>();

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

  fichaPosible = {
    key: "datosGeneracion",
    activa: true
  }

  constructor(private sigaServices: SigaServices, private confirmationService: ConfirmationService,
    private commonsServices: CommonsService, private translateService: TranslateService,
    private localStorageService: SigaStorageService) { }

  async ngOnInit() {
    this.cargaDatosSEPA(this.body.idInstitucion);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.bodyInicial && changes.bodyInicial.currentValue) {
      this.rest();
    }
  }

  cargaDatosSEPA(idInstitucion){
    this.progressSpinner=true;
    
    this.sigaServices.getParam("facturacionPyS_parametrosSEPA", idInstitucion ? `?idInstitucion=${idInstitucion}` : "").subscribe(
      n => {
        let data = n.combooItems;
        
        for(let i=0; data.length>i; i++){
          
          if(data[i].value=="SEPA_DIAS_HABILES_PRIMEROS_RECIBOS"){
            this.primerosRecibosSEPA=data[i].label;
            this.minDateRecibos = new Date(this.fechaHoy.getTime()+(this.primerosRecibosSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_RECURRENTES"){
            this.recibosRecurrentesSEPA=data[i].label;
            this.minDateRecurrentes = new Date(this.fechaHoy.getTime()+(this.recibosRecurrentesSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_COR1"){
            this.recibosCORSEPA=data[i].label;
            this.minDateCOR = new Date(this.fechaHoy.getTime()+(this.recibosCORSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_B2B"){
            this.recibosB2BSEPA=data[i].label;
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

  descargarFicheroAdeudo(){

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

  isValid(): boolean {
    return this.body.fechaRecibosRecurrentes != undefined && this.body.fechaPresentacion != undefined && this.body.fechaRecibosPrimeros != undefined && this.body.fechaRecibosB2B != undefined && this.body.fechaRecibosCOR != undefined;
  }

  save(){
    if (this.isValid()) {
     
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }
/*
  facturacionPyS_nuevoFicheroAdeudos:  "facturacionPyS/nuevoFicheroAdeudos",
    facturacionPyS_actualizarFicheroAdeudos:  "facturacionPyS/actualizarFicheroAdeudos",
*/
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

  fillFecha(event, campo) {
    if(campo==='fechaPresentacion'){
      this.body.fechaPresentacion = event;
      
      this.body.fechaRecibosPrimeros = new Date(this.body.fechaPresentacion.getTime()+(this.primerosRecibosSEPA*24*60*60*1000));
      this.minDateRecibos = this.body.fechaRecibosPrimeros

      this.body.fechaRecibosRecurrentes = new Date(this.body.fechaPresentacion.getTime()+(this.recibosRecurrentesSEPA*24*60*60*1000));
      this.minDateRecurrentes = this.body.fechaRecibosRecurrentes

      this.body.fechaRecibosCOR = new Date(this.body.fechaPresentacion.getTime()+(this.recibosCORSEPA*24*60*60*1000));
      this.minDateCOR = this.body.fechaRecibosCOR

      this.body.fechaRecibosB2B = new Date(this.body.fechaPresentacion.getTime()+(this.recibosB2BSEPA*24*60*60*1000));
      this.minDateB2B = this.body.fechaRecibosB2B

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
}