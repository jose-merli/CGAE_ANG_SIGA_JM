import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input, ViewChild } from '@angular/core';
import { ConfirmationService, OverlayPanel } from 'primeng/primeng';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { Enlace } from '../ficha-baremos-de-guardia.component';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ficha-bar-confi-fac',
  templateUrl: './ficha-bar-confi-fac.component.html',
  styleUrls: ['./ficha-bar-confi-fac.component.scss']
})
export class FichaBarConfiFacComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = true;
  filtrosDis: BaremosGuardiaItem = new BaremosGuardiaItem();
  filtrosAsAc: BaremosGuardiaItem = new BaremosGuardiaItem();
  disponibilidad: boolean = false;
  agruparDis: boolean = false;
  contDis;
  asiac: boolean = false;
  agruparAsAc: boolean = false;
  contAsAc;
  precio

  diasDis: String[] = [];
  //diasAsiAct:String[]=[];
  checkAsAcL: boolean = false;
  checkDisL: boolean = true;

  checkAsAcM: boolean = false;
  checkDisM: boolean = true;

  checkAsAcX: boolean = false;
  checkDisX: boolean = true;

  checkAsAcJ: boolean = false;
  checkDisJ: boolean = true;

  checkAsAcV: boolean = false;
  checkDisV: boolean = true;

  checkAsAcS: boolean = false;
  checkDisS: boolean = true;

  checkAsAcD: boolean = false;
  checkDisD: boolean = true;

  maxIrTiposAsAc: boolean = false;

  disableDis: boolean = true;
  disableAsAc: boolean = true;
  disableButtonsDis: boolean = true;
  disableButtonsAsc: boolean = true;
  disableImputDis: boolean = true;
  disableImputAct: boolean = true;
  displayBoolean: boolean = false;
  disableImpAsc: boolean = false;
  url;
  origenBaremos = true;
  modalTipos = false;
  disPrecio = false;
  msgs: any[];


  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() datos;
  @Output() disProc2014 = new EventEmitter<boolean>();
  @Input() permisoEscritura: boolean = false;
  @Input() permisoAsistencias;
  @Input() permisoActuaciones;
  showModal: boolean = false;

  @ViewChild("op")
  op: OverlayPanel;

  constructor(private translateService: TranslateService,
    private router: Router,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    if (!sessionStorage.getItem('modoEdicionBaremo')) {
      // Desabilitar todo en caso de que no haya días seleccionados.
      if (this.checkDisL || this.checkDisM || this.checkDisX || this.checkDisJ
        || this.checkDisV || this.checkDisS || this.checkDisD) {
          this.disableButtonsDis = false;
        }
        if (this.checkAsAcL || this.checkAsAcM || this.checkAsAcX || this.checkAsAcJ
          || this.checkAsAcV || this.checkAsAcS || this.checkAsAcD) {
            this.disableButtonsAsc = false;
        }
    } else {
      this.disableImputDis = false;
      this.disableButtonsAsc = false;
      this.disableImputAct = false;
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

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaBarConfiFac',
      ref: document.getElementById('facSJCSFichaBarConfiFac')
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

  onChangeDiasDis(event, dia) {
    switch (dia) {
      case 'L':
        this.checkDisL = event;
        this.checkAsAcL = !event
        break;
      case 'M':
        this.checkDisM = event;
        this.checkAsAcM = !event
        break;
      case 'X':
        this.checkDisX = event;
        this.checkAsAcX = !event
        break;
      case 'J':
        this.checkDisJ = event;
        this.checkAsAcJ = !event
        break;
      case 'V':
        this.checkDisV = event;
        this.checkAsAcV = !event
        break;
      case 'S':
        this.checkDisS = event;
        this.checkAsAcS = !event
        break;
      case 'D':
        this.checkDisD = event;
        this.checkAsAcD = !event
        break;

    }

    // Desabilitar todo en caso de que no haya días seleccionados.
    if (!this.checkDisL && !this.checkDisM && !this.checkDisX && !this.checkDisJ
      && !this.checkDisV && !this.checkDisS && !this.checkDisD) {
        this.disableButtonsDis = false;
      this.disableImputDis = false;
      this.contDis = null;
      this.agruparDis = false;
      this.filtrosDis = new BaremosGuardiaItem();
    } else {
      this.disableButtonsDis = true;
    }
    // Desabilitar todo en caso de que no haya días seleccionados.
    if (!this.checkAsAcL && !this.checkAsAcM && !this.checkAsAcX && !this.checkAsAcJ
      && !this.checkAsAcV && !this.checkAsAcS && !this.checkAsAcD) {
        this.disableButtonsAsc = false;
      this.disableImputAct = false;
      this.contAsAc = null;
      this.agruparAsAc = false;
      this.precio = null;
      this.maxIrTiposAsAc = false;
      this.modalTipos = false;
      this.filtrosAsAc = new BaremosGuardiaItem();
    } else {
      this.disableButtonsAsc = true;
    }

  }

  onChangeDiasAsAc(event, dia) {
    switch (dia) {
      case 'L':
        this.checkDisL = !event;
        this.checkAsAcL = event
        break;
      case 'M':
        this.checkDisM = !event;
        this.checkAsAcM = event
        break;
      case 'X':
        this.checkDisX = !event;
        this.checkAsAcX = event
        break;
      case 'J':
        this.checkDisJ = !event;
        this.checkAsAcJ = event
        break;
      case 'V':
        this.checkDisV = !event;
        this.checkAsAcV = event
        break;
      case 'S':
        this.checkDisS = !event;
        this.checkAsAcS = event
        break;
      case 'D':
        this.checkDisD = !event;
        this.checkAsAcD = event
        break;

    }

    // Desabilitar todo en caso de que no haya días seleccionados.
    if (!this.checkAsAcL && !this.checkAsAcM && !this.checkAsAcX && !this.checkAsAcJ
      && !this.checkAsAcV && !this.checkAsAcS && !this.checkAsAcD) {
      this.disableButtonsAsc = false;
      this.disableImputAct = false;
      this.contAsAc = null;
      this.agruparAsAc = false;
      this.precio = null;
      this.maxIrTiposAsAc = false;
      this.modalTipos = false;
      this.filtrosAsAc = new BaremosGuardiaItem();
    } else {
      this.disableButtonsAsc = true;
    }

    // Desabilitar todo en caso de que no haya días seleccionados.
    if (!this.checkDisL && !this.checkDisM && !this.checkDisX && !this.checkDisJ
      && !this.checkDisV && !this.checkDisS && !this.checkDisD) {
      this.disableButtonsDis = false;
      this.disableImputDis = false;
      this.contDis = null;
      this.agruparDis = false;
      this.filtrosDis = new BaremosGuardiaItem();
    } else {
      this.disableButtonsDis = true;
    }

  }

  changePrecio() {
    if (this.disableAsAc && this.contAsAc != null) {
      this.disableImputAct = true
      if (this.precio == 'porTipos') {
        this.modalTipos = true;
        this.disableImpAsc = true;
      } else {
        this.modalTipos = false;
        this.disableImpAsc = false;
      }
    }

  }

  changeContAsAc() {
    if (this.disableButtonsAsc) {
      this.disableImputAct = true;
      this.disPrecio = true;
    }

  }

  changeContDis() {
    if (this.disableButtonsDis) {
      this.contDis = null;
      this.disableImputDis = true;
    }

  }

  changeButtonContDis(event) {
    if (this.disableDis) {
      this.contDis = event;
      this.disableImputDis = true;
    }
  }

  changeButtonContAsc(event) {
    if (this.disableAsAc) {
      this.contAsAc = event;
      this.disableImputAct = true;
    }
  }

  onChangeDisponibilidad(event) {
    this.disableDis = event
    this.disponibilidad = event
    if (!this.disableDis) {
      this.disableButtonsDis = false;
      this.disableImputDis = false;
    } else {
      this.disableButtonsDis = true;
    }
  }


  onChangeAsAc(event) {
    this.disableAsAc = event;
    this.asiac = event
    if (!this.disableAsAc) {
      this.disableButtonsAsc = false;
      this.disableImputAct = false;
    } else {
      this.disableButtonsAsc = true;
    }
  }

  onChangeAgruparDis(event) {
    if (event) {
      this.agruparDis = true
    } else {
      this.agruparDis = false
    }
  }
  onChangeAgruparAsAc(event) {
    if (event) {
      this.agruparAsAc = false
    } else {
      this.agruparAsAc = true
    }

  }

  irAtipos(event) {
    let keyConfirmation = "irATiposEnlace";
    this.confirmationService.confirm({
      key: keyConfirmation,
      message: this.translateService.instant("baremos.message.tittle.tipoBaremos"), // Se va a acceder al maestro de tipos, pero ha realizado cambios en el baremo que se perderán. ¿Desea continuar sin guardar?
      icon: 'fas fa-external-link-alt',
      accept: () => {
        // Accedemos a la ruta especifícada en Ir a Tipos.
        if (!this.permisoAsistencias && this.contAsAc == 'asi') {
          // Acceso Denegado para acceder a Asistencia.
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else if (!this.permisoActuaciones && this.contAsAc == 'act') {
          // Acceso Denegado para acceder a Actuación.
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
        } else {
          // Redirigir a Asistencia
          if (this.contAsAc == 'asi') {
            this.router.navigate(["/tiposAsistencia"]);
            // Redirigir a Actuación.
          } else {
            this.router.navigate(["/tiposActuacion"]);
            this.showModal = true;
            this.op.toggle(event);
          }
        }
      },
      reject: () => {
        this.msgs = [
          {
            severity: 'info',
            summary: 'info', detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  cerrarDialog() {
    this.showModal = false;
  }

  onChangeMinimo(value) {
    if ((value != null || value != undefined) && this.contDis == 'asi' && this.disponibilidad == true) {
      this.disProc2014.emit(true)
    }
  }

  hideOverlay(event) {
    this.displayBoolean = false;
  }


  clear() {
    this.msgs = [];
  }

  onChangeMaxIrTiposAsAc(event) {
    // Funcionalidad activar o desactivar.
    this.maxIrTiposAsAc = event;
  }

}
