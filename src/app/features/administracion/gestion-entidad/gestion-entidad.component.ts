import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";

import { SigaServices } from "./../../../_services/siga.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { SigaWrapper } from "../../../wrapper/wrapper.class";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/components/common/api";
import { TooltipModule } from "primeng/tooltip";
import { ListboxModule } from "primeng/listbox";
import { FileUploadModule } from "primeng/fileupload";

@Component({
  selector: "app-etiquetas",
  templateUrl: "./gestion-entidad.component.html",
  styleUrls: ["./gestion-entidad.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class GestionEntidad extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  lenguajeInstitucion: any;
  idiomaBusqueda: any[];
  selectedIdiomaBusqueda: any;
  valorDefectoIdioma: any;
  msgs: Message[] = [];
  guardarHabilitado: boolean = true;
  archivoDisponible: boolean = false;
  file: File = undefined;
  nombreImagen: any;
  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    this.sigaServices.get("entidad_lenguajeInstitucion").subscribe(
      n => {
        this.lenguajeInstitucion = n.idLenguaje;

        this.sigaServices.get("entidad_lenguaje").subscribe(
          n => {
            this.idiomaBusqueda = n.combooItems;

            this.valorDefectoIdioma = this.idiomaBusqueda.find(
              item => item.value == this.lenguajeInstitucion
            );

            if (this.valorDefectoIdioma != undefined) {
              this.selectedIdiomaBusqueda = this.valorDefectoIdioma.value;
            }
          },
          err => {
            console.log(err);
          }
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  showSuccessUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: "imagen guardada correctamente"
    });
  }

  showSuccessUploadedLenguage() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: "idioma actualizado correctamente"
    });
  }

  showFailUploadedImage() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: "Formato incorrecto de imagen seleccionada"
    });
  }

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
      this.nombreImagen = "";
      this.showFailUploadedImage();
    } else {
      // se almacena el archivo para habilitar boton guardar
      this.file = fileList[0];
      this.archivoDisponible = true;
      this.nombreImagen = nombreCompletoArchivo;
    }
  }

  isGuardar() {
    // comprobar que se pasa bien el idlenguaje a back

    // guardar imagen
    if (this.file != undefined) {
      this.sigaServices
        .postSendContent("entidad_uploadFile", this.file)
        .subscribe(
          data => {
            console.log(data);
            this.file = undefined;
            this.archivoDisponible = false;
            this.nombreImagen = "";
            this.showSuccessUploadedImage();
          },
          err => {
            console.log(err);
          }
        );
    }

    // actualizar idLenguaje
    if (
      this.selectedIdiomaBusqueda != "" ||
      this.selectedIdiomaBusqueda != undefined
    ) {
      this.sigaServices
        .post(
          "entidad_uploadLenguage",
          JSON.stringify(this.selectedIdiomaBusqueda)
        )
        .subscribe(
          data => {
            console.log(data);
            this.lenguajeInstitucion = this.selectedIdiomaBusqueda;
            this.showSuccessUploadedLenguage();
          },
          err => {
            console.log(err);
          }
        );
    }
  }
  isHabilitadoGuardar() {
    if (
      (this.selectedIdiomaBusqueda != this.lenguajeInstitucion &&
        this.selectedIdiomaBusqueda != "" &&
        this.selectedIdiomaBusqueda != undefined) ||
      this.file != undefined
    ) {
      this.guardarHabilitado = false;
    } else this.guardarHabilitado = true;

    return this.guardarHabilitado;
  }
}
