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

  ngOnInit() {}

  isBuscar() {}
  isHabilitadoBuscar() {}
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
}
