import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ComboItem } from '../../../../../models/ComboItem';
import { FichaSojItem } from '../../../../../models/sjcs/FichaSojItem';
import { Observable } from 'rxjs/Observable';
import { tap, catchError } from 'rxjs/operators';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';

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
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() restablecerDatos = new EventEmitter<any>();


  constructor(
    private commonsService: CommonsService,
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.body = new FichaSojItem();
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
    
    Object.assign(this.body, this.bodyInicial);
    // RellenarCombosEnTarjetaResumen.
    this.rellenarCombosTarjetaResumen();
  }

  rellenarCombosTarjetaResumen() {
    this.comboTipoSOJ.forEach(element => {
      if (element.value == this.body.idTipoSoj) {
        this.body.descripcionTipoSoj = element.label.toString();
      }
    });
    this.comboTipoSOJColegio.forEach(element => {
      if (element.value == this.body.idTipoSojColegio) {
        this.body.descripcionTipoSojColegio = element.label.toString();
      }
    });

    if (this.body.descripcionTipoSoj != undefined ||
      this.body.descripcionTipoSojColegio != undefined) {
        this.modoEdicionSend.emit(this.body);
    }
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
    this.body.fechaApertura = event;
  }

  deshabilitarGuardado(): boolean {
    if(this.body == undefined || this.bodyInicial == undefined){
      return true;
    }else{
      return this.compareFieldsBody('anio', 'numero', 'idTipoSoj',
        'idTipoSojColegio', 'fechaApertura', 'tipoConsulta', 'tipoRespuesta', 'descripcionConsulta',
        'respuestaLetrado');
    }
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
    // Restablecer Datos de la Base de Datos.
    if (sessionStorage.getItem("sojItemLink")) {
      sessionStorage.setItem("sojItemLink", JSON.stringify(this.body));
      this.restablecerDatos.emit(this.body);
    }
    //this.body = new FichaSojItem();
    //Object.assign(this.body, this.bodyInicial);
  }

  checkSave() {
    // Insertar Cambios de Datos SOJ.
    this.sigaServices.post("detalleSoj_guardarDatosGenerales", this.body).subscribe(
      n => {

        if (n.statusText == "OK") {
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          // Actualizamos la informacion en el body de la pantalla
          this
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }

      },
      err => {
        this.progressSpinner = false;
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );



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

  showMessage(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

}