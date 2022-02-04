import { Component, OnInit } from '@angular/core';
import { ParametroItem } from '../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../siga-storage.service';
import { CommonsService } from '../../../_services/commons.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-nuevo-expediente-exea',
  templateUrl: './nuevo-expediente-exea.component.html',
  styleUrls: ['./nuevo-expediente-exea.component.scss']
})
export class NuevoExpedienteExeaComponent implements OnInit {

  idProcedimiento : string;
  url : string;
  showFrame : boolean = false;
  comboProcedimientos = [];
  rutas = ["Expedientes EXEA", "Nuevo Expediente"];

  constructor(private sigaStorageService : SigaStorageService,
    private sigaServices : SigaServices,
    private commonsService : CommonsService){ }

  ngOnInit() {
    this.getComboProcedimientos();
  }

  getComboProcedimientos(){

    this.sigaServices.get("combo_comboProcedimientosEXEA").subscribe(
      n => {
        this.comboProcedimientos = n.combooItems;
      },
      err => {
        console.log(err);
      }, () => {
        this.commonsService.arregloTildesCombo(this.comboProcedimientos);
      }
    );
  }

  styleObligatorio(evento) {
    if (evento == undefined || evento == null || evento == "") {
      return this.commonsService.styleObligatorio(evento);
    }
  }


  getUrlEXEA(){

    if(this.idProcedimiento){
      let parametro = new ParametroRequestDto();
      parametro.idInstitucion = this.sigaStorageService.institucionActual;
      parametro.modulo = "EXEA";
      parametro.parametrosGenerales = "URL_EXEA";

      this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
        data => {
          let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
          let url = resp.find(element => element.parametro == "URL_EXEA" && element.idInstitucion == element.idinstitucionActual);
          
          if(!url){
            url = resp.find(element => element.parametro == "URL_EXEA" && element.idInstitucion == '0');
          }

          if(url){
            window.open(url.valor + "createProcess.do?procedureId=" + this.idProcedimiento,'_blank');
          }
        },
        err => {
          console.log(err);
        },
        () => {}
      );
    }
  }
}

