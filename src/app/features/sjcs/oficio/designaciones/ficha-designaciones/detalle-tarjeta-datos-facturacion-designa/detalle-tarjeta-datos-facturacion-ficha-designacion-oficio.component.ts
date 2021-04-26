import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';

@Component({
  selector: 'app-detalle-tarjeta-datos-facturacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent implements OnInit, OnDestroy {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: [],
      value: ''
    };

  msgs: Message[] = [];
  @Input() isAnulada: boolean;
  @Input() campos;
  @Output() changeDataEvent = new EventEmitter<any>();
  progressSpinner: boolean = false;

  constructor(private sigaServices: SigaServices, private commonsService: CommonsService, private translateService: TranslateService) { }

  ngOnInit() {
    this.getComboPartidaPresupuestaria();
  }

  getComboPartidaPresupuestaria() {

    this.progressSpinner = true;

    this.sigaServices.get("designaciones_comboPartidaPresupuestaria").subscribe(
      n => {
        this.selector.opciones = n.combooItems;
        this.commonsService.arregloTildesCombo(this.selector.opciones);
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
        this.getIdPartidaPresupuestaria(this.campos);
      }
    );
  }

  getIdPartidaPresupuestaria(designaItem) {

    this.progressSpinner = true;

    let facturacionDesigna = new DesignaItem();
    facturacionDesigna.idTurno = designaItem.idTurno;
    let anio = this.campos.ano.split("/");
    facturacionDesigna.ano = Number(anio[0].substring(1,5));
    facturacionDesigna.numero = designaItem.numero;

    this.sigaServices.post("designaciones_getDatosFacturacion", facturacionDesigna).subscribe(
      n => {
        let resp = JSON.parse(n.body).combooItems;
        if (resp.length > 0) {
          this.selector.value = resp[0].value;
          // this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiDatFac', partida: resp.label });
          sessionStorage.setItem("datosIniActuDesignaDatosFact", JSON.stringify(resp[0]));
        }
      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  guardar() {

    this.progressSpinner = true;

    let factAct = new DesignaItem();
    factAct.idTurno = Number(this.campos.idTurno);
    let anio = this.campos.ano.split("/");
    factAct.ano = Number(anio[0].substring(1,5));
    factAct.numero = this.campos.numero;
    factAct.idPartidaPresupuestaria = Number(this.selector.value);

    this.sigaServices.post("designaciones_updateDatosFacturacion", factAct).subscribe(
      n => {
        this.progressSpinner = false;
        const resp = JSON.parse(n.body);

        if (resp.error != null && resp.error.code == 200) {
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
          // this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiDatFac', partida: this.selector.opciones.find(el => el.value == this.selector.value).label });
          sessionStorage.setItem("datosIniActuDesignaDatosFact", JSON.stringify({ label: this.selector.opciones.find(el => el.value == this.selector.value).label, value: this.selector.value }));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  restablecer() {

    if (sessionStorage.getItem("datosIniActuDesignaDatosFact")) {
      let valorIni = JSON.parse(sessionStorage.getItem("datosIniActuDesignaDatosFact"));
      this.selector.value = valorIni.value;
      // this.changeDataEvent.emit({ tarjeta: 'sjcsDesigActuaOfiDatFac', partida: valorIni.label });
      this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
    }
  }

  showMsg(severity, summary, detail) {
    this.msgs = [];
    this.msgs.push({
      severity,
      summary,
      detail
    });
  }

  clear() {
    this.msgs = [];
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem("datosIniActuDesignaDatosFact");
  }

}
