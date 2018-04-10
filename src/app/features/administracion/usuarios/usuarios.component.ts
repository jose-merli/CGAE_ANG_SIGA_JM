import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input
} from "@angular/core";
import { SigaServices } from "./../../../_services/siga.service";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { SelectItem } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { Router } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class Usuarios extends SigaWrapper implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  cols: any = [];
  datos: any[];
  select: any[];
  rowsPerPage: any = [];
  body: UsuarioRequestDto = new UsuarioRequestDto();
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = false;
  buscar: boolean = false;
  selectMultiple: boolean = false;
  selectedItem: number = 4;
  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.sigaServices.get("usuarios_rol").subscribe(n => {
        this.usuarios_rol = n.combooItems;
      }, err => {
        console.log(err);
      });
    this.sigaServices.get("usuarios_perfil").subscribe(n => {
      this.usuarios_perfil = n.combooItems;
    },err => {
        console.log(err);
      });
    this.cols = [
      { field: "nombreApellidos", header: "Nombre y Apellidos" },
      { field: "nif", header: "NIF" },
      { field: "fechaAlta", header: "Fecha de Alta" },
      { field: "rol", header: "Rol" },
      { field: "activo", header: "Activo" },
      { field: "grupo", header: "Grupo" }
    ];

    this.datos = [
      {
        nombreApellidos: "Ana Andrés Maestre",
        nif: "239123",
        fechaAlta: "01/03/2018",
        rol: "rol1",
        activo: "Si",
        grupo: "grupo1"
      },
      {
        nombreApellidos: "Javier Abellan sirvent",
        nif: "12122",
        fechaAlta: "01/03/2018",
        rol: "rol2",
        activo: "Si",
        grupo: "grupo2"
      },
      {
        nombreApellidos: "Ana Andrés Maestre",
        nif: "534",
        fechaAlta: "01/03/2018",
        rol: "rol1",
        activo: "Si",
        grupo: "grupo1"
      },
      {
        nombreApellidos: "Javier Abellan sirvent",
        nif: "1216722",
        fechaAlta: "01/03/2018",
        rol: "rol2",
        activo: "Si",
        grupo: "grupo2"
      },
      {
        nombreApellidos: "Ana Andrés Maestre",
        nif: "2395123",
        fechaAlta: "01/03/2018",
        rol: "rol1",
        activo: "Si",
        grupo: "grupo1"
      },
      {
        nombreApellidos: "Javier Abellan sirvent",
        nif: "12122",
        fechaAlta: "01/03/2018",
        rol: "rol2",
        activo: "Si",
        grupo: "grupo2"
      },
      {
        nombreApellidos: "Ana Andrés Maestre",
        nif: "23913423",
        fechaAlta: "01/03/2018",
        rol: "rol1",
        activo: "Si",
        grupo: "grupo1"
      },
      {
        nombreApellidos: "Javier Abellan sirvent",
        nif: "12125242",
        fechaAlta: "01/03/2018",
        rol: "rol2",
        activo: "Si",
        grupo: "grupo2"
      },
      {
        nombreApellidos: "Ana Andrés Maestre",
        nif: "239187923",
        fechaAlta: "01/03/2018",
        rol: "rol1",
        activo: "Si",
        grupo: "grupo1"
      },
      {
        nombreApellidos: "Javier Abellan sirvent",
        nif: "12123422",
        fechaAlta: "01/03/2018",
        rol: "rol2",
        activo: "Si",
        grupo: "grupo2"
      },
      {
        nombreApellidos: "Ana Andrés Maestre",
        nif: "2391212323",
        fechaAlta: "01/03/2018",
        rol: "rol1",
        activo: "Si",
        grupo: "grupo1"
      },
      {
        nombreApellidos: "Javier Abellan sirvent",
        nif: "1216522",
        fechaAlta: "01/03/2018",
        rol: "rol2",
        activo: "Si",
        grupo: "grupo2"
      }
    ];
    this.rowsPerPage = [
      {
        label: 4,
        value: 4
      },
      {
        label: 6,
        value: 6
      },
      {
        label: "Todo",
        value: this.datos.length
      }
    ];
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  search() {
    console.log("{ UsuarioRequestDto: " + JSON.stringify(this.body) + "}");
    this.sigaServices
      .post(
        "usuarios_search",
        "{ UsuarioRequestDto: " + JSON.stringify(this.body) + "}"
      )
      .subscribe(
        data => {
          console.log(
            "{ UsuarioRequestDto: " + JSON.stringify(this.body) + "}"
          );
        },
        err => {
          console.log("JA JA JA");
        }
      );
  }
  pInputText;
  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
  }
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  isBuscar() {
    this.buscar = true;
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
      this.body = new UsuarioRequestDto();
      this.body = selectedItem[0];
      this.editar = true;
    } else {
      this.cancelar();
    }
    // }
  }

  cancelar() {
    this.editar = false;
    this.body = new UsuarioRequestDto();

    this.table.reset();
  }
}
export class UsuarioRequestDto {
  nombreApellidos: String;
  nif: String;
  fechaAlta: Date;
  rol: String;
  activo: String;
  grupo: String;
  constructor() {}
}
