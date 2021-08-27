import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, SimpleChanges, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';
import { Message } from 'primeng/components/common/api';
import { procesos_ejg } from '../../../../../permisos/procesos_ejg';
import { DesignaItem } from '../../../../../models/sjcs/DesignaItem';
import { Location } from '@angular/common'


@Component({
  selector: 'app-datos-generales-ejg',
  templateUrl: './datos-generales-ejg.component.html',
  styleUrls: ['./datos-generales-ejg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesEjgComponent implements OnInit {
  //Resultados de la busqueda
  @Input() datos: EJGItem;
  @Input() modoEdicion;
  @Input() permisoEscritura;
  @Input() tarjetaDatosGenerales: string;
  @Input() art27: boolean = false;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() guardadoSend = new EventEmitter<any>();
  @Output() newEstado = new EventEmitter();

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  body: EJGItem;
  bodyInicial: EJGItem;
  nuevoBody: EJGItem = new EJGItem();
  msgs: Message[] = [];
  nuevo;
  url = null;
  textSelected: String = '{0} opciones seleccionadas';
  tipoEJGDesc = "";
  tipoEJGColDesc = "";
  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboPrestaciones = [];
  comboTipoExpediente = [];
  tipoExpedienteDes: string;
  showTipoExp: boolean = false;

  institucionActual;

  @ViewChild('someDropdown') someDropdown: MultiSelect;

  selectedDatosColegiales;
  showMessageInscripcion;

  resaltadoDatosGenerales: boolean = false;
  resaltadoDatos: boolean = false;

  fichaPosible = {
    key: "datosGenerales",
    activa: false
  }

  activacionTarjeta: boolean = false;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  @Input() openTarjetaDatosGenerales;
  @Input() noAsocDes;

  disabledNumEJG: boolean = true;

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    this.resaltadoDatos = true;
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    this.getComboPrestaciones();
    this.getComboTipoExpediente();


    if (this.persistenceService.getDatos()) {
      this.modoEdicion = true;
      this.nuevo = false;
      this.body = this.persistenceService.getDatos();

      this.disabledNumEJG = true;

      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      if (this.body.fechalimitepresentacion != undefined)
        this.body.fechalimitepresentacion = new Date(this.body.fechalimitepresentacion);
      if (this.body.fechapresentacion != undefined)
        this.body.fechapresentacion = new Date(this.body.fechapresentacion);
      if (this.body.fechaApertura != undefined)
        this.body.fechaApertura = new Date(this.body.fechaApertura);
      if (this.body.tipoEJG != undefined)
        this.showTipoExp = true;

      this.getPrestacionesRechazadasEJG();
    } else {
      this.disabledNumEJG = true;
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
      this.bodyInicial = new EJGItem();
      this.showTipoExp = false;
    }

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.openTarjetaDatosGenerales == true) {
      if (this.openFicha == false) {
        this.fichaPosible.activa = !this.fichaPosible.activa;
        this.openFicha = !this.openFicha;
      }
    }
  }

  getPrestacionesRechazadasEJG() {
    this.sigaServices.post("gestionejg_searchPrestacionesRechazadasEJG", this.body).subscribe(
      n => {
        this.bodyInicial.prestacionesRechazadas = [];
        JSON.parse(n.body).forEach(element => {
          this.bodyInicial.prestacionesRechazadas.push(element.idprestacion.toString());
        });;
        this.bodyInicial.prestacion = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.bodyInicial.prestacionesRechazadas.indexOf(x) === -1);
        this.body.prestacion = this.bodyInicial.prestacion;
      },
      err => {
      }
    );


  }

  getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
        //Determina el valor en la cabecera del campo tipo ejg 
        if (this.body.tipoEJG != null && this.body.tipoEJG != undefined) {
          this.comboTipoEJG.forEach(element => {
            if (element.value == this.body.tipoEJG) this.tipoEJGDesc = element.label;
          });
        }
        this.commonsServices.arregloTildesCombo(this.comboTipoEJG);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTipoEJGColegio() {
    this.sigaServices.get("filtrosejg_comboTipoEJGColegio").subscribe(
      n => {
        this.comboTipoEJGColegio = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoEJGColegio);

        //Determina el valor en la cabecera del campo tipo ejg colegio
        if (this.body.tipoEJGColegio != null && this.body.tipoEJGColegio != undefined) {
          this.changeTipoEJGColegio();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  changeTipoEJGColegio() {
    this.comboTipoEJGColegio.forEach(element => {
      if (element.value == this.body.tipoEJGColegio) this.tipoEJGColDesc = element.label;
    });
  }

  getComboTipoExpediente() {
    this.sigaServices.get("gestionejg_comboTipoExpediente").subscribe(
      n => {
        this.comboTipoExpediente = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboTipoExpediente);
        let tipoExp = this.comboTipoExpediente.find(
          item => item.value == this.body.tipoEJG
        );
        if (tipoExp != undefined)
          this.tipoExpedienteDes = tipoExp.label;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPrestaciones() {
    this.sigaServices.get("filtrosejg_comboPrestaciones").subscribe(
      n => {
        this.comboPrestaciones = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboPrestaciones);
        this.body.prestacion = n.combooItems.map(it => it.value.toString());
        this.bodyInicial.prestacion = this.body.prestacion;
      },
      err => {
        console.log(err);
      }
    );
  }

  fillFechaApertura(event) {
    this.body.fechaApertura = event;
  }

  fillFechaPresentacion(event) {
    this.body.fechapresentacion = event;
  }

  fillFechaLimPresentacion(event) {
    this.body.fechalimitepresentacion = event;
  }

  esFichaActiva(key) {
    return this.fichaPosible.activa;
  }

  abreCierraFicha(key) {
    this.resaltadoDatosGenerales = true;
    if (
      key == "datosGenerales" &&
      !this.activacionTarjeta
    ) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  disabledSave() {
    if (this.nuevo) {
      if (this.body.fechaApertura != undefined) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.permisoEscritura) {
        if (this.body.fechaApertura != undefined) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }

  clear() {
    this.msgs = [];
  }

  checkPermisosSave() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.muestraCamposObligatorios();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;

    if (this.modoEdicion) {
      this.body.prestacionesRechazadas = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.body.prestacion.indexOf(x) === -1);

      //hacer update
      this.sigaServices.post("gestionejg_actualizaDatosGenerales", this.body).subscribe(
        n => {
          this.progressSpinner = false;

          if (n.statusText == "OK") {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            //Se actualiza la tarjeta de estados en el caso que se actualice el estado inicial por cambiar la fecha de apertura
            if (this.body.fechaApertura != this.bodyInicial.fechaApertura)
              this.newEstado.emit(null);

            this.body.numAnnioProcedimiento = "E" + this.body.annio + "/" + this.body.numEjg;

            this.bodyInicial = this.body;

            this.persistenceService.setDatos(this.bodyInicial);

            this.guardadoSend.emit(true);

            this.changeTipoEJGColegio();
          }
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        },
        err => {
          this.progressSpinner = false;

          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
      this.progressSpinner = false;
    } else {
      //hacer insert
      //Se comprueban los campos obligatorios
      if (this.body.tipoEJG != null && this.body.tipoEJG != undefined && this.body.fechaApertura != null && this.body.fechaApertura != undefined) {
        this.body.annio = this.body.fechaApertura.getFullYear().toString();
        this.body.idInstitucion = this.institucionActual;

        this.sigaServices.post("gestionejg_insertaDatosGenerales", JSON.stringify(this.body)).subscribe(
          n => {
            this.progressSpinner = false;

            if (JSON.parse(n.body).error.code == 200) {
              let ejgObject = JSON.parse(n.body).ejgItems;
              let datosItem = ejgObject[0];
              this.persistenceService.setDatos(datosItem);


              //En el caso que se proceda de una designación, se asocia el EJG con la designación
              if (sessionStorage.getItem("Designacion")) {

                let designa: DesignaItem = JSON.parse(sessionStorage.getItem("Designacion"));

                sessionStorage.removeItem("Designacion");

                //El formato de el atributo designa.ano es "D[año]/[numDesigna]"
                let designaAnio = designa.ano.toString().slice(1,5);

                let numDesigna = designa.ano.toString().split("/")[1];

                let request = [designaAnio, this.body.annio, this.body.tipoEJG, designa.idTurno, numDesigna, datosItem.numero];

                //Se asociado el nuevo EJG creado a la designación de origen
                this.sigaServices.post("designacion_asociarEjgDesigna", request).subscribe(
                  m => {

                    this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

                    //Se copia la informacion de la designacion de origen al nuevo EJG creado
                    this.sigaServices.post("gestionJusticiables_copyDesigna2Ejg", request).subscribe(
                      x => {
                        this.progressSpinner = false;
                        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
                        this.location.back();
                      },
                      err => {
                        //Crear etiqueta en la BBDD
                        this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Se ha producido un error al copiar los datos de la designacion al EJG seleccionado");
                        this.location.back();
                      }
                    );
                  },
                  err => {
                    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
                    this.progressSpinner = false;
                  }
                );

              }
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.body.numEjg = datosItem.numEjg;
              this.body.numero = datosItem.numero;
              this.guardadoSend.emit(true);
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }
          },
          err => {
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          });
      }
      else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
        this.progressSpinner = false;
      }
    }
  }

  checkPermisosRest() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    if (!this.nuevo) {
      this.body = JSON.parse(JSON.stringify(this.bodyInicial));

      if (this.body.fechalimitepresentacion != undefined)
        this.body.fechalimitepresentacion = new Date(this.body.fechalimitepresentacion);
      if (this.body.fechapresentacion != undefined)
        this.body.fechapresentacion = new Date(this.body.fechapresentacion);
      if (this.body.fechaApertura != undefined)
        this.body.fechaApertura = new Date(this.body.fechaApertura);
      if (this.body.tipoEJG != undefined)
        this.showTipoExp = true;
    } else {
      this.body = JSON.parse(JSON.stringify(this.nuevoBody));
    }
  }

  checkPermisosComunicar() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.comunicar();
    }
  }

  comunicar() {
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAsociarDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDes();
    }
  }

  asociarDes() {
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Esto determina que en la pantalla de busqueda de asuntos no se pueda cambiar de la pocion de designaciones
    sessionStorage.setItem("radioTajertaValue", 'des');
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
    this.router.navigate(["/busquedaAsuntos"]);
  }

  checkPermisosCreateDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.createDes();
    }
  }

  createDes() {
    this.progressSpinner = true;
    //Recogemos los datos de nuevo de la capa de persistencia para captar posibles cambios realizados en el resto de tarjetas
    this.body = this.persistenceService.getDatos();
    this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    //Utilizamos el bodyInicial para no tener en cuenta cambios que no se hayan guardado.
    sessionStorage.setItem("EJG", JSON.stringify(this.bodyInicial));
    sessionStorage.setItem("nuevaDesigna", "true");
    if (this.art27) sessionStorage.setItem("Art27", "true");
    this.progressSpinner = false;
    this.router.navigate(["/fichaDesignaciones"]);
  }

  checkPermisosAddExp() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //Comprobamos si el EJG tiene una designacion asociada
      if (!this.noAsocDes) {
        this.addExp();
      }
      else this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.datosGenerales.noDesignaEjg') }];
    }
  }

  addExp() {

    /*let us = undefined;
    us = this.sigaServices.getOldSigaUrl() + "JGR_MantenimientoEJG.do?codigoDesignaNumEJG=" + this.body.numEjg +
      "&numeroEJG=" + this.body.numEjg + "&idTipoEJG=" + this.body.tipoEJG + "&idInstitucionEJG=" + this.body.idInstitucion + "&anioEJG=" + this.body.annio +
      "&actionE=/JGR_InteresadoEJG.do&localizacionE=gratuita.busquedaEJG.localizacion&tituloE=pestana.justiciagratuitaejg.solicitante" +
      "&idInstitucionJG=" + this.institucionActual + "&idPersonaJG=" + this.body.idPersonajg + "&conceptoE=EJG&NUMERO=" + this.body.numEjg +
      "&ejgNumEjg=" + this.body.numEjg + "&IDTIPOEJG=" + this.body.tipoEJG + "&ejgAnio=" + this.body.annio + "&accionE=editar&IDINSTITUCION=" + this.institucionActual +
      "&solicitante=" + this.body.nombreApeSolicitante + "&ANIO=" + this.body.annio;

    us = encodeURI(us);

    sessionStorage.setItem("url", JSON.stringify(us));
    sessionStorage.removeItem("reload");
    sessionStorage.setItem("reload", "si");*/
    sessionStorage.setItem("expedienteInsos", JSON.stringify(this.body));


    this.router.navigate(["/addExp"]);
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

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();
    }, 300);
  }

  disableEnableNumEJG() {
    this.commonsServices.checkAcceso(procesos_ejg.cambioNumEJG)
      .then(respuesta => {
        if (respuesta) {
          this.disabledNumEJG = !this.disabledNumEJG;
        } else {
          this.msgs = this.commonsServices.checkPermisos(false, undefined);
        }
      }).catch(error => console.error(error));
  }

}
