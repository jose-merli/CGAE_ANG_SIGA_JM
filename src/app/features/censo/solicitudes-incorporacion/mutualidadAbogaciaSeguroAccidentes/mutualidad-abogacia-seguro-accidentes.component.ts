import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";


@Component({
  selector: "app-mutualidad-abogacia-seguro-accidentes",
  templateUrl: "./mutualidad-abogacia-seguro-accidentes.component.html",
  styleUrls: ["./mutualidad-abogacia-seguro-accidentes.component.scss"]
})
export class MutualidadAbogaciaSeguroAccidentes implements OnInit {

  mostrarEstadoSolicitud: boolean = false;
  progressSpinner: boolean = false;
  datosDireccion: boolean = false;
  paisSelected: any;
  provinciaSelected: any;
  poblacionSelected: any;
  provincias: any[];
  poblaciones: any[];
  paises: any[];


  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {

    //this.cargarCombos();

  }

  cargarCombos() {

    this.sigaServices.post("", "").subscribe(result => {

    })

    this.sigaServices.get("solicitudIncorporacion_pais").subscribe(
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
}
