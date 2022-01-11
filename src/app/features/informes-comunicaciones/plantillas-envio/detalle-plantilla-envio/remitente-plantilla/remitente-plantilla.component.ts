import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from "@angular/core";
import { DatosRemitentePlantillaItem } from "../../../../../models/DatosRemitentePlantillaItem";
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { PlantillaEnvioItem } from "../../../../../models/PlantillaEnvioItem";
import { Router } from "@angular/router";
import { Message, ConfirmationService } from "primeng/components/common/api";
import { TranslateService } from "../../../../../commons/translate/translation.service";
import { MultiSelect } from 'primeng/multiselect';
@Component({
  selector: "app-remitente-plantilla",
  templateUrl: "./remitente-plantilla.component.html",
  styleUrls: ["./remitente-plantilla.component.scss"]
})
export class RemitentePlantillaComponent implements OnInit, OnDestroy {
  openFicha: boolean = false;
  activacionEditar: boolean = true;
  body: PlantillaEnvioItem = new PlantillaEnvioItem();
  tiposEnvio: any[];
  datos: any[];
  cols: any[];
  first: number = 0;
  selectedItem: number;
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  numSelected: number = 0;
  rowsPerPage: any = [];
  remitente: DatosRemitentePlantillaItem = new DatosRemitentePlantillaItem();
  remitenteInicial: DatosRemitentePlantillaItem = new DatosRemitentePlantillaItem();
  direcciones: any = [];
  direccionesInicial: any = [];
  institucionActual: string;
  showComboDirecciones: boolean = false;
  comboDirecciones: any = [];
  idDireccion: string;
  direccion: any = [];
  contactos: any = [];
  msgs: Message[];
  comboPais: any = [];
  comboProvincia: any = [];
  comboPoblacion: any = [];
  comboTipoDireccion: any = [];
  poblacionBuscada: any = [];
  progressSpinner: boolean = false;
  showDirecciones: boolean = false;
  soloLectura: boolean = false;
  disabledPlantilla: boolean = false;
  cols2: any = [];
  textFilter: String;
  textSelected: String = this.translateService.instant("general.mensaje.0.etiquetas.seleccionadas");
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  @ViewChild("table") table: DataTable;
  selectedDatos;

  fichasPosibles = [
    {
      key: "generales",
      activa: false
    },
    {
      key: "consultas",
      activa: false
    },
    {
      key: "remitente",
      activa: false
    }
  ];

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) { }

  ngOnInit() {

    this.textFilter = this.translateService.instant("general.boton.seleccionar");

    if(sessionStorage.getItem("direccionesInicial") != undefined ){
      this.direccionesInicial = JSON.parse(sessionStorage.getItem("direccionesInicial"));
      sessionStorage.removeItem("direccionesInicial");
    }
    this.getDatos();
    this.getInstitucion();
    this.getComboPais();
    this.getComboProvincias();
    this.getComboTipoDireccion();

    this.selectedItem = 5;

    this.cols = [
      {
        field: "tipo",
        header: "censo.consultaDatosGenerales.literal.tipoCliente"
      },
      {
        field: "valor",
        header: "administracion.parametrosGenerales.literal.valor"
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

    this.cols2 = [
      {
        field: "domicilio",
        header: "solicitudModificacion.especifica.domicilio.literal"
      },
      {
        field: 'movil',
        header: 'censo.datosDireccion.literal.movil'
      },
      {
        field: 'correoElectronico',
        header: 'censo.datosDireccion.literal.correo'
      },
      {
        field: 'codigoPostal',
        header: 'censo.ws.literal.codigopostal'
      }
    ];

    this.datos = [
      { tipo: "censo.ws.literal.telefono", value: "tlf", valor: "" },
      { tipo: "censo.ws.literal.fax", value: "fax", valor: "" },
      { tipo: "censo.datosDireccion.literal.movil", value: "mvl", valor: "" },
      { tipo: "censo.datosDireccion.literal.correo", value: "email", valor: "" },
      { tipo: "solicitudModificacion.especifica.paginaWeb.literal", value: "web", valor: "" }
    ];

    this.comboDirecciones = [
      {
        label: "seleccione..",
        value: null
      }
    ];


    if (this.direccion.idTipoDireccion == null || this.direccion.idTipoDireccion == undefined) {
      this.textFilter = "censo.busquedaClientesAvanzada.literal.sinResultados";
    }
    // this.body.idTipoEnvio = this.tiposEnvio[1].value;

    if(sessionStorage.getItem("disabledPlantillaEnvio") == "true"){
      this.disabledPlantilla  = true;
    }else{
      this.disabledPlantilla = false;
    }
  }

  abreCierraFicha() {
    if (
      sessionStorage.getItem("crearNuevaPlantilla") == null ||
      sessionStorage.getItem("crearNuevaPlantilla") == undefined ||
      sessionStorage.getItem("crearNuevaPlantilla") == "false"
    ) {
      this.openFicha = !this.openFicha;
      if (this.openFicha) {
        this.getDatos();
      }
    }
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isValidCodigoPostal(): boolean {
    return (
      this.remitente.codigoPostal &&
      typeof this.remitente.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(
        this.remitente.codigoPostal
      )
    );
  }

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

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;
      if (this.body.idPersona != null) {
        this.direccion.idPersona = this.body.idPersona;
      }
      this.body = JSON.parse(sessionStorage.getItem('plantillasEnvioSearch'));
      if (this.body != undefined && this.body != null && 
        this.body.idInstitucion == '2000' && this.institucionActual != '2000') {
        if (
          sessionStorage.getItem("soloLectura") != null &&
          sessionStorage.getItem("soloLectura") != undefined &&
          sessionStorage.getItem("soloLectura") == "true"
        ) {
          this.soloLectura = true;
        }
      }

    });
  }

  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));
      this.progressSpinner = true;
      if (sessionStorage.getItem("remitente") != null) {
        this.body.idPersona = JSON.parse(
          sessionStorage.getItem("remitente")
        ).idPersona;
        this.remitente = JSON.parse(sessionStorage.getItem("remitente"));
        this.showDirecciones = true;
        this.openFicha = true;
        if (this.body.idPersona != null && this.body.idPersona != "") {
          sessionStorage.removeItem("abrirNotario");
          this.getPersonaDireccion();
        }
      } else {
        this.getResultados();
      }
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem("remitente");
  }

  getResultados() {
    let objRemitente = {
      idInstitucion: this.body.idInstitucion,
      idTipoEnvios: this.body.idTipoEnvios,
      idPlantillaEnvios: this.body.idPlantillaEnvios
    };
    //llamar al servicio de busqueda
    this.sigaServices
      .post("plantillasEnvio_detalleRemitente", objRemitente)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.remitente = JSON.parse(data["body"]);

          if (
            (this.remitente.direccion != null ||
              this.remitente.direccion != undefined) &&
            this.remitente.direccion.length >= 1
          ) {
            this.direccion = this.remitente.direccion[0];
          }

          this.showComboDirecciones = false;
          this.remitenteInicial = JSON.parse(JSON.stringify(this.remitente));
          this.direccionesInicial = JSON.parse(JSON.stringify(this.direccion));

          let filtro = "";
          this.getComboPoblacionInicial(filtro);
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );
  }
  getPersonaDireccion() {
    //llamar al servicio de busqueda
    this.sigaServices
      .post("plantillasEnvio_personaDireccion", this.body.idPersona)
      .subscribe(
        data => {
          this.remitente = JSON.parse(data["body"]);
          this.progressSpinner = false;
          this.direcciones = this.remitente.direccion;
          this.comboDirecciones = [];
          this.remitenteInicial = JSON.parse(
            sessionStorage.getItem("remitenteInicial")
          );

          if (this.direcciones && this.direcciones.length >= 1) {
            if (this.direcciones.length > 1) {
              this.showComboDirecciones = true;
              this.direcciones.map(direccion => {
                this.comboDirecciones.push({
                  label: direccion.domicilio,
                  value: direccion.idDireccion
                });
                this.direccion = this.remitente.direccion[0];
                this.body.idDireccion = this.direccion.idDireccion;
              });
            } else {
              this.showComboDirecciones = false;
              this.direccion = this.remitente.direccion[0];
            }

            let filtro = "";
            this.getComboPoblacionInicial(filtro);
          }

          if(this.direccionesInicial == undefined || this.direccionesInicial == null || this.direccionesInicial.length > 0){
            this.direccionesInicial = JSON.parse(JSON.stringify(
              this.direccion));
          }
         
          // this.direcciones = this.remitente.direccion;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
        },
        () => { }
      );

  }

  buscar() {
    sessionStorage.setItem("abrirRemitente", "true");
    sessionStorage.setItem(
      "remitenteInicial",
      JSON.stringify(this.remitenteInicial)
    );

    if (this.direcciones && this.direcciones.length >= 1) {
      if (this.direcciones.length > 1) {
        this.showComboDirecciones = true;
        this.direcciones.map(direccion => {
          this.comboDirecciones.push({
            label: direccion.domicilio,
            value: direccion.idDireccion
          });
        });
      } else {
        this.showComboDirecciones = false;
        this.direccion = this.remitente.direccion[0];
      }
    }

    sessionStorage.setItem(
      "direccionesInicial",
      JSON.stringify(this.direccionesInicial)
    );

    sessionStorage.removeItem("menuProcede");
    sessionStorage.removeItem("migaPan");
    sessionStorage.removeItem("migaPan2");

    let migaPan = this.translateService.instant("menu.informesYcomunicaciones.plantillasEnvio");
    let migaPan2 = this.translateService.instant("informesycomunicaciones.plantillasenvio.ficha.plantillaEnvio");
    let menuProcede = this.translateService.instant("menu.informesYcomunicaciones");

    sessionStorage.setItem("migaPan", migaPan);
    sessionStorage.setItem("migaPan2", migaPan2);
    sessionStorage.setItem("menuProcede", menuProcede);

    this.router.navigate(["/busquedaGeneral"]);

  }

  cambiarDireccion(dir) {
    if (dir[0] != undefined) {
      this.direccion = dir[0];
      // this.remitente = dir[0];
      this.showDirecciones = false;
      this.direccionesInicial = dir[0];
      this.remitenteInicial = this.remitente;
    } else {
      this.direccion = dir;
      // this.remitente = dir;
      this.showDirecciones = false;
      // this.direccionesInicial = dir;
      // this.remitenteInicial = this.remitente;
    }
  }

  onChangeDireccion(e) {
    let idDireccion = e.value;
    for (let direccion of this.direcciones) {
      if (idDireccion == direccion.idDireccion) {
        direccion.idDireccion = idDireccion;
        this.direccion = direccion;
      }
    }
  }

  getComboPais() {
    this.sigaServices.get("direcciones_comboPais").subscribe(
      n => {
        this.comboPais = n.combooItems;
      },
      error => { }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
      },
      err => {
        //console.log(err);
      }
    );
  }

  getComboPoblacionInicial(filtro) {
    filtro = "";
    this.poblacionBuscada = filtro;

    this.sigaServices
      .getParam(
        "direcciones_comboPoblacion",
        "?idProvincia=" +
        this.direccion.idProvincia +
        "&filtro=" +
        this.poblacionBuscada
      )
      .subscribe(
        n => {
          this.comboPoblacion = n.combooItems;
        },
        error => { }
      );
  }

  getComboTipoDireccion() {
    this.sigaServices.get("direcciones_comboTipoDireccion").subscribe(
      n => {
        this.comboTipoDireccion = n.combooItems;
      },
      error => { }
    );
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

  showInfo(mensaje: string) {
    this.msgs = [];
    this.msgs.push({ severity: "info", summary: "", detail: mensaje });
  }

  clear() {
    this.msgs = [];
  }

  guardar() {
    let objGuardar = {
      idPersona: this.direccion.idPersona,
      idDireccion: this.direccion.idDireccion,
      idPlantillaEnvios: this.body.idPlantillaEnvios,
      idTipoEnvios: this.body.idTipoEnvios,
      descripcion: this.remitente.descripcion
    };

    this.sigaServices
      .post("plantillasEnvio_guardarRemitente", objGuardar)
      .subscribe(
        data => {
          // this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.remitenteInicial = JSON.parse(JSON.stringify(this.remitente));
          sessionStorage.removeItem("remitente");
          sessionStorage.removeItem("remitenteInicial");
          this.showSuccess(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.correctPlantillaGuardada"
            )
          );
          this.remitenteInicial = JSON.parse(JSON.stringify(this.remitente));
          this.direccionesInicial = JSON.parse(JSON.stringify(this.direccion));
        },
        err => {
          //console.log(err);
          this.showFail(
            this.translateService.instant(
              "informesycomunicaciones.modelosdecomunicacion.ficha.errorPlantillaGuardada"
            )
          );
        },
        () => { }
      );
  }

  restablecer() {
    this.remitente = JSON.parse(JSON.stringify(this.remitenteInicial));
    this.direccion = JSON.parse(JSON.stringify(this.direccionesInicial));
    this.direcciones = this.remitente.direccion;
    // if (this.direcciones && this.direcciones.length >= 1) {
    //   if (this.direcciones.length > 1) {
    //     this.showComboDirecciones = true;
    //     this.direcciones.map(direccion => {
    //       this.comboDirecciones.push({
    //         label: direccion.domicilio,
    //         value: direccion.idDireccion
    //       });
    //       this.direccion = this.remitente.direccion[0];
    //     });
    //   } else {
    //     this.showComboDirecciones = false;
    //     this.direccion = this.remitente.direccion[0];
    //   }
    // }
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}
