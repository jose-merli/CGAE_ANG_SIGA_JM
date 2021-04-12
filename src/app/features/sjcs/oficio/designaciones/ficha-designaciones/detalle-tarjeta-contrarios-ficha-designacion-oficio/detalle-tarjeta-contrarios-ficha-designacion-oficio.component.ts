import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SigaServices } from '../../../../../../_services/siga.service';
import { TranslateService } from '../../../../../../commons/translate';

@Component({
  selector: 'app-detalle-tarjeta-contrarios-ficha-designacion-oficio',
  templateUrl: './detalle-tarjeta-contrarios-ficha-designacion-oficio.component.html',
  styleUrls: ['./detalle-tarjeta-contrarios-ficha-designacion-oficio.component.scss']
})
export class DetalleTarjetaContrariosFichaDesignacionOficioComponent implements OnInit {

  msgs;

  @Input() campos;

  selectedItem: number = 10;
  datos;
  cols;
  rowsPerPage;
  selectedDatos: any[] = [];

  progressSpinner: boolean = false
  

  @ViewChild("table") table;

  constructor(private sigaServices: SigaServices, 
    private  translateService: TranslateService,
    private changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit() {
    this.getCols(); 
    this.search();   
  }

  onChangeRowsPerPages(event) {
    this.selectedItem = event.value;
    this.changeDetectorRef.detectChanges();
    this.table.reset();
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

  search(){
    this.progressSpinner = true;
    let data = sessionStorage.getItem("designaItemLink");
    let designaItem = JSON.parse(data);

    this.sigaServices.post("designaciones_listaContrarios", designaItem.numero).subscribe(
      n => {

        this.datos = JSON.parse(n.body);
        //Columnas a obtener:
        //Identificador: nif/pasaporte del id persona del contrario. A partir de SCS_CONTRARIOSDESIGNA.IDPERSONA.
        //Apellido, nombre de dicha persona. A partir de SCS_CONTRARIOSDESIGNA.IDPERSONA.
        //nº colegiado, apellidos y nombre del abogado del contrario. Extraer de las columnas IDABOGADOCONTRARIO y NOMBREABOGADOCONTRARIO de SCS_CONTRARIOSDESIGNA.
        //nº colegiado, apellidos y nombre del procurador del contrario. SCS_CONTRARIOSDESIGNA.IDPROCURADOR

        let error = JSON.parse(n.body).error;

        if (this.table != undefined) {
          this.table.table.sortOrder = 0;
          this.table.table.sortField = '';
          this.table.table.reset();
          this.table.buscadores = this.table.buscadores.map(it => it = "");
        }

        if (error != null && error.description != null) {
          this.showMessage("info", this.translateService.instant("general.message.informacion"), error.description);
        }

      },
      err => {
        this.progressSpinner = false;
        console.log(err);
      });
  }

  showMessage(severity, summary, msg) {
    this.msgs = [];
    this.msgs.push({
      severity: severity,
      summary: summary,
      detail: msg
    });
  }


}
