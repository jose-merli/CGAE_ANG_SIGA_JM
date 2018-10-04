import {
  Component,
  OnInit,
  AfterContentChecked,
  AfterContentInit
} from "@angular/core";
import { SelectItem } from "primeng/api";
import { TranslateService } from "../../../commons/translate/translation.service";

@Component({
  selector: "app-cargas-masivas",
  templateUrl: "./cargas-masivas.component.html",
  styleUrls: ["./cargas-masivas.component.scss"]
})
export class CargasMasivasComponent implements OnInit, AfterContentInit {
  cargasMasivas: SelectItem[];

  showCargasMasivas: boolean = false;
  enableGF: boolean = false;
  enableCV: boolean = false;

  selectedTipoCarga: string;

  constructor(private translateService: TranslateService) {}

  ngOnInit() {}

  ngAfterContentInit() {
    this.cargasMasivas = [
      {
        label: this.translateService.instant("menu.cen.cargaMasivaGruposFijos"),
        value: "GF"
      },
      {
        label: this.translateService.instant(
          "menu.cen.cargaMasivaDatosCurriculares"
        ),
        value: "CV"
      }
    ];
  }

  onHideCargasMasivas() {
    this.showCargasMasivas = !this.showCargasMasivas;
  }

  onChange(event) {
    if (event == "GF") {
      this.enableGF = true;
    } else {
      this.enableGF = false;
    }

    if (event == "CV") {
      this.enableCV = true;
    } else {
      this.enableCV = false;
    }
  }
}
