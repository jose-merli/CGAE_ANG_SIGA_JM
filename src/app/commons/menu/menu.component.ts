import { TranslateService } from "../translate/translation.service";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { PanelMenuModule } from "primeng/panelmenu";
import { SigaServices } from "../../_services/siga.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  items: MenuItem[];
  closeMenu: boolean = false;
  bloquedMenu: boolean = false;
  showChild: boolean = false;
  selectedItem: any;
  selectedLabel: any;
  showChildOfChild: boolean = false;
  selectedItemOfChild: any;
  selectedLabelOfChild: any;
  encontrado: boolean;
  progressSpinner: boolean = false;

  constructor(
    private router: Router,
    private sigaServices: SigaServices,
    private translateService: TranslateService
  ) { }

  // TODO: Revisar si tiene sentido que las rutas las devuelva el back
  //o revisar si se pude instanciar el router de forma dinámica al arrancar el angular
  ngOnInit() {
    this.progressSpinner = true;  
    
    this.translateService.getTranslations().then(
      items=>{
        this.items = items;
        this.progressSpinner = false;
      }
    );

    // this.sigaServices.get("diccionarios").subscribe(response => {
    //   response.DiccionarioItems;
    //   this.sigaServices.get("menu").subscribe(response => {
    //     this.progressSpinner = false;
    //     this.items = response.menuItems;
    //     return this.items;
    //   });
    // });
  }

  onCloseMenu() {
    if (!this.bloquedMenu) {
      this.closeMenu = !this.closeMenu;
      this.sigaServices.notifyMenuToggled();
    }
  }

  onFixedMenu() {
    this.bloquedMenu = !this.bloquedMenu;
  }

  isRoute(ruta) {
    var currentRoute = this.router.url;

    this.encontrado = false;
    if (currentRoute.indexOf(ruta) != -1) {
      this.encontrado = true;
    }
    return currentRoute === ruta || this.encontrado;
  }
  isCargado(key: string): boolean {
    return key != this.translateService.instant(key);
  }

  navigateTo(ruta) {
    if (ruta !== " ") {
      if (ruta !== "opcionMenu" && ruta !== "permisos") {
        // this.closeMenu = !this.closeMenu;
        if (ruta == "fichaColegial") {
          sessionStorage.setItem("fichaColegialByMenu", "true");
        } else {
          if (ruta == "modelosComunicaciones") {
            sessionStorage.setItem("esMenu", "true");
          }
          sessionStorage.removeItem("fichaColegialByMenu");
        }

        this.onCloseMenu();
        this.router.navigate([ruta]);
      }

      if (ruta == "permisos") {
        setTimeout(() => {
          this.onCloseMenu();
        }, 100);

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
    //Linea comentada para que los puntos de menu se cierren si se abren
    // this.showChildOfChild = false;
    if (items) {
      this.showChildOfChild = !this.showChildOfChild;
      this.selectedItemOfChild = items;
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
