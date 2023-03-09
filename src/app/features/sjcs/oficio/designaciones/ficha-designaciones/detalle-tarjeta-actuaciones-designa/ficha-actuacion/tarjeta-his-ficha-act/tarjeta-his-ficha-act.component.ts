import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { procesos_oficio } from '../../../../../../../../permisos/procesos_oficio';
import { Col } from '../../detalle-tarjeta-actuaciones-designa.component';
import { CommonsService } from '../../../../../../../../_services/commons.service';
import { TranslateService } from '../../../../../../../../commons/translate/translation.service';
import { Router } from '@angular/router';

export class AccionItem {
  fecha: string;
  accion: string;
  usuario: string;
  observaciones: string;
}

@Component({
  selector: 'app-tarjeta-his-ficha-act',
  templateUrl: './tarjeta-his-ficha-act.component.html',
  styleUrls: ['./tarjeta-his-ficha-act.component.scss']
})
export class TarjetaHisFichaActComponent implements OnInit {

  @Input() listaAcciones: AccionItem[] = [];
  cols: Col[] = [
    {
      field: 'fecha',
      header: 'dato.jgr.guardia.saltcomp.fecha',
      width: '16.666666666666%'
    },
    {
      field: 'accion',
      header: 'justiciaGratuita.oficio.inscripciones.accion',
      width: '16.666666666666%'
    },
    {
      field: 'usuario',
      header: 'censo.usuario.usuario',
      width: '33.333333333333%'
    },
    {
      field: 'observaciones',
      header: 'justiciaGratuita.Calendarios.Observaciones',
      width: '33.333333333333%'
    }
  ];

  constructor(private commonsService: CommonsService, private translateService: TranslateService, private router: Router) { }

  async ngOnInit() {

    this.commonsService.checkAcceso(procesos_oficio.designaTarjetaActuacionesHistorico)
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

      let esColegio=this.commonsService.getLetrado()
        .then(respuesta => {
          console.log("Es colegiado: "+respuesta);

          if(respuesta){
            console.log("valor a modificar: "+this.cols[2].header);
            this.cols[2].header = 'censo.general.literal.Personal';
          }

        });

  }

}
