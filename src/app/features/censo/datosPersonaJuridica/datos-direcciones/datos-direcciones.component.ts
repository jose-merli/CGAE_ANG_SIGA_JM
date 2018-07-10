import { Router } from "@angular/router";
import { DataTable } from "primeng/datatable";
import { ConfirmationService, Message } from "primeng/components/common/api";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { SigaServices } from "./../../../../_services/siga.service";
import { DatosDireccionesItem } from "./../../../../../app/models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../../../app/models/DatosDireccionesObject";
import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/components/common/messageservice";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { Location } from "@angular/common";
import { DatosIntegrantesItem } from "../../../../models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "../../../../models/DatosIntegrantesObject";
import { DatosPersonaJuridicaComponent } from "../../datosPersonaJuridica/datosPersonaJuridica.component";
import { cardService } from "./../../../../_services/cardSearch.service";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-datos-direcciones",
  templateUrl: "./datos-direcciones.component.html",
  styleUrls: ["./datos-direcciones.component.scss"]
})
export class DatosDireccionesComponent implements OnInit {
  cols: any = [];
  datos: any[];
  searchDirecciones = new DatosDireccionesObject();
  datosActivos: any[];
  select: any[];
  msgs: Message[] = [];
  rowsPerPage: any = [];
  showDatosGenerales: boolean = true;
  pButton;
  historico: boolean = false;
  editar: boolean = false;
  buscar: boolean = false;
  disabledRadio: boolean = false;
  disabled: boolean = false;
  selectMultiple: boolean = false;
  only: boolean = true;
  blockCrear: boolean = true;
  selectedItem: number = 10;
  first: number = 0;
  activo: boolean = false;
  dniCorrecto: boolean;
  controlAcceso: ControlAccesoDto = new ControlAccesoDto();
  permisosTree: any;
  permisosArray: any[];
  derechoAcceso: any;
  activacionEditar: boolean;
  selectAll: boolean = false;
  progressSpinner: boolean = false;
  numSelected: number = 0;
  usuarioBody: any[];
  openFicha: boolean = false;
  idPersona: String;
  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();

  columnasTabla: any = [];

  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();

  suscripcionBusquedaNuevo: Subscription;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private fichasPosibles: DatosPersonaJuridicaComponent,
    private cardService: cardService
  ) {}

  ngOnInit() {
    this.checkAcceso();
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
    }
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null) {
          this.body.idPersona = id;
          this.search();
        }
      }
    );

    this.cols = [
      {
        field: "tipoDireccion",
        header: "censo.datosDireccion.literal.tipo.direccion"
      },
      {
        field: "domicilioLista",
        header: "censo.consultaDirecciones.literal.direccion"
      },
      {
        field: "codigoPostal",
        header: "censo.ws.literal.codigopostal"
      },
      {
        field: "nombrePoblacion",
        header: "censo.consultaDirecciones.literal.poblacion"
      },
      {
        field: "nombreProvincia",
        header: "censo.datosDireccion.literal.provincia"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono"
      },
      {
        field: "fax",
        header: "censo.ws.literal.fax"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo"
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

    this.search();
  }
  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }
  // funciones de relleno de datos fantasmas

  pInputText;

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "122";
    let derechoAcceso;
    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      data => {
        let permisosTree = JSON.parse(data.body);
        let permisosArray = permisosTree.permisoItems;
        derechoAcceso = permisosArray[0].derechoacceso;
      },
      err => {
        console.log(err);
      },
      () => {
        if (derechoAcceso == 3) {
          this.activacionEditar = true;
        } else {
          this.activacionEditar = false;
        }
      }
    );
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = !fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.getFichasPosibles().filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }
  nuevo() {
    let newDireccion = new DatosDireccionesItem();
    sessionStorage.setItem("direccion", JSON.stringify(newDireccion));
    sessionStorage.removeItem("editarDireccion");
    sessionStorage.setItem("editarDireccion", "false");
    this.router.navigate(["/consultarDatosDirecciones"]);
  }
  search() {
    this.historico = false;
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = false;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchDirecciones = JSON.parse(data["body"]);
          this.datos = this.searchDirecciones.datosDireccionesItem;
          if (this.datos.length == 1) {
            this.body = this.datos[0];
            this.only = true;
          } else {
            this.only = false;
          }
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {}
      );
  }
  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  redireccionar(dato) {
    if (!this.selectMultiple && !this.historico) {
      var enviarDatos = null;
      if (dato && dato.length > 0) {
        enviarDatos = dato[0];
        sessionStorage.setItem("idDireccion", enviarDatos.idDireccion);
        sessionStorage.setItem("direccion", JSON.stringify(enviarDatos));
        sessionStorage.removeItem("editarDireccion");
        sessionStorage.setItem("editarDireccion", "true");
      } else {
        sessionStorage.setItem("editar", "false");
      }

      this.router.navigate(["/consultarDatosDirecciones"]);
    } else {
      this.numSelected = this.selectedDatos.length;
    }
  }
  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
      this.numSelected = this.datos.length;
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  searchHistorico() {
    this.historico = true;
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchDirecciones = JSON.parse(data["body"]);
          this.datos = this.searchDirecciones.datosDireccionesItem;
          this.table.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {}
      );
  }

  borrar(selectedItem) {
    this.progressSpinner = true;
    let deleteDirecciones = new DatosDireccionesObject();
    deleteDirecciones.datosDireccionesItem = selectedItem;
    let datosDelete = [];
    selectedItem.forEach((value: DatosDireccionesItem, key: number) => {
      value.idPersona = this.idPersona;
      datosDelete.push(value);
    });

    this.sigaServices.post("direcciones_remove", datosDelete).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.editar = false;
        this.dniCorrecto = null;
        this.disabledRadio = false;
        this.search();
      }
    );
  }
  goToDetails(selectedDatos) {
    console.log(selectedDatos);
    if (!this.selectMultiple) {
      var ir = null;
      if (selectedDatos && selectedDatos.length > 0) {
        ir = selectedDatos[0];
      }
      // sessionStorage.removeItem("integrante");
      // sessionStorage.setItem("integrante", JSON.stringify(ir));
      // this.router.navigate(["detalleIntegrante"]);
    } else {
      this.editar = false;
      this.numSelected = this.selectedDatos.length;
      this.dniCorrecto = null;
    }
  }

  clear() {
    this.msgs = [];
  }
}
