import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { DocComunicacionesItem } from "../../../../../models/DocumentosComunicacionesItem";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: "app-documentos",
  templateUrl: "./documentos.component.html",
  styleUrls: ["./documentos.component.scss"]
})
export class DocumentosComponent implements OnInit {
  openFicha: boolean = false;
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;

  numSelected: number = 0;
  rowsPerPage: any = [];
  body: DocComunicacionesItem = new DocComunicacionesItem();
  msgs: Message[];
  file: File = undefined;
  eliminarArray: any[];
  progressSpinner: boolean = false;

  @ViewChild("table") table: DataTable;
  selectedDatos;

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
  ) {}

  ngOnInit() {
    this.selectedItem = 10;
    this.getDatos();
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
    this.cols = [
      { field: "nombreDocumento", header: "informesycomunicaciones.comunicaciones.documento.nombre" },
      { field: "pathDocumento", header: "informesycomunicaciones.comunicaciones.documento.nombre" }
    ];
  }

  getDatos() {
    if (sessionStorage.getItem("comunicacionesSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("comunicacionesSearch"));
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
    if (sessionStorage.getItem("crearNuevaCom") == null) {
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

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  getDocumentos() {
    this.progressSpinner = true;
    this.sigaServices
      .post("enviosMasivos_documentos", this.body.idEnvio)
      .subscribe(
        data => {
          let datos = JSON.parse(data["body"]);
          this.datos = datos.documentoEnvioItem;
        },
        err => {
          console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadDocumento(dato) {
    let objDownload = {
      rutaDocumento: dato.pathDocumento,
      nombreDocumento: dato.nombreDocumento,
      idEnvio: this.body.idEnvio
    };
   this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("comunicaciones_descargarDocumento", objDownload)
      .subscribe(data => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        
        //REVISAR: esta comprobación actual puede provocar que salte error en algunos archivos de prueba subidos 
        //que están vacios.
        if (blob.size == 0) {
          this.showFail(
            this.translateService.instant(
              "messages.general.error.ficheroNoExiste"
            )
          );
        } else {
          saveAs(data, dato.nombreDocumento);
        }
        this.selectedDatos = [];
      },
      err => {
        console.log(err);
        this.showFail(this.translateService.instant("messages.general.error.ficheroNoExiste"));
        this.progressSpinner = false;
      }, () =>{
        this.progressSpinner = false;
      });
  }

  eliminar(dato) {
    this.confirmationService.confirm({
      // message: this.translateService.instant("messages.deleteConfirmation"),
      message: this.translateService.instant(
        "informesycomunicaciones.comunicaciones.mensaje.seguroEliminarDocumentos"
      ),
      icon: "fa fa-trash-alt",
      accept: () => {
        this.confirmarEliminar(dato);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: this.translateService.instant(
              "general.message.informacion"
            ),
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
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
    this.sigaServices
      .post("enviosMasivos_borrarDocumento", this.eliminarArray)
      .subscribe(
        data => {
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.comunicaciones.mensaje.eliminadoDocumentoCorrectamente"
            )
          );
        },
        err => {
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.comunicaciones.mensaje.errorEliminadoEnvio"
            )
          );
          console.log(err);
        },
        () => {
          this.getDocumentos();
          this.table.reset();
        }
      );
  }

  uploadFile(event: any) {
    let fileList: FileList = event.files;
    this.file = fileList[0];

    this.addFile();
  }

  navigateTo(dato) {
    this.downloadDocumento(dato);
  }

  addFile() {
    this.progressSpinner = true;

    this.sigaServices
      .postSendContent("enviosMasivos_subirDocumento", this.file)
      .subscribe(
        data => {
          this.body.pathDocumento = data.rutaDocumento;

          this.guardar(data.nombreDocumento);
        },
        err => {
          if (err.error.error.code == 400) {
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.comunicaciones.mensaje.formatoNoPermitido"
              )
            );
          } else {
            this.showFail(
              this.translateService.instant(
                "informesycomunicaciones.comunicaciones.mensaje.errorSubirDocumento"
              )
            );
            console.log(err);
          }
          this.progressSpinner = false;
        },
        () => {}
      );
  }

  guardar(nombreDocumento) {
    let objDoc = {
      idEnvio: this.body.idEnvio,
      rutaDocumento: this.body.pathDocumento,
      nombreDocumento: nombreDocumento
    };
    this.sigaServices.post("enviosMasivos_guardarDocumento", objDoc).subscribe(
      data => {
        this.showSuccess(
          this.translateService.instant(
            "informesycomunicaciones.comunicaciones.mensaje.subidoDocumentoCorrectamente"
          )
        );
      },
      err => {
        this.showFail(
          this.translateService.instant(
            "informesycomunicaciones.comunicaciones.mensaje.errorGuardarDocumento"
          )
        );
        console.log(err);
      },
      () => {
        this.getDatos();
      }
    );
  }
}
