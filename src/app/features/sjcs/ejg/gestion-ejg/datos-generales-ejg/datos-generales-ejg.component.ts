import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, SimpleChanges, ViewChild } from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { TranslateService } from '../../../../../commons/translate';
import { Router } from '@angular/router';
import { MultiSelect } from 'primeng/multiselect';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';


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
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() guardadoSend = new EventEmitter<any>();

  openFicha: boolean = false;
  textFilter: string = "Seleccionar";
  progressSpinner: boolean = false;
  body: EJGItem;
  bodyInicial: EJGItem;
  nuevoBody: EJGItem = new EJGItem();
  msgs = [];
  nuevo;
  url=null;
  textSelected: String = '{0} opciones seleccionadas';
  tipoEJGDesc = "";
  comboTipoEJG = [];
  comboTipoEJGColegio = [];
  comboPrestaciones = [];
  comboTipoExpediente = [];
  tipoExpedienteDes: string;
  showTipoExp: boolean = false;

  institucionActual;
  isdisabledAddExp: boolean = false;

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

  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private commonsServices: CommonsService,
    private translateService: TranslateService,
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

      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      /* this.sigaServices.post("gestionejg_datosEJG", selected).subscribe(
        n => {
          this.ejgObject = JSON.parse(n.body).ejgItems;
          this.datosItem = this.ejgObject[0];
          this.persistenceService.setDatos(this.datosItem);
          this.consultaUnidadFamiliar(selected);
          this.commonServices.scrollTop();
        },
        err => {
          console.log(err);
          this.commonServices.scrollTop();
        }
      ); */
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
      this.nuevo = true;
      this.modoEdicion = false;
      this.body = new EJGItem();
      this.showTipoExp = false;
      // this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }

    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
    });
    if(this.body.anioexpInsos!= null && this.body.anioexpInsos != undefined) this.isdisabledAddExp = true;

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
        //this.bodyInicial.prestacion = this.body.prestacion.filter(x => this.bodyInicial.prestacionesRechazadas.indexOf(x) === -1);
        this.bodyInicial.prestacion = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.bodyInicial.prestacionesRechazadas.indexOf(x) === -1);
        this.body.prestacion = this.bodyInicial.prestacion;
      },
      err => {
        console.log(err);
      }
    );


  }

  getComboTipoEJG() {
    this.sigaServices.get("filtrosejg_comboTipoEJG").subscribe(
      n => {
        this.comboTipoEJG = n.combooItems;
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
      },
      err => {
        console.log(err);
      }
    );
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
        // this.textSelected = n.combooItems;
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
        //this.msgs = this.commonsServices.checkPermisoAccion();
        this.muestraCamposObligatorios();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;

    if (this.modoEdicion) {

      /* //Comprobamos si las prestaciones rechazadas iniciales.
      let prestacionesRechazadasInicial = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.bodyInicial.prestacion.indexOf(x) === -1);
      
      //Comprobamos las prestaciones rechazadas actuales.
      let prestacionesRechazadasActual = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.body.prestacion.indexOf(x) === -1);

      //Comprobamos la diferencia entre ambas prestaciones rechazadas. SI son iguales se declara con un array vacio. 
      //En caso contrario, se le asigna los ids de las prestaciones rechazadas.
      if(prestacionesRechazadasInicial.length === prestacionesRechazadasActual.length && 
        prestacionesRechazadasInicial.every(function(value, index) { return value === prestacionesRechazadasActual[index]})){
          this.body.prestacionesRechazadas = [];
        }
        else this.body.prestacionesRechazadas = prestacionesRechazadasActual; */

      this.body.prestacionesRechazadas = this.comboPrestaciones.map(it => it.value.toString()).filter(x => this.body.prestacion.indexOf(x) === -1);
      //hacer update
      this.sigaServices.post("gestionejg_actualizaDatosGenerales", this.body).subscribe(
        n => {
          this.progressSpinner = false;

          if (n.statusText == "OK") {
            this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
            this.bodyInicial = this.body;
          }
          else this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        },
        err => {
          console.log(err);
          this.progressSpinner = false;

          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
      this.progressSpinner = false;
    } else {
      //hacer insert
      if (this.body.tipoEJG != null && this.body.tipoEJG != undefined && this.body.fechaApertura != null && this.body.fechaApertura != undefined) {
        this.body.annio = this.body.fechaApertura.getFullYear().toString();
        this.body.idInstitucion = this.institucionActual;

        this.sigaServices.post("gestionejg_insertaDatosGenerales", JSON.stringify(this.body)).subscribe(
          n => {
            this.progressSpinner = false;
            if(JSON.parse(n.body).error.code==200){
              let ejgObject = JSON.parse(n.body).ejgItems;
              let datosItem = ejgObject[0];
              this.persistenceService.setDatos(datosItem);
              this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
              this.body.numEjg = datosItem.numEjg;
              this.body.numero = datosItem.numero;
              this.guardadoSend.emit(true);
            }
            else{
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
            }

          },
          err => {
            this.progressSpinner = false;
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
          }
        );
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
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
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
    this.persistenceService.clearDatos();
    this.router.navigate(["/gestionEjg"]);
  }

  checkPermisosAddExp() {
    let msg = this.commonsServices.checkPermisos(this.permisoEscritura, undefined);
    if (msg != undefined) {
      this.msgs = msg;
    } else {
      //Comprobamos si el EJG tiene una designacion asociada
      //if(this.body.numDesigna != undefined && this.body.numDesigna != null) this.addExp();
      //else this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.datosGenerales.noDesignaEjg') }];
      this.addExp();
    }
  }


  addExp() {
    let us = undefined;
      us =
        this.sigaServices.getOldSigaUrl() +
        "JGR_MantenimientoEJG.do?codigoDesignaNumEJG="+this.body.numEjg+"&numeroEJG="+this.body.numEjg+"&idTipoEJG="+this.body.tipoEJG+
        "&idInstitucionEJG="+this.body.idInstitucion+"&anioEJG="+this.body.annio+"&actionE=/JGR_InteresadoEJG.do&" +
        "localizacionE=gratuita.busquedaEJG.localizacion&tituloE=pestana.justiciagratuitaejg.solicitante&idInstitucionJG="+this.institucionActual+"&idPersonaJG="+this.body.idPersonajg+"&conceptoE=EJG&"+
        "NUMERO="+this.body.numero+"&ejgNumEjg="+this.body.numEjg+"&IDTIPOEJG="+this.body.tipoEJG+"&ejgAnio="+this.body.annio+"&accionE=editar&IDINSTITUCION="+this.institucionActual+"&solicitante=JOSE%20LUIS%20ALGBJL%20ZVQNDSMF&ANIO="+this.body.annio+"";
    

    sessionStorage.setItem("url", JSON.stringify(us));
    sessionStorage.removeItem("reload");
    sessionStorage.setItem("reload", "si");
    //sessionStorage.setItem("idInstitucionFichaColegial", this.body.idInstitucion);

    this.url="";
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

}
