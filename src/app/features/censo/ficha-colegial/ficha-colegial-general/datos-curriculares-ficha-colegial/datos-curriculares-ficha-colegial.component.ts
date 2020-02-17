// import { Component, OnInit, ViewChild } from '@angular/core';
// import { Router } from '../../../../../../../node_modules/@angular/router';
// import { SigaServices } from '../../../../../_services/siga.service';
// import { DataTable, ConfirmationService } from '../../../../../../../node_modules/primeng/primeng';
// import { TranslateService } from '../../../../../commons/translate';

// @Component({
//   selector: 'app-datos-curriculares-ficha-colegial',
//   templateUrl: './datos-curriculares-ficha-colegial.component.html',
//   styleUrls: ['./datos-curriculares-ficha-colegial.component.scss']
// })
// export class DatosCurricularesFichaColegialComponent implements OnInit {

//   datosCurriculares: any[] = [];
//   sortF: any;
//   sortO: any;




//   @ViewChild("tableCurriculares")
//   tableCurriculares: DataTable;

//   constructor(private router: Router,
//     private sigaServices: SigaServices,
//     private translateService: TranslateService,
//     private confirmationService: ConfirmationService) { }

//   ngOnInit() {
//   }

//   activarPaginacionCurriculares() {
//     if (!this.datosCurriculares || this.datosCurriculares.length == 0)
//       return false;
//     else return true;
//   }

//   changeSort(event) {
//     this.sortF = "fechaHasta";
//     this.sortO = 1;
//     if (this.tableCurriculares != undefined) {
//       this.tableCurriculares.sortField = this.sortF;
//       //this.table.sortOrder = this.sortO;
//     }

//     // this.table.sortMultiple();
//   }

//   deleteCurriculares(selectedDatosCurriculares) {
//     let mess = this.translateService.instant("messages.deleteConfirmation");
//     this.icon = "fa fa-trash-alt";
//     let keyConfirmation = "eliminarCV";

//     this.confirmationService.confirm({
//       key: keyConfirmation,
//       message: mess,
//       icon: this.icon,
//       accept: () => {
//         this.eliminarRegistroCV(selectedDatosCurriculares);
//       },
//       reject: () => {
//         this.msgs = [
//           {
//             severity: "info",
//             summary: "info",
//             detail: this.translateService.instant(
//               "general.message.accion.cancelada"
//             )
//           }
//         ];

//         this.selectedDatosCurriculares = [];
//         this.selectMultipleCurriculares = false;
//       }
//     });
//   }

//   eliminarRegistroCV(selectedDatosCurriculares) {
//     selectedDatosCurriculares.forEach(element => {
//       this.datosCurricularesRemove.fichaDatosCurricularesItem.push(element);
//     });

//     this.sigaServices
//       .post("fichaDatosCurriculares_delete", this.datosCurricularesRemove)
//       .subscribe(
//         data => {
//           if (selectedDatosCurriculares.length == 1) {
//             this.showSuccessDetalle(
//               this.translateService.instant("messages.deleted.success")
//             );
//           } else {
//             this.showSuccessDetalle(
//               selectedDatosCurriculares.length +
//               " " +
//               this.translateService.instant(
//                 "messages.deleted.selected.success"
//               )
//             );
//           }
//           this.progressSpinner = false;
//         },
//         err => {
//           console.log(err);
//           this.progressSpinner = false;
//         },
//         () => {
//           this.progressSpinner = false;
//           this.editar = false;
//           this.selectedDatosCurriculares = [];
//           this.numSelectedCurriculares = 0;
//           this.selectMultipleCurriculares = false;
//           this.searchDatosCurriculares();
//         }
//       );
//   }

//   redireccionarCurriculares(dato) {
//     if (dato && dato.length < 2 && !this.selectMultipleCurriculares) {
//       // enviarDatos = dato[0];
//       sessionStorage.setItem("curriculo", JSON.stringify(dato));

//       if (dato[0].fechaBaja != null || (this.tarjetaCurriculares == '2')) {
//         sessionStorage.setItem("permisos", "false");
//       } else {
//         sessionStorage.setItem("permisos", "true");
//       }

//       sessionStorage.setItem("crearCurriculo", "false");
//       this.router.navigate(["/edicionCurriculares"]);
//     } else {
//       this.numSelectedCurriculares = this.selectedDatosCurriculares.length;
//       sessionStorage.setItem("crearCurriculo", "true");
//     }
//   }

//   onInitCurriculares() {
//     this.searchDatosCurriculares();
//     if (sessionStorage.getItem("abrirCurriculares")) {
//       this.abreCierraFicha("curriculares");
//     }
//     sessionStorage.removeItem("abrirCurriculares");

//     // this.nuevafecha = new Date();
//     let event = { field: "fechaFin", order: 1, multisortmeta: undefined };
//     this.changeSort(event);
//   }

//   irNuevoCurriculares() {
//     sessionStorage.removeItem("permisos");
//     sessionStorage.setItem("nuevoCurriculo", "true");
//     sessionStorage.setItem("idPersona", JSON.stringify(this.idPersona));
//     this.router.navigate(["/edicionCurriculares"]);
//   }
//   searchDatosCurriculares() {
//     let bodyCurricular = {
//       idPersona: this.idPersona,
//       historico: this.historicoCV
//     };
//     this.sigaServices
//       .postPaginado(
//         "fichaDatosCurriculares_search",
//         "?numPagina=1",
//         bodyCurricular
//       )
//       .subscribe(
//         data => {
//           let search = JSON.parse(data["body"]);
//           this.datosCurriculares = search.fichaDatosCurricularesItem;
//           // this.table.reset();
//         },
//         err => {
//           //   console.log(err);
//         }, () => {
//           if (this.datosCurriculares.length > 0) {
//             this.mostrarDatosCurriculares = true;
//             for (let i = 0; i <= this.datosCurriculares.length - 1; i++) {
//               this.DescripcionDatosCurriculares = this.datosCurriculares[i];
//             }
//           }
//         }
//       );
//   }

//   isSelectMultipleCurriculares() {
//     this.selectMultipleCurriculares = !this.selectMultipleCurriculares;
//     if (!this.selectMultipleCurriculares) {
//       this.numSelectedCurriculares = 0;
//       this.selectedDatosCurriculares = [];
//     } else {
//       this.selectAllCurriculares = false;
//       this.selectedDatosCurriculares = [];
//       this.numSelectedCurriculares = 0;
//     }
//   }

//   //Opción tabla de seleccionar todas las filas
//   onChangeSelectAllCurriculares() {
//     if (this.selectAllCurriculares === true) {
//       this.selectMultipleCurriculares = false;
//       this.selectedDatosCurriculares = this.datosCurriculares;
//       this.numSelectedCurriculares = this.datosCurriculares.length;
//     } else {
//       this.selectedDatosCurriculares = [];
//       this.numSelectedCurriculares = 0;
//     }
//   }

//   cargarDatosCV() {
//     this.historicoCV = false;

//     this.searchDatosCurriculares();

//     if (!this.historicoCV) {
//       this.selectMultiple = false;
//       this.selectAll = false;
//     }
//   }

//   cargarHistorico() {
//     this.historicoCV = true;
//     this.searchDatosCurriculares();
//   }


// }
