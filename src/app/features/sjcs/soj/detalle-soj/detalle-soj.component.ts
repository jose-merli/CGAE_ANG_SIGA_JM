import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-detalle-soj',
  templateUrl: './detalle-soj.component.html',
  styleUrls: ['./detalle-soj.component.scss'],

})
export class DetalleSOJComponent implements OnInit {

  url;
  progressSpinner: boolean = false;

  constructor(public oldSigaServices: OldSigaServices, private location: Location, private router: Router) {
    //this.url = this.oldSigaServices.getOldSigaUrl('detalleSOJ');
    this.url = JSON.parse(sessionStorage.getItem('url'));
    sessionStorage.removeItem('url');
   // this.url +='&anio=2018&desdeEJG=si&idInstitucion=2005&idTipoSOJ=2&modo=Editar&numero=922';
    //this.url +='&numeroSOJ=922&IDTIPOSOJ=2&ANIO=2018&idPersonaJG=552608&idInstitucionJG=2005&actionE=/JGR_PestanaSOJBeneficiarios.do&tituloE=pestana.justiciagratuitasoj.solicitante&conceptoE=SOJ&NUMERO=922&anioSOJ=2018&localizacionE=gratuita.busquedaSOJ.localizacion&IDINSTITUCION=2005&idTipoSOJ=2&idInstitucionSOJ=2005&accionE=editar';

    //console.log('url es:'+this.url);
    

    if (sessionStorage.getItem('reload') == 'si') {
      sessionStorage.removeItem('reload');
      sessionStorage.setItem('reload', 'no');
      this.url = JSON.parse(sessionStorage.getItem('url'));
      sessionStorage.removeItem('url');
      setTimeout(() => {
        this.url = JSON.parse(sessionStorage.getItem('url'));
        document.getElementById('noViewContent').className = 'mainFrameWrapper';
        this.progressSpinner = false;
      }, 2000);
    }
  }

  ngOnInit() {
    
  }

  backTo() {
    this.location.back();
  }

}
