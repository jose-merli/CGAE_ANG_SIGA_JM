import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Enlace } from '../ficha-retencion-judicial.component'
import { Router } from '@angular/router';
import { RetencionesService } from '../../retenciones.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { ColegiadoItem } from '../../../../../../models/ColegiadoItem';
import { ColegiadoObject } from '../../../../../../models/ColegiadoObject';
import { procesos_facturacionSJCS } from '../../../../../../permisos/procesos_facturacionSJCS';
import { CommonsService } from '../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../commons/translate/translation.service';
import { SigaStorageService } from '../../../../../../siga-storage.service';

export class Colegiado {
  idPersona: string;
  numColeiado: string;
  nombre: string;
  apellidos1: string;
  apellidos2: string;
  nif: string;
}

@Component({
  selector: 'app-tarjeta-colegiado',
  templateUrl: './tarjeta-colegiado.component.html',
  styleUrls: ['./tarjeta-colegiado.component.scss']
})
export class TarjetaColegiadoComponent implements OnInit, AfterViewInit {

  showTarjeta: boolean = false;
  body: Colegiado = new Colegiado();
  bodyAux: Colegiado = new Colegiado();
  // Conn esta propiedad comprobamos si se está cambiando el colegiado con una retención que ya está creada
  cambioColegiado: boolean = false;
  permisoEscritura: boolean;

  @Output() addEnlace = new EventEmitter<Enlace>();
  @Output() colegiadoEvent = new EventEmitter<Colegiado>();

  @ViewChild('nombre') nombre: ElementRef;
  @ViewChild('apellidos1') apellidos1: ElementRef;
  @ViewChild('apellidos2') apellidos2: ElementRef;
  @ViewChild('nif') nif: ElementRef;

  constructor(private router: Router,
    private retencionesService: RetencionesService,
    private sigaServices: SigaServices,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private sigaStorageService: SigaStorageService) { }
    isLetrado: boolean = false;

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_facturacionSJCS.fichaRetTarjetaColegiado).then(respuesta => {

      this.permisoEscritura = respuesta;

      if (this.permisoEscritura == undefined) {
        sessionStorage.setItem("codError", "403");
        sessionStorage.setItem("descError", this.translateService.instant("generico.error.permiso.denegado"));
        this.router.navigate(["/errorAcceso"]);
      }

      if (sessionStorage.getItem("buscadorColegiados")) {

        const { nombre, apellidos, nif, idPersona, nColegiado } = JSON.parse(sessionStorage.getItem("buscadorColegiados"));

        this.body.nombre = nombre;
        this.body.apellidos1 = apellidos.split(' ')[0].trim();
        this.body.apellidos2 = apellidos.split(' ')[1].trim();
        this.body.nif = nif;
        this.body.idPersona = idPersona;
        this.body.numColeiado = nColegiado;

        this.colegiadoEvent.emit(this.body);

        this.bodyAux = JSON.parse(JSON.stringify(this.body));

        sessionStorage.removeItem("buscadorColegiados");
        this.showTarjeta = true;

        if (this.retencionesService.modoEdicion) {
          this.cambioColegiado = true;
        }
      }

      if (this.retencionesService.modoEdicion && !this.cambioColegiado) {
        this.getColegiado();
      }

    }).catch(error => console.error(error));
    this.isLetrado = this.sigaStorageService.isLetrado;
  }

  ngAfterViewInit() {

    const enlace: Enlace = {
      id: 'facSJCSFichaRetCol',
      ref: document.getElementById('facSJCSFichaRetCol')
    };

    this.addEnlace.emit(enlace);
  }

  onHideTarjeta() {
    if (this.retencionesService.modoEdicion) {
      this.showTarjeta = !this.showTarjeta;
    } else {
      this.showTarjeta = true;
    }
  }

  trim(value: string) {
    this.body[value] = this.body[value].trim();
  }

  isDisabledRestablecer() {
    return (!this.retencionesService.modoEdicion);
  }

  restablecer() {
    if (this.retencionesService.modoEdicion && this.permisoEscritura) {
      this.getColegiado();
    }
  }

  buscar() {
    if (this.permisoEscritura) {
      this.router.navigate(["/buscadorColegiados"]);
    }
  }


  setDisabled() {
    this.body = JSON.parse(JSON.stringify(this.bodyAux));
    this.nombre.nativeElement.disabled = true;
    this.apellidos1.nativeElement.disabled = true;
    this.apellidos2.nativeElement.disabled = true;
    this.nif.nativeElement.disabled = true;
  }

  getColegiado() {

    const payload = new ColegiadoItem();
    payload.idPersona = this.retencionesService.retencion.idPersona;

    this.sigaServices.post("busquedaColegiados_searchColegiadoFicha", payload).subscribe(
      data => {
        const colegiadoObject: ColegiadoObject = JSON.parse(data.body);

        const colegiado = new Colegiado();
        colegiado.idPersona = colegiadoObject.colegiadoItem[0].idPersona.toString();
        colegiado.nombre = colegiadoObject.colegiadoItem[0].soloNombre.toString();
        colegiado.apellidos1 = colegiadoObject.colegiadoItem[0].apellidos1.toString();
        colegiado.apellidos2 = colegiadoObject.colegiadoItem[0].apellidos2.toString();
        colegiado.nif = colegiadoObject.colegiadoItem[0].nif.toString();

        this.body = JSON.parse(JSON.stringify(colegiado));
        this.bodyAux = JSON.parse(JSON.stringify(colegiado));

        this.colegiadoEvent.emit(this.body);
      },
      err => {
        console.log(err);
      }
    );

  }

}
