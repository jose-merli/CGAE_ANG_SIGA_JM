import { Directive, ElementRef, Input, OnInit, Renderer2, ViewContainerRef } from "@angular/core";
import { CommonsService } from "../../_services/commons.service";

@Directive({
    selector: "[checkPermission]"
})
export class CheckPermissionDirective {

    constructor(private el: ElementRef, private renderer: Renderer2, private commonsService: CommonsService) {}

    @Input() 
    set checkPermission(val: string) {
        this.el.nativeElement.style.display = 'none';
        this.permission(val);
    }

    async permission(val: string) {
        if(val != undefined && val != ''){
            this.commonsService.checkAcceso(val).then(respuesta => {
                if(respuesta == undefined){
                    this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
                }else{
                    this.el.nativeElement.style.display = 'block';
                }
            }).catch(error => {
                console.error(error);
                this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
            });
        }else{
            this.renderer.removeChild(this.el.nativeElement.parentNode, this.el.nativeElement);
        }
    }
}