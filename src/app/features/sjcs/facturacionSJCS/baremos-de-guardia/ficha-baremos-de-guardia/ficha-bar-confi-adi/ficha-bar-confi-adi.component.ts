import { Component, EventEmitter, OnInit, Output, AfterViewInit, Input } from '@angular/core';
import { BaremosGuardiaItem } from '../../../../../../models/sjcs/BaremosGuardiaItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { Enlace } from '../ficha-baremos-de-guardia.component';

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
  facActuaciones: boolean = false;
  facAsuntosAntiguos: boolean = false;
  procesoFac2014: boolean = false;
  descontar: boolean = false;

  disableConfAdi: boolean = false;
  importeSOJ;
  importeEJG;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Input() disProc2014;
  @Input() permisoEscritura: boolean = false;
  showModal: boolean = false;
  origenBaremos = true;
  modalTipos = false;
  disPrecio: boolean = false;
  disableImput: boolean = false;
  disJuiciosRapidos: boolean = false;

  constructor(private localStorageService: SigaStorageService) { }

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
    this.showTarjeta = !this.showTarjeta;
    // } else {
    //   this.showTarjeta = true;
    // }
  }

  changeContAsAc() {
    if (this.disableConfAdi) {
      let institucion = this.localStorageService.institucionActual;
      let institucionesActuaciones = ['2002','2020','2058','2067','2078','2082'];
      this.contAsAc

      if(institucion == '2027' && this.contAsAc == 'act'){// se comprueba que se encuentre en la institucion de Gijon.
          this.disJuiciosRapidos = true
        }else if(institucionesActuaciones.includes(institucion) && this.contAsAc == 'asi'){
          this.disJuiciosRapidos = true
        }else{
          this.disJuiciosRapidos = false
        }
    }

  }

  changePrecio() {
    if (this.disableConfAdi) {
      this.precio
      this.disableImput = true
      if (this.precio == 'porTipos') {
        this.modalTipos = true;
      } else {
        this.modalTipos = false;
      }
    }

  }
  onChangeFacActuaciones(event) {
    this.facActuaciones = event
    this.disableConfAdi = event
    this.disPrecio = true;
  }

  onChangeFacAsuntosAntiguos(event) {
    this.facAsuntosAntiguos = event
  }

  onChangeProcesoFac2014(event) {
    this.procesoFac2014 = event
  }

  onChangeDescontar(event) {
    this.descontar = event
  }

  irAtipos() {
    this.showModal = true;
  }
  cerrarDialog(){
    this.showModal = false;
  }

}
