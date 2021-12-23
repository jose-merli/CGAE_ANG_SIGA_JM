import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { DocumentosEnviosMasivosItem } from '../../../../../models/DocumentosEnviosMasivosItem';
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-documentos-envio-masivo',
  templateUrl: './documentos-envio-masivo.component.html',
  styleUrls: ['./documentos-envio-masivo.component.scss']
})
export class DocumentosEnvioMasivoComponent implements OnInit {

  openFicha: boolean = false;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  body: DocumentosEnviosMasivosItem = new DocumentosEnviosMasivosItem();
  msgs: Message[];
  file: File = undefined;
  eliminarArray: any[];
  progressSpinner: boolean = false;
  noEditar: boolean = false;
  habilitado: boolean = true;
  noMostrar: boolean = false;

  @ViewChild('table') table: DataTable;
  selectedDatos

  fichasPosibles = [
    {
      key: "configuracion",
      activa: false
    },
    {
      key: "programacion",
      activa: false
    },
    {
      key: "destinatarios",
      activa: false
    },
    {
      key: "destinatariosIndv",
      activa: false
    },
    {
      key: "destinatariosList",
      activa: false
    },
    {
      key: "documentos",
      activa: false
    }
  ];

  constructor(
    // private router: Router,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.selectedItem = 10;

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


    this.getDatos();
    this.cols = [
      { field: 'nombreDocumento', header: this.translateService.instant("informesycomunicaciones.comunicaciones.documento.nombre") },
      { field: 'pathDocumento', header: this.translateService.instant("informesycomunicaciones.comunicaciones.documento.path") }
    ]

    this.sigaServices.habilitarDocs$.subscribe(() => {
      this.habilitado = true;
    });

    this.sigaServices.desHabilitarDocs$.subscribe(() => {
      this.habilitado = false;
    });

  }

  getDatos() {
    if (sessionStorage.getItem("enviosMasivosSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("enviosMasivosSearch"));
      if (this.body.idEstado != '1' && this.body.idEstado != '4') {
        this.noEditar = true;
      }
      if (this.body.idTipoEnvios == '4' || (this.body.idTipoEnvios == '5' && this.body.idEstado != '2')) {
        this.noEditar = true;
        this.noMostrar = true;
      }
      this.getDocumentos();
    }

  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevoEnvio") == null) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }

  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;

  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }



  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isSelectMultiple(selectedDatos) {
    
    if (this.selectedDatos != undefined) {
      if(this.selectedDatos.length == 1){
        // this.activacionEditar = true;
      }
      this.numSelected = this.selectedDatos.length;
    } else {
      this.selectedDatos = [];
    }
  }


  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  getDocumentos() {
    this.progressSpinner = true;
    this.selectedDatos = "";
    this.sigaServices.post("enviosMasivos_documentos", this.body.idEnvio).subscribe(
      data => {

        let datos = JSON.parse(data["body"]);
        this.datos = datos.documentoEnvioItem;
        this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;

      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  downloadDocumento(dato) {

    let objDownload = {
      rutaDocumento: dato[0].pathDocumento,
      nombreDocumento: dato[0].nombreDocumento,
      idEnvio: dato[0].idEnvio,
      idDocumento: dato[0].idDocumento,
      idInstitucion: dato[0].idInstitucion
    };

    this.sigaServices
      .postDownloadFiles("enviosMasivos_descargarDocumento", objDownload)
      .subscribe(data => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        if (blob.size == 0) {
          if (this.body.idTipoEnvios == '5') {//burosms
            this.showFail(this.translateService.instant(
              "messages.envioMasivo.buroSMS.descarga"
            ));
          } else {
            this.showFail(this.translateService.instant(
              "messages.general.error.ficheroNoExiste"
            ));
          }

        } else {
          saveAs(data, dato[0].nombreDocumento);
        }
        this.selectedDatos = [];
      });
  }

  eliminar(dato) {

    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.seguroEliminarDocumentos"),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarEliminar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];

        this.resetTableProperties();
        this.selectedDatos = [];
      }
    });
  }

  confirmarEliminar(dato) {
    this.eliminarArray = [];
    dato.forEach(element => {
      let objEliminar = {
        idEnvio: element.idEnvio,
        rutaDocumento: element.pathDocumento
      };
      this.eliminarArray.push(objEliminar);
    });
    this.sigaServices.post("enviosMasivos_borrarDocumento", this.eliminarArray).subscribe(
      data => {
        this.showSuccess(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.eliminadoDocumentoCorrectamente"));
      },
      err => {
        let error = JSON.parse(err.error);
        if (error.code == 400) {
          this.showInfo(this.translateService.instant("informesYcomunicaciones.enviosMasivos.documentos.mensaje.noDocumento"));

          this.getDocumentos();
          this.resetTableProperties();
        } else {
          this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorEliminadoEnvio"));
          //console.log(err);
        }

      },
      () => {
        this.getDocumentos();
        this.resetTableProperties();
        this.table.reset();
      }
    );
  }

  resetTableProperties() {
    this.selectAll = false;
    this.selectMultiple = false;
  }


  uploadFile(event: any) {
    this.numSelected = 0;
    let fileList: FileList = event.files;
    this.file = fileList[0];

    let longitudMaximaNombreFichero = 62;

    if (this.file != null) {
      let longitudMaximaNombreFichero = 60;

      if (this.file.name.length > longitudMaximaNombreFichero) {
        this.confirmationService.confirm({
          message: this.translateService.instant("mensaje.enviomasivo.adjunto.longitudnombre"),
          icon: "fa fa-trash-alt",
          accept: () => {
            this.addFile();
          },
          reject: () => {
            this.msgs = [
              {
                severity: "info",
                summary: "info",
                detail: this.translateService.instant(
                  "general.message.accion.cancelada"
                )
              }
            ];
          }
        });
      } else {
        this.addFile();
      }
      /*let longitudMaximaNombreFichero = 60;
      if (this.file.name.length > longitudMaximaNombreFichero) {
        let arrayany : any[];
        arrayany[0]=longitudMaximaNombreFichero;

        this.showFail(this.translateService.instantParam('messages.envioMasivo.longitudNombreFichero', arrayany));// 'Nombre del fichero demasiado largo. No puede exceder de ' + longitudMaximaNombreFichero + ' caracteres.');
        
      } else {
        this.addFile();
      }*/

    }


  }

  navigateTo(dato) {
    if (!this.selectMultiple) {
      let datos = [];
      datos.push(dato);
      this.downloadDocumento(datos);
    }
  }

  addFile() {

    this.progressSpinner = true;

    this.sigaServices.postSendContentAndParameter("enviosMasivos_subirDocumento", "?idEnvio=" + this.body.idEnvio, this.file).subscribe(
      data => {

        this.body.pathDocumento = data.rutaDocumento;

        this.guardar(data.nombreDocumento);
        this.progressSpinner = false;

      },
      err => {
        if (err.error != null && err.error.error != null && err.error.error.code == 400) {
          if (err.error.error.description != null) {
            this.showFail(err.error.error.description);
          } else {
            this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.formatoNoPermitido"));
          }
        } else {
          this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorSubirDocumento"));
          //console.log(err);
        }
        this.progressSpinner = false;
      },
      () => {
      }
    );
  }

  guardar(nombreDocumento) {
    this.progressSpinner = true;

    let objDoc = {
      idEnvio: this.body.idEnvio,
      rutaDocumento: this.body.pathDocumento,
      nombreDocumento: nombreDocumento
    }
    this.sigaServices.post("enviosMasivos_guardarDocumento", objDoc).subscribe(
      data => {
        this.showSuccess(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.subidoDocumentoCorrectamente"));
        this.progressSpinner = false;

      },
      err => {
        this.showFail(this.translateService.instant("informesycomunicaciones.comunicaciones.mensaje.errorGuardarDocumento"));
        this.progressSpinner = false;

        //console.log(err);
      },
      () => {
        this.getDatos();
      }
    );
  }

  actualizaSeleccionados(selectedDatos) {
    if (this.selectedDatos != undefined) {
      
      this.numSelected = this.selectedDatos.length;
    }
  }

}


