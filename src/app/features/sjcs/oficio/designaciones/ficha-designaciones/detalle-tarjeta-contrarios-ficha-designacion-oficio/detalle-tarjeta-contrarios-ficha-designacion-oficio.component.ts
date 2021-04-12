import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-detalle-tarjeta-contrarios-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-contrarios-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-contrarios-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaContrariosFichaDesignacionOficioComponent implements OnInit {

  @Input() campos;
  cols;
  rowsPerPage;

  @ViewChild("table") table;

  constructor() { }

  ngOnInit() {
    this.getCols();    
  }

  getCols() {

    this.cols = [
      { field: "identificador", header: "justiciaGratuita.oficio.designas.contrarios.identificador" },
      { field: "nombrepersona", header: "administracion.parametrosGenerales.literal.nombre.apellidos" },
      { field: "abogado", header: "justiciaGratuita.oficio.designas.contrarios.abogado" },
      { field: "procurador", header: "justiciaGratuita.oficio.designas.contrarios.procurador" }
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
}
