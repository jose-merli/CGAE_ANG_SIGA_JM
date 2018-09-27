import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { TranslateService } from "../../../../commons/translate";
import { SigaServices } from "../../../../_services/siga.service";
import { saveAs } from "file-saver/FileSaver";
import { DomSanitizer } from "@angular/platform-browser";

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

  fechaCarga: Date;

  file: File = undefined;

  save_file: any;

  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any[];
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getInfo();
  }

  getInfo() {
    this.datos = [
      {
        fechaCarga: "25/09/18",
        usuario: "FEDE",
        nombreFichero: "inventado.pdf",
        registros: "1"
      },
      {
        fechaCarga: "25/09/18",
        usuario: "PEPE",
        nombreFichero: "inventado.pdf",
        registros: "1"
      }
    ];

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
        field: "registros",
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

  uploadFile() {
    if (this.file != undefined) {
      console.log("Este es el archivo que enviaremos", this.file);
      this.sigaServices
        .postSendContent("cargaMasivaDatosCurriculares_uploadFile", this.file)
        .subscribe(
          data => {
            this.file = undefined;
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  showFailUploadedImage() {}

  isBuscar() {
    this.buscar = true;
  }

  downloadFile() {
    this.sigaServices
      .get("cargaMasivaDatosCurriculares_downloadFile")
      .subscribe(
        response => {
          // const blob = new Blob([response.blob()], { type: "text/xls" });
          // let filename = response.headers.get("Content-Disposition");
          // saveAs(blob, filename);

          var blob = new Blob([response], { type: "application/octet-stream" });
          var fileName = "myFileName.myExtension";
          saveAs(blob, fileName);

          console.log("blob", blob);
          console.log("hola");
        },
        err => {
          console.log("adios");
        }
      );
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
}
