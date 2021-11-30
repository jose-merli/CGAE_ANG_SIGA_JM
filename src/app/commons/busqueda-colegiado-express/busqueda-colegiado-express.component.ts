import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SigaStorageService } from "../../siga-storage.service";
import { PersistenceService } from '../../_services/persistence.service';
import { TranslateService } from "../translate";
import { SigaServices } from "./../../_services/siga.service";
import { ColegiadosSJCSItem } from "../../models/ColegiadosSJCSItem";

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
  @Input() idTurno;
  @Input() idGuardia;
  @Input() art27;

  @Input() obligatorio: boolean;
  @Output() idPersona = new EventEmitter<string>();
  progressSpinner: boolean = false;
  nColegiado: string = "";
  apellidosNombre: string = "";
  colegiadoForm = new FormGroup({
    numColegiado: new FormControl(''),
    nombreAp: new FormControl(''),
  });
  styleObligatory: boolean;
  msgs;
  @Output() colegiado = new EventEmitter<any>();
  isLetrado: boolean = false;

  constructor(private localStorageService: SigaStorageService, private router: Router, private sigaServices: SigaServices, private translateService: TranslateService, private PpersistenceService: PersistenceService) { }

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
    if (this.isLetrado) {
      this.colegiadoForm.controls['numColegiado'].disable();
    }

    if(this.obligatorio && this.colegiadoForm.get('numColegiado').value == ""){
      this.styleObligatory = true;
    }else{
        this.styleObligatory = false;
    }

  }

  clearForm() {
    this.colegiadoForm.reset();
    this.styleObligatory = true;
    this.obligatorio = true;
    this.colegiadoForm.get('numColegiado').setValue("");
    this.colegiadoForm.get('nombreAp').setValue("");
    this.changeValue();
  }

  isBuscar(form) {
    //Se revisa si esta en la pantalla de gestion de Ejg y la tarjeta de servicios de tramitación
    if (this.tarjeta == "ServiciosTramit" && this.pantalla == "gestionEjg") {
      //Se comprueba que se han rellenado los campos de turno y guardia
      if (this.idGuardia != null && this.idGuardia != undefined &&
        this.idTurno != null && this.idTurno != undefined) {
        this.searchTramitacionEJG(form);
      }
      else this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    }
    else this.defaultsearch(form);
  }

  searchTramitacionEJG(form) {
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
          //console.log(error);
          this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.mensaje.error.bbdd"));
        }
      );
      //Si se a introducido un num de colegiado y se activo art 27. 
      //Al revisar que la busqueda express se realiza con limitacion de colegio
      //ya que los numeros de colegiado no son unicos, se decide devolver un mensaje de negativa.
      if (this.art27){
         this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('justiciaGratuita.ejg.tramitacion.noExpressArt') }];
         this.progressSpinner = false;
      }
      else {
        this.defaultsearch(form)
      }
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

      sessionStorage.setItem("idTurno", this.idTurno);
      sessionStorage.setItem("idGuardia", this.idGuardia);

      if (form.numColegiado == null || form.numColegiado == undefined || form.numColegiado.trim() == "") {

        //Comprobamos el estado del checkbox para el art 27-28
        if (this.art27) sessionStorage.setItem("art27", "true");

        if (this.art27){
          sessionStorage.setItem("Art27Activo", "true");
          this.router.navigate(["/busquedaGeneral"]);
        }
        else this.router.navigate(["/buscadorColegiados"]);
      }
    }
  }

  defaultsearch(form) {
    if(this.localStorageService.isLetrado && this.localStorageService.numColegiado != form.numColegiado ){
      this.numColegiado = this.localStorageService.numColegiado
      this.colegiadoForm.controls['numColegiado'].disable();
    }else{
      if (form.numColegiado != undefined && form.numColegiado != null && form.numColegiado.length != 0) {
        this.progressSpinner = true;
        sessionStorage.setItem("numColegiado", form.numColegiado);

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
            //console.log(error);
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

    if(this.obligatorio){
      if(colegiado.nColegiado == "" || colegiado.nombreAp == ""){
        this.styleObligatory = true;
      }else{
        this.styleObligatory = false;
      }
    }

    this.colegiado.emit(colegiado);
  }

}