import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import { ModulosItem } from '../../../../../../models/sjcs/ModulosItem';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SpinnerModule } from 'primeng/spinner';

@Component({
  selector: 'app-edicion-modulos',
  templateUrl: './edicion-modulos.component.html',
  styleUrls: ['./edicion-modulos.component.scss']
})
export class EdicionModulosComponent implements OnInit {

  body: ModulosItem = new ModulosItem();
  bodyInicial;
  progressSpinner: boolean = false;
  modoEdicion: boolean = false;
  msgs;
  jurisdicciones;
  showTarjeta: boolean = true;
  esComa: boolean = false;
  @Output() modoEdicionSend = new EventEmitter<any>();

  @ViewChild("importe") importe;
  //Resultados de la busqueda
  @Input() modulosItem: ModulosItem;

  constructor(private sigaServices: SigaServices,
    private translateService: TranslateService,
    private persistenceService: PersistenceService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.modulosItem != undefined) {
      this.modulosItem.importe = this.modulosItem.importe.replace(".", ",");
      if (this.modulosItem.fechadesdevigor != undefined) {
        this.modulosItem.fechadesdevigor = this.transformaFecha(new Date(this.modulosItem.fechadesdevigor));
      } else {
        this.modulosItem.fechadesdevigor = undefined;
      }
      if (this.modulosItem.fechahastavigor != undefined) {
        this.modulosItem.fechahastavigor = this.transformaFecha(new Date(this.modulosItem.fechahastavigor));
      } else {
        this.modulosItem.fechahastavigor = undefined;
      }
      this.body = this.modulosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
    } else {
      this.modulosItem = new ModulosItem();
      this.modulosItem.fechadesdevigor = undefined;
      this.modulosItem.fechahastavigor = undefined;
    }
    if (this.body.idProcedimiento == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.arreglaChecks();

  }
  ngOnInit() {
    if (this.modulosItem != undefined) {
      this.body = this.modulosItem;
      this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));

    } else {
      this.modulosItem = new ModulosItem();
    }
    if (this.body.idProcedimiento == undefined) {
      this.modoEdicion = false;
    } else {
      this.modoEdicion = true;
    }
    this.sigaServices.get("fichaAreas_getJurisdicciones").subscribe(
      n => {
        this.jurisdicciones = n.combooItems;

        /*creamos un labelSinTilde que guarde los labels sin caracteres especiales, 
    para poder filtrar el dato con o sin estos caracteres*/
        this.jurisdicciones.map(e => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });

      },
      err => {
        console.log(err);
      }
    );
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

  arreglaChecks() {
    // idjurisdiccion complemento permitiraniadirletrado
    if (this.modulosItem.complemento == '1') {
      this.modulosItem.complementoCheck = true;
    } else {
      this.modulosItem.complementoCheck = false;
    }
    if (this.modulosItem.permitiraniadirletrado == '1') {
      this.modulosItem.permitiraniadirletradoCheck = true;
    } else {
      this.modulosItem.permitiraniadirletradoCheck = false;
    }
    this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));

  }

  guardarChecks() {
    if (this.modulosItem.complementoCheck == true) {
      this.modulosItem.complemento = '1';
    } else {
      this.modulosItem.complemento = '0';
    }
    if (this.modulosItem.permitiraniadirletradoCheck == true) {
      this.modulosItem.permitiraniadirletrado = '1';
    } else {
      this.modulosItem.permitiraniadirletrado = '0';
    }
  }

  rest() {
    if (this.modoEdicion) {
      if (this.bodyInicial != undefined) this.modulosItem = JSON.parse(JSON.stringify(this.bodyInicial));
      this.modulosItem.importe = this.modulosItem.importe.replace(".", ",");
      this.modulosItem.fechadesdevigor = this.transformaFecha(this.modulosItem.fechadesdevigor);
      this.modulosItem.fechahastavigor = this.transformaFecha(this.modulosItem.fechahastavigor);
      this.arreglaChecks();
    } else {
      this.modulosItem = new ModulosItem();
    }
  }

  save() {
    this.guardarChecks();
    this.progressSpinner = true;
    let url = "";
    if (!this.modoEdicion) {
      url = "modulosybasesdecompensacion_createmoduloybasedecompensacion";
      this.callSaveService(url);
    } else {
      url = "modulosybasesdecompensacion_updatemoduloybasedecompensacion";
      this.callSaveService(url);
    }
  }

  changeImporte() {
    this.esComa = this.modulosItem.importe.includes(",");
    if (this.esComa) {
      let partes = this.modulosItem.importe.split(",");
      if (partes[1].length > 2) {
        let segundaParte = partes[1].substring(0, 2);
        this.modulosItem.importe = partes[0] + "," + segundaParte;
        this.importe.nativeElement.value = this.modulosItem.importe;
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57 || (charCode == 44)) {
      return true;
    }
    else {
      return false;

    }
  }

  callSaveService(url) {
    this.modulosItem.importe = this.modulosItem.importe.replace(",", ".");
    this.sigaServices.post(url, this.modulosItem).subscribe(
      data => {
        this.esComa = false;
        if (!this.modoEdicion) {
          this.modoEdicion = true;
          let modulos = JSON.parse(data.body);
          // this.modulosItem = JSON.parse(data.body);
          this.modulosItem.idProcedimiento = modulos.id;
          let send = {
            modoEdicion: this.modoEdicion,
            idProcedimiento: this.modulosItem.idProcedimiento
          }
          this.modoEdicionSend.emit(send);
        }

        this.bodyInicial = JSON.parse(JSON.stringify(this.modulosItem));
        this.persistenceService.setDatos(this.modulosItem);
        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
      },
      err => {

        if (JSON.parse(err.error).error.description != "") {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
        } else {
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        }
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
        this.modulosItem.importe = this.modulosItem.importe.replace(".", ",");
      }
    );

  }

  clear() {
    this.msgs = [];
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  fillFechaDesdeCalendar(event) {
    this.modulosItem.fechadesdevigor = event;
  }

  fillFechaHastaCalendar(event) {
    this.modulosItem.fechahastavigor = event;
  }

  disabledSave() {
    if (this.modulosItem.nombre != undefined || this.modulosItem.importe != undefined || this.modulosItem.codigo != undefined
      || this.modulosItem.codigoext != undefined) this.modulosItem.nombre = this.modulosItem.nombre.trim();
    this.modulosItem.importe = this.modulosItem.importe.trim();
    this.modulosItem.codigo = this.modulosItem.codigo.trim();
    this.modulosItem.codigoext = this.modulosItem.codigoext.trim();

    if ((this.modulosItem.nombre != undefined && this.modulosItem.importe != undefined && this.modulosItem.nombre != "" &&
      this.modulosItem.importe != "" && this.modulosItem.fechadesdevigor != undefined && this.modulosItem.idjurisdiccion != "" &&
      this.modulosItem.idjurisdiccion != undefined) && (JSON.stringify(this.modulosItem) != JSON.stringify(this.bodyInicial))) {
      return false;
    } else {
      return true;
    }
  }

  onHideTarjeta() {
    this.showTarjeta = !this.showTarjeta;
  }
}
