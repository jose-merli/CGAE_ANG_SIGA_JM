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

/*** COMPONENTES ***/
import { FichaColegialComponent } from "./../../../new-features/censo/ficha-colegial/ficha-colegial.component";
import { DatosGeneralesComponent } from "./../../../new-features/censo/ficha-colegial/datos-generales/datos-generales.component";
import { DatosColegialesComponent } from "./../../../new-features/censo/ficha-colegial/datos-colegiales/datos-colegiales.component";

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    DataTableModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    TooltipModule,
    ChipsModule,
    RadioButtonModule,
    FileUploadModule
  ],
  declarations: [
    FichaColegialComponent,
    DatosGeneralesComponent,
    DatosColegialesComponent
  ],
  exports: [FichaColegialComponent],
  providers: []
})
@Component({
  selector: "app-accesoFichaPersona",
  templateUrl: "./accesoFichaPersona.component.html",
  styleUrls: ["./accesoFichaPersona.component.scss"]
})
export class AccesoFichaPersonaComponent implements OnInit {
  uploadedFiles: any[] = [];
  formBusqueda: FormGroup;
  cols: any = [];
  datosDirecciones: any[];
  select: any[];
  es: any = esCalendar;
  msgs: Message[];

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

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild("table") table;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "direcciones",
      activa: false
    },
    {
      key: "colegiales",
      activa: false
    },
    {
      key: "bancarios",
      activa: false
    },
    {
      key: "cv",
      activa: false
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private location: Location,
    private sigaServices: SigaServices
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null
    });
  }

  ngOnInit() {
    if (sessionStorage.getItem("idPersona") != null) {
      this.sigaServices
        .postPaginado(
          "datos_generales_search",
          "?numPagina=1",
          sessionStorage.getItem("idPersona")
        )
        .subscribe(
          data => {
            console.log(data);
            // this.search = JSON.parse(data["body"]);
            // this.datos = this.search.contadorItems;
            // console.log(this.datos);
            this.table.reset();
          },
          err => {
            console.log(err);
          }
        );
      sessionStorage.removeItem("idPersona");
    }

    this.cols = [
      { field: "tipoDireccion", header: "Tipo dirección" },
      { field: "direccion", header: "Dirección" },
      { field: "cp", header: "Código postal" },
      { field: "poblacion", header: "Población" },
      { field: "telefono", header: "Teléfono" },
      { field: "fax", header: "Fax" },
      { field: "movil", header: "Movil" },
      { field: "email", header: "Email" },
      { field: "preferente", header: "Preferente" }
    ];

    this.select = [
      { label: "-seleccionar-", value: null },
      { label: "NIF", value: "nif" },
      { label: "Pasaporte", value: "pasaporte" },
      { label: "NIE", value: "nie" }
    ];

    this.datosDirecciones = [
      {
        id: 0,
        tipoDireccion:
          "CensoWeb, Despacho, Facturación, Guardia, Guía Judicial, Pública, Revista, Traspaso a organos judiciales",
        direccion: "C/ CARDENAL CISNEROS 42-1º",
        cp: "03660",
        poblacion: "Novelda",
        telefono: "99999",
        fax: "2434344",
        movil: "88888",
        email: "email@redabogacia.org",
        preferente: "correo,Mail,Fax,SMS"
      }
    ];

    this.rowsPerPage = [
      {
        label: 10,
        value: 10
      },
      {
        label: 20,
        value: 20
      },
      {
        label: "Todo",
        value: this.datosDirecciones.length
      }
    ];
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }
  onHideDatosFacturacion() {
    this.showDatosFacturacion = !this.showDatosFacturacion;
  }

  onChangeRowsPerPages(event) {
    console.log(event);
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  // confirmarBorrar(index) {
  //   this.confirmationService.confirm({
  //     message: '¿Está seguro de eliminar los datos?',
  //     icon: 'far fa-trash-alt',
  //     accept: () => {
  //       this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' }];
  //       this.socios.splice(index, 1);
  //       this.socios = [...this.socios];
  //     },
  //     reject: () => {
  //       this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
  //     }
  //   });
  // }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  onAbrirTodoClick() {
    this.showAll = !this.showAll;
    this.fichasPosibles.forEach((ficha: any) => {
      ficha.activa = this.showAll;
    });
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  addDireccion() {
    this.datosDirecciones = [
      ...this.datosDirecciones,
      {
        tipoDireccion: "",
        direccion: "",
        new: true,
        cp: "",
        poblacion: "",
        telefono: "",
        fax: "",
        movil: "",
        email: "",
        preferente: ""
      }
    ];
    this.newDireccion = true;
  }

  isEditar() {
    this.editar = true;
  }

  // onUpload(event) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }

  //   this.msgs = [];
  //   this.msgs.push({ severity: 'info', summary: 'File Uploaded', detail: '' });
  // }
  backTo() {
    this.location.back();
  }
}
