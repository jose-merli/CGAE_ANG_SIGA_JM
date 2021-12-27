import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PersistenceService } from '../../../../../../../_services/persistence.service';
import { TranslateService } from '../../../../../../../commons/translate';
import { CommonsService } from '../../../../../../../_services/commons.service';
import { SigaServices } from '../../../../../../../_services/siga.service';
import { ProcuradoresItem } from '../../../../../../../models/sjcs/ProcuradoresItem';

@Component({
  selector: 'app-datos-generales-procuradores',
  templateUrl: './datos-generales-procuradores.component.html',
  styleUrls: ['./datos-generales-procuradores.component.scss']
})
export class DatosGeneralesProcuradoresComponent implements OnInit {


  //Resultados de la busqueda
  @Input() modoEdicion;

  openFicha: boolean = true;
  msgs = [];
  @Input() historico;

  @Input() body;
  @Input() bodyInicial;
  @Input() idProcuradores;

  comboColegios;
  colegios_seleccionados: any[] = [];

  @Input() permisoEscritura;


  @Input() progressSpinner


  constructor(private persistenceService: PersistenceService, private sigaServices: SigaServices,
    private translateService: TranslateService, private commonsServices: CommonsService) { }

  ngOnInit() {



    this.getComboColegios();

    this.validateHistorical();

    if (this.modoEdicion) {
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));

      // if (this.body != undefined && this.datos.idColProcurador != null) {
      //   this.getComboPoblacion(this.body.nombrePoblacion);
      // } else {
      //   this.progressSpinner = false;
      // }
    } else {
      this.body = new ProcuradoresItem();
      this.bodyInicial = JSON.parse(JSON.stringify(this.body));
    }
  }

  validateHistorical() {
    if (this.persistenceService.getDatos() != undefined) {

      if (this.persistenceService.getDatos().fechabaja != null || this.persistenceService.getDatos().institucionVal != undefined) {
        this.historico = true;
      } else {
        this.historico = false;
      }
    }
  }

  getComboColegios() {
    this.progressSpinner = true;

    this.sigaServices.get("busquedaProcuradores_colegios").subscribe(
      n => {
        this.comboColegios = n.combooItems;
        this.commonsServices.arregloTildesCombo(this.comboColegios);
        this.progressSpinner = false;

      },
      err => {
        //console.log(err);
        this.progressSpinner = false;
      }, () => {
      }
    );

  }

  abreCierraFicha() {
    this.openFicha = !this.openFicha;
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }

  clear() {
    this.msgs = [];
  }

}
