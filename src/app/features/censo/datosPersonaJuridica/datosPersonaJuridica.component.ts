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
import { Location } from "@angular/common";

import { cardService } from "./../../../_services/cardSearch.service";

// import
@Component({
  selector: "app-datos-persona-juridica",
  templateUrl: "./datosPersonaJuridica.component.html",
  styleUrls: ["./datosPersonaJuridica.component.scss"]
})
export class DatosPersonaJuridicaComponent implements OnInit {
  fichasPosibles: any[] = [];
  generales: boolean = false;
  constructor(
    public sigaServices: OldSigaServices,
    private cardService: cardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fichasPosibles = [
      {
        key: "generales",
        activa: false
      },
      {
        key: "registrales",
        activa: false
      },
      {
        key: "notario",
        activa: false
      },
      {
        key: "integrantes",
        activa: false
      },
      {
        key: "bancarios",
        activa: false
      },
      {
        key: "retenciones",
        activa: false
      },
      {
        key: "interes",
        activa: false
      },
      {
        key: "direcciones",
        activa: false
      }
    ];
  }
  backTo() {
    sessionStorage.removeItem("usuarioBody");
    this.cardService.searchNewAnnounce.next(null);

    //this.location.back();
    this.router.navigate(["searchNoColegiados"]);
  }

  getFichasPosibles() {
    return this.fichasPosibles;
  }
}
