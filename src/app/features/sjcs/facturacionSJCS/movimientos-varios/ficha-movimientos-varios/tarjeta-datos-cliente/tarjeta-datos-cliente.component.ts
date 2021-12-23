import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../../../../../commons/translate';
import { BusquedaFisicaItem } from '../../../../../../models/BusquedaFisicaItem';
import { ColegiadosSJCSItem } from '../../../../../../models/ColegiadosSJCSItem';
import { SigaStorageService } from '../../../../../../siga-storage.service';
import { PersistenceService } from '../../../../../../_services/persistence.service';
import { SigaServices } from '../../../../../../_services/siga.service';
import { MovimientosVariosService } from '../../movimientos-varios.service';
import { MovimientosVariosFacturacionItem } from '../../MovimientosVariosFacturacionItem';

@Component({
  selector: 'app-tarjeta-datos-cliente',
  templateUrl: './tarjeta-datos-cliente.component.html',
  styleUrls: ['./tarjeta-datos-cliente.component.scss']
})
export class TarjetaDatosClienteComponent implements OnInit {

  showFichaDatosClientes: boolean = false;
  @Input() openDatosCliente;

  @Output() opened = new EventEmitter<Boolean>();
  @Output() idOpened = new EventEmitter();

  msgs;
  nif: string = "";
  apellido1: string = "";
  apellido2: string = "";
  nombre: string = "";
  idpersona;
  ncolegiado: string = "";
  progressSpinner: boolean = false;
  bodyAux: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();

  filtros: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
  bodyFisica: BusquedaFisicaItem = null;
  bodyFisicaAux: BusquedaFisicaItem = null;

  datosColegiado: ColegiadosSJCSItem = null;
  datosColegiadoAux: ColegiadosSJCSItem = null;
  datosTarjetaResumen: any[] = [];

  datosFicha: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();
  isLetrado: boolean = false;
  descripcion;
  cantidad;

  @Output() datosTarjetaResumenEmit = new EventEmitter<any>();
  @Input() modoEdicion: boolean;
  @Output() datosColegiadoEmit = new EventEmitter<any>();
  @Output() bodyFisicaEmit = new EventEmitter<any>();
  @Output() datosClienteEmit = new EventEmitter<any>();

  @Input() showCards;
  @Input() datos;
  @Input() permisoEscritura;
  @Input() nuevoMonVarioDesdeTarjFacGene: boolean = false;

  datosCliente: MovimientosVariosFacturacionItem = new MovimientosVariosFacturacionItem();

  nuevo: boolean = false;

  constructor(private router: Router,
    private sigaStorageService: SigaStorageService, private sigaService: SigaServices, private translateService: TranslateService, private persistenceService: PersistenceService, private movimientosVariosService: MovimientosVariosService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.openDatosCliente == true) {
      if (this.showFichaDatosClientes == false) {
        this.onHideDatosClientes();
      }
    }
  }


  ngOnInit() {

    if(this.showCards){
      this.showFichaDatosClientes = true;
    }
    
    this.isLetrado = this.sigaStorageService.isLetrado;

    this.bodyAux = new MovimientosVariosFacturacionItem();
    this.datosFicha = new MovimientosVariosFacturacionItem();


    if (sessionStorage.getItem('datosPersonaFisica') != null && sessionStorage.getItem('datosPersonaFisica') != undefined && sessionStorage.getItem('datosPersonaFisica') != "") {
      this.bodyFisica = JSON.parse(sessionStorage.getItem('datosPersonaFisica'))[0];
      this.bodyFisicaAux = JSON.parse(JSON.stringify(this.bodyFisica));
      this.nif = this.bodyFisica.nif;
      this.apellido1 = this.bodyFisica.primerApellido.toString();
      this.apellido2 = this.bodyFisica.segundoApellido.toString();
      this.nombre = this.bodyFisica.nombre.toString();
      this.ncolegiado = this.bodyFisica.numeroColegiado.toString();
      this.idpersona = this.bodyFisica.idPersona;
      this.bodyFisicaEmit.emit(this.bodyFisica);
      sessionStorage.removeItem('datosPersonaFisica');
      this.showFichaDatosClientes = true;
    }


    if (sessionStorage.getItem("datosColegiado") != null && sessionStorage.getItem("datosColegiado") != undefined && sessionStorage.getItem("datosColegiado") != "") {
      this.datosColegiado = JSON.parse(sessionStorage.getItem("datosColegiado"));
      this.movimientosVariosService.datosColegiadoAux = JSON.parse(sessionStorage.getItem("datosColegiado"));
      this.nif = this.datosColegiado.nif;
      let apellidos = this.datosColegiado.apellidos.split(' ');
      this.apellido1 = apellidos[0];
      this.apellido2 = apellidos[1];
      this.nombre = this.datosColegiado.nombre;
      this.ncolegiado = this.datosColegiado.nColegiado;
      this.idpersona = this.datosColegiado.idPersona;
      this.datosColegiadoEmit.emit(this.datosColegiado);
      sessionStorage.removeItem('datosColegiado');
      this.showFichaDatosClientes = true;
    }

    if (this.nuevoMonVarioDesdeTarjFacGene) {
      this.nif = this.datos.nif;
      this.apellido1 = this.datos.apellido1;
      this.apellido2 = this.datos.apellido2;
      this.nombre = this.datos.nombre;
      this.ncolegiado = this.datos.ncolegiado;
      this.idpersona = this.datos.idPersona;
      this.datosColegiado = new ColegiadosSJCSItem();
      this.datosColegiado.nif = this.nif;
      this.datosColegiado.apellidos = `${this.apellido1} ${this.apellido2}`;
      this.datosColegiado.nombre = this.nombre;
      this.ncolegiado = this.ncolegiado;
      this.datosColegiadoEmit.emit(this.datosColegiado);
      this.showFichaDatosClientes = true;
    }

    if (this.modoEdicion) {
      this.datosFicha = this.datos;
      this.recogerDatos(this.datosFicha);
      this.bodyAux = JSON.parse(JSON.stringify(this.datosFicha)); //para que cuando se copie un objeto no se modifique en los dos, y solo en uno.
    } else {
      if (this.bodyFisica != null && this.bodyFisica != undefined) {
        this.mandarDatos(this.bodyFisica);
      } else {
        this.mandarDatos(this.datosColegiado);
      }
    }

    this.actualizarTarjetaResumen();

  }

  mandarDatos(datos) {
    this.datosCliente.idPersona = datos.idPersona;

    this.datosClienteEmit.emit(this.datosCliente);
  }
  actualizarTarjetaResumen() {

    if (this.datosFicha == null || this.datosFicha == undefined) {
      this.descripcion = "";
      this.cantidad = "";
    } else {
      this.descripcion = this.datosFicha.descripcion;
      this.cantidad = this.datosFicha.cantidad;
    }

    this.datosTarjetaResumen = [
      {
        label: "Nº Colegiado",
        value: this.ncolegiado
      },
      {
        label: "Nombre",
        value: this.nombre + " " + this.apellido1 + " " + this.apellido2
      },
      {
        label: "Descripción",
        value: this.descripcion
      },
      {
        label: "Importe",
        value: this.cantidad
      }
    ]

    this.datosTarjetaResumenEmit.emit(this.datosTarjetaResumen);


  }

  rehacerTarjetaDatosCliente(movimiento: any) {

    this.progressSpinner = true;


    this.datos[0] = { label: "Identificación: ", value: movimiento.nif };
    this.datos[1] = { label: "Nombre: ", value: movimiento.nombre };
    this.datos[2] = { label: "Apellidos: ", value: movimiento.apellidos };
    this.datos[3] = { label: "Nº Colegiado: ", value: movimiento.numeroColegiado };

    this.progressSpinner = false;


  }

  recogerDatos(datos) {
    this.nif = datos.nif;
    this.nombre = datos.nombre;
    this.apellido1 = datos.apellido1;
    this.apellido2 = datos.apellido2;
    this.ncolegiado = datos.ncolegiado;


    this.datosClienteEmit.emit(datos);

  }

  onHideDatosClientes() {

    let key = "tarjetaDatosCliente";

    this.showFichaDatosClientes = !this.showFichaDatosClientes;

    this.opened.emit(this.showFichaDatosClientes);
    this.idOpened.emit(key);

  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  buscar() {
    //BUSQUEDA GENERAL
    sessionStorage.setItem("nuevoMovVarios", "true");
    this.router.navigate(["/busquedaGeneral"]);
  }

  clear() {
    this.msgs = [];
  }

  restablecer() {

    if (!this.modoEdicion) {
      this.nif = this.movimientosVariosService.datosColegiadoAux.nif;
      this.nombre = this.movimientosVariosService.datosColegiadoAux.nombre;
      let apellidos = this.movimientosVariosService.datosColegiadoAux.apellidos.split(' ');
      this.apellido1 = apellidos[0];
      this.apellido2 = apellidos[1];
      this.ncolegiado = this.movimientosVariosService.datosColegiadoAux.nColegiado;
    } else {
      this.nif = this.bodyAux.nif.toString();
      this.nombre = this.bodyAux.nombre.toString();
      this.apellido1 = this.bodyAux.apellido1.toString();
      this.apellido2 = this.bodyAux.apellido2.toString();
      this.ncolegiado = this.datosFicha.ncolegiado.toString();

    }

    this.actualizarTarjetaResumen();
  }

  marcarObligatorio(tipoCampo: string, valor) {
    let resp = false;

    if (tipoCampo == 'input' && (valor == undefined || valor == null || valor.trim().length == 0)) {
      resp = true;
    }

    return resp;
  }

  guardar() {

    if ((this.nif == null || this.nif == undefined || this.nif == "") &&
      (this.nombre == null || this.nombre == undefined || this.nombre == "") &&
      (this.apellido1 == null || this.apellido1 == undefined || this.apellido1 == "") &&
      (this.apellido2 == null || this.apellido2 == undefined || this.apellido2 == "")) {

      this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.camposObligatorios"));
    } else {
      let url;
      if (!this.modoEdicion) {
        url = "movimientosVarios_saveClienteMovimientosVarios";
      } else {
        url = "movimientosVarios_updateClienteMovimientosVarios";
      }
      this.callSaveService(url);
    }
  }

  callSaveService(url) {
    this.progressSpinner = true;
    this.datosCliente = JSON.parse(JSON.stringify(this.datosFicha));
    this.datosCliente.nif = this.nif;
    this.datosCliente.apellido1 = this.apellido1;
    this.datosCliente.apellido2 = this.apellido2;
    this.datosCliente.nombre = this.nombre;
    this.datosCliente.ncolegiado = this.ncolegiado;


    if (this.datosCliente.idMovimiento == null || this.datosCliente.idMovimiento == undefined) {
      this.datosCliente.idMovimiento = null;
    } else {
      this.datosCliente.idMovimiento = this.datos.idMovimiento;
    }

    this.datosCliente.fechaAlta = null;

    if (!this.modoEdicion) {
      this.datosCliente.idPersona = null;
      this.datosCliente.descripcion = null;
      this.datosCliente.cantidad = null;
      this.datosCliente.nombrefacturacion = null;
      this.datosCliente.nombretipo = null;
      this.datosCliente.idAplicadoEnPago = null
      this.datosCliente.fechaApDesde = null;
      this.datosCliente.fechaApHasta = null;
      this.datosCliente.idConcepto = null;
      this.datosCliente.idPartidaPresupuestaria = null;
      this.datosCliente.ncolegiado = null;
      this.datosCliente.letrado = null;
      this.datosCliente.cantidadAplicada = null;
      this.datosCliente.cantidadRestante = null;
      this.datosCliente.idInstitucion = null;
      this.datosCliente.fechaModificacion = null;
      this.datosCliente.usuModificacion = null;
      this.datosCliente.contabilizado = null;
      this.datosCliente.idGrupoFacturacion = null;
      this.datosCliente.historico = null;
      this.datosCliente.nombrePago = null;
      this.datosCliente.tipo = null;
      this.datosCliente.certificacion = null;
      this.datosCliente.idFacturacion = null;
      this.datosCliente.motivo = null;
    }


    this.sigaService.post(url, this.datosCliente).subscribe(
      data => {

        this.movimientosVariosService.datosColegiadoAux = JSON.parse(JSON.stringify(this.datosColegiado));

        this.showMessage("success", this.translateService.instant("general.message.correct"), this.translateService.instant("general.message.accion.realizada"));
        this.progressSpinner = false;
        this.modoEdicion = true;

      },
      err => {
        this.progressSpinner = false;

        if (err.status == '403' || err.status == 403) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        } else {

          if (null != err.error && JSON.parse(err.error).error.description != "") {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant(JSON.parse(err.error).error.description));
          } else {
            this.showMessage("error", this.translateService.instant("general.message.incorrect"), this.translateService.instant("general.message.error.realiza.accion"));
          }

        }
      },
      () => {
        this.progressSpinner = false;
      }
    );
  }

}
