
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { JusticiableTelefonoItem } from '../../../../../models/sjcs/JusticiableTelefonoItem';
import { CommonsService } from '../../../../../_services/commons.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { TranslateService } from '../../../../../commons/translate';
import { JusticiableBusquedaItem } from '../../../../../models/sjcs/JusticiableBusquedaItem';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit, OnChanges {

  msgs;
  bodyInicial;
  bodyInicialTelefonos;
  direccionPostal: String = "";
  resultadosPoblaciones: String = "";
  progressSpinner: boolean = true;
  permisoEscritura: boolean = true;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  modoEdicion: boolean = false;
  validateForm: boolean = true;
  hasChange: boolean = false;
  
  comboTipoVia;
  comboPais;
  comboProvincia;
  comboPoblacion;

  @Input() showTarjeta;
  @Input() body: JusticiableItem;
  @Output() bodyChange = new EventEmitter<JusticiableItem>();
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<String>();

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService) { }

  async ngOnInit() {
    this.progressSpinner = true;
    this.modoEdicion = false;
    this.body = new JusticiableItem();
    this.body.idpaisdir1 = "191";
    await this.getCombos();
  }

  async callServiceSearch() {
    if (sessionStorage.getItem("justiciableDatosPersonalesSearch")) {
      this.progressSpinner = true;
      let justiciableBusqueda: JusticiableBusquedaItem  = JSON.parse(sessionStorage.getItem("justiciableDatosPersonalesSearch"));
      sessionStorage.removeItem("justiciableDatosPersonalesSearch");

      await this.sigaServices.post("gestionJusticiables_searchJusticiable", justiciableBusqueda).subscribe(
        n => {
          this.body = JSON.parse(n.body).justiciable;
          if (this.body.telefonos == null || (this.body.telefonos != null && this.body.telefonos.length == 0)) {
            this.addTelefono();
          } 
          this.bodyInicial = {...this.body};
          this.bodyInicialTelefonos = JSON.parse(JSON.stringify(this.body.telefonos));
          this.modoEdicion = true;
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
        });
    }
  }

  ngAfterViewInit() {
    this.callServiceSearch();
  }

  ngOnChanges(changes: SimpleChanges) {   
    if (this.body != undefined && this.body.idpersona != undefined) {
      if (this.body.telefonos == null || (this.body.telefonos != null && this.body.telefonos.length == 0)) {
        this.addTelefono();
      } 

      this.bodyInicial = {...this.body};
      this.bodyInicialTelefonos = JSON.parse(JSON.stringify(this.body.telefonos));

      if (this.body.idpersona != undefined) {
        this.modoEdicion = true;
      }
    }
  }

  private async getCombos() {
    await this.getComboPais();
    await this.getComboTipoVia();
    await this.getComboProvincia();
  }

  private getComboTipoVia() {
    this.sigaServices.getParam("gestionJusticiables_comboTipoVias2", "?idTipoViaJusticiable=" + this.body.idtipovia).subscribe(
      n => {
        this.comboTipoVia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboTipoVia);
      }
    );
  }

  private getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
        this.comboPais.push({ label: "DESCONOCIDO", value: "D" });
        this.commonsService.arregloTildesCombo(this.comboPais);
      }
    );
  }

  private getComboProvincia() {
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboProvincia);
        if (this.body.idprovincia != undefined && this.body.idprovincia != null && this.body.idprovincia != "") {
          this.getComboPoblacion("-1");
          this.isDisabledPoblacion = false;
        } else{
          this.rellenarDireccionPostal();
          this.progressSpinner = false;
        }
      }
    );
  }

  private getComboPoblacion(filtro: string) {
    this.sigaServices.getParam("direcciones_comboPoblacion", "?idProvincia=" + this.body.idprovincia + "&filtro=" + filtro).subscribe(
        n => {
          this.comboPoblacion = n.combooItems;
          this.commonsService.arregloTildesCombo(this.comboPoblacion);
          this.rellenarDireccionPostal();
          this.progressSpinner = false;
        }
      );
  }

  /**** CHANGES ****/

  onChangeCodigoPostal() {
    if (this.commonsService.validateCodigoPostal(this.body.codigopostal) && this.body.codigopostal.length == 5) {
      let value = this.body.codigopostal.substring(0, 2);
      this.isDisabledPoblacion = false;
      if (value != this.body.idprovincia) {
        this.body.idprovincia = value;
        this.body.idpoblacion = "";
        this.comboPoblacion = [];
        this.getComboPoblacion("-1");
      }
    } else {
      this.isDisabledPoblacion = true;
      this.body.idpoblacion = undefined;
      this.body.idprovincia = undefined;
    }
    this.hasChange = true;
  }

  onChangeInput(event){
    this.hasChange = true;
  }

  editarCompleto(event, dato) {
    let NUMBER_REGEX = /^\d{1,5}$/;
    if (NUMBER_REGEX.test(dato)) {
      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.body.codigopostal = event.currentTarget.value.slice(0, 5);
      }
    } else {
      if (dato != null && dato != undefined && (dato < 0 || dato > 99999)) {
        this.body.codigopostal = event.currentTarget.value.slice(0, 5);
      } else {
        this.body.codigopostal = "";
        event.currentTarget.value = "";
      }
    }
  }

  reset(){
    if (this.modoEdicion) {
      if (this.bodyInicial != undefined) {
        this.body = {...this.bodyInicial};
        this.body.telefonos = [];
        if (typeof this.bodyInicialTelefonos == 'string') {
          this.body.telefonos = JSON.parse(this.bodyInicialTelefonos);
        } else {
          this.body.telefonos = JSON.parse(JSON.stringify(this.bodyInicialTelefonos));
        }
      }
    } else {
      this.body = new JusticiableItem();
      this.body.telefonos = [];
      this.body.telefonos[0] = new JusticiableTelefonoItem();
      this.body.idpaisdir1 = "191";
    }
    this.hasChange = false;
  }

  save(){
    if (!this.validate()) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Campos obligatorios no se han rellando");
    } else {
      if (this.validateEmail()) {
        this.progressSpinner = true;
        this.deleteSpacing();
        if(this.body.telefonos != null && this.body.telefonos.length > 0){
          this.body.telefonos = this.body.telefonos.filter(t => t.numeroTelefono && t.numeroTelefono.trim() !== '');
        }
        if (!this.modoEdicion) {
          this.callSaveService("gestionJusticiables_createJusticiable");
        } else {
          this.callSaveService("gestionJusticiables_updateJusticiableDatosPersonales");
        }
      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El correo electrónico no tiene un formato válido");
      }
    }
  }

  deleteSpacing() {
    if (this.body.direccion != null && this.body.direccion != undefined) {
      this.body.direccion = this.body.direccion.trim();
    }
    if (this.body.escaleradir != null && this.body.escaleradir != undefined) {
      this.body.escaleradir = this.body.escaleradir.trim();
    }
    if (this.body.pisodir != null && this.body.pisodir != undefined) {
      this.body.pisodir = this.body.pisodir.trim();
    }
    if (this.body.puertadir != null && this.body.puertadir != undefined) {
      this.body.puertadir = this.body.puertadir.trim();
    }
    if (this.body.correoelectronico != null && this.body.correoelectronico != undefined) {
      this.body.correoelectronico = this.body.correoelectronico.trim();
    }
    if (this.body.fax != null && this.body.fax != undefined) {
      this.body.fax = this.body.fax.trim();
    }
    if(this.body.telefonos != null && this.body.telefonos.length > 0){
      for(let i = 0; i < this.body.telefonos.length; i++){
        this.body.telefonos[i].preferenteSms = '0';
        if(this.body.telefonos[i].preferenteSmsCheck){
          this.body.telefonos[i].preferenteSms = '1';
        }
      }
    }
  }

  callSaveService(url) {
    this.sigaServices.post(url, this.body).subscribe(
      data => {
        let dataJusticiable = JSON.parse(data.body);
        if (dataJusticiable.error.message != "C") {
          if (!this.modoEdicion) {
            this.modoEdicion = true;
            this.body.idpersona =  dataJusticiable.id;
          } 
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        }
        this.bodyInicial = {...this.body};
        this.bodyInicialTelefonos = JSON.stringify(this.body.telefonos);
        this.rellenarDireccionPostal();
        this.hasChange = false;
        this.bodyChange.emit(this.body);
        this.progressSpinner = false;
      },
      err => {
        let dataJusticiable = JSON.parse(err.error);
        if (dataJusticiable.error.description != "") {
          if (err.error != undefined && JSON.parse(err.error).error.code == "600") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), dataJusticiable.error.description);
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(dataJusticiable.error.description));
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      }
    );
  }

  rellenarDireccionPostal() {
    if (this.body.direccion != undefined && this.body.direccion != null) {
      this.comboTipoVia.forEach(element => { if (element.value == this.body.idtipovia) this.direccionPostal = element.label; });
      this.direccionPostal = this.direccionPostal + ' ' + this.body.direccion;
      this.direccionPostal = this.direccionPostal + ', ' + this.body.codigopostal;
      if(this.comboPoblacion != undefined){
        this.comboPoblacion.forEach(element => { if (element.value == this.body.idpoblacion) this.direccionPostal = this.direccionPostal + ', ' + element.label; });
      }
      this.comboProvincia.forEach(element => { if (element.value == this.body.idprovincia) this.direccionPostal = this.direccionPostal + ', ' + element.label; });
      this.progressSpinner = false;
    }
  }

  /**
   * Valida el email cuando su campo no está vacío
   */
  private validateEmail() {
    let pattern: RegExp  = /^[a-zA-Z0-9\+\._-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)?\.[a-zA-Z]+$/;
    //Email vacio no se valida. En caso contrario, si
    return (!this.body.correoelectronico || pattern.test(this.body.correoelectronico));
  }

  /**
   * Valida los campos obligatorios 
   */
  private validateRequiredFields() {
    return this.body.idtipovia && this.body.direccion && this.body.codigopostal && this.body.idprovincia && this.body.idpoblacion;
  }

  private validate() {
    let isValid = true;

    // Solo validar la dirección si 'No Informada' no está marcado.
    if (!this.body.direccionNoInformada) {
      if (!this.body.direccion || this.body.direccion.trim() === "") {
        console.log('Falla validación de dirección');
        isValid = false;
      }
    }
  
    // Estos campos deben ser validados independientemente del estado de 'No Informada'
    if (!this.body.idtipovia || this.body.idtipovia.trim() === "" ||
        !this.body.codigopostal || this.body.codigopostal.trim() === "" ||
        !this.body.idprovincia || this.body.idprovincia.trim() === "" ||
        !this.body.idpoblacion || this.body.idpoblacion.trim() === "") {
      console.log('Falla validación de otros campos necesarios');
      isValid = false;
    }
  
    console.log('Validación final:', isValid);
    this.validateForm = isValid;
    return this.validateForm;
}

  
  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = this.translateService.instant("formacion.busquedaCursos.controlFiltros.minimoCaracteres");
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  styleObligatorio(evento){
    if(!this.validateForm){
      return this.commonsService.styleObligatorio(evento);
    }
  }

  /***** TARJETA *******/
  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta; // Funcionalidad para mostrar contenido de la Tarjeta pulsando a la misma.
    this.opened.emit(this.showTarjeta);   // Emit donde pasamos el valor de la Tarjeta Personales.
    this.idOpened.emit('Personales'); // Constante para abrir la Tarjeta de Personales.
  }

  /**** TELEFONO ****/
  addTelefono() {
    if(this.body.telefonos == null){
      this.body.telefonos = [];
    }
    this.body.telefonos.push(new JusticiableTelefonoItem());
    this.hasChange = true;
  }

  deleteTelefono(index: number) {
    if (this.body.telefonos.length == 1) {
      this.body.telefonos[0] = new JusticiableTelefonoItem();
    } else {
      this.body.telefonos.splice(index, 1);
    }
    this.hasChange = true;
  }

  /**** MSGS  *****/
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
}
