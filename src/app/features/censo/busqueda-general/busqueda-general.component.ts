import { Component, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { esCalendar } from '../../../utils/calendar';
import { SigaServices } from '../../../_services/siga.service';
import { TranslateService } from '../../../commons/translate/translation.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { ComboItem } from '../../../models/ComboItem';
import { DatePipe, Location } from '@angular/common';
import { BusquedaFisicaItem } from '../../../models/BusquedaFisicaItem';
import { BusquedaJuridicaItem } from '../../../models/BusquedaJuridicaItem';
import { BusquedaJuridicaObject } from '../../../models/BusquedaJuridicaObject';
import { BusquedaFisicaObject } from '../../../models/BusquedaFisicaObject';
import { DatosNotarioItem } from '../../../models/DatosNotarioItem';
import { DatosIntegrantesItem } from '../../../models/DatosIntegrantesItem';
import { FormadorCursoItem } from '../../../models/FormadorCursoItem';
import { SolicitudIncorporacionItem } from '../../../models/SolicitudIncorporacionItem';
import { StringObject } from '../../../models/StringObject';
import { NuevaSancionItem } from '../../../models/NuevaSancionItem';
import { OnDestroy } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentication.service';
import { NoColegiadoItem } from "../../../models/NoColegiadoItem";
import { PersonaJuridicaItem } from '../../../models/PersonaJuridicaItem';
import { ArrayType } from '../../../../../node_modules/@angular/compiler/src/output/output_ast';
import { CommonsService } from '../../../_services/commons.service';
import { MultiSelect } from 'primeng/multiselect';
import { ProcuradoresItem } from '../../../models/sjcs/ProcuradoresItem';
export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-busqueda-general',
  templateUrl: './busqueda-general.component.html',
  styleUrls: ['./busqueda-general.component.scss']
})
export class BusquedaGeneralComponent implements OnDestroy {
  formBusqueda: FormGroup;
  comboIdentificacion: any[];
  comboColegios: any[];
  cols: any = [];
  colsFisicas: any = [];
  colsJuridicas: any = [];
  colsProcs: any = [];
  colegios_rol: any[];
  colegios_seleccionados: any[] = [];
  datos: any[];
  select: any[];
  es: any = esCalendar;
  selectedValue: string = 'simple';
  textSelected: String = '{0} opciones seleccionadas';
  persona: String;
  bodyFisica: BusquedaFisicaItem = new BusquedaFisicaItem();
  bodyJuridica: BusquedaJuridicaItem = new BusquedaJuridicaItem();
  bodyProc: ProcuradoresItem = new ProcuradoresItem();
  searchFisica: BusquedaFisicaObject = new BusquedaFisicaObject();
  searchJuridica: BusquedaJuridicaObject = new BusquedaJuridicaObject();
  searchProc: ProcuradoresItem = new ProcuradoresItem;
  showDatosGenerales: boolean = true;
  showDatosColegiales: boolean = false;
  showDatosFacturacion: boolean = false;
  rowsPerPage: any = [];
  selectMultiple: boolean = false;
  progressSpinner: boolean = false;
  textFilter: String = 'Elegir';
  buscar: boolean = false;
  selectAll: boolean = false;
  msgs: any[];
  selectedItem: number = 10;
  institucion: ComboItem = new ComboItem();
  nifCif: StringObject = new StringObject();
  continue: boolean = false;
  existe: boolean = false;

  nuevoProcurador: boolean = false;

  resultado: string = '';
  remitente: boolean = false;

  @ViewChild('table') table;
  selectedDatos;
  tipoCIF: string;
  newIntegrante: boolean = false;
  masFiltros: boolean = false;
  labelFiltros: string;
  idPlantillaEnvios: string;
  colegioDisabled: boolean = false;
  bodyRemitente: any = [];
  institucionActual: string;
  labelRemitente: string;
  addDestinatarioIndv: boolean = false;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  @ViewChild('someDropdown2') someDropdown2: MultiSelect;
  currentRoute: String;
  idClaseComunicacion: String;
  keys: any[] = [];
  fromAbogadoContrario: boolean = false;
  fromAbogadoContrarioEJG: boolean = false;

  migaPan: string = '';
  migaPan2: string = '';
  menuProcede: string = '';
  dosMigas: boolean = false;

  fichasPosibles = [
    {
      key: 'generales',
      activa: false
    },
    {
      key: 'colegiales',
      activa: false
    },
    {
      key: 'facturacion',
      activa: false
    }
  ];

  isFormador: boolean = false;
  isSociedad: boolean = false;

  private DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
  selectedTipo: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private location: Location,
    private commonsService: CommonsService,
    private authenticationService: AuthenticationService,
    private datePipe: DatePipe
  ) {
    this.formBusqueda = this.formBuilder.group({
      cif: null,
      fechaNacimiento: new FormControl(null, Validators.required),
      fechaIncorporacion: new FormControl(null),
      fechaFacturacion: new FormControl(null)
    });
  }

  ngOnInit() {

    if (sessionStorage.getItem("origin") == "AbogadoContrario") {
      this.fromAbogadoContrario = true;
    }
    if(sessionStorage.getItem("origin") == "AbogadoContrarioEJG"){
      this.fromAbogadoContrarioEJG = true;
    }

    sessionStorage.removeItem('origin');
    this.progressSpinner = true;
    this.currentRoute = this.router.url;
    this.getMigaPan();
    this.getInstitucion();



    if (sessionStorage.getItem("vuelveForm") != undefined)
      if (sessionStorage.getItem("vuelveForm") == "false") {
        this.router.navigate(["/buscarCursos"]);
      } else {
        sessionStorage.setItem("vuelveForm", "true");
      }

    if (sessionStorage.getItem('migaPan') != null && sessionStorage.getItem('migaPan') == "Buscar Sociedades") {
      this.persona = 'j';

      this.isFormador = true;
      sessionStorage.removeItem('abrirSolicitudIncorporacion');
    } else if (sessionStorage.getItem("nuevoProcurador")) {
      sessionStorage.removeItem("nuevoProcurador");
      this.persona = 'p';
      this.nuevoProcurador = true;
    } else {
      this.persona = 'f';
    }

    this.sigaServices.get('institucionActual').subscribe((n) => {
      this.institucion = n;
    });

    if (sessionStorage.getItem('newIntegrante') != null || sessionStorage.getItem('newIntegrante') != undefined) {
      this.newIntegrante = JSON.parse(sessionStorage.getItem('newIntegrante'));
    }

    if (sessionStorage.getItem('abrirFormador') != null || sessionStorage.getItem('abrirFormador') != undefined) {
      this.isFormador = true;
      sessionStorage.setItem('toBackNewFormador', 'true');
    }

    if (sessionStorage.getItem('abrirSociedad') != null || sessionStorage.getItem('abrirSociedad') != undefined) {
      this.isSociedad = true;
    }

    if (
      sessionStorage.getItem('abrirSolicitudIncorporacion') != null ||
      sessionStorage.getItem('abrirSolicitudIncorporacion') != undefined
    ) {
      this.persona = 'f';

      this.isFormador = true;
    }

    this.colsFisicas = [
      { field: 'nif', header: 'NIF/CIF' },
      { field: 'nombre', header: 'Nombre' },
      { field: 'apellidos', header: 'Apellidos' },
      { field: 'colegio', header: 'Colegio' },
      { field: 'numeroColegiado', header: 'Numero de Colegiado' },
      { field: 'situacion', header: 'Estado colegial' },
      { field: 'residente', header: 'Residencia' }
    ];

    this.colsJuridicas = [
      { field: 'tipo', header: 'Tipo' },
      { field: 'nif', header: 'NIF/CIF' },
      { field: 'denominacion', header: 'Denominacion' },
      { field: 'fechaConstitucion', header: 'Fecha Constitucion' },
      { field: 'abreviatura', header: 'Abreviatura' },
      { field: 'numeroIntegrantes', header: 'Número de integrantes' }
    ];

    this.colsProcs = [
      { field: 'nombre', header: this.translateService.instant("administracion.parametrosGenerales.literal.nombre") },
      { field: 'apellidos', header: this.translateService.instant("gratuita.mantenimientoTablasMaestra.literal.apellidos") },
      { field: 'nombreColProcurador', header: this.translateService.instant("censo.busquedaClientesAvanzada.literal.colegio") },
      { field: 'nColegiado', header: this.translateService.instant("censo.resultadosSolicitudesModificacion.literal.nColegiado") },
      { field: 'fechaModificacion', header: this.translateService.instant("censo.datosDireccion.literal.fechaModificacion") }
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

    this.sigaServices.get('busquedaPer_colegio').subscribe(
      (n) => {
        this.colegios_rol = n.combooItems;
      },
      (err) => {
        console.log(err);
      },
      () => {
        // this.sigaServices.get("institucionActual").subscribe(n => {
        //   this.colegios_seleccionados.push(n);
        // });
      }
    );

    this.checkStatusInit();

    // Combo de identificación
    this.sigaServices.get('busquedaPerJuridica_tipo').subscribe(
      (n) => {
        this.comboIdentificacion = n.combooItems;
        this.comboIdentificacion.map((e) => {
          let accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
          let accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
          let i;
          let x;
          for (i = 0; i < e.label.length; i++) {
            if ((x = accents.indexOf(e.label[i])) != -1) {
              e.labelSinTilde = e.label.replace(e.label[i], accentsOut[x]);
              return e.labelSinTilde;
            }
          }
        });
      },
      (error) => { }
    );

    this.sigaServices.get("busquedaProcuradores_colegios").subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.commonsService.arregloTildesCombo(this.comboColegios);
        this.progressSpinner = false;

      },
      err => {
      }, () => {
      }
    );


  }

  ngOnDestroy() {
    sessionStorage.removeItem('AddDestinatarioIndv');
    sessionStorage.removeItem('abrirRemitente');
    sessionStorage.removeItem('abrirSociedad');
  }

  getInstitucion() {
    this.sigaServices.get('institucionActual').subscribe(
      (n) => {
        this.institucionActual = n.value;

        this.sigaServices.get('busquedaPer_colegio').subscribe(
          (n) => {
            this.colegios_rol = n.combooItems;
            if (sessionStorage.getItem('abrirRemitente') == 'true') {
              this.bodyRemitente = sessionStorage.getItem('plantillasEnvioSearch');
              this.remitente = true;

              for (let colegio of this.colegios_rol) {
                if (colegio.value == this.institucionActual) {
                  this.colegios_seleccionados = [
                    {
                      label: colegio.label,
                      value: this.institucionActual
                    }
                  ];
                  this.labelRemitente = colegio.label;
                }
              }

              if (
                sessionStorage.getItem('AddDestinatarioIndv') ||
                sessionStorage.getItem('abrirRemitente') ||
                sessionStorage.getItem('nuevoNoColegiadoGen') ||
                sessionStorage.getItem('crearnuevo')
              ) {
                this.addDestinatarioIndv = true;
              } else {
                this.addDestinatarioIndv = false;
              }

              this.colegioDisabled = false;
              // this.colegios_seleccionados[0].label = this.institucionActual;
              this.progressSpinner = false;
            } else {
              for (let colegio of this.colegios_rol) {
                if (colegio.value == this.institucionActual) {
                  this.colegios_seleccionados = [
                    {
                      label: colegio.label,
                      value: this.institucionActual
                    }
                  ];
                }
              }

              if (
                sessionStorage.getItem('AddDestinatarioIndv') ||
                sessionStorage.getItem('abrirRemitente') ||
                sessionStorage.getItem('nuevoNoColegiadoGen') ||
                sessionStorage.getItem('crearnuevo')
              ) {
                this.addDestinatarioIndv = true;
              } else {
                this.addDestinatarioIndv = false;
              }
              if (sessionStorage.getItem("nuevaDesigna") != undefined && sessionStorage.getItem("nuevaDesigna") != null) {
                this.addDestinatarioIndv = true;
              }
              this.colegioDisabled = false;
              this.progressSpinner = false;
            }
          },
          (err) => {
            this.progressSpinner = false;
            console.log(err);
          },
          () => {
            // this.sigaServices.get("institucionActual").subscribe(n => {
            //   this.colegios_seleccionados.push(n);
            // });
          }
        );
      },
      (err) => {
        this.progressSpinner = false;
        console.log(err);
      },
      () => {
        // this.sigaServices.get("institucionActual").subscribe(n => {
        //   this.colegios_seleccionados.push(n);
        // });
      }
    );
  }

  isValidDNI(dni: String): boolean {
    return (
      dni &&
      typeof dni === 'string' &&
      /^[0-9]{8}([A-Za-z]{1})$/.test(dni) &&
      dni.substr(8, 9).toUpperCase() === this.DNI_LETTERS.charAt(parseInt(dni.substr(0, 8), 10) % 23)
    );
  }

  checkTypeCIF(value: String): boolean {
    if (this.isValidDNI(value)) {
      this.tipoCIF = '10';
      return true;
    } else if (this.isValidCIF(value)) {
      this.tipoCIF = '20';
      return true;
    } else if (this.isValidNIE(value)) {
      this.tipoCIF = '40';
      return true;
    } else if (this.isValidPassport(value)) {
      this.tipoCIF = '30';
      return true;
    } else {
      this.tipoCIF = '50';
      return false;
    }
  }

  getMigaPan() {
    this.menuProcede = sessionStorage.getItem('menuProcede');
    this.migaPan = sessionStorage.getItem('migaPan');
    this.migaPan2 = sessionStorage.getItem('migaPan2');

    if (this.migaPan2 != undefined) {
      this.dosMigas = true;
    } else {
      this.dosMigas = false;
    }
  }

  isValidPassport(dni: String): boolean {
    return dni && typeof dni === 'string' && /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(dni);
  }

  isValidNIE(nie: String): boolean {
    return nie && typeof nie === 'string' && /^[XYZ][0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/i.test(nie);
  }

  isValidCIF(cif: String): boolean {
    return cif && typeof cif === 'string' && /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/.test(cif);
  }

  changeColsAndData() {
    if (this.persona == 'f') {
      this.cols = this.colsFisicas;

      if (
        sessionStorage.getItem('AddDestinatarioIndv') == undefined &&
        sessionStorage.getItem('abrirRemitente') == undefined &&
        sessionStorage.getItem('nuevoNoColegiadoGen') == undefined
      ) {
        //this.colegios_seleccionados = [];
        this.addDestinatarioIndv = false;
      } else {
        this.addDestinatarioIndv = true;
      }

      this.datos = [];
      this.bodyFisica.nif = '';
      this.bodyFisica.nombre = '';
      this.bodyFisica.primerApellido = '';
      this.bodyFisica.segundoApellido = '';
      this.bodyFisica.numeroColegiado = '';
    }
    if (this.persona == 'p') {
      this.cols = this.colsProcs;

      this.datos = [];
      this.bodyProc.idColProcurador = '';
      this.bodyProc.nombre = '';
      this.bodyProc.apellido1 = '';
      this.bodyProc.nColegiado = '';

    }
    else {
      this.cols = this.colsJuridicas;

      if (
        sessionStorage.getItem('AddDestinatarioIndv') == undefined &&
        sessionStorage.getItem('abrirRemitente') == undefined &&
        sessionStorage.getItem('nuevoNoColegiadoGen') == undefined &&
        sessionStorage.getItem('crearnuevo') == undefined
      ) {
        //this.colegios_seleccionados = [];
        this.addDestinatarioIndv = false;
      } else {
        this.addDestinatarioIndv = true;
      }

      this.datos = [];

      this.selectedTipo = '';
      //this.bodyJuridica.tipo = this.selectedTipo;
      this.bodyJuridica.nif = '';
      this.bodyJuridica.denominacion = '';
      this.bodyJuridica.abreviatura = '';
    }
  }

  checkFilterFisic() {
    if (
      (this.bodyFisica.nombre == null ||
        this.bodyFisica.nombre == null ||
        this.bodyFisica.nombre.trim().length < 3) &&
      (this.bodyFisica.primerApellido == null ||
        this.bodyFisica.primerApellido == null ||
        this.bodyFisica.primerApellido.trim().length < 3) &&
      (this.bodyFisica.segundoApellido == null ||
        this.bodyFisica.segundoApellido == null ||
        this.bodyFisica.segundoApellido.trim().length < 3) &&
      (this.bodyFisica.numeroColegiado == null ||
        this.bodyFisica.numeroColegiado == null ||
        this.bodyFisica.numeroColegiado.trim().length < 3) &&
      (this.bodyFisica.nif == null || this.bodyFisica.nif == null || this.bodyFisica.nif.trim().length < 3) &&
      (this.colegios_seleccionados == undefined ||
        this.colegios_seleccionados == null ||
        this.colegios_seleccionados.length < 1)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.bodyFisica.nombre != undefined) {
        this.bodyFisica.nombre = this.bodyFisica.nombre.trim();
      }
      if (this.bodyFisica.primerApellido != undefined) {
        this.bodyFisica.primerApellido = this.bodyFisica.primerApellido.trim();
      }
      if (this.bodyFisica.segundoApellido != undefined) {
        this.bodyFisica.segundoApellido = this.bodyFisica.segundoApellido.trim();
      }
      if (this.bodyFisica.numeroColegiado != undefined) {
        this.bodyFisica.numeroColegiado = this.bodyFisica.numeroColegiado.trim();
      }
      if (this.bodyFisica.nif != undefined) {
        this.bodyFisica.nif = this.bodyFisica.nif.trim();
      }

      return true;
    }
  }

  checkFilterProc() {
    if (
      (this.bodyProc.nombre == null ||
        this.bodyProc.nombre.trim().length < 3) &&
      (this.bodyProc.apellido1 == null ||
        this.bodyProc.apellido1.trim().length < 3) &&
      /* (this.bodyProc.apellido2 == null ||
        this.bodyProc.apellido2.trim().length < 3) && */
      (this.bodyProc.nColegiado == null 
      //  || this.bodyProc.nColegiado.trim().length < 3 
      ) &&
      (this.bodyProc.idColProcurador == undefined ||
        this.bodyProc.idColProcurador == null ||
        this.bodyProc.idColProcurador.length < 1)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.bodyProc.nombre != undefined) {
        this.bodyProc.nombre = this.bodyProc.nombre.trim();
      }
      if (this.bodyProc.apellido1 != undefined) {
        this.bodyProc.apellido1 = this.bodyProc.apellido1.trim();
      }
      /* if (this.bodyProc.apellido2 != undefined) {
        this.bodyProc.apellido2 = this.bodyProc.apellido2.trim();
      } */
      if (this.bodyProc.nColegiado != undefined) {
        this.bodyProc.nColegiado = this.bodyProc.nColegiado.trim();
      }

      return true;
    }
  }

  checkFilterJuridic() {
    if (
      (this.selectedTipo == undefined ||
        this.selectedTipo == null ||
        this.selectedTipo.value == '' ||
        this.selectedTipo.length < 1) &&
      (this.bodyJuridica.abreviatura == null ||
        this.bodyJuridica.abreviatura == null ||
        this.bodyJuridica.abreviatura.trim().length < 3) &&
      (this.bodyJuridica.denominacion == null ||
        this.bodyJuridica.denominacion == null ||
        this.bodyJuridica.denominacion.trim().length < 3) &&
      (this.bodyJuridica.nif == null ||
        this.bodyJuridica.nif == null ||
        this.bodyJuridica.nif.trim().length < 3) &&
      (this.colegios_seleccionados == undefined ||
        this.colegios_seleccionados == null ||
        this.colegios_seleccionados.length < 1)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      // if (this.bodyJuridica.tipo != undefined) {
      //   this.bodyJuridica.tipo = this.bodyJuridica.tipo.trim();
      // }
      if (this.bodyJuridica.abreviatura != undefined) {
        this.bodyJuridica.abreviatura = this.bodyJuridica.abreviatura.trim();
      }
      if (this.bodyJuridica.denominacion != undefined) {
        this.bodyJuridica.denominacion = this.bodyJuridica.denominacion.trim();
      }
      if (this.bodyJuridica.nif != undefined) {
        this.bodyJuridica.nif = this.bodyJuridica.nif.trim();
      }
      return true;
    }
  }
  checkStatusInit() {
    if (this.persona == 'f') {
      this.cols = this.colsFisicas;
    } else if (this.persona == 'p') {
      this.cols = this.colsProcs;
    }
    else {
      this.cols = this.colsJuridicas;
    }
  }

  search() {
    this.existe = false;
    this.progressSpinner = true;
    this.buscar = true;

    if (this.persona == 'f') {
      if (this.checkFilterFisic()) {
        if (this.bodyFisica.nif == undefined) {
          this.bodyFisica.nif = '';
        }
        if (this.colegios_seleccionados != undefined) {
          this.bodyFisica.idInstitucion = [];
          this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
            this.bodyFisica.idInstitucion.push(value.value);
          });
        } else {
          this.bodyFisica.idInstitucion = [];
        }
        if (this.bodyFisica.nombre == undefined) {
          this.bodyFisica.nombre = '';
        }
        if (this.bodyFisica.primerApellido == undefined) {
          this.bodyFisica.primerApellido = '';
        }
        if (this.bodyFisica.segundoApellido == undefined) {
          this.bodyFisica.segundoApellido = '';
        }
        if (this.bodyFisica.numeroColegiado == undefined) {
          this.bodyFisica.numeroColegiado = '';
        }
        this.checkTypeCIF(this.bodyFisica.nif);

        if (sessionStorage.getItem('nuevoNoColegiadoGen')) {
          this.bodyFisica.addDestinatarioIndv = false;
        } else {
          this.bodyFisica.addDestinatarioIndv = this.addDestinatarioIndv;
        }

        this.sigaServices.postPaginado('busquedaPer_searchFisica', '?numPagina=1', this.bodyFisica).subscribe(
          (data) => {
            this.progressSpinner = false;
            this.searchFisica = JSON.parse(data['body']);

            if (this.searchFisica.busquedaFisicaItems.length == 0) {
              if (this.searchFisica.error != null && this.searchFisica.error.message != null) {
                this.showInfo(this.searchFisica.error.message);
                this.existe = true;
              }
              this.datos = [];
            } else {
              this.datos = [];
              this.datos = this.searchFisica.busquedaFisicaItems;
            }
          },
          (err) => {
            console.log(err);
            this.progressSpinner = false;
          },
          () => {
            if (this.datos.length == 0 || this.datos == null || this.datos == undefined) {
              if (this.bodyFisica.nif != '' && this.bodyFisica.nif != undefined && !this.existe) {
                if (this.tipoIdentificacionPermitido(this.bodyFisica.nif)) {
                  if (
                    sessionStorage.getItem('AddDestinatarioIndv') == undefined &&
                    sessionStorage.getItem('abrirRemitente') == undefined
                  ) {
                    this.noDataFoundWithDNI();
                  } else {
                    if (sessionStorage.getItem('AddDestinatarioIndv')) {
                      sessionStorage.setItem('AddDestinatarioIndvBack', 'true');
                    }
                  }
                }
              }
            } else {
              // encuentra datos, muestra mensaje informativo si tiene nif + {nombre || primer apellido || segundo apellido informado}

              if (this.searchFisica.onlyNif) {
                this.showInfo('busquedaGeneral.literal.colegiado.otroColegio');
              }

              if (sessionStorage.getItem('AddDestinatarioIndv') != undefined) {
                sessionStorage.setItem('AddDestinatarioIndvBack', 'true');
              }
            }

            setTimeout(() => {
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
      }
    } if (this.persona == 'p') {
      if (this.checkFilterProc()) {
        if (this.bodyProc.nombre == undefined) {
          this.bodyFisica.nombre = '';
        }
        if (this.bodyProc.apellido1 == undefined) {
          this.bodyProc.apellido1 = '';
        }
        /* if (this.bodyFisica.segundoApellido == undefined) {
          this.bodyFisica.segundoApellido = '';
        } */
        if (this.bodyProc.nColegiado == undefined) {
          this.bodyProc.nColegiado = '';
        }

        this.sigaServices.post('gestionejg_busquedaProcuradores', this.bodyProc).subscribe(
          (data) => {
            this.progressSpinner = false;
            let searchProc = JSON.parse(data['body']);

            if (searchProc.procuradorItems.length == 0) {
              if (searchProc.error != null && searchProc.error.message != null) {
                this.showInfo(searchProc.error.message);
                this.existe = true;
              }
              this.datos = [];
            } else {
              this.datos = [];
              this.datos = searchProc.procuradorItems;
              this.datos.forEach(element => {
                element.apellidos = element.apellido1 + " " + element.apellido2;
                if (element.fechaModificacion != null) element.fechaModificacion = this.datePipe.transform(element.fechaModificacion, 'dd/MM/yyyy');
              });
            }
          },
          (err) => {
            this.progressSpinner = false;
          },
          () => {
            setTimeout(() => {
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );
      }
    }
    else {
      if (this.checkFilterJuridic()) {
        if (this.selectedTipo != undefined && this.selectedTipo.value == '') {
          this.bodyJuridica.tipo = '';
        }
        if (this.bodyJuridica.nif == undefined) {
          this.bodyJuridica.nif = '';
        }
        if (this.bodyJuridica.denominacion == undefined) {
          this.bodyJuridica.denominacion = '';
        }
        if (this.bodyJuridica.numColegiado == undefined) {
          this.bodyJuridica.numColegiado = '';
        }
        if (this.bodyJuridica.abreviatura == undefined) {
          this.bodyJuridica.abreviatura = '';
        }

        this.bodyJuridica.idInstitucion = [];
        this.colegios_seleccionados.forEach((value: ComboItem, key: number) => {
          this.bodyJuridica.idInstitucion.push(value.value);
        });
        this.checkTypeCIF(this.bodyJuridica.nif);
        this.sigaServices
          .postPaginado('busquedaPer_searchJuridica', '?numPagina=1', this.bodyJuridica)
          .subscribe(
            (data) => {
              this.progressSpinner = false;
              this.searchJuridica = JSON.parse(data['body']);

              if (this.searchJuridica.busquedaPerJuridicaItems.length == 0) {
                if (this.searchJuridica.error != null && this.searchJuridica.error.message != null) {
                  this.showInfo(this.searchJuridica.error.message);
                  this.existe = true;
                }
                this.datos = [];
              } else {
                this.datos = [];
                this.datos = this.searchJuridica.busquedaPerJuridicaItems;
              }

              // this.table.paginator = true;
            },
            (err) => {
              console.log(err);
              this.progressSpinner = false;
            },
            () => {
              if (
                (this.datos.length == 0 || this.datos == null || this.datos == undefined) &&
                !this.existe
              ) {
                if (this.tipoIdentificacionPermitido(this.bodyJuridica.nif)) {
                  if (
                    sessionStorage.getItem('AddDestinatarioIndv') == undefined &&
                    sessionStorage.getItem('abrirRemitente') == undefined
                  ) {
                    this.noDataFoundWithDNI();
                  }
                }
              } else {
                if (this.searchJuridica.onlyNif) {
                  this.showInfo('busquedaGeneral.literal.colegiado.otroColegio');
                }

                if (sessionStorage.getItem('AddDestinatarioIndv') != undefined) {
                  sessionStorage.setItem('AddDestinatarioIndvBack', 'true');
                }
              }
              setTimeout(() => {
                this.commonsService.scrollTablaFoco('tablaFoco');
              }, 5);
            }
          );
      }
    }
  }
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onHideDatosColegiales() {
    this.showDatosColegiales = !this.showDatosColegiales;
  }
  onHideDatosFacturacion() {
    this.showDatosFacturacion = !this.showDatosFacturacion;
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }

  isBuscar() {
    this.buscar = true;
    this.search();
  }

  irFichaColegial(id) {
    
    //let colegioSelec = this.colegios_seleccionados[0].idInstitucion;
    // En caso que venga de una ficha de contrario
    if (this.fromAbogadoContrario || this.fromAbogadoContrarioEJG) {
      sessionStorage.setItem('abogado', JSON.stringify(id));
      if(this.fromAbogadoContrario) sessionStorage.setItem("origin", "Contrario");
      else sessionStorage.setItem("origin", "ContrarioEJG");
      this.location.back();
    }
    //En caso que se este seleccionando un nuevo porcurador
    else if (this.nuevoProcurador) {
      sessionStorage.setItem('datosProcurador', JSON.stringify(id));
      if(this.fromAbogadoContrario) sessionStorage.setItem("origin", "Contrario");
      else if(this.fromAbogadoContrarioEJG) sessionStorage.setItem("origin", "ContrarioEJG");
      this.location.back();
    }
    // ir a ficha de notario
    else if (sessionStorage.getItem('abrirNotario') == 'true' && sessionStorage.getItem('abrirRemitente') != 'true') {
      if (!this.selectMultiple && !this.selectAll) {
        if (sessionStorage.getItem('notario') != null || sessionStorage.getItem('notario') != undefined) {
          sessionStorage.removeItem('notario');
          sessionStorage.removeItem('abrirRemitente');
        }
        this.checkTypeCIF(id[0].nif);
        id[0].tipoIdentificacion = this.tipoCIF;

        sessionStorage.setItem('notario', JSON.stringify(id));
        //this.location.back();

        this.router.navigate(['fichaPersonaJuridica']);
      }
    } 
    // else if (sessionStorage.getItem('nuevoProcurador')) {
    //   sessionStorage.setItem('datosProcurador', JSON.stringify(id));
    //   this.backTo();
    // }
     else if (
      (sessionStorage.getItem('newIntegrante') != null || sessionStorage.getItem('newIntegrante') != undefined) &&
      sessionStorage.getItem('abrirRemitente') != 'true'
    ) {
      // ir a ficha de integrante
      sessionStorage.removeItem('notario');
      sessionStorage.removeItem('abrirRemitente');
      this.checkTypeCIF(id[0].nif);
      id[0].tipoIdentificacion = this.tipoCIF;
      id[0].colegio = this.colegios_seleccionados[0];
      id[0].completo = true;
      sessionStorage.removeItem('nIntegrante');
      sessionStorage.setItem('nIntegrante', JSON.stringify(id));
      this.router.navigate(['detalleIntegrante']);
    } else if (sessionStorage.getItem('abrirRemitente') == 'true') {
      if (id[0].idPersona != null && id[0].idPersona != null) {
        sessionStorage.setItem('remitente', JSON.stringify(id[0]));
        sessionStorage.removeItem('abrirRemitente');
        sessionStorage.removeItem('notario');
        sessionStorage.removeItem('integrante');
        this.location.back();
        // ir a ficha de solicitud de Incorporación
      }
    } else if (sessionStorage.getItem('AddDestinatarioIndv') != null) {
      sessionStorage.setItem('destinatarioIndv', JSON.stringify(id[0]));
      // sessionStorage.removeItem("AddDestinatarioIndv");
      this.location.back();
    } else if (
      sessionStorage.getItem('solicitudIncorporacion') == 'true' &&
      sessionStorage.getItem('abrirRemitente') != 'true'
    ) {
      let enviar = new SolicitudIncorporacionItem();

      this.nifCif.valor = id[0].nif;
      this.sigaServices.post('solicitudModificacion_verifyPerson', this.nifCif).subscribe(
        (data) => {
          this.resultado = JSON.parse(data['body']).valor;

          if (this.resultado == 'existe') {
            this.continue = false;
          } else {
            this.continue = true;
          }

          this.progressSpinner = false;
        },
        (err) => {
          console.log(err);
        },
        () => {
          if (this.continue == true) {
            enviar.numeroIdentificacion = id[0].nif;
            enviar.apellido1 = id[0].primerApellido;
            enviar.nombre = id[0].nombre;

            enviar.numColegiado = id[0].numeroColegiado;

            enviar.idInstitucion = id[0].numeroInstitucion;
            enviar.apellido2 = id[0].segundoApellido;
            enviar.sexo = id[0].sexo;
            enviar.naturalDe = id[0].naturalDe;
            enviar.idTipoIdentificacion = id[0].idTipoIdentificacion;
            enviar.idEstadoCivil = id[0].idEstadoCivil;
            enviar.fechaNacimiento = id[0].fechaNacimientoString;
            enviar.idTratamiento = id[0].idTratamiento;
            enviar.idEstado = id[0].situacion;
            enviar.domicilio = id[0].direccion;
            enviar.idProvincia = id[0].idProvincia;
            enviar.idPoblacion = id[0].idPoblacion;
            enviar.idPais = id[0].idPais;
            enviar.movil = id[0].movil;
            enviar.telefono1 = id[0].telefono1;
            enviar.telefono2 = id[0].telefono2;
            enviar.fax1 = id[0].fax1;
            enviar.fax2 = id[0].fax2;
            enviar.correoElectronico = id[0].correoelectronico;
            enviar.codigoPostal = id[0].codigoPostal;
            enviar.nombrePoblacion = id[0].nombrePoblacion;

            enviar.domicilio = id[0].direccion;
            enviar.idProvincia = id[0].idProvincia;
            enviar.idPoblacion = id[0].idPoblacion;
            enviar.idPais = id[0].idPais;
            enviar.movil = id[0].movil;
            enviar.telefono1 = id[0].telefono1;
            enviar.telefono2 = id[0].telefono2;
            enviar.fax1 = id[0].fax1;
            enviar.fax2 = id[0].fax2;
            enviar.correoElectronico = id[0].correoelectronico;
            enviar.codigoPostal = id[0].codigoPostal;
            enviar.nombrePoblacion = id[0].nombrePoblacion;
            if (sessionStorage.getItem('nuevoNoColegiadoGen') == 'true') {
              // sessionStorage.setItem('nuevoNoColegiado', JSON.stringify(enviar));
              // sessionStorage.setItem('esColegiado', 'false');
              // sessionStorage.setItem('esNuevoNoColegiado', 'true');
              // this.router.navigate(['/fichaColegial']);
              // INCIDENCIA 1331 Agregamos caso en el cual viniendo de NuevoNoColegiado, el no-colegiado seleccionado existe en nuestro colegio como no-colegiado, en cuyo caso vamos a ficha colegial en modo edición, no en modo creación.
              if (id[0].numeroInstitucion == this.authenticationService.getInstitucionSession()) {
                sessionStorage.removeItem("personaBody");
                sessionStorage.removeItem("fichaColegialByMenu");

                let body = new NoColegiadoItem();
                body.nif = id[0].nif;
                body.idInstitucion = id[0].numeroInstitucion;
                this.sigaServices
                  .postPaginado(
                    "busquedaNoColegiados_searchNoColegiado",
                    "?numPagina=1",
                    body
                  )
                  .subscribe(
                    data => {
                      this.progressSpinner = false;
                      sessionStorage.setItem("esColegiado", "false");
                      sessionStorage.setItem("destinatarioCom", "true");
                      sessionStorage.setItem("esNuevoNoColegiado", "false");
                      if (id[0].fechaBaja != null) {
                        sessionStorage.setItem("disabledAction", "true");
                      } else {
                        sessionStorage.setItem("disabledAction", "false");
                      }
                      sessionStorage.setItem("personaBody", JSON.stringify(JSON.parse(data["body"]).noColegiadoItem[0]));
                      this.router.navigate(["/fichaColegial"]);
                    },
                    err => {
                      console.log(err);
                      this.progressSpinner = false;
                    },
                    () => {
                      this.progressSpinner = false;
                    }
                  );
                // INCIDENCIA 1331 Agregamos caso en el cual viniendo de NuevoNoColegiado, el no-colegiado seleccionado existe en nuestro colegio como no-colegiado, en cuyo caso vamos a ficha colegial en modo edición, no en modo creación.
              } else {
                sessionStorage.setItem(
                  "nuevoNoColegiado",
                  JSON.stringify(enviar)
                );
                sessionStorage.setItem("esColegiado", "false");
                sessionStorage.setItem("esNuevoNoColegiado", "true");
                this.router.navigate(["/fichaColegial"]);
              }
            } else {
              sessionStorage.setItem('nuevaIncorporacion', JSON.stringify(enviar));
              this.router.navigate(['/nuevaIncorporacion']);
            }
          } else {
            if (sessionStorage.getItem('nuevoNoColegiadoGen') == 'true') {
              this.showFail(
                'No se puede crear un no colegiado a partir de un colegiado de la misma institución'
              );
            } else {
              this.showFail(
                'No se puede crear una solicitud a partir de una persona de la misma institución'
              );
            }
          }
        }
      );
    } else if (sessionStorage.getItem('crearnuevo') == 'true') {
      if (id[0].idInstitucion != this.colegios_seleccionados[0].value) {
        let mess = "La sociedad ya existe en otro colegio, se procederá a crear una nueva con los datos básicos de la seleccionada. ¿Desea continuar?";
        let icon = 'fa fa-edit';
        this.confirmationService.confirm({
          message: mess,
          icon: icon,
          accept: () => {
            let cuerpo = [];
            cuerpo.push(id[0]);
            sessionStorage.setItem('usuarioBody', JSON.stringify(cuerpo));
            sessionStorage.removeItem('abrirSociedad');
            sessionStorage.setItem("nuevoRegistro", "true");
            this.router.navigate(['fichaPersonaJuridica']);
          },
          reject: () => {
            this.msgs = [
              {
                severity: 'info',
                summary: 'Cancel',
                detail: this.translateService.instant('general.message.accion.cancelada')
              }
            ];
          }
        });
      } else {
        let cuerpo = [];
        cuerpo.push(id[0]);
        sessionStorage.setItem('usuarioBody', JSON.stringify(cuerpo));
        sessionStorage.removeItem('abrirSociedad');
        this.router.navigate(['fichaPersonaJuridica']);
      }
    } else if (this.isFormador) {
      // ir a ficha de formador
      this.checkTypeCIF(id[0].nif);
      id[0].tipoIdentificacion = this.tipoCIF;
      id[0].completo = true;
      sessionStorage.removeItem('abrirFormador');
      sessionStorage.removeItem('abrirSolicitudIncorporacion');

      sessionStorage.setItem('formador', JSON.stringify(id[0]));
      if (
        sessionStorage.getItem('backInscripcion') != null ||
        sessionStorage.getItem('backInscripcion') != undefined
      ) {
        this.router.navigate(['/buscarInscripciones']);
        sessionStorage.removeItem('backInscripcion');
      } else if (
        sessionStorage.getItem('backFichaInscripcion') != null ||
        sessionStorage.getItem('backFichaInscripcion') != undefined
      ) {
        sessionStorage.removeItem('backFichaInscripcion');
        if (sessionStorage.getItem('modoEdicionInscripcion') != null) {
          sessionStorage.removeItem('modoEdicionInscripcion');
        }

        sessionStorage.setItem('modoEdicionInscripcion', 'false');
        this.router.navigate(['/fichaInscripcion']);
      } else {
        this.router.navigate(['/fichaCurso']);
      }
    } else if (
      sessionStorage.getItem('nuevaSancion') != null &&
      sessionStorage.getItem('nuevaSancion') != undefined
    ) {
      sessionStorage.setItem('nSancion', JSON.stringify(id));
      this.router.navigate(['detalleSancion']);
    }


    if (sessionStorage.getItem("Art27Activo") == 'true') {
      sessionStorage.removeItem("Art27Activo")
      sessionStorage.setItem("colegiadoGeneralDesigna", JSON.stringify(id));
      this.location.back();
    }
  }

  tipoIdentificacionPermitido(value: String): boolean {
    // busqueda fisica => todos menos cif
    if (this.persona == 'f') {
      if (this.isValidCIF(value)) {
        return false;
      } else {
        return true;
      }
    } else {
      // busqueda juridica => cif
      if (this.isValidCIF(value)) {
        return true;
      } else {
        return false;
      }
    }
  }

  noDataFoundWithDNI() {
    let mess = '';
    if (this.persona == 'f') {
      mess = 'No existe ningun elemento con el NIF seleccionado, ¿Desea crear un elemento?';
    } else {
      mess = 'No existe ningun elemento con el CIF seleccionado, ¿Desea crear un elemento?';
    }

    let icon = 'fa fa-edit';

    if (sessionStorage.getItem('nuevaSancion') == undefined) {
      this.confirmationService.confirm({
        message: mess,
        icon: icon,
        accept: () => {
          let enviar = new SolicitudIncorporacionItem();
          if (sessionStorage.getItem('nuevoNoColegiadoGen') == 'true') {
            sessionStorage.setItem('nuevoNoColegiado', JSON.stringify(enviar));
            sessionStorage.setItem('esColegiado', 'false');
            sessionStorage.setItem('esNuevoNoColegiado', 'true');
            sessionStorage.setItem('nifNuevo', this.bodyFisica.nif);
            sessionStorage.setItem('bodyNuevo', JSON.stringify(this.bodyFisica));
            this.router.navigate(['/fichaColegial']);
          } else {
            if (sessionStorage.getItem('abrirNotario') == 'true') {
              let notarioNIF = new DatosNotarioItem();
              if (this.bodyFisica.nif != null || this.bodyFisica.nif != undefined) {
                notarioNIF.nif = this.bodyFisica.nif;
              } else {
                notarioNIF.nif = this.bodyJuridica.nif;
              }

              notarioNIF.tipoIdentificacion = this.tipoCIF;

              let notariosNEW = [];

              notarioNIF.nombre = this.bodyFisica.nombre;
              notarioNIF.apellido1 = this.bodyFisica.primerApellido;
              notarioNIF.apellido2 = this.bodyFisica.segundoApellido;

              notariosNEW.push(notarioNIF);
              sessionStorage.removeItem('notario');

              sessionStorage.setItem('notario', JSON.stringify(notariosNEW));
              this.location.back();
            } else if (sessionStorage.getItem('solicitudIncorporacion') == 'true') {
              let enviar = new SolicitudIncorporacionItem();
              if (this.bodyFisica.nif != undefined || this.bodyFisica.nif != '') {
                enviar.numeroIdentificacion = this.bodyFisica.nif;
                enviar.nombre = this.bodyFisica.nombre;
                enviar.apellido1 = this.bodyFisica.primerApellido;
                enviar.apellido2 = this.bodyFisica.segundoApellido;
                enviar.numColegiado = this.bodyFisica.numeroColegiado;
                sessionStorage.setItem('nuevaIncorporacion', JSON.stringify(enviar));
                this.router.navigate(['/nuevaIncorporacion']);
              } else {
                this.showFail(
                  'No se puede crear una solicitud de modificación a partir de una persona jurídica'
                );
              }
            } else if (
              sessionStorage.getItem('newIntegrante') != null ||
              sessionStorage.getItem('newIntegrante') != undefined
            ) {
              let integranteNew = new DatosIntegrantesItem();
              if (this.bodyFisica.nif != null || this.bodyFisica.nif != undefined) {
                integranteNew.nifCif = this.bodyFisica.nif;
              } else {
                integranteNew.nifCif = this.bodyJuridica.nif;
              }

              // sirve tanto para ambas busquedas (fisica, juridica)
              integranteNew.tipoIdentificacion = this.tipoCIF;

              // datos de persona fisica para pasar a pantalla integrante
              if (this.persona == 'f') {
                integranteNew.nombre = this.bodyFisica.nombre;
                integranteNew.apellidos1 = this.bodyFisica.primerApellido;
                integranteNew.apellidos2 = this.bodyFisica.segundoApellido;
                integranteNew.ejerciente = 'NO COLEGIADO';
              } else {
                // datos de persona fisica para pasar a pantalla integrante
                integranteNew.nombre = this.bodyJuridica.denominacion;
                integranteNew.apellidos1 = this.bodyJuridica.abreviatura;
                integranteNew.ejerciente = 'SOCIEDAD';
                integranteNew.colegio = this.colegios_seleccionados[0];
              }

              integranteNew.completo = false;
              let integrantesNEW = [];
              integrantesNEW.push(integranteNew);

              sessionStorage.removeItem('nIntegrante');
              sessionStorage.setItem('nIntegrante', JSON.stringify(integrantesNEW));
              this.router.navigate(['detalleIntegrante']);
            } else if (
              sessionStorage.getItem('abrirFormador') != null ||
              sessionStorage.getItem('abrirFormador') != undefined
            ) {
              let formador = new FormadorCursoItem();
              formador.tipoIdentificacion = this.tipoCIF;
              formador.nif = this.bodyFisica.nif;
              sessionStorage.removeItem('abrirFormador');
              sessionStorage.setItem('formador', JSON.stringify(formador));
              if (
                sessionStorage.getItem('backFichaInscripcion') != null &&
                sessionStorage.getItem('backFichaInscripcion')
              )
                this.router.navigate(['/fichaInscripcion']);
              else this.router.navigate(['/fichaCurso']);
            } else if (
              sessionStorage.getItem('crearnuevo') != null ||
              sessionStorage.getItem('crearnuevo') != undefined
            ) {
              let cuerpo = [];
              cuerpo.push(this.bodyJuridica);
              sessionStorage.setItem('usuarioBody', JSON.stringify(cuerpo));
              sessionStorage.setItem('nuevoRegistro', 'true');
              this.router.navigate(['fichaPersonaJuridica']);
            }
          }
        },
        reject: () => {
          this.msgs = [
            {
              severity: 'info',
              summary: 'Cancel',
              detail: this.translateService.instant('general.message.accion.cancelada')
            }
          ];
        }
      });
    }
  }

  showFail(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: this.translateService.instant('general.message.incorrect'),
      detail: mensaje
    });
  }

  showWarning(mensaje: string) {
    this.msgs = [];
    this.msgs.push({
      severity: 'warn',
      summary: 'Atención',
      detail: mensaje
    });
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: this.translateService.instant('general.message.incorrect'),
      detail: this.translateService.instant('cen.busqueda.error.busquedageneral')
    });
  }

  isSelectMultiple() {
    this.selectMultiple = !this.selectMultiple;
    if (!this.selectMultiple) {
      this.selectedDatos = [];
    } else {
      this.selectAll = false;
      this.selectedDatos = [];
    }
  }

  verMasFiltros() {
    this.masFiltros = !this.masFiltros;
  }

  abrirFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = true;
  }

  cerrarFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    fichaPosible.activa = false;
  }

  esFichaActiva(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);
    return fichaPosible.activa;
  }

  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter((elto) => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  onChangeSelectAll() {
    if (this.selectAll === true) {
      this.selectMultiple = false;
      this.selectedDatos = this.datos;
    } else {
      this.selectedDatos = [];
    }
  }

  //búsqueda con enter
  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscar();
    }
  }

  backTo() {
    if(this.fromAbogadoContrario) sessionStorage.setItem("origin", "Contrario");
    else if(this.fromAbogadoContrarioEJG) sessionStorage.setItem("origin", "ContrarioEJG");
    this.location.back();
  }

  clear() {
    this.msgs = [];
  }

  getTipo(event) {
    this.selectedTipo = event;
    if (this.selectedTipo != undefined) {
      this.bodyJuridica.tipo = this.selectedTipo.value;
    } else {
      this.bodyJuridica.tipo = undefined;
    }

  }

  navigateComunicar(dato) {
    sessionStorage.setItem('rutaComunicacion', this.currentRoute.toString());
    sessionStorage.setItem('idModulo', '3');
    this.getDatosComunicar();
  }

  getDatosComunicar() {
    let datosSeleccionados = [];
    let rutaClaseComunicacion = this.currentRoute.toString();

    this.sigaServices.post('dialogo_claseComunicacion', rutaClaseComunicacion).subscribe(
      (data) => {
        this.idClaseComunicacion = JSON.parse(data['body']).clasesComunicaciones[0].idClaseComunicacion;
        this.sigaServices.post('dialogo_keys', this.idClaseComunicacion).subscribe(
          (data) => {
            this.keys = JSON.parse(data['body']).keysItem;
            this.selectedDatos.forEach((element) => {
              let keysValues = [];
              this.keys.forEach((key) => {
                if (element[key.nombre] != undefined) {
                  keysValues.push(element[key.nombre]);
                }
              });
              datosSeleccionados.push(keysValues);
            });

            sessionStorage.setItem('datosComunicar', JSON.stringify(datosSeleccionados));
            this.router.navigate(['/dialogoComunicaciones']);
          },
          (err) => {
            console.log(err);
          }
        );
      },
      (err) => {
        console.log(err);
      }
    );
  }

  showInfo(message) {
    this.msgs = [];
    this.msgs.push({
      severity: 'info',
      summary: this.translateService.instant('general.message.informacion'),
      detail: this.translateService.instant(message)
    });
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
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
}
