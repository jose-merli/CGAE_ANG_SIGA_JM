import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { Message } from 'primeng/components/common/api';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';
import { Location } from '@angular/common'
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';

@Component({
  selector: 'app-datos-generales-ejg',
  templateUrl: './datos-generales-ejg.component.html',
  styleUrls: ['./datos-generales-ejg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesEjgComponent implements OnInit {

  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() nuevo;
  @Input() permisoEscritura: boolean = false;
  @Input() haveDesignacion: boolean = false;
  @Input() openTarjetaDatosGenerales: boolean = false;
  @Input() tipo: string = "";
  @Input() tipoObject: any = {};
  @Output() crearDesignacion = new EventEmitter<any>();
  @Output() guardadoSend = new EventEmitter<any>();

  @ViewChild('someDropdown') someDropdown: MultiSelect;

  disabledNumEJG: boolean = true;
  progressSpinner: boolean = false;
  isDisabledGuardia: boolean = true;

  datosIniciales : EJGItem = new EJGItem();
  tipoExpedienteDes: string = "";
  msgs: Message[] = [];
  maxLengthNum: number = 5;
  resumen: any = {
    tipoEJGDesc: "",
    tipoEJGColDesc: "",
    turnoEJGDesc: "",
    turnoGuardiaEJGDesc: "",
    numColegiado: ""
  };
  usuarioBusquedaExpress = {
    numColegiado: "",
    nombreAp: ""
  };

  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboPrestaciones = [];
  comboTurno = [];
  comboGuardia = [];
  resaltadoDatos: boolean = false;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private location: Location,
    private router: Router) { }

  async ngOnInit() {

    if (this.datos.fechaApertura != undefined && (this.datos.fechaApertura.constructor === String || this.datos.fechaApertura.constructor === Number)) {
      this.datos.fechaApertura = new Date(this.datos.fechaApertura);
    }
    if (this.datos.fechapresentacion != undefined && (this.datos.fechapresentacion.constructor === String || this.datos.fechapresentacion.constructor === Number)) {
      this.datos.fechapresentacion = new Date(this.datos.fechapresentacion);
    }
    if (this.datos.fechalimitepresentacion != undefined && (this.datos.fechalimitepresentacion.constructor === String || this.datos.fechalimitepresentacion.constructor === Number)) {
      this.datos.fechalimitepresentacion = new Date(this.datos.fechalimitepresentacion);
    }
    if (this.datos.numColegiado != undefined && this.datos.apellidosYNombre != undefined) {
      this.usuarioBusquedaExpress = {
        numColegiado: this.datos.numColegiado,
        nombreAp: this.datos.apellidosYNombre
      };
    }
    this.datosIniciales = {...this.datos};

    await this.getComboTipoEJG();
    await this.getComboTipoEJGColegio();
    await this.getComboPrestaciones();
    await this.getComboTurno();
    if(this.datos.idTipoExpInsos != undefined && this.datos.idTipoExpInsos != null){
      this.getTipoExpediente();
    }
    
    if (sessionStorage.getItem("buscadorColegiados")) {
      let persona = JSON.parse(sessionStorage.getItem("buscadorColegiados"));
      sessionStorage.removeItem('buscadorColegiados');
      this.usuarioBusquedaExpress.nombreAp = persona.apellidos + ", " + persona.nombre;
      this.usuarioBusquedaExpress.numColegiado = persona.nColegiado;
      this.datos.apellidosYNombre = this.usuarioBusquedaExpress.nombreAp;
      this.datos.numColegiado = persona.nColegiado;
      this.datos.idPersona = persona.idPersona;
    }
  }

  //Eventos
  abreCierraFicha() {
    this.openTarjetaDatosGenerales = !this.openTarjetaDatosGenerales;
  }

  disableEnableNumEJG() {
    this.commonsServices.checkAcceso(procesos_ejg.cambioNumEJG).then(
      respuesta => {
        if (respuesta && !this.nuevo) {
          this.disabledNumEJG = !this.disabledNumEJG;
        } else {
          this.msgs = this.commonsServices.checkPermisos(false, undefined);
        }
      }
    );
  }

  checkSave() {
    if (this.checkCamposObligatorios()) {
      this.muestraCamposObligatorios();
    } else {
      this.save();
    }
  }

  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonsServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }

  checkCamposObligatorios() {
    this.datos.tipoEJG = this.datos.tipoEJG.trim();

    if (this.datos.fechaApertura != undefined && this.datos.fechaApertura != null &&
      this.datos.tipoEJG != undefined && this.datos.tipoEJG != null && this.datos.tipoEJG.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    } else {
      return false;
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();
    }, 300);
  }

  onChangeTurnos() {
    this.comboGuardia = [];
    this.datos.idGuardia = null;
    if (this.datos.idTurno != undefined) {
      this.isDisabledGuardia = false;
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
      this.datos.guardia = "";
    }
  }

  rest(){
    this.datos = {...this.datosIniciales};
    this.datos.prestacion = [...this.datosIniciales.prestacion];
    this.usuarioBusquedaExpress = {
      numColegiado: this.datos.numColegiado,
      nombreAp: this.datos.apellidosYNombre
    };
  }

  save(){
    this.progressSpinner = true;
    if (!this.nuevo) {

      this.sigaServices.post("gestionejg_actualizaDatosGenerales", this.datos).subscribe(
        n => {

          if (n.statusText == "OK") {
            this.datosIniciales = { ...this.datos };
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            //Se actualiza la tarjeta de estados en el caso que se actualice el estado inicial por cambiar la fecha de apertura
            this.datos.numAnnioProcedimiento = "E" + this.datos.annio + "/" + this.datos.numEjg;
            this.datos.numEjg = n.body.substring(n.body.indexOf("id") + 5, n.body.indexOf("error") - 3);
            this.guardadoSend.emit(this.datos);
          }else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
          this.updateResumen();
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          if (err.error != null && err.error != undefined && err.error.indexOf('description') > 0) {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(err.error.substring(err.error.indexOf('message') + 10, err.error.indexOf('description') - 3)) + " " + err.error.substring(err.error.indexOf('description') + 14, err.error.indexOf('infoURL') - 3));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        }
      );
    } else {
      this.datos.annio = this.datos.fechaApertura.getFullYear().toString();

      this.sigaServices.post("gestionejg_insertaDatosGenerales", JSON.stringify(this.datos)).subscribe(
        n => {
          if (JSON.parse(n.body).error.code == 200) {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            
            let ejgObject = JSON.parse(n.body).ejgItems;
            this.datos.idInstitucion = ejgObject[0].idInstitucion;
            this.datos.numero = ejgObject[0].numero;
            this.datos.numEjg = ejgObject[0].numEjg;
            this.datosIniciales = {...this.datos};

            if (this.tipo === "designacion") {

              //En el caso que se proceda de una designación, se asocia el EJG con la designación
              let designa: DesignaItem = this.tipoObject;
            
              //El formato de el atributo designa.ano es "D[año]/[numDesigna]"
              let designaAnio = designa.ano.toString().slice(1, 5);
              let numDesigna = designa.ano.toString().split("/")[1];
              let request = [designaAnio, this.datos.annio, this.datos.tipoEJG, designa.idTurno, numDesigna, this.datos.numero];
            
              //Se asociado el nuevo EJG creado a la designación de origen
              this.sigaServices.post("designacion_asociarEjgDesigna", request).subscribe(
                m => {
                  this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            
                  //Se copia la informacion de la designacion de origen al nuevo EJG creado
                  this.sigaServices.post("gestionJusticiables_copyDesigna2Ejg", request).subscribe(
                    x => {
                      this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                      this.guardadoSend.emit(this.datos);
                    },
                    err => {
                      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos de la designacion al EJG seleccionado");
                    }
                  );
                },
                err => {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                }
              );
            } else if (this.tipo === "soj") {
            
              //Si viene desde SOJ asociamos ejg y soj
              let soj = this.tipoObject;
              let request = [null, soj.anio, soj.numero, soj.idTipoSoj, this.datos.tipoEJG, this.datos.annio, this.datos.numEjg];
            
              this.sigaServices.post("soj_asociarEJGaSOJ", request).subscribe(
                m => {
                  this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                  sessionStorage.setItem("sojItemLink", JSON.stringify(soj));
                  this.location.back();
                },
                err => {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                }
              );
            } else if (this.tipo === "justiciable") {
              // Asociar Justiciable al EJG Interesados.
              let datosJusticiables = this.tipoObject
              let requestEjg = [this.datos.annio, this.datos.numero, this.datos.tipoEJG, datosJusticiables.idpersona];
              
              // Objeto Asocicación de Justiciables y EJG.
              this.sigaServices.post("gestionJusticiables_asociarJusticiableEjg", requestEjg).subscribe(
                m => {
                  //Se debe añadir a la BBDD estos mensajes (etiquetas)
                  if (JSON.parse(m.body).error.code == 200) {
                    sessionStorage.setItem("ejgJusticiableView", JSON.stringify(datosJusticiables));
                  }
                  this.guardadoSend.emit(this.datos);
                }
              );
            } else if (this.tipo === "asistencia") {
            
              let datosAsistencia = this.tipoObject;
              
              let ejgItem: EJGItem = new EJGItem();
              ejgItem.annio = String(this.datos.annio);
              ejgItem.numero = String(this.datos.numero);
              ejgItem.tipoEJG = String(this.datos.tipoEJG);
            
              this.sigaServices.postPaginado("busquedaGuardias_asociarEjg", "?anioNumero=" + datosAsistencia.anioNumero + "&copiarDatos=S", ejgItem).subscribe(
                n => {
            
                  let error = JSON.parse(n.body).error;
                  sessionStorage.removeItem("radioTajertaValue");
            
                  //recargamos la ficha del ejg
                  this.guardadoSend.emit(this.datos);
            
                  if (error != null && error.description != null) {
                    this.showMessage("error", "Error al asociar el EJG con la Asistencia", error.description);
                  } else {
                    this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), 'Se ha asociado el EJG con la Asistencia correctamente');
                  }
                }
              );
            }else{
              this.guardadoSend.emit(this.datos);
            }
            this.updateResumen();
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    }
  }

  changeColegiado(event) {
    this.usuarioBusquedaExpress.nombreAp = event.nombreAp;
    this.usuarioBusquedaExpress.numColegiado = event.nColegiado;
    this.datos.numColegiado = event.nColegiado;
    this.datos.apellidosYNombre = event.nombreAp;
  }

  setIdPersona(event) {
    this.datos.idPersona = event;
  }

  asociarDes() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.persistenceService.setDatosEJG(this.datos);
      sessionStorage.setItem("radioTajertaValue", 'des');
      this.router.navigate(["/busquedaAsuntos"]);
    }
  }

  createDes() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.crearDesignacion.emit();
    }
  }

  addExp() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      //Comprobamos si el EJG tiene una designacion asociada
      if (this.haveDesignacion) {
        this.progressSpinner = true;
        this.sigaServices.post("gestionejg_getDatosExpInsos", this.datos).subscribe(
          n => {
            let datos = JSON.parse(n.body).expInsosItems;
            if (datos != null && datos != undefined) {
              sessionStorage.setItem("expedienteInsos", JSON.stringify(datos[0]));
              this.router.navigate(["/addExp"]);
            } else {
              this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
            }
            this.progressSpinner = false;
          },
          err => {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            this.progressSpinner = false;
          }
        );
      } else {
        this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.datosGenerales.noDesignaEjg') }];
      }
    }
  }

  comunicar() {
    if (!this.permisoEscritura) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.noTienePermisosRealizarAccion"));
    } else {
      this.getDatosComunicar();
    }
  }

  getDatosComunicar() {
    let rutaClaseComunicacion = "/ejg";

    this.sigaServices.post("dialogo_claseComunicacion", rutaClaseComunicacion).subscribe(
      data => {
        let idClaseComunicacion = JSON.parse( data["body"] ).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post("dialogo_keys", idClaseComunicacion).subscribe(
          data => {
            let keys = JSON.parse(data["body"]).keysItem;
            let keysValues = [];
            keys.forEach(key => {
              if (this.datos[key.nombre] != undefined) {
                keysValues.push(this.datos[key.nombre]);
              } else if (key.nombre == "num" && this.datos["numero"] != undefined) {
                keysValues.push(this.datos["numero"]);
              } else if (key.nombre == "anio" && this.datos["annio"] != undefined) {
                keysValues.push(this.datos["annio"]);
              } else if (key.nombre == "idtipoejg" && this.datos["tipoEJG"] != undefined) {
                keysValues.push(this.datos["tipoEJG"]);
              } else if (key.nombre == "identificador") {
                keysValues.push(this.datos["numAnnioProcedimiento"]);
              }
            });
            this.persistenceService.setDatosEJG(this.datos);
            sessionStorage.setItem("idModulo", '10'); //IDMODULO de SJCS es 10
            sessionStorage.setItem("rutaComunicacion", rutaClaseComunicacion);
            sessionStorage.setItem("datosComunicar", JSON.stringify(keysValues));
            this.router.navigate(["/dialogoComunicaciones"]);
          }
        );
      }
    );
  }

  setFecha(event, campo){
    this.datos[campo] = event;
  }

  setDatosEjg(){
    this.persistenceService.setDatosEJG(this.datos);
  }

  clear() {
    this.msgs = [];
  }

  private showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  private getParamMaxLengthNum() {
    let parametro = {valor: "LONGITUD_CODEJG"};
    this.sigaServices.post("busquedaPerJuridica_parametroColegio", parametro).subscribe(
      data => {
        this.maxLengthNum = JSON.parse(data.body).parametro;
      }
    );
  }

  private getComboGuardia() {
    this.sigaServices.getParam("combo_guardiaPorTurno", "?idTurno=" + this.datos.idTurno).subscribe(
      col => {
        this.comboGuardia = col.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboGuardia);
        this.updateResumen();
      }
    );
  }

  private getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJG);
      }
    );
  }

  private getComboTipoEJGColegio() {
    this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJGColegio);
      }
    );
  }

  private getComboPrestaciones() {
    this.sigaServices.get("filtrosejg_comboPrestaciones").subscribe(
      n => {
        this.comboPrestaciones = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPrestaciones);
        if(this.nuevo && this.datos.prestacion == undefined){
          this.datos.prestacion = [];
          this.comboPrestaciones.forEach(element => {
            this.datos.prestacion.push(element.value);
          });
        }else{
          this.getPrestacionesRechazadasEJG();
        }
      }
    );
  }

  private getPrestacionesRechazadasEJG() {
    this.sigaServices.post("gestionejg_searchPrestacionesRechazadasEJG", this.datos).subscribe(
      n => {
        this.datosIniciales.prestacion = [];
        this.datos.prestacionesRechazadas = [];
        JSON.parse(n.body).forEach(element => {
          this.datos.prestacionesRechazadas.push(element.idprestacion.toString());
        });
        this.datos.prestacion = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.datos.prestacionesRechazadas.indexOf(x) === -1);
        this.datosIniciales.prestacion = [...this.datos.prestacion];
      }
    );
  }

  private getComboTurno() {
    if (this.datos.idTurno == null) {
      this.datos.idTurno = "1";
    }
    this.sigaServices.getParam("componenteGeneralJG_comboTurnos", "?pantalla=EJG&idTurno=" + this.datos.idTurno).subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTurno);
        if (this.datos.idTurno != undefined) {
          this.isDisabledGuardia = false;
          this.getComboGuardia();
        }else {
          this.updateResumen();
        }
      }
    );
  }

  private getTipoExpediente() {
    this.sigaServices.get("gestionejg_comboTipoExpediente").subscribe(
      n => {
        let tiposExpediente = n.combooItems;
        this.commonsServices.arregloTildesCombo(tiposExpediente);
        tiposExpediente.forEach(tipo => {
          if(tipo.value == this.datos.idTipoExpInsos){
            this.tipoExpedienteDes = tipo.label;
          }
        });
      }
    );
  }

  private updateResumen() {
    if(this.datos != undefined && this.datos != null){
      if (this.datos.numColegiado != null && this.datos.numColegiado != undefined) {
        this.resumen.numColegiado = this.datos.numColegiado;
      }
      if (this.datos.tipoEJG != null && this.datos.tipoEJG != undefined) {
        this.comboTipoEJG.forEach(element => {
          if (element.value == this.datos.tipoEJG){
            this.resumen.tipoEJGDesc = element.label;
          }
        });
      }
      if (this.datos.tipoEJGColegio != null && this.datos.tipoEJGColegio != undefined) {
        this.comboTipoEJGColegio.forEach(element => {
          if (element.value == this.datos.tipoEJGColegio){
            this.resumen.tipoEJGColDesc = element.label;
          }
        });
      }
      if (this.datos.idTurno != null && this.datos.idTurno != undefined) {
        this.comboTurno.forEach(element => {
          if (element.value == this.datos.idTurno){
            this.resumen.turnoEJGDesc = element.label;
          }
        });
      }
      if (this.datos.idGuardia != null && this.datos.idGuardia != undefined) {
        this.comboGuardia.forEach(element => {
          if (element.value == this.datos.idGuardia) {
            this.resumen.turnoGuardiaEJGDesc = element.label;
          }
        });
      }
    }
  }
}