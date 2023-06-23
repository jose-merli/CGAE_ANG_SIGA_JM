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
  @Input() filtros;
  @Input() filtrosAE;
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
    if (this.pantalla == 'asistencia'){
    sessionStorage.setItem('filtroAsistencia', JSON.stringify(this.filtros));
    }
    if (sessionStorage.getItem("isLetrado") != null && sessionStorage.getItem("isLetrado") != undefined) {
      this.isLetrado = JSON.parse(sessionStorage.getItem("isLetrado"));
    }

    if (this.numColegiado && this.numColegiado != '') {
      this.colegiadoForm.get('numColegiado').setValue(this.numColegiado);
      sessionStorage.setItem("numColegiado",this.numColegiado);
      if(sessionStorage.getItem("buscadorColegiados")){
        this.nombreAp = JSON.parse(sessionStorage.getItem("buscadorColegiados")).apellidos + ", " + JSON.parse(sessionStorage.getItem("buscadorColegiados")).nombre;
        this.numColegiado = JSON.parse(sessionStorage.getItem("buscadorColegiados")).nColegiado;
        sessionStorage.removeItem("buscadorColegiados");
      }
      let usuarioBusquedaExpress = {
        numColegiado: this.numColegiado,
        nombreAp: this.nombreAp
      };
      if(this.nombreAp == null || this.nombreAp == undefined || this.nombreAp == ''){
        this.isBuscar(usuarioBusquedaExpress);
      }
    }

    if (this.nombreAp) {
      this.colegiadoForm.get('nombreAp').setValue(this.nombreAp);
    }

    this.colegiadoForm.controls['nombreAp'].disable();

    if (this.disabled && sessionStorage.getItem("deshabilitarBuscadorColegiadoExpres") == null) {
      this.colegiadoForm.controls['numColegiado'].disable();
    }
    sessionStorage.removeItem("deshabilitarBuscadorExpres");
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

    if(!this.isLetrado){
      this.colegiadoForm.reset();
      if(this.obligatorio){
        this.styleObligatory = true;
      }
      this.colegiadoForm.get('numColegiado').setValue("");
      this.colegiadoForm.get('nombreAp').setValue("");
      sessionStorage.setItem("numColegiado","");
      this.changeValue();
      if (sessionStorage.getItem("buscadorColegiados")) {
        sessionStorage.removeItem("buscadorColegiados");
      }
    }

    this.colegiado.emit(null);
  }

  isBuscar(form) {
    if (this.pantalla == 'asistencia'){
      sessionStorage.setItem('filtroAsistencia', JSON.stringify(this.filtros));
      }
    if (this.pantalla == 'asistenciaAE'){
        sessionStorage.setItem('filtroAsistenciaExpresBusqueda', JSON.stringify(this.filtrosAE));
        sessionStorage.setItem("modoBusqueda", "b");
        sessionStorage.setItem("vieneDeAsistenciaExpres", "true");
    }
    //Se revisa si esta en la pantalla de gestion de Ejg y la tarjeta de servicios de tramitación
    if (this.tarjeta == "ServiciosTramit" && this.pantalla == "gestionEjg") {
      //Se comprueba que se han rellenado los campos de turno y guardia
      //if (this.idGuardia != null && this.idGuardia != undefined &&
       // this.idTurno != null && this.idTurno != undefined) {
        this.searchTramitacionEJG(form);
      
     // else this.msgs = [{ severity: "error", summary: "Error", detail: this.translateService.instant('general.message.camposObligatorios') }];
    }
    else this.defaultsearch(form);
  }

  searchTramitacionEJG(form) {
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

    if(this.idTurno!=null  && this.idGuardia!=null){
    sessionStorage.setItem("idTurno", this.idTurno);
    sessionStorage.setItem("idGuardia", this.idGuardia);
  }
}


  defaultsearch(form) {
    if(this.localStorageService.isLetrado && this.localStorageService.numColegiado != form.numColegiado ){
      this.numColegiado = this.localStorageService.numColegiado
      this.colegiadoForm.controls['numColegiado'].disable();
    }else{
      if (form.numColegiado != undefined && form.numColegiado != null && form.numColegiado.length != 0) {
        this.progressSpinner = true;
        
        this.sigaServices.getParam("componenteGeneralJG_busquedaColegiado", "?colegiadoJGItem=" + form.numColegiado).subscribe(
          data => {
            this.progressSpinner = false;

            if (data.colegiadoJGItem.length == 1) {
              sessionStorage.setItem("numColegiado", form.numColegiado);
              this.apellidosNombre = data.colegiadoJGItem[0].nombre;
              this.idPersona.emit(data.colegiadoJGItem[0].idPersona);
              this.colegiadoForm.get("nombreAp").setValue(this.apellidosNombre);
            }else if(data.colegiadoJGItem.length > 1){ 
              sessionStorage.setItem("numColegiado", form.numColegiado);
              sessionStorage.setItem("sizedatacolegiado", data.colegiadoJGItem.length);
              sessionStorage.setItem("pantalla", this.pantalla);
              this.router.navigate(["/buscadorColegiados"]);
            } else {
              this.apellidosNombre = "";
              this.numColegiado = ""
              form.numColegiado = "";
              sessionStorage.setItem("numColegiado", "");
              sessionStorage.setItem("nombreAp", "");
              sessionStorage.setItem("buscadorColegiados","");
              this.idPersona.emit("");

              this.showMessage("warn", this.translateService.instant("general.message.informacion"), this.translateService.instant("general.message.justificacionExpres.colegiadoNoEncontrado"));
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

          //Comprobamos el estado del checkbox para el art 27-28
          if (this.art27) sessionStorage.setItem("art27", "true");

          if (this.art27){
            sessionStorage.setItem("Art27Activo", "true");
            this.router.navigate(["/busquedaGeneral"]);
          }
          else this.router.navigate(["/buscadorColegiados"]);
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
      nColegiado: sessionStorage.getItem("numColegiado"),
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

  busquedaColegiadoJE() {
    if(sessionStorage.getItem("datosEJG")){
      let datosToNextScreen = JSON.parse(sessionStorage.getItem("datosEJG"));
      sessionStorage.setItem("turnoEJG", datosToNextScreen.idTurno);
    }

    if(sessionStorage.getItem("cargaJE")=="true"){
      var vieneDeJE = "true";
      sessionStorage.setItem("vieneDeJE", vieneDeJE);
    }
   
  }

}