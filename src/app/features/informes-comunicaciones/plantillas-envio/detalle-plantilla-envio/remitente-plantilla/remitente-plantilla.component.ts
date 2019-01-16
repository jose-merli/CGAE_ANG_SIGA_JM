import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DatosRemitentePlantillaItem } from '../../../../../models/DatosRemitentePlantillaItem';
import { SigaServices } from "./../../../../../_services/siga.service";
import { DataTable } from "primeng/datatable";
import { PlantillaEnvioItem } from '../../../../../models/PlantillaEnvioItem';
import { Router } from "@angular/router";
import { Message, ConfirmationService } from "primeng/components/common/api";

@Component({
  selector: 'app-remitente-plantilla',
  templateUrl: './remitente-plantilla.component.html',
  styleUrls: ['./remitente-plantilla.component.scss']
})
export class RemitentePlantillaComponent implements OnInit {
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

  @ViewChild('table') table: DataTable;
  selectedDatos


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
    },

  ];


  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private sigaServices: SigaServices
  ) {



  }

  ngOnInit() {

    this.getDatos();
    this.getInstitucion();
    this.getComboPais();
    this.getComboProvincias();

    this.selectedItem = 5;

    this.cols = [
      { field: 'tipo', header: 'Tipo' },
      { field: 'valor', header: 'Valor' }
    ]

    this.datos = [
      { tipo: 'Teléfono', value: 'tlf', valor: '' },
      { tipo: 'Fax', value: 'fax', valor: '' },
      { tipo: 'Móvil', value: 'mvl', valor: '' },
      { tipo: 'Correo electrónico', value: 'email', valor: '' },
      { tipo: 'Página web', value: 'web', valor: '' },
    ]

    this.comboDirecciones = [
      {
        label: 'seleccione..', value: null
      },
    ]


    // this.body.idTipoEnvio = this.tiposEnvio[1].value;
  }

  abreCierraFicha() {
    if (sessionStorage.getItem("crearNuevaPlantilla") == null) {
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
      /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(this.remitente.codigoPostal)
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
    });
  }



  getDatos() {
    if (sessionStorage.getItem("plantillasEnvioSearch") != null) {
      this.body = JSON.parse(sessionStorage.getItem("plantillasEnvioSearch"));

      if (sessionStorage.getItem("remitente") != null) {
        this.body.idPersona = JSON.parse(sessionStorage.getItem("remitente")).idPersona;
        this.openFicha = true;
        if (this.body.idPersona != null && this.body.idPersona != '') {
          sessionStorage.removeItem("abrirNotario");
          this.getPersonaDireccion();
        }
      }
      else {
        this.getResultados();
      }

    }


  }

  getResultados() {

    let objRemitente = {
      idTipoEnvios: this.body.idTipoEnvios,
      idPlantillaEnvios: this.body.idPlantillaEnvios
    }
    //llamar al servicio de busqueda
    this.sigaServices
      .post("plantillasEnvio_detalleRemitente", objRemitente)
      .subscribe(
        data => {
          this.remitente = JSON.parse(data["body"]);
          this.direccion = this.remitente.direccion[0];
          this.showComboDirecciones = false;
          this.remitenteInicial = JSON.parse(JSON.stringify(this.remitente));

          console.log(this.direccion)
          let filtro = '';
          this.getComboPoblacionInicial(filtro);

        },
        err => {
          console.log(err);
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

          this.direcciones = this.remitente.direccion;
          this.comboDirecciones = [];
          this.remitenteInicial = JSON.parse(sessionStorage.getItem("remitenteInicial"));

          if (this.direcciones && this.direcciones.length >= 1) {
            if (this.direcciones.length > 1) {
              this.showComboDirecciones = true;
              this.direcciones.map(direccion => {
                this.comboDirecciones.push({ label: direccion.domicilio, value: direccion.idDireccion });
                this.direccion = this.remitente.direccion[0];
              })

            } else {
              this.showComboDirecciones = false;
              this.direccion = this.remitente.direccion[0];
            }

            console.log(this.direccion)
            let filtro = '';
            this.getComboPoblacionInicial(filtro);


          }
          // this.direcciones = this.remitente.direccion;

        },
        err => {
          console.log(err);
        },
        () => { }
      );

  }

  buscar() {
    sessionStorage.setItem("abrirRemitente", "true");
    sessionStorage.setItem("remitenteInicial", JSON.stringify(this.remitenteInicial));
    this.router.navigate(["/busquedaGeneral"]);
    if (this.direcciones && this.direcciones.length >= 1) {
      if (this.direcciones.length > 1) {
        this.showComboDirecciones = true;
        this.direcciones.map(direccion => {
          this.comboDirecciones.push({ label: direccion.domicilio, value: direccion.idDireccion });
        })
      } else {
        this.showComboDirecciones = false;
        this.direccion = this.remitente.direccion[0];
      }




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
      error => { },
    );
  }


  getComboProvincias() {
    this.sigaServices.get("integrantes_provincias").subscribe(
      n => {
        this.comboProvincia = n.combooItems;
      },
      err => {
        console.log(err);
      }
    );
  }

  getComboPoblacionInicial(filtro) {
    filtro = '';
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
        error => { },

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
      idPersona: this.body.idPersona,
      idDireccion: this.direccion.idDireccion,
      idPlantillaEnvios: this.body.idPlantillaEnvios,
      idTipoEnvios: this.body.idTipoEnvios
    }

    this.sigaServices
      .post("plantillasEnvio_guardarRemitente", objGuardar)
      .subscribe(
        data => {
          // this.bodyInicial = JSON.parse(JSON.stringify(this.body));
          this.remitenteInicial = JSON.parse(JSON.stringify(this.remitente));
          sessionStorage.removeItem("remitente");
          sessionStorage.removeItem("remitenteInicial");
          this.showSuccess('Se ha guardado la plantilla correctamente');

        },
        err => {
          console.log(err);
          this.showFail('Error al guardar la plantilla');
        },
        () => { }
      );


  }

  restablecer() {
    this.remitente = JSON.parse(JSON.stringify(this.remitenteInicial));
    this.direcciones = this.remitente.direccion;
    if (this.direcciones && this.direcciones.length >= 1) {
      if (this.direcciones.length > 1) {
        this.showComboDirecciones = true;
        this.direcciones.map(direccion => {
          this.comboDirecciones.push({ label: direccion.domicilio, value: direccion.idDireccion });
          this.direccion = this.remitente.direccion[0];
        })
      } else {
        this.showComboDirecciones = false;
        this.direccion = this.remitente.direccion[0];
      }
    }
  }

}
