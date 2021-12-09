export class ListaServiciosMonederoItem { 

	//Columnas tabla
    nombre: string; //Nombre del servicio
	fecha: Date;//Fecha informativa en la que se añadió el servicio al monedero
	precioPerio: string; //campo informativo que muestra lo que cuesta el servicio (mismo formato que la busqueda de servicios)

	//Clave primaria servicio
	idservicio: number;
	idtiposervicios: number;
	idserviciosinstitucion: number;

}