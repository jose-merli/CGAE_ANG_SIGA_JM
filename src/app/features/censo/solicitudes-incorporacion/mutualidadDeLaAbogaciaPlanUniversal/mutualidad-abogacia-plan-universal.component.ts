import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "../../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { Location } from "@angular/common";


@Component({
  selector: "app-mutualidad-abogacia-plan-universal",
  templateUrl: "./mutualidad-abogacia-plan-universal.component.html",
  styleUrls: ["./mutualidad-abogacia-plan-universal.component.scss"]
})
export class MutualidadAbogaciaPlanUniversal implements OnInit {

  mostrarEstadoSolicitud: boolean = false;
  progressSpinner: boolean = false;
  datosDireccion: boolean = false;
  datosBancarios: boolean = false;
  datosPoliza: boolean = false;
  paisSelected: any;
  provinciaSelected: any;
  poblacionSelected: any;
  pagoSelected: any;
  provincias: any[];
  poblaciones: any[];
  paises: any[];
  comboPago: any[];


  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef,
    private router: Router, private location: Location) { }

  ngOnInit() {

    //this.cargarCombos();

  }

  cargarCombos() {


    this.sigaServices.get("solicitudInciporporacion_pais").subscribe(
      result => {
        this.paises = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );


    this.sigaServices.get("integrantes_provincias").subscribe(
      result => {
        this.provincias = result.combooItems;
        this.progressSpinner = false;
      },
      error => {
        console.log(error);
      }
    );
  }

  deshabilitarDireccion(): boolean {
    if (this.paisSelected != "191") {
      return true;
    } else {
      return false;
    }
  }
  onChangeProvincia(event) {
    this.sigaServices.getParam("direcciones_comboPoblacion", "?idProvincia=" + event.value.value).subscribe(result => {
      this.poblaciones = result.combooItems;
      this.progressSpinner = false;
      console.log(this.poblaciones);
    },
      error => {
        console.log(error);
      }
    );
  }

  abreCierraEstadoSolicitud() {
    this.mostrarEstadoSolicitud = !this.mostrarEstadoSolicitud;
  }
  abreCierraDatosDireccion() {
    this.datosDireccion = !this.datosDireccion;
  }

  abreCierraDatosBancarios() {
    this.datosBancarios = !this.datosBancarios;
  }

  abreCierraDatosPoliza() {
    this.datosPoliza = !this.datosPoliza;
  }

  backTo() {
    this.location.back();
  }
}
