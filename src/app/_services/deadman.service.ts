import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class DeadmanService {
  private timer: any;
  private readonly timeoutDuration: number = 600000; // Tiempo en milisegundos

  constructor(private router: Router) {}

  startDeadmanTimer(): void {
    this.timer = setInterval(() => {
      this.handleDeadman();
    }, this.timeoutDuration);
  }

  resetDeadmanTimer(): void {
    clearInterval(this.timer);
    this.startDeadmanTimer();
  }

  private handleDeadman(): void {
    const authorization: string = sessionStorage.getItem("Authorization");
    if (authorization != null) {
      const token: string = authorization.replace("Bearer ", "");
      if (this.isTokenExpired(token)) {
        clearInterval(this.timer);
        sessionStorage.setItem("tokenExpirado", "true");
        this.router.navigate(["/home"]);
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
}
