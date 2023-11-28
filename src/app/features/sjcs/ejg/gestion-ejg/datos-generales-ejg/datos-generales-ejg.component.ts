import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
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
import { TarjetaAsistenciaItem } from '../../../../../models/guardia/TarjetaAsistenciaItem';
import * as moment from 'moment';
import { JusticiableItem } from '../../../../../models/sjcs/JusticiableItem';
import { ParametroRequestDto } from '../../../../../models/ParametroRequestDto';
import { ParametroDto } from '../../../../../models/ParametroDto';

@Component({
  selector: 'app-datos-generales-ejg',
  templateUrl: './datos-generales-ejg.component.html',
  styleUrls: ['./datos-generales-ejg.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatosGeneralesEjgComponent implements OnInit, OnDestroy{
  //Resultados de la busqueda
  @Input() datos: EJGItem;
  @Input() modoEdicion;
  permisoEscritura: boolean = false;
  @Input() tarjetaDatosGenerales: string;
  @Input() art27: boolean = false;

  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() guardadoSend = new EventEmitter<any>();
  @Output() newEstado = new EventEmitter();
  @Input() nuevo;
  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  body: EJGItem;
  bodyInicial: EJGItem;
  nuevoBody: EJGItem = new EJGItem();
  msgs: Message[] = [];
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
  datosAsistencia: TarjetaAsistenciaItem;
  datosJusticiables: JusticiableItem;
  maxLengthNum: Number = 5;
  ejgCreadoNuevo: boolean = false;

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
  tieneAsocDes: Boolean = false;

  disabledNumEJG: boolean = true;

  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
    private location: Location,
    private router: Router) { }

  ngOnInit() {
    //console.log('nuevo 2: ', this.nuevo)
    //this.currentRoute = this.router.url;
    this.currentRoute =  '/ejg'
    this.resaltadoDatos = true;
    this.getComboTipoEJG();
    this.getComboTipoEJGColegio();
    this.getComboPrestaciones();
    this.getComboTipoExpediente();
    

    if (this.persistenceService.getDatosEJG()) {
      this.modoEdicion = true;
      this.nuevo = false;
      this.body = this.persistenceService.getDatosEJG();

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
      this.getRelaciones();
    } else if (sessionStorage.getItem("asistencia")) { //Si hemos pulsado Crear EJG en la ficha de Asistencias en la tarjeta Relaciones o le hemos dado a Crear EJG en la pantalla de asistencias expres

      this.datosAsistencia = JSON.parse(sessionStorage.getItem("asistencia"));
      this.disabledNumEJG = true;
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
      this.bodyInicial = new EJGItem();
      this.showTipoExp = false;
      this.body.fechaApertura = new Date(); //moment(this.datosAsistencia.fechaAsistencia.substr(0, 10), 'DD/MM/YYYY').toDate();
      this.bodyInicial.fechaApertura = new Date();
      this.body.creadoDesde = "A";
      this.bodyInicial.creadoDesde = "A";
    } else {
      this.disabledNumEJG = true;
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
      this.body.fechaApertura = new Date();
      this.bodyInicial = new EJGItem();
      this.bodyInicial.fechaApertura = new Date();
      this.showTipoExp = false;
    }

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      this.getParamMaxLengthNum();
    });

    this.commonsServices.checkAcceso(procesos_ejg.datosGenerales)
      .then(respuesta => {
        this.permisoEscritura = respuesta;
      }
      ).catch(error => console.error(error));

  }
  getParamMaxLengthNum() {

    let parametro = {
      valor: "LONGITUD_CODEJG"
    };

    this.sigaServices
      .post("busquedaPerJuridica_parametroColegio", parametro)
      .subscribe(
        data => {
          this.maxLengthNum = JSON.parse(data.body).parametro;
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

        this.sigaServices
          .get("filtrosejg_getTipoEJGDefecto")
          .subscribe(
            data => {
              if (data != null && data != undefined) {
                let tipoEJGAux = data;
                for (let i = 0; i < this.comboTipoEJG.length; i++) {
                  if (this.comboTipoEJG[i].value == tipoEJGAux) {
                    this.body.tipoEJG = this.comboTipoEJG[i].value;
                  }
                }
              }
            });
      },
      err => {
        //console.log(err);
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
        let parametro = {
          valor: "TIPO_EJG_COLEGIO"
        };

        this.sigaServices
          .post("busquedaPerJuridica_parametroColegio", parametro)
          .subscribe(
            data => {

              if (data != null && data != undefined) {
                let tipoEJGColegioAux = JSON.parse(data.body).parametro;
                for (let i = 0; i < this.comboTipoEJGColegio.length; i++) {
                  if (this.comboTipoEJGColegio[i].label === tipoEJGColegioAux) {
                    this.body.tipoEJGColegio = this.comboTipoEJGColegio[i].value;
                  }
                }
              }
            });

      },
      err => {
        //console.log(err);
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
        //console.log(err);
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
        //console.log(err);
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
    if(!this.nuevo){
      this.resaltadoDatosGenerales = true;
    }
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
    if(this.nuevo){
      this.resaltadoDatosGenerales = true;
    }
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

            this.body.numEjg = n.body.substring(n.body.indexOf("id")+5,n.body.indexOf("error")-3);
            this.bodyInicial = this.body;
            this.nuevo = false;
            this.persistenceService.setDatosEJG(this.bodyInicial);

            this.guardadoSend.emit(true);

            this.changeTipoEJGColegio();
          }
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        },
        err => {
          this.progressSpinner = false;
          if(err.error!=null && err.error !=undefined && err.error.indexOf('description') >0){
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(err.error.substring(err.error.indexOf('message')+10,err.error.indexOf('description')-3)) + " " + err.error.substring(err.error.indexOf('description')+14,err.error.indexOf('infoURL')-3));
          }else{
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        }
      );
      this.progressSpinner = false;
    } else {
      //hacer insert
      //Se comprueban los campos obligatorios
      if (this.body.tipoEJG != null && this.body.tipoEJG != undefined && this.body.fechaApertura != null && this.body.fechaApertura != undefined) {
        this.body.annio = this.body.fechaApertura.getFullYear().toString();
        this.body.idInstitucion = this.institucionActual;

        //si viene de designacion, hay que poner el campo de creado desde
        if (sessionStorage.getItem("Designacion")) {
          this.body.creadoDesde = 'O';
        } else if (this.body.creadoDesde == undefined || this.body.creadoDesde == null) {
          this.body.creadoDesde = 'M'
        }

        this.body.perceptivo = '1';
        this.body.calidad = '0';

        this.sigaServices.post("gestionejg_insertaDatosGenerales", JSON.stringify(this.body)).subscribe(
          n => {
            this.progressSpinner = false;

            if (JSON.parse(n.body).error.code == 200) {
              let ejgObject = JSON.parse(n.body).ejgItems;
              let datosItem = ejgObject[0];
              this.persistenceService.setDatosEJG(datosItem);


              //En el caso que se proceda de una designación, se asocia el EJG con la designación
              if (sessionStorage.getItem("Designacion")) {

                let designa: DesignaItem = JSON.parse(sessionStorage.getItem("Designacion"));

                sessionStorage.removeItem("Designacion");

                //El formato de el atributo designa.ano es "D[año]/[numDesigna]"
                let designaAnio = designa.ano.toString().slice(1, 5);

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

              }else if(sessionStorage.getItem("SOJ")){
                //Si viene desde SOJ asociamos ejg y soj
                
                let soj = JSON.parse(sessionStorage.getItem("SOJ"));
                let request = [null, soj.anio, soj.numero, soj.idTipoSoj, datosItem.tipoEJG, datosItem.annio, datosItem.numEjg];
                
          this.sigaServices.post("soj_asociarEJGaSOJ", request).subscribe(
            m => {

              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              sessionStorage.removeItem("radioTajertaValue");
              sessionStorage.setItem("sojItemLink", JSON.stringify(soj));
                    this.location.back();
                  
            },
            err => {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
              // this.location.back();
              this.progressSpinner = false;
            }
          );

              } else if (sessionStorage.getItem("justiciable")) {
                // Asociar Justiciable al EJG Interesados.
                  this.datosJusticiables = JSON.parse(sessionStorage.getItem("justiciable"));
                  let requestEjg = [datosItem.annio, datosItem.numEjg, datosItem.idTipoEjg, this.datosJusticiables.idpersona];
                  // Objeto Asocicación de Justiciables y EJG.
                  this.sigaServices.post("gestionJusticiables_asociarJusticiableEjg", requestEjg).subscribe(
                    m => {
                      //Se debe añadir a la BBDD estos mensajes (etiquetas)
                      if (JSON.parse(m.body).error.code == 200) {
                        this.progressSpinner = false;
                        sessionStorage.setItem("ejgJusticiableView",JSON.stringify(this.datosJusticiables));

                      }
                    },
                    err => {
                      this.progressSpinner = false;
                      //this.location.back();
                    }, () => {
                      this.progressSpinner = false;
                      this.location.back();
                    }
                    
                  );
                
              } else if (this.datosAsistencia) {

                let ejgItem: EJGItem = new EJGItem();
                ejgItem.annio = String(datosItem.annio);
                ejgItem.numero = String(datosItem.numero);
                ejgItem.tipoEJG = String(datosItem.tipoEJG);

                this.sigaServices.postPaginado("busquedaGuardias_asociarEjg", "?anioNumero=" + this.datosAsistencia.anioNumero + "&copiarDatos=S", ejgItem).subscribe(
                  n => {

                    let error = JSON.parse(n.body).error;
                    this.progressSpinner = false;
                    sessionStorage.removeItem("radioTajertaValue");

                    //recargamos la ficha del ejg
                    this.guardadoSend.emit(true);

                    if (error != null && error.description != null) {
                      this.showMessage("error", "Error al asociar el EJG con la Asistencia", error.description);
                    } else {
                      this.showMessage('success', this.translateService.instant("general.message.accion.realizada"), 'Se ha asociado el EJG con la Asistencia correctamente');
                    }
                  },
                  err => {
                    //console.log(err);
                    this.progressSpinner = false;
                  }, () => {
                    this.progressSpinner = false;
                    //sessionStorage.setItem("volver", "true");
                    sessionStorage.removeItem("asistencia");
                    //this.location.back();
                  }
                );

              }
              this.ejgCreadoNuevo = true;
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
      this.disabledNumEJG = true;
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
      this.body.fechaApertura = new Date();
      this.bodyInicial = new EJGItem();
      this.bodyInicial.fechaApertura = new Date();
      this.showTipoExp = false;
      this.getComboPrestaciones();
    }
  }

  getRelaciones() {
    this.sigaServices.post("gestionejg_getRelaciones", this.body).subscribe(
      n => {
        let relaciones = JSON.parse(n.body).relacionesItem;
        let nRelaciones = relaciones.length;
        relaciones.forEach(relacion => {
          switch (relacion.sjcs) {
            case 'DESIGNACIÓN':
              //en caso de designacion, si ya esta relacionado no se podra crear una nueva designacion para ese EJG
              this.tieneAsocDes = true;
              break;
          }
          
        })
      },
      err => {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
  }

  checkPermisosComunicar() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.persistenceService.clearDatos();
      this.navigateComunicar();
    }
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
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

                  if (this.bodyInicial[key.nombre] != undefined) {
                    keysValues.push(this.bodyInicial[key.nombre]);
                  } else if (key.nombre == "num" && this.bodyInicial["numero"] != undefined) {
                    keysValues.push(this.bodyInicial["numero"]);
                  } else if (key.nombre == "anio" && this.bodyInicial["annio"] != undefined) {
                    keysValues.push(this.bodyInicial["annio"]);
                  } else if (key.nombre == "idtipoejg" && this.bodyInicial["tipoEJG"] != undefined) {
                    keysValues.push(this.bodyInicial["tipoEJG"]);
                  }else if(key.nombre == "identificador"){
                    keysValues.push(this.bodyInicial["numAnnioProcedimiento"]);
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
  


  checkPermisosAsociarDes() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.asociarDes();
    }
  }

  asociarDes() {
    this.body = this.persistenceService.getDatosEJG();
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
    this.body = this.persistenceService.getDatosEJG();
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
      if (this.tieneAsocDes) {
        this.addExp();
      }
      else this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.datosGenerales.noDesignaEjg') }];
    }
  }

  addExp() {
    this.progressSpinner = true;

    this.sigaServices.post("gestionejg_getDatosExpInsos", this.body).subscribe(
      n => {
        this.progressSpinner = false;
        let datos = JSON.parse(n.body).expInsosItems;

        //console.log('valor de n:'+n);
        //console.log('valor de n.body:'+n.body);
        //console.log('valor de datos:'+datos);

        if (datos != null && datos != undefined) {
          sessionStorage.setItem("expedienteInsos", JSON.stringify(datos[0]));
          this.router.navigate(["/addExp"]);
        } else {
          this.showMessage("error", this.translateService.instant("general.message.informacion"), this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
        }
      },
      err => {
        //console.log(err);
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
      }
    );
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
        if (respuesta && this.nuevo == false) {
          this.disabledNumEJG = !this.disabledNumEJG;
        } else {
          this.msgs = this.commonsServices.checkPermisos(false, undefined);
        }
      }).catch(error => console.error(error));
  }

  ngOnDestroy(){
    if(sessionStorage.getItem("justiciable") && !sessionStorage.getItem("SOJ")){
      sessionStorage.removeItem("justiciable");
    }
  }

}
