import { Component, OnInit } from '@angular/core';
import { OldSigaServices } from '../../../../_services/oldSiga.service'
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { SigaServices } from '../../../../_services/siga.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '../../../../commons/translate';
import { DatosBancariosAnexoObject } from '../../../../models/DatosBancariosAnexoObject';


@Component({
  selector: 'app-detalle-soj',
  templateUrl: './detalle-soj.component.html',
  styleUrls: ['./detalle-soj.component.scss'],

})
export class DetalleSOJComponent implements OnInit {

  progressSpinner: boolean = false;
  msgs: any[];

  permisoDatosGenerales: boolean;
  permisoServiciosTramitacion: boolean;
  permisoSolicitante: boolean;
  permisoDocumentacion: boolean;
  modoEdicion: boolean;

  // Datos tarjeta resumen
  iconoTarjetaResumen = "clipboard";
  datosTarjetaResumen = [];
  enlacesTarjetaResumen = [];

  // Apertura y cierre de tarjetas
  manuallyOpened: boolean;
  openTarjetaDatosGenerales: boolean = true;
  openTarjetaComision: boolean = false;
  openTarjetaConfiguracion: boolean = false;
  openTarjetaUsoFicheros: boolean = false;
  openTarjetaUsosSufijos: boolean = false;

  // Parametros de entrada a la ficha
  paramsSoj;

  // Datos de la ficha
  body;

  constructor(
    private location: Location, 
    private route: ActivatedRoute, 
    private router: Router, 
    private sigaServices: SigaServices, 
    private translateService: TranslateService
  ) { }

  /**
   * Query params: ?idInstitucion=1&anio=2&numero=3&idTipoSoj=4
   */
  ngOnInit() {
    this.progressSpinner = true;
    this.route.queryParams.pipe(
      map(params => {
        this.paramsSoj = {
          idInstitucion: params['idInstitucion'],
          anio: params['anio'],
          numero: params['numero'],
          idTipoSoj: params['idTipoSoj'],
        };

        return this.paramsSoj;
      }),
      switchMap(params => this.getDatosDetalleSoj(params))
      ).subscribe(n => {
        this.progressSpinner = false;
      }, err => {
        this.progressSpinner = false;
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      });
    
    this.testPermisos();
  }

  eventGuardarFicha(event):void {
    if (event == undefined)
      return;

    this.progressSpinner = true;
    this.guardarDatosDetalleSoj(event)
      .switchMap(result => this.getDatosDetalleSoj(this.paramsSoj))
      .subscribe(n => {
        this.progressSpinner = false;
        this.showMsg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
      }, err => {
        this.progressSpinner = false;
        this.showMsg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      });
  }

  getDatosDetalleSoj(params): Observable<any> {
    return this.sigaServices.post("gestionJusticiables_getDetallesSoj", params).pipe(tap(n => {
      console.log(n);
      let responseBody = JSON.parse(n.body);
      if (responseBody != undefined && responseBody.fichaSojItems != undefined && responseBody.fichaSojItems.length != 0) {
        this.body = responseBody.fichaSojItems[0];
      } else {
        throw "Error al recuperar los datos";
      }
    }));
  }

  guardarDatosDetalleSoj(data): Observable<any> {
    return Observable.empty().startWith(5);
  }

  showMsg(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();
  }

  testPermisos() {
    this.modoEdicion = true;
    this.permisoDatosGenerales = true;
    this.permisoServiciosTramitacion = true;
    this.permisoSolicitante = true;
    this.permisoDocumentacion = true;
  }

  isOpenReceive(dato) {

  }

  /*
  url;

  constructor(public oldSigaServices: OldSigaServices, private location: Location, private router: Router) {
    //this.url = this.oldSigaServices.getOldSigaUrl('detalleSOJ');
    //this.url = JSON.parse(sessionStorage.getItem('url'));
    //sessionStorage.removeItem('url');
   // this.url +='&anio=2018&desdeEJG=si&idInstitucion=2005&idTipoSOJ=2&modo=Editar&numero=922';
    //this.url +='&numeroSOJ=922&IDTIPOSOJ=2&ANIO=2018&idPersonaJG=552608&idInstitucionJG=2005&actionE=/JGR_PestanaSOJBeneficiarios.do&tituloE=pestana.justiciagratuitasoj.solicitante&conceptoE=SOJ&NUMERO=922&anioSOJ=2018&localizacionE=gratuita.busquedaSOJ.localizacion&IDINSTITUCION=2005&idTipoSOJ=2&idInstitucionSOJ=2005&accionE=editar';
    //console.log('url es:'+this.url);
    if (sessionStorage.getItem('reload') == 'si') {
      sessionStorage.removeItem('reload');
      sessionStorage.setItem('reload', 'no');
      //this.url = JSON.parse(sessionStorage.getItem('url'));
      //sessionStorage.removeItem('url');
      setTimeout(() => {
        this.url = JSON.parse(sessionStorage.getItem('url'));
        sessionStorage.removeItem('url');
        document.getElementById('noViewContent').className = 'mainFrameWrapper';
        this.progressSpinner = false;
      }, 2000);
    }else{
      this.url = JSON.parse(sessionStorage.getItem('url'));
      sessionStorage.removeItem('url');
    }
  }

  ngOnInit() {
    
  }
  */
  

}
