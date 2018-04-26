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

@Component({
  selector: "app-etiquetas",
  templateUrl: "./auditoria-usuarios.component.html",
  styleUrls: ["./auditoria-usuarios.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AuditoriaUsuarios extends SigaWrapper implements OnInit {
  usuario: any;
  showDatosGenerales: boolean = true;
  buscarSeleccionado: boolean = false;
  valorCheckParametros: boolean = false;
  selectedTipoAccion: any;
  tipoAcciones: any[];
  fechaDesdeCalendar: Date;
  fechaHastaCalendar: Date;
  es: any = esCalendar;
  selectedItem: number = 4;
  columnasTabla: any = [];
  rowsPerPage: any = [];
  datosUsuarios: any[];

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
        field: "descripcionBusqueda",
        header: "Usuario"
      },
      {
        field: "descripcionTraduccion",
        header: "Tipo Acción"
      },
      {
        field: "descripcionTraduccion",
        header: "Fecha Efectiva"
      },
      {
        field: "descripcionTraduccion",
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

  isBuscar() {}
  isHabilitadoBuscar() {}
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  activarPaginacion() {
    if (this.datosTraduccion.length == 0) return false;
    else return true;
  }
}
