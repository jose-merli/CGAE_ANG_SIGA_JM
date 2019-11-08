import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaServices } from "./../../_services/siga.service";

@Component({
  selector: "app-busqueda-colegiado-express",
  templateUrl: "./busqueda-colegiado-express.component.html",
  styleUrls: ["./busqueda-colegiado-express.component.scss"]
})
export class BusquedaColegiadoExpressComponent implements OnInit {
  nColegiado: string = "";
  @Output() idPersona = new EventEmitter<string>();
  apellidosNombre: string = "";
  progressSpinner: boolean = false;
  buscarDisabled: boolean = false;

  constructor(private sigaServices: SigaServices) {}

  ngOnInit() {
    this.idPersona.emit("");
  } 

  isBuscar() {
    if(this.nColegiado.length!=0){
      this.progressSpinner = true;

      this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado","?colegiadoJGItem=" + this.nColegiado).subscribe(
        data => {
          this.progressSpinner = false;

          if (data.colegiadoJGItem.length == 1) {
            this.apellidosNombre = data.colegiadoJGItem[0].nombre;
            this.idPersona.emit(data.colegiadoJGItem[0].idPersona);
          } else {
            this.apellidosNombre = "";
            this.nColegiado = "";
            this.idPersona.emit("");
          }
        },
        error => {
          this.progressSpinner = false;
          this.apellidosNombre = "";
          this.nColegiado = "";
          this.idPersona.emit("");
          console.log(error);
        }
      );
    }else{
      this.progressSpinner = false;
      this.apellidosNombre = "";
      this.idPersona.emit("");
    }
    this.buscarDisabled=false;
  }

  focusNColegiado(){
    this.buscarDisabled=true;
  }

  isLimpiar() {
    this.apellidosNombre="";
    this.nColegiado="";
    this.idPersona.emit("");
  }
}
