import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'primeng/components/common/api';
import { procesos_oficio } from '../../permisos/procesos_oficio';
import { CommonsService } from '../../_services/commons.service';
import { TranslateService } from '../translate/translation.service';

@Component({
  selector: 'app-input-dividido',
  templateUrl: './input-dividido.component.html',
  styleUrls: ['./input-dividido.component.scss']
})
export class InputDivididoComponent implements OnInit {
  @Input() titulo = "";
  @Input() anio;
  @Input() numero;
  @Input() nuevaDesigna;
  @Output() showMsgError = new EventEmitter<String>();
  disabledNumDes: boolean = true;
  msgs: String = "";
  constructor(private commonsServices: CommonsService,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    //console.log(this.anio);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    else {
      return false;

    }
  }
  disableEnableNumDes() {
    this.commonsServices.checkAcceso(procesos_oficio.CambioNumDesigna)
      .then(respuesta => {
        if (respuesta && this.nuevaDesigna == false) {
          this.disabledNumDes = !this.disabledNumDes;
        } else {
          this.msgs = this.translateService.instant("general.message.noTienePermisosRealizarAccion");
          this.showMsgError.emit(this.msgs);
        }
      }).catch(error => console.error(error));
  }
}
