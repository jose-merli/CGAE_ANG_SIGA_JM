import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Actuacion, Col } from '../../detalle-tarjeta-actuaciones-designa.component';
import { SigaServices } from '../../../../../../../../_services/siga.service';

@Component({
  selector: 'app-tarjeta-doc-ficha-act',
  templateUrl: './tarjeta-doc-ficha-act.component.html',
  styleUrls: ['./tarjeta-doc-ficha-act.component.scss']
})
export class TarjetaDocFichaActComponent implements OnInit {

  @Input() documentos;
  @Input() actuacionDesigna: Actuacion;
  @ViewChild("pUploadFile") pUploadFile;
  cols: Col[] = [
    {
      field: 'fecha',
      header: 'Fecha',
      width: '20%'
    },
    {
      field: 'asociado',
      header: 'Asociado',
      width: '20%'
    },
    {
      field: 'tipodocumentacion',
      header: 'Tipo documentación',
      width: '20%'
    },
    {
      field: 'nombre',
      header: 'Nombre',
      width: '20%'
    },
    {
      field: 'observaciones',
      header: 'Observaciones',
      width: '20%'
    }
  ];
  file: File = undefined;
  progressSpinner: boolean = false;

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {

  }

  getFile(event: any) {

    let fileList: FileList = event.files;
    let nombreCompletoArchivo = fileList[0].name;
    this.file = fileList[0];
    this.pUploadFile.chooseLabel = nombreCompletoArchivo;
  }

  uploadFile() {
    this.progressSpinner = true;

    if (this.file != undefined) {
      this.sigaServices
        .postSendFileAndActuacion("actuaciones_designacion_subirDocumentoActDesigna", this.file, this.actuacionDesigna.actuacion.anio, this.actuacionDesigna.actuacion.numero, this.actuacionDesigna.actuacion.numeroAsunto, 'Prueba de Observaciones')
        .subscribe(
          data => {
            console.log("🚀 ~ file: tarjeta-doc-ficha-act.component.ts ~ line 73 ~ TarjetaDocFichaActComponent ~ uploadFile ~ data", data);
            this.file = null;
            this.progressSpinner = false;
          },
          error => {
            console.log(error);
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.progressSpinner = false;
            this.pUploadFile.chooseLabel = "";
          }
        );
    }
  }

}
