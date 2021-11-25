import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { TranslateService } from '../../../../commons/translate';
import { SigaServices } from '../../../../_services/siga.service';
import { saveAs } from "file-saver/FileSaver";

@Component({
  selector: 'app-tarjeta-fichero-modelo-cmc',
  templateUrl: './tarjeta-fichero-modelo-cmc.component.html',
  styleUrls: ['./tarjeta-fichero-modelo-cmc.component.scss']
})
export class TarjetaFicheroModeloCmcComponent implements OnInit {

  msgs: Message[];
  progressSpinner: boolean = false;

  showCuerpoFicheroModelo: boolean = false;

  constructor(private translateService: TranslateService,
    private sigaServices: SigaServices) { }

  ngOnInit() {
  }

  descargarModelo(){
    this.progressSpinner = true;
    let request = null;
    this.sigaServices
      .postDownloadFiles(
        "cargasMasivasCompras_descargarModelo", 
               request
      )
      .subscribe(
        data => {
          const blob = new Blob([data], { type: "text/csv" });
          saveAs(blob, "PlantillaCargaMasivaCompras.xls");
        },
        err => {
          console.log(err);
        },
        () => {
          this.progressSpinner = false;
        }
      );
      this.progressSpinner = false;
  }

}
