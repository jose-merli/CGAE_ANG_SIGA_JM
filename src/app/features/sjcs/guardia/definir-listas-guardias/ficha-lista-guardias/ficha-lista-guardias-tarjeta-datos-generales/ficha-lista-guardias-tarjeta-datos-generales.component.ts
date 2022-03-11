import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { Message } from 'primeng/api';
import { Row } from '../../../../../../commons/tabla-resultado-order/tabla-resultado-order-cg.service';
import { TranslateService } from '../../../../../../commons/translate';
import { ListaGuardiasItem } from '../../../../../../models/guardia/ListaGuardiasItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-ficha-lista-guardias-tarjeta-datos-generales',
  templateUrl: './ficha-lista-guardias-tarjeta-datos-generales.component.html',
  styleUrls: ['./ficha-lista-guardias-tarjeta-datos-generales.component.scss']
})
export class FichaListaGuardiasTarjetaDatosGeneralesComponent implements OnInit, OnChanges {

  msgs : Message [] = [];
  progressSpinner : boolean = false;
  @Input()lista: ListaGuardiasItem = new ListaGuardiasItem();
  @Input()permisosEscritura : boolean = false;
  @Output()enableTarjetaGuardias = new EventEmitter<string>();
  listaAux : ListaGuardiasItem = new ListaGuardiasItem();
  comboTipo = [
    {
      label : 'Para comunicación o descarga',
      value : 1
    },
    {
      label : 'Para generación',
      value : 2
    },
    {
      label : 'Para ambos',
      value : ''
    }
  ]

  constructor(private translateService : TranslateService,
    private sigaServices : SigaServices,
    private commonServices : CommonsService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.lista || this.lista){
      this.listaAux = Object.assign({},this.lista);
      if(this.lista.idTipo == null){this.lista.idTipo = '';}
    } else{
      this.lista = new ListaGuardiasItem();
    }
  }

  saveDatosGenerales(){

    if(this.lista && this.lista.nombre && this.lista.idTipo != null && this.lista.idTipo != undefined){

      this.progressSpinner = true;
      this.sigaServices
      .post("listasGuardias_saveListaGuardias", this.lista)
      .subscribe(
        n => {
          let insertResponseDTO = JSON.parse(n["body"]);
          if(insertResponseDTO.error){
            this.showMsg('error', this.translateService.instant("informesycomunicaciones.modelosdecomunicacion.errorResultados"), insertResponseDTO.error.description);
          }else{
            this.listaAux = Object.assign({},this.lista);
            if(!this.lista.idLista){ //Si es nueva le seteamos el nuevo id y habilitamos la tarjeta Guardias
              this.lista.idLista = insertResponseDTO.id;
              this.enableTarjetaGuardias.emit(this.lista.idLista);
              this.showMsg('info', this.translateService.instant("sjcs.guardia.listaguardias.errortarjetaguardianecesaria"), '');
            } else {
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            }
            
          }    
          this.progressSpinner = false;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () =>{
          this.progressSpinner = false;
        }
      );
    }else{
      this.showMsg('error','Error',this.translateService.instant("general.message.camposObligatorios"));
    }

  }

  styleObligatorio(evento){
    if((evento==undefined || evento==null || evento=="")){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  styleObligatorioTipo(evento){
    if((evento==undefined || evento==null)){
      return this.commonServices.styleObligatorio(evento);
    }
  }

  restablecer(){
    this.lista = Object.assign({},this.listaAux);
  }

  clear() {
    this.msgs = [];
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
