import { Component, OnInit } from '@angular/core';
import { ComboItem } from '../../../../models/ComboItem';

@Component({
  selector: 'app-filtros-facturas',
  templateUrl: './filtros-facturas.component.html',
  styleUrls: ['./filtros-facturas.component.scss']
})
export class FiltrosFacturasComponent implements OnInit {


  // variables para desplegar/minimizar secciones del componente
  showDatosGenerales: boolean = true;
  showDatosAgrupacion: boolean = true;
  showCliente: boolean = true;
  showComunicacionesCobrosRecobros: boolean = true;

  // crear un body con el item (después de haber creado el item)


  // crear combo para opciones en un dropdown
  comboEstados: ComboItem[] = [];

  // Mostrar u ocultar filtros de datos generales
  onHideDatosGenerales(): void {
    this.showDatosGenerales = !this.showDatosGenerales;
    }

  // Mostrar u ocultar filtros de datos de agrupacion
  onShowDatosAgrupacion(): void {
    this.showDatosAgrupacion = !this.showDatosAgrupacion;
    }

  // Mostrar u ocultar filtros de datos de agrupacion
  onShowCliente(): void {
    this.showCliente = !this.showCliente;
    }

  // Mostrar u ocultar filtros de datos de agrupacion
  onShowComunicacionesCobrosRecobros(): void {
    this.showComunicacionesCobrosRecobros = !this.showComunicacionesCobrosRecobros;
    }

  constructor() { }

  ngOnInit() {
  }

}
