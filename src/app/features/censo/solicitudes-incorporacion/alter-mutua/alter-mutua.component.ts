import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";
import { Location } from "@angular/common";


@Component({
  selector: "app-alter-mutua",
  templateUrl: "./alter-mutua.component.html",
  styleUrls: ["./alter-mutua.component.scss"]
})
export class AlterMutuaComponent implements OnInit {


  progressSpinner: boolean = false;



  constructor(private translateService: TranslateService, private sigaServices: SigaServices, private formBuilder: FormBuilder, private changeDetectorRef: ChangeDetectorRef,
    private router: Router, private location: Location) { }

  ngOnInit() {



  }

  irAlterMutuaReta() {
    this.router.navigate(["/alterMutuaReta"]);
  }

  irOfertas() {
    this.router.navigate(["/alterMutuaOfertas"]);
  }
  backTo() {
    this.location.back();
  }
}
