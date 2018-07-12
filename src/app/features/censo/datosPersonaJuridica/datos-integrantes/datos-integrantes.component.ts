import { Component, OnInit, ViewChild } from "@angular/core";
import { SigaServices } from "./../../../../_services/siga.service";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { DatosIntegrantesItem } from "../../../../models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "../../../../models/DatosIntegrantesObject";
import { DatosPersonaJuridicaComponent } from "../../datosPersonaJuridica/datosPersonaJuridica.component";
import { cardService } from "./../../../../_services/cardSearch.service";
import { Subscription } from "rxjs/Subscription";

/*** COMPONENTES ***/

@Component({
  selector: "app-datos-integrantes",
  templateUrl: "./datos-integrantes.component.html",
  styleUrls: ["./datos-integrantes.component.scss"]
})
export class DatosIntegrantesComponent implements OnInit {
  usuarios_rol: any[];
  usuarios_perfil: any[];
  usuarios_activo: any[];
  cols: any = [];
  datos: any[];
  searchIntegrantes = new DatosIntegrantesObject();
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
  suscripcionBusquedaNuevo: Subscription;

  columnasTabla: any = [];

  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();

  @ViewChild("table") table;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private fichasPosibles: DatosPersonaJuridicaComponent,
    private cardService: cardService
  ) {}

  ngOnInit() {
    this.checkAcceso();

    // Cuando viene de la edición de un integrante
    if (sessionStorage.getItem("editarIntegrante") == "true") {
      let fichaPosible = this.getFichaPosibleByKey("integrantes");
      fichaPosible.activa = !fichaPosible.activa;
      sessionStorage.removeItem("editarIntegrante");
    }

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe(
      id => {
        if (id !== null) {
          this.idPersona = id;
          this.search();
        }
      }
    );
    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
    }
    this.cols = [
      { field: "nifCif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre"
      },
      {
        field: "apellidos",
        header: "gratuita.mantenimientoTablasMaestra.literal.apellidos"
      },
      {
        field: "fechaHistorico",
        header: "administracion.usuarios.literal.fechaAlta"
      },
      { field: "cargo", header: "censo.busquedaComisiones.literal.cargos" },
      {
        field: "liquidacionComoSociedad",
        header: "censo.busquedaClientes.literal.liquidacion"
      },
      {
        field: "ejerciente",
        header: "censo.consultaDatosGenerales.literal.ejerciente"
      },
      {
        field: "capitalSocial",
        header: "censo.consultaComponentesJuridicos.literal.Participacion"
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
    if (sessionStorage.getItem("editarIntegrante") != null) {
      this.abreCierraFicha("integrantes");
    }
    sessionStorage.removeItem("editarIntegrante");
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
      this.numSelected = 0;
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
      this.numSelected = 0;
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    // si no se esta creando una nueva sociedad
    if (sessionStorage.getItem("crearnuevo") == null) {
      fichaPosible.activa = !fichaPosible.activa;
    }
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

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "129";
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

  search() {
    this.historico = false;
    let searchObject = new DatosIntegrantesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = false;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    if (this.idPersona != undefined && this.idPersona != null) {
      this.sigaServices
        .postPaginado("integrantes_search", "?numPagina=1", searchObject)
        .subscribe(
          data => {
            console.log(data);
            this.progressSpinner = false;
            this.searchIntegrantes = JSON.parse(data["body"]);
            this.datos = this.searchIntegrantes.datosIntegrantesItem;
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
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  setItalic(datoH) {
    if (datoH.fechaBajaCargo == null) return false;
    else return true;
  }
  consultarIntegrante(id) {
    if (!this.selectMultiple) {
      var ir = null;
      ir = id[0];
      ir.editar = false;
      sessionStorage.removeItem("integrante");
      sessionStorage.setItem("integrante", JSON.stringify(ir));
      this.router.navigate(["detalleIntegrante"]);
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
  anadirIntegrante() {
    let dummy = {
      integrante: true
    };
    sessionStorage.removeItem("newIntegrante");
    sessionStorage.setItem("newIntegrante", JSON.stringify(dummy));
    this.router.navigate(["/busquedaGeneral"]);
  }
  searchHistorico() {
    this.historico = true;
    let searchObject = new DatosIntegrantesItem();
    searchObject.idPersona = this.idPersona;
    searchObject.historico = true;
    this.buscar = false;
    this.selectMultiple = false;
    this.selectedDatos = "";
    this.progressSpinner = true;
    this.selectAll = false;
    this.sigaServices
      .postPaginado("integrantes_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          console.log(data);
          this.progressSpinner = false;
          this.searchIntegrantes = JSON.parse(data["body"]);
          this.datos = this.searchIntegrantes.datosIntegrantesItem;
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
    let deleteIntegrantes = new DatosIntegrantesObject();
    deleteIntegrantes.datosIntegrantesItem = selectedItem;
    this.sigaServices
      .post("integrantes_delete", deleteIntegrantes.datosIntegrantesItem)
      .subscribe(
        data => {
          console.log(data);
        },
        err => {
          console.log(err);
        },
        () => {
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
}
