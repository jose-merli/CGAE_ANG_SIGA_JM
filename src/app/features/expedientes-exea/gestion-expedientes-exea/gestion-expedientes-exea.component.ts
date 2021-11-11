import { Component, OnInit } from '@angular/core';
import { ParametroItem } from '../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../siga-storage.service';
import { OldSigaServices } from '../../../_services/oldSiga.service';
import { SigaServices } from '../../../_services/siga.service';

@Component({
  selector: 'app-gestion-expedientes-exea',
  templateUrl: './gestion-expedientes-exea.component.html',
  styleUrls: ['./gestion-expedientes-exea.component.scss']
})
export class GestionExpedientesExeaComponent implements OnInit {

  url : string;
  showFrame : boolean = false;
  rutas = ["Expedientes EXEA", "Gestionar Expedientes"];
  constructor(private sigaStorageService : SigaStorageService,
    private sigaServices : SigaServices) {
      this.getIdFormBusqueda();
  }

  ngOnInit() {
    
  }

  getIdFormBusqueda(){
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = "EXEA";
    parametro.parametrosGenerales = "ID_FORM_BUSQ";

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
        let idFormulario = resp.find(element => element.parametro == "ID_FORM_BUSQ" && element.idInstitucion == element.idinstitucionActual);
        
        if(!idFormulario){
          idFormulario = resp.find(element => element.parametro == "ID_FORM_BUSQ" && element.idInstitucion == '0');
        }

        if(idFormulario){
          this.url = this.sigaServices.getEXEAUrl() + "showProcedureList.do?search=true&formSelect=" + idFormulario.valor;
          this.showFrame = true;
        }
      },
      err => {
        console.log(err);
      },
      () => {}
    );
  }
}
