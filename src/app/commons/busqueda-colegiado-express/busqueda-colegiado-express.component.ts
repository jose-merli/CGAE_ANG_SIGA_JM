import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { PersistenceService } from '../../_services/persistence.service';
import { TranslateService } from "../translate";
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
  @Input() pantalla;
  @Input() disabled;

  @Output() idPersona = new EventEmitter<string>();
  progressSpinner: boolean = false;
  nColegiado: string = "";
  apellidosNombre: string = "";
  colegiadoForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });

  msgs;
  @Output() colegiado = new EventEmitter<any>();
  isLetrado: boolean = false;

  constructor(private router: Router, private sigaServices: SigaServices, private translateService: TranslateService, private PpersistenceService: PersistenceService) { }

  ngOnInit() {
    if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }

    if (this.numColegiado) {
      this.colegiadoForm.get('numColegiado').setValue(this.numColegiado);
    }

    if (this.nombreAp) {
      this.colegiadoForm.get('nombreAp').setValue(this.nombreAp);
    }

    this.colegiadoForm.controls['nombreAp'].disable();

    if (this.disabled) {
      this.colegiadoForm.controls['numColegiado'].disable();
    }
    if(this.isLetrado){
      this.colegiadoForm.controls['numColegiado'].disable();
    }

  }

  clearForm() {
    this.colegiadoForm.reset();
    this.changeValue();
  }

  isBuscar(form) {
    if (form.numColegiado != undefined && form.numColegiado != null && form.numColegiado.length != 0) {
      this.progressSpinner = true;

      this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado", "?colegiadoJGItem=" + form.numColegiado).subscribe(
        data => {
          this.progressSpinner = false;

          if (data.colegiadoJGItem.length == 1) {
            this.apellidosNombre = data.colegiadoJGItem[0].nombre;
            this.idPersona.emit(data.colegiadoJGItem[0].idPersona);
            this.colegiadoForm.get("nombreAp").setValue(this.apellidosNombre);
          } else {
            this.apellidosNombre = "";
            this.numColegiado = ""
            form.numColegiado = "";
            this.idPersona.emit("");

            this.showMessage("info", this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.colegiadoNoEncontrado"));
          }
          this.changeValue();
  
        },
        error => {
          this.progressSpinner = false;
          this.apellidosNombre = "";
          form.numColegiado = "";
          this.numColegiado = "";
          this.idPersona.emit("");
          this.changeValue();
          console.log(error);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
    } else {
      this.progressSpinner = false;
      this.apellidosNombre = "";
      this.idPersona.emit("");

      if (sessionStorage.getItem("tarjeta")) {
        sessionStorage.removeItem("tarjeta");
      }

      if (sessionStorage.getItem("pantalla")) {
        sessionStorage.removeItem("pantalla");
      }

      if (this.pantalla) {
        sessionStorage.setItem("pantalla", this.pantalla);
      }

      if (this.tarjeta) {
        sessionStorage.setItem("tarjeta", this.tarjeta);
      }

      if (form.numColegiado == null || form.numColegiado == undefined || form.numColegiado.trim() == "") {
        this.router.navigate(["/buscadorColegiados"]);
      }
    }
    // this.buscarDisabled=false;
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

  changeValue() {
    const colegiado = {
      nColegiado: this.colegiadoForm.get('numColegiado').value,
      nombreAp: this.colegiadoForm.get('nombreAp').value
    }

    this.colegiado.emit(colegiado);
  }
}