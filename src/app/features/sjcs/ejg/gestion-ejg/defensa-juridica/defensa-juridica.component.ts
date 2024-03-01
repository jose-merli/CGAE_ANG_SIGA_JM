import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-defensa-juridica',
  templateUrl: './defensa-juridica.component.html',
  styleUrls: ['./defensa-juridica.component.scss']
})
export class DefensaJuridicaComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() openTarjetaDefensaJuridica: boolean = false;
  @Input() permisoEscritura: boolean = false;
  @Output() crearDesignacion = new EventEmitter<any>();
  @Output() guardadoSend = new EventEmitter<any>();

  progressSpinner: boolean = false;

  datosIniciales : EJGItem = new EJGItem();
  msgs: Message[] = [];
  delitos: any = [];
  parametroNProc;
  parametroNIG;
  resumen: any = {
    numero: "",
    juzgado: "",
    procedimiento: "",
    calidad: ""
  };

  comboJuzgado = [];
  comboProcedimiento = [];
  comboComisaria = [];
  comboPreceptivo = [];
  comboRenuncia = [];
  comboSituacion = [];
  comboCalidad = [];
  comboDelitos = [];

  constructor(private sigaServices: SigaServices, private commonsServices: CommonsService,
    private translateService: TranslateService, private router: Router, private persistenceService: PersistenceService) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.datosIniciales = {...this.datos};
    if(this.datos.delitosSeleccionados != undefined && this.datos.delitosSeleccionados != null && this.datos.delitosSeleccionados != ""){
      this.delitos = this.datos.delitosSeleccionados.split(',');
    }
    this.getNprocValidador();
    this.getNigValidador();
    this.getComboJuzgado();
    this.getComboCDetencion();
    this.getComboPreceptivo();
    this.getComboRenuncia();
    this.getComboSituaciones();
    this.getComboCalidad();
    this.getComboDelitos();
    this.getComboProcedimiento();
  }

  abreCierraFicha(){
    this.openTarjetaDefensaJuridica = !this.openTarjetaDefensaJuridica;
  }

  clear() {
    this.msgs = [];
  }

  onChangeJuzgado() {
    this.comboProcedimiento = [];
    this.datos.procedimiento = null;
    this.getComboProcedimiento();
  }

  rest(){
    this.datos = {...this.datosIniciales};
    if(this.datos.delitosSeleccionados != undefined && this.datos.delitosSeleccionados != null && this.datos.delitosSeleccionados != ""){
      this.delitos = this.datos.delitosSeleccionados.split(',');
    }else{
      this.delitos = [];
    }
  }

  save() {
    if (!this.permisoEscritura) {
      this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.noTienePermisosRealizarAccion'));
    } else if (!this.validarNProcedimiento(this.datos.procedimiento)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido"));
    } else if (!this.validarNig(this.datos.nig)) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido"));
    } else {
      this.progressSpinner = true;
      this.datos.delitosSeleccionados = this.delitos.toString();
      this.sigaServices.post("gestionejg_updateDatosJuridicos", this.datos).subscribe(
        n => {
          if (n.statusText == "OK") {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.datosIniciales = {...this.datos};
            this.updateResumen();
            this.guardadoSend.emit(this.datos);
          }else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  }

  asociarDes() {
    if (!this.permisoEscritura) {
      this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.noTienePermisosRealizarAccion'));
    } else {
      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("radioTajertaValue", 'des');
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  createDes() {
    if (!this.permisoEscritura) {
      this.showMessage('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant('general.message.noTienePermisosRealizarAccion'));
    } else {
      this.crearDesignacion.emit();
    }
  }

  private validarNProcedimiento(nProcedimiento) {
    let ret = true;
    if (nProcedimiento != null && nProcedimiento != '' && this.parametroNProc != undefined) {
      if (this.parametroNProc != null && this.parametroNProc.parametro != "") {
          let valorParametroNProc: RegExp = new RegExp(this.parametroNProc.parametro);
          if (nProcedimiento != '') {
            if(!valorParametroNProc.test(nProcedimiento)){
              ret = false;
            }
          }
        }
    }
    return ret;
  }

  private validarNig(nig) {
    let ret = true;
    if (nig != null && nig != '' && this.parametroNIG != undefined) {
      if (this.parametroNIG != null && this.parametroNIG.parametro != "") {
          let valorParametroNIG: RegExp = new RegExp(this.parametroNIG.parametro);
          if (nig != '') {
            if(!valorParametroNIG.test(nig)){
              ret = false;
            }
          }
      }
    }
    return ret;
  }

  private updateResumen(){

    if(this.datosIniciales.procedimiento != null){
      this.resumen.numero = this.datosIniciales.procedimiento
    } else{
      this.resumen.numero = this.datosIniciales.numerodiligencia
    }

    if(this.datosIniciales.juzgado != null){
      if(this.datosIniciales.juzgado != null){
        this.comboJuzgado.forEach(element => {
          if (element.value == this.datosIniciales.juzgado){ this.resumen.juzgado = element.label; } 
        });
      }
    }else{
      if(this.datosIniciales.comisaria != null){
        this.comboComisaria.forEach(element => {
          if (element.value == this.datosIniciales.comisaria){ this.resumen.juzgado = element.label; }
        });
      }
    }

    if(this.datosIniciales.calidad != null){
      this.comboCalidad.forEach(element => {
        if (element.value == this.datosIniciales.calidad){ this.resumen.calidad = element.label; }
      });
    }

    if(this.datosIniciales.idPretension != null){
      this.comboProcedimiento.forEach(element => {
        if (element.value == this.datosIniciales.idPretension){ this.resumen.procedimiento = element.label; }
      });
    }
  }

  private getComboJuzgado() {
    if (this.datos.juzgado == null || this.datos.juzgado == undefined) {
      this.datos.juzgado = '0';
    }
    this.sigaServices.post("combo_comboJuzgadoDesignaciones", this.datos.juzgado).subscribe(
      n => {
        this.comboJuzgado = JSON.parse(n.body).combooItems;
        this.commonsServices.arregloTildesCombo(this.comboJuzgado);
      }
    );
  }

  private getComboCDetencion() {
    this.sigaServices.get("gestionejg_comboCDetencion").subscribe(
      n => {
        this.comboComisaria = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboComisaria);
      }
    );
  }
  
  private getComboPreceptivo() {
    this.sigaServices.get("filtrosejg_comboPreceptivo").subscribe(
      n => {
        this.comboPreceptivo = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPreceptivo);
      }
    );
  }

  private getComboRenuncia() {
    this.sigaServices.get("filtrosejg_comboRenuncia").subscribe(
      n => {
        this.comboRenuncia = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboRenuncia);
      }
    );
  }

  private getComboSituaciones() {
    this.sigaServices.get("gestionejg_comboSituaciones").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboSituacion);
      }
    );
  }

  private getComboCalidad() {
    this.sigaServices.get("gestionejg_comboTipoencalidad").subscribe(
      n => {
        this.comboCalidad = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboCalidad);
      }
    );
  }

  private getComboDelitos() {
    this.sigaServices.get("gestionejg_comboDelitos").subscribe(
      n => {
        this.comboDelitos = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboDelitos);
      }
    );
  }

  private getComboProcedimiento(){
    let parametro = {valor: "CONFIGURAR_COMBO_DESIGNA"};
    this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
        data => {
          let valorParametro = JSON.parse(data.body).parametro;
          if (valorParametro == 1 || valorParametro == 2 || valorParametro == 4) {
            this.sigaServices.post("combo_comboProcedimientosConJuzgadoEjg", this.datos).subscribe(
              n => {
                this.comboProcedimiento = JSON.parse(n.body).combooItems;
                this.commonsServices.arregloTildesCombo(this.comboProcedimiento);
                this.updateResumen();
                this.progressSpinner = false;
              }, err => { this.progressSpinner = false; }
            );
          } else {
            this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
              n => {
                this.comboProcedimiento = n.combooItems;
                this.commonsServices.arregloTildesCombo(this.comboProcedimiento);
                this.updateResumen();
                this.progressSpinner = false;
              }, err => { this.progressSpinner = false; }
            );
          }
        }, err => { this.updateResumen(); this.progressSpinner = false; }
      );
  }

  
  private getNprocValidador(){
    let parametro = { valor: "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA" };
    this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
      data => {
        this.parametroNProc = JSON.parse(data.body);
      }
    );
  }

  private getNigValidador(){
    let parametro = {valor: "NIG_VALIDADOR"};
    this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
      data => {
        this.parametroNIG = JSON.parse(data.body);
      }
    );
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

}
