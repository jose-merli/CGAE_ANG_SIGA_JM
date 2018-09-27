import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { TranslateService } from "../../../../commons/translate";
import { SigaServices } from "../../../../_services/siga.service";
import { saveAs } from "file-saver/FileSaver";
import { CargaMasivaItem } from "../../../../models/CargaMasivaItem";
import { CargaMasivaObject } from "../../../../models/CargaMasivaObject";
import { DatePipe } from "../../../../../../node_modules/@angular/common";
import { esCalendar } from "../../../../utils/calendar";

@Component({
  selector: "app-carga-etiquetas",
  templateUrl: "./carga-etiquetas.component.html",
  styleUrls: ["./carga-etiquetas.component.scss"]
})
export class CargaEtiquetasComponent implements OnInit {
  showDatos: boolean = true;
  buscar: boolean = false;
  fechaCargaSelect: Date;

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

  progressSpinner: boolean = false;
  body: CargaMasivaItem = new CargaMasivaItem();
  etiquetasSearch = new CargaMasivaObject();

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe
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
    this.showDatos = !this.showDatos;
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

  //Busca colegiados según los filtros
  isBuscar() {
    this.buscar = true;
    this.progressSpinner = true;
    this.buscar = true;

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
          this.table.paginator = true;
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
}
