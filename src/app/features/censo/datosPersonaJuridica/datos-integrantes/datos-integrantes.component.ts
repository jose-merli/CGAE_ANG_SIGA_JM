import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { Subscription } from "rxjs/Subscription";
import { TranslateService } from "../../../../commons/translate/translation.service";
import { DatosIntegrantesItem } from "../../../../models/DatosIntegrantesItem";
import { DatosIntegrantesObject } from "../../../../models/DatosIntegrantesObject";
import { DatosPersonaJuridicaComponent } from "../../datosPersonaJuridica/datosPersonaJuridica.component";
import { ControlAccesoDto } from "./../../../../../app/models/ControlAccesoDto";
import { CardService } from "./../../../../_services/cardSearch.service";
import { SigaServices } from "./../../../../_services/siga.service";
/*** COMPONENTES ***/

@Component({
  selector: "app-datos-integrantes",
  templateUrl: "./datos-integrantes.component.html",
  styleUrls: ["./datos-integrantes.component.scss"],
  encapsulation: ViewEncapsulation.None,
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
  disabledAction: boolean = false;
  idPersona: String;
  body: DatosIntegrantesItem = new DatosIntegrantesItem();
  datosIntegrantes: DatosIntegrantesObject = new DatosIntegrantesObject();
  suscripcionBusquedaNuevo: Subscription;
  camposDesactivados: boolean;
  columnasTabla: any = [];

  // Obj extras
  body1: DatosIntegrantesItem = new DatosIntegrantesItem();
  body2: DatosIntegrantesItem = new DatosIntegrantesItem();

  @ViewChild("table")
  table;
  selectedDatos;

  isValidate: boolean;

  tarjeta: string;
  @Input() cantidadIntegrantes;
  @Output() cantidadIntegrantesChange = new EventEmitter<any>();
  @Input() openTarjeta;
  @Output() permisosEnlace = new EventEmitter<any>();

  constructor(private sigaServices: SigaServices, private router: Router, private fichasPosibles: DatosPersonaJuridicaComponent, private cardService: CardService, private translateService: TranslateService, private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.checkAcceso();
    sessionStorage.removeItem("newIntegrante");

    // Cuando viene de la edición de un integrante
    if (sessionStorage.getItem("editarIntegrante") == "true") {
      let fichaPosible = this.getFichaPosibleByKey("integrantes");
      fichaPosible.activa = !fichaPosible.activa;
      sessionStorage.removeItem("editarIntegrante");
    }

    if (sessionStorage.getItem("historicoSociedad") != null) {
      this.camposDesactivados = true;
    }

    if (sessionStorage.getItem("disabledAction") == "true") {
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }

    this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    this.suscripcionBusquedaNuevo = this.cardService.searchNewAnnounce$.subscribe((id) => {
      if (id !== null) {
        this.idPersona = id;
        this.search();
      }
    });
    if (this.usuarioBody[0] != undefined) {
      this.idPersona = this.usuarioBody[0].idPersona;
    }
    this.cols = [
      { field: "nifCif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "nombreApel",
        header: "administracion.parametrosGenerales.literal.nombre",
      },
      {
        field: "fechaHistorico",
        header: "administracion.usuarios.literal.fechaAlta",
      },
      { field: "cargo", header: "censo.busquedaComisiones.literal.cargos" },
      {
        field: "ejerciente",
        header: "censo.fichaIntegrantes.literal.estado",
      },
      {
        field: "capitalSocial",
        header: "censo.consultaComponentesJuridicos.literal.Participacion",
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

    this.search();
    if (sessionStorage.getItem("editarIntegrante") != null) {
      this.abreCierraFicha("integrantes");
    }
    sessionStorage.removeItem("editarIntegrante");
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.openTarjeta == "integrantes") {
      this.openFicha = true;
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

  checkAcceso() {
    let controlAcceso = new ControlAccesoDto();
    controlAcceso.idProceso = "231";

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
          let permisos = "integrantes";
          this.permisosEnlace.emit(permisos);
        }
      },
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
      this.sigaServices.postPaginado("integrantes_search", "?numPagina=1", searchObject).subscribe(
        (data) => {
          this.progressSpinner = false;
          this.searchIntegrantes = JSON.parse(data["body"]);
          this.datos = this.searchIntegrantes.datosIntegrantesItem;
          // console.log(this.datos);
          this.cantidadIntegrantesChange.emit(this.datos.length);
          this.datos = this.datos.map((it) => {
            it.nombreApel = it.apellidos.trim() + ", " + it.nombre;
            return it;
          });
          this.comprobarValidacion();
          if (this.datos.length == 1) {
            this.body = this.datos[0];
            this.only = true;
          } else {
            this.only = false;
          }
        },
        (err) => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.progressSpinner = false;
        },
      );
    } else {
      this.progressSpinner = false;
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
    if (this.camposDesactivados != true) {
      if (!this.selectMultiple) {
        if (id[0].fechaBajaCargo != null) {
          sessionStorage.setItem("historicoInt", "true");
        }
        var ir = null;
        ir = id[0];
        ir.editar = false;
        sessionStorage.removeItem("integrante");
        sessionStorage.setItem("integrante", JSON.stringify(ir));

        let dummy = {
          integrante: true,
        };
        sessionStorage.removeItem("newIntegrante");
        sessionStorage.setItem("newIntegrante", JSON.stringify(dummy));

        if (this.tarjeta == "2") {
          sessionStorage.setItem("disabledAction", "true");
        }

        this.router.navigate(["detalleIntegrante"]);
      } else {
        this.numSelected = this.selectedDatos.length;
      }
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
      integrante: true,
    };
    sessionStorage.removeItem("newIntegrante");
    sessionStorage.setItem("newIntegrante", JSON.stringify(dummy));

    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");

    let migaPan = this.translateService.instant("menu.censo.buscarSociedades");
    let menuProcede = this.translateService.instant("menu.censo");
    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("menuProcede", menuProcede);
    sessionStorage.setItem("AddDestinatarioIndv", "true");

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
    this.sigaServices.postPaginado("integrantes_search", "?numPagina=1", searchObject).subscribe(
      (data) => {
        this.progressSpinner = false;
        this.searchIntegrantes = JSON.parse(data["body"]);
        this.datos = this.searchIntegrantes.datosIntegrantesItem;
        this.datos = this.datos.map((it) => {
          it.nombreApel = it.apellidos.trim() + ", " + it.nombre;
          return it;
        });
        this.table.paginator = true;
      },
      (err) => {
        //console.log(err);
        this.progressSpinner = false;
      },
      () => {
        this.progressSpinner = false;
      },
    );
  }

  borrar(selectedItem) {
    let deleteIntegrantes = new DatosIntegrantesObject();
    let integranteBorrar = selectedItem;
    for (let i in integranteBorrar) {
      integranteBorrar[i].fechaCargo = new Date(integranteBorrar[i].fechaCargo);
    }
    deleteIntegrantes.datosIntegrantesItem = integranteBorrar;
    this.sigaServices.post("integrantes_delete", deleteIntegrantes.datosIntegrantesItem).subscribe(
      (data) => {},
      (err) => {
        //console.log(err);
      },
      () => {
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

  comprobarValidacion() {
    //Falta añadir condiciones de profesión (tipo colegio), cargo y socio
    for (let dato of this.datos) {
      if (dato.personaJuridica == "0") {
        if ((dato.nifCif != null || dato.nifCif != undefined) && (dato.nombre != null || dato.nombre != undefined) && (dato.apellidos1 != null || dato.apellidos1 != undefined)) {
          if (dato.cargo != null || dato.cargo != undefined) {
            this.isValidate = true;
            if ((dato.descripcionCargo != null || dato.descripcionCargo != undefined) && (dato.fechaCargo != null || dato.fechaCargo != undefined)) {
              this.isValidate = true;
            } else {
              this.isValidate = false;
            }
          } else {
            this.isValidate = true;
          }
        } else {
          this.isValidate = false;
        }
      } else {
        if (
          (dato.nifCif != null || dato.nifCif != undefined) &&
          (dato.nombre != null || dato.nombre != undefined)
          // && (dato.cargo != null || dato.cargo != undefined)
          // && (dato.descripcionCargo != null || dato.descripcionCargo != undefined) && (dato.fechaCargo != null || dato.fechaCargo != undefined)
        ) {
          this.isValidate = true;
        } else {
          this.isValidate = false;
        }
      }
    }

    this.cardService.newCardValidator$.subscribe((data) => {
      data.map((result) => {
        result.cardIntegrantes = this.isValidate;
      });
      //
    });
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  clickFilaDirecciones(event) {
    if (event.data && !event.data.fechaBaja && this.historico) {
      this.selectedDatos.pop();
    }
  }
}
