import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input, ViewChild } from '@angular/core';
import { ConfirmationService, OverlayPanel } from 'primeng/primeng';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { Enlace } from '../ficha-baremos-de-guardia.component';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate/translation.service';


@Component({
  selector: 'app-ficha-bar-confi-adi',
  templateUrl: './ficha-bar-confi-adi.component.html',
  styleUrls: ['./ficha-bar-confi-adi.component.scss']
})
export class FichaBarConfiAdiComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;

  precio;
  filtrosAdi: BaremosGuardiaItem = new BaremosGuardiaItem();
  contAsi;
  contAsAc;
  contUnicoFG;
  contPorTiposAsAc;
  facActuaciones: boolean = false;
  facAsuntosAntiguos: boolean = false;
  procesoFac2014: boolean = false;
  descontarCheck;
  disablediratipos: boolean = false;
  disableConfAdi: boolean = false;
  disabledFacActuaciones: boolean = false;
  disabledPrecioUnico: boolean = false;
  importeSOJ;
  importeEJG;
  displayBoolean: boolean = false;
  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() disProc2014;
  @Input() permisoEscritura: boolean = false;
  @Input() permisoActuaciones: boolean = false;
  showModal: boolean = false;
  origenBaremos = true;
  modalTipos = false;
  disPrecio: boolean = false;
  disableImput: boolean = false;
  disJuiciosRapidos: boolean = false;
  maxIrTiposFG: boolean = false;
  msgs: any[];

  @ViewChild("op")
  op: OverlayPanel;

  constructor(private localStorageService: SigaStorageService,
    private translateService: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {


  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaBarConfiAdi',
      ref: document.getElementById('facSJCSFichaBarConfiAdi')
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    // if (this.retencionesService.modoEdicion) {
    //this.showTarjeta = !this.showTarjeta;
    // } else {
    //   this.showTarjeta = true;
    // }

    this.showTarjeta ? this.showTarjeta = false : this.showTarjeta = true;
  }

  changeContAsAc() {
    if (this.disableConfAdi) {
      let institucion = this.localStorageService.institucionActual;
      let institucionesActuaciones = ['2002', '2020', '2058', '2067', '2078', '2082'];

      if (institucion == '2027' && this.contAsAc == 'act') {// se comprueba que se encuentre en la institucion de Gijon.
        this.disJuiciosRapidos = true
      } else if (institucionesActuaciones.includes(institucion) && this.contAsAc == 'asi') {
        this.disJuiciosRapidos = true
      } else {
        this.disJuiciosRapidos = false
      }
    }
    if (this.contAsAc != 'asi' && this.contAsAc != 'act') {
      this.disablediratipos = true;
    }

  }

  changePrecio() {

    if (this.precio == 'unico') {
      this.disabledPrecioUnico = true;
    } else {
      this.disabledPrecioUnico = false;
    }

    if (this.precio == 'porTipos') {
      this.modalTipos = true;
    } else {
      this.modalTipos = false;
    }

  }
  onChangeFacActuaciones(event) {
    this.facActuaciones = event
    this.disabledFacActuaciones = event
    if (!this.disabledFacActuaciones) {
      this.precio = null;
      this.modalTipos = false;
      this.filtrosAdi = new BaremosGuardiaItem();
    }
  }

  onChangeFacAsuntosAntiguos(event) {
    this.facAsuntosAntiguos = event
  }

  onChangeProcesoFac2014(event) {
    this.procesoFac2014 = event
  }



  irAtipos() {
    this.showModal = true;
  }
  cerrarDialog() {
    this.showModal = false;
  }

  hideOverlay(event) {
    this.displayBoolean = false;
  }

  showDialog() {
    this.displayBoolean = true;
    // this.display = true;
  }

  show(event) {
    let keyConfirmation = "irATiposEnlace";
    this.confirmationService.confirm({
      key: keyConfirmation,
      message: this.translateService.instant("baremos.message.tittle.tipoBaremos"), // Se va a acceder al maestro de tipos, pero ha realizado cambios en el baremo que se perderán. ¿Desea continuar sin guardar?
      icon: 'fas fa-external-link-alt',
      accept: () => {
        // Accedemos a la ruta especifícada en Ir a Tipos.
        if (!this.permisoActuaciones && this.contAsAc == 'act') {
          // Acceso Denegado para acceder a Actuación.
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // Redirigir a Actuación.
          this.router.navigate(["/tiposActuacion"]);
        }
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'info',
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
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

  onChangemaxIrTiposFG(event) {
    // Funcionalidad activar o desactivar.
    this.maxIrTiposFG = event;
  }


}
