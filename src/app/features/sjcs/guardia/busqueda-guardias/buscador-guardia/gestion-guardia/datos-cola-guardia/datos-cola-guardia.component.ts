import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DatePipe } from '../../../../../../../../../node_modules/@angular/common';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { TablaDinamicaColaGuardiaComponent } from '../../../../../../../commons/tabla-dinamica-cola-guardia/tabla-dinamica-cola-guardia.component';

@Component({
  selector: 'app-datos-cola-guardia',
  templateUrl: './datos-cola-guardia.component.html',
  styleUrls: ['./datos-cola-guardia.component.scss']
})
export class DatosColaGuardiaComponent implements OnInit {

  msgs = [];
  openFicha: boolean = false;
  permitirGuardar: boolean = false;
  rowsPerPage;
  cols = [];
  fecha;
  datosInicial;
  body = new GuardiaItem();
  datos;
  nuevo;
  historico: boolean = false;
  progressSpinner: boolean = false;
  updateInscripciones = [];
  selectionMode = "single";
  resumenColaGuardia = "";
  botActivos: boolean = true;

  @Input() permisoEscritura: boolean = false;
  @Input() modoEdicion = false;
  @ViewChild(TablaDinamicaColaGuardiaComponent) tabla;

  constructor(private sigaService: SigaServices,
    private persistenceService: PersistenceService,
    public datepipe: DatePipe,
    public commonsService: CommonsService) { }

  ngOnInit() {
    this.historico = this.persistenceService.getHistorico();

    this.sigaService.datosRedy$.subscribe(
      data => {
        if (data.body)
          data = JSON.parse(data.body)

        this.body.nombre = data.nombre;
        this.body.apellido1 = data.apellidos1;
        this.body.apellido2 = data.apellidos2;
        this.body.porGrupos = data.porGrupos;
        // this.selectionMode = data.porGrupos ? "multiple" : "single"
        this.body.nombreApe = data.nombre, data.apellido1, data.apellido2;
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.idGuardia = data.idGuardia;
        this.body.idTurno = data.idTurno;
        this.body.porGrupos = data.porGrupos == "1" ? true : false;

        this.body.letradosIns = new Date();
        this.getColaGuardia();
      });

  }

  abreCierraFicha() {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha
  }

  disabledSave() {
    if (!this.permitirGuardar || !this.permisoEscritura) {
      return true;
    } else return false;
  }
  save() {

    this.progressSpinner = true;
    this.sigaService.post(
      "busquedaGuardias_getColaGuardia", this.body).subscribe(
        data => {
          this.datos = JSON.parse(data.body).inscripcionesItem;

          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          this.botActivos = true;

          this.progressSpinner = false;

        },
        err => {
          console.log(err);
          this.progressSpinner = false;

        }
      );

  }


  transformDate(fecha) {
    if (fecha)
      fecha = new Date(fecha).toLocaleDateString();
    this.body.letradosIns = this.datepipe.transform(fecha, 'dd/MM/yyyy')
  }

  changeOrden(dato) {
    let findDato = this.datosInicial.find(item => item.ordenCola === dato.ordenCola);

    if (findDato != undefined) {

      // this.updateTiposActuacion.push(dato);
      if (dato.orden != findDato.orden) {

        let findUpdate = this.updateInscripciones.find(item => item.ordenCola === dato.ordenCola);
        this.permitirGuardar = true
        if (findUpdate == undefined) {
          this.updateInscripciones.push(dato);
        }
      }
    }
  }

  getColaGuardia() {
    if (this.body.letradosIns instanceof Date) // Se comprueba si es una fecha por si es necesario cambiar el formato.
      this.transformDate(this.body.letradosIns); // Si no es una fecha es que ya está formateada porque viene del back.
    this.progressSpinner = true;
    this.sigaService.post(
      "busquedaGuardias_getColaGuardia", this.body).subscribe(
        data => {
          this.datos = JSON.parse(data.body).inscripcionesItem;
          this.datos = this.datos.map(it => {
            it.nombreApe = it.nombre + " " + it.apellido1 + " " + it.apellido2;
            return it;
          });
          this.datosInicial = JSON.parse(JSON.stringify(this.datos));
          if (this.datos && this.datos.length > 0)
            this.resumenColaGuardia = this.datos[0].nColegiado + " " + this.datos[0].nombreApe;
          if (this.datosInicial.length > 0)
            this.resumenColaGuardia = this.resumenColaGuardia.concat(" ... " + this.datos[this.datos.length - 1].nColegiado + " " + this.datos[this.datos.length - 1].nombreApe
              + " ... " + this.datos.length, " inscritos");
          this.progressSpinner = false;

        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
  }

  fillFecha(event) {
    this.body.letradosIns = event;
    this.getColaGuardia();
  }
  ultimo() {
    // if (this.permisoEscritura && this.historico && this.tabla.selectedDatos) {
    this.progressSpinner = true;
    this.body.idPersonaUltimo = this.tabla.selectedDatos.idPersona;
    this.sigaService.post(
      "busquedaGuardias_getUltimo", this.body).subscribe(
        data => {
          this.getColaGuardia();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      );
    // }
  }

  duplicar() {
    this.datos = [JSON.parse(JSON.stringify(this.tabla.selectedDatos)), ...this.datos];
    this.datos[0].numeroGrupo = "";
    this.datos[0].orden = "";
    let menorOrdenCola = 0;
    this.datos.forEach(element => {
      if (+element.ordenCola <= menorOrdenCola)
        menorOrdenCola = +element.ordenCola - 1;
    });
    this.datos[0].ordenCola = menorOrdenCola;
    this.botActivos = false;
  }

  rest() {
    if (this.datosInicial && this.datos) {
      this.datos = JSON.parse(JSON.stringify(this.datosInicial));
      this.tabla.table.reset();
      this.tabla.table.sortOrder = 0;
      this.tabla.table.sortField = '';
      this.tabla.selectedDatos = null;
      // this.tabla.buscadores = this.tabla.buscadores.map(it => it = ""); NO OLVIDAAAAAAAAR!!!!!
      this.botActivos = true;

    }
  }

  duplicarDisabled() {
    if (this.tabla && this.tabla.selectedDatos && this.tabla.selectedDatos.length != 0) return false;
    return true;
  }
  clear() { }
}
