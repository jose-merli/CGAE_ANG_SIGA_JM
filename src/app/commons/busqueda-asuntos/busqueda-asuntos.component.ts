import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { ConfirmationService } from 'primeng/api';
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../node_modules/@angular/forms";
import { PersistenceService } from '../../_services/persistence.service';
import { TarjetaAsistenciaItem } from "../../models/guardia/TarjetaAsistenciaItem";
import { AsuntosJusticiableItem } from "../../models/sjcs/AsuntosJusticiableItem";
import { DesignaItem } from "../../models/sjcs/DesignaItem";
import { EJGItem } from "../../models/sjcs/EJGItem";
import { ScsDefendidosDesignasItem } from '../../models/sjcs/ScsDefendidosDesignasItem';
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaWrapper } from "../../wrapper/wrapper.class";
import { TranslateService } from '../translate';
import { SigaServices } from "./../../_services/siga.service";
import { esCalendar } from "./../../utils/calendar";
import { FiltrosBusquedaAsuntosComponent } from "./filtros-busqueda-asuntos/filtros-busqueda-asuntos.component";
import { TablaBusquedaAsuntosComponent } from "./tabla-busqueda-asuntos/tabla-busqueda-asuntos.component";
import { request } from 'http';
import { Router } from '@angular/router';
import { CommonsService } from '../../_services/commons.service';

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
  fromSOJ: boolean = false;
  fromDES: boolean = false;
  fromASI: boolean = false;
  fromJust: boolean = false;
  datosAsociar;
  datosDesigna;
  datosJusticiable;
  datosAsistencia: TarjetaAsistenciaItem;
  radioTarjeta;

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
    private router: Router,
    private commonServices: CommonsService
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
    if(sessionStorage.getItem("vengoDesdeEJGRecienAsociado")){
      sessionStorage.removeItem("vengoDesdeEJGRecienAsociado");
      //this.location.back();
    }
    //asociar desde EJG
    if (this.persistenceService.getDatosEJG()) {
      this.datos = this.persistenceService.getDatosEJG();
      this.fromEJG = true;
    }

    //asociar desde SOJ
    if (sessionStorage.getItem('SOJ')) {
      this.datos = JSON.parse(sessionStorage.getItem('SOJ'));
      this.fromSOJ = true;
      sessionStorage.removeItem('SOJ');
    }

    //Asociar desde designacion
    if (sessionStorage.getItem('Designacion')) {
      this.datosDesigna = JSON.parse(sessionStorage.getItem('Designacion'));
      this.fromDES = true;
      sessionStorage.removeItem('Designacion');
    }

    if (sessionStorage.getItem('Asistencia')) {
      this.datosAsistencia = JSON.parse(sessionStorage.getItem('Asistencia'));
      this.fromASI = true;
      sessionStorage.removeItem('Asistencia');
    }

    if (sessionStorage.getItem("justiciable") && !this.fromSOJ) {
      this.datosJusticiable = JSON.parse(sessionStorage.getItem('justiciable'));
      this.fromJust = true;
      sessionStorage.removeItem('justiciable');
    }


  }

  asociarElement(event) {
    if (!(event == null || event == undefined)) {
      this.datosAsociar = event;

      //if (this.fromEJG) {
      //  this.confirmCopiarEJG(this.datosAsociar);
      //} else if (this.fromDES) {
      //  this.confirmCopiarDES(this.datosAsociar);
      //} else
       if (this.fromASI) {
        this.confirmCopiarASI(this.datosAsociar);
      }

      if (this.fromSOJ) {
        this.confirmAsociarSOJ(this.datosAsociar);
      }

      if (this.fromEJG) {
        this.confirmAsociarEJG(this.datosAsociar);
      } else if (this.fromDES) {
        this.confirmAsociarDES(this.datosAsociar)
      }

      if (this.fromJust) {
        this.asociarJust(this.datosAsociar, true);
      }

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

  //confirmAsociarSOJ
  confirmAsociarSOJ(data) {
    let mess = this.translateService.instant(
      "justiciaGratuita.soj.busquedaAsuntos.confirmacionAsociarSoj"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "asoc",
      message: mess,
      icon: icon,
      accept: () => {
        this.asociarEJGaSOJ(data);
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

  confirmAsociarEJG(data) {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.busquedaAsuntos.confirmacionAsociarEjg"
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
          let numeroDesigna: string = data.asunto;
          let datos = [data.idinstitucion, data.anio, numeroDesigna.substring(6),
          data.idTipoDesigna, this.datos.tipoEJG, this.datos.annio, this.datos.numero, data.turnoGuardia
          ];
          this.sigaServices.post("gestionejg_asociarDesignacion", datos).subscribe(
            m => {

              let respose = JSON.parse(m["body"]);
              if(respose.error){
                if (respose.error.code == 200){
                  this.showMesg("info", this.translateService.instant("general.message.incorrect"), this.translateService.instant(respose.error.description));
              
                }else{
                  this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(respose.error.description));
              
                }
                this.progressSpinner = false;
              }else{
                this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                sessionStorage.removeItem("radioTajertaValue");

                if (!copy) {
                  this.progressSpinner = false;
                  this.location.back();
                }
                else {
                  this.sigaServices.post("gestionJusticiables_copyEjg2Designa", datos).subscribe(
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
                this.sigaServices.post("gestionJusticiables_copyEjg2Asis", requestAsistencia).subscribe(
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
                this.sigaServices.post("gestionJusticiables_copyEjg2Soj", requestSoj).subscribe(
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

  asociarEJGaSOJ(data){
          let requestSoj = [
            this.datos.idinstitucion, this.datos.anio, this.datos.numero,
            this.datos.idTipoSoj, data.idTipoEjg, data.anio, data.numeroAsoc

          ];
          /*let requestSoj = [
            data.anio, data.numero, data.idTipoEjg, //Datos del EJG
            this.datos.anio, this.datos.idTipoSoj, this.datos.numSoj, this.datos.numero
          ];*/
          this.sigaServices.post("soj_asociarEJGaSOJ", requestSoj).subscribe(
            m => {

              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");
              sessionStorage.setItem("sojItemLink", JSON.stringify(this.datos));
              this.location.back();
                  
            },
            err => {
              this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              // this.location.back();
              this.progressSpinner = false;
            }
          );
  }

  confirmAsociarDES(data) {
    let mess = this.translateService.instant(
      "justiciaGratuita.ejg.busquedaAsuntos.confirmacionAsociarDes"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      key: "asoc",
      icon: icon,
      accept: () => {
        this.confirmCopiarDES(this.datosAsociar);
        //this.asociarDES(data, false);

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

  asociarJust(data, copy) {
    if (this.datosJusticiable != null) {
      this.progressSpinner = true;
      let radioValue = sessionStorage.getItem("radioTajertaValue");
      switch (radioValue) {
        case 'des':
          let datosJusDesignas = new ScsDefendidosDesignasItem;
          datosJusDesignas.idturno = data.idTurno;
          datosJusDesignas.anio = data.anio;
          datosJusDesignas.numero = data.numero;
          datosJusDesignas.idpersona = this.datosJusticiable.idpersona;
          // Objeto Asocicación de Justiciables y Designas.
          this.sigaServices.post("gestionJusticiables_asociarJusticiableDesgina", datosJusDesignas).subscribe(
            m => {
              //Se debe añadir a la BBDD estos mensajes (etiquetas)
              if (JSON.parse(m.body).error.code == 200) {
                this.progressSpinner = false;
                this.showMesg('success', this.translateService.instant("general.message.accion.realizada"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.correctAsociar"));
                this.location.back();
              }
            },
            err => {
              this.progressSpinner = false;
              this.showMesg("error", this.translateService.instant("general.message.error.realiza.accion"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.errorAsociar"));
              //this.location.back();
            }
          );
          break;
        case 'asi':
          let requestAsi = [data.anio, data.numero, this.datosJusticiable.idpersona];
          // Objeto Asociación de Justiciables y Asistencia.
          this.sigaServices.post("gestionJusticiables_asociarJusticiableAsistencia", requestAsi).subscribe(
            m => {
              //Se debe añadir a la BBDD estos mensajes (etiquetas)
              if (JSON.parse(m.body).error.code == 200) {
                this.progressSpinner = false;
                this.showMesg('success', this.translateService.instant("general.message.accion.realizada"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.correctAsociar"));
                this.location.back();
              }
            },
            err => {
              this.progressSpinner = false;
              this.showMesg("error", this.translateService.instant("general.message.error.realiza.accion"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.errorAsociar"));
              //this.location.back();
            }
          );
          break;
        case 'ejg':
          let requestEjg = [data.anio, data.numeroAsoc, this.datosAsociar.idTipoEjg, this.datosJusticiable.idpersona];
          // Objeto Asocicación de Justiciables y EJG.
          this.sigaServices.post("gestionJusticiables_asociarJusticiableEjg", requestEjg).subscribe(
            m => {
              //Se debe añadir a la BBDD estos mensajes (etiquetas)
              if (JSON.parse(m.body).error.code == 200) {
                this.progressSpinner = false;
                this.showMesg('success', this.translateService.instant("general.message.accion.realizada"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.correctAsociar"));
                this.location.back();
              }
            },
            err => {
              this.progressSpinner = false;
              this.showMesg("error", this.translateService.instant("general.message.error.realiza.accion"), this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.errorAsociar"));
              //this.location.back();
            }
          );
          break;
        case 'soj':
          let requestSoj = [data.anio, data.numero, data.idTipoSoj, this.datosJusticiable.idpersona];
          this.sigaServices.post("gestionJusticiables_asociarJusticiableSOJ", requestSoj).subscribe(
            m => {

              this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");

              if (!copy) {
                this.progressSpinner = false;
                this.location.back();
              }
              else {
                this.sigaServices.post("gestionJusticiables_copyEjg2Soj", requestSoj).subscribe(
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


  asociarDES(data, copy) {

    let asunto = this.datosDesigna.ano.split("/");

    let anoDesigna = this.datosDesigna.anio;

    let turno = this.datosDesigna.idTurno;

    if (this.datosDesigna != null) {
      let radioValue = sessionStorage.getItem("radioTajertaValue");
      switch (radioValue) {

        case 'ejg':
          let request = [anoDesigna, data.anio, data.idTipoEjg, turno, asunto[1], data.numeroAsoc];

          this.sigaServices.post("designacion_asociarEjgDesigna", request).subscribe(
            m => {
              let respose = JSON.parse(m["body"]);
              if(respose.error){
                if (respose.error.code == 200){
                  this.showMesg("info", this.translateService.instant("general.message.incorrect"), this.translateService.instant(respose.error.description));
              
                }else{
                  this.showMesg("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(respose.error.description));
              
                }
                this.progressSpinner = false;
              }else{

                this.showMesg("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                sessionStorage.removeItem("radioTajertaValue");
              
                if (!copy) {
                  this.progressSpinner = false;
                  this.location.back();
                }
                else {
                  this.sigaServices.post("gestionJusticiables_copyDesigna2Ejg", request).subscribe(
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
                this.sigaServices.post("gestionJusticiables_copyDesigna2Asis", requestAsistencia).subscribe(
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
                this.sigaServices.post("gestionJusticiables_copyDesigna2Soj", requestSoj).subscribe(
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

          break; 3
      }
    }
  }

  confirmCopiarASI(data) {
    let mess = "¿Desea copiar los datos de la asistencia en el asunto seleccionado?";
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      key: "copy",
      message: mess,
      icon: icon,
      accept: () => {
        this.asociarASI(data, true);
      },
      reject: () => {
        this.asociarASI(data, false);
      }
    });
  }

  asociarASI(data: AsuntosJusticiableItem, copiarDatos: boolean) {

    if (this.datosAsistencia) {

      let anioNumeroASI = this.datosAsistencia.anioNumero;
      let copyData = copiarDatos ? 'S' : 'N';
      let radioValue = sessionStorage.getItem("radioTajertaValue");
      switch (radioValue) {

        case 'ejg':
          let ejgItem: EJGItem = new EJGItem();
          ejgItem.annio = String(data.anio);
          ejgItem.numero = String(data.numeroAsoc);
          ejgItem.tipoEJG = String(data.idTipoEjg);

          this.sigaServices.postPaginado("busquedaGuardias_asociarEjg", "?anioNumero=" + anioNumeroASI + "&copiarDatos=" + copyData, ejgItem).subscribe(
            n => {

              let error = JSON.parse(n.body).error;
              this.progressSpinner = false;

              if (error != null && error.description != null) {
                this.showMesg("error", "Error al asociar el EJG con la Asistencia", error.description);
                this.progressSpinner = false;
                sessionStorage.removeItem("Asistencia");
              } else {
                sessionStorage.setItem("EJGRecienAsociado", "true");
                this.showMesg('success', this.translateService.instant("general.message.accion.realizada"), 'Se ha asociado el EJG con la Asistencia correctamente');
                sessionStorage.removeItem("radioTajertaValue");
                ejgItem.numero = String(data.numeroAsoc);
                this.sigaServices.post("gestionejg_datosEJG", ejgItem).subscribe(
                  n => {
                    this.persistenceService.setDatosEJG(JSON.parse(n.body).ejgItems[0]);
                    //this.ngOnInit();
                    //this.consultaUnidadFamiliar(selected);
                    if (sessionStorage.getItem("EJGItem")) {
                      sessionStorage.removeItem("EJGItem");
                    }
            
                    this.router.navigate(['/gestionEjg']);
                    this.progressSpinner = false;
                    sessionStorage.removeItem("Asistencia");
                    this.commonServices.scrollTop();
                  },
                  err => {
                    this.commonServices.scrollTop();
                  }
                );
              }
            },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            }, () => {
              this.progressSpinner = false;
              sessionStorage.removeItem("Asistencia");
              
            }
          );

          break;
        case 'des':
          let designaItem: DesignaItem = new DesignaItem();
          designaItem.ano = Number(data.anio);
          designaItem.codigo = data.numero;
          designaItem.nombreTurno = data.turnoGuardia;

          this.sigaServices.postPaginado("busquedaGuardias_asociarDesigna", "?anioNumero=" + anioNumeroASI + "&copiarDatos=" + copyData, designaItem).subscribe(
            n => {

              let error = JSON.parse(n.body).error;
              this.progressSpinner = false;
              sessionStorage.removeItem("radioTajertaValue");

              if (error != null && error.description != null) {
                this.showMesg("error", "Error al asociar la Designacion con la Asistencia", error.description);
              } else {
                this.showMesg('success', this.translateService.instant("general.message.accion.realizada"), 'Se ha asociado la Designacion con la Asistencia correctamente');
              }
            },
            err => {
              //console.log(err);
              this.progressSpinner = false;
            }, () => {
              this.progressSpinner = false;
              sessionStorage.removeItem("Asistencia");
              this.location.back();
            }
          );

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
    this.radioTarjeta = event;

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
            //console.log(err);
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
            //console.log(err);
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
            //console.log(err);
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
            //console.log(err);
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
