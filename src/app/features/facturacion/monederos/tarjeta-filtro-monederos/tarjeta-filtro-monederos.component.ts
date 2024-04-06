import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Message } from "primeng/components/common/api";
import { CommonsService } from "../../../../_services/commons.service";
import { SigaServices } from "../../../../_services/siga.service";
import { BuscadorColegiadosExpressComponent } from "../../../../commons/buscador-colegiados-express/buscador-colegiados-express.component";
import { TranslateService } from "../../../../commons/translate";
import { FiltrosMonederoItem } from "../../../../models/FiltrosMonederoItem";
import { SigaStorageService } from "../../../../siga-storage.service";

@Component({
  selector: "app-tarjeta-filtro-monederos",
  templateUrl: "./tarjeta-filtro-monederos.component.html",
  styleUrls: ["./tarjeta-filtro-monederos.component.scss"],
})
export class TarjetaFiltroMonederosComponent implements OnInit {
  msgs: Message[] = []; //Para mostrar los mensajes p-growl y dialogos de confirmacion
  progressSpinner: boolean = false;

  filtrosMonederoItem: FiltrosMonederoItem = new FiltrosMonederoItem(); //Guarda los valores seleccionados/escritos en los campos

  disabledBusquedaExpress: boolean = false;
  showDatosGenerales: boolean = true;
  showDatosClientes: boolean = false;
  isLetrado: boolean = false;

  @Output() busqueda = new EventEmitter();

  @ViewChild(BuscadorColegiadosExpressComponent) buscadorColegiadoExpress;

  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private router: Router, private commonsService: CommonsService, private sigaStorageService: SigaStorageService) {}

  ngOnInit() {
    this.filtrosMonederoItem.fechaHasta = new Date();

    //En la documentación funcional se pide que por defecto aparezca el campo con la fecha de dos años antes
    let today = new Date();
    this.filtrosMonederoItem.fechaDesde = new Date(new Date().setFullYear(today.getFullYear() - 2));

    this.isLetrado = this.sigaStorageService.isLetrado;
    this.showDatosClientes = this.isLetrado;

    if (sessionStorage.getItem("filtrosMonedero")) {
      this.filtrosMonederoItem = JSON.parse(sessionStorage.getItem("filtrosMonedero"));
      sessionStorage.removeItem("filtrosMonedero");

      if (this.filtrosMonederoItem.fechaHasta != undefined && this.filtrosMonederoItem.fechaHasta != null) {
        this.filtrosMonederoItem.fechaHasta = new Date(this.filtrosMonederoItem.fechaHasta);
      }
      if (this.filtrosMonederoItem.fechaDesde != undefined && this.filtrosMonederoItem.fechaDesde != null) {
        this.filtrosMonederoItem.fechaDesde = new Date(this.filtrosMonederoItem.fechaDesde);
      }

      if (this.filtrosMonederoItem.idPersonaColegiado != null) {
        this.sigaServices.post("designaciones_searchAbogadoByIdPersona", this.filtrosMonederoItem.idPersonaColegiado).subscribe(
          (n) => {
            let data = JSON.parse(n.body).colegiadoItem;
            if (data != null && data.length == 1) {
              this.buscadorColegiadoExpress.setClienteSession(data[0]);
            }
          },
          () => {
            this.buscar();
          },
        );
      } else {
        this.buscar();
      }
    }
  }

  onHideDatosGenerales() {
    this.showDatosGenerales = !this.showDatosGenerales;
  }

  onHideDatosClientes() {
    if (!this.isLetrado) {
      this.showDatosClientes = !this.showDatosClientes;
    }
  }

  // Control de fechas
  getFechaHastaCalendar(fechaInputDesde: Date, fechainputHasta: Date): Date {
    if (fechaInputDesde != undefined && fechainputHasta != undefined) {
      const one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      const fechaDesde = new Date(fechaInputDesde).getTime();
      const fechaHasta = new Date(fechainputHasta).getTime();
      const msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < one_day) fechainputHasta = undefined;
    }
    return fechainputHasta;
  }

  getFechaDesdeCalendar(fechaInputesde: Date, fechaInputHasta: Date): Date {
    if (fechaInputesde != undefined && fechaInputHasta != undefined) {
      const one_day = 1000 * 60 * 60 * 24;

      // convertir fechas en milisegundos
      const fechaDesde = new Date(fechaInputesde).getTime();
      const fechaHasta = new Date(fechaInputHasta).getTime();
      const msRangoFechas = fechaHasta - fechaDesde;

      if (msRangoFechas < one_day) fechaInputesde = undefined;
    }
    return fechaInputesde;
  }

  fillFechaDesde(event) {
    this.filtrosMonederoItem.fechaDesde = event;
  }

  fillFechaHasta(event) {
    this.filtrosMonederoItem.fechaHasta = event;
  }

  limpiar() {
    this.filtrosMonederoItem = new FiltrosMonederoItem();
    this.buscadorColegiadoExpress.limpiarCliente(true);
  }

  buscar() {
    this.filtrosMonederoItem.idPersonaColegiado = this.buscadorColegiadoExpress.idPersona;
    this.busqueda.emit();
  }

  nuevoMonedero() {
    this.progressSpinner = true;
    sessionStorage.removeItem("FichaMonedero");
    this.router.navigate(["/fichaMonedero"]);
  }

  //Inicializa las propiedades necesarias para el dialogo de confirmacion
  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg,
    });
  }

  //Borra el mensaje de notificacion p-growl mostrado en la esquina superior derecha cuando pasas el puntero del raton sobre el
  clear() {
    this.msgs = [];
  }
}
