export class QueryBuilderItem {


	condition: string = "";

	field: string;
	label: string;
	operator: string;
	type: string;
	value: string;

	rules: QueryBuilderItem[] = [];
	constructor() { }
}
