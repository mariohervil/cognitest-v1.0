import { OptionWord, TargetWord } from '../interfaces/Word';
import wordsJson from '../pages/games/wordgame/targetWords.json';

const shuffleWords = (array: TargetWord[]) => {
	let i = array.length;
	while (--i > 0) {
		let temp = Math.floor(Math.random() * (i + 1));
		[array[temp], array[i]] = [array[i], array[temp]];
	}
	return array;
};

const validateWord = (criteria: string, target: TargetWord, chosenWord: OptionWord) => {
	return target[criteria] === chosenWord[criteria];
};

const followedLastCategory = (lastCriteria: string, target: TargetWord, chosenWord: OptionWord) => {
	if (lastCriteria == '') return false;
	return target[lastCriteria] === chosenWord[lastCriteria];
};

const followedAnyCategory = (criterias: string[], target: TargetWord, chosenWord: OptionWord) => {
	return criterias.some((crit) => target[crit] === chosenWord[crit]);
};

// Función de utilidad para pasar una lista de cualquier tipo por el algoritmo de Fisher-Yates
const shuffleAny = (array: any[]) => {
	let i = array.length;
	while (--i > 0) {
		let temp = Math.floor(Math.random() * (i + 1));
		[array[temp], array[i]] = [array[i], array[temp]];
	}
	return array;
};

/**
 *
 * @param newWordList la lista general de palabras, que se va a usar para escoger la palabra diana/target
 * @param roundWords la lista de las palabras opción
 * @returns la palabra diana/target y la lista de palabras actualizada con la propiedad "seen" de la palabra diana/target
 * modificada a true, que indica que esa palabra ya ha sido vista
 */
const pickTarget = (newWordList: TargetWord[], roundWords: OptionWord[]) => {
	// Con esta función, si no hay ninguna palabra que no haya sido vista, se resetea el seen de todas
	// y se vuelve a buscar una palabra que no haya sido vista

	let notSeenWord = newWordList.find((word) => !word.seen);

	if (notSeenWord) {
		notSeenWord.seen = true;

		// ! Opcional ! //
		// Se asigna la fuente tras escoger la palabra, para que no se repita la fuente
		// y pueda haber más posibilidades, ej: si golf coincide con equitación en semántica,
		// y con gel en primera letra, golf no tendrá la fuente de equitación ni de gel,
		// sino que tendrá la fuente de una de las palabras que no coincidan con golf ni en semántica ni en primera letra,
		// es decir, las fuentes de cereza o de rana
		// ! Si se quiere quitar la feature mencionada, eliminar la siguiente línea de código y la de más abajo, que tiene el mismo contenido ! //
		notSeenWord = assignFont(notSeenWord, roundWords);
		// ! Esta ⤴️ ! //
		return { notSeenWord, newWordList };
	}

	// Si no hay ninguna palabra que no haya sido vista, se resetea el seen de todas,
	// haciendo que todas sean elegibles de nuevo
	resetWords(newWordList);

	// Se vuelve a buscar una palabra que no haya sido vista después de resetearlas,
	// es decir, la primera de la lista
	notSeenWord = newWordList.find((word) => !word.seen);

	// !-------------------------------------------------------------------------------------!
	// Pongo el operador de negación aunque sea mala práctica porque sé que siempre
	// va a haber una palabra que no ha sido vista, porque se acaba de resetear toda la lista
	// entonces es imposible que todas las palabras hayan sido vistas,
	// que es la condición para que devuelva undefined
	notSeenWord!.seen = true;

	// ! Opcional ! //
	notSeenWord = assignFont(notSeenWord!, roundWords);
	// ! Esta ⤴️ ! //

	return { notSeenWord, newWordList };
};

const resetWords = (wordList: TargetWord[]) => {
	wordList.map((word) => {
		console.log(word.seen);
		return (word.seen = false);
	});
};

const assignFont = (notSeenWord: TargetWord, roundWords: OptionWord[]) => {
	let fonts = roundWords.map((word) => word.font);

	const usedFonts: Set<string> = new Set<string>();
	let availableFonts: string[] = [];
	roundWords.forEach((roundWord) => {
		if (
			notSeenWord!.firstLetter === roundWord.firstLetter ||
			notSeenWord!.semantics === roundWord.semantics
		) {
			usedFonts.add(roundWord.font);
		}
		availableFonts = fonts.filter((font) => !usedFonts.has(font));
	});

	notSeenWord!.font = shuffleAny(availableFonts)[0];
	return notSeenWord;
};

// función para recibir un número aleatorio
const getRandomInt = (max: number) => {
	return Math.floor(Math.random() * max);
};

export {
	shuffleWords as shuffleArray,
	validateWord,
	shuffleAny,
	followedLastCategory,
	followedAnyCategory,
	getRandomInt,
	pickTarget,
};
