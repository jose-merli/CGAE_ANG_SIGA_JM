import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Message } from "_debugger";
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaServices } from "./../../_services/siga.service";

@Component({
  selector: "app-busqueda-colegiado-express",
  templateUrl: "./busqueda-colegiado-express.component.html",
  styleUrls: ["./busqueda-colegiado-express.component.scss"]
})
export class BusquedaColegiadoExpressComponent implements OnInit {
  @Input() numColegiado;
  @Input() nombreAp;
  @Input() tarjeta;
  @Output() idPersona = new EventEmitter<string>();
  progressSpinner: boolean = false;
  nColegiado: string = "";
  apellidosNombre: string = "";
  colegiadoForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  msgs: Message[] = [];

  constructor(private router: Router, private sigaServices: SigaServices) { }

  ngOnInit() {

    if (this.numColegiado) {
      this.colegiadoForm.get('numColegiado').setValue(this.numColegiado);
    }

    if (this.nombreAp) {
      this.colegiadoForm.get('nombreAp').setValue(this.nombreAp);
    }

    this.colegiadoForm.controls['nombreAp'].disable();

  }

  submitForm(form) {

    this.isBuscar(form);

    if (sessionStorage.getItem("tarjeta")) {
      sessionStorage.removeItem("tarjeta");
    }

    if (this.tarjeta) {
      sessionStorage.setItem("tarjeta", this.tarjeta);
    }

    if (form.numColegiado === '' || form.numColegiado === null) {
      this.router.navigate(["/pantallaBuscadorColegiados"]);
    }

  }

  clearForm() {
    this.colegiadoForm.reset();
  }

  isBuscar(form) {
    if(form.numColegiado.length!=0){
      this.progressSpinner = true;

      this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado","?colegiadoJGItem=" + form.numColegiado).subscribe(
        data => {
          this.progressSpinner = false;

          if (data.colegiadoJGItem.length == 1) {
            this.apellidosNombre = data.colegiadoJGItem[0].nombre;
            this.idPersona.emit(data.colegiadoJGItem[0].idPersona);
            this.colegiadoForm.get("nombreAp").setValue(this.apellidosNombre);
          } else {
            this.apellidosNombre = "";
            form.numColegiado = "";
            this.idPersona.emit("");
          }
        },
        error => {
          this.progressSpinner = false;
          this.apellidosNombre = "";
          form.numColegiado= "";
          this.idPersona.emit("");
          console.log(error);
        }
      );
    }else{
      this.progressSpinner = false;
      this.apellidosNombre = "";
      this.idPersona.emit("");
    }
    // this.buscarDisabled=false;
  }
}
