import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { OldSigaServices } from "../../../_services/oldSiga.service";

import {
  /*** MODULOS ***/
  NgModule
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { DataTableModule } from "primeng/datatable";
// import { MenubarModule } from 'primeng/menubar';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";

import { Http, Response } from "@angular/http";
import { MenuItem } from "primeng/api";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { SelectItem } from "primeng/api";
import { esCalendar } from "../../../utils/calendar";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Location } from "@angular/common";

import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { TranslateService } from "../../../commons/translate/translation.service";
import { HeaderGestionEntidadService } from "./../../../_services/headerGestionEntidad.service";

/*** COMPONENTES ***/
import { DatosRetencionesDto } from "./../../../../app/models/DatosRetencionesDto";
import { RetencionesItem } from "./../../../../app/models/RetencionesItem";
import { DatosPersonaJuridicaComponent } from "../datosPersonaJuridica/datosPersonaJuridica.component";

@Component({
  selector: "app-datos-retenciones",
  templateUrl: "./datos-retenciones.component.html",
  styleUrls: ["./datos-retenciones.component.scss"]
})
export class DatosRetencionesComponent implements OnInit {
  openFicha: boolean = false;
  usuarioBody: any[];
  idPersona: String;
  tiposRetenciones: DatosRetencionesDto = new DatosRetencionesDto();
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
    private location: Location,
    private confirmationService: ConfirmationService,
    private sigaServices: SigaServices,
    private headerGestionEntidadService: HeaderGestionEntidadService,
    private fichasPosibles: DatosPersonaJuridicaComponent
  ) {}

  ngOnInit() {
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody.length > 0)
      this.idPersona = this.usuarioBody[0].idPersona;

    this.getTiposRetenciones();
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  getTiposRetenciones() {
    this.sigaServices.get("retenciones_tipoRetencion").subscribe(
      n => {
        this.tiposRetenciones.retencionesItemList = n.maestroRetencionItem;
      },
      err => {
        console.log(err);
        this.tiposRetenciones.error = err.error;
      }
    );
  }
}