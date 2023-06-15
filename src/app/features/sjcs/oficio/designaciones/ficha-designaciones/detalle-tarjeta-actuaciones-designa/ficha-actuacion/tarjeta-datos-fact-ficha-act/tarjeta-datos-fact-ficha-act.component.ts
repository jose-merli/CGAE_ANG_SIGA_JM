import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { SigaServices } from '../../../../../../../../_services/siga.service';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { Actuacion } from '../../detalle-tarjeta-actuaciones-designa.component';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { Router } from '@angular/router';
import { SigaStorageService } from '../../../../../../../../siga-storage.service';

@Component({
  selector: 'app-tarjeta-datos-fact-ficha-act',
  templateUrl: './tarjeta-datos-fact-ficha-act.component.html',
  styleUrls: ['./tarjeta-datos-fact-ficha-act.component.scss']
})
export class TarjetaDatosFactFichaActComponent implements OnInit {

  selector =
    {
      nombre: "Partida Presepuestaria",
      opciones: [],
      value: ''
    };
  msgs: Message[] = [];
  isLetrado: boolean;
  usuarioLogado: any;
  progressSpinner: boolean = false;
  modoLectura: boolean;

  @Input() isAnulada: boolean;
  @Input() actuacionDesigna: Actuacion;
  // Este modo lectura se produce cuando:
  // - Es colegiado y la actuación está validada y el turno no permite la modificación o la actuación no pertenece al colegiado
  // - La actuación está facturada
  @Input() modoLectura2: boolean = false;

  @Output() buscarActEvent = new EventEmitter<string>();

  constructor(private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private router: Router,
    private localStorageService: SigaStorageService) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesFacturacion)
      .then(respuesta => {
        let permisoEscritura = respuesta;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

        if (!permisoEscritura) {
          this.modoLectura = true;
        }

        this.getComboPartidaPresupuestaria();
        this.isLetrado = this.localStorageService.isLetrado;

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
        this.selector.value = this.actuacionDesigna.actuacion.idPartidaPresupuestaria;
      }
    );
  }

  guardar() {

    this.progressSpinner = true;

    let actuacion = JSON.parse(JSON.stringify(this.actuacionDesigna.actuacion));

    if (this.selector.value == undefined || this.selector.value == '') {
      actuacion.idPartidaPresupuestaria = null;
    } else {
      actuacion.idPartidaPresupuestaria = this.selector.value;
    }

    this.sigaServices.post("actuaciones_designacion_actualizarPartidaPresupuestariaActDesigna", actuacion).subscribe(
      n => {
        this.progressSpinner = false;
        const resp = JSON.parse(n.body);

        if (resp.status == 'KO' && resp.error != null && resp.error.description != null) {
          this.showMsg('error', 'Error', this.translateService.instant(resp.error.descripcion));
        }

        if (resp.status == 'OK') {
          this.buscarActEvent.emit(this.actuacionDesigna.actuacion.numeroAsunto);
          this.showMsg('success', this.translateService.instant('general.message.correct'), this.translateService.instant('general.message.accion.realizada'));
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

    this.selector.value = this.actuacionDesigna.actuacion.idPartidaPresupuestaria;
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
