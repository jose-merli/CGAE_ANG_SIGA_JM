import { Component, Input, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../../../_services/oldSiga.service';
import { Location } from '@angular/common';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { Router } from '@angular/router';
import { EJGItem } from '../../../../../../models/sjcs/EJGItem';

@Component({
  selector: 'add-expediente',
  templateUrl: './add-expediente.component.html'
})
export class AddExpedienteComponent implements OnInit {

  progressSpinner: boolean = false;
  url;
  datos;
  body: EJGItem; 

  constructor(public oldSigaServices: OldSigaServices, private sigaServices: SigaServices,
    private location: Location, private persistenceService: PersistenceService, private router: Router) {

    //this.progressSpinner = true;

    this.body = JSON.parse (sessionStorage.getItem("expedienteInsos"));

    console.log('numeroEjg esperado 80, llega:'+this.body.numero);
    console.log('numEJGDisciplinario esperado 20120, llega:'+this.body.numEjg);
    console.log('idTipoEjg esperado 3, llega:'+this.body.tipoEJG);
    console.log('anioEjg esperado 2021, llega:'+this.body.annio);
    console.log('idInstitucion_TipoExpediente esperado 2005, llega:'+this.body.idInstitucion);
    console.log('procedimiento esperado 1231, llega:'+this.body.procedimiento);
    console.log('juzgado esperado 114, llega:'+this.body.juzgado);
    console.log('pretension esperado 128, llega:'+this.body.idPretension);
    console.log('pretensionInstitucion esperado 2005, llega:'+this.body.idInstitucion);
    console.log('idturnoDesignado esperado 3931, llega:'+this.body.turnoDes);
    console.log('nombreDesignado esperado 2005001421, llega:'+this.body.numDesigna); 
 

    this.url = oldSigaServices.getOldSigaUrl('expedienteDatAudi');

    this.url +='&soloSeguimiento=false&editable=1&modo=&avanzada=&metodo=abrirNuevoEjg'+
    '&numeroEjg='+this.body.numero +'&numEJGDisciplinario='+this.body.numEjg+'&idTipoEjg='+this.body.tipoEJG
    +'&anioEjg='+this.body.annio+'&nifSolicitante=&nombreSolicitante=++&idInstitucion_TipoExpediente='+this.body.idInstitucion
    +'&numeroProcedimiento=&anioProcedimiento=&procedimiento='+this.body.procedimiento+'&asunto=&juzgado='+this.body.juzgado
    +'&juzgadoInstitucion=&pretension='+ this.body.idPretension +'&pretensionInstitucion='+this.body.idInstitucion
    +'&idturnoDesignado='+this.body.turnoDes+'&nombreDesignado='+this.body.numDesigna+'&numColDesignado='
    +'&idclasificacion=1&solicitanteEjgNif=&solicitanteEjgNombre=&solicitanteEjgApellido1=&solicitanteEjgApellido2=';



    //this.url = 'http://localhost:7001/SIGA/EXP_Auditoria_DatosGenerales.do?soloSeguimiento=false&editable=1&modo=&avanzada=&metodo=abrirNuevoEjg&numeroEjg=80&numEJGDisciplinario=20120&idTipoEjg=3&anioEjg=2021&nifSolicitante=&nombreSolicitante=++&idInstitucion_TipoExpediente=2005&numeroProcedimiento=&anioProcedimiento=&procedimiento=1231&asunto=&juzgado=114&juzgadoInstitucion=&pretension=128&pretensionInstitucion=2005&idturnoDesignado=3931&nombreDesignado=2005001421&numColDesignado=&idclasificacion=1&solicitanteEjgNif=&solicitanteEjgNombre=&solicitanteEjgApellido1=&solicitanteEjgApellido2='
     //+ '&token=' + sessionStorage.getItem('AuthOldSIGA');

/*
    if (sessionStorage.getItem('reload') == 'si') {

      this.url = oldSigaServices.getOldSigaUrl('ejg');

      sessionStorage.removeItem('reload');
      sessionStorage.setItem('reload', 'no');
      setTimeout(() => {
        this.url = JSON.parse(sessionStorage.getItem('url'));
        document.getElementById('noViewContent').className = 'mainFrameWrapper2';
        document.getElementById('noViewContent').className = 'mainFrameWrapper2';
        this.router.navigate(['/addExp']);
      }, 2000);
    } else {

      this.url = JSON.parse(sessionStorage.getItem('url'));
      sessionStorage.removeItem('url');
      setTimeout(() => {
        this.url = JSON.parse(sessionStorage.getItem('url'));
        document.getElementById('noViewContent').className = 'mainFrameWrapper';
        this.progressSpinner = false;
      }, 2000);
    }
*/
  }

  ngOnInit() {
    if (this.persistenceService.getDatos()) {
      this.datos = this.persistenceService.getDatos();
    }
  }

  goBack() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_datosEJG", this.datos).subscribe(
      n => {
        let ejgObject = JSON.parse(n.body).ejgItems;
        let datosItem = ejgObject[0];
        this.persistenceService.setDatos(datosItem);
        this.consultaUnidadFamiliar(this.datos);
        this.location.back();
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }

  consultaUnidadFamiliar(selected) {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_unidadFamiliarEJG", selected).subscribe(
      n => {
        let datosFamiliares = JSON.parse(n.body).unidadFamiliarEJGItems;
        this.persistenceService.setBodyAux(datosFamiliares);
        this.location.back();
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
      }
    );
  }
}