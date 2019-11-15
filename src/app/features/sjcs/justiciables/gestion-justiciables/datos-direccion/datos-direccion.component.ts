
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';

@Component({
  selector: 'app-datos-direccion',
  templateUrl: './datos-direccion.component.html',
  styleUrls: ['./datos-direccion.component.scss']
})
export class DatosDireccionComponent implements OnInit {

  body: JusticiableItem = new JusticiableItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  generalBody: any;
  comboTipo;
  datos: any[] = [];
  selectedDatos;
  cols;

  @Output() modoEdicionSend = new EventEmitter<any>();

  //Resultados de la busqueda
  @Input() item: any;
  @Input() showTarjeta;

  comboPais;
  comboProvincia;
  poblacionBuscada;
  comboPoblacion;
  provinciaSelecionada;
  isDisabledPoblacion;
  isDisabledProvincia;
  codigoPostalValido;
  poblacionExtranjera;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnChanges(changes: SimpleChanges) {
  }


  ngOnInit() {

    this.getCombos();
    // if (this.item != undefined) {

    // this.item = new item();
    if (this.item != undefined) {
      this.body = this.item;
      this.bodyInicial = JSON.parse(JSON.stringify(this.item));
    } else {
      // this.item = new item();
    }
    if (this.body == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.cols = [
      { field: 'tipo', header: this.translateService.instant("censo.busquedaClientesAvanzada.literal.tipoCliente") },
      { field: 'valor', header: this.translateService.instant("administracion.parametrosGenerales.literal.valor") }
    ]
  }

  ngAfterViewInit() {
  }

  rest() {
    // if (this.modoEdicion) {
    //   if (this.bodyInicial != undefined) this.item = JSON.parse(JSON.stringify(this.bodyInicial));
    // } else {
    //   this.item = new item();
    // }
  }

  getCombos() {
    this.getComboPais();
  }

  getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboPais);

      },
      error => { }
    );
  }

  getComboProvincia() {
    // Combo de identificación
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincia);
      },
      error => { },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  getComboPoblacion(filtro: string) {
    this.progressSpinner = true;
    this.poblacionBuscada = this.getLabelbyFilter(filtro);

    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" +
        this.body.idprovincia +
        "&filtro=" +
        this.poblacionBuscada
      )
      .subscribe(
        n => {
          this.comboPoblacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPoblacion)

        },
        error => {
          this.progressSpinner = false;

        }, () => {
          this.progressSpinner = false;

        }
      );
  }

  onChangeCodigoPostal() {
    if (this.body.idpais == "191") {
      if (
        this.commonsService.validateCodigoPostal(this.body.codigopostal) &&
        this.body.codigopostal.length == 5) {
        let value = this.body.codigopostal.substring(0, 2);
        this.provinciaSelecionada = value;
        this.isDisabledPoblacion = false;
        if (value != this.body.idprovincia) {
          this.body.idprovincia = this.provinciaSelecionada;
          this.body.idpoblacion = "";
          this.comboPoblacion = [];
          this.isDisabledProvincia = true;
        }
        this.codigoPostalValido = true;
      } else {
        this.codigoPostalValido = false;
        this.isDisabledPoblacion = true;
        this.provinciaSelecionada = "";
      }
    }
  }

  onChangeProvincia() {
    this.body.idpoblacion = "";
    this.comboPoblacion = [];
  }

  getLabelbyFilter(string): string {
    /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
para poder filtrar el dato con o sin estos caracteres*/
    let labelSinTilde = string;
    let accents =
      "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
    let accentsOut =
      "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    let i;
    let x;
    for (i = 0; i < string.length; i++) {
      if ((x = accents.indexOf(string.charAt(i))) != -1) {
        labelSinTilde = string.replace(string.charAt(i), accentsOut[x]);
        return labelSinTilde;
      }
    }

    return labelSinTilde;
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0)
      return false;
    else return true;
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  disabledSave() {
    // if (this.item.nombreArea != undefined) this.item.nombreArea = this.item.nombreArea.trim();
    // if (this.item.nombreArea != "" && (JSON.stringify(this.item) != JSON.stringify(this.bodyInicial))) {
    //   return false;
    // } else {
    //   return true;
    // }
  }

  newData() {
    let dato = {
      tipo: "",
      valor: ""
    }
    this.datos.push(dato);
  }


  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }

}
