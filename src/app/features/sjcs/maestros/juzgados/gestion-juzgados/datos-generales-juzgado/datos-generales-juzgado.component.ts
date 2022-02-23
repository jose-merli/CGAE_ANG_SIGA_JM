import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { JuzgadoItem } from '../../../../../../models/sjcs/JuzgadoItem';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { PermisosAplicacionesDto } from '../../../../../../models/PermisosAplicacionesDto';

@Component({
  selector: 'app-datos-generales-juzgado',
  templateUrl: './datos-generales-juzgado.component.html',
  styleUrls: ['./datos-generales-juzgado.component.scss']
})
export class DatosGeneralesJuzgadoComponent implements OnInit {

  //Resultados de la busqueda
  @Input() datos: JuzgadoItem;
  datosInicial: JuzgadoItem;
  @Input() modoEdicion;
  @Output() modoEdicionSend = new EventEmitter<any>();

  openFicha: boolean = true;
  msgs = [];
  historico: boolean = false;


  //body: JuzgadoItem;
  //bodyInicial: JuzgadoItem;
  idJuzgado;

  permisoEscritura: boolean = true;

  visibleMovilValue: boolean = false;
  esDecanoValue: boolean = false;
  isCodigoEjisValue: boolean = false;

  progressSpinner: boolean = false;


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsService: CommonsService) { }

  ngOnInit() {

    if (this.persistenceService.getPermisos() != undefined) {
      this.permisoEscritura = this.persistenceService.getPermisos()

    }

    this.validateHistorical();

    if (this.modoEdicion) {
      this.datos = this.datos;
      this.datosInicial = JSON.parse(JSON.stringify(this.datos));


      this.getInfo();
    } else {
      this.datos = new JuzgadoItem();
      this.datosInicial = JSON.parse(JSON.stringify(this.datos));

    }
  }

  cambiaMovil() {
    if (this.visibleMovilValue)
      this.datos.visibleMovil = "1"
    else
      this.datos.visibleMovil = "0"
  }

  cambiaDecano() {
    if (this.esDecanoValue)
      this.datos.esDecano = "1"
    else
      this.datos.esDecano = "0"
  }

  cambiaCodigoEjis() {
    if (this.isCodigoEjisValue)
      this.datos.isCodigoEjis = "1"
    else
      this.datos.isCodigoEjis = "0"
  }

  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null || this.persistenceService.getDatos().institucionVal != undefined) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  getInfo() {
    if (this.datos != undefined && this.datos.fechaCodigoEjis != undefined) {
      this.datos.fechaCodigoEjis = new Date(this.datos.fechaCodigoEjis);
    }

    if (this.datos != undefined && this.datos.visibleMovil != undefined) {
      this.datos.visibleMovil == "1" ? this.visibleMovilValue = true : this.visibleMovilValue = false;
    }

    if (this.datos != undefined && this.datos.esDecano != undefined) {
      this.datos.esDecano == "1" ? this.esDecanoValue = true : this.esDecanoValue = false;
    }

    if (this.datos != undefined && this.datos.isCodigoEjis != undefined) {
      this.datos.isCodigoEjis == "1" ? this.isCodigoEjisValue = true : this.isCodigoEjisValue = false;
    }
  }

  setInfo() {
    if (this.datos != undefined && this.datos.visibleMovil != undefined) {
      this.visibleMovilValue == true ? this.datos.visibleMovil = "1" : this.datos.visibleMovil = "0";
    }
    if (this.datos != undefined && this.datos.esDecano != undefined) {
      this.esDecanoValue == true ? this.datos.esDecano = "1" : this.datos.esDecano = "0";
    }
    if (this.datos != undefined && this.datos.isCodigoEjis != undefined) {
      this.isCodigoEjisValue == true ? this.datos.isCodigoEjis = "1" : this.datos.isCodigoEjis = "0";
    }
  }



 

  checkPermisosSave() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      if (this.disabledSave()) {
        this.msgs = this.commonsService.checkPermisoAccion();
      } else {
        this.save();
      }
    }
  }

  save() {
    this.progressSpinner = true;
    let url = "";

    if (!this.modoEdicion) {
      url = "gestionJuzgados_createCourt";
      this.callSaveService(url);

    } else {
      url = "gestionJuzgados_updateCourt";
      this.getInfo();
      this.callSaveService(url);
    }

  }

  callSaveService(url) {
    if (this.datos.nombre != undefined && this.datos.nombre != "") {
      this.datos.nombre = this.datos.nombre.trim();
    }
    this.sigaServices.post(url, this.datos).subscribe(
      data => {

        if (!this.modoEdicion) {
          this.modoEdicion = true;
          this.idJuzgado = JSON.parse(data.body).id;
          let send = {
            modoEdicion: this.modoEdicion,
            idJuzgado: this.idJuzgado
          }
          this.datos.idJuzgado = this.idJuzgado
          this.persistenceService.setDatos(this.datos);
          this.modoEdicionSend.emit(send);
        }

        this.datosInicial = JSON.parse(JSON.stringify(this.datos));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (err.error != undefined && JSON.parse(err.error).error.description != "") {
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

  checkPermisosRest() {
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.historico);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.rest();
    }
  }

  rest() {
    this.datos = JSON.parse(JSON.stringify(this.datosInicial));
    this.visibleMovilValue = false;
    this.esDecanoValue = false;
    this.isCodigoEjisValue = false;
    if (this.modoEdicion) {
      this.getInfo();
    }
  }

 

  fillFechaCodigoEjis(event) {
    this.datos.fechaCodigoEjis = event;
  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
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
    if (!this.historico && (this.datos.nombre != null && this.datos.nombre != undefined && this.datos.nombre.trim() != "") &&
     this.permisoEscritura && (JSON.stringify(this.datos) != JSON.stringify(this.datosInicial))) {
      return false;
    } else {
      return true;
    }
  }

  changeNombre(dato) {
    this.datos.nombre = dato.nombre.trim();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    // this.datosInicial.find(item => item.idAcreditacion === dato.idAcreditacion);

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

}
