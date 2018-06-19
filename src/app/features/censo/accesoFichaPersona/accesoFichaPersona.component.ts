import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";

import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Location } from "@angular/common";

import { SelectItem } from "primeng/api";

import { SigaServices } from "./../../../_services/siga.service";

import { DatosNotarioItem } from "./../../../../app/models/DatosNotarioItem";
import { DatosNotarioObject } from "./../../../../app/models/DatosNotarioObject";

@Component({
  selector: "app-accesoFichaPersona",
  templateUrl: "./accesoFichaPersona.component.html",
  styleUrls: ["./accesoFichaPersona.component.scss"]
})
export class AccesoFichaPersonaComponent implements OnInit {
  comboTipoIdentificacion: SelectItem[];
  comboSituacion: SelectItem[];
  selectedcomboTipoIdentificacion: string;

  msgs: Message[];

  openFicha: boolean = false;
  editar: boolean = false;
  archivoDisponible: boolean = false;
  progressSpinner: boolean = false;

  body: DatosNotarioItem = new DatosNotarioItem();
  bodySearch: DatosNotarioObject = new DatosNotarioObject();

  idPersona: String;
  tipoPersona: String;

  usuarioBody: any[];

  file: File = undefined;

  constructor(
    private router: Router,
    private location: Location,
    private sigaServices: SigaServices
  ) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));

    this.idPersona = this.usuarioBody[0].idPersona;
    this.tipoPersona = "Notario";

    this.search();

    this.comboTipoIdentificacion = [
      { label: "NIF", value: "NIF" },
      { label: "NIE", value: "NIE" }
    ];

    this.comboSituacion = [
      { label: "", value: "" },
      { label: "Ejerciente Residente", value: "Ejerciente Residente" },
      { label: "No colegiado", value: "No colegiado" },
      { label: "Sociedad", value: "Sociedad" }
    ];
  }

  search() {
    this.progressSpinner = true;
    this.editar = false;
    this.body.idPersona = this.idPersona;
    this.body.tipoPersona = this.tipoPersona;
    this.body.idInstitucion = "";

    this.sigaServices
      .postPaginado("accesoFichaPersona_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log("hloo", data);
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data["body"]);
          if (this.bodySearch.fichaPersonaItem != null) {
            this.body = this.bodySearch.fichaPersonaItem[0];
          } else {
            this.limpiarCamposNotario();
          }
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        }
      );
  }

  limpiarCamposNotario() {
    this.body.nif = "";
    this.body.nombre = "";
    this.body.apellido1 = "";
    this.body.apellido2 = "";
    this.body.situacion = "";
    this.body.numeroColegiado = "";
    this.body.fechaAlta = undefined;
  }

  desasociarPersona() {
    this.progressSpinner = true;
    this.body.idPersonaDesasociar = this.body.idPersona;
    this.body.idPersona = this.idPersona;
    this.body.tipoPersona = this.tipoPersona;
    this.body.idInstitucion = "";

    this.sigaServices
      .post("accesoFichaPersona_desasociarPersona", this.body)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.body.status = data.status;
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.search();
        }
      );
  }

  guardar() {
    this.progressSpinner = true;
    this.body.idPersona = this.idPersona;
    this.body.tipoPersona = this.tipoPersona;
    this.body.idInstitucion = "";

    this.sigaServices.post("accesoFichaPersona_guardar", this.body).subscribe(
      data => {
        this.progressSpinner = false;
        console.log(data);
        this.body.status = data.status;
      },
      error => {
        this.bodySearch = JSON.parse(error["error"]);
        this.showFail(JSON.stringify(this.bodySearch.error.description));
        console.log(error);
        this.progressSpinner = false;
      }
    );
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  backTo() {
    this.location.back();
  }

  isSearch() {
    this.router.navigate(["/busquedaGeneral"]);
  }

  redireccionar() {}

  uploadImage(event: any) {
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
      !/\.(gif|jpg|jpeg|tiff|png)$/i.test(extensionArchivo.trim().toUpperCase())
    ) {
      // Mensaje de error de formato de imagen y deshabilitar boton guardar
      this.file = undefined;
      this.archivoDisponible = false;
      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
    }
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Formato incorrecto de imagen seleccionada"
    });
  }

  seleccionarFecha(event) {}

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }
}
