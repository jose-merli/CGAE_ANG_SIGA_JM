import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../node_modules/@angular/forms";
import { USER_VALIDATIONS } from "../../properties/val-properties";
import { SigaWrapper } from "../../wrapper/wrapper.class";
import { esCalendar } from "./../../utils/calendar";
import { SigaServices } from "./../../_services/siga.service";
import { Location } from '@angular/common'
import { TranslateService } from '../translate';
import { PersistenceService } from '../../_services/persistence.service';
import { FiltrosBusquedaAsuntosComponent } from "./filtros-busqueda-asuntos/filtros-busqueda-asuntos.component";
import { TablaBusquedaAsuntosComponent } from "./tabla-busqueda-asuntos/tabla-busqueda-asuntos.component";
import { AsuntosJusticiableItem } from "../../models/sjcs/AsuntosJusticiableItem";
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
  body: any[];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: string = "Seleccionar";
  buscar: boolean = false;
  from: boolean = false;

  es: any = esCalendar;
  permisoEscritura: any;
  @ViewChild(FiltrosBusquedaAsuntosComponent) filtros;
  @ViewChild(TablaBusquedaAsuntosComponent) tabla;

  //Diálogo de comunicación
  constructor(
    private sigaServices: SigaServices,
    private formBuilder: FormBuilder,
    private persistenceService: PersistenceService,
    private location: Location,
    private translateService: TranslateService
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
  datos: AsuntosJusticiableItem;

  ngOnInit() {

    if (sessionStorage.getItem('EJG')) {
      this.datos = JSON.parse(sessionStorage.getItem('EJG'));
      this.from = true;
      sessionStorage.removeItem('EJG');
    }

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

  searchEvent(event) {
    this.search(event);
  }

  resetTableEvent(event){
    if(event == true){
      this.body = [];
    }
  }

  searchHistorico(event) {
    this.search(event)
  }

  backTo() {
    this.location.back();
  }



  search(event) {
    this.progressSpinner = true;
    this.selectAll = false;
    this.buscar = true;
    this.selectMultiple = false;

    this.selectedDatos = "";
    this.progressSpinner = true;
    this.buscar = true;

    if (event == 'ejg') {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosEJG",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    }

    if (this.filtros.radioTarjeta == 'des') {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosDesignaciones",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
    }

    if (event == 'soj') {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosSOJ",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    }

    if (event == 'asi') {
      this.sigaServices
        .post(
          "gestionJusticiables_busquedaClaveAsuntosAsistencias",
          this.filtros.filtros
        )
        .subscribe(
          data => {
            this.body = JSON.parse(data.body).asuntosJusticiableItems;
            let error = JSON.parse(data.body).error;
            this.buscar = true;
            this.progressSpinner = false;
            if (error != null && error.description != null) {
              this.showMesg("info", this.translateService.instant("general.message.informacion"), error.description);
            }
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
          }
        );
    }
    this.goToView();
  }

  showMessage(event) {
    this.msgs = [];
    this.msgs.push({
      severity: event.severity,
      summary: event.summary,
      detail: event.msg
    });
  }

  showMesg(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }
  goToView() {
    let view = document.getElementById("tablaBusqueda");
    if (view) {
      view.scrollIntoView();
      view = null;
    }
  }
  clear() {
    this.msgs = [];
  }
}
