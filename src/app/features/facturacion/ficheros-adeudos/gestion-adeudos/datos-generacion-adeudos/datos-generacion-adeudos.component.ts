import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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

  @Input() datos;
  @Input() modoEdicion;
  @Input() openTarjetaDatosGeneracion;
  // @Input() permisoEscritura;
  @Input() tarjetaDatosGeneracion: string;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  // @Output() guardadoSend = new EventEmitter<any>();

  openFicha: boolean = true;
  progressSpinner: boolean = false;
  resaltadoDatos: boolean = false;
  activacionTarjeta: boolean = true;
  nuevo: boolean = false;

  body: FicherosAdeudosItem;
  bodyInicial: FicherosAdeudosItem;

  fechaHoy = new Date();

  msgs = [];

  primerosRecibosSEPA=0;
  recibosRecurrentesSEPA=0;
  recibosCORSEPA=0;
  recibosB2BSEPA=0;

  fichaPosible = {
    key: "datosGeneracion",
    activa: false
  }

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService, private translateService: TranslateService,
    private router: Router, private localStorageService: SigaStorageService) { }

  ngOnInit() {

    if (this.datos) {
      this.modoEdicion = true;
      this.nuevo = false;
      this.body = this.datos;
      this.bodyInicial = this.body;

      if(undefined!=this.datos.fechaCreacion)
        this.body.fechaCreacion= new Date(this.datos.fechaCreacion);

      if (undefined!=this.datos.fechaUltimaModificacion)
        this.body.fechaUltimaModificacion= new Date(this.datos.fechaUltimaModificacion);

      if (undefined!=this.datos.fechaPresentacion)
        this.body.fechaPresentacion= new Date(this.datos.fechaPresentacion)
      
      if (undefined!=this.datos.fechaRecibosPrimeros)
        this.body.fechaRecibosPrimeros= new Date(this.datos.fechaRecibosPrimeros)
      
      if (undefined!=this.datos.fechaRecibosRecurrentes)
        this.body.fechaRecibosRecurrentes= new Date(this.datos.fechaRecibosRecurrentes)
      
      if (undefined!=this.datos.fechaRecibosCOR)
        this.body.fechaRecibosCOR= new Date(this.datos.fechaRecibosCOR)
      
      if (undefined!=this.datos.fechaRecibosB2B)
        this.body.fechaRecibosB2B= new Date(this.datos.fechaRecibosB2B)


      this.cargaDatosSEPA(this.body.idInstitucion);
    } else {
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new FicherosAdeudosItem();
      this.bodyInicial = new FicherosAdeudosItem();

      this.cargaDatosSEPA(this.localStorageService.institucionActual);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaDatosGeneracion == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  cargaDatosSEPA(idInstitucion){
    this.progressSpinner=true;
    
    this.sigaServices.getParam("facturacionPyS_parametrosSEPA", "?idInstitucion=" + idInstitucion).subscribe(
      n => {
        let data = n.combooItems;
        
        for(let i=0; data.length>i; i++){
          
          if(data[i].value=="SEPA_DIAS_HABILES_PRIMEROS_RECIBOS"){
            this.primerosRecibosSEPA=data[i].label;

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_RECURRENTES"){
            this.recibosRecurrentesSEPA=data[i].label;

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_COR1"){
            this.recibosCORSEPA=data[i].label;

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_B2B"){
            this.recibosB2BSEPA=data[i].label;
          }
        }

        this.progressSpinner=false;
      },
      err => {
        this.progressSpinner=false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        console.log(err);
      }
    );
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
    if(campo==='fechaPresentacion')
      this.body.fechaPresentacion = event;
    else if(campo==='fechaRecibosPrimeros')
      this.body.fechaRecibosPrimeros = event;
    else if(campo==='fechaRecibosRecurrentes')
      this.body.fechaRecibosRecurrentes = event;
    else if(campo==='fechaRecibosCOR')
      this.body.fechaRecibosCOR = event;
    else if(campo==='fechaRecibosB2B')
      this.body.fechaRecibosB2B = event;
  }
}