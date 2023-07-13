import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { Message } from "primeng/components/common/api";
import { CatalogoRequestDto } from "../../../../../app/models/CatalogoRequestDto";
import { CatalogoUpdateRequestDto } from "../../../../../app/models/CatalogoUpdateRequestDto";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";
import { SigaServices } from "./../../../../_services/siga.service";
@Component({
  selector: "app-editarCatalogosMaestros",
  templateUrl: "./editarCatalogosMaestros.component.html",
  styleUrls: ["./editarCatalogosMaestros.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class EditarCatalogosMaestrosComponent extends SigaWrapper
  implements OnInit {
  select: any[];
  msgs: Message[] = [];
  body: CatalogoRequestDto = new CatalogoRequestDto();
  checkBody: CatalogoRequestDto = new CatalogoRequestDto();
  upd: CatalogoUpdateRequestDto = new CatalogoUpdateRequestDto();
  textFilter: String;
  editar: boolean = true;
  correcto: boolean = false;
  blockSeleccionar: boolean = false;
  showDatosGenerales: boolean = true;
  //Array de opciones del dropdown
  catalogoArray: any[];
  pButton;
  activacionEditar: boolean;
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }
  @ViewChild("table") table;
  ngOnInit() {
    this.sigaServices.get("maestros_rol").subscribe(
      n => {
        this.catalogoArray = n.comboCatalogoItems;
      },
      err => {
        //console.log(err);
      }
    );


    this.textFilter = "Elegir";
    this.correcto = false;

    this.body = new CatalogoRequestDto();
    this.checkBody = new CatalogoRequestDto();
    this.body = JSON.parse(sessionStorage.getItem("catalogoBody"))[0];
    this.checkBody = JSON.parse(sessionStorage.getItem("catalogoBody"))[0];
    this.activacionEditar = JSON.parse(sessionStorage.getItem("privilegios"));
    sessionStorage.removeItem("catalogoBody");
    sessionStorage.removeItem("privilegios");
  }

  pInputText;

  isEditar() {
    this.upd = new CatalogoUpdateRequestDto();
    this.upd.tabla = this.body.catalogo;
    this.upd.descripcion = this.body.descripcion;
    this.upd.codigoExt = this.body.codigoExt;
    this.upd.idRegistro = this.body.idRegistro;
    this.blockSeleccionar = true;
    this.sigaServices.post("maestros_update", this.upd).subscribe(
      data => {
        this.showSuccess();
        this.correcto = true;
         
        this.correcto = true;
        sessionStorage.setItem(
          "registroAuditoriaUsuariosActualizado",
          JSON.stringify(this.correcto)
        );
      },
      err => {
        this.showFail();
        this.correcto = false;
        //console.log(err);
        sessionStorage.setItem(
          "registroAuditoriaUsuariosActualizado",
          JSON.stringify(this.correcto)
        );
      },
      () => {
        if (this.correcto) {
          this.volver();
        }
      }
    );
  }

  checkIgual() {
    if (
      this.activacionEditar == true &&
      this.body.codigoExt == this.checkBody.codigoExt &&
      this.body.descripcion == this.checkBody.descripcion
    ) {
      return true;
    } else if (
      this.body.codigoExt == this.checkBody.codigoExt &&
      this.body.descripcion == this.checkBody.descripcion
    ) {
      return true;
    } else {
      return false;
    }
  }

  confirmEdit() {
    let mess = this.translateService.instant(
      "general.message.aceptar.y.volver"
    );
    let icon = "fa fa-edit";
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        this.isEditar();
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

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
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
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "general.message.error.realiza.accion"
      )
    });
  }
  volver() {
    this.router.navigate(["/catalogosMaestros"]);
  }

  clear() {
    this.msgs = [];
  }
}
