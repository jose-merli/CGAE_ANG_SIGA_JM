import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';
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
  currentRoute : string;
  idClaseComunicacion : string;
  keys: any[] = [];
  institucionActual : string ;
  constructor(private translateService : TranslateService,
    private sigaServices : SigaServices,
    private router : Router,
    private commonServices : CommonsService) { }

  ngOnInit() {
    this.currentRoute = "/definirListasGuardias";
    this.getInstitucion();
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });

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

  comunicar() {
    if (this.lista.idLista != null) {


      sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
      //IDMODULO de SJCS es 10
      sessionStorage.setItem("idModulo", '10');
      let datosSeleccionados = [];
      let rutaClaseComunicacion = this.currentRoute.toString();

      this.sigaServices
        .post("dialogo_claseComunicacion", rutaClaseComunicacion)
        .subscribe(
          data => {
            this.idClaseComunicacion = JSON.parse(
              data["body"]
            ).clasesComunicaciones[0].idClaseComunicacion;
            this.sigaServices
              .post("dialogo_keys", this.idClaseComunicacion)
              .subscribe(
                data => {
                  this.keys = JSON.parse(data["body"]).keysItem;
                  let keysValues = [];
                  keysValues.push(this.institucionActual);
                  keysValues.push(this.lista.idLista);

                  datosSeleccionados.push(keysValues);

                  sessionStorage.setItem(
                    "datosComunicar",
                    JSON.stringify(datosSeleccionados)
                  );
                  this.router.navigate(["/dialogoComunicaciones"]);
                },
                err => {
                  //console.log(err);
                }
              );
          },
          err => {
            //console.log(err);
          }
        );

    }
  }

}
