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
import { CalendarModule } from "primeng/calendar";
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
import { TooltipModule } from "primeng/tooltip";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";
import { FileUploadModule } from "primeng/fileupload";
import { MultiSelectModule } from "primeng/multiselect";

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
import { ComboItem } from "./../../../../app/models/ComboItem";

/*** COMPONENTES ***/
import { FichaColegialComponent } from "./../../../new-features/censo/ficha-colegial/ficha-colegial.component";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosColegialesComponent } from "./../../../new-features/censo/ficha-colegial/datos-colegiales/datos-colegiales.component";
import { DatosRegistralesItem } from "./../../../../app/models/DatosRegistralesItem";
import { DatosRegistralesObject } from "./../../../../app/models/DatosRegistralesObject";
import { DatosPersonaJuridicaComponent } from "../datosPersonaJuridica/datosPersonaJuridica.component";

@Component({
  selector: "app-servicios-interes",
  templateUrl: "./servicios-interes.component.html",
  styleUrls: ["./servicios-interes.component.scss"]
})
export class ServiciosInteresComponent implements OnInit {
  @ViewChild(ServiciosInteresComponent)
  serviciosInteresComponent: ServiciosInteresComponent;
  msgs: any[];
  @ViewChild("table") table;

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
  ) { }

  ngOnInit() { }

  irFacturacion() {
    this.router.navigate(["/facturas"]);
  }
  irAuditoria() {
    this.router.navigate(["/auditoriaUsuarios"]);
    sessionStorage.setItem("tarjeta", "/fichaPersonaJuridica");
  }
  irComunicaciones() {
    this.router.navigate(["/informesGenericos"]);
  }
}
