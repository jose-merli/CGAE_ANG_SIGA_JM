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
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from "primeng/api";

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
  searchUser: UsuarioResponseDto = new UsuarioResponseDto();
  rowsPerPage: any = [];
  body: UsuarioRequestDto = new UsuarioRequestDto();
  usuariosDelete: UsuarioDeleteRequestDto = new UsuarioDeleteRequestDto();
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  selectMultiple: boolean = false;
  selectedItem: number = 4;
  activo: boolean = false;
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
    this.activo = true;
    this.body = new UsuarioRequestDto();
    this.body.activo = "S";
    this.sigaServices.get("usuarios_rol").subscribe(
      n => {
        this.usuarios_rol = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.sigaServices.get("usuarios_perfil").subscribe(
      n => {
        this.usuarios_perfil = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
    this.cols = [
      { field: "nombreApellidos", header: "Nombre y Apellidos" },
      { field: "nif", header: "NIF" },
      { field: "fechaAlta", header: "Fecha de Alta" },
      { field: "activo", header: "Activo" },
      { field: "roles", header: "Roles" }
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
        label: 8,
        value: 8
      },
      {
        label: 10,
        value: 10
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
    if (this.body.nombreApellidos == undefined) {
      this.body.nombreApellidos = "";
    }
    if (this.body.activo == undefined) {
      this.body.activo = "S";
      this.activo = true;
    }
    if (this.body.grupo == undefined) {
      this.body.grupo = "";
    }
    if (this.body.nif == undefined) {
      this.body.nif = "";
    }
    if (this.body.rol == undefined) {
      this.body.rol = "";
    }
    this.body.idInstitucion = "2000";
    this.sigaServices
      .postPaginado("usuarios_search", "?numPagina=1", this.body)
      .subscribe(
        data => {
          console.log(data);

          this.searchUser = JSON.parse(data["body"]);
          this.datos = this.searchUser.usuarioItem;
        },
        err => {
          console.log(err);
        }
      );
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
      this.body = new UsuarioRequestDto();
      this.body = selectedItem[0];
      this.usuarios_rol.forEach((value: ComboItem, key: number) => {
        if (value.label == selectedItem[0].roles) {
          this.body.rol = value.value;
        }
      });
      this.editar = true;
      this.disabledRadio = false;
    } else {
      this.cancelar();
      this.disabledRadio = true;
    }
    if (this.body.activo == "N") {
      this.activo = true;
    } else {
      this.activo = false;
    }
  }

  cancelar() {
    this.editar = false;
    this.body = new UsuarioRequestDto();
    this.body.activo = "S";
    this.table.reset();
  }

  borrar(selectedItem) {
    this.usuariosDelete = new UsuarioDeleteRequestDto();
    selectedItem.forEach((value: UsuarioItem, key: number) => {
      console.log(value);
      this.usuariosDelete.idUsuario.push(value.idUsuario);
      this.usuariosDelete.activo = value.activo;
      this.usuariosDelete.idInstitucion = "2000";
    });
    this.sigaServices.post("usuarios_delete", this.usuariosDelete).subscribe(
      data => {},
      err => {
        console.log(err);
      },
      () => {
        this.isBuscar();
      }
    );
  }
}

export class UsuarioItem {
  nombreApellidos: String;
  nif: String;
  fechaAlta: Date;
  codigoExterno: String;
  roles: String;
  activo: String;
  perfil: String;
  idUsuario: String;
  idInstitucion: String;
  constructor() {}
}
export class UsuarioResponseDto {
  error: String;
  usuarioItem: UsuarioItem[] = [];
  constructor() {}
}
export class ComboItem {
  label: String;
  value: String;
  constructor() {}
}

export class UsuarioRequestDto {
  nombreApellidos: String;
  nif: String;
  fechaAlta: Date;
  rol: String;
  activo: String;
  grupo: String;
  idInstitucion: "2000";
  constructor() {}
}
export class UsuarioDeleteRequestDto {
  error: String;
  idUsuario: String[] = [];
  activo: String;
  idInstitucion: String;
  constructor() {}
}
