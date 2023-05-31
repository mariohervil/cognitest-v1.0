export interface IWordGame {
	gameName: string;
	rightGuesses: number;
	wrongGuesses: number;
	omissions: number;

	// Número de categorías correctas identificadas (8 aciertos consecutivos)
	passedCategories: number;

	// Número de palabras que el sujeto ordena bajo una categoría anterior correcta, a pesar del feedback negativo tras cometer un error​
	perseverativeErrors: number;

	// Errores que no se deben a la aplicación de una relación correcta anterior, sino errores debidos al azar​
	nonPerseverativeErrors: number;

	// Cuando el usuario, a mitad de una categoría, responde con otro criterio, para posteriormente volver a la categoría adecuada ​
	setContinuationErrors: number;
	/*
		Tiene que haber un cambio de categoría
		Tiene que haber algún acierto
		Tiene que fallar por seguir el criterio anterior y volver a acertar
	 */

	// Tiempo de respuesta de cada pantalla​
	responseTime: number[];
}

/*
gameName,
		rightGuesses,
		wrongGuesses,
		omissions,
		passedCategories,
		perseverativeErrors,
		nonPerseverativeErrors,
		setContinuationErrors,
		responseTime,
*/