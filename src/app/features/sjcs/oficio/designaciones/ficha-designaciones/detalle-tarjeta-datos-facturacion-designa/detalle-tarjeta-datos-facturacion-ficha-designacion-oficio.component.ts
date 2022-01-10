import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { TranslateService } from '../../../../../../commons/translate';
import { DesignaItem } from '../../../../../../models/sjcs/DesignaItem';
import { CommonsService } from '../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { procesos_oficio } from '../../../../../../permisos/procesos_oficio';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-tarjeta-datos-facturacion-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-datos-facturacion-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaDatosFacturacionFichaDesignacionOficioComponent implements OnInit {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: [],
      value: ''
    };

  msgs: Message[] = [];
  permisoEscritura: boolean;
  progressSpinner: boolean = false;

  @Input() isAnulada: boolean;
  @Input() campos;
  @Output() changeDataDatosFacEvent = new EventEmitter<any>();

  constructor(private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private persistenceService: PersistenceService,
    private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaFacturacion)
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

        this.getComboPartidaPresupuestaria();

      }
      ).catch(error => console.error(error));
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
        //console.log(err);
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
    facturacionDesigna.ano = Number(anio[0].substring(1, 5));
    facturacionDesigna.numero = designaItem.numero;

    this.sigaServices.post("designaciones_getDatosFacturacion", facturacionDesigna).subscribe(
      n => {
        let resp = JSON.parse(n.body).combooItems;

        if (resp.length > 0 && resp[0] != null) {
          this.selector.value = resp[0].value;
        } else {
          this.selector.value = null;
        }
      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
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
    factAct.ano = Number(anio[0].substring(1, 5));
    factAct.numero = this.campos.numero;
    factAct.idPartidaPresupuestaria = this.selector.value;

    this.sigaServices.post("designaciones_updateDatosFacturacion", factAct).subscribe(
      n => {
        this.progressSpinner = false;
        const resp = JSON.parse(n.body);

        if (resp.error != null && resp.error.code == 200) {

          this.campos.idPartidaPresupuestaria = this.selector.value;
          if (this.selector.value != undefined && this.selector.value != null && this.selector.value != '') {
            this.campos.nombrePartida = this.selector.opciones.find(el => el.value == this.selector.value).label;
          } else {
            this.campos.nombrePartida = '';
          }

          this.changeDataDatosFacEvent.emit();

          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
        }

        if (resp.error != null && resp.error.descripcion != null) {
          this.showMsg('error', 'Error', resp.error.descripcion);
        }

      },
      err => {
        this.progressSpinner = false;
        //console.log(err);
      }, () => {
        this.progressSpinner = false;
      }
    );
  }

  restablecer() {
    this.selector.value = this.campos.idPartidaPresupuestaria;
    this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
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

}
