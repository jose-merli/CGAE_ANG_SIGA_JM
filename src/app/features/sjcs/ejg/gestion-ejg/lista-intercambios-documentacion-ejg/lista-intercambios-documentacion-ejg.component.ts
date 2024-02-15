import { Component, Input, OnInit} from '@angular/core';
import { EJGItem } from '../../../../../models/sjcs/EJGItem';
import { ListaIntercambiosEjgItem } from '../../../../../models/sjcs/ListaIntercambiosEjgItem';
import { SigaServices } from '../../../../../_services/siga.service';

@Component({
  selector: 'app-lista-intercambios-documentacion-ejg',
  templateUrl: './lista-intercambios-documentacion-ejg.component.html',
  styleUrls: ['./lista-intercambios-documentacion-ejg.component.scss']
})
export class ListaIntercambiosDocumentacionEjgComponent implements OnInit {

  @Input() body: EJGItem;
  @Input() permisoEscritura: boolean = false;
  @Input() openTarjetaListaIntercambiosDocumentacionEjg: Boolean;

  progressSpinner: boolean = false;

  msgs = [];
  cols;
  rowsPerPage: any = [];
  selectedItem: number = 10;
  datos: ListaIntercambiosEjgItem[] = [];

  constructor(private sigaServices: SigaServices) { }

  ngOnInit() {
    this.progressSpinner = true;
    this.getCols();
    this.getListaIntercambios();
  }

  onChangeRowsPerPages() {
    //ARR: Terminar
  }

  abreCierraFicha() {
    this.openTarjetaListaIntercambiosDocumentacionEjg = !this.openTarjetaListaIntercambiosDocumentacionEjg;
  }

  clear() {
    this.msgs = [];
  }

  private getCols() {
    this.cols = [
      { field: "descripcion", header: "justiciaGratuita.ejg.listaIntercambios.intercambio", width: "20%" },
      { field: "fechaEnvio", header: "justiciaGratuita.ejg.listaIntercambios.fechaEnvio", width: "10%" },
      { field: "estadoRespuesta", header: "enviosMasivos.literal.estado", width: "10%" },
      { field: "fechaRespuesta", header: "justiciaGratuita.ejg.listaIntercambios.fechaRespuesta", width: "10%" },
      { field: "respuesta", header: "justiciaGratuita.ejg.listaIntercambios.respuesta", width: "50%" }
    ];

    this.rowsPerPage = [
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 30, value: 30 },
      { label: 40, value: 40 }
    ];
  }

  getListaIntercambios(){
    const request = { idInstitucion: this.body.idInstitucion, annio: this.body.annio, tipoEJG: this.body.tipoEJG, numero: this.body.numero };
    this.sigaServices.post("gestionejg_getListaIntercambiosDocumentacionEjg", request).subscribe(
      n => {
        this.progressSpinner = false;
        const body = JSON.parse(n.body);
        this.datos = body.ejgListaIntercambiosItems;
      },
      err => {
        this.progressSpinner = false;
        this.datos = [];
      }
    );
  }
}