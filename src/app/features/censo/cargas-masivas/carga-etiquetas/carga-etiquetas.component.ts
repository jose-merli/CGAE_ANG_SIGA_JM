import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { TranslateService } from "../../../../commons/translate";
import { SigaServices } from "../../../../_services/siga.service";

@Component({
  selector: "app-carga-etiquetas",
  templateUrl: "./carga-etiquetas.component.html",
  styleUrls: ["./carga-etiquetas.component.scss"]
})
export class CargaEtiquetasComponent implements OnInit {
  showDatosCv: boolean = true;
  buscar: boolean = false;
  fechaCarga: Date;

  file: File = undefined;

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
    private changeDetectorRef: ChangeDetectorRef
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

  uploadFile(event: any) {
    console.log("Event", event);
    // guardamos la imagen en front para despues guardarla, siempre que tenga extension de imagen
    let fileList: FileList = event.target.files;

    let nombreCompletoArchivo = fileList[0].name;
    let extensionArchivo = nombreCompletoArchivo.substring(
      nombreCompletoArchivo.lastIndexOf("."),
      nombreCompletoArchivo.length
    );

    if (extensionArchivo == null) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;

      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
    }
  }

  showFailUploadedImage() {}

  isBuscar() {
    this.buscar = true;
  }

  downloadFile(data: Response) {
    var blob = new Blob([data], { type: "text/csv" });
    var url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
}
