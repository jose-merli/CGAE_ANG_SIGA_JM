import { Component, OnInit, ViewChild, HostListener, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { SigaServices } from '../../../_services/siga.service';
import { Location } from '@angular/common';
import { BusquedaFisicaItem } from '../../../models/BusquedaFisicaItem';
import { BusquedaFisicaObject } from '../../../models/BusquedaFisicaObject';
import { Router } from '../../../../../node_modules/@angular/router';
import { DatosColegiadosItem } from '../../../models/DatosColegiadosItem';
import { DatosColegiadosObject } from '../../../models/DatosColegiadosObject';
import { AuthenticationService } from '../../../_services/authentication.service';
import { SolicitudIncorporacionItem } from '../../../models/SolicitudIncorporacionItem';
import { DatosNoColegiadosObject } from '../../../models/DatosNoColegiadosObject';
import { NoColegiadoItem } from '../../../models/NoColegiadoItem';
import { TranslateService } from '../../../commons/translate';
import { ConfirmationService } from '../../../../../node_modules/primeng/primeng';
import { FichaColegialGeneralesItem } from '../../../models/FichaColegialGeneralesItem';
import { CommonsService } from '../../../_services/commons.service';
import { MultiSelect } from 'primeng/multiselect';

export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-busqueda-censo-general',
  templateUrl: './busqueda-censo-general.component.html',
  styleUrls: ['./busqueda-censo-general.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusquedaCensoGeneralComponent implements OnInit {
  textFilter: String = 'Elegir';
  textSelected: String = '{0} opciones seleccionadas';

  cols: any = [];
  rowsPerPage: any = [];
  colegios: any[];
  msgs: any[];
  datos: any[] = [];
  datosColegiados: any[] = [];
  datosNoColegiados: any[] = [];
  colegios_seleccionados: any[] = [];

  showDatosGenerales: boolean = true;
  buscar: boolean = false;
  progressSpinner: boolean = false;

  body: BusquedaFisicaItem = new BusquedaFisicaItem();
  bodySearch = new BusquedaFisicaObject();

  bodyNoColegiado: NoColegiadoItem = new NoColegiadoItem();
  noColegiadoSearch = new DatosNoColegiadosObject();

  bodyFisica: BusquedaFisicaItem = new BusquedaFisicaItem();
  personaBody: FichaColegialGeneralesItem = new FichaColegialGeneralesItem();

  bodyColegiado: DatosColegiadosItem = new DatosColegiadosItem();
  colegiadoSearch = new DatosColegiadosObject();
  modoBusqueda: string = 'aprox';
  modoBusquedaAprox: boolean = true;
  selectedItem: number = 10;
  @ViewChild('someDropdown') someDropdown: MultiSelect;
  @ViewChild('table')
  table;
  selectedDatos;

  constructor(
    private sigaServices: SigaServices,
    private location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private commonsService: CommonsService,
    private translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    sessionStorage.removeItem('esNuevoNoColegiado');

    if (sessionStorage.getItem('filtrosBusqueda') != null) {
      this.body = JSON.parse(sessionStorage.getItem('filtrosBusqueda'));

      if (sessionStorage.getItem('busquedaCensoGeneral') != null) {
        this.body = JSON.parse(sessionStorage.getItem('filtrosBusqueda'));
        this.colegios_seleccionados = this.body.colegios_seleccionados;
        this.isBuscarAprox();
        sessionStorage.removeItem('busquedaCensoGeneral');
      }

      sessionStorage.removeItem('filtrosBusqueda');
    }

    this.fillDataTable();

    this.sigaServices.get('busquedaPer_colegio').subscribe(
      (n) => {
        this.colegios = n.combooItems;
      },
      (err) => {
        //console.log(err);
      }
    );
  }

  fillDataTable() {
    this.cols = [
      {
        field: 'nif',
        header: 'censo.consultaDatosColegiacion.literal.numIden'
      },
      {
        field: 'nombre',
        header: 'administracion.parametrosGenerales.literal.nombre'
      },
      {
        field: 'apellidos',
        header: 'gratuita.mantenimientoTablasMaestra.literal.apellidos'
      },
      {
        field: 'numeroColegiado',
        header: 'censo.busquedaClientesAvanzada.literal.nColegiado'
      },
      {
        field: 'colegio',
        header: 'censo.busquedaClientesAvanzada.literal.colegio'
      },
      {
        field: 'situacion',
        header: 'censo.fichaCliente.situacion.cabecera'
      },
      {
        field: 'fechaEstado',
        header: 'censo.nuevaSolicitud.fechaEstado'
      },
      {
        field: 'residente',
        header: 'censo.ws.literal.residente'
      },
      {
        field: 'domicilio',
        header: 'solicitudModificacion.especifica.domicilio.literal'
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

  isLimpiar() {
    this.body = new BusquedaFisicaItem();
    this.colegios_seleccionados = [];
  }

  // Ficha
  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }
  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
  }
  // Métodos
  isBuscar() {

    if (this.checkFilters()) {
      if (
        this.body.numeroColegiado != undefined &&
        this.body.numeroColegiado != ''
      ) {
        if (
          this.colegios_seleccionados != undefined &&
          this.colegios_seleccionados.length > 0
        ) {
          this.search();
        } else {
          this.showFail(this.translateService.instant('censo.busquedaCensoGeneral.mensaje.introducir.colegio'));
        }
      } else {
        this.search();
      }
    }


  }

  isBuscarAprox() {
    if (this.modoBusquedaAprox) {
      this.isBuscar();
    } else {
      this.isBuscarExacta();
    }
    this.sessionInfo();
  }

  isBuscarExacta() {

    if (this.checkFiltersExact()) {
      this.progressSpinner = true;
      this.buscar = true;

      this.sigaServices
        .postPaginado('busquedaCensoGeneral_searchExact', '?numPagina=1', this.body)
        .subscribe(
          (data) => {
            this.progressSpinner = false;
            this.bodySearch = JSON.parse(data['body']);
            this.datos = this.bodySearch.busquedaFisicaItems;
          },
          (err) => {
            //console.log(err);
            this.progressSpinner = false;
          },
          () => {
            this.progressSpinner = false;
            setTimeout(() => {
              this.commonsService.scrollTablaFoco('tablaFoco');
            }, 5);
          }
        );

    } else {
      this.showFail(this.translateService.instant('censo.busquedaCensoGeneral.mensaje.introducir.numero.colegiado'));
    }
  }

  search() {
    this.progressSpinner = true;
    this.buscar = true;

    if (
      this.colegios_seleccionados != undefined &&
      this.colegios_seleccionados.length > 0
    ) {
      this.body.idInstitucion = [];
      this.colegios_seleccionados.forEach((element) => {
        this.body.idInstitucion.push(element.value);
      });
      // this.body.idInstitucion.push(this.colegios_seleccionados[0].value);
    }

    this.sigaServices
      .postPaginado('busquedaCensoGeneral_search', '?numPagina=1', this.body)
      .subscribe(
        (data) => {
          this.progressSpinner = false;
          this.bodySearch = JSON.parse(data['body']);
          this.datos = this.bodySearch.busquedaFisicaItems;
        },
        (err) => {
          //console.log(err);
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

  irFichaColegial(selectedDatos) {
    this.progressSpinner = true;
    this.body.colegios_seleccionados = this.colegios_seleccionados;

    // if (this.authenticationService.getInstitucionSession() == 2000) {
    //   this.getNoColegiado(selectedDatos);
    // } else {
    // if (
    //   this.selectedDatos.numeroInstitucion ==
    //   this.authenticationService.getInstitucionSession()
    // ) {
    // Colegiado
    this.getColegiado(selectedDatos);
    // } else if (
    //   this.selectedDatos.numeroInstitucion !=
    //   this.authenticationService.getInstitucionSession()
    // ) {
    //   this.getNoColegiado(selectedDatos);
    // }
    // }
  }

  sessionInfo() {
    sessionStorage.setItem('busquedaCensoGeneral', 'true');
    sessionStorage.setItem('filtrosBusqueda', JSON.stringify(this.body));
  }

  getColegiado(selectedDatos) {
    this.bodyColegiado.nif = selectedDatos.nif;
    this.bodyColegiado.idInstitucion = selectedDatos.numeroInstitucion;

    this.sigaServices
      .postPaginado(
        'busquedaCensoGeneral_searchColegiado',
        '?numPagina=1',
        this.bodyColegiado
      )
      .subscribe((data) => {
        this.colegiadoSearch = JSON.parse(data['body']);
        this.datosColegiados = this.colegiadoSearch.colegiadoItem;

        if (this.datosColegiados == null || this.datosColegiados == undefined ||
          this.datosColegiados.length == 0) {
          this.getNoColegiado(selectedDatos);
        } else {
          sessionStorage.setItem(
            'personaBody',
            JSON.stringify(this.datosColegiados[0])
          );
          sessionStorage.setItem(
            'esColegiado',
            JSON.stringify(true)
          );
          this.router.navigate(['/fichaColegial']);
        }
      },
        (err) => {
          this.progressSpinner = false;

        });
  }

  getNoColegiado(selectedDatos) {
    this.bodyNoColegiado.nif = selectedDatos.nif;
    this.bodyNoColegiado.idInstitucion = selectedDatos.numeroInstitucion;

    this.sigaServices
      .postPaginado(
        'busquedaNoColegiados_searchNoColegiado',
        '?numPagina=1',
        this.bodyNoColegiado
      )
      .subscribe((data) => {
        this.progressSpinner = false;
        this.noColegiadoSearch = JSON.parse(data['body']);
        this.datosNoColegiados = this.noColegiadoSearch.noColegiadoItem;

        if (this.datosNoColegiados.length > 0) {
          if (this.datosNoColegiados[0].fechaNacimiento != null) {
            this.datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
              this.datosNoColegiados[0].fechaNacimiento
            );
          }

          sessionStorage.setItem(
            'esColegiado',
            JSON.stringify(false)
          );

          sessionStorage.setItem(
            'personaBody',
            JSON.stringify(this.datosNoColegiados[0])
          );

          this.router.navigate(['/fichaColegial']);
        } else {
          this.getCliente(selectedDatos);
        }
      },
        (err) => {
          this.progressSpinner = false;

        });
  }

  getCliente(selectedDatos) {
    this.bodyNoColegiado.nif = selectedDatos.nif;

    this.sigaServices
      .postPaginado(
        'busquedaCensoGeneral_searchCliente',
        '?numPagina=1',
        this.bodyNoColegiado
      )
      .subscribe((data) => {
        this.progressSpinner = false;
        this.noColegiadoSearch = JSON.parse(data['body']);
        this.datosNoColegiados = this.noColegiadoSearch.noColegiadoItem;
        sessionStorage.setItem('esColegiado', 'false');

        if (this.datosNoColegiados.length > 0) {
          if (this.datosNoColegiados[0].fechaNacimiento != null) {
            this.datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
              this.datosNoColegiados[0].fechaNacimiento
            );
          }

          sessionStorage.setItem(
            'personaBody',
            JSON.stringify(this.datosNoColegiados[0])
          );

          this.router.navigate(['/fichaColegial']);
        } else {
          this.confirmationService.confirm({
            message: this.translateService.instant(
              'censo.busquedaCensoGeneral.mensaje.crear.noColegiado'
            ),
            icon: 'fa fa-info',
            accept: () => {
              this.bodyFisica.idInstitucion = [];
              this.bodyFisica.idInstitucion.push(selectedDatos.numeroInstitucion);
              // this.bodyFisica.idInstitucion = selectedDatos.numeroInstitucion;
              this.bodyFisica.addDestinatarioIndv = false;
              this.bodyFisica.nif = selectedDatos.nif;
              this.sigaServices
                .postPaginado('busquedaPer_searchFisica', '?numPagina=1', this.bodyFisica)
                .subscribe(
                  (data) => {
                    this.bodySearch = JSON.parse(data['body']);
                    this.datosNoColegiados = this.bodySearch.busquedaFisicaItems;
                    if (this.datosNoColegiados.length > 0) {
                      // if (this.datosNoColegiados[0].fechaNacimiento != null) {
                      // 	this.datosNoColegiados[0].fechaNacimiento = this.personaBodyFecha(
                      // 		this.datosNoColegiados[0].fechaNacimiento
                      // 	);
                      // }
                      let enviar = new SolicitudIncorporacionItem();
                      enviar.numeroIdentificacion = this.datosNoColegiados[0].nif;
                      enviar.apellido1 = this.datosNoColegiados[0].primerApellido;
                      enviar.nombre = this.datosNoColegiados[0].nombre;
                      enviar.numColegiado = this.datosNoColegiados[0].numeroColegiado;
                      enviar.idInstitucion = this.datosNoColegiados[0].numeroInstitucion;
                      enviar.apellido2 = this.datosNoColegiados[0].segundoApellido;
                      enviar.sexo = this.datosNoColegiados[0].sexo;
                      enviar.naturalDe = this.datosNoColegiados[0].naturalDe;
                      enviar.idTipoIdentificacion = this.datosNoColegiados[0].idTipoIdentificacion;
                      enviar.idEstadoCivil = this.datosNoColegiados[0].idEstadoCivil;
                      enviar.fechaNacimiento = this.datosNoColegiados[0].fechaNacimientoString;
                      enviar.idTratamiento = this.datosNoColegiados[0].idTratamiento;
                      enviar.idEstado = this.datosNoColegiados[0].situacion;
                      enviar.domicilio = this.datosNoColegiados[0].direccion;
                      enviar.idProvincia = this.datosNoColegiados[0].idProvincia;
                      enviar.idPoblacion = this.datosNoColegiados[0].idPoblacion;
                      enviar.idPais = this.datosNoColegiados[0].idPais;
                      enviar.movil = this.datosNoColegiados[0].movil;
                      enviar.telefono1 = this.datosNoColegiados[0].telefono1;
                      enviar.telefono2 = this.datosNoColegiados[0].telefono2;
                      enviar.fax1 = this.datosNoColegiados[0].fax1;
                      enviar.fax2 = this.datosNoColegiados[0].fax2;
                      enviar.correoElectronico = this.datosNoColegiados[0].correoelectronico;
                      enviar.codigoPostal = this.datosNoColegiados[0].codigoPostal;
                      enviar.nombrePoblacion = this.datosNoColegiados[0].nombrePoblacion;
                      sessionStorage.setItem('nuevoNoColegiado', JSON.stringify(enviar));
                      sessionStorage.setItem('esNuevoNoColegiado', 'true');
                      sessionStorage.setItem('busquedaCensoGeneral', 'true');
                      sessionStorage.removeItem('disabledAction');
                      sessionStorage.setItem(
                        'personaBody',
                        JSON.stringify(this.datosNoColegiados[0])
                      );
                      this.router.navigate(['/fichaColegial']);
                    } else {
                      sessionStorage.setItem('esNuevoNoColegiado', 'true');
                      sessionStorage.setItem('busquedaCensoGeneral', 'true');
                      let noColegiado = new NoColegiadoItem();
                      noColegiado.nif = selectedDatos.nif;
                      noColegiado.idPersona = selectedDatos.idPersona;
                      noColegiado.soloNombre = selectedDatos.nombre;
                      noColegiado.apellidos1 = selectedDatos.primerApellido;
                      noColegiado.apellidos2 = selectedDatos.segundoApellido;
                      noColegiado.sexo = selectedDatos.sexo;
                      sessionStorage.removeItem('disabledAction');
                      this.datosNoColegiados.push(noColegiado);
                      sessionStorage.setItem(
                        'personaBody',
                        JSON.stringify(this.datosNoColegiados[0])
                      );

                      this.router.navigate(['/fichaColegial']);
                    }
                  },
                  (err) => {
                    this.progressSpinner = false;
                  }
                );
            },
            reject: () => {
              sessionStorage.setItem('busquedaCensoGeneral', 'false');

              this.msgs = [
                {
                  severity: 'info',
                  summary: 'Info',
                  detail: this.translateService.instant(
                    'general.message.accion.cancelada'
                  )
                }
              ];
              this.progressSpinner = false;
              this.selectedDatos = [];
            }
          });
          this.progressSpinner = false;
          sessionStorage.removeItem('esNuevoNoColegiado');
        }
      },
        err => {
          this.progressSpinner = false;

        });
  }

  personaBodyFecha(fecha) {
    let f = fecha.substring(0, 10);
    let year = f.substring(0, 4);
    let month = f.substring(5, 7);
    let day = f.substring(8, 10);

    return day + '/' + month + '/' + year;
  }

  clear() {
    this.msgs = [];
  }

  showFail(message: string) {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  disableBuscar(): boolean {
    if (
      (this.body.nif != undefined && this.body.nif != '') ||
      (this.body.nombre != undefined && this.body.nombre != '') ||
      (this.body.primerApellido != undefined &&
        this.body.primerApellido != '') ||
      (this.body.segundoApellido != undefined &&
        this.body.segundoApellido != '') ||
      (this.body.numeroColegiado != undefined &&
        this.body.numeroColegiado != '') ||
      (this.colegios_seleccionados != undefined &&
        this.colegios_seleccionados.length > 0)
    ) {
      return false;
    } else {
      return true;
    }
  }

  //búsqueda con enter
  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.isBuscarAprox();
    }
  }

  checkFiltersExact() {
    if (
      this.body.nif == null ||
      this.body.nif == undefined ||
      this.body.nif.trim().length < 3
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nif != undefined) {
        this.body.nif = this.body.nif.trim();
      }

      return true;
    }
  }

  checkFilters() {
    if (
      (this.body.nombre == null ||
        this.body.nombre == undefined ||
        this.body.nombre.trim().length < 3) &&
      (this.body.primerApellido == null ||
        this.body.primerApellido == undefined ||
        this.body.primerApellido.trim().length < 3) &&
      (this.body.segundoApellido == null ||
        this.body.segundoApellido == undefined ||
        this.body.segundoApellido.trim().length < 3) &&
      (this.body.numeroColegiado == null ||
        this.body.numeroColegiado == undefined ||
        this.body.numeroColegiado.trim().length < 3) &&
      (this.colegios_seleccionados == undefined ||
        this.colegios_seleccionados.length == 0)
    ) {
      this.showSearchIncorrect();
      this.progressSpinner = false;
      return false;
    } else {
      // quita espacios vacios antes de buscar
      if (this.body.nombre != undefined) {
        this.body.nombre = this.body.nombre.trim();
      }
      if (this.body.primerApellido != undefined) {
        this.body.primerApellido = this.body.primerApellido.trim();
      }
      if (this.body.segundoApellido != undefined) {
        this.body.segundoApellido = this.body.segundoApellido.trim();
      }
      if (this.body.numeroColegiado != undefined) {
        this.body.numeroColegiado = this.body.numeroColegiado.trim();
      }

      return true;
    }
  }

  showSearchIncorrect() {
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: this.translateService.instant('general.message.incorrect'),
      detail: this.translateService.instant(
        'cen.busqueda.error.busquedageneral'
      )
    });
  }

  changeFilters() {
    this.datos = [];
    this.buscar = false;
    this.isLimpiar();

    if (this.modoBusqueda == 'aprox') {
      this.modoBusquedaAprox = true;
    } else if (this.modoBusqueda == 'exacta') {
      this.modoBusquedaAprox = false;
    }
  }

  focusInputField() {
    setTimeout(() => {
      this.someDropdown.filterInputChild.nativeElement.focus();
    }, 300);
  }

  navigateTo() {
    this.router.navigate(['/fichaColegial']);
  }

}
