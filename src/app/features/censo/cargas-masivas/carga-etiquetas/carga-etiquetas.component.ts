import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { SigaServices } from "../../../../_services/siga.service";
import { saveAs } from "file-saver/FileSaver";
import { CargaMasivaItem } from "../../../../models/CargaMasivaItem";
import { CargaMasivaObject } from "../../../../models/CargaMasivaObject";
import { DatePipe } from "../../../../../../node_modules/@angular/common";
import { esCalendar } from "../../../../utils/calendar";
import { DomSanitizer } from "../../../../../../node_modules/@angular/platform-browser";

@Component({
  selector: "app-carga-etiquetas",
  templateUrl: "./carga-etiquetas.component.html",
  styleUrls: ["./carga-etiquetas.component.scss"]
})
export class CargaEtiquetasComponent implements OnInit {
  showDatos: boolean = true;
  buscar: boolean = false;
  fechaCargaSelect: Date;
  archivoDisponible: boolean = false;
  existeArchivo: boolean = false;
  save_file: any;
  msgs: any;

  file: File = undefined;
  es: any = esCalendar;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  numSelected: number = 0;
  selectedItem: number = 10;

  @ViewChild("pUploadFile")
  pUploadFile;

  progressSpinner: boolean = false;
  body: CargaMasivaItem = new CargaMasivaItem();
  etiquetasSearch = new CargaMasivaObject();
  uploadFileDisable: boolean = true;
  downloadFileDisable: boolean = true;
  downloadFileLogDisable: boolean = true;
  history: boolean = false;

  constructor(
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
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
    this.showDatos = !this.showDatos;
  }

  uploadFile(event: any) {
    this.progressSpinner = true;
    if (this.file != undefined) {
      console.log("Este es el archivo que enviaremos", this.file);
      this.sigaServices
        .postSendContent("cargasMasivasEtiquetas_uploadFile", this.file)
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
            this.showFail("Error en la subida del fichero.");
            this.progressSpinner = false;
          },
          () => {
            this.pUploadFile.clear();
            this.progressSpinner = false;
          }
        );
    }
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

  showFailUploadedImage() {}

  changeDisabledButton() {
    if (this.pUploadFile.files.length == 0) {
      this.uploadFileDisable = true;
    } else {
      this.uploadFileDisable = false;
    }
  }

  //Busca colegiados según los filtros
  isBuscar() {
    this.buscar = true;
    this.progressSpinner = true;

    // Deshabilitamos
    this.history = false;
    this.selectedDatos = [];

    this.body.tipoCarga = "GF";

    if (this.fechaCargaSelect != undefined || this.fechaCargaSelect != null) {
      this.body.fechaCarga = this.datePipe.transform(
        this.fechaCargaSelect,
        "dd/MM/yyyy"
      );
    } else {
      this.body.fechaCarga = null;
    }

    this.sigaServices
      .postPaginado("cargasMasivas_searchEtiquetas", "?numPagina=1", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.etiquetasSearch = JSON.parse(data["body"]);
          this.datos = this.etiquetasSearch.cargaMasivaItem;
          this.table.reset();
          this.numSelected = this.selectedDatos.length;
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
      .postDownloadFiles("cargasMasivas_descargarEtiquetas", this.body)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaMasivaDatosGF.xls");
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

  downloadOriginalFile(selectedDatos) {
    this.body = selectedDatos;
    this.progressSpinner = true;
    this.sigaServices
      .postDownloadFiles("cargasMasivas_downloadOriginalFile", this.body)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaMasivaDatosGF_Original.xls");
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
      .postDownloadFiles("cargasMasivas_downloadLogFile", this.body)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaMasivaDatosGF_Errores.xls");
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
      summary: "Incorrecto",
      detail: mensaje
    });
  }

  // PARA LA TABLA
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  setItalic(datoH) {
    if (datoH.fechaCarga < new Date()) return false;
    else return true;
  }

  loadHistory() {
    this.history = true;
    this.buscar = false;
    this.selectedDatos = [];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
}
