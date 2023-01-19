import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { TarjetaDefensaJuridicaItem } from '../../../../../../models/guardia/TarjetaDefensaJuridicaItem';
import { ParametroRequestDto } from '../../../../../../models/ParametroRequestDto';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-asistencia-tarjeta-defensa-juridica',
  templateUrl: './ficha-asistencia-tarjeta-defensa-juridica.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-defensa-juridica.component.scss']
})
export class FichaAsistenciaTarjetaDefensaJuridicaComponent implements OnInit {

  msgs : Message [] = [];
  @Input() idAsistencia;
  @Input() editable : boolean;
  @Input() modoLectura: boolean;
  comboComisarias = [];
  comboJuzgados = [];
  comboDelitos = [];
  comboProcedimientos = [];
  defensaJuridicaItem : TarjetaDefensaJuridicaItem = new TarjetaDefensaJuridicaItem();
  defensaJuridicaItemAux : TarjetaDefensaJuridicaItem = new TarjetaDefensaJuridicaItem();
  progressSpinner : boolean = false;
  @Output() refreshTarjetas = new EventEmitter<string>();
  valorFormatoProc: any;
  institucionActual: any;
  datosBuscar: any;
  parametroNIG: any;
  parametroNProc: any;
  

  constructor(private sigaServices : SigaServices,
    private commonServices : CommonsService,
    private translateService : TranslateService) { }

  ngOnInit() {
    this.getNigValidador();
    this.getNprocValidador();
    this.getComboComisarias();
    this.getComboJuzgados();
    this.getComboProcedimientos();
    this.getComboDelitos();
    this.getDefensaJuridicaData();
  }

  getComboJuzgados(){

    this.sigaServices.get("combo_comboJuzgado").subscribe(
      n => {
        this.comboJuzgados = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboJuzgados);
        this.comboJuzgados.sort( (a, b) => {
          return a.label.localeCompare(b.label);
        });
      }
    );

  }

  getComboComisarias(){

    this.sigaServices.get("combo_comboComisaria").subscribe(
      n => {
        this.comboComisarias = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboComisarias);
      }
    );

  }

  getComboDelitos() {
    
    let designaItem = {};
    
    this.sigaServices.post("combo_comboDelitos", designaItem).subscribe(
      n => {
        let combos= JSON.parse(n["body"]);
        this.comboDelitos = combos.combooItems;
      },
      err => {
        //console.log(err);
        this.showMsg('error',this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), err);
        this.progressSpinner = false;
      },
      () =>{
        this.commonServices.arregloTildesCombo(this.comboDelitos);
        this.progressSpinner = false;
      }
    );
  }

  //combo_comboProcedimientosDesignaciones

  getComboProcedimientos(){

    this.sigaServices.get("combo_comboProcedimientosDesignaciones").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboProcedimientos);
      }
    );

  }

  getDefensaJuridicaData(){

    if(this.idAsistencia){
      this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchTarjetaDefensaJuridica","?anioNumero="+this.idAsistencia).subscribe(
        n => {
          this.defensaJuridicaItem = n.tarjetaDefensaJuridicaItems[0];
          this.defensaJuridicaItemAux = Object.assign({},this.defensaJuridicaItem);
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );

    }
  }

  saveDefensaJuridicaData(){
    if(!this.compruebaCamposObligatorios()){
    
      if(this.idAsistencia){
        this.progressSpinner = true;
        this.sigaServices.postPaginado("busquedaGuardias_guardarTarjetaDefensaJuridica","?anioNumero="+this.idAsistencia, this.defensaJuridicaItem).subscribe(
          n => {

            let id = JSON.parse(n.body).id;
            let error = JSON.parse(n.body).error;
            this.progressSpinner = false;

            if (error != null && error.description != null) {
              this.showMsg("info", this.translateService.instant("general.message.informacion"), error.description);
            } else {
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
              this.refreshTarjetas.emit(id);
              this.defensaJuridicaItemAux = Object.assign({},this.defensaJuridicaItem);
            }
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          }, () => {
            this.progressSpinner = false;
          }
        );
      }
    }
    
  }

  compruebaCamposObligatorios() {

    let error = false;

    if (this.defensaJuridicaItem.nig == null || (this.defensaJuridicaItem.nig != null && !error && !this.validarNig(this.defensaJuridicaItem.nig))) {
      this.showMsg('error', this.translateService.instant("justiciaGratuita.oficio.designa.NIGInvalido"), '');
      error = true;
    }

    if (this.defensaJuridicaItem.numProcedimiento == null || (this.defensaJuridicaItem.numProcedimiento != null && !error && !this.validarNProcedimiento(this.defensaJuridicaItem.numProcedimiento))) {
      this.showMsg('error', this.translateService.instant('general.message.incorrect'), this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido"));
      error = true;
    }
    return error;
  }

  getNprocValidador(){
    let parametro = {
      valor: "FORMATO_VALIDACION_NPROCEDIMIENTO_DESIGNA"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroNProc = JSON.parse(data.body);
        //this.progressSpinner = false;
      });
  }

  validarNProcedimiento(nProcedimiento) {
    let ret = false;
    
    if (nProcedimiento != null && nProcedimiento != '' && this.parametroNProc != undefined) {
      if (this.parametroNProc != null && this.parametroNProc.parametro != "") {
          let valorParametroNProc: RegExp = new RegExp(this.parametroNProc.parametro);
          if (nProcedimiento != '') {
            if(valorParametroNProc.test(nProcedimiento)){
              ret = true;
            }else{
              let severity = "error";
                      let summary = this.translateService.instant("justiciaGratuita.oficio.designa.numProcedimientoNoValido");
                      let detail = "";
                      this.msgs.push({
                        severity,
                        summary,
                        detail
                      });

              ret = false
            }
          }
        }
    }

    return ret;
  }

/*
  validarNProcedimiento(nProcedimiento:string) {
    //Esto es para la validacion de CADECA

    let response:boolean = false;

    if (this.institucionActual == "2008" || this.institucionActual == "2015" || this.institucionActual == "2029" || this.institucionActual == "2033" || this.institucionActual == "2036" ||
      this.institucionActual == "2043" || this.institucionActual == "2006" || this.institucionActual == "2021" || this.institucionActual == "2035" || this.institucionActual == "2046" || this.institucionActual == "2066") {
      if (nProcedimiento != '' && nProcedimiento != null) {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{5}[\.]{1}[0-9]{2}$/;
        let ret = objRegExp.test(nProcedimiento);
        response = ret;
      }
    } else {
      if (nProcedimiento != '' && nProcedimiento != null && nProcedimiento.length == 12) {
        let objRegExp = /^[0-9]{4}[\/]{1}[0-9]{7}$/;
        let ret = objRegExp.test(nProcedimiento);
        response = ret;
      } 
    }
    return response;

  }
  */

  validarNig(nig) {
    let ret = false;
    
    if (nig != null && nig != '' && this.parametroNIG != undefined) {
      if (this.parametroNIG != null && this.parametroNIG.parametro != "") {
          let valorParametroNIG: RegExp = new RegExp(this.parametroNIG.parametro);
          if (nig != '') {
            ret = valorParametroNIG.test(nig);
          }
        }
      //this.progressSpinner = false;
    }

    return ret;
  }

  getNigValidador(){
    let parametro = {
      valor: "NIG_VALIDADOR"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.parametroNIG = JSON.parse(data.body);
        //this.progressSpinner = false;
      });
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe(n => { this.institucionActual = n.value });
  }

  formatoProc(){
    this.sigaServices.get('actuaciones_designacion_numProcedimiento').subscribe(
      (data) => {
        console.log("FORMATO PROC")
        console.log(data)
       this.valorFormatoProc = data.valor;
        console.log(this.valorFormatoProc)
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  onChangeComisaria(){
    if(this.defensaJuridicaItem.idComisaria){
      this.defensaJuridicaItem.idJuzgado = "";
    }
  }
  onChangeJuzgado(){
    if(this.defensaJuridicaItem.idJuzgado){
      this.defensaJuridicaItem.idComisaria = "";
    }
  }

  clear() {
    this.msgs = [];
  }

  restablecer(){
    if(this.idAsistencia){
      this.defensaJuridicaItem = Object.assign({}, this.defensaJuridicaItemAux);
    }else{
      this.defensaJuridicaItem = new TarjetaDefensaJuridicaItem();
    }
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

}
