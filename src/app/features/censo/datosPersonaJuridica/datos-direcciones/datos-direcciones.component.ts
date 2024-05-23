import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { DataTable } from "primeng/datatable";
import { Subscription } from "rxjs/Subscription";
import { DatosIntegrantesItem } from "../../../../models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "../../../../models/DatosIntegrantesObject";
import { DatosPersonaJuridicaComponent } from "../../datosPersonaJuridica/datosPersonaJuridica.component";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { DatosDireccionesItem } from "./../../../../../app/models/DatosDireccionesItem";
import { DatosDireccionesObject } from "./../../../../../app/models/DatosDireccionesObject";
import { CardService } from "./../../../../_services/cardSearch.service";
import { SigaServices } from "./../../../../_services/siga.service";

import { TranslateService } from "../../../../commons/translate/translation.service";
@Component({
  selector: "app-datos-direcciones",
  templateUrl: "./datos-direcciones.component.html",
  styleUrls: ["./datos-direcciones.component.scss"],
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
  disabledAction: boolean = false;
  numSelected: number = 0;
  usuarioBody: any[];
  openFicha: boolean = false;
  idPersona: String;
  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();
  camposDesactivados: boolean;
  columnasTabla: any = [];

  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();

  suscripcionBusquedaNuevo: Subscription;

  @ViewChild("table") table: DataTable;
  selectedDatos;

  isValidate: boolean;

  tarjeta: string;
  @Input() openTarjeta;
  @Output() permisosEnlace = new EventEmitter<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef, private sigaServices: SigaServices, private router: Router, private translateService: TranslateService, private fichasPosibles: DatosPersonaJuridicaComponent, private cardService: CardService) {}

  ngOnInit() {
    if (sessionStorage.getItem("editarDirecciones") == "true") {
      let fichaPosible = this.getFichaPosibleByKey("direcciones");
      fichaPosible.activa = true;
      sessionStorage.removeItem("editarDirecciones");
      sessionStorage.removeItem("historicoDir");
    }
    this.checkAcceso();
    this.cols = [
      {
        field: "tipoDireccion",
        header: "censo.datosDireccion.literal.tipo.direccion",
      },
      {
        field: "domicilioLista",
        header: "censo.consultaDirecciones.literal.direccion",
      },
      {
        field: "codigoPostal",
        header: "censo.ws.literal.codigopostal",
      },
      {
        field: "nombrePoblacion",
        header: "censo.consultaDirecciones.literal.poblacion",
      },
      {
        field: "nombreProvincia",
        header: "censo.datosDireccion.literal.provincia",
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono",
      },
      // {
      //   field: "fax",
      //   header: "censo.ws.literal.fax"
      // },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil",
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo",
      },
    ];
    this.rowsPerPage = [
      {
        label: 10,
        value: 10,
      },
      {
        label: 20,
        value: 20,
      },
      {
        label: 30,
        value: 30,
      },
      {
        label: 40,
        value: 40,
      },
    ];
    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
      this.search();
    }
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe((id) => {
      if (id !== null) {
        this.body.idPersona = id;
        this.idPersona = id;
        this.search();
      }
    });
    if (sessionStorage.getItem("historicoSociedad") != null) {
      this.camposDesactivados = true;
    }
    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    let fichaPosible = this.esFichaActiva(this.openTarjeta);
    if (fichaPosible == false) {
      this.abreCierraFicha(this.openTarjeta);
    }
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
    controlAcceso.idProceso = "287";

    this.sigaServices.post("acces_control", controlAcceso).subscribe(
      (data) => {
        let permisos = JSON.parse(data.body);
        let permisosArray = permisos.permisoItems;
        this.tarjeta = permisosArray[0].derechoacceso;
      },
      (err) => {
        //console.log(err);
      },
      () => {
        if (this.tarjeta == "3" || this.tarjeta == "2") {
          let permisos = "direcciones";
          this.permisosEnlace.emit(permisos);
        }
      },
    );
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    // si no se esta creando una nueva sociedad
    if (sessionStorage.getItem("nuevoRegistro") == null) {
      fichaPosible.activa = !fichaPosible.activa;
    }
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.getFichasPosibles().filter((elto) => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  nuevo() {
    let newDireccion = new DatosDireccionesItem();
    sessionStorage.setItem("direccion", JSON.stringify(newDireccion));
    sessionStorage.setItem("permisoTarjeta", "3");
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
    // Se comprueba si hay idpersona para cuando se crea una sociedad (sociedad ya existente)
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices.postPaginado("direcciones_search", "?numPagina=1", searchObject).subscribe(
        (data) => {
          this.progressSpinner = false;
          this.searchDirecciones = JSON.parse(data["body"]);
          this.datos = this.searchDirecciones.datosDireccionesItem;
          if (this.datos.length == 1) {
            this.body = this.datos[0];
            this.only = true;
          } else {
            this.only = false;
          }

          this.comprobarValidacion();
        },
        (err) => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {},
      );
    } else {
      // Sociedad no existente,
      this.progressSpinner = false;
    }
  }
  setItalic(datoH) {
    if (datoH.fechaBaja == null) return false;
    else return true;
  }

  redireccionar(dato) {
    dato = [dato];
    if (this.camposDesactivados != true) {
      if (!this.selectMultiple) {
        if (dato[0].fechaBaja != null) {
          sessionStorage.setItem("historicoDir", "true");
        }
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

        sessionStorage.setItem("permisoTarjeta", this.tarjeta);

        this.router.navigate(["/consultarDatosDirecciones"]);
      } else {
        this.numSelected = this.selectedDatos.length;
      }
    }
  }
  onChangeSelectAll() {
    if (this.selectAll === true) {
      if (this.historico) {
        this.selectMultiple = false;
        this.selectedDatos = this.datos.filter((dato) => dato.fechaBaja != undefined);
        this.numSelected = this.selectedDatos.length;
      } else {
        this.selectMultiple = false;
        this.selectedDatos = this.datos;
        this.numSelected = this.datos.length;
      }
    } else {
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  searchHistorico() {
    this.progressSpinner = true;
    this.historico = true;
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.selectAll = false;
    this.sigaServices.postPaginado("direcciones_search", "?numPagina=1", searchObject).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.searchDirecciones = JSON.parse(data["body"]);
        this.datos = this.searchDirecciones.datosDireccionesItem;
        this.table.paginator = true;
      },
      (err) => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {},
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
      (data) => {},
      (err) => {
        //console.log(err);
      },
      () => {
        this.progressSpinner = false;
        this.editar = false;
        this.dniCorrecto = null;
        this.disabledRadio = false;
        this.search();
      },
    );
  }

  goToDetails(selectedDatos) {
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

  comprobarValidacion() {
    let tipoDireccion = this.datos.map((dato) => {
      return dato.idTipoDireccionList;
    });

    if (tipoDireccion.indexOf("3") != -1) {
      for (let dato of this.datos) {
        if (dato.idTipoDireccionList == "3" && (dato.codigoPostal != null || dato.codigoPostal != undefined) && (dato.nombreProvincia != null || dato.nombreProvincia != undefined) && (dato.nombrePoblacion != null || dato.nombrePoblacion != undefined)) {
          this.isValidate = true;
        }
      }
    } else {
      this.isValidate = false;
    }

    this.cardService.newCardValidator$.subscribe((data) => {
      data.map((result) => {
        result.cardDirecciones = this.isValidate;
      });
    });
  }
  clickFilaDirecciones(event) {
    if (event.data && !event.data.fechaBaja && this.historico) {
      this.selectedDatos.pop();
    }
  }
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
}
