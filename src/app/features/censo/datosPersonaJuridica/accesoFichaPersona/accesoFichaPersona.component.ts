import { Component, OnInit } from "@angular/core";

import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Location } from "@angular/common";
import { ConfirmationService } from "primeng/api";
import { MessageService } from "primeng/components/common/messageservice";
import { SelectItem } from "primeng/api";

import { SigaServices } from "./../../../../_services/siga.service";

import { DatosNotarioItem } from "./../../../../../app/models/DatosNotarioItem";
import { DatosNotarioObject } from "./../../../../../app/models/DatosNotarioObject";
import { TranslateService } from "../../../../commons/translate";

import { cardService } from "./../../../../_services/cardSearch.service";
import { Subscription } from "rxjs/Subscription";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";

@Component({
  selector: "app-accesoFichaPersona",
  templateUrl: "./accesoFichaPersona.component.html",
  styleUrls: ["./accesoFichaPersona.component.scss"]
})
export class AccesoFichaPersonaComponent implements OnInit {
  comboTipoIdentificacion: SelectItem[];
  selectedTipoIdentificacion: any = {};
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
  notario: any;
  notario1: any;
  guardarNotario: boolean = false;
  desasociar: boolean = false;
  suscripcionBusquedaNuevo: Subscription;

  activacionEditar: boolean;
  file: File = undefined;

  constructor(
    private router: Router,
    private location: Location,
    private sigaServices: SigaServices,
    private cardService: cardService
  ) {}

  ngOnInit() {
    // this.checkAcceso();

    // Esto se activará cuando venimos de datos bancarios
    if (sessionStorage.getItem("abrirNotario") == "true") {
      this.openFicha = !this.openFicha;
      sessionStorage.removeItem("abrirNotario");
    }

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.tipoPersona = "Notario";

    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null) {
          this.idPersona = id;
          this.search();
        }
      }
    );

    if (
      sessionStorage.getItem("notario") != undefined &&
      sessionStorage.getItem("notario") != null
    ) {
      this.notario = JSON.parse(sessionStorage.getItem("notario"));
      // abre la ficha para que el usuario vea donde debe tocar
      this.openFicha = true;

      if (this.notario[0].idPersona != undefined) {
        // modo de asignacion de notario
        this.body.idPersonaAsociar = this.notario[0].idPersona;
        // si no se editan campos => boton guardar activo
        this.guardarNotario = true;
      } else {
        // modo de creacion + asignacion de notario
        this.editar = true;
      }
      if (this.notario[0].nif != undefined) {
        this.body.nif = this.notario[0].nif;
      }
      if (this.notario[0].nombre != undefined) {
        this.body.nombre = this.notario[0].nombre;
      } else if (this.notario[0].denominacion != undefined) {
        this.body.nombre = this.notario[0].denominacion;
      }
      if (this.notario[0].primerApellido != undefined) {
        this.body.apellido1 = this.notario[0].primerApellido;
      }
      if (this.notario[0].segundoApellido != undefined) {
        this.body.apellido2 = this.notario[0].segundoApellido;
      }
      if (this.notario[0].tipoIdentificacion != undefined) {
        this.body.tipoIdentificacion = this.notario[0].tipoIdentificacion;
      }
    }
    if (this.usuarioBody != null && this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
    }

    // si viene de pantalla de persona fisica => no hace busqueda
    if (
      sessionStorage.getItem("notario") != undefined &&
      sessionStorage.getItem("notario") != null
    ) {
      sessionStorage.removeItem("notario");
      this.obtenerTiposIdentificacion();
    } else {
      this.search();
    }
  }

  // checkAcceso() {
  //   let controlAcceso = new ControlAccesoDto();
  //   controlAcceso.idProceso = "121";
  //   let derechoAcceso;
  //   this.sigaServices.post("acces_control", controlAcceso).subscribe(
  //     data => {
  //       let permisosTree = JSON.parse(data.body);
  //       let permisosArray = permisosTree.permisoItems;
  //       derechoAcceso = permisosArray[0].derechoacceso;
  //     },
  //     err => {
  //       console.log(err);
  //     },
  //     () => {
  //       if (derechoAcceso == 3) {
  //         this.activacionEditar = true;
  //       } else {
  //         this.activacionEditar = false;
  //       }
  //     }
  //   );
  // }

  search() {
    this.progressSpinner = true;
    this.editar = false;
    this.body.idPersona = this.idPersona;
    this.body.tipoPersona = this.tipoPersona;
    this.body.idInstitucion = "";
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices
        .postPaginado("accesoFichaPersona_search", "?numPagina=1", this.body)
        .subscribe(
          data => {
            this.progressSpinner = false;
            this.bodySearch = JSON.parse(data["body"]);
            // if (this.bodySearch.fichaPersonaItem != undefined && this.bodySearch.fichaPersonaItem != null) {
            //   this.body = this.bodySearch.fichaPersonaItem[0];
            //   this.desasociar = true;
            //   this.obtenerTiposIdentificacion();
            // }
            if (
              this.bodySearch.fichaPersonaItem != undefined &&
              this.bodySearch.fichaPersonaItem != null
            ) {
              this.body = this.bodySearch.fichaPersonaItem[0];
              this.desasociar = true;
              this.obtenerTiposIdentificacion();
            } else {
              this.guardarNotario = false;
              this.desasociar = false;
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
    this.progressSpinner = false;
  }

  limpiarCamposNotario() {
    this.body.nif = "";
    this.body.nombre = "";
    this.body.apellido1 = "";
    this.body.apellido2 = "";
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

          this.showSuccess("Notario desasociado");
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          this.showFail("Ha ocurrido un error");
          console.log(error);
          this.progressSpinner = false;
        },
        () => {
          this.search();
        }
      );
  }

  guardar() {
    // si se puede editar => crear notario
    if (this.editar && this.body.nombre != undefined && this.body.apellido1) {
      if (this.body.apellido2 == undefined) {
        this.body.apellido2 = "";
      }
      this.crearNotarioYGuardar();
    } else {
      this.progressSpinner = true;
      this.body.idPersona = this.idPersona;
      this.body.tipoPersona = this.tipoPersona;
      this.body.idInstitucion = "";

      this.sigaServices.post("accesoFichaPersona_guardar", this.body).subscribe(
        data => {
          this.progressSpinner = false;
          console.log(data);
          this.body.status = data.status;

          this.showSuccess("Se ha guardado correctamente");
        },
        error => {
          this.bodySearch = JSON.parse(error["error"]);
          this.showFail(JSON.stringify(this.bodySearch.error.description));
          console.log(error);
          this.progressSpinner = false;
          this.showFail("Ha habido un error al guardar");
        },
        () => {
          this.guardarNotario = false;
          this.search();
        }
      );
    }
  }

  crearNotarioYGuardar() {
    this.sigaServices.post("fichaPersona_crearNotario", this.body).subscribe(
      data => {
        this.body.idPersonaAsociar = JSON.parse(
          data["body"]
        ).combooItems[0].value;
      },
      error => {
        console.log(error);
      },
      () => {
        this.progressSpinner = true;
        this.body.idPersona = this.idPersona;
        this.body.tipoPersona = this.tipoPersona;
        this.body.idInstitucion = "";

        this.sigaServices
          .post("accesoFichaPersona_guardar", this.body)
          .subscribe(
            data => {
              this.progressSpinner = false;
              console.log(data);
              this.body.status = data.status;

              this.showSuccess("Se ha creado correctamente");
            },
            error => {
              this.bodySearch = JSON.parse(error["error"]);
              this.showFail(JSON.stringify(this.bodySearch.error.description));
              console.log(error);

              this.showFail("Ha habido un error al crear el notario");
              this.progressSpinner = false;
            },
            () => {
              this.guardarNotario = false;
              this.search();
            }
          );
      }
    );
  }

  activarGuardarNotarioNoExistente(event) {
    console.log(event);
    if (
      this.editar &&
      this.body.nombre != undefined &&
      this.body.nombre.trim() != "" &&
      this.body.apellido1 != undefined &&
      this.body.apellido1 != ""
    ) {
      this.guardarNotario = true;
    } else {
      if (this.editar) {
        this.guardarNotario = false;
      }
    }
  }

  obtenerTiposIdentificacion() {
    this.sigaServices.get("fichaPersona_tipoIdentificacionCombo").subscribe(
      n => {
        this.comboTipoIdentificacion = n.combooItems;

        // obtener la identificacion a seleccionar
        if (this.body.tipoIdentificacion != undefined) {
          let ident = this.comboTipoIdentificacion.find(
            item => item.value == this.body.tipoIdentificacion
          );

          this.selectedTipoIdentificacion = ident.value;
        } else {
          let ident: SelectItem;
          ident.value = "";
          this.selectedTipoIdentificacion = ident;
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  filtrarItemsComboEsquema(comboEsquema, buscarElemento) {
    return comboEsquema.filter(function(obj) {
      return obj.value == buscarElemento;
    });
  }

  abrirFicha() {
    // si no se esta creando una nueva sociedad
    if (sessionStorage.getItem("crearnuevo") == null) {
      this.openFicha = !this.openFicha;
    }
  }

  backTo() {
    this.location.back();
  }

  isSearch() {
    this.router.navigate(["/busquedaGeneral"]);
  }

  redireccionar() {
    this.openFicha = !this.openFicha;
    //Aquí debajo lo que vaya a hacer
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

  clear() {
    this.msgs = [];
  }
}
