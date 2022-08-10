import { DatePipe } from '@angular/common';
import { AfterViewInit, EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/api';
import { BusquedaColegiadoExpressComponent } from '../../../../../../commons/busqueda-colegiado-express/busqueda-colegiado-express.component';
import { TranslateService } from '../../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { FichaColegialGeneralesItem } from '../../../../../../models/FichaColegialGeneralesItem';
import { ActuacionAsistenciaItem } from '../../../../../../models/guardia/ActuacionAsistenciaItem';
import { FiltroAsistenciaItem } from '../../../../../../models/guardia/FiltroAsistenciaItem';
import { PreAsistenciaItem } from '../../../../../../models/guardia/PreAsistenciaItem';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { JusticiableItem } from '../../../../../../models/sjcs/JusticiableItem';
import { Location } from '@angular/common'

@Component({
  selector: 'app-ficha-asistencia-tarjeta-datos-generales',
  templateUrl: './ficha-asistencia-tarjeta-datos-generales.component.html',
  styleUrls: ['./ficha-asistencia-tarjeta-datos-generales.component.scss']
})
export class FichaAsistenciaTarjetaDatosGeneralesComponent implements OnInit, AfterViewInit {


  @Output() refreshDatosGenerales = new EventEmitter<string>();
  @Output() eventoAnular = new EventEmitter<boolean>();
  msgs: Message[] = [];
  permisoEscritura: boolean;
  progressSpinner: boolean = false;
  @Input() asistencia: TarjetaAsistenciaItem = new TarjetaAsistenciaItem();
  asistenciaAux: TarjetaAsistenciaItem;
  isNuevaAsistencia: boolean = false;
  comboTurnos = [];
  comboGuardias = [];
  comboTipoAsistenciaColegio = [];
  disableDataForEdit: boolean = false;
  comboLetradoGuardia = [];

  ineditable: boolean = false; //Si esta finalizada o anulada no se puede editar ningun campo
  reactivable: boolean = false;
  anulable: boolean = false;
  finalizable: boolean = false;
  saveDisabled: boolean = true;
  duplicarAsistencia: boolean = false;
  preasistencia: PreAsistenciaItem;
  comboEstadosAsistencia = [];
  idAsistenciaCopy: string;
  generalBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();
  busqueda;
  usuarioLogado;
  persona;
  datosJusticiables: JusticiableItem;
  actuaciones: ActuacionAsistenciaItem[] = [];
  usuarioBusquedaExpress = {
    numColegiado: '',
    nombreAp: ''
  };
  @ViewChild(BusquedaColegiadoExpressComponent) busquedaColegiado: BusquedaColegiadoExpressComponent;
  constructor(private datepipe: DatePipe,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private commonServices: CommonsService,
    private router: Router,
    private sigaStorageService: SigaStorageService,
    private location: Location,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    //sessionStorage.removeItem("volver");
    //sessionStorage.removeItem("modoBusqueda");
    this.getDataLoggedUser();
    this.checkLastRoute();


    this.preasistencia = JSON.parse(sessionStorage.getItem("preasistenciaItemLink"));
    if (this.preasistencia) {
      this.isNuevaAsistencia = true;
      this.asistencia.fechaAsistencia = this.preasistencia.fechaLlamada;
      this.getTurnosByColegiadoFecha();
      this.asistencia.idTurno = this.preasistencia.idTurno;
      this.onChangeTurno();
      this.asistencia.idGuardia = this.preasistencia.idGuardia;
      this.onChangeGuardia();
      this.asistencia.fechaEstado = this.datepipe.transform(new Date(), 'dd/MM/yyyy');
      this.asistencia.idSolicitudCentralita = this.preasistencia.idSolicitud;
      this.asistencia.filtro = new FiltroAsistenciaItem();
      this.disableDataForEdit = false
    } else if (this.asistencia.anioNumero) {
      this.asistenciaAux = Object.assign({}, this.asistencia);
      this.disableDataForEdit = true;
      this.getTurnosByColegiadoFecha();
      this.onChangeTurno();
      this.onChangeGuardia();
      this.checkEstado();
      this.getActuaciones();
    }

    this.getComboEstadosAsistencia();

  }

  ngAfterViewInit(): void {
    if (sessionStorage.getItem("asistenciaCopy")) {

      this.confirmationService.confirm({
        key: "confirmEliminarGeneral",
        message: 'Se van a copiar todos los datos de la asistencia seleccionada. Para modificarlos guarde la asistencia nueva y acceda al resto de tarjetas.',
        icon: "fa fa-question-circle",
        accept: () => {
          this.asistencia = JSON.parse(sessionStorage.getItem("asistenciaCopy"));
          this.idAsistenciaCopy = this.asistencia.anio + "/" + this.asistencia.numero;
          this.isNuevaAsistencia = true;
          this.disableDataForEdit = false;
          this.duplicarAsistencia = true;
          this.asistencia.numero = '';
          this.getTurnosByColegiadoFecha();
          this.onChangeTurno();
          this.onChangeGuardia();

        },
        reject: () => {
          sessionStorage.removeItem("asistenciaCopy");
          sessionStorage.setItem("volver", "true");
          this.router.navigate(["/guardiasAsistencias"])
        }
      });

    }
  }


  getComboEstadosAsistencia() {
    this.sigaServices.get("combo_estadosAsistencia").subscribe(
      n => {
        this.comboEstadosAsistencia = n.combooItems;
        if (!this.disableDataForEdit && !this.duplicarAsistencia) {
          this.asistencia.estado = this.comboEstadosAsistencia[0].value;
        }
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboEstadosAsistencia);
      }
    );
  }

  getDefaultTipoAsistenciaColegio() {
    this.sigaServices.get("busquedaGuardias_getDefaultTipoAsistenciaColegio").subscribe(
      n => {
        if (n && n.valor && this.comboTipoAsistenciaColegio.find(comboItem => comboItem.value == n.valor)) {
          this.asistencia.idTipoAsistenciaColegio = n.valor;
        }
      },
      err => {
        //console.log(err);

      }, () => {
        this.commonServices.arregloTildesCombo(this.comboTurnos);
      }
    );
  }

  onChangeTurno() {

    if (!this.disableDataForEdit && !this.duplicarAsistencia) { //Si estamos en edicion
      this.asistencia.idGuardia = '';
    }

    //Si tenemos seleccionado un turno, cargamos las guardias correspondientes
    if (this.asistencia.idTurno) {

      this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + this.asistencia.idTurno).subscribe(
        n => {
          this.comboGuardias = n.combooItems;
        },
        err => {
          //console.log(err);

        }, () => {
          this.commonServices.arregloTildesCombo(this.comboGuardias);
        }
      );

    }
  }

  onChangeGuardia() {

    if (this.asistencia.idTurno && this.asistencia.idGuardia) {
      this.sigaServices.getParam(
        "busquedaGuardias_getTiposAsistencia", "?idTurno=" + this.asistencia.idTurno + "&idGuardia=" + this.asistencia.idGuardia).subscribe(
          data => {

            this.comboTipoAsistenciaColegio = data.combooItems;

            if (!this.disableDataForEdit && !this.duplicarAsistencia) { //Si estamos en modo edicion no seteamos valor por defecto

              ///this.setDefaultValueOnComboTiposAsistencia();

              this.getDefaultTipoAsistenciaColegio();
            }/*else{
              this.comboTipoAsistenciaColegio.forEach(comboItem => {
      
                  comboItem.value = comboItem.value.slice(0,comboItem.value.length - 1);
          
              });
            }*/

          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.commonServices.arregloTildesCombo(this.comboTipoAsistenciaColegio);
          }
        );

      this.sigaServices.getParam(
        "busquedaGuardias_getLetradosGuardiaDia", "?idTurno=" + this.asistencia.idTurno + "&idGuardia=" + this.asistencia.idGuardia + "&guardiaDia=" + this.asistencia.fechaAsistencia).subscribe(
          data => {

            this.comboLetradoGuardia = data.combooItems;
            this.commonServices.arregloTildesCombo(this.comboLetradoGuardia);

            /*if(this.comboLetradoGuardia !== null
              && this.comboLetradoGuardia.length > 0){
                this.asistencia.idLetradoGuardia = this.comboLetradoGuardia[0].value;
                this.onChangeLetradoGuardia();
              }*/

            if (this.asistencia.idLetradoGuardia == null || this.asistencia.idLetradoGuardia == undefined) {
              this.asistencia.idLetradoGuardia = this.comboLetradoGuardia[0].value;
              this.onChangeLetradoGuardia();
            }

          },
          err => {
            //console.log(err);
          }
        );
    }
  }

  onChangeLetradoGuardia() {

    if (this.asistencia.idLetradoGuardia) {

      this.sigaServices
        .post("busquedaPer", this.asistencia.idLetradoGuardia)
        .subscribe(
          n => {

            this.persona = JSON.parse(n["body"]);
            if (this.persona && this.persona.colegiadoItem) {

              if (this.usuarioLogado != undefined && this.usuarioLogado.numColegiado == this.persona.colegiadoItem[0].numColegiado) {
                this.showMsg("error", "Error", "El usuario es el colegiado, por lo que no puede modificarse");
              } else {
                if (this.actuaciones != null && this.actuaciones.length > 0) {
                  this.confirmCambioLetradoActuaciones();
                }
                this.usuarioBusquedaExpress.numColegiado = this.persona.colegiadoItem[0].numColegiado;
                this.busquedaColegiado.isBuscar(this.usuarioBusquedaExpress);
              }


            }
          },
          err => {
            //console.log(err);
          }
        );

    }

  }

  confirmCambioLetradoActuaciones() {
    let mess =
      "¿Desea cambiar el colegiado de las actuaciones al nuevo colegiado seleccionado?";
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      key: 'confirmCambioLetradoActuaciones',
      accept: () => {
        this.asignarColegiadoActuaciones()
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  asignarColegiadoActuaciones() {
    this.asistencia.numeroColegiado = this.persona.colegiadoItem[0].numColegiado;
    this.asistencia.nombreColegiado = this.persona.colegiadoItem[0].nombreColegiado;
    this.saveAsistencia();
  }
  getDataLoggedUser() {
    this.sigaServices.get("usuario_logeado").subscribe(n => {
      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;
      this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe(
        usr => {
          this.usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
          if (this.usuarioLogado) {
            this.sigaStorageService.idPersona = this.usuarioLogado.idPersona;
            this.sigaStorageService.numColegiado = this.usuarioLogado.numColegiado;
          }
        });
    });
  }
  getTurnosByColegiadoFecha() {

    this.comboTurnos = [];
    if (!this.disableDataForEdit && !this.duplicarAsistencia) { //Si estamos en edicion
      this.asistencia.idTurno = "";
    }
    this.sigaServices.getParam("busquedaGuardias_getTurnosByColegiadoFecha", this.fillParams()).subscribe(
      n => {
        this.clear();
        if (n.error !== null
          && n.error.code === 500) {
          this.showMsg("error", "Error", n.error.description.toString());
          this.saveDisabled = true;
        } else if (n.error !== null
          && n.error.code === 200) {
          this.showMsg("error", "No hay guardias", this.translateService.instant(n.error.description.toString()));
          this.saveDisabled = true;
        } else {
          this.saveDisabled = false;
          this.comboTurnos = n.combooItems;
          this.commonServices.arregloTildesCombo(this.comboTurnos);
        }
      },
      err => {
        //console.log(err);
      }
    );

  }

  fillFechaAsistencia(event) {
    if (event) {
      this.asistencia.fechaAsistencia = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
      this.getTurnosByColegiadoFecha();
    } else {
      this.asistencia.fechaAsistencia = '';
    }
  }

  fillFechaSolicitud(event) {
    if (event) {
      this.asistencia.fechaSolicitud = this.datepipe.transform(new Date(event), 'dd/MM/yyyy HH:mm');
    } else {
      this.asistencia.fechaSolicitud = '';
    }
  }

  fillFechaEstado(event) {
    if (event) {
      this.asistencia.fechaEstado = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
    } else {
      this.asistencia.fechaEstado = '';
    }
  }

  fillFechaCierre(event) {
    if (event) {
      this.asistencia.fechaCierre = this.datepipe.transform(new Date(event), 'dd/MM/yyyy');
    } else {
      this.asistencia.fechaCierre = '';
    }
  }

  styleObligatorio(evento) {
    if ((evento == undefined || evento == null || evento == "")) {
      return this.commonServices.styleObligatorio(evento);
    }
  }

  clear() {
    this.msgs = [];
  }

  showMsg(severityParam: string, summaryParam: string, detailParam: string) {
    this.msgs = [];
    this.msgs.push({
      severity: severityParam,
      summary: summaryParam,
      detail: detailParam
    });
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.asistencia.numeroColegiado = this.usuarioBusquedaExpress.numColegiado;
    this.asistencia.nombreColegiado = this.usuarioBusquedaExpress.nombreAp;
  }

  checkLastRoute() {

    this.router.events
      .filter(e => e instanceof RoutesRecognized)
      .pairwise()
      .subscribe((event: any[]) => {
        if (event[0].urlAfterRedirects == "/pantallaBuscadorColegiados") {
          sessionStorage.setItem("esBuscadorColegiados", "true");
        } else {
          sessionStorage.setItem("esBuscadorColegiados", "false");
        }
      });
  }

  fillParams() {
    let parametros = '?guardiaDia=' + this.asistencia.fechaAsistencia;

    if (this.asistencia.idLetradoGuardia !== null
      && this.asistencia.idLetradoGuardia !== undefined
      && this.sigaStorageService.isLetrado) {

      parametros += "&idPersona=" + this.asistencia.idLetradoGuardia;

    }

    return parametros;
  }

  resetDatosGenerales() {

    if (!this.disableDataForEdit && !this.duplicarAsistencia) {

      this.asistencia.fechaCierre = '';
      this.asistencia.fechaSolicitud = '';
      this.asistencia.idLetradoGuardia = '';
      this.asistencia.idTipoAsistenciaColegio = '';
      this.comboTipoAsistenciaColegio = [];
      this.comboLetradoGuardia = [];
      this.asistencia.fechaAsistencia = '';
      this.comboGuardias = [];
      this.comboTurnos = [];
      this.asistencia.idTurno = '';
      this.asistencia.idGuardia = '';
      this.asistencia.nombreColegiado = '';
      this.asistencia.numeroColegiado = '';
      this.usuarioBusquedaExpress.nombreAp = '';
      this.usuarioBusquedaExpress.numColegiado = '';

    } else {

      this.asistencia = Object.assign({}, this.asistenciaAux);

    }
  }

  saveAsistencia() {
    let isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    if (this.checkDatosObligatorios()) {
      this.progressSpinner = true
      let idAsistencia = this.idAsistenciaCopy ? this.idAsistenciaCopy : '';
      let asistencias: TarjetaAsistenciaItem[] = [this.asistencia];
      this.sigaServices
        .postPaginado("busquedaGuardias_guardarAsistenciasDatosGenerales", "?idAsistenciaCopy=" + idAsistencia + "&isLetrado=" + isLetrado, asistencias)
        .subscribe(
          n => {
            let result = JSON.parse(n["body"]);
            if (result.error) {
              this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
            } else {
              this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
              if (this.preasistencia) {
                sessionStorage.setItem("creadaFromPreasistencia", "true");
                this.anulable = true;
                this.finalizable = true;
                this.reactivable = false;
              }
              this.checkEstado();
              this.disableDataForEdit = true;
              this.duplicarAsistencia = false;
              this.asistenciaAux = Object.assign({}, this.asistencia);
              this.asistencia.anioNumero = result.id;
              this.asistencia.anio = result.id.split("/")[0];
              this.asistencia.numero = result.id.split("/")[1];
              this.refreshDatosGenerales.emit(result.id);
            }

          },
          err => {
            if (err.status = "409") {
              this.showMsg('error', 'El usuario es colegiado y no existe una guardia para la fecha seleccionada. No puede continuar', '');
            } else {
              this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), '');
            }
            //console.log(err);

            this.progressSpinner = false;
          },
          () => {
            if (sessionStorage.getItem("justiciable")) {
              this.asociarJusticiable();
            }
            this.progressSpinner = false;
          }
        );
    } else {
      this.showMsg('error', this.translateService.instant('general.message.camposObligatorios'), '');
    }



  }

  asociarJusticiable() {
    // ASociar Justiciable (Asistido) 
    if (sessionStorage.getItem("justiciable")) {
      this.datosJusticiables = JSON.parse(sessionStorage.getItem("justiciable"));
      let requestAsi = [this.asistencia.anio, this.asistencia.numero, this.datosJusticiables.idpersona];
      // Objeto Asociación de Justiciables y Asistencia.
      this.sigaServices.post("gestionJusticiables_asociarJusticiableAsistencia", requestAsi).subscribe(
        m => {
          //Se debe añadir a la BBDD estos mensajes (etiquetas)
          if (JSON.parse(m.body).error.code == 200) {
            this.progressSpinner = false;
            this.location.back();
          }
        },
        err => {
          this.progressSpinner = false;
          this.location.back();
        },
        () => {
        }
      );
    }
  }

  checkDatosObligatorios() {

    let ok: boolean = true;

    if (!this.asistencia.idGuardia
      || !this.asistencia.idTurno
      || !this.asistencia.fechaAsistencia
      || !this.asistencia.idTipoAsistenciaColegio) {
      //|| !this.asistencia.idLetradoGuardia){

      ok = false;

    }

    return ok;
  }

  anular() {

    this.eventoAnular.emit(true);
    this.asistencia.estado = "2";
    this.asistencia.fechaEstado = this.datepipe.transform(new Date(), "dd/MM/yyyy");
    this.updateEstadoAsistencia();

  }

  finalizar() {

    this.anulable = false;
    this.reactivable = true;
    this.finalizable = false;
    this.asistencia.estado = "4";
    this.asistencia.fechaEstado = this.datepipe.transform(new Date(), "dd/MM/yyyy");
    this.updateEstadoAsistencia();

  }

  reactivar() {
    this.eventoAnular.emit(false);
    this.anulable = true;
    this.reactivable = false;
    this.finalizable = true;
    this.asistencia.estado = "1";
    this.asistencia.fechaEstado = this.datepipe.transform(new Date(), "dd/MM/yyyy");
    this.updateEstadoAsistencia();

  }

  updateEstadoAsistencia() {

    let asistencias: TarjetaAsistenciaItem[] = [this.asistencia];
    this.sigaServices
      .post("busquedaGuardias_updateEstadoAsistencia", asistencias)
      .subscribe(
        n => {
          let result = JSON.parse(n["body"]);
          if (result.error) {
            this.showMsg('error', this.translateService.instant("justiciaGratuita.guardia.asistenciasexpress.errorguardar"), result.error.description);
          } else {
            this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), '');
            this.checkEstado();
            this.asistenciaAux = Object.assign({}, this.asistencia);
            this.refreshDatosGenerales.emit(result.id);
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

  checkEstado() {

    if (this.asistencia.estado == "1") {

      this.anulable = true;
      this.reactivable = false;
      this.finalizable = true;
      this.ineditable = false; //Si esta activa, se pueden editar datos

    } else if (this.asistencia.estado == "2") {

      this.reactivable = true;
      this.anulable = false;
      this.finalizable = false;
      this.ineditable = true;

    } else if (this.asistencia.estado == "4") {
      //finalizado
      this.anulable = false;
      this.reactivable = true;
      this.finalizable = false;
      this.ineditable = true;

    }

  }
  getActuaciones() {

    let mostrarHistorico: string = '';
    if (this.asistencia) {
      mostrarHistorico = 'N'


      this.progressSpinner = true;
      this.sigaServices.getParam("busquedaGuardias_searchActuaciones", "?anioNumero=" + this.asistencia.anioNumero + "&mostrarHistorico=" + mostrarHistorico).subscribe(
        n => {
          this.actuaciones = n.actuacionAsistenciaItems;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        }, () => {
          this.progressSpinner = false;
        }
      );

    }

  }
}
