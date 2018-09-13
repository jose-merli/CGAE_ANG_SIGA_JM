import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "../../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { SolicitudIncorporacionItem } from "../../../../models/SolicitudIncorporacionItem";


@Component({
  selector: 'app-nueva-incorporacion',
  templateUrl: './nueva-incorporacion.component.html',
  styleUrls: ['./nueva-incorporacion.component.scss']
})
export class NuevaIncorporacionComponent implements OnInit {

  fichaColegiacion: boolean = false;
  fichaSolicitud: boolean = false;
  fichaPersonal: boolean = false;
  fichaDireccion: boolean = false;
  fichaMutua: boolean = false;
  fichaAbogacia: boolean = false;
  fichaBancaria: boolean = false;
  es: any;
  solictudEditar: SolicitudIncorporacionItem = new SolicitudIncorporacionItem();
  progressSpinner: boolean = false;
  comboSexo: any;
  tiposSolicitud: any;
  estadosSolicitud: any;

  constructor(private translateService: TranslateService, private sigaServices: SigaServices) {

  }

  ngOnInit() {
    this.es = this.translateService.getCalendarLocale();
    this.progressSpinner = true;
    if (sessionStorage.getItem("editar") == "true") {
      this.solictudEditar = JSON.parse(sessionStorage.getItem("editedSolicitud"));
      this.cargarCombos();
      this.tratarDatos(); this.solictudEditar.idTipo
    }
    this.progressSpinner = false;
  }

  cargarCombos() {
    this.comboSexo = [
      { value: "H", label: "Hombre" },
      { value: "M", label: "Mujer" }
    ]

    this.sigaServices
      .get("solicitudInciporporacion_tipoSolicitud").subscribe(result => {
        this.tiposSolicitud = result.combooItems;
      },
        error => {
          console.log(error);
        });

    this.sigaServices
      .get("solicitudInciporporacion_estadoSolicitud").subscribe(result => {
        this.estadosSolicitud = result.combooItems;
        console.log("combo", this.estadosSolicitud);
      },
        error => {
          console.log(error);
        });
  }
  tratarDatos() {
    if (this.solictudEditar.residente == "1") {
      this.solictudEditar.residente = "true";
    } else {
      this.solictudEditar.residente = "false";
    }
    console.log("idEstado", this.solictudEditar.idEstado);
    console.log("idtipo", this.solictudEditar.idTipo);
    this.solictudEditar.fechaSolicitud = new Date(this.solictudEditar.fechaSolicitud);
    this.solictudEditar.fechaIncorporacion = new Date(this.solictudEditar.fechaIncorporacion);
    this.solictudEditar.fechaEstado = new Date(this.solictudEditar.fechaEstado);
    this.solictudEditar.fechaNacimiento = new Date(this.solictudEditar.fechaNacimiento);
  }
  abreCierraFichaColegiacion() {
    this.fichaColegiacion = !this.fichaColegiacion;
  }
  abreCierraFichaSolicitud() {
    this.fichaSolicitud = !this.fichaSolicitud;
  }
  abreCierraFichaPersonal() {
    this.fichaPersonal = !this.fichaPersonal;
  }
  abreCierraFichaDireccion() {
    this.fichaDireccion = !this.fichaDireccion;
  }
  abreCierraFichaBancaria() {
    this.fichaBancaria = !this.fichaBancaria;
  }
  abreCierraFichaMutua() {
    this.fichaMutua = !this.fichaMutua;
  }
  abreCierraFichaAbogacia() {
    this.fichaAbogacia = !this.fichaAbogacia;
  }
}
