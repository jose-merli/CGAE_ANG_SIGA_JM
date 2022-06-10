import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { ExpedienteItem } from '../../../../models/ExpedienteItem';
import { DocumentacionAsistenciaItem } from '../../../../models/guardia/DocumentacionAsistenciaItem';
import { ParametroItem } from '../../../../models/ParametroItem';
import { ParametroRequestDto } from '../../../../models/ParametroRequestDto';
import { SigaStorageService } from '../../../../siga-storage.service';
import { SigaServices } from '../../../../_services/siga.service';
import { SigaNoInterceptorServices } from '../../../../_services/sigaNoInterceptor.service';
import { saveAs } from "file-saver/FileSaver";
import { TranslateService } from '../../../../commons/translate';

@Component({
  selector: 'app-ficha-exp-exea-documentacion',
  templateUrl: './ficha-exp-exea-documentacion.component.html',
  styleUrls: ['./ficha-exp-exea-documentacion.component.scss']
})
export class FichaExpExeaDocumentacionComponent implements OnInit {

  msgs : Message [] = [];
  progressSpinner : boolean = false;

  rowsPerPage: any = [];
  cols;
  selectedItem: number = 10;
  selectAll;
  selectedDatos = [];
  buscadores = [];
  numSelected = 0;
  selectMultiple: boolean = false;
  seleccion: boolean = false;

  @Input() expediente : ExpedienteItem;
  @ViewChild("table") table : Table;
  constructor(private changeDetectorRef : ChangeDetectorRef,
    private sigaNoInterceptorServices : SigaNoInterceptorServices,
    private sigaServices : SigaServices,
    private sigaStorageService : SigaStorageService,
    private translateService : TranslateService) { }

  ngOnInit() {
    this.initTabla();
  }

  initTabla(){

    this.cols = [
      { field: "idDocumentacion", header: "justiciaGratuita.oficio.designas.contrarios.identificador", width: '3%' },
      { field: "nombreFichero", header: "informesycomunicaciones.comunicaciones.documento.nombre", width: '3%' },
      { field: "descTipoDoc", header: "justiciaGratuita.ejg.documentacion.tipoDoc", width: "3%" },
    ];
    this.cols.forEach(it => this.buscadores.push(""));

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];

  }

  onChangeSelectAll() {

    if (this.selectAll && this.expediente.documentos) {
      this.selectMultiple = true;
      this.selectedDatos = this.expediente.documentos;
      this.numSelected = this.expediente.documentos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
      this.selectMultiple = false;
    }
      
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  openTab(dato : DocumentacionAsistenciaItem){

    if(this.sigaStorageService.isLetrado && this.sigaStorageService.idPersona){
      //Obtenemos token login por SOAP de EXEA y hacemos llamada REST

      this.sigaServices.get("expedientesEXEA_getTokenEXEA").subscribe(
        n => {
          let tokenEXEA : string = n.valor;
  
          if(tokenEXEA && tokenEXEA.includes("Bearer")){
            this.getDocumentoEXEA(dato, tokenEXEA);
          }else if (tokenEXEA && tokenEXEA.includes("Error")){
            this.showMessage('error','Error', tokenEXEA);
          }else{
            this.showMessage('error','Error', 'Error al logar en EXEA');
          }
          
        },
        err => { 
          console.log(err);
        } 
      );
    }
  }

  getDocumentoEXEA(dato : DocumentacionAsistenciaItem, tokenEXEA : string){
    this.progressSpinner = true;
    let parametro = new ParametroRequestDto();
    parametro.idInstitucion = this.sigaStorageService.institucionActual;
    parametro.modulo = "EXEA";
    parametro.parametrosGenerales = "URL_EXEA_EXPEDIENTES";

    this.sigaServices.postPaginado("parametros_search", "?numPagina=1", parametro).subscribe(
      data => {
        let resp: ParametroItem[] = JSON.parse(data.body).parametrosItems;
        let url = resp.find(element => element.parametro == "URL_EXEA_EXPEDIENTES" && element.idInstitucion == element.idinstitucionActual);
        
        if(!url){
          url = resp.find(element => element.parametro == "URL_EXEA_EXPEDIENTES" && element.idInstitucion == '0');
        }

        if(url && dato.idDocumentacion){
          url.valor += "/documento/"+dato.idDocumentacion;
          this.sigaNoInterceptorServices.getWithAuthHeaderBLOB(String(url.valor), tokenEXEA).subscribe(
            n => {
              let mime = this.getMimeType("."+dato.descTipoDoc);
              let blob = new Blob([n.body], { type: mime });
              saveAs(blob, dato.nombreFichero);
              this.progressSpinner = false;
            },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            }
          );
        }
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
        this.showMessage('error', 'Error', this.translateService.instant('general.message.error.realiza.accion'));
      },
      () => {}
    );
  }

  getMimeType(extension: string): string {

    let mime: string = "";

    switch (extension.toLowerCase()) {

      case ".doc":
        mime = "application/msword";
        break;
      case ".docx":
        mime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".pdf":
        mime = "application/pdf";
        break;
      case ".jpg":
        mime = "image/jpeg";
        break;
      case ".png":
        mime = "image/png";
        break;
      case ".rtf":
        mime = "application/rtf";
        break;
      case ".txt":
        mime = "text/plain";
        break;
    }

    return mime;
  }
}
