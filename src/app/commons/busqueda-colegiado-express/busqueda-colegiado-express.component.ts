import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaServices } from "./../../_services/siga.service";
import { Router } from '@angular/router';
import { PersistenceService } from '../../_services/persistence.service';

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

  progressSpinner: boolean = false;
  buscarDisabled: boolean = false;

  constructor(private sigaServices: SigaServices, private router: Router, private persistenceService: PersistenceService) { }

  ngOnInit() {

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
    this.persistenceService.clearFiltrosAux();
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
}
