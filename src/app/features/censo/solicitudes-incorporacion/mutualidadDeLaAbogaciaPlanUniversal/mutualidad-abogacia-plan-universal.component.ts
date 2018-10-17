import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "../../../../../../node_modules/@angular/forms";
import { Router } from "../../../../../../node_modules/@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";


@Component({
  selector: "app-mutualidad-abogacia-plan-universal",
  templateUrl: "./mutualidad-abogacia-plan-universal.component.html",
  styleUrls: ["./mutualidad-abogacia-plan-universal.component.scss"]
})
export class MutualidadAbogaciaPlanUniversal implements OnInit {

  mostrarEstadoSolicitud: boolean = false;


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

  }

  abreCierraEstadoSolicitud() {
    this.mostrarEstadoSolicitud = !this.mostrarEstadoSolicitud;
  }
}
