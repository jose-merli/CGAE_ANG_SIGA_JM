import { Component, OnInit, ChangeDetectorRef, ViewChild, SimpleChanges, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { SigaServices } from '../../../../../_services/siga.service';
import { PersonaJuridicaObject } from '../../../../../models/PersonaJuridicaObject';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { DataTable } from '../../../../../../../node_modules/primeng/primeng';
import { TranslateService } from '../../../../../commons/translate';
import { FichaColegialGeneralesItem } from '../../../../../models/FichaColegialGeneralesItem';
import { ControlAccesoDto } from '../../../../../models/ControlAccesoDto';

@Component({
  selector: 'app-sociedades-ficha-colegial',
  templateUrl: './sociedades-ficha-colegial.component.html',
  styleUrls: ['./sociedades-ficha-colegial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SociedadesFichaColegialComponent implements OnInit {
  datosSociedades: any[] = [];
  progressSpinner: boolean = false;
  sociedadesBody: PersonaJuridicaObject = new PersonaJuridicaObject();
  DescripcionSociedades;
  mostrarDatosSociedades: boolean = false;
  selectedItemRegtel: number = 10;
  selectedItemSociedades: number = 10;
  activacionTarjeta: boolean = false;
  generalBody;
  mostrarNumero: Boolean = false;
  message;
  messageNoContent;
  colsSociedades = [];
  @Input() tarjetaSociedades;
  checkGeneralBody;
  openFicha: boolean = false;
  @ViewChild("tableSociedades")
  tableSociedades: DataTable;
  fichasPosibles = [
    {
      key: "sociedades",
      activa: false
    }
  ];
  selectedDatosSociedades:any[];
  rowsPerPage = [];
  disabledAction:boolean = false;
  emptyLoadFichaColegial: boolean = false;
  @Input() idPersona;
  @Input() openSocie;
  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter<Boolean>();
  constructor(private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem("disabledAction") == "true") { // Esto disablea tela de cosas funciona como medio permisos. 
      // Es estado baja colegial (historico?)
      this.disabledAction = true;
    } else {
      this.disabledAction = false;
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.emptyLoadFichaColegial = false;
      this.activacionTarjeta = false;
    } else {
      this.activacionTarjeta = true;
    }
    if (
      sessionStorage.getItem("personaBody") != null &&
      sessionStorage.getItem("personaBody") != undefined &&
      JSON.parse(sessionStorage.getItem("esNuevoNoColegiado")) != true
    ) {
      this.generalBody = new FichaColegialGeneralesItem();
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
    }

    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.idPersona != undefined && (this.tarjetaSociedades == "3" || this.tarjetaSociedades =="2")) {
      this.searchSocieties();
    }
    if (this.openSocie == true) {
      if (this.openFicha == false) {
        this.abreCierraFicha('sociedades');
      }
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      this.activacionTarjeta = false;
      this.emptyLoadFichaColegial = false;

      // sessionStorage.removeItem("esNuevoNoColegiado");
      // this.onInitGenerales();
    } else {
      this.activacionTarjeta = true;
    }
  }

  getCols() {
    this.colsSociedades = [
      {
        field: "tipo",
        header: "censo.busquedaClientesAvanzada.literal.tipoCliente"
      },
      { field: "nif", header: "administracion.usuarios.literal.NIF" },
      {
        field: "denominacion",
        header: "censo.consultaDatosGenerales.literal.denominacion"
      },
      {
        field: "fechaConstitucion",
        header: "censo.general.literal.FechaConstitucion"
      },
      {
        field: "abreviatura",
        header: "gratuita.definirTurnosIndex.literal.abreviatura"
      },
      {
        field: "numeroIntegrantes",
        header: "censo.general.literal.numeroIntegrantes"
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
  activarPaginacionSociedades() {
    if (!this.datosSociedades || this.datosSociedades.length == 0) return false;
    else return true;
  }

  searchSocieties() {
    this.mostrarNumero = false;
    this.sigaServices
      .postPaginado(
        "fichaColegialSociedades_searchSocieties",
        "?numPagina=1",
        this.idPersona
      )
      .subscribe(
        data => {
          this.progressSpinner = false;
          this.sociedadesBody = JSON.parse(data["body"]);
          this.datosSociedades = this.sociedadesBody.busquedaJuridicaItems;
        },
        err => {
          //console.log(err);
          this.progressSpinner = false;
          this.mostrarNumero = true;
        }, () => {
          if (this.datosSociedades.length > 0) {
            this.mostrarDatosSociedades = true;
            this.DescripcionSociedades = this.datosSociedades[0];
          }
          if (this.datosSociedades.length == 0) {
            this.message = this.datosSociedades.length.toString();
            this.messageNoContent = this.translateService.instant(
              "general.message.no.registros"
            );
            this.mostrarNumero = true;

          } else {
            this.message = this.datosSociedades.length.toString();
            this.mostrarNumero = true;

          }
        }
      );
  }

  redireccionarSociedades(datos:any) {
    this.selectedDatosSociedades = [];
    this.selectedDatosSociedades.push(datos);
    // this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody")); 
    sessionStorage.setItem("usuarioBody", JSON.stringify(this.selectedDatosSociedades));
    this.router.navigate(["/fichaPersonaJuridica"]);
  }

  onChangeRowsPerPagesSociedades(event) {
    this.selectedItemSociedades = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSociedades.reset();
  }

  /*abreCierraFicha() {
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }

  }*/
  getFichaPosibleByKey(key): any {
    let fichaPosible = this.fichasPosibles.filter(elto => {
      return elto.key === key;
    });
    if (fichaPosible && fichaPosible.length) {
      return fichaPosible[0];
    }
    return {};
  }

  abreCierraFicha(key) {
    let fichaPosible = this.getFichaPosibleByKey(key);

    if (
      key == "generales" &&
      !this.activacionTarjeta &&
      !this.emptyLoadFichaColegial
    ) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    if (this.activacionTarjeta) {
      fichaPosible.activa = !fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
    this.opened.emit(this.openFicha);
    this.idOpened.emit(key);
  }



  esFichaActiva(key) {
    // let fichaPosible = this.getFichaPosibleByKey(key);
    // return fichaPosible.activa;
    return this.openFicha;
  }

  isOpenReceive(event) {
    let fichaPosible = this.esFichaActiva(event);
    if (fichaPosible == false) {
      this.abreCierraFicha(event);
    }
    // window.scrollTo(0,0);
  }

}
