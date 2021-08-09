import { DatePipe, Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { ActuacionDesignaObject } from '../../../../../../models/sjcs/ActuacionDesignaObject';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { TarjetaAsistenciaItem } from '../../../../../../models/guardia/TarjetaAsistenciaItem';
import moment = require('moment');

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
  permisoEscritura: boolean;
  isLetrado: boolean;
  datosAsistencia : TarjetaAsistenciaItem;
  
  @Input() campos;
  @Input() selectedValue;
  @Output() refreshDataGenerales = new EventEmitter<DesignaItem>();
  nuevaDesignaCreada: DesignaItem;
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
    disable: false
  },
  {
    nombre: 'Apellidos',
    value: "",
    disable: false
  },
  {
    nombre: 'Nombre',
    value: "",
    disable: false
  }];

  constructor(private sigaServices: SigaServices,
     private datePipe: DatePipe, 
     private commonsService: CommonsService, 
     private confirmationService: ConfirmationService, 
     private translateService: TranslateService, 
     private router: Router,
     private persistenceService: PersistenceService,
     private location : Location) {
  }

  ngOnInit() {
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
        console.log(err);
      }
    );

  }

  cargaDatos(datosInicial) {
    this.progressSpinner = true;
    this.disableCheckArt = true;
    if( datosInicial.art27 == "No" ){
      this.checkArt =false;
    }else if(datosInicial.art27 == "Si"){
      this.checkArt = true;
    }
    this.selectores[0].opciones = [{ label: datosInicial.nombreTurno, value: datosInicial.idTurno }];
    this.selectores[0].value = datosInicial.idTurno;
    this.selectores[0].disable = true;
    // this.selectores[1].opciones = [{ label: datosInicial.descripcionTipoDesigna, value: datosInicial.idTipoDesignaColegio }];
    this.getComboTipoDesignas();
    this.selectores[1].value = datosInicial.idTipoDesignaColegio;
    this.selectores[1].disable = false;
    var anioAnterior = datosInicial.ano.split("/");
    this.anio.value = anioAnterior[0].slice(1);
    this.anio.disable = true;
    this.numero.value = datosInicial.codigo;
    this.numero.disable = false;
    this.fechaGenerales = datosInicial.fechaEntradaInicio;
    let colegiado = new ColegiadoItem();
    colegiado.numColegiado = datosInicial.numColegiado;
    colegiado.idInstitucion = datosInicial.idInstitucion;
    this.inputs[0].disable = true;
    this.inputs[1].disable = true;
    this.inputs[2].disable = true;
    this.sigaServices
      .post("busquedaColegiados_searchColegiado", colegiado)
      .subscribe(
        data => {
          let colegiadoItem = JSON.parse(data.body);
          this.inputs[0].value = colegiadoItem.colegiadoItem[0].numColegiado;
          var apellidosNombre = colegiadoItem.colegiadoItem[0].nombre.split(",");
          this.inputs[1].value = apellidosNombre[0];
          this.inputs[2].value = apellidosNombre[1];
          this.progressSpinner = false;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },

      );
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

    } else if (sessionStorage.getItem("colegiadoGeneralDesigna")) {
      let colegiadoGeneral = JSON.parse(sessionStorage.getItem("colegiadoGeneralDesigna"));
      this.inputs[0].value = colegiadoGeneral[0].numeroColegiado;
      this.inputs[1].value = colegiadoGeneral[0].apellidos;
      this.inputs[2].value = colegiadoGeneral[0].nombre;
      sessionStorage.removeItem("colegiadoGeneralDesigna");
    } else {
      this.inputs[0].value = "";
      this.inputs[1].value = "";
      this.inputs[2].value = "";
      this.inputs[0].disable = false;
      this.inputs[1].disable = false;
      this.inputs[2].disable = false;
    }
    this.checkArt = false;
    this.anio.value = "";
    this.anio.disable = true;
    this.numero.value = "";
    this.numero.disable = true;
    this.fechaGenerales = new Date();
    this.selectores[0].disable = false;
    this.selectores[1].disable = false;
    if (this.selectores[0].value == "") {
      this.selectores[0].value = "";
    }
    if (this.selectores[1].value = "") {
      this.selectores[1].value = "";
    }

    if(sessionStorage.getItem("asistencia")){

      this.datosAsistencia = JSON.parse(sessionStorage.getItem("asistencia"));
      //Numero colegiado letrado
      this.inputs[0].value = this.datosAsistencia.numeroColegiado;
      //Apellidos letrado
      this.inputs[1].value = this.datosAsistencia.nombreColegiado.split(" ")[0] + this.datosAsistencia.nombreColegiado.split(" ")[1];
      //Nombre letrado
      this.inputs[2].value = this.datosAsistencia.nombreColegiado.split(" ")[2];
      //Valor combo turno
      this.selectores[0].value = this.datosAsistencia.idTurno;
      let fechaNoHora = moment(this.datosAsistencia.fechaAsistencia.substr(0,10), 'DD/MM/YYYY').toDate();
      this.fechaGenerales = fechaNoHora;
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
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
        this.progressSpinner = false;
      }, () => {
        this.arregloTildesCombo(this.selectores[1].opciones);
        this.progressSpinner = false;
      }
    );
  }


  getComboTurno() {
    this.progressSpinner = true;
    this.sigaServices.get("combo_turnos").subscribe(
      n => {
        this.selectores[0].opciones = n.combooItems;
        let datosGeneralesDesigna = JSON.parse(sessionStorage.getItem("datosGeneralesDesigna"));
        if (datosGeneralesDesigna != null && datosGeneralesDesigna != undefined) {
          this.selectores[0].value = datosGeneralesDesigna[0];
          this.checkArt = datosGeneralesDesigna[2];
        }
        this.progressSpinner = false;
      },
      err => {
        console.log(err);
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

  showMsg(severity, summary, detail) {
    sessionStorage.removeItem("datosGeneralesDesigna");
    this.progressSpinner = true;
    this.msgs = [];
    if (detail == "save" && (this.inputs[0].value == "" || this.inputs[0].value == undefined)) {
      this.confirmarActivar(severity, summary, detail);
    } else {
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
        newDesigna.fechaAlta = new Date(this.fechaGenerales);
        if(this.checkArt == false){
          newDesigna.art27 ="0";
        }else{
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

              if(this.datosAsistencia){
                this.sigaServices.postPaginado("busquedaGuardias_asociarDesigna","?anioNumero="+this.datosAsistencia.anioNumero+"&copiarDatos=S", newDesignaRfresh).subscribe(
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
                    console.log(err);
                    this.progressSpinner = false;
                  }, () => {
                    this.progressSpinner = false;
                    sessionStorage.removeItem("asistencia");
                    this.location.back();
                  }
                );
              }
              this.busquedaDesignaciones(newDesignaRfresh);
              //MENSAJE DE TODO CORRECTO
              detail = "";
              this.msgs.push({
                severity,
                summary,
                detail
              });
              console.log(n);
            },
            err => {
              severity = "error";
                  summary = "No se han podido modificar los datos";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
              console.log(err);
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
        // newDesigna.fechaAlta = new Date(this.fechaGenerales);
        newDesigna.fechaAlta = new Date(this.fechaGenerales);
        var today = new Date();
        var year = today.getFullYear().valueOf();
        newDesigna.ano = year;
        newDesigna.numero = Number(this.numero.value);
        this.checkDatosGenerales();
        if (this.resaltadoDatos == false) {
          this.progressSpinner = true;
          this.sigaServices.post("designaciones_updateDesigna", newDesigna).subscribe(
            n => {
              this.refreshDataGenerales.emit(newDesigna);
              //MENSAJE DE TODO CORRECTO
              this.msgs.push({
                severity,
                summary,
                detail
              });
              console.log(n);
              this.progressSpinner = false;
            },
            err => {
                  severity = "error";
                  summary = "No se han podido modificar los datos";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
              console.log(err);
              this.progressSpinner = false;
            }, () => {
              this.progressSpinner = false;
            }
          );
        }
      }

    }

    if (detail == "Restablecer") {
      this.nuevaDesigna = sessionStorage.getItem("nuevaDesigna");

      this.initDatos =  this.campos;
      if (this.nuevaDesigna=="false") {
        //EDICION
        this.cargaDatos(this.initDatos);

      } else {
        this.cargaDatosNueva();

      }
    }

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
      this.selectores[0].value != "" && this.selectores[0].value != undefined) {
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

  }

  searchColegiado() {
    sessionStorage.removeItem("datosGeneralesDesigna");
    sessionStorage.setItem("Art27Activo", "true");
    sessionStorage.setItem("datosGeneralesDesigna", JSON.stringify([Number(this.selectores[0].value), Number(this.selectores[1].value), this.checkArt]));
    let datosDesigna = new DesignaItem();
    datosDesigna.idTurno = Number(this.selectores[0].value);
    datosDesigna.fechaAlta = this.fechaGenerales;
    sessionStorage.setItem("datosDesgina", JSON.stringify(datosDesigna));
    if (this.nuevaDesigna && this.checkArt) {//BUSQUEDA GENERAL
      this.router.navigate(["/busquedaGeneral"]);
    } else if (this.nuevaDesigna && !this.checkArt) {//BUSQUEDA SJCS
      this.router.navigate(["/buscadorColegiados"]);
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
      let mess = "Se va a seleccionar un letrado automaticamente. ¿Desea continuar?";
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
            if(this.checkArt == false){
              newDesigna.art27 ="0";
            }else{
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
                  if(this.datosAsistencia){
                    this.sigaServices.postPaginado("busquedaGuardias_asociarDesigna","?anioNumero="+this.datosAsistencia.anioNumero+"&copiarDatos=S", newDesignaRfresh).subscribe(
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
                        console.log(err);
                        this.progressSpinner = false;
                      }, () => {
                        this.progressSpinner = false;
                        sessionStorage.removeItem("asistencia");
                        this.location.back();
                      }
                    );
                  }
                  this.busquedaDesignaciones(newDesignaRfresh);
                  //MENSAJE DE TODO CORRECTO
                  detail = "";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
                  console.log(n);
                },
                err => {
                  console.log(err);
                  severity = "error";
                  summary = "No existe cola de letrado de oficio";
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
            newDesigna.numero = Number(this.numero.value);
            this.checkDatosGenerales();
            if (this.resaltadoDatos == true) {
              this.progressSpinner = false;
              this.sigaServices.post("designaciones_updateDesigna", newDesigna).subscribe(
                n => {
                  this.refreshDataGenerales.emit(newDesigna);
                  this.progressSpinner = false;
                  //MENSAJE DE TODO CORRECTO
                  detail = "";
                  this.msgs.push({
                    severity,
                    summary,
                    detail
                  });
                  console.log(n);

                },
                err => {
                  console.log(err);
                  severity = "error";
                  summary = "No se han podido modificar los datos";
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
  }

  formatDate(date) {
    const pattern = 'dd/MM/yyyy';
    return this.datePipe.transform(date, pattern);
  }

  busquedaDesignaciones(evendesginaItem) {
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
          this.inputs[0].value =  element.nombreColegiado;
          this.inputs[1].value =  element.apellido1Colegiado + " " + element.apellido2Colegiado;
          this.inputs[2].value = element.nombreColegiado;
          this.inputs[0].disable = true;
          this.inputs[1].disable = true;
          this.inputs[2].disable = true;
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
            console.log(err);
          }
        );
        this.progressSpinner = false;
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
        setTimeout(() => {
          this.actualizaFicha.emit(this.nuevaDesignaCreada);
        }, 5);
      });;

  }
}
