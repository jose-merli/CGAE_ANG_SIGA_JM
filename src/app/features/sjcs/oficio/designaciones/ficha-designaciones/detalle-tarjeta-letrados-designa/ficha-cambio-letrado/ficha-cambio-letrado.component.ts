import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { DatePipe, Location } from '@angular/common';
import { LetradoEntranteComponent } from "./letrado-entrante/letrado-entrante.component";
import { LetradoSalienteComponent } from "./letrado-saliente/letrado-saliente.component";
import { ConfirmationService } from '../../../../../../../../../node_modules/primeng/primeng';
import { CamposCambioLetradoItem } from '../../../../../../../models/sjcs/CamposCambioLetradoItem';
import { SaltoCompItem } from '../../../../../../../models/guardia/SaltoCompItem';
import { CambioLetradoItem } from '../../../../../../../models/sjcs/CambioLetradoItem';
import { DesignaItem } from '../../../../../../../models/sjcs/DesignaItem';

@Component({
  selector: 'app-ficha-cambio-letrado',
  templateUrl: './ficha-cambio-letrado.component.html',
  styleUrls: ['./ficha-cambio-letrado.component.scss']
})
export class FichaCambioLetradoComponent implements OnInit {

  msgs: Message[] = [];

  @Output() datosTarjetaResumen;

  progressSpinner: boolean = false;

  body;
  disableSave: boolean = false;
  fechaDesigna: Date;

  tarjetaResumen = {
    nombre: 'Resumen Cambio Letrado',
    icono: 'fas fa-clipboard',
    detalle: false,
    fixed: false,
    opened: false,
    campos: [],
    enlaceCardClosed: { click: 'irFichaColegial()', title: this.translateService.instant('informesycomunicaciones.comunicaciones.fichaColegial') },
    letrado: {}
  };

  resaltadoDatos: boolean = false;

  @ViewChild(LetradoEntranteComponent) entrante;
  @ViewChild(LetradoSalienteComponent) saliente;

  designaItem;

  constructor(private location: Location,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private router: Router,
    private datepipe: DatePipe) { }

  ngOnInit() {
    this.resaltadoDatos = true;
    //Para saber si el usuario es un letrado o no
    /* getLetrado() {
      let isLetrado: ComboItem;
      this.sigaServices.get('getLetrado').subscribe(
          (data) => {
              isLetrado = data;
              if (isLetrado.value == 'S') {
                  return true;
              } else {
                  return false;
              }
          },
          (err) => {
      return false;
          }
      );
  } */

    this.body = new CamposCambioLetradoItem();
    let data;
    if (sessionStorage.getItem("Oldletrado") != null) {
      data = JSON.parse(sessionStorage.getItem("Oldletrado"));
      sessionStorage.removeItem("Oldletrado");
      this.body = data;
      //SIGARNV-2213@DTT.JAMARTIN@06/07/2022@INICIO
      if (data.fechaSolRenuncia == null) {
        this.body.fechaSolRenuncia = new Date();
      } else {
        this.body.fechaSolRenuncia = new Date(this.body.fechaSolRenuncia);
      }
      //SIGARNV-2213@DTT.JAMARTIN@06/07/2022@FIN
    }
    else {
      data = JSON.parse(sessionStorage.getItem("letrado"));
      this.tarjetaResumen.letrado = data;
      sessionStorage.removeItem("letrado");
      this.body.numColegiado = data.nColegiado;
      this.body.nombre = data.apellidosNombre.split(", ")[1];
      this.body.apellidos = data.apellidosNombre.split(", ")[0];
      this.body.fechaDesignacion = data.fechaDesignacion;
      this.body.idPersona = data.idPersona;
      //SIGARNV-2213@DTT.JAMARTIN@06/07/2022@INICIO
      if (data.fechaSolRenuncia == null) {
        this.body.fechaSolRenuncia = new Date();
      } else {
        this.body.fechaSolRenuncia = new Date(this.body.fechaSolRenuncia);
      }
      //SIGARNV-2213@DTT.JAMARTIN@06/07/2022@FIN
    }



    this.designaItem = JSON.parse(sessionStorage.getItem("designaItemLink"));
    this.tarjetaResumen.campos = [];
    this.tarjetaResumen.campos[0] = {
      key: this.translateService.instant(
        "censo.resultadosSolicitudesModificacion.literal.nColegiado"
      ), value: data.nColegiado
    };
    this.tarjetaResumen.campos[1] = {
      key: this.translateService.instant(
        "justiciaGratuita.justiciables.literal.colegiado"
      ), value: data.apellidosNombre
    };
    /* this.datosTarjetaResumen = [];

    this.datosTarjetaResumen.designacion;
    this.datosTarjetaResumen.fechaDesignacion;
    this.datosTarjetaResumen.fechaEfecRenuncia;
    this.datosTarjetaResumen.fechaSolRenuncia;
    this.datosTarjetaResumen.numColegiado;
    this.datosTarjetaResumen.apellido1Colegiado;
    this.datosTarjetaResumen.apellido2Colegiado;
    this.datosTarjetaResumen.nombreColegiado; */
  }

  goTop() {
    document.children[document.children.length - 1]
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }

  }
  goDown() {
    let down = document.getElementById("down");
    if (down) {
      down.scrollIntoView();
      down = null;
    }
  }

  clear() {
    this.msgs = [];
  }

  backTo() {
    this.location.back();
  }

  clickSave() {

    //Campos obligatorios rellenados?
    if ((this.entrante.body.fechaDesignacion != null || this.entrante.body.fechaDesignacion != undefined) 
    && (this.saliente.body.motivoRenuncia != undefined || this.saliente.body.motivoRenuncia != null)) {
      //Comprobar requisitos según art 27
      if ((this.entrante.body.numColegiado == undefined || this.entrante.body.numColegiado == "") && this.entrante.body.art27 == false) {
        // && this.entrante.body.art27 == false) {
        this.confirmationService.confirm({
          key: "deletePlantillaDoc",
          message: "Se va a seleccionar un letrado automáticamente. ¿Desea continuar?",
          icon: "fa fa-save",
          accept: () => {
            this.save();
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
      } else if (this.entrante.body.idPersona != undefined && this.body.idPersona != undefined
        && this.entrante.body.idPersona.trim() == this.body.idPersona.trim()) {
        this.showMessage("error", "Cancel", this.translateService.instant("justiciaGratuita.oficio.designas.letrados.letradoRepetido"));
      } else if (this.entrante.body.numColegiado != undefined && this.entrante.body.numColegiado != "") {
        this.save();
      }
      else {
        this.showMessage("error", "Cancel", this.translateService.instant("general.message.camposObligatorios"));
      }
    }
    else {
      this.showMessage("error", "Cancel", this.translateService.instant("general.message.camposObligatorios"));
    }
  }

  save() {
    this.progressSpinner = true;
    //Definir parametros y construir servicio

    let designa = JSON.parse(sessionStorage.getItem("designaItemLink"));
    let request = [];
    if (this.entrante.body.art27 == true) {
      this.entrante.body.art27 = "Si";
      request = [designa.ano, //0
      designa.idTurno, //1
      designa.numero,//2
      this.body.idPersona,//3
      this.saliente.body.observaciones, //4
      this.saliente.body.motivoRenuncia, //5
      sessionStorage.getItem("FDSaliente"), //6
      this.saliente.body.fechaSolRenuncia, //7
      this.entrante.body.fechaDesignacion,//8
      this.entrante.body.idPersona, //9
      this.saliente.body.compensacion, //10
      this.entrante.body.salto, //11
      this.entrante.body.art27, //12
      this.entrante.minDateDesigna //13
      ];
    } else {
      this.entrante.body.art27 = "No";
      request = [designa.ano, //0
      designa.idTurno, //1
      designa.numero,//2
      this.body.idPersona,//3
      this.saliente.body.observaciones, //4
      this.saliente.body.motivoRenuncia, //5
      sessionStorage.getItem("FDSaliente"), //6
      this.saliente.body.fechaSolRenuncia, //7
      this.datepipe.transform(this.entrante.body.fechaDesignacion, 'dd/MM/yyyy'),//8
      this.entrante.body.idPersona, //9
      this.saliente.body.compensacion, //10
      this.entrante.body.salto, //11
      this.entrante.body.art27, //12
      this.entrante.minDateDesigna //13
      ];
    }

    this.progressSpinner = true;

    this.sigaServices.post("designaciones_updateLetradoDesignacion", request).subscribe(
      n => {
        this.progressSpinner = false;
        let data = JSON.parse(n.body);

        // Controlar el 400 - designaciones_updateLetradoDesignacion
        if (data.error.code == '200' && data.error.description == 'justiciaGratuita.oficio.designas.letrados.letradoRepetidoAutmatico') {
          this.showMessage("info", this.translateService.instant("general.message.info"), this.translateService.instant("justiciaGratuita.oficio.designas.letrados.letradoRepetidoAutmatico"));
          setTimeout(() => {
            //this.openTab(this.designaItem);
            this.busquedaDesignacionesParaVolver();
          }, 400);
        } else {
          //Mostrar mensaje todo correcto
          this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
          setTimeout(() => {
            //this.openTab(this.designaItem);
            this.busquedaDesignacionesParaVolver();
          }, 400);
        }



      },
      err => {
        if (err.error != null
          /* || err != undefined && JSON.parse(err.error).error.description != "" */
        ) {
          if (JSON.parse(err.error).error.code == 100) {
            this.confirmationService.confirm({
              key: "errorPlantillaDoc",
              message: this.translateService.instant("justiciaGratuita.oficio.designas.letrados.nocolaletrado"),
              icon: "fa fa-save",
              accept: () => {
              }
            });
          }
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

  // === Actualizar designación antes de volver
  busquedaDesignacionesParaVolver() {
    this.progressSpinner = true;
    let request = [this.designaItem.ano, this.designaItem.idTurno, this.designaItem.numero];
    this.sigaServices.post("designaciones_busquedaDesignacionActual", request).subscribe(
      data => {
        let datos = JSON.parse(data.body);
        //Se cambia el valor del campo ano para que se procese de forma adecuada 
        //En la ficha en las distintas tarjetas para obtener sus valores
        //
        datos.descripcionTipoDesigna = this.designaItem.descripcionTipoDesigna;
        datos.fechaEntradaInicio = this.designaItem.fechaEntradaInicio;
        datos.nombreColegiado = this.designaItem.nombreColegiado;
        datos.nombreProcedimiento = this.designaItem.nombreProcedimiento;
        datos.nombreTurno = this.designaItem.nombreTurno;
        datos.idInstitucion = this.designaItem.idInstitucion;
        datos.idTurno = this.designaItem.idTurno;
        this.designaItem = datos;
        this.designaItem.anio = this.designaItem.ano;
        this.designaItem.idProcedimiento = this.designaItem.idProcedimiento;
        this.designaItem.numProcedimiento = this.designaItem.numProcedimiento;
        this.designaItem.ano = 'D' + this.designaItem.anio + '/' + this.designaItem.codigo;
        // Controlar Articulo 27-28
        if (datos.art27 == "1") {
          this.designaItem.art27 = "Si";
        } else {
          this.designaItem.art27 = "No";
        }
        sessionStorage.setItem('designaItemLink', JSON.stringify(this.designaItem));
        sessionStorage.setItem("nuevaDesigna", "false");
        this.recargarDatos(this.designaItem);
      });
  }



  recargarDatos(dato) {
    this.progressSpinner = true;
    let idProcedimiento = dato.idProcedimiento;
    let datosProcedimiento;
    let datosModulo;

    let designaProcedimiento = new DesignaItem();
    let data = sessionStorage.getItem("designaItem");
    let dataProcedimiento = JSON.parse(data);
    dataProcedimiento.idPretension = dato.idPretension;
    dataProcedimiento.idTurno = dato.idTurno;
    dataProcedimiento.ano = dato.factConvenio;
    dataProcedimiento.numero = dato.numero
    this.sigaServices.post("designaciones_busquedaProcedimiento", dataProcedimiento).subscribe(
      n => {
        datosProcedimiento = JSON.parse(n.body);
        if (datosProcedimiento.length == 0) {
          dato.nombreProcedimiento = "";
          dato.idProcedimiento = "";
        } else {
          dato.nombreProcedimiento = datosProcedimiento[0].nombreProcedimiento;
          dato.idProcedimiento = dataProcedimiento.idPretension;
        }

        let designaModulo = new DesignaItem();
        let dataModulo = JSON.parse(data);
        dataModulo.idProcedimiento = idProcedimiento;
        dataModulo.idTurno = dato.idTurno;
        dataModulo.ano = dato.factConvenio;
        dataModulo.numero = dato.numero
        this.sigaServices.post("designaciones_busquedaModulo", dataModulo).subscribe(
          n => {
            datosModulo = JSON.parse(n.body);
            if (datosModulo.length == 0) {
              dato.modulo = "";
              dato.idModulo = "";
            } else {
              dato.modulo = datosModulo[0].modulo;
              dato.idModulo = datosModulo[0].idModulo;
            }
            this.sigaServices.post("designaciones_busquedaJuzgado", dato.idJuzgado).subscribe(
              n => {
                dato.nombreJuzgado = n.body;
                sessionStorage.setItem("nuevaDesigna", "false");
                sessionStorage.setItem("designaItemLink", JSON.stringify(dato));
                this.backTo();

              },
              err => {
                this.progressSpinner = false;
                dato.nombreJuzgado = "";
                sessionStorage.setItem("nuevaDesigna", "false");
                sessionStorage.setItem("designaItemLink", JSON.stringify(dato));
                this.backTo();
              }, () => {
                this.progressSpinner = false;
              });
          },
          err => {
            this.progressSpinner = false;

            //console.log(err);
          }, () => {
            this.progressSpinner = false;
          });
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }, () => {
        this.progressSpinner = false;
      });
  }

  // ============================


  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datepipe.transform(date, pattern);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  checkDatosGenerales() {
    if ((this.entrante.body.fechaDesignacion != null || this.entrante.body.fechaDesignacion != undefined) &&
      (this.saliente.body.motivoRenuncia != undefined || this.saliente.body.motivoRenuncia != null)) {
      this.resaltadoDatos = false;
    } else {
      this.resaltadoDatos = true;
    }
  }



}
