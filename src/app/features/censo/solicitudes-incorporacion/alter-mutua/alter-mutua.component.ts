import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { SigaServices } from "../../../../_services/siga.service";
import { TranslateService } from "../../../../commons/translate";


@Component({
  selector: "app-alter-mutua",
  templateUrl: "./alter-mutua.component.html",
  styleUrls: ["./alter-mutua.component.scss"]
})
export class AlterMutuaComponent implements OnInit {

  es: any;


  @ViewChild("table")
  table;
  selectedDatos;
  cols: any = [];
  rowsPerPage: any = [];
  datos: any;
  numSelected: number = 0;
  selectedItem: number = 10;
  selectMultiple: boolean = false;
  selectAll: boolean = false;

  constructor(
    private translateService: TranslateService,
    private sigaServices: SigaServices,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {

  }

  ngOnInit() {

  }

}
