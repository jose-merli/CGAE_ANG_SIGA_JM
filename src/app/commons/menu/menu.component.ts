import { TranslateService } from "../translate/translation.service";
import { Inject, Injectable } from "@angular/core";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef
} from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from "primeng/panelmenu";
import { SigaServices } from "../../_services/siga.service";
import { element } from "../../../../node_modules/protractor";
import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  closeMenu: boolean = false;
  showChild: boolean = false;
  selectedItem: any;
  selectedLabel: any;
  showChildOfChild: boolean = false;
  selectedItemOfChild: any;
  selectedLabelOfChild: any;
  encontrado: boolean;

  constructor(
    private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService,
    private ref: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) { }

  // TODO: Revisar si tiene sentido que las rutas las devuelva el back
  //o revisar si se pude instanciar el router de forma dinámica al arrancar el angular
  ngOnInit() {
    this.sigaServices.get("menu").subscribe(response => {
      this.items = response.menuItems;
      return this.items;
    });
  }

  onCloseMenu() {
    this.closeMenu = !this.closeMenu;
    this.sigaServices.notifyMenuToggled();
    console.log(this.closeMenu);
  }

  isRoute(ruta) {
    var currentRoute = this.router.url;

    this.encontrado = false;
    if (currentRoute.indexOf(ruta) != -1) {
      this.encontrado = true;
    }
    return currentRoute === ruta || this.encontrado;
  }

  navigateTo(ruta) {
    if (ruta !== " ") {
      if (ruta !== "opcionMenu" && ruta !== "permisos") {
        this.closeMenu = !this.closeMenu;
        if (document.querySelector("#mainWorkArea")) {
          // var element = document.getElementById("mainWorkArea");
          // element.classList.remove("test");
          // this.sigaServices.menuToggled$
          this.sigaServices.borrarIframe();
          // document.querySelector("#mainWorkArea").classList.remove("test");
        }
        this.router.navigate([ruta]);
      }

      if (ruta == "permisos") {
        setTimeout(() => {
          this.onCloseMenu();
        }, 100);

        //("#mainWorkArea").remove()
        // comprobar si existe iframe y eliminarlo
        if (document.querySelector("#mainWorkArea")) {
          // var element = document.getElementById("mainWorkArea");
          // element.classList.remove("test");
          this.sigaServices.borrarIframe();
        }

        this.router.navigate([ruta]);
      }
    }
  }
  viewChild(e, i) {
    if (e) {
      this.showChild = true;
      this.selectedItem = e;
      this.selectedLabel = i;
    }
  }

  viewChildOfChild(items, label) {
    if (items) {
      this.showChildOfChild = !this.showChildOfChild;
      this.selectedItemOfChild = items;
      console.log(this.selectedItemOfChild);
      this.selectedLabelOfChild = label;
    }
  }

  backMenu() {
    this.showChild = false;
  }

  backMenuChild() {
    this.showChildOfChild = false;
  }
}

