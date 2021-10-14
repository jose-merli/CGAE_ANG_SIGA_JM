export class ConstructorConsultasItem {
   
    orden: number; 
	conector: String; //AND (Y) U OR (O), columna OPERADOR en con_criterioconsulta
	abrirparentesis: String;
	campo: String; //columna NOMBREENCONSULTA en con_campoconsulta
	operador: String; //Igual a, distinto de (se encuentran en con_operacionconsulta)
	valor: String;
    cerrarparentesis: String;

    constructor() { }
}