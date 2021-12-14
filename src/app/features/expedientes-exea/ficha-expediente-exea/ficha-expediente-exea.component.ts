import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../commons/translate';
import { ExpedienteItem } from '../../../models/ExpedienteItem';
import { DocumentacionAsistenciaItem } from '../../../models/guardia/DocumentacionAsistenciaItem';
import { HistoricoExpedienteItem } from '../../../models/HistoricoExpedienteItem';
import { ParametroItem } from '../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../siga-storage.service';
import { SigaServices } from '../../../_services/siga.service';
import { SigaNoInterceptorServices } from '../../../_services/sigaNoInterceptor.service';

@Component({
  selector: 'app-ficha-expediente-exea',
  templateUrl: './ficha-expediente-exea.component.html',
  styleUrls: ['./ficha-expediente-exea.component.scss']
})
export class FichaExpedienteExeaComponent implements OnInit {


  msgs: Message[] = [];
  rutas: string[] = [];
  progressSpinner : boolean = false;
  urlSede : string;

  listaTarjetas = [{
    id : 'datosgenerales',
    nombre: 'Datos Generales Expediente',
    icono: 'far fa-address-book',
    detalle: true,
    fixed: false,
    opened: false,
    campos: [],
    enlaces: [],
    visible: true,
  },
  {
    id: 'documentacion',
    nombre: 'Documentación',
    icono: 'fa fa-briefcase',
    detalle: true,
    fixed: false,
    opened: false,
    campos: [],
    enlaces: [],
    visible: true,
  },
  {
    id:'historico',
    nombre: 'Histórico',
    icono: 'fa fa-inbox',
    detalle: true,
    fixed: false,
    opened: false,
    visible: true,
    campos: [],
    enlaces: [],
  },
  {
    id:'serviciosinteres',
    nombre: "Servicios de interés",
    imagen: "",
    icono: "fas fa-link icon-ficha",
    detalle: false,
    fixed: false,
    opened: false,
    visible: true,
    enlaceCardClosed: {} //Enlace a sede electronica
  }];

  idExpediente : string;
  expedienteEXEA : ExpedienteItem;
  titularExp : string;
  constructor(private route : ActivatedRoute,
    private sigaServices : SigaServices,
    private sigaStorageService : SigaStorageService,
    private sigaNoInterceptorServices : SigaNoInterceptorServices,
    private location : Location,
    private translateService : TranslateService,
    private datePipe : DatePipe) { }

  ngOnInit() {

    if(sessionStorage.getItem("titular")){
      this.titularExp = sessionStorage.getItem("titular");
      sessionStorage.removeItem("titular");
    }

    this.route.queryParams
			.subscribe(params => {
				this.idExpediente = params.idExpediente;
        if(this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona){
          this.getDetalleExpediente();
        }else{
          this.getDetalleExpedientePersonalColegio();
        }
			});

      this.rutas = [this.translateService.instant("menu.expedientesexea"), 'Ficha Expedientes EXEA'];
  }

  getDetalleExpediente(){
    this.progressSpinner = true;
    //Primero obtenemos el token de login en EXEA
    this.sigaServices.get("expedientesEXEA_getTokenEXEA").subscribe(
      n => {
        let tokenEXEA : string = n.valor;

        if(tokenEXEA && tokenEXEA.includes("Bearer")){
          this.getURLDetalleExpedienteEXEA(tokenEXEA);
        }else if (tokenEXEA && tokenEXEA.includes("Error")){
          this.showMessage('error','Error', tokenEXEA);
        }else{
          this.showMessage('error','Error', 'Error al logar en EXEA');
        }
        
      },
      err => { 
        console.log(err);
        this.progressSpinner = false;
      } 
    );

  }

  getDetalleExpedientePersonalColegio(){

    this.progressSpinner = true;
    this.sigaServices.getParam(
      "expedientesEXEA_getDetalleExpedientePersonalColegio", "?numExp="+this.idExpediente).subscribe(
        data => {
          
          if(!data.error){
           this.expedienteEXEA = data.expedienteItem[0];
           this.expedienteEXEA.titular = this.titularExp;
           this.initTarjetas();
          }else if(data.error.code == 500){
              this.showMessage('error','Error',data.error.description);
          }
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.showMessage('error','Error',err);
          this.progressSpinner = false;
        }
      );

  }

  getURLDetalleExpedienteEXEA(tokenEXEA : string){
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = "EXEA";
    parametro.parametrosGenerales = "URL_EXEA_DETALLE_EXPEDIENTE";

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
        let url = resp.find(element => element.parametro == "URL_EXEA_DETALLE_EXPEDIENTE" && element.idInstitucion == element.idinstitucionActual);
        
        if(!url){
          url = resp.find(element => element.parametro == "URL_EXEA_DETALLE_EXPEDIENTE" && element.idInstitucion == '0');
        }

        if(url && this.idExpediente){
          url.valor += "/"+this.idExpediente;
          this.sigaNoInterceptorServices.getWithAuthHeader(String(url.valor), tokenEXEA).subscribe(
            n => {
              this.fillExpedienteItem(n);
              this.initTarjetas();
              this.progressSpinner = false;
            },
            err => {
              console.log(err);
              this.progressSpinner = false;
            }
          );
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {}
    );
  }

  fillExpedienteItem(data : any){

    this.expedienteEXEA = new ExpedienteItem();

    this.expedienteEXEA.numExpediente = data.numero_expediente;
    this.expedienteEXEA.fechaApertura = data.fecha_inicio;
    this.expedienteEXEA.tipoExpediente = data.asunto;
    this.expedienteEXEA.titular = this.titularExp;
    this.expedienteEXEA.numRegistro = data.numero_registro;
    this.expedienteEXEA.fechaRegistro = data.fecha_registro;
    this.expedienteEXEA.estadoExpediente = data.estado.descripcion;
    this.expedienteEXEA.descInstitucion = data.desc_organismo_resp;

    let hitos : HistoricoExpedienteItem [] = []
    let documentos : DocumentacionAsistenciaItem [] = []
    data.listaHitos.forEach(element => {
      let hito : HistoricoExpedienteItem = new HistoricoExpedienteItem;
      hito.descripcion = element.descripcion;
      hito.fecha = this.datePipe.transform(element.fecha,'dd/MM/yyyy HH:mm');
      hito.estado = element.estado.descripcion;
      hitos.push(hito);
      
      if(element.lista_doc && element.lista_doc.length > 0){
        element.lista_doc.forEach(element => {
          let documento : DocumentacionAsistenciaItem = new DocumentacionAsistenciaItem();
          documento.nombreFichero = element.asunto;
          documento.descTipoDoc = element.tipo_documento;
          documentos.push(documento);
        });
        this.expedienteEXEA.documentos = documentos;
      }
    });
    this.expedienteEXEA.hitos = hitos;

  }

  initTarjetas(){
    if(this.expedienteEXEA){

      let camposDatosGenerales = [
        {
          "key": this.translateService.instant("justiciaGratuita.ejg.datosGenerales.NumExpediente"),
          "value": this.expedienteEXEA.numExpediente
        },
        {
          "key": this.translateService.instant("formacion.busquedaInscripcion.fechaSolicitud"),
          "value":  this.datePipe.transform(this.expedienteEXEA.fechaApertura,'dd/MM/yyyy HH:mm')
        },
        {
          "key": 'Tipo Expediente',
          "value": this.expedienteEXEA.tipoExpediente
        },
        {
          "key": this.translateService.instant("facturacion.devolucionManual.titularDomiciliacion"),
          "value": this.titularExp
        }
      ];
      this.listaTarjetas[0].campos = camposDatosGenerales;


      let camposDocumentacion = [];
      if(this.expedienteEXEA.documentos && this.expedienteEXEA.documentos.length > 0){

        camposDocumentacion = [
          {
            "key" : this.translateService.instant("enviosMasivos.literal.numDocumentos"),
            "value" : this.expedienteEXEA.documentos.length
          }
        ];

      }else{
        camposDocumentacion = [
          {
            "key" : null,
            "value" : "No hay documentación asociada al expediente"
          }
        ];
      }

      if(this.expedienteEXEA.hitos && this.expedienteEXEA.hitos.length > 0){
        this.listaTarjetas[1].campos = camposDocumentacion;

        let camposHistorico = [
          {
            "key" : this.translateService.instant("censo.fichaIntegrantes.literal.estado"),
            "value" : this.expedienteEXEA.hitos[0].estado
          },
          {
            "key" : this.translateService.instant("facturacionSJCS.facturacionesYPagos.buscarFacturacion.fechaEstado"),
            "value" : this.datePipe.transform(new Date(this.expedienteEXEA.hitos[0].fecha), "dd/MM/yyyy HH:mm")
          }
        ];
        this.listaTarjetas[2].campos = camposHistorico;
      }

      this.getURLSedeElectronica();

    }
  }

  getURLSedeElectronica(){

    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = "EXEA";
    parametro.parametrosGenerales = "URL_SEDE";

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
        let url = resp.find(element => element.parametro == "URL_SEDE" && element.idInstitucion == element.idinstitucionActual);
        
        if(!url){
          url = resp.find(element => element.parametro == "URL_SEDE" && element.idInstitucion == '0');
        }

        if(url && url.valor != 'NULL'){
          this.urlSede = String(url.valor);
          this.listaTarjetas[3].enlaces= [
            {
              texto: this.translateService.instant("general.boton.masinformacion"),
              sede : this.urlSede
            }
          ]
        }
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      },
      () => {}
    );

    
  }

  goToSede(){
    this.showMessage('success','OK','Redireccion sede');
    window.open(this.urlSede, '_blank');
  }

  clear() {
    this.msgs = [];
  }

  showMessage(severityParam : string, summaryParam : string, detailParam : string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }
  backTo(){
    this.location.back();
  }

}
