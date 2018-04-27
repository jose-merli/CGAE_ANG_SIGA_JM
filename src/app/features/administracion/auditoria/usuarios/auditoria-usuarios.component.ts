import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";

import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { ConfirmationService } from "primeng/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { USER_VALIDATIONS } from "../../../../properties/val-properties";
import { SigaWrapper } from "../../../../wrapper/wrapper.class";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { Message } from "primeng/components/common/api";
import { esCalendar } from "./../../../../utils/calendar";

import { HistoricoUsuarioDto } from "../../../../models/HistoricoUsuarioDto";
import { HistoricoUsuarioRequestDto } from "../../../../models/HistoricoUsuarioRequestDto";

@Component({
  selector: "app-etiquetas",
  templateUrl: "./auditoria-usuarios.component.html",
  styleUrls: ["./auditoria-usuarios.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AuditoriaUsuarios extends SigaWrapper implements OnInit {
  usuario: any;
  persona: any;
  showDatosGenerales: boolean = true;
  buscarSeleccionado: boolean = false;
  valorCheckUsuarioAutomatico: boolean = false;
  selectedTipoAccion: any;
  tipoAcciones: any[];
  fechaDesdeCalendar: Date;
  fechaHastaCalendar: Date;
  es: any = esCalendar;
  selectedItem: number = 4;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  datosUsuarios: any[];
  bodySearch: HistoricoUsuarioRequestDto = new HistoricoUsuarioRequestDto();
  searchParametros: HistoricoUsuarioDto = new HistoricoUsuarioDto();
  jsonDate: string;
  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) {
    super(USER_VALIDATIONS);
  }

  ngOnInit() {
    this.sigaServices.get("auditoriaUsuarios_tipoAccion").subscribe(
      n => {
        this.tipoAcciones = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );

    this.columnasTabla = [
      {
        field: "idPersona",
        header: "Persona"
      },
      {
        field: "nombre",
        header: "Usuario"
      },
      {
        field: "descTipoCambio",
        header: "Tipo Acción"
      },
      {
        field: "fechaEfectiva",
        header: "Fecha Efectiva"
      },
      {
        field: "motivo",
        header: "Motivo"
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
    this.bodySearch.usuario = this.usuario;
    this.bodySearch.idPersona = this.persona;
    this.bodySearch.idTipoAccion = this.selectedTipoAccion;
    if (this.valorCheckUsuarioAutomatico == true)
      this.bodySearch.usuarioAutomatico = "S";
    else this.bodySearch.usuarioAutomatico = "N";

    this.bodySearch.fechaDesde = this.fechaDesdeCalendar;

    this.bodySearch.fechaHasta = this.fechaHastaCalendar;

    this.sigaServices
      .postPaginado("auditoriaUsuarios_search", "?numPagina=1", this.bodySearch)
      .subscribe(
        data => {
          console.log(data);

          this.searchParametros = JSON.parse(data["body"]);
          this.datosUsuarios = this.searchParametros.historicoUsuarioItem;
        },
        err => {
          console.log(err);
        }
      );
  }
  isHabilitadoBuscar() {}
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  activarPaginacion() {
    if (this.datosUsuarios.length == 0) return false;
    else return true;
  }
}
