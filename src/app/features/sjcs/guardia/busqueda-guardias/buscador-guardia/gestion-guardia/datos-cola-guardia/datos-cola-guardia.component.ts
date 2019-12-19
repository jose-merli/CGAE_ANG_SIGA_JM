import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DatePipe } from '../../../../../../../../../node_modules/@angular/common';
import { CommonsService } from '../../../../../../../_services/commons.service';

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

  @Input() permisoEscritura: boolean = false;
  @Input() modoEdicion = false;

  @ViewChild("app-tabla-dinamica") table;

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
        this.body.nombreApe = data.nombre, data.apellido1, data.apellido2;
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.idGuardia = data.idGuardia;
        this.body.idTurno = data.idTurno;
        this.body.porGrupos = data.porGrupos;
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
    this.transformDate(this.body.letradosIns);
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
    //  this.getColaGuardia();
  }

  zuletzt() {
    // this.progressSpinner = true;
    this.sigaService.post(
      "busquedaGuardias_getUltimo", this.body).subscribe(
        data => {
          this.getColaGuardia();
        },
        err => {
          console.log(err);
          this.progressSpinner = false;
        }
      )
  }



  clear() { }
}
