import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Message } from 'primeng/api';
import { FacFacturacionprogramadaItem } from '../../../../../models/FacFacturacionprogramadaItem';
import { CommonsService } from '../../../../../_services/commons.service';

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
    private commonsService: CommonsService
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
  styleObligatorio(evento: string) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento.trim() == "")) {
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
