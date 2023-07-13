import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Response } from "@angular/http";
import { DomSanitizer } from "@angular/platform-browser";
import { saveAs } from "file-saver/FileSaver";
import { DatePipe } from "../../../../../../node_modules/@angular/common";
import { CommonsService } from '../../../../_services/commons.service';
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { CargaMasivaItem } from "../../../../models/CargaMasivaItem";
import { CargaMasivaObject } from "../../../../models/CargaMasivaObject";
import { ErrorItem } from "../../../../models/ErrorItem";
import { esCalendar } from "../../../../utils/calendar";
import { KEY_CODE } from "../../../administracion/catalogos-maestros/catalogos-maestros.component";
// export class ReplaceLineBreaks implements PipeTransform {
//   transform(value: string): string {
//     return value.replace(/\n/g, "<br/>");
//   }
// }

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

  @ViewChild("table") table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  numSelected: number = 0;
  selectedItem: number = 10;

  @ViewChild("pUploadFile") pUploadFile;

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
    private domSanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef,
    private commonsService: CommonsService,
    private translateService: TranslateService
  ) { }

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
        header: "cargaMasivaDatosCurriculares.numRegistrosCorrectos.literal"
      },
      {
        field: "registrosErroneos",
        header: "cargaMasivaDatosCurriculares.numRegistrosErroneos.literal"
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
    let fileList: FileList = event.files;
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
      this.showMessage(
        "info",
        "Información",
        "La extensión del fichero no es correcta."
      );
      this.uploadFileDisable = true;
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.uploadFileDisable = false;
      this.existeArchivo = true;
      this.pUploadFile.chooseLabel = nombreCompletoArchivo;
    }
  }

  uploadFile(event: any) {
    this.progressSpinner = true;
    if (this.file != undefined) {
      this.sigaServices
        .postSendContent("cargaMasivaDatosCurriculares_uploadFile", this.file)
        .subscribe(
          data => {
            this.file = null;
            this.progressSpinner = false;
            this.uploadFileDisable = true;
            this.body.errores = data["error"];
            let mensaje = this.body.errores.message.toString();

            if (data["error"].code == 200) {
              this.showMessage("success", "Correcto", data["error"].message);
            } else if (data["error"].code == null) {
              this.showMessage("info", "Información", data["error"].message);
            }
          },
          error => {
            //console.log(error);
            this.showFail("Error en la subida del fichero.");
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.progressSpinner = false;
            this.pUploadFile.chooseLabel = "Seleccionar Archivo";
          }
        );
    }
  }

  showFailUploadedImage() { }

  isBuscar() {
    this.buscar = true;
    this.progressSpinner = true;
    this.buscar = true;

    // Deshabilitar
    this.selectedDatos = [];

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
          this.table.reset();
          this.numSelected = this.selectedDatos.length;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
          setTimeout(()=>{
            this.commonsService.scrollTablaFoco('tablaFoco');
          }, 5);
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
          if (this.body.nombreFichero == undefined) {
            saveAs(blob, "PlantillaMasivaDatosCV.xls");
          } else {
            saveAs(blob, this.body.nombreFichero);
          }
          this.progressSpinner = true;
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

          if (data.size != 0) {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, this.body.nombreFichero);
          } else {
            let msg = this.translateService.instant("messages.general.error.ficheroNoExiste");
            this.showFail(msg);
          }
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

          if (data.size != 0) {
            const blob = new Blob([data], { type: "text/csv" });
            saveAs(blob, this.body.nombreFichero);
          } else {
            let msg = this.translateService.instant("messages.general.error.ficheroNoExiste");
            this.showFail(msg);
          }

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

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: mensaje
    });
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  // PARA LA TABLA
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  clear() {
    this.msgs = [];
  }

  fillFechaCarga(event) {
    this.fechaCargaSelect = event;
  }

  detectFechaCargaInput(event) {
    this.fechaCargaSelect = event;
  }

  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }
}
