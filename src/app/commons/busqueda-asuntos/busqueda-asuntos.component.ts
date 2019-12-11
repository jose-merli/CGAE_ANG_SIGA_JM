import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../node_modules/@angular/forms";
import { TranslateService } from "../../commons/translate/translation.service";
import { SubtipoCurricularItem } from "../../models/SubtipoCurricularItem";
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaWrapper } from "../../wrapper/wrapper.class";
import { esCalendar } from "./../../utils/calendar";
import { SigaServices } from "./../../_services/siga.service";
import { DialogoComunicacionesItem } from "../../models/DialogoComunicacionItem";
import { ModelosComunicacionesItem } from "../../models/ModelosComunicacionesItem";
import { CommonsService } from '../../_services/commons.service';
import { Location } from '@angular/common'

import { PersistenceService } from '../../_services/persistence.service';
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-asuntos",
  templateUrl: "./busqueda-asuntos.component.html",
  styleUrls: ["./busqueda-asuntos.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaAsuntosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showJusticiable: boolean = true;
  showEJG: boolean = true;
  progressSpinner: boolean = false;
  msgs: any[];
  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: string = "Seleccionar";
  buscar: boolean = false;

  es: any = esCalendar;
  permisoEscritura: any;

  //Diálogo de comunicación
  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private commonsService: CommonsService,
    private persistenceService: PersistenceService,
    private location: Location
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  ngOnInit() {

    // this.commonsService.checkAcceso()
    //   .then(respuesta => {
    //     this.permisoEscritura = respuesta;
    //     this.persistenceService.setPermisos(this.permisoEscritura);

    //     if (this.permisoEscritura == undefined) {
    //       sessionStorage.setItem("codError", "403");
    //       sessionStorage.setItem(
    //         "descError",
    //         this.translateService.instant("generico.error.permiso.denegado")
    //       );
    //       this.router.navigate(["/errorAcceso"]);
    //     }
    //     this.getInstitucion();
    //   }
    //   ).catch(error => console.error(error));

  }


  isOpenReceive(event) {
    this.search(event);
  }

  searchHistorico(event) {
    this.search(event)
  }



  backTo() {
    this.location.back();
  }


  search(event) {
    // this.filtros.filtroAux = this.persistenceService.getFiltrosAux()
    // this.filtros.filtroAux.historico = event;
    // this.persistenceService.setHistorico(event);
    // this.progressSpinner = true;
    // this.sigaServices.post("busquedaProcuradores_searchProcuradoresComp", this.filtros.filtroAux).subscribe(
    //   n => {

    //     this.datos = JSON.parse(n.body).procuradorItems;
    //     this.datos = this.datos.map(it => {
    //       it.nColegiado = +it.nColegiado;
    //       return it;
    //     })
    //     this.buscar = true;
    //     this.progressSpinner = false;
    //     if (this.tabla != null && this.tabla != undefined) {
    //       this.tabla.historico = event;
    //     }
    //     this.resetSelect();
    //   },
    //   err => {
    //     this.progressSpinner = false;
    //     console.log(err);
    //   }
    // );
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }
  clear() {
    this.msgs = [];
  }



}
