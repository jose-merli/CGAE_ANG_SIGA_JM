import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../../../commons/translate';
import { TarjetaDefensaJuridicaItem } from '../../../../../../models/guardia/TarjetaDefensaJuridicaItem';
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
  

  constructor(private sigaServices : SigaServices,
    private commonServices : CommonsService,
    private translateService : TranslateService) { }

  ngOnInit() {
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
