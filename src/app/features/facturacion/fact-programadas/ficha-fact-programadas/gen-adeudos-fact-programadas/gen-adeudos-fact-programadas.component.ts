import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { ComboItem } from '../../../../../models/ComboItem';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
import { procesos_facturacionPyS } from '../../../../../permisos/procesos_facturacionPyS';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-gen-adeudos-fact-programadas',
  templateUrl: './gen-adeudos-fact-programadas.component.html',
  styleUrls: ['./gen-adeudos-fact-programadas.component.scss']
})
export class GenAdeudosFactProgramadasComponent implements OnInit, OnChanges {

  msgs: Message[] = [];
  progressSpinner: boolean = false;
  @Input() permisoEscritura: boolean;
  permisoDisqueteCargos: boolean = false;

  @Input() modoEdicion: boolean;
  @Input() openTarjetaGenAdeudos;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacFacturacionprogramadaItem>();

  @Input() bodyInicial: FacFacturacionprogramadaItem;
  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();
  ficherosAdeudos: FicherosAdeudosItem;

  resaltadoDatos: boolean = false;
  porProgramar: boolean = true;
  porConfirmar: boolean = false;
  porConfirmarError: boolean = false;
  confirmada: boolean = false;

  fechaHoy = new Date();
  minDateRecibos = new Date();
  minDateRecurrentes = new Date();
  minDateCOR1 = new Date();
  minDateB2B = new Date();

  primerosRecibosSEPA=0;
  recibosRecurrentesSEPA=0;
  recibosCORSEPA=0;
  recibosB2BSEPA=0;

  constructor(
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router,
    private sigaStorageService: SigaStorageService
  ) { }

  ngOnInit() {
    this.cargaDatosSEPA();
    this.getPermisoFicheroAdeudos(); // Permiso para la acción de NUevo FIchero Adeudos
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined) {
      this.restablecer();
      this.getFicheroAdeudos();
    }
  }

  // Permiso del menú FIchero de Adeudos
  getPermisoFicheroAdeudos() {
    this.commonsService
      .checkAcceso(procesos_facturacionPyS.disqueteCargos)
      .then((respuesta) => {
        this.permisoDisqueteCargos = respuesta;
      })
      .catch((error) => console.error(error));
  }

  // Restablecer

  restablecer(): void {
    this.body = JSON.parse(JSON.stringify(this.bodyInicial));
    this.body.fechaPresentacion = this.transformDate(this.body.fechaPresentacion);
    this.body.fechaRecibosPrimeros = this.transformDate(this.body.fechaRecibosPrimeros);
    this.body.fechaRecibosRecurrentes = this.transformDate(this.body.fechaRecibosRecurrentes);
    this.body.fechaRecibosCOR1 = this.transformDate(this.body.fechaRecibosCOR1);
    this.body.fechaRecibosB2B = this.transformDate(this.body.fechaRecibosB2B);
    this.resaltadoDatos = false;

    this.porProgramar = this.body.idEstadoConfirmacion == "20" || this.body.idEstadoConfirmacion == "2";
    this.porConfirmar = this.body.idEstadoConfirmacion == "18" || this.body.idEstadoConfirmacion == "19" || this.body.idEstadoConfirmacion == "1" || this.body.idEstadoConfirmacion == "17";
    this.porConfirmarError = this.body.idEstadoConfirmacion == "21";
    this.confirmada = this.body.idEstadoConfirmacion == "3";

  }

  // Dehabilitar guardado cuando no cambien los campos
  deshabilitarGuardado(): boolean {
    return this.notChangedDate(this.body.fechaPresentacion, this.bodyInicial.fechaPresentacion)
        && this.notChangedDate(this.body.fechaRecibosPrimeros, this.bodyInicial.fechaRecibosPrimeros)
        && this.notChangedDate(this.body.fechaRecibosRecurrentes, this.bodyInicial.fechaRecibosRecurrentes)
        && this.notChangedDate(this.body.fechaRecibosCOR1, this.bodyInicial.fechaRecibosCOR1)
        && this.notChangedDate(this.body.fechaRecibosB2B, this.bodyInicial.fechaRecibosB2B);
  }

  notChangedString(value1: string, value2: string): boolean {
    return value1 == value2 || (value1 == undefined || value1.trim().length == 0) && (value2 == undefined || value2.trim().length == 0);
  }

  notChangedDate(value1: Date, value2: Date): boolean {
    return value1 == value2 || value1 == undefined && value2 == undefined || new Date(value1).getTime() == new Date(value2).getTime();
  }

  // Guardar
  
  isValid(): boolean {
    return this.body.fechaPresentacion != undefined && this.body.fechaRecibosPrimeros != undefined
        && this.body.fechaRecibosRecurrentes != undefined && this.body.fechaRecibosCOR1 != undefined
        && this.body.fechaRecibosB2B != undefined;
  }

  checkSave(): void {
    this.msgs = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (this.msgs == undefined && this.isValid() && !this.deshabilitarGuardado()) {
      this.body.esDatosGenerales = false;
      this.guardadoSend.emit(this.body);
    } else if (this.msgs == undefined) {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  getFicheroAdeudos() {
    let filtros = { 
      idprogramacion: this.body.idProgramacion,
      idseriefacturacion: this.body.idSerieFacturacion
    };

    this.progressSpinner = true;
    this.sigaServices.post("facturacionPyS_getFicherosAdeudos", filtros).subscribe(
      n => {
        let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosAdeudosItems;
        if (results != undefined && results.length != 0) {
          this.ficherosAdeudos = results[0];
        }

        this.progressSpinner = false;
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        this.progressSpinner = false;
      }
    );
  }

  generarFicheroAdeudos(): void {
    this.msgs = this.commonsService.checkPermisos(this.permisoEscritura, undefined);

    if (this.msgs == undefined && this.isValid() && !this.ficherosAdeudos) {
      let ficheroAdeudos = new FicherosAdeudosItem();
      ficheroAdeudos.idseriefacturacion = this.body.idSerieFacturacion;
      ficheroAdeudos.idprogramacion = this.body.idProgramacion;
      ficheroAdeudos.fechaPresentacion = this.body.fechaPresentacion;
      ficheroAdeudos.fechaRecibosPrimeros = this.body.fechaRecibosPrimeros;
      ficheroAdeudos.fechaRecibosRecurrentes = this.body.fechaRecibosRecurrentes;
      ficheroAdeudos.fechaRecibosCOR = this.body.fechaRecibosCOR1;
      ficheroAdeudos.fechaRecibosB2B = this.body.fechaRecibosB2B;

      sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficheroAdeudos));
      sessionStorage.setItem("Nuevo", JSON.stringify(true));

      this.router.navigate(['/gestionAdeudos']);  
    } else if (this.msgs == undefined) {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
    
  }

  navigateToFicheroAdeudos() {
    if (this.ficherosAdeudos) {
      sessionStorage.setItem("facturacionProgramadaItem", JSON.stringify(this.bodyInicial));
      sessionStorage.setItem("volver", "true");

      sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(this.ficherosAdeudos));
      this.router.navigate(["/gestionAdeudos"]);
    }
  }

  cargaDatosSEPA(){
    this.progressSpinner=true;
    
    this.sigaServices.get("facturacionPyS_parametrosSEPA").subscribe(
      n => {
        let data = n.combooItems;
        
        for(let i=0; data.length>i; i++){
          
          if(data[i].value=="SEPA_DIAS_HABILES_PRIMEROS_RECIBOS"){
            this.primerosRecibosSEPA = parseFloat(data[i].label);
            this.minDateRecibos = new Date(this.fechaHoy.getTime()+(this.primerosRecibosSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_RECURRENTES"){
            this.recibosRecurrentesSEPA = parseFloat(data[i].label);
            this.minDateRecurrentes = new Date(this.fechaHoy.getTime()+(this.recibosRecurrentesSEPA*24*60*60*1000));

          }else if(data[i].value=="SEPA_DIAS_HABILES_RECIBOS_COR1"){
            this.recibosCORSEPA = parseFloat(data[i].label);
            this.minDateCOR1 = new Date(this.fechaHoy.getTime()+(this.recibosCORSEPA*24*60*60*1000));

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

  // OnChange de las fechas
  fillFecha(event, campo) {
    if(campo==='fechaPresentacion'){
      this.body.fechaPresentacion = event;
      
      if (this.body.fechaPresentacion) {
        this.body.fechaRecibosPrimeros = new Date(this.body.fechaPresentacion.getTime()+(this.primerosRecibosSEPA*24*60*60*1000));
        this.minDateRecibos = this.body.fechaRecibosPrimeros;

        this.body.fechaRecibosRecurrentes = new Date(this.body.fechaPresentacion.getTime()+(this.recibosRecurrentesSEPA*24*60*60*1000));
        this.minDateRecurrentes = this.body.fechaRecibosRecurrentes;

        this.body.fechaRecibosCOR1 = new Date(this.body.fechaPresentacion.getTime()+(this.recibosCORSEPA*24*60*60*1000));
        this.minDateCOR1 = this.body.fechaRecibosCOR1;

        this.body.fechaRecibosB2B = new Date(this.body.fechaPresentacion.getTime()+(this.recibosB2BSEPA*24*60*60*1000));
        this.minDateB2B = this.body.fechaRecibosB2B;
      }

    }else if(campo==='fechaRecibosPrimeros'){
      this.body.fechaRecibosPrimeros = event;
    
    }else if(campo==='fechaRecibosRecurrentes'){
      this.body.fechaRecibosRecurrentes = event;
    
    }else if(campo==='fechaRecibosCOR1'){
      this.body.fechaRecibosCOR1 = event;
    
    }else if(campo==='fechaRecibosB2B'){
      this.body.fechaRecibosB2B = event;
    }
  }
  

  // Transformar fecha
  transformDate(fecha) {
    if (fecha != undefined)
      fecha = new Date(fecha);
    else
      fecha = null;
    // fecha = this.datepipe.transform(fecha, 'dd/MM/yyyy');
    return fecha;
  }

  // Estilo obligatorio
  styleObligatorio(evento: Date) {
    if (this.resaltadoDatos && (evento == undefined || evento == null)) {
      return this.commonsService.styleObligatorio(evento);
    }
  }

  // Abrir y cerrar la ficha

  esFichaActiva(): boolean {
    return this.openTarjetaGenAdeudos;
  }

  abreCierraFicha(key): void {
    this.openTarjetaGenAdeudos = !this.openTarjetaGenAdeudos;
    this.opened.emit(this.openTarjetaGenAdeudos);
    this.idOpened.emit(key);
  }

  // Mensajes en pantalla

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

}
