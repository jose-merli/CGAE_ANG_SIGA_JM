import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ComboItem } from '../../../../../models/ComboItem';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-datos-generales-detalle-soj',
  templateUrl: './datos-generales-detalle-soj.component.html',
  styleUrls: ['./datos-generales-detalle-soj.component.scss']
})
export class DatosGeneralesDetalleSojComponent implements OnInit, OnChanges {

  progressSpinner: boolean = false;
  msgs: any[];

  modoEdicion: boolean = true;

  comboTipoSOJ: ComboItem[] = [];
  comboTipoSOJColegio: ComboItem[] = [];
  comboTipoConsulta: ComboItem[] = [];
  comboTipoRespuesta: ComboItem[] = [];

  body: FichaSojItem;
  @Input() bodyInicial: FichaSojItem;

  @Output() modoEdicionSend = new EventEmitter<any>();

  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices
  ) { }

  ngOnInit() {
    if (this.bodyInicial != undefined) {
      this.initBody();
    }
    
    this.getCombos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.bodyInicial != undefined) {
      this.initBody();
    }
  }

  initBody(): void {
    if (this.bodyInicial.fechaApertura != undefined) {
      this.bodyInicial.fechaApertura = new Date(this.bodyInicial.fechaApertura);
    }

    this.body = new FichaSojItem();
    Object.assign(this.body, this.bodyInicial);
  }

  getCombos(): void {
    this.progressSpinner = true;

    Observable.zip(
      this.getComboTipoSoj(),
      this.getComboTipoSojColegio(),
      this.getComboTipoConsulta(),
      this.getComboTipoRespuesta()
    ).subscribe(() => this.progressSpinner = false, () => this.progressSpinner = false);
  }

  getComboTipoSoj(): Observable<any> {
    return this.sigaServices.get('combo_comboTipoSOJ').pipe(
      tap(data => {
        this.comboTipoSOJ = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoSOJ);
      }),
      catchError(err => Observable.of("Error"))
    );
  }

  getComboTipoSojColegio(): Observable<any> {
    return this.sigaServices.get('combo_comboTipoSOJColegio').pipe(
      tap(data => {
        this.comboTipoSOJColegio = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoSOJColegio);
      }),
      catchError(err => Observable.of("Error"))
    );
  }

  getComboTipoConsulta(): Observable<any> {
    return this.sigaServices.get('combo_comboTipoConsulta').pipe(
      tap(data => {
        this.comboTipoConsulta = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoConsulta);
      }),
      catchError(err => Observable.of("Error"))
    );
  }

  getComboTipoRespuesta(): Observable<any> {
    return this.sigaServices.get('combo_comboTipoRespuesta').pipe(
      tap(data => {
        this.comboTipoRespuesta = data.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoRespuesta);
      }),
      catchError(err => Observable.of("Error"))
    );
  }

  fillFechaApertura(event) {

  }

  deshabilitarGuardado(): boolean {
    return this.body == undefined || this.compareFieldsBody('anio', 'numero', 'idTipoSoj', 
      'idTipoSojColegio', 'fechaApertura', 'tipoConsulta', 'tipoRespuesta', 'descripcionConsulta', 
      'respuestaLetrado');
  }

  compareFieldsBody(...fields: string[]) {
    let res = true;
    for (const fieldName of fields) {
      if (this.body[fieldName] !== this.bodyInicial[fieldName]) {
        res = false;
        break;
      }
    }
    return res;
  }

  restablecer() {
    this.body = new FichaSojItem();
    Object.assign(this.body, this.bodyInicial);
  }

  checkSave() {
    this.modoEdicionSend.emit(this.body);
  }

  clear() {
    this.msgs = [];
  }

  testCombos() {
    const values: ComboItem[] = [
      { value: '1', label: 'Combo Item 1', local: undefined },
      { value: '2', label: 'Combo Item 2', local: undefined },
      { value: '3', label: 'Combo Item 3', local: undefined },
      { value: '4', label: 'Combo Item 111111 2222222', local: undefined }
    ];

    this.comboTipoSOJ = values;
    this.comboTipoSOJColegio = values;
    this.comboTipoConsulta = values;
    this.comboTipoRespuesta = values;
  }

}