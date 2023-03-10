import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { ActuacionDesignaObject } from '../../../../../../models/sjcs/ActuacionDesignaObject';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import * as moment from 'moment';
import { EJGItem } from '../../../../../../models/sjcs/EJGItem';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { TreeModule } from 'primeng/primeng';
import { JusticiableItem } from '../../../../../../models/sjcs/JusticiableItem';
import { ScsDefendidosDesignasItem } from '../../../../../../models/sjcs/ScsDefendidosDesignasItem';

@Component({
  selector: 'app-detalle-tarjeta-datos-generales-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-generales-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosGeneralesFichaDesignacionOficioComponent implements OnInit {
  @Output() actualizaFicha = new EventEmitter<DesignaItem>();
  busquedaColegiado: any;
  resaltadoDatos: boolean = false;
  msgs: Message[] = [];
  nuevaDesigna: any;
  checkArt: boolean;
  disableCheckArt: boolean;
  initDatos: any;
  disableButtons: boolean;
  progressSpinner: boolean;
  datosEJG: EJGItem
  datosJusticiables: JusticiableItem;
  permisoEscritura: boolean;
  isLetrado: boolean;
  datosAsistencia: TarjetaAsistenciaItem;

  nif: any;
  nombreColegiado: any;
  apellido1Colegiado: any;
  apellido2Colegiado: any;
  institucionColegiado: any;
  @Input() campos;
  @Input() selectedValue;
  @Output() refreshDataGenerales = new EventEmitter<DesignaItem>();
  @Output() searchRelacionesAs = new EventEmitter<boolean>();
  nuevaDesignaCreada: DesignaItem;
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  anio = {
    value: "",
    disable: false
  };
  numero = {
    value: "",
    disable: false
  };
  fechaGenerales: any;

  selectores = [
    {
      nombre: "Turno",
      opciones: [],
      value: "",
      disable: false,
      obligatorio: true

    },
    {
      nombre: "Tipo",
      opciones: [],
      value: "",
      disable: false,
      obligatorio: false
    }
  ];

  inputs = [{
    nombre: 'Número de colegiado',
    value: "",
    disable: false,
    obligatorio: false
  },
  {
    nombre: 'Apellidos',
    value: "",
    // disable: false //SIGARNV-2371
    disable: true, //SIGARNV-2371
    obligatorio: true
  },
  {
    nombre: 'Nombre',
    value: "",
    // disable: false //SIGARNV-2371
    disable: true, //SIGARNV-2371
    obligatorio: true
  }];

  constructor(private sigaServices: SigaServices,
    private datePipe: DatePipe,
    private commonsService: CommonsService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private router: Router,
    private persistenceService: PersistenceService,
    private location: Location) {
  }

  ngOnInit() {
    this.currentRoute = "/designaciones"; 
    this.resaltadoDatos = true;
    this.nuevaDesigna = JSON.parse(sessionStorage.getItem("nuevaDesigna"));
    this.initDatos = this.campos;
    if (!this.nuevaDesigna) {
      //EDICION
      this.disableButtons = true;
      this.cargaDatos(this.initDatos);

    } else {
      this.disableButtons = false;
      this.cargaDatosNueva();

    }

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaDatosGenerales)
      .then(respuesta => {
        this.permisoEscritura = respuesta;
        this.persistenceService.setPermisos(this.permisoEscritura);

        if (this.permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

      }
      ).catch(error => console.error(error));

    this.sigaServices.get('getLetrado').subscribe(
      (data) => {
        if (data.value == 'S') {
          this.isLetrado = true;
        } else {
          this.isLetrado = false;
        }
      },
      (err) => {
        //console.log(err);
      }
    );

  }

  cargaDatos(datosInicial) {
    this.progressSpinner = true;
    this.disableCheckArt = true;
    if (datosInicial.art27 == "No" || datosInicial.art27 == 0 ) {
      this.checkArt = false;
    } else if (datosInicial.art27 == "Si" || datosInicial.art27 == 1 ) {
      this.checkArt = true;
    }
    this.selectores[0].opciones = [{ label: datosInicial.nombreTurno, value: datosInicial.idTurno }];
    this.selectores[0].value = datosInicial.idTurno;
    this.selectores[0].disable = true;
    // this.selectores[1].opciones = [{ label: datosInicial.descripcionTipoDesigna, value: datosInicial.idTipoDesignaColegio }];
    this.getComboTipoDesignas();
    this.selectores[1].value = datosInicial.idTipoDesignaColegio;
    // this.selectores[1].disable = false; //SIGARNV-2371
    var anioAnterior = datosInicial.ano.split("/");
    this.anio.value = anioAnterior[0].slice(1);
    this.anio.disable = true;
    this.numero.value = datosInicial.codigo;
    this.numero.disable = false;
    this.fechaGenerales = datosInicial.fechaEntradaInicio;
    if (datosInicial.numColegiado != null || datosInicial.numColegiado != undefined) {
      let colegiado = new ColegiadoItem();
      colegiado.numColegiado = datosInicial.numColegiado;
      colegiado.idInstitucion = datosInicial.idInstitucion;
      this.sigaServices
        .post("busquedaColegiados_searchColegiado", colegiado)
        .subscribe(
          data => {
            let colegiadoItem = JSON.parse(data.body);
            this.inputs[0].value = colegiadoItem.colegiadoItem[0].numColegiado;
            var apellidosNombre = colegiadoItem.colegiadoItem[0].nombre.split(",");
            this.inputs[1].value = apellidosNombre[0];
            this.inputs[2].value = apellidosNombre[1];
            this.nombreColegiado = this.inputs[2].value;
            this.progressSpinner = false;
          },
          err => {
            //console.log(err);
            this.progressSpinner = false;
          },

        );
    } else {
      let colegiadoInscrito = this.campos.nombreColegiado.split(',');
      // this.inputs[0].value = colegiadoItem.colegiadoItem[0].numColegiado;
      this.inputs[1].value = this.campos.apellido1Colegiado + " " + this.campos.apellido2Colegiado;
      this.inputs[2].value = colegiadoInscrito[1];
    }

    

    this.inputs[0].disable = true;
    this.inputs[1].disable = true;
    this.inputs[2].disable = true;
  }

  cargaDatosNueva() {
    this.disableCheckArt = false;
    this.progressSpinner = true;
    if (sessionStorage.getItem("buscadorColegiados")) {
      this.busquedaColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem("buscadorColegiados");
      let apellidosExpress = this.busquedaColegiado.apellidos.split(" ");
      this.inputs[0].value = this.busquedaColegiado.nColegiado;
      this.inputs[1].value = this.busquedaColegiado.apellidos;
      this.inputs[2].value = this.busquedaColegiado.nombre;
      this.inputs[0].disable = true;
      this.inputs[1].disable = true;
      this.inputs[2].disable = true;

    } else if (sessionStorage.getItem("colegiadoGeneralDesignaNuevo")) {
      let colegiadoGeneral = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesignaNuevo"));
      this.inputs[1].value = colegiadoGeneral.apellidos1

      if (colegiadoGeneral.apellidos2 != null) {
        this.apellido2Colegiado = colegiadoGeneral.apellidos2;
        this.inputs[1].value = colegiadoGeneral.apellidos1 + " " + colegiadoGeneral.apellidos2;
      } else {
        this.inputs[1].value = colegiadoGeneral.apellidos1
      }
      this.inputs[2].value = colegiadoGeneral.nombre;
      this.inputs[0].disable = true;
      this.inputs[1].disable = true;
      this.inputs[2].disable = true;
      this.nif = colegiadoGeneral.nif;
      this.nombreColegiado = colegiadoGeneral.nombre;
      this.apellido1Colegiado = colegiadoGeneral.apellidos1
      this.institucionColegiado = this.campos.idInstitucion
      sessionStorage.removeItem("colegiadoGeneralDesignaNuevo");
    }
    else if (sessionStorage.getItem("colegiadoGeneralDesigna")) {
      let colegiadoGeneral = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"));
      if (this.campos.idInstitucion == colegiadoGeneral[0].numeroInstitucion) {
        this.inputs[0].value = colegiadoGeneral[0].numeroColegiado;
      }
      this.inputs[1].value = colegiadoGeneral[0].apellidos;
      this.inputs[2].value = colegiadoGeneral[0].nombre;
      this.inputs[0].disable = true;
      this.inputs[1].disable = true;
      this.inputs[2].disable = true;
      this.disableCheckArt = true;
      this.nif = colegiadoGeneral[0].nif;
      this.nombreColegiado = colegiadoGeneral[0].nombre;
      let apellidos = colegiadoGeneral[0].apellidos.split(' ');
      this.apellido1Colegiado = apellidos[0];
      this.apellido2Colegiado = apellidos[1];
      this.institucionColegiado = colegiadoGeneral[0].numeroInstitucion;
      sessionStorage.removeItem("colegiadoGeneralDesigna");
    } else {
      this.inputs[0].value = "";
      this.inputs[1].value = "";
      this.inputs[2].value = "";
      this.inputs[0].disable = true;
      // this.inputs[1].disable = false; //SIGARNV-2371
      // this.inputs[2].disable = false; //SIGARNV-2371
    }
    this.checkArt = false;
    this.anio.value = "";
    this.anio.disable = true;
    this.numero.value = "";
    this.numero.disable = true;
    this.fechaGenerales = new Date();
    this.selectores[0].disable = false;
    // this.selectores[1].disable = false; //SIGARNV-2371
    if (this.selectores[0].value == "") {
      this.selectores[0].value = "";
    }
    if (this.selectores[1].value = "") {
      this.selectores[1].value = "";
    }

    if (sessionStorage.getItem("asistencia")) {

      this.datosAsistencia = JSON.parse(sessionStorage.getItem("asistencia"));
      //Numero colegiado letrado
      this.inputs[0].value = this.datosAsistencia.numeroColegiado;
      //Apellidos letrado
      this.inputs[1].value = this.datosAsistencia.nombreColegiado.split(" ")[0] + this.datosAsistencia.nombreColegiado.split(" ")[1];
      //Nombre letrado
      this.inputs[2].value = this.datosAsistencia.nombreColegiado.split(" ")[2];
      //Valor combo turno
      this.selectores[0].value = this.datosAsistencia.idTurno;
      let fechaNoHora = moment(this.datosAsistencia.fechaAsistencia.substr(0, 10), 'DD/MM/YYYY').toDate();
      //this.fechaGenerales = fechaNoHora;
      this.searchRelacionesAs.emit(true);
    } else if (sessionStorage.getItem("EJG")) { //Se comprueba si se procede de la pantalla de gestion de EJG
      this.datosEJG = JSON.parse(sessionStorage.getItem("EJG"));
      sessionStorage.removeItem("EJG");

      //Datos de la tarjeta datos generales
      //Comprobar art 27.
      if (sessionStorage.getItem("Art27")) {
        this.checkArt = true;
        sessionStorage.removeItem("Art27");
      }
      if (this.inputs[0].value == undefined) {
        this.inputs[0].value = "";
        this.inputs[1].value = "";
        this.inputs[2].value = "";
      }
      /*if (this.datosEJG.apellidosYNombre != undefined && this.datosEJG.apellidosYNombre != null) {
        if (!this.checkArt) {
          this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.datosEJG.idPersona).subscribe(
            n => {
              let data = JSON.parse(n.body).colegiadoItem;
              this.inputs[0].value = data.numColegiado;
            },
            err => {
              this.progressSpinner = false;
            });
        }
        let colegiado = this.datosEJG.apellidosYNombre.split(", ")
        this.inputs[1].value = colegiado[0];
        this.inputs[2].value = colegiado[1];
      }*/

      //Los valores y bloqueo del turno y del tipo se determinan en los combos correspondientes.

      //Comprobar que fechaapertura es lo mismo que fechagenerales.
      //this.fechaGenerales = new Date();
      /* this.anio.value = this.datosEJG.annio;
      this.numero.value = this.datosEJG.numEjg; */

    }
    this.getComboTurno();
    this.getComboTipoDesignas();
  }

  getComboTipoDesignas() {
    this.progressSpinner = true;
    this.sigaServices.get("designas_tipoDesignas").subscribe(
      n => {
        this.selectores[1].opciones = n.combooItems;
        let datosGeneralesDesigna = JSON.parse(sessionStorage.getItem("datosGeneralesDesigna"));
        if (datosGeneralesDesigna != null && datosGeneralesDesigna != undefined) {
          this.selectores[1].value = datosGeneralesDesigna[1];
        }
        //Condicion pensada para que se aplique cuando se crea una designacion desde EJG
        if (this.datosEJG != undefined && this.datosEJG != null) {
          if (this.datosEJG.tipoEJGColegio != null) {
            this.selectores[1].value = this.datosEJG.tipoEJGColegio;
            this.selectores[1].disable = true;
          }
          else this.selectores[1].value = "";
        }
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.selectores[1].opciones);
        this.progressSpinner = false;
      }
    );
  }


  getComboTurno() {
    this.progressSpinner = true;
    this.sigaServices.get("combo_turnos_designas").subscribe(
      n => {
        this.selectores[0].opciones = n.combooItems;
        this.selectores[0].value = "";
        let datosGeneralesDesigna = JSON.parse(sessionStorage.getItem("datosGeneralesDesigna"));
        if (datosGeneralesDesigna != null && datosGeneralesDesigna != undefined) {
          this.selectores[0].value = datosGeneralesDesigna[0];
          this.checkArt = datosGeneralesDesigna[2];
        }
        //Condicion pensada para que se aplique cuandose crea una designacion desde EJG
        /*if (this.datosEJG != undefined && this.datosEJG != null) {
          if (this.datosEJG.idTurno != null) {
            this.selectores[0].value = this.datosEJG.idTurno;
            this.selectores[0].disable = true;
          }
          else this.selectores[0].value = "";
        }*/
        this.progressSpinner = false;
      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.selectores[0].opciones);
        this.progressSpinner = false;
      }
    );
  }

  arregloTildesCombo(combo) {
    if (combo != undefined)
      combo.map(e => {
        let accents =
          "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
        let accentsOut =
          "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        let i;
        let x;
        for (i = 0; i < e.label.length; i++) {
          if ((x = accents.indexOf(e.label[i])) != -1) {
            e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
            return e.labelSinTilde;
          }
        }
      });
  }
  showMsgError(mensaje: String) {
    this.showMessage("error", this.translateService.instant("general.message.incorrect"), mensaje);
  }

  showMsg(severity, summary, detail) {
    sessionStorage.removeItem("datosGeneralesDesigna");
    this.progressSpinner = true;
    this.msgs = [];
    if (detail == "save" && ((this.inputs[0].value == "" && this.inputs[0].disable == false) || this.inputs[0].value == undefined)) {
      if (this.inputs[0].value == "" && this.inputs[0].disable == false && this.checkArt == true) {
        this.showMsgError(this.translateService.instant("justiciaGratuita.oficio.designa.busquedaManualObligatoria"));
        this.progressSpinner = false;
        this.resaltadoDatos = true;
      } else {
        this.confirmarActivar(severity, summary, detail);
      }
    } else {
      if (this.camposModificados()) {
      if (detail == "save" && (this.anio.value == "")) {
        detail = "Guardar";
        let newDesigna = new DesignaItem();
        var idTurno: number = +this.selectores[0].value;
        newDesigna.idTurno = idTurno;
        var idTipoDesignaColegio: number = +this.selectores[1].value;
        newDesigna.idTipoDesignaColegio = idTipoDesignaColegio;
        newDesigna.numColegiado = this.inputs[0].value;
        newDesigna.nombreColegiado = this.inputs[1].value;
        newDesigna.apellidosNombre = this.inputs[2].value;
        newDesigna.fechaAlta = new Date(this.fechaGenerales);
        newDesigna.nif = this.nif;
        /* newDesigna.nombreColegiado = this.nombreColegiado;
        newDesigna.apellido1Colegiado = this.apellido1Colegiado;
        newDesigna.apellido2Colegiado = this.apellido2Colegiado; */
        newDesigna.nombreColegiado = this.inputs[2].value;
        newDesigna.apellidosNombre = this.inputs[1].value + this.inputs[2].value;
        newDesigna.idInstitucion = this.institucionColegiado;
        // Obtener información del justiciable
        if (sessionStorage.getItem("justiciable")) {
          this.datosJusticiables = JSON.parse(sessionStorage.getItem("justiciable"));
        }
        if (this.checkArt == false) {
          newDesigna.art27 = "0";
        } else {
          newDesigna.art27 = "1";
        }
        var today = new Date();
        var year = today.getFullYear().valueOf();
        newDesigna.ano = year;
        this.checkDatosGenerales();
        if (this.resaltadoDatos == false) {
          this.progressSpinner = true;
          this.sigaServices.post("create_NewDesigna", newDesigna).subscribe(
            n => {
              let newId = JSON.parse(n.body);
              sessionStorage.removeItem("nuevaDesigna");
              sessionStorage.setItem("nuevaDesigna", "false");

              let newDesignaRfresh = new DesignaItem();
              newDesignaRfresh.ano = newDesigna.ano;
              newDesignaRfresh.codigo = newId.id;
              newDesignaRfresh.idTurnos = [String(newDesigna.idTurno)];

              if (this.datosAsistencia) {
                this.sigaServices.postPaginado("busquedaGuardias_asociarDesigna", "?anioNumero=" + this.datosAsistencia.anioNumero + "&copiarDatos=S", newDesignaRfresh).subscribe(
                  n => {

                    let error = JSON.parse(n.body).error;
                    this.progressSpinner = false;

                    if (error != null && error.description != null) {
                      this.showMsg("info", "Error al asociar la Designacion con la Asistencia", error.description);
                    } else {
                      this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), 'Se ha asociado la Designacion con la Asistencia correctamente');
                      //this.router.navigate(["/fichaDesignaciones"]);
                      this.location.back();
                    }
                  },
                  err => {
                    //console.log(err);
                    this.progressSpinner = false;
                  }, () => {
                    this.progressSpinner = false;
                    sessionStorage.removeItem("asistencia");
                  });
              } else if (this.datosEJG != null && this.datosEJG != undefined) {//Introducimos aqui la asocion con EJG en el caso que venga de una ficha EJG

                //Realizamos un a peticion con un array strings sin determinar un objeto a medida ya que se considera que  
                //el uso puntual de este servicio lo justifica.
                let request = [newDesigna.ano.toString(), this.datosEJG.annio, this.datosEJG.tipoEJG, newDesigna.idTurno.toString(), newId.id, this.datosEJG.numero];

                this.sigaServices.post("designacion_asociarEjgDesigna", request).subscribe(
                  m => {
                    //Se debe añadir a la BBDD estos mensajes (etiquetas)
                    if (JSON.parse(m.body).error.code == 200) this.msgs = [{ severity: "success", summary: "Asociación con EJG realizada correctamente", detail: this.translateService.instant(JSON.parse(m.body).error.description) }];
                    else this.msgs = [{ severity: "error", summary: "Asociación con EJG fallida", detail: this.translateService.instant(JSON.parse(m.body).error.description) }];
                    // sessionStorage.removeItem("EJG");

                    //Una vez se han asociado el ejg y la designa, procedemos a traer los posibles datos de pre-designacion
                    this.sigaServices.post("gestionejg_getEjgDesigna", this.datosEJG).subscribe(
                      x => {
                        let ejgDesignas = JSON.parse(x.body).ejgDesignaItems;
                        this.sigaServices.post("designacion_getPreDesignaEJG", ejgDesignas[0]).subscribe(
                          y => {
                            if (y.statusText == "OK") this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                            else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                            this.progressSpinner = false;
                            this.location.back();
                          }
                        );
                      },
                      err => {
                        this.location.back();
                      }
                    );

                  },
                  err => {
                    severity = "error";
                    summary = "No se ha asociado el EJG correctamente";
                    this.msgs.push({
                      severity,
                      summary,
                      detail
                    });
                    this.progressSpinner = false;
                    this.location.back();
                  }
                );
              } else if (this.datosJusticiables) {//Introducimos aqui la asocion con Justiciables en el caso que venga de una ficha Justiciable
                let datosJusDesignas = new ScsDefendidosDesignasItem;
                datosJusDesignas.idturno = newDesigna.idTurno;
                datosJusDesignas.anio = newDesigna.ano;
                datosJusDesignas.numero = newId.id;
                datosJusDesignas.idpersona = this.datosJusticiables.idpersona;
                // Objeto Asocicación de Justiciables y Designas.
                this.sigaServices.post("gestionJusticiables_asociarJusticiableDesgina", datosJusDesignas).subscribe(
                  m => {
                    //Se debe añadir a la BBDD estos mensajes (etiquetas)
                    if (JSON.parse(m.body).error.code == 200) {
                      this.showMessage("success",
                        this.translateService.instant("messages.inserted.success"),
                        this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.correctAsociar"));
                    } else {
                      this.showMessage("error",
                        this.translateService.instant("general.message.error.realiza.accion"),
                        this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.errorAsociar"));
                    }
                    sessionStorage.removeItem("justiciables");
                    this.location.back();
                  },
                  err => {
                    //console.log(err);
                    this.progressSpinner = false;
                    this.location.back();
                  }
                );
              }

              this.busquedaDesignaciones(newDesignaRfresh);
              this.progressSpinner = false;
              //MENSAJE DE TODO CORRECTO
              detail = "";
              let dataRes = JSON.parse(n.body);
              if (dataRes.error.code == 202) {
                severity = "warn";
                summary = this.translateService.instant("general.message.warn")
                detail = this.translateService.instant(dataRes.error.description);
              }
              this.msgs.push({
                severity,
                summary,
                detail
              });

              //console.log(n);
              this.progressSpinner = false;
            },
            err => {
              severity = "error";
              summary = "No se han podido modificar los datos";
              if (err.status == 406) {
                summary = this.translateService.instant('justiciaGratuita.oficio.designa.errorGuardarDesignacion');
                //var errorJson = JSON.parse(err["error"]);
                var errorJson = JSON.parse(err.error);
                detail = detail = this.translateService.instant(errorJson.error.description);
              }
              this.msgs.push({
                severity,
                summary,
                detail
              });
              this.progressSpinner = false;
            }, () => {
              this.progressSpinner = false;
            }
          );
        }
      } else if (detail == "save" && this.anio.value != "") {
        detail = "Guardar";
        let newDesigna = new DesignaItem();
        var idTurno: number = +this.selectores[0].value;
        newDesigna.idTurno = idTurno;
        var idTipoDesignaColegio: number = +this.selectores[1].value;
        newDesigna.idTipoDesignaColegio = idTipoDesignaColegio;
        newDesigna.numColegiado = this.inputs[0].value;
        newDesigna.nombreColegiado = this.inputs[1].value;
        newDesigna.apellidosNombre = this.inputs[2].value;
        // newDesigna.fechaAlta = new Date(this.fechaGenerales);
        //var fechaGeneralesSplited : String[] = this.fechaGenerales.split("/");
        //var fechaGeneralesDate : Date = new Date(+fechaGeneralesSplited[2], +fechaGeneralesSplited[1] - 1, +fechaGeneralesSplited[0]);
        var fechaGeneralesDate = new Date(this.fechaGenerales)
        var dateType = Object.prototype.toString.call(this.fechaGenerales)
        if (dateType == "[object String]") {
          const [day, month, year] = this.fechaGenerales.split('/');
          fechaGeneralesDate = new Date(+year, +month - 1, +day);
        }
        var anioFecha = fechaGeneralesDate.getFullYear();
        if (Number(anioFecha) == Number(this.anio.value)) {
          newDesigna.fechaAlta = new Date(fechaGeneralesDate);
          var today = new Date();
          // var year = today.getFullYear().valueOf();
          newDesigna.ano = Number(this.anio.value);
          if (this.nuevaDesignaCreada != undefined) {
            newDesigna.numero = Number(this.nuevaDesignaCreada.numero);
          } else if (this.initDatos != undefined) {
            newDesigna.numero = Number(this.initDatos.numero);
          }
          newDesigna.codigo = this.numero.value;
          this.checkDatosGenerales();
          if (this.resaltadoDatos == false) {
            this.progressSpinner = true;
            this.sigaServices.post("designaciones_updateDesigna", newDesigna).subscribe(
              n => {
                this.progressSpinner = false;
                this.refreshDataGenerales.emit(newDesigna);
                //MENSAJE DE TODO CORRECTO
                this.msgs.push({
                  severity,
                  summary,
                  detail
                });
                //console.log(n);
                sessionStorage.setItem("designaItemLink", JSON.stringify(newDesigna));
                this.progressSpinner = false;
              },
              err => {
                detail = this.translateService.instant('justiciaGratuita.oficio.designa.yaexiste');
                severity = "error";
                if (err.status == 400) {
                  summary = this.translateService.instant('justiciaGratuita.oficio.designa.errorGuardarDesignacion');
                } else if (err.status == 406) {
                  summary = this.translateService.instant('justiciaGratuita.oficio.designa.errorGuardarDesignacion');
                  //var errorJson = JSON.parse(err["error"]);
                  var errorJson = JSON.parse(err.error);
                  detail = this.translateService.instant(errorJson.error.description);
                } else {
                  summary = "No se han podido modificar los datos";
                }
                this.msgs.push({
                  severity,
                  summary,
                  detail
                });
                //console.log(err);
                this.progressSpinner = false;
              }, () => {
                this.progressSpinner = false;
                this.initDatos = this.campos;
              }
            );
          }
        } else {
          this.showMessage("error", this.translateService.instant("general.message.error.realiza.accion"), this.translateService.instant("justiciaGratuita.oficio.designa.annodistintoprimeradesignacion"));
        }
      }
    }
      if (this.resaltadoDatos == true) {
        this.progressSpinner = false;
      }
    }
    
    if (detail == "Restablecer") {
      
      this.initDatos = this.campos;
      if (!this.nuevaDesigna) {
        //EDICION
        this.cargaDatos(this.initDatos);

      } else {
        this.cargaDatosNueva();

      }
    }
    this.progressSpinner = false;

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


  transformaFecha(fecha) {
    if (fecha != null) {
      let jsonDate = JSON.stringify(fecha);
      let rawDate = jsonDate.slice(1, -1);
      if (rawDate.length < 14) {
        let splitDate = rawDate.split("/");
        let arrayDate = splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0];
        fecha = new Date((arrayDate += "T00:00:00.001Z"));
      } else {
        fecha = new Date(fecha);
      }
    } else {
      fecha = undefined;
    }

    return fecha;
  }

  fillFechaHastaCalendar(event) {
    this.fechaGenerales = event;
  }


  checkDatosGenerales() {
    if (this.fechaGenerales != "" && this.fechaGenerales != undefined &&
      this.selectores[0].value != "" && this.selectores[0].value != undefined &&
      this.inputs[1].value != "" && this.inputs[1].value != undefined &&
      this.inputs[2].value != "" && this.inputs[2].value != undefined)  {
      this.resaltadoDatos = false;
    } else {
      this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
      this.resaltadoDatos = true;
    }
  }

  clear() {
    this.msgs = [];
  }
  styleObligatorio(resaltado, evento) {
    if (this.resaltadoDatos && evento == true && resaltado == "selector") {
      if (this.selectores[0].obligatorio == true && this.selectores[0].nombre == "Turno" && (this.selectores[0].value == "" || this.selectores[0].value == undefined)) {
        return "camposObligatorios";
      }
    }
    if (this.resaltadoDatos && (evento == "fechaGenerales") && resaltado == "fecha") {
      // return "campoDate";
      return this.commonsService.styleObligatorio(evento);
    }
    if (this.resaltadoDatos && evento == true && resaltado == "inputTitle") {
      if (this.inputs[1].obligatorio == true && this.inputs[1].nombre == "Apellidos" && (this.inputs[1].value == "" || this.inputs[1].value == undefined) && this.inputs[2].obligatorio == true && this.inputs[2].nombre == "Nombre" && (this.inputs[2].value == "" || this.inputs[2].value == undefined) )  {
        return "camposObligatorios";
      }
    }

  }

  isBuscarColegiado() {
    if (this.inputs != null && this.inputs.length > 1 && this.inputs[0].value != undefined && !this.inputs[0].disable && this.inputs[0].value.trim().length > 0) {
      let colegiado = new ColegiadoItem();
      colegiado.numColegiado = this.inputs[0].value;

      this.progressSpinner = true;
      this.sigaServices
        .post("busquedaColegiados_searchColegiado", colegiado)
        .subscribe(
          data => {
            let colegiadoItem = JSON.parse(data.body);
            console.log(colegiadoItem)

            if (colegiadoItem.colegiadoItem.length == 1) {
              this.inputs[0].value = colegiadoItem.colegiadoItem[0].numColegiado;
              var apellidosNombre = colegiadoItem.colegiadoItem[0].nombre.split(",");
              this.inputs[1].value = apellidosNombre[0];
              this.inputs[2].value = apellidosNombre[1];
            } else {
              this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.colegiadoNoEncontrado"));
            }

            this.progressSpinner = false;
          },
          err => {
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          },

        );
    } else if (this.inputs != null && this.inputs.length > 1 && this.inputs[0].value != undefined && !this.inputs[0].disable) {
      this.inputs[0].value = "";
      this.inputs[1].value = "";
      this.inputs[2].value = "";
    }
  }

  searchColegiado() {
    if (this.inputs != null && this.inputs.length > 1 && this.inputs[0].value != undefined && this.inputs[0].value.trim().length > 0) {
      this.isBuscarColegiado();
    } else {
      sessionStorage.removeItem("datosGeneralesDesigna");
      sessionStorage.setItem("Art27Activo", "true");
      sessionStorage.setItem("busquedaColegiadoDesigna", "true");
      sessionStorage.setItem("datosGeneralesDesigna", JSON.stringify([Number(this.selectores[0].value), Number(this.selectores[1].value), this.checkArt]));
      let datosDesigna = new DesignaItem();
      datosDesigna.idTurno = Number(this.selectores[0].value);
      datosDesigna.fechaAlta = this.fechaGenerales;
      sessionStorage.setItem("datosDesgina", JSON.stringify(datosDesigna));
      if (this.nuevaDesigna && this.checkArt) {//BUSQUEDA GENERAL
        sessionStorage.setItem("nuevaDesigna", "true");
        this.router.navigate(["/busquedaGeneral"]);
      } else if (this.nuevaDesigna && !this.checkArt) {//BUSQUEDA SJCS
        this.router.navigate(["/buscadorColegiados"]);
      }
    }

  }

  eraseColegiado() {
    if (!this.disableButtons) {
      this.inputs[0].value = "";
      this.inputs[1].value = "";
      this.inputs[2].value = "";
      this.checkArt = false;
      this.inputs[0].disable = false;
      // this.inputs[1].disable = false; //SIGARNV-2371
      // this.inputs[2].disable = false; //SIGARNV-2371
      this.disableCheckArt = false;
    }
  }

  onChangeArt() {
    if (!this.nuevaDesigna) {
      this.disableCheckArt = false;
    } else {
      this.disableCheckArt = false;
    }
  }

  confirmarActivar(severity, summary, detail) {
    this.checkDatosGenerales();
    if (this.resaltadoDatos == false) {
      this.progressSpinner = false;
      let mess = this.translateService.instant("justiciaGratuita.oficio.designas.nuevaCola");
      let icon = "fa fa-question-circle";
      let keyConfirmation = "confirmGuardar";
      this.confirmationService.confirm({
        key: keyConfirmation,
        message: mess,
        icon: icon,
        accept: () => {
          this.progressSpinner = true;
          if (detail == "save" && this.anio.value == "") {
            detail = "Guardar";
            let newDesigna = new DesignaItem();
            var idTurno: number = +this.selectores[0].value;
            newDesigna.idTurno = idTurno;
            var idTipoDesignaColegio: number = +this.selectores[1].value;
            newDesigna.idTipoDesignaColegio = idTipoDesignaColegio;
            newDesigna.numColegiado = this.inputs[0].value;
            newDesigna.nombreColegiado = this.inputs[1].value;
            newDesigna.apellidosNombre = this.inputs[2].value;
            if (this.checkArt == false) {
              newDesigna.art27 = "0";
            } else {
              newDesigna.art27 = "1";
            }
            newDesigna.fechaAlta = new Date(this.fechaGenerales);
            var today = new Date();
            var year = today.getFullYear().valueOf();
            newDesigna.ano = year;
            if (this.resaltadoDatos == false) {
              this.sigaServices.post("create_NewDesigna", newDesigna).subscribe(
                n => {
                  let newId = JSON.parse(n.body);
                  sessionStorage.removeItem("nuevaDesigna");
                  sessionStorage.setItem("nuevaDesigna", "false");
                  let newDesignaRfresh = new DesignaItem();
                  newDesignaRfresh.ano = newDesigna.ano;
                  newDesignaRfresh.codigo = newId.id;
                  newDesignaRfresh.idTurnos = [String(newDesigna.idTurno)];
                  if (this.datosAsistencia) {
                    this.sigaServices.postPaginado("busquedaGuardias_asociarDesigna", "?anioNumero=" + this.datosAsistencia.anioNumero + "&copiarDatos=S", newDesignaRfresh).subscribe(
                      n => {

                        let error = JSON.parse(n.body).error;
                        this.progressSpinner = false;

                        if (error != null && error.description != null) {
                          this.showMsg("info", "Error al asociar la Designacion con la Asistencia", error.description);
                        } else {
                          this.showMsg('success', this.translateService.instant("general.message.accion.realizada"), 'Se ha asociado la Designacion con la Asistencia correctamente');
                        }
                      },
                      err => {
                        //console.log(err);
                        this.progressSpinner = false;
                      }, () => {
                        this.progressSpinner = false;
                        sessionStorage.removeItem("asistencia");
                        this.location.back();
                      }
                    );
                  }
                  this.progressSpinner = false;
                  this.busquedaDesignaciones(newDesignaRfresh);
                  //MENSAJE DE TODO CORRECTO
                  detail = "";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
                  //console.log(n);
                },
                err => {
                  //console.log(err);
                  severity = "error";
                  summary = this.translateService.instant("justiciaGratuita.oficio.designas.errorNuevaCola");
                  detail = "";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
                  this.progressSpinner = false;

                }, () => {
                }
              );
            }
          } else if (detail == "save" && this.anio.value != "") {
            detail = "Guardar";
            let newDesigna = new DesignaItem();
            var idTurno: number = +this.selectores[0].value;
            newDesigna.idTurno = idTurno;
            var idTipoDesignaColegio: number = +this.selectores[1].value;
            newDesigna.idTipoDesignaColegio = idTipoDesignaColegio;
            newDesigna.numColegiado = this.inputs[0].value;
            newDesigna.nombreColegiado = this.inputs[1].value;
            newDesigna.apellidosNombre = this.inputs[2].value;
            let fechaCambiada = this.fechaGenerales.split("/");
            let dia = fechaCambiada[0];
            let mes = fechaCambiada[1];
            let anioFecha = fechaCambiada[2];
            let fechaCambiadaActual = mes + "/" + dia + "/" + anioFecha;
            newDesigna.fechaAlta = new Date(fechaCambiadaActual);
            var today = new Date();
            var year = today.getFullYear().valueOf();
            newDesigna.ano = year;
            newDesigna.numero = Number(this.initDatos.numero);
            newDesigna.codigo = this.numero.value;
            this.checkDatosGenerales();
            if (this.resaltadoDatos == true) {
              this.progressSpinner = false;
              this.sigaServices.post("designaciones_updateDesigna", newDesigna).subscribe(
                n => {
                  this.progressSpinner = false;
                  this.refreshDataGenerales.emit(newDesigna);
                  this.progressSpinner = false;
                  //MENSAJE DE TODO CORRECTO
                  detail = "";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
                  //console.log(n);

                },
                err => {
                  //console.log(err);
                  severity = "error";
                  summary = this.translateService.instant("justiciaGratuita.oficio.designas.error2NuevaCola");
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
                  this.progressSpinner = false;
                }, () => {
                }
              );
            }
          }
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
    } else {
      this.progressSpinner = false;
    }
    this.progressSpinner = false;
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

  busquedaDesignaciones(evendesginaItem: DesignaItem) {
    this.progressSpinner = true;
    this.numero.disable = false;
    this.sigaServices.post("designaciones_busquedaNueva", evendesginaItem).subscribe(
      n => {
        let datos = JSON.parse(n.body);
        datos.forEach(element => {
          element.factConvenio = element.ano;
          this.anio.value = element.ano;
          this.numero.value = element.codigo;
          element.ano = 'D' + element.ano + '/' + element.codigo;
          //  element.fechaEstado = new Date(element.fechaEstado);
          element.fechaEstado = this.formatDate(element.fechaEstado);
          element.fechaAlta = this.formatDate(element.fechaAlta);
          element.fechaEntradaInicio = this.formatDate(element.fechaEntradaInicio);
          if (element.estado == 'V') {
            element.sufijo = element.estado;
            element.estado = 'Activo';
          } else if (element.estado == 'F') {
            element.sufijo = element.estado;
            element.estado = 'Finalizado';
          } else if (element.estado == 'A') {
            element.sufijo = element.estado;
            element.estado = 'Anulada';
          }
          this.inputs[0].value = element.numColegiado;
          this.inputs[1].value = element.apellido1Colegiado + " " + element.apellido2Colegiado;
          this.inputs[2].value = element.nombreColegiado;
          this.inputs[0].disable = true;
          this.inputs[1].disable = true;
          this.inputs[2].disable = true;
          this.disableButtons = true;
          this.disableCheckArt = true;
          element.nombreColegiado = element.apellido1Colegiado + " " + element.apellido2Colegiado + ", " + element.nombreColegiado;
          if (element.art27 == "1") {
            element.art27 = "Si";
          } else {
            element.art27 = "No";
          }
          element.validada = "No";
          this.nuevaDesignaCreada = element;
          this.progressSpinner = false;
        },
          err => {
            this.progressSpinner = false;
            //console.log(err);
          }
        );
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }, () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.actualizaFicha.emit(this.nuevaDesignaCreada);
        }, 5);
      });;

  }

  navigateComunicar() {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de SJCS es 10
    sessionStorage.setItem("idModulo", '10');

    this.getDatosComunicar();
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                let keysValues = [];
                this.keys.forEach(key => {
                  if (this.initDatos[key.nombre] != undefined) {
                    keysValues.push(this.initDatos[key.nombre].toString());
                  } else if (key.nombre == "num" && this.initDatos["numero"] != undefined) {
                    keysValues.push(this.initDatos["numero"].toString());
                  } else if (key.nombre == "idturno" && this.initDatos["idTurno"] != undefined) {
                    keysValues.push(this.initDatos["idTurno"].toString());
                  }
                });
                datosSeleccionados.push(keysValues);

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                //console.log(err);
              }
            );
        },
        err => {
          //console.log(err);
        }
      );
  }

  camposModificados() {

    if (this.initDatos.anio != null && this.initDatos.anio != undefined && this.initDatos.anio.toString() != this.anio.value) return true
    if (this.initDatos.codigo != this.numero.value) return true
    if (this.initDatos.fechaEntradaInicio != this.fechaGenerales) return true
    if (this.initDatos.idTipoDesignaColegio != null && this.initDatos.idTipoDesignaColegio != undefined && this.initDatos.idTipoDesignaColegio.toString() != this.selectores[1].value) return true
    if (this.initDatos.idTurno != this.selectores[0].value) return true
    if ((this.initDatos.art27 == "No" || this.initDatos.art27 == 0 ) && this.checkArt == true) return true
    if (this.initDatos.numColegiado != this.inputs[0].value) return true
    if (this.initDatos.apellido1Colegiado + " " + this.initDatos.apellido2Colegiado != this.inputs[1].value) return true
    if (this.nombreColegiado != this.inputs[2].value) return true
    this.showMessage("info", this.translateService.instant("general.message.informacion"), "No hay cambios que guardar");
    return false;
  }

}

