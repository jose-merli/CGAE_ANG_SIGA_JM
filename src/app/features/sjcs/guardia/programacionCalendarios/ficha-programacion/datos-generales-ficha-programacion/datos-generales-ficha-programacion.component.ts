import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GuardiaItem } from '../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate';
import { DatePipe } from '@angular/common';
import { ConfiguracionCola, GlobalGuardiasService } from '../../../guardiasGlobal.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-datos-generales-ficha-programacion',
  templateUrl: './datos-generales-ficha-programacion.component.html',
  styleUrls: ['./datos-generales-ficha-programacion.component.scss']
})
export class DatosGeneralesFichaProgramacionComponent implements OnInit {

  body: GuardiaItem = new GuardiaItem();
  bodyInicial: GuardiaItem = new GuardiaItem();

  @Input() modoEdicion: boolean = false;
  @Input() permisoEscritura: boolean;
  @Output() modoEdicionSend = new EventEmitter<any>();
  @Output() dataToDuplicate = new EventEmitter<any>();
  @Output() reloadDatos = new EventEmitter<{}>();
  @Input() tarjetaDatosGenerales;
  @Input() datosGeneralesIniciales = {
    'duplicar': '',
    'tabla': [],
    'turno': '',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': {},
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'idInstitucion': '',
    'soloGenerarVacio': ''
  };
  @Input() datosGenerales = {
    'duplicar': '',
    'tabla': [],
    'turno': '',
    'nombre': '',
    'generado': '',
    'numGuardias': '',
    'listaGuarias': { value: undefined },
    'fechaDesde': '',
    'fechaHasta': '',
    'fechaProgramacion': null,
    'estado': '',
    'observaciones': '',
    'idCalendarioProgramado': '',
    'idTurno': '',
    'idGuardia': '',
    'idInstitucion': '',
    'soloGenerarVacio': '',
  };
  controlSoloGenerarVacio: boolean = false;
  @Output() guardarDatosCalendario = new EventEmitter<{}>();
  tipoGuardiaResumen = {
    label: "",
    value: "",
  };
  @Input() openFicha: boolean = true;
  historico: boolean = false;
  isDisabledGuardia: boolean = true;
  datos = [];
  cols;
  comboTipoGuardia = [];
  comboGuardia = [];
  comboTurno = [];
  progressSpinner;
  msgs;
  resaltadoDatos: boolean = false;
  comboListaGuardias = [];
  comboConjuntoGuardias = [];
  constructor(private persistenceService: PersistenceService,
    private sigaService: SigaServices,
    private commonServices: CommonsService,
    private translateService: TranslateService,
    private datepipe: DatePipe,
    private globalGuardiasService: GlobalGuardiasService) {
  }


  ngOnInit() {
    this.openFicha = true;
    if (this.datosGenerales != undefined) {
      if (this.datosGenerales.fechaProgramacion != null) {
        this.datosGenerales.fechaProgramacion = new Date(this.datosGenerales.fechaProgramacion.toString());
      }
      if (this.datosGenerales.observaciones == null) {
        this.datosGenerales.observaciones = "";
      }

      if(this.datosGenerales.soloGenerarVacio == 'S'){
        this.controlSoloGenerarVacio = true
      }

      //this.getComboListaGuardia();
      this.getComboConjuntouardia();
      if (this.datosGenerales.fechaDesde != undefined && this.datosGenerales.fechaDesde != null && this.datosGenerales.fechaHasta != undefined && this.datosGenerales.fechaHasta) {
        this.resaltadoDatos = false;
      } else {
        this.resaltadoDatos = true;
      }

      this.getCols();
      this.historico = this.persistenceService.getHistorico()
      this.getComboTipoGuardia();

      this.getComboTurno();

      // this.progressSpinner = true;
      this.sigaService.datosRedy$.subscribe(
        data => {
          data = JSON.parse(data.body);
          this.body.idGuardia = data.idGuardia;
          this.body.descripcionFacturacion = data.descripcionFacturacion;
          this.body.descripcion = data.descripcion;
          this.body.descripcionPago = data.descripcionPago;
          this.body.idTipoGuardia = data.idTipoGuardia;
          this.body.idTurno = data.idTurno;
          this.body.nombre = data.nombre;
          this.body.envioCentralita = data.envioCentralita;
          //Informamos de la guardia de la que hereda si existe.
          if (data.idGuardiaPrincipal && data.idTurnoPrincipal)
            this.datos.push({
              vinculacion: 'Principal',
              turno: data.idTurnoPrincipal,
              guardia: data.idGuardiaPrincipal
            })
          if (data.idGuardiaVinculada && data.idTurnoVinculada) {
            let guardias = data.idGuardiaVinculada.split(",");
            let turno = data.idTurnoVinculada.split(",");
            this.datos = guardias.map(function (x, i) {
              return { vinculacion: "Vinculada", guardia: x, turno: turno[i] }
            });
            this.datos.pop()
          }
          this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.progressSpinner = false;
        });
    }


  }

  fillFechaCalendarioDesde(event) {

    if (this.formatDate2(event) != null) {
      this.resaltadoDatos = false;
      this.datosGenerales.fechaDesde = this.changeDateFormat(this.formatDate2(event).toString());
    }
  }
  fillFechaCalendarioHasta(event) {
    if (this.formatDate2(event) != null) {
      this.resaltadoDatos = false;
      this.datosGenerales.fechaHasta = this.changeDateFormat(this.formatDate2(event).toString());
    }
  }
  fillFechaProgramada(event) {

    if (event == null) {
      this.datosGenerales.fechaProgramacion = null;
    } else {
      this.datosGenerales.fechaProgramacion = new Date(event.toString());
    }
  }

  formatDate2(date) {
    const pattern = 'yyyy-MM-dd';
    return this.datepipe.transform(date, pattern);
  }
  changeDateFormat(date1) {
    let year = date1.substring(0, 4)
    let month = date1.substring(5, 7)
    let day = date1.substring(8, 10)
    let date2 = day + '/' + month + '/' + year;
    return date2;
  }
  getComboListaGuardia() {
    let idTurno;
    this.sigaService.getParam(
      "busquedaGuardia_listasGuardia", "?idTurno=" + idTurno).subscribe(
        data => {
          this.comboListaGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboListaGuardias);
        },
        err => {
          //console.log(err);
        }
      )

  }

  getComboConjuntouardia() {
    this.progressSpinner = true;
    this.sigaService.get(
      "busquedaGuardia_conjuntoGuardia").subscribe(
        data => {
          this.comboConjuntoGuardias = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboConjuntoGuardias);
          this.progressSpinner = false;
        },
        err => {
          this.progressSpinner = false;
          //console.log(err);
        }
      )

  }
  styleObligatorio(evento) {
    if (this.resaltadoDatos && (evento == undefined || evento == null || evento == "")) {
      return this.commonServices.styleObligatorio(evento);
    }
  }

  muestraCamposObligatorios() {
    this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    this.resaltadoDatos = true;
  }


  disabledSave() {
    if (this.permisoEscritura) {
      if (this.datosGenerales.fechaHasta && this.datosGenerales.fechaDesde) {
        return false;
      } else return true;
    }
    else
      return true;
  }

  getCols() {
    if (!this.modoEdicion)
      this.cols = [
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
    else
      this.cols = [
        { field: "vinculacion", header: "justiciaGratuita.guardia.gestion.vinculacion" },
        { field: "turno", header: "dato.jgr.guardia.guardias.turno" },
        { field: "guardia", header: "menu.justiciaGratuita.GuardiaMenu" },
      ];
  }


  getComboTipoGuardia() {
    this.sigaService.get("busquedaGuardia_tiposGuardia").subscribe(
      n => {
        this.comboTipoGuardia = n.combooItems;

        this.commonServices.arregloTildesCombo(this.comboTipoGuardia);
        this.resumenTipoGuardiaResumen();

      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboTurno() {
    this.sigaService.get("busquedaGuardia_turno").subscribe(
      n => {
        this.comboTurno = n.combooItems;
        this.commonServices.arregloTildesCombo(this.comboTurno);
      },
      err => {
        //console.log(err);
      }
    );
  }

  onChangeTurno() {
    this.body.idGuardia = "";
    this.comboGuardia = [];

    if (this.body.idTurnoPrincipal) {
      this.getComboGuardia();
    } else {
      this.isDisabledGuardia = true;
    }
  }

  getComboGuardia() {
    this.sigaService.getParam(
      "busquedaGuardia_guardia", "?idTurno=" + this.body.idTurnoPrincipal).subscribe(
        data => {
          this.isDisabledGuardia = false;
          this.comboGuardia = data.combooItems;
          this.commonServices.arregloTildesCombo(this.comboGuardia);
        },
        err => {
          //console.log(err);
        }
      )

  }

  rest() {
    //this.datosGenerales = Object.assign(datosInicialesCopy, {});
    this.reloadDatos.emit(deepCopy(this.datosGeneralesIniciales));
  }

  // Descargar LOG
  descargarLog(){
    let resHead ={ 'response' : null, 'header': null };


      this.progressSpinner = true;
      let descarga =  this.sigaService.getDownloadFiles("guardiaCalendario_descargarLogCalendarioProgramado", this.datosGenerales);
      descarga.subscribe(response => {
        this.progressSpinner = false;

        const file = new Blob([response.body], {type: response.headers.get("Content-Type")});
        let filename: string = response.headers.get("Content-Disposition");
        filename = filename.split(';')[1].split('filename')[1].split('=')[1].trim();

        saveAs(file, filename);
        this.showMessage('success', 'LOG descargado correctamente',  'LOG descargado correctamente' );
      },
      err => {
        this.progressSpinner = false;
        this.showMessage('error','El LOG no pudo descargarse',  'El LOG no pudo descargarse' );
      });
    
  }


  callSaveService(url) {
    if (this.body.descripcion != undefined) this.body.descripcion = this.body.descripcion.trim();
    if (this.body.nombre != undefined) this.body.nombre = this.body.nombre.trim();
    if (this.body.envioCentralita == undefined) this.body.envioCentralita = false;
    this.sigaService.post(url, this.body).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.getCols();
          this.body.idGuardia = JSON.parse(data.body).id;
          this.persistenceService.setDatos({
            idGuardia: this.body.idGuardia,
            idTurno: this.body.idTurno
          })
          this.modoEdicionSend.emit(true);
          this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("justiciaGratuita.guardia.gestion.guardiaCreadaDatosPred"));
        } else this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));

        this.resumenTipoGuardiaResumen();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));

        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
          //console.log('err.error - ', err.error)
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
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

  async save() {
    let compareDateOk = compareDate(this.datosGenerales.fechaDesde, this.datosGenerales.fechaHasta, true);
    let compareDateFuture1 = compareDate(this.datosGenerales.fechaDesde, this.changeDateFormat(this.formatDate2(new Date()).toString()), true);
    let compareDateFuture2 = compareDate(this.datosGenerales.fechaHasta, this.changeDateFormat(this.formatDate2(new Date()).toString()), true);

    if (compareDateOk == 1) {
      this.showMessage("error", this.translateService.instant("general.message.incorrect"), "Rango de fechas incorrecto. Debe cumplir que la fecha desde sea menor o igual que la fecha hasta");
      //}else if (compareDateFuture1 != -1 || compareDateFuture2 != -1){
      //this.showMessage("error", this.translateService.instant("general.message.incorrect"), "No existen guardias asociadas a una programación con fechas futuras");
    } else {

      this.progressSpinner = true;
      if (this.datosGenerales.duplicar) {
        this.dataToDuplicate.emit(this.datosGenerales);

        //TO DO
      } else {
        if (!this.disabledSave()) {
          if (this.permisoEscritura && !this.historico) {
            //Guardar sólo actualizará el estado si no tiene estado (creación) o es Pendiente/Programada
            if (this.datosGenerales.estado == "" || this.datosGenerales.estado == "Pendiente" || this.datosGenerales.estado == "Programada") {
              if (this.datosGenerales.fechaProgramacion == undefined || this.datosGenerales.fechaProgramacion == null) {
                //Al guardar con Fecha de programación vacía, se pasará al estado Pendiente y fechaProgramacion = hoy
                //this.datosGenerales.fechaProgramacion = new Date();
                this.datosGenerales.estado = "Pendiente";
              } else {
                //Al guardar con Fecha de programación rellena, se pasará al estado Programada. 
                this.datosGenerales.estado = "Programada";
              }

              // Actualizamos la tarjeta Guardias Calendario en caso de que este vacía
              if (this.datosGenerales.listaGuarias.value == undefined) {
                this.changeListaGuardia(this.datosGenerales.listaGuarias);
              }

              //Control Check Solo Generar Vacios
              this.datosGenerales.soloGenerarVacio = this.controlSoloGenerarVacio ? 'S' : 'N';

              //GUARDAMOS
              this.guardarDatosCalendario.emit(this.datosGenerales)
              this.progressSpinner = false;
            } else {
              this.showMessage('error', 'Error. Debido al estado de la programación, no es posible guardar', '')
              this.progressSpinner = false;
            }

            let url = "";

            /*if (!this.modoEdicion && this.permisoEscritura) {
              url = "busquedaGuardias_createGuardia";
              this.callSaveService(url);
    
            } else if (this.permisoEscritura) {
              url = "busquedaGuardias_updateGuardia";
              this.callSaveService(url);
            }*/
          }
        } else {
          this.muestraCamposObligatorios();
        }
      }
      this.progressSpinner = false;
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

  resumenTipoGuardiaResumen() {
    this.tipoGuardiaResumen = this.comboTipoGuardia.filter(it => it.value == this.body.idTipoGuardia)[0]
  }

  clear() {
    this.msgs = [];
  }

  formatDate(date) {
    const pattern = 'yyyy-MM-dd HH:mm:ss-SS';
    return this.datepipe.transform(date, pattern);
  }

  changeListaGuardia(event) {
    let idConjuntoGuardiaElegido = event.value;
    let configuracionCola: ConfiguracionCola = {
      'manual': false,
      'porGrupos': false,
      'idConjuntoGuardia': idConjuntoGuardiaElegido,
      "fromCombo": true,
      "minimoLetradosCola": 0
    };
    if (!this.modoEdicion) {
      this.globalGuardiasService.emitConf(configuracionCola);
    }
  }

}
function compareDate(fechaA: any, fechaB: any, isAsc: boolean) {

  let dateA = null;
  let dateB = null;
  if (fechaA != null) {
    const dayA = fechaA.substr(0, 2);
    const monthA = fechaA.substr(3, 2);
    const yearA = fechaA.substr(6, 10);
    dateA = new Date(yearA, monthA, dayA);
  }

  if (fechaB != null) {
    const dayB = fechaB.substr(0, 2);
    const monthB = fechaB.substr(3, 2);
    const yearB = fechaB.substr(6, 10);
    dateB = new Date(yearB, monthB, dayB);
  }


  return compare(dateA, dateB, isAsc);

}

function compare(a: Date, b: Date, isAsc: boolean) {


  if (a == null && b != null) {
    return (1) * (isAsc ? 1 : -1);
  }
  if (a != null && b == null) {
    return (-1) * (isAsc ? 1 : -1);
  }
  if (a.getTime() === b.getTime()) {
    return 0
  } else {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}

function deepCopy(obj) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = deepCopy(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}