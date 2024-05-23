import { CommonModule, Location } from "@angular/common";
import { Component, NgModule, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { Message } from "primeng/components/common/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DataTableModule } from "primeng/datatable";
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { TooltipModule } from "primeng/tooltip";
import { esCalendar } from "../../../utils/calendar";

/*** COMPONENTES ***/
import { DatosGeneralesItem } from "./../../../../app/models/DatosGeneralesItem";
import { DatosColegialesComponent } from "./../../../new-features/censo/ficha-colegial/datos-colegiales/datos-colegiales.component";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { FichaColegialComponent } from "./../../../new-features/censo/ficha-colegial/ficha-colegial.component";

@NgModule({
  imports: [CommonModule, CalendarModule, InputTextModule, InputTextareaModule, DropdownModule, CheckboxModule, ButtonModule, DataTableModule, FormsModule, ReactiveFormsModule, AutoCompleteModule, ConfirmDialogModule, TooltipModule, ChipsModule, RadioButtonModule, FileUploadModule],
  declarations: [FichaColegialComponent, DatosGeneralesComponent, DatosColegialesComponent],
  exports: [FichaColegialComponent],
  providers: [],
})
@Component({
  selector: "app-busqueda-colegiados",
  templateUrl: "./busqueda-colegiados.component.html",
  styleUrls: ["./busqueda-colegiados.component.scss"],
})
export class BusquedaColegiadosComponentI implements OnInit {
  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];
  body: DatosGeneralesItem = new DatosGeneralesItem();
  fichasActivas: Array<any> = [];
  todo: boolean = false;

  selectedDatos: any = [];

  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  showAll: boolean = false;

  selectedItem: number = 10;
  selectedDoc: string = "NIF";
  newDireccion: boolean = false;

  editar: boolean = false;
  archivoDisponible: boolean = false;
  file: File = undefined;
  base64String: any;
  source: any;
  imageBase64: any;
  imagenURL: any;
  generos: any[];
  tratamientos: any[];
  idiomas: any[] = [
    { label: "", value: "" },
    { label: "Castellano", value: "castellano" },
    { label: "Catalá", value: "catalan" },
    { label: "Euskara", value: "euskera" },
    { label: "Galego", value: "gallego" },
  ];
  edadCalculada: String;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild("table")
  table;

  fichasPosibles = [
    {
      key: "generales",
      activa: false,
    },
    {
      key: "direcciones",
      activa: false,
    },
    {
      key: "colegiales",
      activa: false,
    },
    {
      key: "bancarios",
      activa: false,
    },
    {
      key: "cv",
      activa: false,
    },
  ];

  constructor(private formBuilder: FormBuilder, private location: Location) {
    this.formBusqueda = this.formBuilder.group({
      cif: null,
    });
  }

  ngOnInit() {}
  backTo() {
    this.location.back();
  }
}
