import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Router } from "@angular/router";

import { DataTable } from "primeng/datatable";
import { ConfirmationService, Message } from "primeng/components/common/api";

import { TranslateService } from "../../../commons/translate/translation.service";

import { SigaServices } from "./../../../_services/siga.service";

import { DatosDireccionesItem } from "./../../../../app/models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../../app/models/DatosDireccionesObject";

import { cardService } from "./../../../_services/cardSearch.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-datos-direcciones",
  templateUrl: "./datos-direcciones.component.html",
  styleUrls: ["./datos-direcciones.component.scss"]
})
export class DatosDireccionesComponent implements OnInit {
  openFicha: boolean = false;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  historico: boolean = false;

  msgs: Message[];

  cols: any = [];
  rowsPerPage: any = [];

  numSelected: number = 0;
  selectedItem: number = 10;

  body: DatosDireccionesItem = new DatosDireccionesItem();
  bodySearch: DatosDireccionesObject = new DatosDireccionesObject();

  suscripcionBusquedaNuevo: Subscription;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private cardService: cardService
  ) {}

  ngOnInit() {
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null) {
          this.body.idPersona = id;
          this.cargarDatosDirecciones();
        }
      }
    );

    this.cols = [
      {
        field: "tipoDireccion",
        header: "Tipo Dirección"
      },
      {
        field: "direccion",
        header: "Dirección"
      },
      {
        field: "codigoPostal",
        header: "Código Postal"
      },
      {
        field: "poblacion",
        header: "Población"
      },
      {
        field: "provincia",
        header: "Provincia"
      },
      {
        field: "telefono",
        header: "Teléfono"
      },
      {
        field: "fax",
        header: "Fax"
      },
      {
        field: "movil",
        header: "Móvil"
      },
      {
        field: "email",
        header: "Correo electrónico"
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
        label: 30,
        value: 30
      },
      {
        label: 40,
        value: 40
      }
    ];

    // Datos para probar
    this.datosPrueba();
  }

  datosPrueba() {
    this.body.codigoPostal = "35200";
    this.body.direccion = "c/Granadilla, 6";
    this.body.email = "correo@gmail.com";
    this.body.fax = "0998 455879";
    this.body.idDireccion = "1";
    this.body.movil = "654545323";
    this.body.poblacion = "TELDE";
    this.body.telefono = "928456785";
    this.body.tipoDireccion = "despacho";

    this.bodySearch.datosDireccionesItem.push(this.body);
  }

  abrirFicha() {
    this.openFicha = !this.openFicha;
  }

  // Funcionalidades
  cargarDatosDirecciones() {
    this.historico = false;

    if (this.body == undefined) {
      this.body = new DatosDireccionesItem();
    }

    // datos que haya que pasar

    // llamar a buscar otra vez

    if (!this.historico) {
      this.selectMultiple = false;
      this.selectAll = false;
    }
  }

  cargarHistorico() {
    this.historico = true;

    if (this.body == undefined) {
      this.body = new DatosDireccionesItem();
    }

    // datos que haya que pasar

    // llamar a buscar otra vez
  }

  editarDireccion(dato) {}

  confirmarEliminar(dato) {
    let mess = this.translateService.instant("messages.deleteConfirmation");
    let icon = "fa fa-trash-alt";
    console.log("AQUI");
    this.confirmationService.confirm({
      message: mess,
      icon: icon,
      accept: () => {
        // función eliminar pasándole los datos a eliminar
      },
      reject: () => {
        this.msgs = [
          {
            severity: "info",
            summary: "info",
            detail: this.translateService.instant(
              "general.message.accion.cancelada"
            )
          }
        ];
      }
    });
  }

  redireccionar(dato) {
    if (!this.selectMultiple && !this.historico) {
      var enviarDatos = null;
      if (dato && dato.length > 0) {
        enviarDatos = dato[0];
        sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
        sessionStorage.setItem("editar", "true");
      } else {
        sessionStorage.setItem("editar", "false");
      }

      this.router.navigate(["/consultarDatosDirecciones"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }

  // Operaciones de la tabla
  activarPaginacion() {
    if (
      !this.bodySearch.datosDireccionesItem ||
      this.bodySearch.datosDireccionesItem.length == 0
    )
      return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.numSelected = this.bodySearch.datosDireccionesItem.length;
      this.selectMultiple = false;
      this.selectedDatos = this.bodySearch.datosDireccionesItem;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.numSelected = 0;
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  // Mensajes
  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "error", summary: "", detail: mensaje });
  }

  showSuccess(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "success", summary: "", detail: mensaje });
  }
}
