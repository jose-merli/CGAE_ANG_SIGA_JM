import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../node_modules/@angular/forms";
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaWrapper } from "../../wrapper/wrapper.class";
import { esCalendar } from "./../../utils/calendar";
import { SigaServices } from "./../../_services/siga.service";
import { Location } from '@angular/common'
import { TranslateService } from '../translate';
import { PersistenceService } from '../../_services/persistence.service';
import { FiltrosBusquedaAsuntosComponent } from "./filtros-busqueda-asuntos/filtros-busqueda-asuntos.component";
import { TablaBusquedaAsuntosComponent } from "./tabla-busqueda-asuntos/tabla-busqueda-asuntos.component";
import { ConfirmationService } from 'primeng/api';
import { AsuntosJusticiableItem } from "../../models/sjcs/AsuntosJusticiableItem";
import { EJGItem } from "../../models/sjcs/EJGItem";
import { DesignaItem } from "../../models/sjcs/DesignaItem";
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-asuntos",
  templateUrl: "./busqueda-asuntos.component.html",
  styleUrls: ["./busqueda-asuntos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaAsuntosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showJusticiable: boolean = true;
  showEJG: boolean = true;
  progressSpinner: boolean = false;
  msgs: any[];
  formBusqueda: FormGroup;
  numSelected: number = 0;
  body: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: string = "Seleccionar";
  buscar: boolean = false;
  fromEJG: boolean = false;
  fromDES: boolean = false;
  datosAsociar;
  datosDesigna;

  es: any = esCalendar;
  permisoEscritura: any;
  @ViewChild(FiltrosBusquedaAsuntosComponent) filtros;
  @ViewChild(TablaBusquedaAsuntosComponent) tabla;

  //Diálogo de comunicación
  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private persistenceService: PersistenceService,
    private location: Location,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;
  datos;

  ngOnInit() {

    //asociar desde EJG
    if (sessionStorage.getItem('EJG')) {
      this.datos = JSON.parse(sessionStorage.getItem('EJG'));
      this.fromEJG = true;
      sessionStorage.removeItem('EJG');
    }

    //Asociar desde designacion
    if (sessionStorage.getItem('Designacion')) {
      this.datosDesigna = JSON.parse(sessionStorage.getItem('Designacion'));
      this.fromDES = true;
      sessionStorage.removeItem('Designacion');
    }


    /*   if (sessionStorage.getItem('EJGSoj')) {
        this.datos = JSON.parse(sessionStorage.getItem('EJGSoj'));
        this.from = true;
        sessionStorage.removeItem('EJGSoj');
      }
      if (sessionStorage.getItem('EJGAsistencia')) {
        this.datos = JSON.parse(sessionStorage.getItem('EJGAsistencia'));
        this.from = true;
        sessionStorage.removeItem('EJGAsistencia');
      } */




    // this.commonsService.checkAcceso()
    //   .then(respuesta => {
    //     this.permisoEscritura = respuesta;
    //     this.persistenceService.setPermisos(this.permisoEscritura);

    //     if (this.permisoEscritura == undefined) {
    //       sessionStorage.setItem("codError", "403");
    //       sessionStorage.setItem(
    //         "descError",
    //         this.translateService.instant("generico.error.permiso.denegado")
    //       );
    //       this.router.navigate(["/errorAcceso"]);
    //     }
    //     this.getInstitucion();
    //   }
    //   ).catch(error => console.error(error));

  }
  asociarElement(event) {
    if (!(event == null || event == undefined)) {
      this.datosAsociar = event;
      // if (this.fromEJG) this.asociarEJG(this.datosAsociar);
      if (this.fromEJG) this.confirmCopiarEJG(this.datosAsociar);
      else if (this.fromDES) this.confirmCopiarDES(this.datosAsociar);
    }
  }

  searchEvent(event) {
    this.search(event);
  }

  resetTableEvent(event) {
    if (event == true) {
      this.body = [];
    }
  }

  searchHistorico(event) {
    this.search(event)
  }

  backTo() {
    sessionStorage.removeItem("radioTajertaValue");
    this.location.back();
  }

  confirmAsociarEJG(data) {
    let mess = this.translateService.instant(
      "general.message.aceptar"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.confirmCopiarEJG(data);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  confirmCopiarEJG(data) {
    //Introducir etiqueta en la BBDD
    let mess = "¿Desea copiar los datos del EJG en el asunto seleccionado?";
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "copy",
      message: mess,
      icon: icon,
      accept: () => {
        this.asociarEJG(data, true);
      },
      reject: () => {
        this.asociarEJG(data, false);
      }
    });
  }

  confirmCopiarDES(data) {
    //Introducir etiqueta en la BBDD
    let mess = "¿Desea copiar los datos de la designación en el asunto seleccionado?";
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "copy",
      message: mess,
      icon: icon,
      accept: () => {
        this.asociarDES(data, true);
      },
      reject: () => {
        this.asociarDES(data, false);
      }
    });
  }


  asociarEJG(data, copy) {
    if (this.datos != null) {
      this.progressSpinner = true;
      let radioValue = sessionStorage.getItem("radioTajertaValue");
      switch (radioValue) {
        case 'des':
          let datos = [data.idinstitucion, data.anio, data.numero,
          data.idTipoDesigna, this.datos.tipoEJG, this.datos.annio, this.datos.numero, data.turnoGuardia
          ];
          this.sigaServices.post("gestionejg_asociarDesignacion", datos).subscribe(
            m => {
              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");

              if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("gestionejg_copyEjg2Designa", datos).subscribe(
                  x => {
                    this.progressSpinner = false;
                    this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                    this.location.back();
                  },
                  err => {
                    //Crear etiqueta en la BBDD
                    this.showMesg("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos del EJG a la designacion seleccionada");
                    this.location.back();
                  }
                );
              }
            },
            err => {
              this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              // this.location.back();
              this.progressSpinner = false;
            }
          );


          break;
        case 'asi':

          let requestAsistencia = [data.idinstitucion, data.anio, data.numero, this.datos.tipoEJG, this.datos.annio, this.datos.numero

          ];

          this.sigaServices.post("gestionejg_asociarAsistencia", requestAsistencia).subscribe(
            m => {
              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");

              if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("gestionejg_copyEjg2Asis", requestAsistencia).subscribe(
                  x => {
                    this.progressSpinner = false;
                    this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                    this.location.back();
                  },
                  err => {
                    //Crear etiqueta en la BBDD
                    this.showMesg("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos del EJG a la asistencia seleccionada");
                    this.location.back();
                  }
                );
              }
            },
            err => {
              this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              //this.location.back();
              this.progressSpinner = false;
            }
          );


          break;
        case 'soj':

          let requestSoj = [
            data.idinstitucion, data.anio, data.numero,
            data.idTipoSoj, this.datos.tipoEJG, this.datos.annio, this.datos.numero

          ];

          this.sigaServices.post("gestionejg_asociarSOJ", requestSoj).subscribe(
            m => {

              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");

              if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("gestionejg_copyEjg2Soj", requestSoj).subscribe(
                  x => {
                    this.progressSpinner = false;
                    this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                    this.location.back();
                  },
                  err => {
                    //Crear etiqueta en la BBDD
                    this.showMesg("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos del EJG al SOJ seleccionado");
                    this.location.back();
                  }
                );
              }
            },
            err => {
              this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              // this.location.back();
              this.progressSpinner = false;
            }
          );
          break;
      }
    }

  }

  confirmAsociarDES(data) {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.message.eliminarEstado"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      key: "asoc",
      icon: icon,
      accept: () => {
        this.asociarDES(data, false);

      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancelar",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  asociarDES(data, copy) {

    let asunto = this.datosDesigna.ano.split("/");

    let anoDesigna = this.datosDesigna.anio;

    let turno = this.datosDesigna.idTurno;

    if (this.datosDesigna != null) {
      let radioValue = sessionStorage.getItem("radioTajertaValue");
      switch (radioValue) {

        case 'ejg':
          let request = [anoDesigna, data.anio, data.idTipoEjg, turno, asunto[1], data.numero];

          this.sigaServices.post("designacion_asociarEjgDesigna", request).subscribe(
            m => {

              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");
              if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("designacion_copyDesigna2Ejg", request).subscribe(
                  x => {
                    this.progressSpinner = false;
                    this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                    this.location.back();
                  },
                  err => {
                    //Crear etiqueta en la BBDD
                    this.showMesg("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos de la designacion al EJG seleccionado");
                    this.location.back();
                  }
                );
              }
            },
            err => {
              this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              this.progressSpinner = false;
            }
          );


          break;
        case 'asi':

          let requestAsistencia = [anoDesigna, this.datosDesigna.idTurno, this.datosDesigna.numero, data.idinstitucion, data.anio, data.numero];

          this.sigaServices.post("designacion_asociarAsistenciaDesigna", requestAsistencia).subscribe(
            m => {
              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");
              if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("designacion_copyDesigna2Asis", requestAsistencia).subscribe(
                  x => {
                    this.progressSpinner = false;
                    this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                    this.location.back();
                  },
                  err => {
                    //Crear etiqueta en la BBDD
                    this.showMesg("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos de la designacion al EJG seleccionado");
                    this.location.back();
                  }
                );
              }
            },
            err => {
              this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              //this.location.back();
              this.progressSpinner = false;
            }
          );


          break;
        case 'soj':

          /*  let requestSoj = [
             data.idinstitucion,data.anio,data.numero,
             data.idTipoSoj,this.datos.tipoEJG,this.datos.annio,this.datos.numero
            
           ];
           
         this.sigaServices.post("gestionejg_asociarSOJ", requestSoj).subscribe(
           m => {
             
             this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
             sessionStorage.removeItem("radioTajertaValue");
             if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("designacion_copyDesigna2Soj", requestSoj).subscribe(
                  x => {
                    this.progressSpinner = false;
                    this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                    this.location.back();
                  },
                  err => {
                    //Crear etiqueta en la BBDD
                    this.showMesg("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos de la designacion al EJG seleccionado");
                    this.location.back();
                  }
                );
              }
           },
           err => {
             this.showMesg("error",
               "No se ha asociado el EJG correctamente",
               ""
             );
            // this.location.back();
             this.progressSpinner = false;
           }
         ); */

          break;
      }
    }
  }

  search(event) {
    this.progressSpinner = true;
    this.selectAll = false;
    this.buscar = true;
    this.selectMultiple = false;

    this.selectedDatos = "";
    this.progressSpinner = true;
    this.buscar = true;

    if (event == "ejg") {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosEJG",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
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

    if (event == "des") {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosDesignaciones",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
    }

    if (event == "soj") {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosSOJ",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
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

    if (event == "asi") {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosAsistencias",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
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
    this.goToView();
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  showMesg(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  goToView() {
    let view = document.getElementById("tablaBusqueda");
    if (view) {
      view.scrollIntoView();
      view = null;
    }
  }
  clear() {
    this.msgs = [];
  }
}
