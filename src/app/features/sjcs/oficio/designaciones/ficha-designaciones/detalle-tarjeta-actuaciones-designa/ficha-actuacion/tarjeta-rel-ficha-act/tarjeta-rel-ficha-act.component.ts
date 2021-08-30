import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tarjeta-rel-ficha-act',
  templateUrl: './tarjeta-rel-ficha-act.component.html',
  styleUrls: ['./tarjeta-rel-ficha-act.component.scss']
})
export class TarjetaRelFichaActComponent implements OnInit, OnChanges {

  @Input() relaciones: any;
  @Output() changeDataEvent = new EventEmitter<any>();

  constructor(private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }

  ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesRelaciones)
      .then(respuesta => {
        let permisoEscritura = respuesta;

        if (permisoEscritura == undefined) {
          sessionStorage.setItem("codError", "403");
          sessionStorage.setItem(
            "descError",
            this.translateService.instant("generico.error.permiso.denegado")
          );
          this.router.navigate(["/errorAcceso"]);
        }

      }
      ).catch(error => console.error(error));

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.relaciones.currentValue) {
      let campos;
      if (this.relaciones == undefined && this.relaciones == null || this.relaciones.length == 0) {
        campos = [{
          "key": "Nº total",
          "value": "No existen relaciones asociadas a la actuación"
        }];

      } else {
        campos = [{
          "key": "Nº total",
          "value": this.relaciones.length
        }];
      }

      let event = {
        tarjeta: 'sjcsDesigActuaOfiRela',
        campos: campos
      }
      this.changeDataEvent.emit(event);

    }

  }

}
