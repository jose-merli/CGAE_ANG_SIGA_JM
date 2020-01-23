import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-configuracion-ficheros',
  templateUrl: './configuracion-ficheros.component.html',
  styleUrls: ['./configuracion-ficheros.component.scss']
})
export class ConfiguracionFicherosComponent implements OnInit {
  showFicha: boolean = false;

  @Input() permisos;

  constructor() { }

  ngOnInit() {
  }

  onHideFicha() {
    this.showFicha = !this.showFicha;
  }
}
