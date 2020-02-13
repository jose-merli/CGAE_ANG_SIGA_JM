import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { SigaServices } from '../_services/siga.service';
import { TranslateService } from '../commons/translate';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router, private authService: AuthenticationService, private sigaService: SigaServices, private translateService: TranslateService,
        private aRouter: ActivatedRoute) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (this.authService.isAutenticated()) {
                if (route.routeConfig.path != 'home') {
                    let path = route.routeConfig.path;
                    if (route.routeConfig.path.includes('contadores')) {
                        path = 'contadores';
                    }
                    this.sigaService.post("acces_controlUrl", path).toPromise().then(
                        data => {
                            console.log(data);
                            let permisoItem = JSON.parse(data.body);
                            // this.router.navigate(['/login']);
                            if (permisoItem.permisoItems[0].data != 0) {
                                if (permisoItem.permisoItems[0].derechoacceso == 3 || permisoItem.permisoItems[0].derechoacceso == 2) {
                                    resolve(true);
                                } else {
                                    sessionStorage.setItem("codError", "403");
                                    sessionStorage.setItem(
                                        "descError",
                                        this.translateService.instant("Permiso Denegado")
                                    );
                                    this.router.navigate(["/errorAcceso"]);
                                    resolve(false);
                                }
                            } else {
                                resolve(true);
                            }
                        },
                        error => {
                            resolve(false);
                        }
                    );
                } else {
                    // return resolve;
                    resolve(true);
                }
            } else {
                this.authService.logout();
            }
        });
    }



    isRolePermitted(roles?) {
        return true
    }
}