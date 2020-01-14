import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { SigaServices } from "./../../_services/siga.service";
import { Router } from '@angular/router';
import { PersistenceService } from '../../_services/persistence.service';
import { CommonsService } from '../../_services/commons.service';

@Component({
  selector: "app-busqueda-colegiado-express",
  templateUrl: "./busqueda-colegiado-express.component.html",
  styleUrls: ["./busqueda-colegiado-express.component.scss"]
})
export class BusquedaColegiadoExpressComponent implements OnInit {

  @Output() idPersona = new EventEmitter<any>();
  @Input() nColegiado;
  @Input() apellidosNombre;
  @Input() disabled;
  @Input() permisoEscritura;

  progressSpinner: boolean = false;
  buscarDisabled: boolean = false;
  msgs = [];

  constructor(private sigaServices: SigaServices, private router: Router, private persistenceService: PersistenceService,
    private commonsService: CommonsService) { }

  ngOnInit() {

  }

  checkPermisosBuscarGeneralSJCS(){
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.disabled);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.isBuscarGeneralSJCS();
    }
  }

  checkPermisoLimpiar(){
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.disabled);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.isLimpiar();
    }
  }

  checkPermisoBuscar(){
    let msg = this.commonsService.checkPermisos(this.permisoEscritura, this.disabled);

    if (msg != undefined) {
      this.msgs = msg;
    } else {
      this.isBuscar();
    }
  }

  isBuscar() {
    if (this.nColegiado.length != 0) {
      this.progressSpinner = true;

      this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado", "?colegiadoJGItem=" + this.nColegiado).subscribe(
        data => {
          this.progressSpinner = false;

          if (data.colegiadoJGItem.length == 1) {
            this.apellidosNombre = data.colegiadoJGItem[0].nombre;
            this.idPersona.emit(data.colegiadoJGItem[0]);
          } else {
            this.apellidosNombre = "";
            this.nColegiado = "";
            this.idPersona.emit(undefined);
          }
        },
        error => {
          this.progressSpinner = false;
          this.apellidosNombre = "";
          this.nColegiado = "";
          this.idPersona.emit(undefined);
          console.log(error);
        }
      );
    } else {
      this.progressSpinner = false;
      this.apellidosNombre = "";
      this.idPersona.emit(undefined);
    }
    this.buscarDisabled = false;
  }

  isBuscarGeneralSJCS() {
    this.persistenceService.clearFiltrosBusquedaGeneralSJCS();
    this.router.navigate(["/busquedaGeneralSJCS"]);
  }

  focusNColegiado() {
    this.buscarDisabled = true;
  }

  isLimpiar() {
    this.apellidosNombre = "";
    this.nColegiado = "";
    this.idPersona.emit("");
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear(){
    this.msgs = [];
  }
}
