import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { TranslateService } from "../../../../commons/translate";
import { SigaServices } from "../../../../_services/siga.service";
import { saveAs } from "file-saver/FileSaver";
import { DomSanitizer } from "@angular/platform-browser";
import { CargaMasivaItem } from "../../../../models/CargaMasivaItem";
import { CargaMasivaObject } from "../../../../models/CargaMasivaObject";
import { DatePipe } from "../../../../../../node_modules/@angular/common";
import { ErrorItem } from "../../../../models/ErrorItem";
import { ConfirmationService } from "primeng/api";
import { esCalendar } from "../../../../utils/calendar";
import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "replaceLineBreaks" })
export class ReplaceLineBreaks implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\n/g, "<br/>");
  }
}

@Component({
  selector: "app-datos-cv",
  templateUrl: "./datos-cv.component.html",
  styleUrls: ["./datos-cv.component.scss"]
})
export class DatosCvComponent implements OnInit {
  showDatosCv: boolean = true;
  buscar: boolean = false;
  archivoDisponible: boolean = false;
  existeArchivo: boolean = false;
  fechaCargaSelect: Date;
  es: any = esCalendar;
  msgs: any;

  file: File = undefined;

  save_file: any;

  @ViewChild("table")
  table;

  @ViewChild("pUploadFile")
  pUploadFile;

  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  @ViewChild("fileUpload")
  fileUpload;

  display: boolean = false;
  clear: boolean = false;
  uploadFileDisable: boolean = true;
  downloadFileDisable: boolean = true;
  downloadFileLogDisable: boolean = true;
  progressSpinner: boolean = false;

  body: CargaMasivaItem = new CargaMasivaItem();
  etiquetasSearch = new CargaMasivaObject();
  errores = new ErrorItem();

  mensaje: String;

  constructor(
    private sigaServices: SigaServices,
    private datePipe: DatePipe,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.cols = [
      { field: "fechaCarga", header: "censo.datosCv.literal.fechaCarga" },
      {
        field: "usuario",
        header: "general.boton.usuario"
      },
      {
        field: "nombreFichero",
        header: "censo.cargaMasivaDatosCurriculares.literal.nombreFichero"
      },
      {
        field: "registrosCorrectos",
        header: "cargaMasivaDatosCurriculares.numRegistros.literal"
      },
      {
        field: "registrosErroneos",
        header: "cargaMasivaDatosCurriculares.numRegistros.literal"
      }
    ];

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

  onHideDatosCv() {
    this.showDatosCv = !this.showDatosCv;
  }

  getFile(event: any) {
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;
    this.uploadFileDisable = false;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (
      extensionArchivo == null ||
      extensionArchivo.trim() == "" ||
      !/\.(xls|xlsx)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;
      this.archivoDisponible = false;
      this.existeArchivo = false;
      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      //
      this.existeArchivo = true;
      let urlCreator = window.URL;
      this.save_file = this.domSanitizer.bypassSecurityTrustUrl(
        urlCreator.createObjectURL(this.file)
      );
    }
  }

  uploadFile(event: any) {
    this.progressSpinner = true;
    if (this.file != undefined) {
      console.log("Este es el archivo que enviaremos", this.file);
      this.sigaServices
        .postSendContent("cargaMasivaDatosCurriculares_uploadFile", this.file)
        .subscribe(
          data => {
            this.file = null;
            this.progressSpinner = false;
            this.uploadFileDisable = true;
            this.body.errores = data["error"];
            let mensaje = this.body.errores.message.toString();

            this.showSuccess(mensaje);
          },
          error => {
            console.log(error);
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.progressSpinner = false;
          }
        );
    }
  }

  showFailUploadedImage() {}

  isBuscar() {
    this.buscar = true;
    this.progressSpinner = true;
    this.buscar = true;

    this.body.tipoCarga = "CV";

    if (this.fechaCargaSelect != undefined || this.fechaCargaSelect != null) {
      this.body.fechaCarga = this.datePipe.transform(
        this.fechaCargaSelect,
        "dd/MM/yyyy"
      );
    } else {
      this.body.fechaCarga = null;
    }

    this.sigaServices
      .postPaginado(
        "cargaMasivaDatosCurriculares_searchCV",
        "?numPagina=1",
        this.body
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.etiquetasSearch = JSON.parse(data["body"]);
          this.datos = this.etiquetasSearch.cargaMasivaItem;
          this.numSelected = this.datos.length;
          this.table.reset();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadFile(data: Response) {
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles(
        "cargaMasivaDatosCurriculares_generateExcelCV",
        this.body
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaMasivaDatosCV.xls");
          this.progressSpinner = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  confirmationErrors() {
    //this.display = false;
    this.fileUpload.clear();
  }

  downloadOriginalFile(selectedDatos) {
    this.body = selectedDatos;
    this.progressSpinner = true;

    this.sigaServices
      .postDownloadFiles(
        "cargaMasivaDatosCurriculares_downloadOriginalFile",
        this.body
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaMasivaDatosCV_Original.xls");
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  downloadLogFile(selectedDatos) {
    this.body = selectedDatos;
    this.progressSpinner = true;

    this.sigaServices
      .postDownloadFiles(
        "cargaMasivaDatosCurriculares_downloadLogFile",
        this.body
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaMasivaDatosCV_Errores.xls");
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        }
      );
  }

  changeDisabledButton() {
    if (this.pUploadFile.files.length == 0) {
      this.uploadFileDisable = true;
    } else {
      this.uploadFileDisable = false;
    }
  }

  disabledButtons(selectedDatos) {
    this.downloadFileDisable = false;
    this.numSelected = 1;
    if (selectedDatos.registrosErroneos == 0) {
      this.downloadFileLogDisable = true;
    } else {
      this.downloadFileLogDisable = false;
    }
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }
}
