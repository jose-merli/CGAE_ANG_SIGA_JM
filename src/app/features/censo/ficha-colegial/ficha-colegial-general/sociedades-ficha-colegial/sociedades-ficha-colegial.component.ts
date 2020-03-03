import { Component, OnInit, ChangeDetectorRef, ViewChild, SimpleChanges, Input, ViewEncapsulation } from '@angular/core';
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
  colsSociedades = [];
  @Input() tarjetaSociedades;
  checkGeneralBody;
  openFicha: boolean = false;
  @ViewChild("tableSociedades")
  tableSociedades: DataTable;
  fichaPosible = {
    key: "sociedades",
    activa: false
  };
  selectedDatosSociedades;
  rowsPerPage = [];
  mensajeResumen: String;

  @Input() idPersona;
  constructor(private sigaServices: SigaServices,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
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
      this.mensajeResumen = this.translateService.instant(
        "aplicacion.cargando"
      );
      this.generalBody = JSON.parse(sessionStorage.getItem("personaBody"));
    }

    this.getCols();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.idPersona != undefined) {
      this.searchSocieties();
    }
    if (JSON.parse(sessionStorage.getItem("esNuevoNoColegiado"))) {
      // this.desactivarVolver = false;
      this.activacionTarjeta = false;

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
          this.mensajeResumen = this.datosSociedades.length + "";
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }, () => {
          if (this.datosSociedades.length > 0) {
            this.mostrarDatosSociedades = true;
            for (let i = 0; i <= this.datosSociedades.length - 1; i++) {
              this.DescripcionSociedades = this.datosSociedades[i];
            }
          }
        }
      );
  }

  redireccionarSociedades(datos) {
    // this.usuarioBody = JSON.parse(sessionStorage.getItem("usuarioBody"));
    sessionStorage.setItem("usuarioBody", JSON.stringify(datos));
    this.router.navigate(["/fichaPersonaJuridica"]);
  }

  onChangeRowsPerPagesSociedades(event) {
    this.selectedItemSociedades = event.value;
    this.changeDetectorRef.detectChanges();
    this.tableSociedades.reset();
  }

  abreCierraFicha() {
    if (this.activacionTarjeta) {
      this.fichaPosible.activa = !this.fichaPosible.activa;
      this.openFicha = !this.openFicha;
    }
  }


  esFichaActiva() {
    return this.fichaPosible.activa;
  }



}
