import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as jwt_decode from "jwt-decode";
import { ConfirmationService } from "primeng/primeng";
import { SigaServices } from "./siga.service";

@Injectable()
export class DeadmanService {
  private timer: any;
  private readonly timeoutExpirationCheck: number = 120000; // Tiempo en milisegundos
  private readonly timeoutExpirationWarning: number = 359000; // Tiempo en milisegundos
  private showExpirde: boolean = false;
  private showWarning: boolean = false;
  private httpExit: string;

  constructor(private router: Router, private confirmationService: ConfirmationService, private sigaServices: SigaServices) {}

  startDeadmanTimer(): void {
    this.timer = setInterval(() => {
      this.handleDeadman();
    }, this.timeoutExpirationCheck);
  }

  resetDeadmanTimer(): void {
    clearInterval(this.timer);
    this.startDeadmanTimer();
  }

  showConfirmationExpired(): void {
    sessionStorage.clear();
    if (!this.showExpirde) {
      this.showExpirde = true;
      this.confirmationService.confirm({
        key: "cdExpired",
        message: "La sesión ha expirado, pulse el botón salir",
        header: "Aviso",
        icon: "pi pi-exclamation-triangle",
        rejectVisible: false,
        acceptLabel: "Salir",
        accept: () => {
          sessionStorage.removeItem("authenticated");

          if (sessionStorage.getItem('loginDevelop') === 'true') {
            sessionStorage.setItem('loginDevelop', '0');
          }
          
          this.sigaServices.get("eliminaCookie").subscribe(response => {
              let responseStatus = response[0].status;
              if (responseStatus == 200) {
                //console.log("Cookies eliminadas para cerrar la sesión");
              }
            });
          this.sigaServices.get("usuario_logeado").subscribe(n => {
              let menuUser: any = [];
              menuUser = n.usuarioLogeadoItem;
              if(menuUser != null && menuUser != undefined && menuUser.length > 0){
                this.httpExit = menuUser[0].rutaLogoutCAS;
                window.location.href = this.httpExit;
              }else{
                this.router.navigate(["/logout"]);    
              }
          });
        },
      });
    }
  }

  private handleDeadman(): void {
    const authorization: string = sessionStorage.getItem("Authorization");
    if (authorization != null) {
      const token: string = authorization.replace("Bearer ", "");
      if (this.isTokenExpired(token)) {
        clearInterval(this.timer);
        this.showConfirmationExpired();
        sessionStorage.clear();
      } else if (!this.showWarning && this.isTokenAboutExpired(token)) {
        this.showWarning = true;
        const expirationDate = this.getTokenExpirationDate(token);
        this.confirmationService.confirm({
          key: "cdExpired",
          message: "La sesión expirara en " + parseInt((expirationDate.valueOf() - new Date().valueOf()) / 60000 + "") + " minutos.",
          header: "Aviso",
          icon: "pi pi-exclamation-triangle",
          rejectVisible: false,
          acceptLabel: "Cerrar",
          accept: () => {
            this.showWarning = false;
          },
        });
      }
    }
  }

  private getTokenExpirationDate(token: string): Date {
    const decodedToken: any = jwt_decode(token);
    if (decodedToken.exp === undefined) return null;
    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);
    return expirationDate;
  }

  private isTokenExpired(token?: string): boolean {
    if (!token) return true;
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return false;
    return expirationDate.valueOf() <= new Date().valueOf();
  }

  private isTokenAboutExpired(token?: string): boolean {
    if (!token) return true;
    const expirationDate = this.getTokenExpirationDate(token);
    if (!expirationDate) return false;
    return expirationDate.valueOf() - this.timeoutExpirationWarning <= new Date().valueOf();
  }
}
