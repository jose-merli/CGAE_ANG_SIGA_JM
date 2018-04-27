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
import { TranslateService } from "../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { ButtonModule } from "primeng/button";
import { Router, ActivatedRoute } from "@angular/router";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { GrowlModule } from "primeng/growl";
import { ConfirmationService } from "primeng/api";
import { MultiSelectModule } from "primeng/multiSelect";
import { Message } from "primeng/components/common/api";
import { MessageService } from "primeng/components/common/messageservice";
import { PerfilItem } from "./../../../../app/models/PerfilItem";
import { PerfilesResponseDto } from "./../../../../app/models/PerfilesResponseDto";
import { PerfilesRequestDto } from "./../../../../app/models/PerfilesRequestDto";
import { ComboItem } from "./../../../../app/models/ComboItem";

@Component({
  selector: "app-perfiles",
  templateUrl: "./perfiles.component.html",
  styleUrls: ["./perfiles.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class PerfilesComponent extends SigaWrapper implements OnInit {
  perfiles_data: any[];
  cols: any = [];
  datos: any[];
  msgs: Message[] = [];
  searchPerfiles: PerfilesResponseDto = new PerfilesResponseDto();
  requestPerfiles: PerfilesRequestDto = new PerfilesRequestDto();
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  editar: boolean = false;
  buscar: boolean = true;
  historicoActive: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  blockCrear: boolean = true;
  selectedItem: number = 4;

  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.isBuscar();

    this.cols = [
      { field: "idGrupo", header: "administracion.grupos.literal.id" },
      { field: "descripcionGrupo", header: "general.description" },
      {
        field: "descripcionRol",
        header: "administracion.usuarios.literal.roles"
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
        label: 8,
        value: 8
      },
      {
        label: 10,
        value: 10
      }
    ];
  }
  isBuscar() {
    this.sigaServices
      .postPaginado("perfiles_search", "?numPagina=1", null)
      .subscribe(
        data => {
          console.log(data);
          this.searchPerfiles = JSON.parse(data["body"]);
          this.datos = this.searchPerfiles.usuarioGrupoItems;
          this.buscar = true;
        },
        err => {
          console.log(err);
        },
        () => {
          this.table.reset();
        }
      );
  }
  onChangeForm() {}

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  pInputText;
  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
  }
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  sendEdit() {
    // this.sigaServices.post("usuarios_update", this.body).subscribe(
    //   data => {
    //     this.showSuccess();
    //     console.log(data);
    //   },
    //   err => {
    //     this.showFail();
    //     console.log(err);
    //   },
    //   () => {
    //     this.cancelar();
    //     this.isBuscar();
    //     this.table.reset();
    //   }
    // );
  }

  editarUsuario(selectedItem) {
    // if (!this.selectMultiple) {
    if (selectedItem.length == 1) {
    } else {
      this.editar = false;
    }
  }

  cancelar() {
    this.editar = false;
  }

  showSuccess() {
    this.msgs = [];
    this.msgs.push({
      severity: "success",
      summary: this.translateService.instant("general.message.correct"),
      detail: this.translateService.instant("general.message.accion.realizada")
    });
  }

  showFail() {
    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: "Error",
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }

  irEditarUsuario(id) {
    if (!this.selectMultiple) {
      var ir = null;
      if (id && id.length > 0) {
        ir = id[0];
      }
      sessionStorage.setItem("perfil", JSON.stringify(id));
      this.router.navigate(["/EditarPerfiles"]);
    } else {
      this.editar = false;
    }
  }
  isEliminar(selectedDatos) {
    this.requestPerfiles = new PerfilesRequestDto();

    this.sigaServices.post("perfiles_delete", this.requestPerfiles).subscribe(
      data => {
        if (selectedDatos == 1) {
          this.msgs = [];
          this.msgs.push({
            severity: "success",
            summary: "Correcto",
            detail: this.translateService.instant("messages.deleted.success")
          });
        } else {
          this.msgs = [];
          this.msgs.push({
            severity: "success",
            summary: "Correcto",
            detail:
              selectedDatos.length +
              this.translateService.instant("messages.deleted.selected.success")
          });
        }
      },
      err => {
        console.log(err);
      },
      () => {
        this.isBuscar();
        this.editar = false;
      }
    );
  }
  historico() {
    this.historicoActive = true;
    this.sigaServices
      .postPaginado("perfiles_historico", "?numPagina=1", null)
      .subscribe(
        data => {
          console.log(data);
          this.searchPerfiles = JSON.parse(data["body"]);
          this.datos = this.searchPerfiles.usuarioGrupoItems;
          this.buscar = false;
        },
        err => {
          console.log(err);
        },
        () => {
          this.table.reset();
        }
      );
  }
  confirmarBorrar(selectedDatos) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";

    if (selectedDatos.length > 1) {
      mess =
        this.translateService.instant("messages.deleteConfirmation.much") +
        selectedDatos.length +
        this.translateService.instant("messages.deleteConfirmation.register") +
        "?";
    }
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEliminar(selectedDatos);
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "Cancel",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }
  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }
}
