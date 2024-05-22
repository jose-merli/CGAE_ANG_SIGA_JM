import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { AuthenticationService } from "./_services/authentication.service";
import { DeadmanService } from "./_services/deadman.service";
import { NotificationService } from "./_services/notification.service";
import { SigaServices } from "./_services/siga.service";
import { ColegiadoItem } from "./models/ColegiadoItem";
import { SigaStorageService } from "./siga-storage.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @ViewChild("content")
  content: any;
  hideCookies: boolean = true;
  bottomCookies: string = "0";
  expires: number;
  date: any;
  currentDate: any;
  dateExpires: any;

  scroll: boolean = false;
  isScrollReseteable: boolean = false;

  constructor(private autenticateService: AuthenticationService, private deadmanService: DeadmanService, private activatedRoute: ActivatedRoute, private router: Router, private localStorageService: SigaStorageService, private sigaServices: SigaServices, private notificationService: NotificationService) {}

  async ngOnInit(): Promise<void> {
    this.deadmanService.startDeadmanTimer();

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });

    this.subscribeNavigationEnd();
    this.getDateExpire();

    this.currentDate = JSON.stringify(new Date(new Date().getTime()));

    if (this.currentDate !== this.dateExpires) {
      if (localStorage.getItem("cookies") === "true") {
        this.bottomCookies = "-100";
      }
    } else {
      localStorage.setItem("cookies", "false");
      this.bottomCookies = "0";
    }

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    await this.sigaServices.get("getLetrado").subscribe((data) => {
      if (data.value == "S") {
        this.localStorageService.isLetrado = true;
      } else {
        this.localStorageService.isLetrado = false;
      }
    });
    await this.getDataLoggedUser();
    await this.getInstitucionActual();
  }

  clear() {
    this.notificationService.clear();
  }

  subscribeNavigationEnd() {
    this.router.events
      .filter((e) => e instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        if (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter((route) => route.outlet === "primary")
      .mergeMap((route) => route.data)
      .subscribe((e: any) => {
        this.isScrollReseteable = e.scrollReset;
      });
  } // outputs my `data`

  isLogged() {
    return this.autenticateService.isAutenticated();
  }

  subirTop(e, content) {
    content.scrollTop = 0;
    if (content.scrollTop === 0) {
      setTimeout(() => {
        this.scroll = false;
      }, 2);
    }
  }

  set(expires?: number | Date): void {
    // expires = 2;
    if (expires) {
      if (typeof expires === "number") {
        const dateExpires = new Date(new Date().getTime() + expires * 1000 * 60 * 60 * 24);
        this.date = { value: "date", dateExpires };
        localStorage.setItem("date", JSON.stringify(this.date));
      }
    }
  }

  getDateExpire() {
    this.date = localStorage.getItem("date");
    let objectDate = JSON.parse(this.date);
    if (this.date != undefined) {
      this.dateExpires = objectDate.dateExpires;
    }
  }

  // @HostListener("window:scroll", ['$event'])
  onWindowScroll(event, content) {
    if (this.isScrollReseteable) {
      this.scroll = true;
    }

    if (content.scrollTop === 0) {
      setTimeout(() => {
        this.scroll = false;
      }, 2);
    }
  }

  navigateTo() {
    this.router.navigate(["/politicaCookies"]);
  }

  onHideCookies() {
    this.expires = 365;
    localStorage.setItem("cookies", "true");
    this.bottomCookies = "-100";
    this.set(this.expires);
  }

  getDataLoggedUser() {
    this.sigaServices.get("usuario_logeado").subscribe(async (n) => {
      const usuario = n.usuarioLogeadoItem;
      const colegiadoItem = new ColegiadoItem();
      colegiadoItem.nif = usuario[0].dni;
      await this.sigaServices.post("busquedaColegiados_searchColegiado", colegiadoItem).subscribe((usr) => {
        let usuarioLogado = JSON.parse(usr.body).colegiadoItem[0];
        if (usuarioLogado) {
          this.localStorageService.idPersona = usuarioLogado.idPersona;
          this.localStorageService.numColegiado = usuarioLogado.numColegiado;
        }
      });
    });
  }

  getInstitucionActual() {
    this.sigaServices.get("institucionActual").subscribe((n) => {
      this.localStorageService.institucionActual = n.value;
    });
  }
}
