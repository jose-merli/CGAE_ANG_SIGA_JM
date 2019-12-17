import { Component, OnInit, Input } from '@angular/core';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { GuardiaItem } from '../../../../../../../models/guardia/GuardiaItem';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { DatePipe } from '../../../../../../../../../node_modules/@angular/common';

@Component({
  selector: 'app-datos-cola-guardia',
  templateUrl: './datos-cola-guardia.component.html',
  styleUrls: ['./datos-cola-guardia.component.scss']
})
export class DatosColaGuardiaComponent implements OnInit {

  openFicha: boolean = false;
  rowsPerPage;
  cols = [];
  fecha;
  bodyInicial;
  body = new GuardiaItem();
  datos;
  historico: boolean = false;
  progressSpinner: boolean = false;

  @Input() permisoEscritura: boolean = false;
  @Input() modoEdicion = false;

  constructor(private sigaService: SigaServices,
    private persistenceService: PersistenceService,
    public datepipe: DatePipe) { }

  ngOnInit() {
    this.getCols();
    this.historico = this.persistenceService.getHistorico();

    this.sigaService.datosRedy$.subscribe(
      data => {
        if (data.body)
          data = JSON.parse(data.body)

        this.body.nombre = data.nombre;
        this.body.apellido1 = data.apellidos1;
        this.body.apellido2 = data.apellidos2;
        this.body.nombreApe = data.nombre, data.apellido1, data.apellido2;
        this.body.idOrdenacionColas = data.idOrdenacionColas;
        this.body.idGuardia = data.idGuardia;
        this.body.idTurno = data.idTurno;
        this.body.porGrupos = data.porGrupos;
        this.body.letradosIns = new Date();
        this.getColaGuardia();
        this.bodyInicial = JSON.parse(JSON.stringify(this.body));
      });
  }

  abreCierraFicha() {
    if (this.modoEdicion)
      this.openFicha = !this.openFicha
  }

  disabledSave() {

  }
  save() { }

  getCols() {

    this.cols = [
      { field: "grupo", header: "dato.jgr.guardia.guardias.grupo", editable: true },
      { field: "orden", header: "administracion.informes.literal.orden", editable: true },
      { field: "nColegiado", header: "censo.busquedaClientesAvanzada.literal.nColegiado", editable: false },
      { field: "nombreApe", header: "administracion.parametrosGenerales.literal.nombre.apellidos", editable: false },
      { field: "fechaValidez", header: "dato.jgr.guardia.guardias.fechaValidez", editable: false },
      { field: "fechabaja", header: "dato.jgr.guardia.guardias.fechaBaja", editable: false },
      { field: "compensaciones", header: "justiciaGratuita.oficio.turnos.compensaciones", editable: false },
      { field: "saltos", header: "justiciaGratuita.oficio.turnos.saltos", editable: false },
    ];
    // this.cols.forEach(it => this.buscadores.push(""))
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

  transformDate(fecha) {
    if (fecha)
      fecha = new Date(fecha).toLocaleDateString();
    this.body.letradosIns = this.datepipe.transform(fecha, 'dd/MM/yyyy')
  }

  getColaGuardia() {
    this.transformDate(this.body.letradosIns);
    this.progressSpinner = true;
    this.sigaService.post(
      "busquedaGuardias_getColaGuardia", this.body).subscribe(
        data => {
          this.datos = JSON.parse(data.body).inscripcionesItem;
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

}
