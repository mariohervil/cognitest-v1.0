// Esta interfaz es para las palabras de arriba, las que hay que relacionar
export interface TargetWord {
	word: string;
	semantics: string;
	font: string;
	firstLetter: string;
	// he añadido esta propiedad para saber si la palabra ha sido vista o no, para no repetirla
	seen: boolean;
	[key: string]: string | boolean; // Index signature
}

// Esta interfaz es para las palabras de abajo, las que se pueden elegir

export interface OptionWord {
	word: string;
	semantics: string;
	font: string;
	firstLetter: string;
	// aquí no existe la propiedad seen porque no es necesario, las palabras de opción no cambian
	[key: string]: string;
}
