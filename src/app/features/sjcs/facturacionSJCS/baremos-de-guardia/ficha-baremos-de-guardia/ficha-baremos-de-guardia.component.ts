import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TranslateService } from '../../../../../commons/translate/translation.service';
import { Location } from '@angular/common';
import { SigaServices } from '../../../../../_services/siga.service';
import { CommonsService } from '../../../../../_services/commons.service';
import { BaremosGuardiaItem } from '../../../../../models/sjcs/BaremosGuardiaItem';
import { FichaBarDatosGeneralesComponent } from './ficha-bar-datos-generales/ficha-bar-datos-generales.component';
import { FichaBarConfiFacComponent } from './ficha-bar-confi-fac/ficha-bar-confi-fac.component';
import { FichaBarConfiAdiComponent } from './ficha-bar-confi-adi/ficha-bar-confi-adi.component';
import { SigaStorageService } from '../../../../../siga-storage.service';
import { PersistenceService } from '../../../../../_services/persistence.service';
import { Router } from '@angular/router';
import { procesos_facturacionSJCS } from '../../../../../permisos/procesos_facturacionSJCS';
import { procesos_maestros } from '../../../../../permisos/procesos_maestros';
import { truncate } from 'fs';

export interface Enlace {
  id: string;
  ref: any;
}

@Component({
  selector: 'app-ficha-baremos-de-guardia',
  templateUrl: './ficha-baremos-de-guardia.component.html',
  styleUrls: ['./ficha-baremos-de-guardia.component.scss']
})
export class FichaBaremosDeGuardiaComponent implements OnInit, AfterViewInit {

  tarjetaFija = {
    nombre: 'facturacionSJCS.baremosDeGuardia.inforesumen',
    icono: 'fas fa-clipboard',
    imagen: '',
    detalle: false,
    fixed: true,
    campos: [],
    enlaces: [
      { id: 'facSJCSFichaBarDatosGen', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.datosGenerales'), ref: document.getElementById('facSJCSFichaBarDatosGen') },
      { id: 'facSJCSFichaBarConfiFac', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.confiFac'), ref: document.getElementById('facSJCSFichaBarConfiFac') },
      { id: 'facSJCSFichaBarConfiAdi', nombre: this.translateService.instant('facturacionSJCS.baremosDeGuardia.confiAdi'), ref: document.getElementById('facSJCSFichaBarConfiAdi') }
    ]
  };



  modoEdicion: boolean;
  progressSpinner: boolean;
  datosFichDatGenerales: BaremosGuardiaItem[] = [];
  datosFichConfiFac = {
    diasDis: {
      lDis: false,
      mDis: false,
      xDis: false,
      jDis: false,
      vDis: false,
      sDis: false,
      dDis: false,
    },
    diasAsAc: {
      lAsAc: false,
      mAsAc: false,
      xAsAc: false,
      jAsAc: false,
      vAsAc: false,
      sAsAc: false,
      dAsAc: false,
    },

    agruparDis: false,

    agruparAsAc: false
  };
  proceso2014: boolean = false;
  msgs: any[];
  tieneDatos: boolean = false;
  datos: BaremosGuardiaItem = new BaremosGuardiaItem();
  datosFichaBaremos;
  permisoEscritura;
  permisoTipoEscritura;
  permisoTiposAsistencia;
  permisoTiposActuaciones;
  hitos: string[] = []
  @ViewChild(FichaBarDatosGeneralesComponent) tarjetaDatosGenerales: FichaBarDatosGeneralesComponent;
  @ViewChild(FichaBarConfiFacComponent) tarjetaConfigFac: FichaBarConfiFacComponent;
  @ViewChild(FichaBarConfiAdiComponent) tarjetaConfigAdi: FichaBarConfiAdiComponent;

  constructor(private translateService: TranslateService,
    private location: Location,
    private sigaServices: SigaServices,
    private persistenceService: PersistenceService,
    private localStorageService: SigaStorageService,
    private router: Router,
    private commonsService: CommonsService,) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.busquedaBaremosDeGuardia).then(respuesta => {

      this.permisoTipoEscritura = respuesta;

      if (this.permisoTipoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

    }).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_maestros.tiposActuaciones).then(respuesta => {
      this.permisoTiposActuaciones = respuesta;
    }).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_maestros.tiposAsistencias).then(respuesta => {
      this.permisoTiposAsistencia = respuesta;
    }).catch(error => console.error(error));


    if (sessionStorage.getItem('modoEdicionBaremo') != undefined) {
      this.modoEdicion = JSON.parse(sessionStorage.getItem('modoEdicionBaremo'));
    }

    /* if(this.persistenceService.getDatos() != null || this.persistenceService.getDatos() != undefined){
      this.datos = this.persistenceService.getDatos()
      this.persistenceService.clearDatos()
    //para pasar los datos de el turno y la guardia a la tabla de datos generales
    /* let data = [];
    data.push(this.datos)
    this.datosFichDatGenerales = data;
    this.persistenceService.clearDatos(); 
    //obtiene la configuracion de los baremos
    this.getBaremo(this.datos)
    
    this.tieneDatos = true;
    }else{ */
    if (this.modoEdicion) {
      if (sessionStorage.getItem('dataBaremoMod')) {
        this.datos = JSON.parse(sessionStorage.getItem('dataBaremoMod'))
        this.persistenceService.clearDatos()
        //para pasar los datos de el turno y la guardia a la tabla de datos generales
        /* let data = [];
        data.push(this.datos)
        this.datosFichDatGenerales = data; */
        this.persistenceService.setDatos(this.datos);

        sessionStorage.removeItem('dataBaremoMod')

        //obtiene la configuracion de los baremos
        this.progressSpinner = true
        this.getBaremo(this.datos)
        this.progressSpinner = false

      } else {
        this.datos = JSON.parse(sessionStorage.getItem('datos'));
        //obtiene la configuracion de los baremos
        this.progressSpinner = true
        this.getBaremo(this.datos)
        this.progressSpinner = false
      }
    } else {
      //this.getGuardiasByConf(true);

      this.datosFichDatGenerales = []
      this.tieneDatos = true
    }
    // }


  }

  isOpenReceive(event) {


    switch (event) {
      case 'facSJCSFichaBarDatosGen':
        this.tarjetaDatosGenerales.showTarjeta = true;
        break;
      case 'facSJCSFichaBarConfiFac':
        this.tarjetaConfigFac.showTarjeta = true;
        break;
      case 'facSJCSFichaBarConfiAdi':
        this.tarjetaConfigAdi.showTarjeta = true;
        break;

    }

  }

  ngAfterViewInit() {
    this.goTop();
  }

  goTop() {
    let top = document.getElementById("top");
    if (top) {
      top.scrollIntoView();
      top = null;
    }
  }

  volver() {
    sessionStorage.removeItem('modoEdicionBaremo')
    // Eliminar Datos Ficha Datos Baremos para insertar o actualizar.
    if (sessionStorage.getItem("datosFichDatGenerales")) {
      sessionStorage.removeItem("datosFichDatGenerales");
    }
    this.location.back();
  }

  addEnlace(enlace: Enlace) {
    this.tarjetaFija.enlaces.find(el => el.id == enlace.id).ref = enlace.ref;
  }

  getGuardiasByConf(event) {
    if (event == true) {

      this.progressSpinner = true;
      this.sigaServices.get("baremosGuardia_getGuardiasByConf").subscribe(
        data => {
          this.datosFichDatGenerales = data.baremosGuardiaItems;
          this.tieneDatos = true;
          let error = JSON.parse(JSON.stringify(data)).error;
          this.progressSpinner = false;

          if (error != undefined && error != null && error.description != null) {
            if (error.code == '200') {
              this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
          }
        },
        err => {
          this.progressSpinner = false;
          if (err != undefined && JSON.parse(JSON.stringify(err)).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
          this.tieneDatos = true;
        }
      )
    }
  }

  getTurnoGuarConf(hitos) {



    this.sigaServices.post("baremosGuardia_getTurnoGuarConf", hitos).subscribe(
      data => {
        this.datosFichDatGenerales = JSON.parse(data.body).baremosGuardiaItems;

        //let error = JSON.parse(JSON.stringify(data)).error;
        this.tieneDatos = true;
      },
      err => {
        console.error(err)
        this.progressSpinner = false;
      }
    )

  }

  guardarCerrar() {
    this.progressSpinner = true
    let confBaremo: BaremosGuardiaItem[] = [];
    let turno, guardia

    if (!this.modoEdicion) {

      if ((this.tarjetaDatosGenerales.filtros.idTurno != null || this.tarjetaDatosGenerales.filtros.idTurno != undefined)
        && (this.tarjetaDatosGenerales.filtros.idGuardia != null || this.tarjetaDatosGenerales.filtros.idGuardia != undefined)) {
        turno = this.tarjetaDatosGenerales.filtros.idTurno;
        guardia = this.tarjetaDatosGenerales.filtros.idGuardia;
        if ((this.tarjetaConfigFac.filtrosDis.aPartirDis != null || this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined) &&
          (this.tarjetaConfigFac.filtrosDis.aPartirMax != null || this.tarjetaConfigFac.filtrosDis.aPartirMax != undefined)) {
          if (this.tarjetaConfigFac.filtrosDis.aPartirDis < this.tarjetaConfigFac.filtrosDis.aPartirMax) {
            this.configuracionHito(confBaremo, turno, guardia);
            let listBaremos = [];
            listBaremos.push(confBaremo);
            this.sigaServices.post("baremosGuardia_saveBaremo", listBaremos).subscribe(
              data => {
                let error = JSON.parse(data.body).error;
                this.progressSpinner = false;

                if (error != undefined && error != null && error.description != null) {
                  if (error.code == '200') {
                    this.showMessage("success", this.translateService.instant("general.message.success"), this.translateService.instant(error.description));
                  } else {
                    this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
                  }
                }
              },
              err => {
                this.progressSpinner = false;
                if (err != undefined && JSON.parse(err.body).error.description != "") {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.body).error.description));
                } else {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
                }
              }
            )
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El numero de A partir de disponibilidad debe ser menor que a partir de maximo");
            this.progressSpinner = false
          }
        } else {
          this.configuracionHito(confBaremo, turno, guardia);
          let listBaremos = [];
          listBaremos.push(confBaremo);
          this.sigaServices.post("baremosGuardia_saveBaremo", listBaremos).subscribe(
            data => {
              let error = JSON.parse(data.body).error;
              this.progressSpinner = false;

              if (error != undefined && error != null && error.description != null) {
                if (error.code == '200') {
                  this.showMessage("success", this.translateService.instant("general.message.success"), this.translateService.instant(error.description));
                } else {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
                }
              }
            },
            err => {
              this.progressSpinner = false;
              if (err != undefined && JSON.parse(err.body).error.description != "") {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.body).error.description));
              } else {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              }
            }
          )
        }

      } else {
        this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        this.progressSpinner = false
      }
    } else if (this.modoEdicion) {
      let lista = [];
      let listBaremos = [];
      let idTurno, idGuardia;

      // Comprobar datos de Ficha Generales para modificar datos
      if (sessionStorage.getItem("datosFichDatGenerales")) {
        this.datosFichDatGenerales = JSON.parse(sessionStorage.getItem("datosFichDatGenerales"));
      } else {
        // Volcar datos de ficha Generales para modifcar datos.
        sessionStorage.setItem("datosFichDatGenerales", JSON.stringify(this.datosFichDatGenerales));
      }
      this.datosFichDatGenerales.forEach(tg => {
        lista.push(`${tg.idTurno}/${tg.idGuardia}`)
        idTurno = tg.idTurno
        idGuardia = tg.idGuardia
      })



      if ((this.tarjetaDatosGenerales.filtros.idTurno != null || this.tarjetaDatosGenerales.filtros.idTurno != undefined)
        && (this.tarjetaDatosGenerales.filtros.idGuardia != null || this.tarjetaDatosGenerales.filtros.idGuardia != undefined)) {

        lista.push(`${this.tarjetaDatosGenerales.filtros.idTurno}/${this.tarjetaDatosGenerales.filtros.idGuardia}`);
      }
      if ((this.tarjetaConfigFac.filtrosDis.aPartirDis != null || this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined) &&
        (this.tarjetaConfigFac.filtrosDis.aPartirMax != null || this.tarjetaConfigFac.filtrosDis.aPartirMax != undefined)) {
        if (this.tarjetaConfigFac.filtrosDis.aPartirDis < this.tarjetaConfigFac.filtrosDis.aPartirMax) {
          for (let ele of lista) {
            confBaremo = [];
            let [t, g] = ele.split('/')
            this.configuracionHito(confBaremo, t, g);
            listBaremos.push(confBaremo);

          }
          this.sigaServices.post("baremosGuardia_saveBaremo", listBaremos).subscribe(
            data => {
              let error = JSON.parse(data.body).error;
              this.progressSpinner = false;

              if (error != undefined && error != null && error.description != null) {
                if (error.code == '200') {
                  this.showMessage("success", this.translateService.instant("general.message.success"), this.translateService.instant(error.description));
                } else {
                  this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
                }
              }
              if ((idTurno && idTurno != null) && (idGuardia && idGuardia != null)) {

                this.getBaremo({ idTurno, idGuardia })
                this.tarjetaDatosGenerales.isNuevo = false;
              }
            },
            err => {
              this.progressSpinner = false;
              if (err != undefined && JSON.parse(err.body).error.description != "") {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.body).error.description));
              } else {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              }
            }
          )
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), "El numero de A partir de disponibilidad debe ser menor que a partir de maximo");
          this.progressSpinner = false
        }
      } else {
        for (let ele of lista) {
          confBaremo = [];
          let [t, g] = ele.split('/')
          this.configuracionHito(confBaremo, t, g);
          listBaremos.push(confBaremo);

        }
        this.sigaServices.post("baremosGuardia_saveBaremo", listBaremos).subscribe(
          data => {
            let error = JSON.parse(data.body).error;
            this.progressSpinner = false;

            if (error != undefined && error != null && error.description != null) {
              if (error.code == '200') {
                this.showMessage("success", this.translateService.instant("general.message.success"), this.translateService.instant(error.description));
              } else {
                this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
              }
            }
          },
          err => {
            this.progressSpinner = false;
            if (err != undefined && JSON.parse(err.body).error.description != "") {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.body).error.description));
            } else {
              this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
            }
          }
        )
      }

    }



  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

  getDiasYAgrupar(obj: BaremosGuardiaItem, panel: String) {
    let ficha = this.tarjetaConfigFac
    let diasDis = "";
    let diasAsAc = "";

    // Agrupar y Dias de Disponibilidad.
    if (panel == 'panelDis') {

      if (ficha.agruparDis == false) {
        obj.agrupar = 1
      } else if (ficha.agruparDis == true) {
        obj.agrupar = 0
      } else if (ficha.agruparDis == undefined) {
        obj.agrupar = null
      }

      if (ficha.checkDisL == true) {
        diasDis += 'L'
      }
      if (ficha.checkDisM == true) {
        diasDis += 'M'
      }
      if (ficha.checkDisX == true) {
        diasDis += 'X'
      }
      if (ficha.checkDisJ == true) {
        diasDis += 'J'
      }
      if (ficha.checkDisV == true) {
        diasDis += 'V'
      }
      if (ficha.checkDisS == true) {
        diasDis += 'S'
      }
      if (ficha.checkDisD == true) {
        diasDis += 'D'
      }
      obj.dias = diasDis.toString().trim();
    } else if (panel == 'panelAsAc') {
      // Agrupar y Dias de Asistencia/ Actuaciones.
      if (ficha.asiac == false) {
        obj.agrupar = 1
      } else if (ficha.asiac == true) {
        obj.agrupar = 0
      } else if (ficha.asiac == undefined) {
        obj.agrupar = null
      }

      if (ficha.checkAsAcL == true) {
        diasAsAc += 'L'
      }
      if (ficha.checkAsAcM == true) {
        diasAsAc += 'M'
      }
      if (ficha.checkAsAcX == true) {
        diasAsAc += 'X'
      }
      if (ficha.checkAsAcJ == true) {
        diasAsAc += 'J'
      }
      if (ficha.checkAsAcV == true) {
        diasAsAc += 'V'
      }
      if (ficha.checkAsAcS == true) {
        diasAsAc += 'S'
      }
      if (ficha.checkAsAcD == true) {
        diasAsAc += 'D'
      }
      obj.dias = diasAsAc.toString().trim();
    }
  }

  hito(obj, idHito, turno, guardia, precio, panelTarjeta) {
    let hito: BaremosGuardiaItem = new BaremosGuardiaItem()
    hito.idHito = idHito
    this.getDiasYAgrupar(hito, panelTarjeta)
    hito.idTurno = turno;
    hito.idGuardia = guardia;
    hito.precioHito = precio
    obj.push(hito);
  }

  getBaremo(obj) {
    this.progressSpinner = true;
    this.sigaServices.post("baremosGuardia_getBaremo", obj).subscribe(
      data => {
        this.datosFichaBaremos = JSON.parse(data.body).baremosGuardiaItems;

        this.rellenaConfiguracionBaremo(this.datosFichaBaremos);
        let error = JSON.parse(JSON.stringify(data.body)).error;
        this.progressSpinner = false;

        if (error != undefined && error != null && error.description != null) {
          if (error.code == '200') {
            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant(error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }
        }
      },
      err => {
        this.progressSpinner = false;
        if (err != undefined && JSON.parse(JSON.stringify(err)).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
      }
    )
  }

  rellenaConfiguracionBaremo(data: BaremosGuardiaItem[]) {
    let hitosDisponibilidad = [1, 2, 55, 53, 45, 44, 4, 56, 54, 46];
    let hitosAsAc = [20, 5, 3, 10, 22, 8, 19,23];
    let diasDis;
    let diasAsAc;
    let event: boolean = false;

    data.forEach(e => {
      if (hitosDisponibilidad.includes(parseInt(e.idHito))) {
        diasDis = e.dias
      } else if (hitosAsAc.includes(parseInt(e.idHito))) {
        diasAsAc = e.dias
      }

      // Agrupar De las Tarjetas Disponinibilidad y Asistencia Actuaciones.
      if (e.agrupar == 1 && hitosDisponibilidad.includes(parseInt(e.idHito))) {
        this.tarjetaConfigFac.agruparDis = false;
      } else if (e.agrupar == 0 && hitosDisponibilidad.includes(parseInt(e.idHito))) {
        this.tarjetaConfigFac.agruparDis = true;
      }
      if (e.agrupar == 1 && hitosAsAc.includes(parseInt(e.idHito))) {
        this.tarjetaConfigFac.agruparAsAc = false;
      } else if (e.agrupar == 0 && hitosAsAc.includes(parseInt(e.idHito))) {
        this.tarjetaConfigFac.agruparAsAc = true;
      }
    })
    this.hitos= [];
    for (let h of data) {
      let hito = parseInt(h.idHito);
      let precioHito = parseFloat(h.precioHito);

      switch (hito) {
        //para hito principal 1.
        case 1:
          // Disponibilidad con asuntos en Disponibilidad Contando Asistencia
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'asi'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('asi')

          this.tarjetaConfigFac.filtrosDis.dispAsuntosDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 2:
          // Maximo en Disponibilidad Contando Asistencia
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'asi'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('asi')
          this.tarjetaConfigFac.filtrosDis.importeMaxDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 55:
          // A partir de Disponibilidad con Asuntos Contando Asistencia
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'asi'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('asi')
          this.tarjetaConfigFac.filtrosDis.aPartirDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 53:
          // Minimo en Disponibilidad Contando Asistencia
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'asi'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('asi')
          this.tarjetaConfigFac.filtrosDis.importeMinDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 45:
          // A partir de  (2) en Disponibilidad Contando Asistencia
          this.tarjetaConfigFac.filtrosDis.aPartirMax = precioHito
          this.hitos.push(hito.toString())
          break;
        //para hito principal 44

        case 44:
          // Disponibilidad con asuntos en Disponibilidad Contando Actuaciones
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'act'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('act')
          this.tarjetaConfigFac.filtrosDis.dispAsuntosDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 4:
          // Maximo en Disponibilidad Contando Asistencia
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'act'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('act')
          this.tarjetaConfigFac.filtrosDis.importeMaxDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 56:
          // A partir de Disponibilidad con Asuntos Contando Actuaciones
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'act'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('act')
          this.tarjetaConfigFac.filtrosDis.aPartirDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 54:
          // Minimo en Disponibilidad Contando Actuaciones
          event = true
          this.tarjetaConfigFac.disponibilidad = true
          this.tarjetaConfigFac.onChangeDisponibilidad(event)
          this.tarjetaConfigFac.contDis = 'act'
          this.tarjetaConfigFac.changeContDis()
          this.tarjetaConfigFac.changeButtonContDis('act')
          this.tarjetaConfigFac.filtrosDis.importeMinDis = precioHito
          this.hitos.push(hito.toString())
          break;


        case 46:
          // A partir de  (2) en Disponibilidad Contando Actuaciones
          this.tarjetaConfigFac.filtrosDis.aPartirMax = precioHito
          this.hitos.push(hito.toString())

          break;
        //para hito principal 20 y 5

        case 20:
          event = true
          this.tarjetaConfigFac.asiac = true
          this.tarjetaConfigFac.onChangeAsAc(event);
          this.tarjetaConfigFac.contAsAc = 'asi'
          this.tarjetaConfigFac.changeContAsAc()
          this.tarjetaConfigFac.precio = 'porTipos'
          this.tarjetaConfigFac.changePrecio()
          this.tarjetaConfigFac.filtrosAsAc.importeAsAc = precioHito
          this.hitos.push(hito.toString())
          break;


        case 5:
          // Importe En Asistencias Contando Asistencia
          event = true
          this.tarjetaConfigFac.asiac = true
          this.tarjetaConfigFac.onChangeAsAc(event);
          this.tarjetaConfigFac.contAsAc = 'asi'
          this.tarjetaConfigFac.changeContAsAc()
          this.tarjetaConfigFac.precio = 'unico'
          this.tarjetaConfigFac.changePrecio()
          this.tarjetaConfigFac.filtrosAsAc.importeAsAc = precioHito
          this.hitos.push(hito.toString())
          break;
        case 3:
          // Maximo en Asistencia Contando Asistencia
          this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc = precioHito
          this.hitos.push(hito.toString())
          break;


        case 10:
          // Minimo en Asistencia Contando Asistencia
          this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc = precioHito
          this.hitos.push(hito.toString())
          break;


        //para hito principal 9
        case 9:
          this.tarjetaConfigAdi.filtrosAdi.importe = precioHito
          this.hitos.push(hito.toString())
          break;


        case 6:
          this.tarjetaConfigAdi.filtrosAdi.importeMax = precioHito
          this.hitos.push(hito.toString())
          break;

        // Hito 25
        case 25:
          // Check de Fuera de guardia Por Tipos
          this.tarjetaConfigAdi.onChangeFacActuaciones(true);
          this.tarjetaConfigAdi.precio = 'porTipos';
          this.tarjetaConfigAdi.changePrecio();
          this.hitos.push(hito.toString())
          break;

        // Hito 31
        case 31:
          // Check de Fuera de guardia Unico
          this.tarjetaConfigAdi.onChangeFacActuaciones(true);
          this.tarjetaConfigAdi.precio = 'unico';
          this.tarjetaConfigAdi.changePrecio();
          this.hitos.push(hito.toString())
          break;

        //para hito principal 7 y 22
        case 7:
          // Importe En Asistencias Contando Actuaciones
          event = true
          this.tarjetaConfigAdi.facActuaciones = true
          this.tarjetaConfigFac.onChangeAsAc(event)
          this.tarjetaConfigFac.contAsAc = 'act'
          this.tarjetaConfigFac.changeContAsAc()
          this.tarjetaConfigFac.precio = 'unico'
          this.tarjetaConfigFac.changePrecio()
          this.tarjetaConfigFac.filtrosAsAc.importeAsAc = precioHito
          this.hitos.push(hito.toString())
          break;


        case 22:
          event = true
          this.tarjetaConfigAdi.facActuaciones = true
          this.tarjetaConfigFac.onChangeAsAc(true)
          this.tarjetaConfigFac.contAsAc = 'act'
          this.tarjetaConfigFac.changeContAsAc()
          this.tarjetaConfigFac.precio = 'porTipos'
          this.tarjetaConfigFac.changePrecio()
          this.tarjetaConfigFac.filtrosAsAc.importeAsAc = precioHito
          this.hitos.push(hito.toString())
          break;


        case 8:
          // Maximo en Asistencia Contando Actuaciones
          this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc = precioHito
          this.hitos.push(hito.toString())
          break;

        case 19:
          // Minimo en Asistencia Contando Actuaciones
          this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc = precioHito
          this.hitos.push(hito.toString())
          break;

        //para hito 12 (SOJ)
        case 12:
          this.tarjetaConfigAdi.importeSOJ = precioHito
          this.hitos.push(hito.toString())
          break;


        //para hito 13 (EJG)
        case 13:
          this.tarjetaConfigAdi.importeEJG = precioHito
          this.hitos.push(hito.toString())

          break;
        //para hito 61
        case 61:
          this.tarjetaConfigAdi.procesoFac2014 = true
          this.hitos.push(hito.toString())
          break;
        //para hito 62
        case 62:
          // Check de Tarjeta Configuracion adicional Descontar.Asis
          this.tarjetaConfigAdi.descontarCheck = 'descontarGuardAsis'
          this.hitos.push(hito.toString())
          break;
        //para hito 64
        case 64:
          // Check de Tarjeta Configuracion adicional Descontar.Act
          this.tarjetaConfigAdi.descontarCheck = 'descontarGuardAct'
          this.hitos.push(hito.toString())
          break;
        //para hito 63
        case 63:
          this.tarjetaConfigAdi.facAsuntosAntiguos = true
          this.hitos.push(hito.toString())
          break;

        //para hito 24
        case 24:
          // Hito para Maximo Fuera de Guardia
          this.tarjetaConfigAdi.maxIrTiposFG = true
          this.hitos.push(hito.toString())
          break;

        // para hito 23
        case 23:
          // Precio por tipos en Asistencia Contando Actuaciones
          this.tarjetaConfigFac.maxIrTiposAsAc = true
          this.hitos.push(hito.toString())
          break;

        // para hito 22
        case 21:
          // Precio por tipos en Asistencia Contando Asistencia
          this.tarjetaConfigFac.maxIrTiposAsAc = true
          this.hitos.push(hito.toString())
          break;

      }
    }
    this.getTurnoGuarConf(this.hitos);
    this.rellenarDias(diasDis, diasAsAc);
  }

  configuracionHito(confBaremo, turno, guardia) {
    let institucion = this.localStorageService.institucionActual;
    let institucionesActuaciones = ['2002', '2020', '2058', '2067', '2078', '2082'];//instituciones para las que se aplican hito 62
    //tarjeta configuracion de facturacion.
    //por disponibilidad.

    this.checkDisponibilidad();

    if (this.tarjetaConfigFac.disponibilidad == true) {
      if (this.tarjetaConfigFac.contDis == 'asi') {
        //hito 1
        this.hito(confBaremo, '1', turno, guardia, this.tarjetaConfigFac.filtrosDis.dispAsuntosDis, 'panelDis')

        if ((this.tarjetaConfigFac.filtrosDis.importeMinDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMinDis != null)
          && (this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined || this.tarjetaConfigFac.filtrosDis.aPartirDis != null)) {
          //hito 53
          this.hito(confBaremo, '53', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMinDis, 'panelDis')

          //hito 45
          this.hito(confBaremo, '46', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirDis, 'panelDis')

        }

        if ((this.tarjetaConfigFac.filtrosDis.importeMaxDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMaxDis != null)
          && (this.tarjetaConfigFac.filtrosDis.aPartirMax != undefined || this.tarjetaConfigFac.filtrosDis.aPartirMax != null)) {

          //hito 2
          this.hito(confBaremo, '2', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMaxDis, 'panelDis')

          //hito 45
          this.hito(confBaremo, '45', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirMax, 'panelDis')

        }

        if (this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined || this.tarjetaConfigFac.filtrosDis.aPartirDis != null) {

          //hito 55
          this.hito(confBaremo, '55', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirDis, 'panelDis')



        }


      } else if (this.tarjetaConfigFac.contDis == 'act') {
        //hito 44
        this.hito(confBaremo, '44', turno, guardia, this.tarjetaConfigFac.filtrosDis.dispAsuntosDis, 'panelDis')
        if ((this.tarjetaConfigFac.filtrosDis.importeMinDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMinDis != null)
          && (this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined || this.tarjetaConfigFac.filtrosDis.aPartirDis != null)) {
          //hito 54
          this.hito(confBaremo, '54', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMinDis, 'panelDis')

          //hito 46
          this.hito(confBaremo, '46', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirMax, 'panelDis')

        }

        if ((this.tarjetaConfigFac.filtrosDis.importeMaxDis != undefined || this.tarjetaConfigFac.filtrosDis.importeMaxDis != null)
          && (this.tarjetaConfigFac.filtrosDis.aPartirMax != undefined || this.tarjetaConfigFac.filtrosDis.aPartirMax != null)) {

          //hito 4
          this.hito(confBaremo, '4', turno, guardia, this.tarjetaConfigFac.filtrosDis.importeMaxDis, 'panelDis')

          //hito 46
          this.hito(confBaremo, '45', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirMax, 'panelDis')

        }

        if (this.tarjetaConfigFac.filtrosDis.aPartirDis != undefined || this.tarjetaConfigFac.filtrosDis.aPartirDis != null) {

          //hito 56
          this.hito(confBaremo, '56', turno, guardia, this.tarjetaConfigFac.filtrosDis.aPartirDis, 'panelDis')



        }

      }

    }

    if (this.tarjetaConfigFac.asiac == true) {

      if (this.tarjetaConfigFac.contAsAc == 'asi') {

        //5,20
        if (this.tarjetaConfigFac.precio == 'unico') {
          //hito 5
          this.hito(confBaremo, '5', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeAsAc, 'panelAsAc')
          if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
            //hito 3
            this.hito(confBaremo, '3', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc, 'panelAsAc')
          }
          if (this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != undefined) {
            //hito 10
            this.hito(confBaremo, '10', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc, 'panelAsAc')
          }
        } else if (this.tarjetaConfigFac.precio == 'porTipos') {
          //hito 20 Controlar el CheckBok.
          this.hito(confBaremo, '20', turno, guardia, 0, 'panelAsAc')
          if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
            //hito 3
            this.hito(confBaremo, '3', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc, 'panelAsAc')
          }
          if (this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != undefined) {
            //hito 10
            this.hito(confBaremo, '10', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc, 'panelAsAc')
          }
          // hito 21
          if (this.tarjetaConfigFac.maxIrTiposAsAc == true) {
            // Hito para Maximo Asistencia Asistencia Por tipos
            this.hito(confBaremo, '21', turno, guardia, 0, 'panelAsAc')
          }
        }


      } else if (this.tarjetaConfigFac.contAsAc == 'act') {

        if (this.tarjetaConfigFac.precio == 'unico') {
          //hito 7
          this.hito(confBaremo, '7', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeAsAc, 'panelAsAc')
          if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
            //hito 8
            this.hito(confBaremo, '8', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc, 'panelAsAc')
          }
          if (this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != undefined) {
            //hito 19
            this.hito(confBaremo, '19', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc, 'panelAsAc')
          }
        } else if (this.tarjetaConfigFac.precio == 'porTipos') {
          //hito 22 Controlar el CheckBok.
          this.hito(confBaremo, '22', turno, guardia, 0, 'panelAsAc')
          if (this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc != undefined) {
            //hito 8
            this.hito(confBaremo, '8', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMaxAsAc, 'panelAsAc')
          }
          if (this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != null || this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc != undefined) {
            //hito 19
            this.hito(confBaremo, '19', turno, guardia, this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc, 'panelAsAc')
          }
          // hito 23
          if (this.tarjetaConfigFac.maxIrTiposAsAc == true) {
            // Hito para Maximo Asistencia Asistencia Por tipos
            this.hito(confBaremo, '23', turno, guardia, 0, 'panelAsAc');
          }
        }

      }

    }

    if (this.tarjetaConfigAdi.facActuaciones == true) {
      // Hito 31 Controlar el CheckBok.
      this.hito(confBaremo, '31', turno, guardia, 0, 'panelAdi')
      //hitos de la tarjeta de configuracion adicional
      if (this.tarjetaConfigAdi.precio == 'unico') {
        if (this.tarjetaConfigAdi.filtrosAdi.importe != null || this.tarjetaConfigAdi.filtrosAdi.importe != undefined) {
          //hito 9
          this.hito(confBaremo, '9', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importe, 'panelAdi')
        }
        if (this.tarjetaConfigAdi.filtrosAdi.importeMax != null || this.tarjetaConfigAdi.filtrosAdi.importeMax != undefined) {
          //hito 6
          this.hito(confBaremo, '6', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importeMax, 'panelAdi')
        }
      }

      if (this.tarjetaConfigAdi.precio == 'porTipos') {
        // Hito 25 Controlar el CheckBok.
        this.hito(confBaremo, '25', turno, guardia, 0, 'panelAdi')
        if (this.tarjetaConfigAdi.filtrosAdi.importe != null || this.tarjetaConfigAdi.filtrosAdi.importe != undefined) {
          //hito 9
          this.hito(confBaremo, '9', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importe, 'panelAdi')
        }
        if (this.tarjetaConfigAdi.filtrosAdi.importeMax != null || this.tarjetaConfigAdi.filtrosAdi.importeMax != undefined) {
          //hito 6
          this.hito(confBaremo, '6', turno, guardia, this.tarjetaConfigAdi.filtrosAdi.importeMax, 'panelAdi')
        }
        // Hito para Maximo Fuera de Guardia
        if (this.tarjetaConfigAdi.maxIrTiposFG) {
          //hito 24
          this.hito(confBaremo, '24', turno, guardia, 0, 'panelAdi')
        }
      }
    }

    //hito 63
    if (this.tarjetaConfigAdi.facAsuntosAntiguos) {
      this.hito(confBaremo, '63', turno, guardia, 0, 'panelAdi')
    }

    //hito 61
    if (this.tarjetaConfigFac.filtrosAsAc.importeMinAsAc && this.tarjetaConfigAdi.procesoFac2014 == true) {
      this.hito(confBaremo, '61', turno, guardia, 0, 'panelAdi')
    }

    // Hito 62
    if (this.tarjetaConfigAdi.descontarCheck == 'descontarGuardAsis') {
      this.hito(confBaremo, '62', turno, guardia, 0, 'panelAdi')
    }

    // Hito 64
    if (this.tarjetaConfigAdi.descontarCheck == 'descontarGuardAct') {
      this.hito(confBaremo, '64', turno, guardia, 0, 'panelAdi')
    }



    //hitos de configuracion SOJ y EJG
    if (this.tarjetaConfigAdi.importeSOJ != null || this.tarjetaConfigAdi.importeSOJ != undefined) {
      //hito 12
      this.hito(confBaremo, '12', turno, guardia, this.tarjetaConfigAdi.importeSOJ, 'panelAdi')
    }

    if (this.tarjetaConfigAdi.importeEJG != null || this.tarjetaConfigAdi.importeEJG != undefined) {
      //hito 13
      this.hito(confBaremo, '13', turno, guardia, this.tarjetaConfigAdi.importeEJG, 'panelAdi')
    }
  }

  checkDisponibilidad() {
    if (this.tarjetaConfigFac.contDis == 'asi') {
      this.tarjetaConfigFac.disponibilidad = true;
    }
  }

  rellenarDias(diasDis, diasAsAc) {
    let arrDis: any[] = diasDis
    let arrAsAc: any[] = diasAsAc

    if (diasDis != undefined) {
      arrDis = Array.from(diasDis);
      for (let dia of arrDis) {
        switch (dia.toString()) {
          case 'L':
            this.tarjetaConfigFac.checkDisL = true
            this.tarjetaConfigFac.checkAsAcL = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
          case 'M':
            this.tarjetaConfigFac.checkDisM = true
            this.tarjetaConfigFac.checkAsAcM = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
          case 'X':
            this.tarjetaConfigFac.checkDisX = true
            this.tarjetaConfigFac.checkAsAcX = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
          case 'J':
            this.tarjetaConfigFac.checkDisJ = true
            this.tarjetaConfigFac.checkAsAcJ = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
          case 'V':
            this.tarjetaConfigFac.checkDisV = true
            this.tarjetaConfigFac.checkAsAcV = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
          case 'S':
            this.tarjetaConfigFac.checkDisS = true
            this.tarjetaConfigFac.checkAsAcS = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
          case 'D':
            this.tarjetaConfigFac.checkDisD = true
            this.tarjetaConfigFac.checkAsAcD = true
            this.tarjetaConfigFac.onChangeDiasDis(true, dia)
            break;
        }
      }
    }
    if (diasAsAc != undefined) {
      arrAsAc = Array.from(diasAsAc)
      for (let dia of arrAsAc) {
        switch (dia.toString()) {
          case 'L':
            this.tarjetaConfigFac.checkAsAcL = true
            this.tarjetaConfigFac.checkDisL = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
          case 'M':
            this.tarjetaConfigFac.checkAsAcM = true
            this.tarjetaConfigFac.checkDisM = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
          case 'X':
            this.tarjetaConfigFac.checkAsAcX = true
            this.tarjetaConfigFac.checkDisX = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
          case 'J':
            this.tarjetaConfigFac.checkAsAcJ = true
            this.tarjetaConfigFac.checkDisJ = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
          case 'V':
            this.tarjetaConfigFac.checkAsAcV = true
            this.tarjetaConfigFac.checkDisV = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
          case 'S':
            this.tarjetaConfigFac.checkAsAcS = true
            this.tarjetaConfigFac.checkDisS = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
          case 'D':
            this.tarjetaConfigFac.checkAsAcD = true
            this.tarjetaConfigFac.checkDisD = false
            this.tarjetaConfigFac.onChangeDiasAsAc(true, dia)
            break;
        }
      }
    }else{
      this.tarjetaConfigFac.disableImputDis = true;
    }


  }

  disProc2014(event) {
    this.proceso2014 = event
  }

  restablecerDatosGenerales(event) {
    if (event) {

      if (this.modoEdicion) {

        let idTurno = this.datosFichDatGenerales[0].idTurno
        let idGuardia = this.datosFichDatGenerales[0].idGuardia
        this.getBaremo({ idTurno, idGuardia });

      } else {
        this.datosFichDatGenerales = [];
      }
    }
  }

}
