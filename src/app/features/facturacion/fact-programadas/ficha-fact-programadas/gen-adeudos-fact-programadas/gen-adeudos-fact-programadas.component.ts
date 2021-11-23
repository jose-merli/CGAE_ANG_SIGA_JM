import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../commons/translate';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { FicherosAdeudosItem } from '../../../../../models/sjcs/FicherosAdeudosItem';
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

  @Input() modoEdicion: boolean;
  @Input() openTarjetaGenAdeudos;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Output() guardadoSend = new EventEmitter<FacFacturacionprogramadaItem>();

  @Input() bodyInicial: FacFacturacionprogramadaItem;
  body: FacFacturacionprogramadaItem = new FacFacturacionprogramadaItem();

  resaltadoDatos: boolean = false;

  constructor(
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.bodyInicial != undefined)
      this.restablecer();
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
  }

  isValid(): boolean {
    return this.body.fechaPresentacion != undefined && this.body.fechaRecibosPrimeros != undefined
        && this.body.fechaRecibosRecurrentes != undefined && this.body.fechaRecibosCOR1 != undefined
        && this.body.fechaRecibosB2B != undefined;
  }

  checkSave(): void {
    if (this.isValid()) {
      this.guardadoSend.emit(this.body);
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  navigateToFicheroAdeudos() {
    let filtros = { idProgramacion: this.body.idProgramacion };

    this.sigaServices.post("facturacionPyS_getFicherosAdeudos", filtros).subscribe(
      n => {
        let results: FicherosAdeudosItem[] = JSON.parse(n.body).ficherosAdeudosItems;
        if (results != undefined && results.length != 0) {
          let ficherosAdeudosItem: FicherosAdeudosItem = results[0];

          sessionStorage.setItem("facturacionProgramadaItem", JSON.stringify(this.bodyInicial));
          sessionStorage.setItem("volver", "true");

          sessionStorage.setItem("FicherosAdeudosItem", JSON.stringify(ficherosAdeudosItem));
          this.router.navigate(["/gestionAdeudos"]);
        }
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  // OnChange de las fechas

  fillFechaPresentacion(event) {
    this.body.fechaPresentacion = event;
  }

  fillFechaRecibosPrimeros(event) {
    this.body.fechaRecibosPrimeros = event;
  }
  
  fillFechaRecibosRecurrentes(event) {
    this.body.fechaRecibosRecurrentes = event;
  }
  
  fillFechaRecibosCOR1(event) {
    this.body.fechaRecibosCOR1 = event;
  }

  fillFechaRecibosB2B(event) {
    this.body.fechaRecibosB2B = event;
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
