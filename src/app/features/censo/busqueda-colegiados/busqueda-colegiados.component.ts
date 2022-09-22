import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  ElementRef
} from "@angular/core";
import { Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { DataTable } from "primeng/datatable";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "../../../../../node_modules/@angular/forms";
import { TranslateService } from "../../../commons/translate/translation.service";
import { DatosColegiadosItem } from "../../../models/DatosColegiadosItem";
import { DatosColegiadosObject } from "../../../models/DatosColegiadosObject";
import { SubtipoCurricularItem } from "../../../models/SubtipoCurricularItem";
import { USER_VALIDATIONS } from "../../../properties/val-properties";
import { SigaWrapper } from "../../../wrapper/wrapper.class";
import { esCalendar } from "./../../../utils/calendar";
import { SigaServices } from "./../../../_services/siga.service";
import { DialogoComunicacionesItem } from "../../../models/DialogoComunicacionItem";
import { ModelosComunicacionesItem } from "../../../models/ModelosComunicacionesItem";
import { saveAs } from 'file-saver/FileSaver';
import { DatosDireccionesItem } from '../../../models/DatosDireccionesItem';
import { DatosDireccionesObject } from '../../../models/DatosDireccionesObject';
import { OverlayPanelModule, OverlayPanel, MultiSelect } from 'primeng/primeng';
import { CommonsService } from '../../../_services/commons.service';
import { AuthenticationService } from "../../../_services/authentication.service";
import { procesos_censo } from "../../../permisos/procesos_censo";
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: "app-busqueda-colegiados",
  templateUrl: "./busqueda-colegiados.component.html",
  styleUrls: ["./busqueda-colegiados.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaColegiadosComponent extends SigaWrapper implements OnInit {
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = true;
  showDatosGeneneralesAvanzado: boolean = false;
  showDatosDireccion: boolean = false;
  msgsDescarga: any;
  progressSpinner: boolean = false;
  isDisabledPoblacion: boolean = true;
  isDisabledProvincia: boolean = true;
  msgs: any;
  datosDirecciones: DatosDireccionesItem[] = [];
  datosDireccionesHist = new DatosDireccionesObject();
  formBusqueda: FormGroup;
  numSelected: number = 0;
  datos: any[] = [];
  sortO: number = 1;
  selectedItem: number = 10;
  cols: any = [];
  colsADG: any = [];
  rowsPerPage: any = [];
  selectAll: boolean = false;
  selectMultiple: boolean = false;
  textFilter: string = "Seleccionar";
  buscar: boolean = false;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  @ViewChild('someDropdown2') someDropdown2: MultiSelect;
  @ViewChild('someDropdown3') someDropdown3: MultiSelect;
  es: any = esCalendar;
  publicarDatosContacto: boolean;
  editar: boolean = true;
  noResultsSubtipos: boolean = true;
  displayBoolean: boolean = false;
  display: boolean = false;
  comboEtiquetas: any[];
  comboSituacion: any[];
  comboResidencia: any[] = [];
  comboInscrito: any[] = [];
  comboSexo: any[] = [];
  comboEstadoCivil: any[];
  comboCategoriaCurricular: any[];
  comboSubtipoCV: any[];
  comboProvincias: any[];
  comboPoblacion: any[];
  comboTiposDireccion: any[];
  comboTipoCV: any[];
  comboColegios: any[];
  colsDirecciones: any = [];
  selection: String = "multiple";
  textSelected: String = "{0} etiquetas seleccionadas";
  body: DatosColegiadosItem = new DatosColegiadosItem();
  colegiadoSearch = new DatosColegiadosObject();
  subtipoCurricular: SubtipoCurricularItem = new SubtipoCurricularItem();
  @ViewChild('inputNumColegiado') inputNumColegiado: ElementRef;
  siNoResidencia: any;
  siNoInscrito: any;
  selectedEstadoCivil: any;
  selectedCategoriaCurricular: any;
  selectedSubtipoCV: any;
  selectedProvincia: any;
  selectedPoblacion: any;
  selectedTipoDireccion: any;
  resultadosPoblaciones: any;
  historico: boolean;
  @ViewChild('multiSelectSituacion') multiSelectSituacion: MultiSelect;
  fechaIncorporacionHastaSelect: Date;
  fechaIncorporacionDesdeSelect: Date;
  fechaNacimientoHastaSelect: Date;
  fechaNacimientoDesdeSelect: Date;

  //Diálogo de comunicación
  bodyComunicacion: DialogoComunicacionesItem = new DialogoComunicacionesItem();
  first: number = 0;
  clasesComunicaciones: any = [];
  currentRoute: String;
  idClasesComunicacionArray: string[] = [];
  idClaseComunicacion: String;
  keys: any[] = [];
  usuario: any[] = [];
  isConsejo: boolean = false;
  institucionActual: any;
  deshabilitarCombCol: boolean = false;
  colegiosSeleccionados: any[] = [];
  count: string = "";
  countClicado: boolean = false;
  permisoExcel: boolean = false;
  permisoComunicar: boolean = false;

  @HostListener('document:click', ['$event'])
  documentClick(event: MouseEvent) {
    if (!this.countClicado) {
      this.opcount.hide();
      this.countClicado = false;
    } else {
      this.countClicado = false;
    }
  }

  constructor(
    private sigaServices: SigaServices,
    private router: Router,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private _elementRef: ElementRef,
    private authenticationService: AuthenticationService
  ) {
    super(USER_VALIDATIONS);
    this.formBusqueda = this.formBuilder.group({
      nif: new FormControl(null, Validators.minLength(3)),
      nombre: new FormControl(null, Validators.minLength(3)),
      apellidos: new FormControl(null, Validators.minLength(3)),
      numeroColegiado: new FormControl(null, Validators.minLength(3))
    });
  }
  @ViewChild("op")
  op: OverlayPanel;

  @ViewChild("opcount")
  opcount: OverlayPanel;

  @ViewChild("table")
  table: DataTable;
  selectedDatos;

  sessionInfo(){
    console.log("ENTRA")
    console.log("1 -", this.fechaIncorporacionDesdeSelect)
    console.log("2 -", this.fechaIncorporacionHastaSelect)
    console.log("3 -", this.fechaNacimientoDesdeSelect)
    sessionStorage.setItem("esNuevoNoColegiado", JSON.stringify(false));
      sessionStorage.removeItem("personaBody");
      sessionStorage.setItem("esColegiado", "true");
      sessionStorage.setItem(
        "filtrosBusquedaColegiados",
        JSON.stringify(this.body)
      );
      sessionStorage.removeItem("fechaIncorporacionDesdeSelect");
      if (
        this.fechaIncorporacionDesdeSelect != null ||
        this.fechaIncorporacionDesdeSelect != undefined
      ) {
        sessionStorage.setItem(
          "fechaIncorporacionDesdeSelect",
          JSON.stringify(this.fechaIncorporacionDesdeSelect)
        );
      }
      sessionStorage.removeItem("fechaIncorporacionHastaSelect");
      if (
        this.fechaIncorporacionHastaSelect != null ||
        this.fechaIncorporacionHastaSelect != undefined
      ) {
        sessionStorage.setItem(
          "fechaIncorporacionHastaSelect",
          JSON.stringify(this.fechaIncorporacionHastaSelect)
        );
      }


      if (this.fechaNacimientoDesdeSelect != null ||
        this.fechaNacimientoDesdeSelect != undefined) {
        sessionStorage.setItem(
          "fechaNacimientoDesdeSelect",
          JSON.stringify(this.fechaNacimientoDesdeSelect)
        );
      }
      if (this.fechaNacimientoHastaSelect != null ||
        this.fechaNacimientoHastaSelect != undefined) {
        sessionStorage.setItem(
          "fechaNacimientoHastaSelect",
          JSON.stringify(this.fechaNacimientoHastaSelect)
        );
      }
    
  }
  ngOnInit() {
    
    this.commonsService.checkAcceso(procesos_censo.generarExcel)
      .then(respuesta => {
        if(respuesta != undefined){
          this.permisoExcel = respuesta;
        }
      }).catch(error => console.error(error));

    this.commonsService.checkAcceso(procesos_censo.comunicar)
      .then(respuesta => {
        if(respuesta != undefined){
          this.permisoComunicar = respuesta;
        }
      }).catch(error => console.error(error));

    sessionStorage.removeItem('consultasSearch');

    this.currentRoute = this.router.url;
    this.progressSpinner = true;
    this.getCombos();

    if (sessionStorage.getItem('descargasPendientes') == undefined) {
      sessionStorage.setItem('descargasPendientes', '0');
    }

    // sessionStorage.removeItem("esColegiado");
    sessionStorage.removeItem("disabledAction");
    sessionStorage.removeItem("busqueda");

    let idInstitucion = this.authenticationService.getInstitucionSession();
    console.log(idInstitucion);
    if (idInstitucion > 3000 || idInstitucion == 2000) {
       this.isConsejo = true;
       console.log(idInstitucion);
    }

    if (sessionStorage.getItem("fechaIncorporacionHastaSelect") != null) {
      this.fechaIncorporacionHastaSelect = new Date(
        JSON.parse(sessionStorage.getItem("fechaIncorporacionHastaSelect"))
      );
      sessionStorage.removeItem("fechaIncorporacionHastaSelect");
    }
    if (sessionStorage.getItem("fechaIncorporacionDesdeSelect") != null) {
      this.fechaIncorporacionDesdeSelect = new Date(
        JSON.parse(sessionStorage.getItem("fechaIncorporacionDesdeSelect"))
      );
      sessionStorage.removeItem("fechaIncorporacionDesdeSelect");
    }

    if (sessionStorage.getItem("fechaNacimientoDesdeSelect") != null) {
      this.fechaNacimientoDesdeSelect = new Date(
        JSON.parse(sessionStorage.getItem("fechaNacimientoDesdeSelect"))
      );
      sessionStorage.removeItem("fechaNacimientoDesdeSelect");
    }
    if (sessionStorage.getItem("fechaNacimientoHastaSelect") != null) {
      this.fechaNacimientoHastaSelect = new Date(
        JSON.parse(sessionStorage.getItem("fechaNacimientoHastaSelect"))
      );
      sessionStorage.removeItem("fechaNacimientoHastaSelect");
    }

    if (
      sessionStorage.getItem("filtrosBusquedaColegiadosFichaColegial") != null
    ) {
      this.body = JSON.parse(
        sessionStorage.getItem("filtrosBusquedaColegiadosFichaColegial")
      );

      sessionStorage.removeItem("filtrosBusquedaColegiadosFichaColegial");

    }

    if (this.body.tipoCV != undefined) {
      this.getComboSubtipoCurricular(this.body.tipoCV);
      this.getComboTipoCurricular(this.body.tipoCV);
    }
    this.colsDirecciones = [
      {
        field: "tipoDireccion",
        header: "censo.datosDireccion.literal.tipo.direccion",
        width: "17%"
      },
      {
        field: "domicilioLista",
        header: "censo.consultaDirecciones.literal.direccion",
        width: "10%"
      },
      {
        field: "codigoPostal",
        header: "censo.ws.literal.codigopostal",
        width: "5%"
      },
      {
        field: "nombrePoblacion",
        header: "censo.consultaDirecciones.literal.poblacion",
        width: "8%"
      },
      {
        field: "nombreProvincia",
        header: "censo.datosDireccion.literal.provincia",
        width: "10%"
      },
      {
        field: "telefono",
        header: "censo.ws.literal.telefono",
        width: "7%"
      },
      {
        field: "movil",
        header: "censo.datosDireccion.literal.movil",
        width: "7%"
      },
      {
        field: "correoElectronico",
        header: "censo.datosDireccion.literal.correo",
        width: "15%"
      }
    ];
    this.selection = "multiple";

    setTimeout(() => {
      this.inputNumColegiado.nativeElement.focus();  
    }, 300);
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
    if(this.showDatosColegiales){
      setTimeout(() => {
        this.inputNumColegiado.nativeElement.focus();  
      }, 300);
    }
  }

  onHideDatosGeneralesAvanzados() {
    this.showDatosGeneneralesAvanzado = !this.showDatosGeneneralesAvanzado;
  }

  onHideDireccion() {
    this.showDatosDireccion = !this.showDatosDireccion;
  }

  irEditarColegiado(id) {
    id = [id]
     if (id.length >= 1) {
      // orden es, fallecido, colegiado, de baja, no colegiado
      this.getSituacion(id);

      this.sigaServices
        .post("busquedaColegiados_searchColegiadoFicha", id[0])
        .subscribe(
          data => {
            // this.colegiadoItem = datosColegiadosItem = new DatosColegiadosItem();
            let colegiadoItem = JSON.parse(data.body);
            sessionStorage.setItem("personaBody", JSON.stringify(colegiadoItem.colegiadoItem[0]));

            // if (id[0].situacion == 30) {
            //   sessionStorage.setItem("disabledAction", "true");
            // } else {
            sessionStorage.setItem("disabledAction", "false");
            // }

            this.router.navigate(["/fichaColegial"]);
          },
          err => {
            console.log(err);
          },

        );
    } else {
      this.actualizaSeleccionados(this.selectedDatos);
    }

  }

  getSituacion(id) {
    let idSituacionValues = [];
    this.datos.forEach(element => {
      idSituacionValues.push(element.situacion);
    });

    if (idSituacionValues.indexOf("60") != -1) {
      id[0].situacion = "60";
    } else {
      if (idSituacionValues.indexOf("20") != -1) {
        id[0].situacion = "20";
      } else {
        if (idSituacionValues.indexOf("30") == -1 || idSituacionValues.indexOf("40") == -1 || idSituacionValues.indexOf("50") == -1) {
          if (idSituacionValues.indexOf("10") != -1) {
            id[0].situacion = "10";
          }
        }
      }
    }
  }

  actualizaSeleccionados(selectedDatos) {
    this.numSelected = selectedDatos.length;
  }

  activarPaginacion() {
    if (!this.datos || this.datos.length == 0) return false;
    else return true;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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

  getComboPoblacion(dataFilter) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_poblacion",
        "?idProvincia=" + this.body.idProvincia + "&dataFilter=" + dataFilter
      )
      .subscribe(
        n => {
          this.isDisabledPoblacion = false;
          this.comboPoblacion = n.combooItems;
        },
        error => { },
        () => { }
      );
  }

  onChangeCodigoPostal(event) {
    if (this.isValidCodigoPostal() && this.body.codigoPostal.length == 5) {
      let value = this.body.codigoPostal.substring(0, 2);
      if (
        value != this.body.idProvincia ||
        this.body.idProvincia == undefined
      ) {
        this.body.idProvincia = value;
        this.comboPoblacion = [];
        this.isDisabledPoblacion = false;
      }
    }
  }

  buscarPoblacion(e) {
    if (e.target.value && e.target.value !== null && e.target.value !== "") {
      if (e.target.value.length >= 3) {
        this.getComboPoblacion(e.target.value);
        this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
      } else {
        this.comboPoblacion = [];
        this.resultadosPoblaciones = this.translateService.instant("censo.consultarDirecciones.mensaje.introducir.almenosTres");
      }
    } else {
      this.comboPoblacion = [];
      this.resultadosPoblaciones = this.translateService.instant("censo.busquedaClientesAvanzada.literal.sinResultados");
    }
  }

  isValidCodigoPostal(): boolean {
    return (
      this.body.codigoPostal &&
      typeof this.body.codigoPostal === "string" &&
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.body.codigoPostal)
    );
  }

  arregloTildesCombo(combo) {
    combo.map(e => {
      let accents =
        "ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž";
      let accentsOut =
        "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
      let i;
      let x;
      for (i = 0; i < e.label.length; i++) {
        if ((x = accents.indexOf(e.label[i])) != -1) {
          e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
          return e.labelSinTilde;
        }
      }
    });
  }

  getCombos() {
    this.getComboColegios();
    this.getComboEtiquetas();
    this.getComboSituacion();
    this.getComboResidencia();
    this.getComboInscrito();
    this.getComboSexo();
    this.getComboEstadoCivil();
    this.getComboCategoriaCurricular();
    this.getComboProvincias();
    this.getComboTiposDireccion();

  }

  getComboColegios() {
    // obtener colegios
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      this.sigaServices.getParam(
        "busquedaCol_colegio",
        "?idInstitucion=" + this.institucionActual
      )
        .subscribe(
          col => {
            this.comboColegios = col.combooItems;
            // this.arregloTildesCombo(this.comboColegios);

            if (
              this.body != undefined && this.body != null && this.body.colegio != undefined &&
              this.body.colegio != null
            ) {
              this.body.colegio.forEach(element => {

                this.getInstitucion();
                let labelColegio = this.comboColegios.find(
                  item => item.value === element
                ).label;

                this.colegiosSeleccionados.push({
                  label: labelColegio,
                  value: element
                });

                this.progressSpinner = false;
              });
              this.isBuscar();

            }
            else {
              if (this.institucionActual > "2000" && this.institucionActual < "2100") {
                this.colegiosSeleccionados = [
                  {
                    label: n.label,
                    value: this.institucionActual
                  }
                ];
                this.deshabilitarCombCol = true;
              }
              this.progressSpinner = false;

            }
          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          }
        );
    });
  }

  getComboEtiquetas() {
    // obtener etiquetas
    this.sigaServices.get("busquedaColegiado_etiquetas").subscribe(
      n => {
        this.comboEtiquetas = [];
        let array = n.comboItems;

        array.forEach(element => {
          let e = { label: element.label, value: { label: element.label, value: element.value, idInstitucion: element.idInstitucion } };
          this.comboEtiquetas.push(e);
        });

        this.arregloTildesCombo(this.comboEtiquetas);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboSituacion() {
    this.sigaServices.get("busquedaColegiados_situacion").subscribe(
      n => {
        this.comboSituacion = n.combooItems;
        this.arregloTildesCombo(this.comboSituacion);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboResidencia() {
    this.comboResidencia = [
      { label: "No", value: 0 },
      { label: "Sí", value: 1 }
    ];

    this.arregloTildesCombo(this.comboResidencia);
  }

  getComboInscrito() {
    this.comboInscrito = [{ label: "No", value: 0 }, { label: "Sí", value: 1 }];

    this.arregloTildesCombo(this.comboInscrito);
  }
  getComboSexo() {
    this.comboSexo = [
      { label: "Hombre", value: "H" },
      { label: "Mujer", value: "M" }
    ];
  }

  getComboEstadoCivil() {
    this.sigaServices.get("busquedaColegiados_estadoCivil").subscribe(
      n => {
        this.comboEstadoCivil = n.combooItems;
        this.arregloTildesCombo(this.comboEstadoCivil);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboCategoriaCurricular() {
    this.sigaServices.get("busquedaColegiados_categoriaCurricular").subscribe(
      n => {
        this.comboCategoriaCurricular = n.combooItems;
        this.arregloTildesCombo(this.comboCategoriaCurricular);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboProvincias() {
    this.sigaServices.get("busquedaColegiados_provincias").subscribe(
      n => {
        this.comboProvincias = n.combooItems;
        this.arregloTildesCombo(this.comboProvincias);
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboTiposDireccion() {
    this.sigaServices.get("busquedaColegiados_tipoDireccion").subscribe(
      n => {
        this.comboTiposDireccion = n.combooItems;
        this.arregloTildesCombo(this.comboTiposDireccion);
      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeCategoriaCurricular(event) {
    if (event.value != null) {
      if (event) {
        this.getComboSubtipoCurricular(event.value);
        this.getComboTipoCurricular(event.value);
      }
    }
  }

  //TipoCurricular
  getComboTipoCurricular(idTipoCV) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_getCurricularTypeCombo",
        "?idTipoCV=" + idTipoCV
      )
      .subscribe(
        n => {
          this.comboTipoCV = n.combooItems;
          this.arregloTildesCombo(this.comboTipoCV);
        },
        error => { },
        () => { }
      );
  }

  //SubtipoCurricular
  getComboSubtipoCurricular(idTipoCV) {
    this.sigaServices
      .getParam(
        "busquedaColegiados_getCurricularSubtypeCombo",
        "?idTipoCV=" + idTipoCV
      )
      .subscribe(
        n => {
          this.comboSubtipoCV = n.combooItems;
          this.arregloTildesCombo(this.comboSubtipoCV);
        },
        error => { },
        () => { }
      );
  }

  isBuscarCount(event) {

    this.body.searchCount = true;
    if (this.checkFilters()) {
      this.selectAll = false;
      this.historico = false;
      this.selectMultiple = false;

      this.selectedDatos = "";
      this.getColsResults();
      this.filtrosTrim();
      this.progressSpinner = true;

      this.body.fechaIncorporacion = [];
      this.body.fechaIncorporacion[1] = this.fechaIncorporacionHastaSelect;
      this.body.fechaIncorporacion[0] = this.fechaIncorporacionDesdeSelect;

      this.body.fechaNacimientoRango = [];
      this.body.fechaNacimientoRango[1] = this.fechaNacimientoHastaSelect;
      this.body.fechaNacimientoRango[0] = this.fechaNacimientoDesdeSelect;

      this.body.colegio = [];
      this.colegiosSeleccionados.forEach(element => {
        this.body.colegio.push(element.value);
      });

      this.sigaServices
        .postPaginado(
          "busquedaColegiados_searchColegiado",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            let colegiadoSearch = JSON.parse(data["body"]);
            let datos = colegiadoSearch.colegiadoItem;
            this.body.searchCount = false;
            this.progressSpinner = false;

            this.msgs = [];
            this.count = datos[0].count.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            this.opcount.toggle(event);
            // this.msgCount.push({
            //   severity: "info",
            //   summary: this.translateService.instant("general.message.informacion"),
            //   detail: this.translateService.instant("general.texto.encontrados") + " " + datos[0].count.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " " + this.translateService.instant("general.texto.colegiados")
            // });
          },
          err => {
            this.body.searchCount = false;
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.body.searchCount = false;
            this.progressSpinner = false;
          }
        );
    }
  }
  //Busca colegiados según los filtros
  isBuscar() {
    this.opcount.hide();
    this.body.searchCount = false;
    if (this.checkFilters()) {
      this.selectAll = false;
      this.historico = false;
      this.buscar = true;
      this.selectMultiple = false;

      this.selectedDatos = "";
      this.getColsResults();
      this.filtrosTrim();
      this.progressSpinner = true;
      this.buscar = true;

      this.body.fechaIncorporacion = [];
      this.body.fechaIncorporacion[1] = this.fechaIncorporacionHastaSelect;
      this.body.fechaIncorporacion[0] = this.fechaIncorporacionDesdeSelect;

      this.body.fechaNacimientoRango = [];
      this.body.fechaNacimientoRango[1] = this.fechaNacimientoHastaSelect;
      this.body.fechaNacimientoRango[0] = this.fechaNacimientoDesdeSelect;

      // if (
      //   this.fechaNacimientoSelect != undefined ||
      //   this.fechaNacimientoSelect != null
      // ) {
      //   this.body.fechaNacimiento = this.fechaNacimientoSelect;
      // } else {
      //   this.body.fechaNacimiento = undefined;
      // }

      this.body.colegio = [];
      this.colegiosSeleccionados.forEach(element => {
        this.body.colegio.push(element.value);
      });

      this.sigaServices
        .postPaginado(
          "busquedaColegiados_searchColegiado",
          "?numPagina=1",
          this.body
        )
        .subscribe(
          data => {
            this.progressSpinner = false;
            let error = JSON.parse(data["body"]).error;
            this.colegiadoSearch = JSON.parse(data["body"]);
            this.datos = this.colegiadoSearch.colegiadoItem;
            this.convertirStringADate(this.datos);
            // this.table.paginator = true;
            this.body.fechaIncorporacion = [];
            if (error != null && error.description != null) {
              this.showMessageError("info", this.translateService.instant("general.message.informacion"), error.description);
            }

          },
          err => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            setTimeout(() => {
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
    }
    this.sessionInfo();
  }

  convertirStringADate(datos) {
    datos.forEach(element => {
      if (element.fechaNacimiento == "" || element.fechaNacimiento == null) {
        element.fechaNacimientoDate = null;
      } else {
        var posIni = element.fechaNacimiento.indexOf("/");
        var posFin = element.fechaNacimiento.lastIndexOf("/");
        var year = element.fechaNacimiento.substring(posFin + 1);
        var day = element.fechaNacimiento.substring(0, posIni);
        var month = element.fechaNacimiento.substring(posIni + 1, posFin);
        element.fechaNacimientoDate = new Date(year, month - 1, day);
        element.fechaNacimiento = day + "/" + month + "/" + year;
      }
      if (element.incorporacion == "" || element.incorporacion == null) {
        element.incorporacion = null;
      } else {
        var posIni = element.incorporacion.indexOf("/");
        var posFin = element.incorporacion.lastIndexOf("/");
        var year = element.incorporacion.substring(posFin + 1);
        var day = element.incorporacion.substring(0, posIni);
        var month = element.incorporacion.substring(posIni + 1, posFin);
        element.incorporacionDate = new Date(year, month - 1, day);
        element.incorporacion = day + "/" + month + "/" + year;
      }
      if (element.fechaEstadoStr == "" || element.fechaEstadoStr == null) {
        element.fechaEstadoStr = null;
      } else {
        var posIni = element.fechaEstadoStr.indexOf("-");
        var posFin = element.fechaEstadoStr.lastIndexOf("-");
        var day = element.fechaEstadoStr.substring(posFin+1, posFin+3);
        var year = element.fechaEstadoStr.substring(0, posIni);
        var month = element.fechaEstadoStr.substring(posIni + 1, posFin);
        element.fechaEstadoDate = new Date(year, month - 1, day);
        element.fechaEstadoStr = day + "/" + month + "/" + year;
      }

    });

  }

  isLimpiar() {
    this.opcount.hide();
    this.body = new DatosColegiadosItem();
    this.comboSubtipoCV = [];
    this.fechaIncorporacionDesdeSelect = undefined;
    this.fechaIncorporacionHastaSelect = undefined;
    this.fechaNacimientoDesdeSelect = undefined;
    this.fechaNacimientoHastaSelect = undefined;

    if (!this.deshabilitarCombCol) {
      this.colegiosSeleccionados = [];
    }
  }

  //Elimina los espacios en blancos finales e iniciales de los inputs de los filtros
  filtrosTrim() {
    if (this.body.nif != null) {
      this.body.nif = this.body.nif.trim();
    }

    if (this.body.apellidos != null) {
      this.body.apellidos = this.body.apellidos.trim();
    }

    if (this.body.nombre != null) {
      this.body.nombre = this.body.nombre.trim();
    }

    if (this.body.numColegiado != null) {
      this.body.numColegiado = this.body.numColegiado.trim();
    }

    if (this.body.codigoPostal != null) {
      this.body.codigoPostal = this.body.codigoPostal.trim();
    }

    if (this.body.correo != null) {
      this.body.correo = this.body.correo.trim();
    }

    if (this.body.movil != null) {
      this.body.movil = this.body.movil.trim();
    }

    if (this.body.telefono != null) {
      this.body.telefono = this.body.telefono.trim();
    }
  }

  getColsResults() {
    this.cols = [
      {
        field: "colegioResultado",
        header: "censo.busquedaClientesAvanzada.literal.colegio",
        width: "5%"
      },
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden",
        width: "8%"

      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre",
        width: "15%"
      },
      {
        field: "numberColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado",
        width: "7%"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaCliente.situacion.cabecera",
        width: "7%"
      },
      {
        field: "fechaEstadoDate",
        header: "censo.consultaDatosGenerales.literal.fechaSituacion",
        width: "7%"
      },
      {
        field: "incorporacionDate",
        header: "censo.consultaDatosGenerales.literal.fechaIncorporacion",
        width: "7%"
      },
      {
        field: "situacionResidente",
        header: "censo.busquedaClientes.noResidente",
        filter: "situacionResidenteFilter",
        width: "7%"
      },
      {
        field: "noAparecerRedAbogacia2",
        header: "censo.busquedaColegial.lopd",
        filter: "noAparecerRedAbogaciaFilter",
        width: "8%"
      }
    ];

    this.colsADG = [
      {
        field: "nif",
        header: "censo.consultaDatosColegiacion.literal.numIden",
        width: "8%"

      },
      {
        field: "nombre",
        header: "administracion.parametrosGenerales.literal.nombre",
        width: "15%"
      },
      {
        field: "numberColegiado",
        header: "censo.busquedaClientesAvanzada.literal.nColegiado",
        width: "7%"
      },
      {
        field: "estadoColegial",
        header: "censo.fichaCliente.situacion.cabecera",
        width: "7%"
      },
      {
        field: "fechaEstadoDate",
        header: "censo.consultaDatosGenerales.literal.fechaSituacion",
        width: "7%"
      },
      {
        field: "incorporacionDate",
        header: "censo.consultaDatosGenerales.literal.fechaIncorporacion",
        width: "7%"
      },
      {
        field: "situacionResidente",
        header: "censo.busquedaClientes.noResidente",
        filter: "situacionResidenteFilter",
        width: "7%"
      },
      {
        field: "noAparecerRedAbogacia2",
        header: "censo.busquedaColegial.lopd",
        filter: "noAparecerRedAbogaciaFilter",
        width: "8%"
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
  }

  clear() {
    this.msgs = [];
  }

  checkFilters() {
    if (
      (this.body.nombre == null ||
        this.body.nombre == null ||
        this.body.nombre.trim().length < 3) &&
      (this.body.domicilio == null ||
        this.body.domicilio == null ||
        this.body.domicilio.trim().length < 3) &&
      (this.body.apellidos == null ||
        this.body.apellidos == null ||
        this.body.apellidos.trim().length < 3) &&
      (this.body.numColegiado == null ||
        this.body.numColegiado == null) &&
      (this.body.codigoPostal == null ||
        this.body.codigoPostal == null ||
        this.body.codigoPostal.trim().length < 3) &&
      (this.body.nif == null ||
        this.body.nif == null ||
        this.body.nif.trim().length < 3) &&
      (this.body.correo == null ||
        this.body.correo == null ||
        this.body.correo.trim().length < 3) &&
      (this.body.movil == null ||
        this.body.movil == null ||
        this.body.movil.trim().length < 3) &&
      (this.body.telefono == null ||
        this.body.telefono == null ||
        this.body.telefono.trim().length < 3) &&
      (this.body.idgrupo == undefined ||
        this.body.idgrupo == null ||
        this.body.idgrupo.length < 1) &&
      (this.fechaIncorporacionDesdeSelect == undefined ||
        this.fechaIncorporacionDesdeSelect == null) &&
      (this.fechaIncorporacionHastaSelect == undefined ||
        this.fechaIncorporacionHastaSelect == null) &&
      (this.body.situaciones == undefined || this.body.situaciones == null || this.body.situaciones.length == 0) &&
      (this.body.residencia == undefined || this.body.residencia == null) &&
      (this.body.inscrito == undefined || this.body.inscrito == null) &&
      (this.body.sexo == undefined || this.body.sexo == null) &&
      (this.body.idEstadoCivil == undefined ||
        this.body.idEstadoCivil == null) &&
      (this.fechaNacimientoDesdeSelect == undefined ||
        this.fechaNacimientoDesdeSelect == null) &&
      (this.fechaNacimientoHastaSelect == undefined ||
        this.fechaNacimientoHastaSelect == null) &&
      (this.body.tipoCV == undefined || this.body.tipoCV == null) &&
      (this.body.subtipoCV == undefined ||
        this.body.subtipoCV == null ||
        this.body.subtipoCV.length < 1) &&
      (this.body.tipoDireccion == undefined || this.body.tipoDireccion == null)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.domicilio != undefined) {
        this.body.domicilio = this.body.domicilio.trim();
      }
      if (this.body.apellidos != undefined) {
        this.body.apellidos = this.body.apellidos.trim();
      }
      if (this.body.numColegiado != undefined) {
        this.body.numColegiado = this.body.numColegiado.trim();
      }
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }
      return true;
    }
  }

  showSearchIncorrect() {

    this.msgs = [];
    this.msgs.push({
      severity: "error",
      summary: this.translateService.instant("general.message.incorrect"),
      detail: this.translateService.instant(
        "cen.busqueda.error.busquedageneral"
      )
    });
  }

  isDisabledCombos() {
    if (this.body.tipoCV != "" && this.body.tipoCV != null) {
      return false;
    } else {
      return true;
    }
  }

  //búsqueda con enter
  @HostListener("document:keypress", ["$event"])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  navigateComunicar(dato) {
    sessionStorage.setItem("rutaComunicacion", this.currentRoute.toString());
    //IDMODULO de CENSO es 3
    sessionStorage.setItem("idModulo", '3');
    sessionStorage.setItem("filtrosBusquedaColegiadosFichaColegial", JSON.stringify(this.body));

    this.getDatosComunicar();
  }

  onRowSelectModelos() { }

  getKeysClaseComunicacion() {
    this.sigaServices.post("dialogo_keys", this.idClaseComunicacion).subscribe(
      data => {
        this.keys = JSON.parse(data["body"]);
      },
      err => {
        console.log(err);
      }
    );
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices
      .post("dialogo_claseComunicacion", rutaClaseComunicacion)
      .subscribe(
        data => {
          this.idClaseComunicacion = JSON.parse(
            data["body"]
          ).clasesComunicaciones[0].idClaseComunicacion;
          this.sigaServices
            .post("dialogo_keys", this.idClaseComunicacion)
            .subscribe(
              data => {
                this.keys = JSON.parse(data["body"]).keysItem;
                this.selectedDatos.forEach(element => {
                  let keysValues = [];
                  this.keys.forEach(key => {
                    if (element[key.nombre] != undefined) {
                      keysValues.push(element[key.nombre]);
                    }
                  });
                  datosSeleccionados.push(keysValues);
                });

                sessionStorage.setItem(
                  "datosComunicar",
                  JSON.stringify(datosSeleccionados)
                );
                this.router.navigate(["/dialogoComunicaciones"]);
              },
              err => {
                console.log(err);
              }
            );
        },
        err => {
          console.log(err);
        }
      );
  }

  getInstitucion() {
    this.sigaServices.get("institucionActual").subscribe(n => {
      this.institucionActual = n.value;

      if (this.institucionActual != "2000") {
        this.colegiosSeleccionados = [
          {
            label: n.label,
            value: this.institucionActual
          }
        ];
        this.deshabilitarCombCol = true;
      }
    });
  }

  fillFechaIncorporacionDesde(event) {
    this.fechaIncorporacionDesdeSelect = event;
  }

  fillFechaIncorporacionHasta(event) {
    this.fechaIncorporacionHastaSelect = event;

  }

  fillFechaNacimientoDesde(event) {
    this.fechaNacimientoDesdeSelect = event;
  }

  fillFechaNacimientoHasta(event) {
    this.fechaNacimientoHastaSelect = event;
  }


  generarExcels() {

    this.body.fechaIncorporacion = [];
    this.body.fechaIncorporacion[1] = this.fechaIncorporacionHastaSelect;
    this.body.fechaIncorporacion[0] = this.fechaIncorporacionDesdeSelect;

    this.body.fechaNacimientoRango = [];
    this.body.fechaNacimientoRango[1] = this.fechaNacimientoHastaSelect;
    this.body.fechaNacimientoRango[0] = this.fechaNacimientoDesdeSelect;
    
    let descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes'));
    descargasPendientes = descargasPendientes + 1;
    sessionStorage.setItem('descargasPendientes', descargasPendientes);
    this.showInfoPerenne(
        'Se ha iniciado la descarga, puede continuar trabajando. Descargas Pendientes: ' + descargasPendientes
    );


    this.sigaServices
      .postDownloadFiles("busquedaColegiados_generarExcel", this.body)
      .subscribe(data => {
        if (data == null) {
          this.showInfo(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.sinResultados"));
          descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
          sessionStorage.setItem('descargasPendientes', descargasPendientes);        
        } else {
          let nombre = this.translateService.instant("censo.nombre.fichero.generarexcel") + new Date().getTime() + ".xlsx";
          saveAs(data, nombre);
          descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
          sessionStorage.setItem('descargasPendientes', descargasPendientes);
          this.showInfoPerenne(
            'La descarga ha finalizado. Descargas Pendientes: ' + descargasPendientes
          );
        }
      }, error => {
        descargasPendientes = JSON.parse(sessionStorage.getItem('descargasPendientes')) - 1;
        sessionStorage.setItem('descargasPendientes', descargasPendientes);

        this.showFail(this.translateService.instant("informesYcomunicaciones.consultas.mensaje.error.ejecutarConsulta"));
      }, () => {
        
      });

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

  showInfoPerenne(mensaje: string) {
    this.msgsDescarga = [];
    this.msgsDescarga.push({ severity: 'info', summary: '', detail: mensaje });
  }

  showDialog() {
    this.displayBoolean = true;
    // this.display = true;
  }

  searchHistoricoDatosDirecciones(dato) {
    // this.bodyDirecciones.historico = true;
    this.progressSpinner = true;
    // this.historico = true;
    let searchObject = new DatosDireccionesItem();
    searchObject.idPersona = dato.idPersona;
    searchObject.historico = false;
    // this.buscar = false;
    this.selectMultiple = false;
    // this.selectedDatosDirecciones = "";
    this.selectAll = false;
    this.sigaServices
      .postPaginado("direcciones_search", "?numPagina=1", searchObject)
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.datosDireccionesHist = JSON.parse(data["body"]);
          this.datosDirecciones = this.datosDireccionesHist.datosDireccionesItem;
          // this.tableDirecciones.paginator = true;
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        },
        () => {
          this.display = true;
        }
      );
  }

  closeCount() {

  }

  showCount(event) {
    this.isBuscarCount(event);
  }

  show(event, dato) {
    this.selection = "single";
    this.datosDirecciones = [];
    this.op.toggle(event);
    if (dato.noAparecerRedAbogacia2 == '1') {
      this.publicarDatosContacto = true;
    }
    else {
      this.publicarDatosContacto = false;
    }
  }
  hideOverlay(event) {
    this.displayBoolean = false;
    this.selection = "multiple";
    this.selectedDatos = [];
  }
  showMessageError(severity, summary, msg) {

    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();  
    }, 300);
  }
  focusInputField2() {
    setTimeout(() => {
      this.someDropdown2.filterInputChild.nativeElement.focus();  
    }, 300);
  }
  focusInputField3() {
    setTimeout(() => {
      this.someDropdown3.filterInputChild.nativeElement.focus();  
    }, 300);
  }
}
