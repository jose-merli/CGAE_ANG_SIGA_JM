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
import { TooltipModule } from "primeng/tooltip";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";
import { FileUploadModule } from "primeng/fileupload";

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
import { FichaColegialComponent } from "./../../../new-features/censo/ficha-colegial/ficha-colegial.component";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosColegialesComponent } from "./../../../new-features/censo/ficha-colegial/datos-colegiales/datos-colegiales.component";
import { DatoGeneralItem } from "./../../../../app/models/DatoGeneralItem";
import { DatoGeneralObject } from "./../../../../app/models/DatoGeneralObject";

// import
@Component({
  selector: "app-datos-persona-juridica",
  templateUrl: "./datosPersonaJuridica.component.html",
  styleUrls: ["./datosPersonaJuridica.component.scss"]
})
export class DatosPersonaJuridicaComponent implements OnInit {
  constructor(public sigaServices: OldSigaServices) {}

  ngOnInit() {}
}
