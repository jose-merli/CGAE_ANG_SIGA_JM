export class ConstructorConsultasItem {
   
    orden: number; 
	conector: string; //AND (Y) U OR (O), columna OPERADOR en con_criterioconsulta
	abrirparentesis: string;
	campo: string; //columna NOMBREENCONSULTA en con_campoconsulta
	operador: string; //Igual a, distinto de (se encuentran en con_operacionconsulta)
	valor: string;
    cerrarparentesis: string;

    constructor() { }
}