import { useState, useEffect, CSSProperties, MouseEventHandler } from 'react';
import { IWordGame } from '@/interfaces/WordGame';
import wordsJson from './targetWords.json';
import roundWordsJson from './optionWords.json';
import {
	validateWord,
	shuffleArray,
	followedLastCategory,
	followedAnyCategory,
	pickTarget,
} from '@/utils/wordUtils';
import { OptionWord, TargetWord } from '@/interfaces/Word';
import { useRouter } from 'next/router';
import { setInterval, clearInterval } from 'timers';
import { IGameConfig } from '@/interfaces/IGameConfig';
import axios from 'axios';

/*
Esta es la configuración del juego. 
De momento está hardcodeada pero se recibirá del backend o del panel de control del juego.
El tiempo está en segundos, son los timers los que van por ms
*/
const defaultGameConfig = {
	gameName: 'Word Game',
	categories: 3,
	maxTries: 5,
	maxScorePerCategory: 8,
	// wordsPerRound: 4,
	maxTimePerGame: 300,
	maxSecondsPerQuestion: 15,
};

const gameData: IWordGame = {
	gameName: 'Word Game',
	rightGuesses: 0,
	wrongGuesses: 0,
	omissions: 0,
	passedCategories: 0,
	perseverativeErrors: 0,
	nonPerseverativeErrors: 0,
	setContinuationErrors: 0,
	responseTime: [],
};
let tempErrors = 0;
let tempRightAnswers = 0;

const WordGame = () => {
	// ! Se tiene que utilizar el hook aquí porque sólo pueden utilizarse a nivel de componente y no dentro de funciones ! //
	const router = useRouter();

	useEffect(() => {
		const {
			gameName,
			categories,
			maxTries,
			maxScorePerCategory,
			maxTimePerGame,
			maxSecondsPerQuestion,
		} = router.query;

		const gameConfig: IGameConfig = {
			gameName: gameName as string,
			categories: categories as unknown as number,
			maxTries: maxTries as unknown as number,
			maxScorePerCategory: maxScorePerCategory as unknown as number,
			maxTimePerGame: maxTimePerGame as unknown as number,
			maxSecondsPerQuestion: maxSecondsPerQuestion as unknown as number,
		};

		setGameConfig(gameConfig);
	}, []);

	const [gameConfig, setGameConfig] = useState<IGameConfig>();

	// Con esto, copiamos el array de palabras del json a una variable sin modificar el original
	const [wordList, setWordList] = useState(shuffleArray(wordsJson.words));

	// roundWords es la lista de palabras que se muestran en cada ronda,
	// como no necesito modificarla, no la introduzco en el estado, la hago constante
	const roundWords: OptionWord[] = roundWordsJson.optionWords;
	const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
	// El contador de rondas, que empieza en 1
	const [round, setRound] = useState<number>(1);

	// La palabra diana/target de la ronda, que aparecerá en la parte superior de la pantalla y que se elige al azar
	const [target, setTarget] = useState<TargetWord>();

	// La lista de criterios de evaluación posibles
	const criterias = ['semantics', 'firstLetter', 'font'];

	// EL criterio de evaluación que se está siguiendo, que empieza siendo el primero de la lista
	const [criteria, setCriteria] = useState<string>(criterias[0]);

	// Flag que indica si se está escuchando para detectar errores perseverativos
	const [isListeningToPerseverativeErrors, setListenToPerseverativeErrors] =
		useState<boolean>(false);

	// Flag que indica si se está escuchando para detectar errores de continuación de serie
	const [isListeningToSetContinuationErrors, setListenToSetContinuationErrors] =
		useState<boolean>(false);

	// El contador del tiempo de la ronda, que empieza en el máximo establecido en la configuración
	const [roundTime, setRoundTime] = useState<number>();

	// El contador del tiempo de la partida, que empieza en el máximo establecido en la configuración
	const [gameTime, setGameTime] = useState<number>();

	// El criterio de evaluación de la ronda anterior, se utiliza para detectar errores perseverativos
	const [lastCriteria, setLastCriteria] = useState<string>('');

	useEffect(() => {
		if (gameConfig) {
			startGame();
		}
	}, [gameConfig]);

	const startGame = () => {
		setRoundTime(gameConfig?.maxSecondsPerQuestion);
		setGameTime(gameConfig?.maxTimePerGame);
		const { newWordList, notSeenWord } = pickTarget(wordList, roundWords);
		setTarget(notSeenWord);
		setWordList(newWordList);
		setIsGameStarted(true);
	};
	// Declaración de los timers
	let roundTimer: NodeJS.Timeout;
	let gameTimer: NodeJS.Timeout;

	// Termina el juego y envía los datos a la página de resultados
	const endGame = () => {
		console.log(gameData);
		axios
			.post(
				'http://localhost:8080/games/wordgame/results',
				{
					gameResults: gameData,
				},
				{ withCredentials: true }
			)
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
		const queryParams = new URLSearchParams(Object.entries(gameData)).toString();
		router.push('/results?' + queryParams);
	};

	/*
	Recibe la palabra en la que has clicado,
	valida que tu decisión sea correcta y responde consecuentemente.
	Cambia el color de fondo de la palabra añadiendo una clase de CSS,
	la quita después de 1 segundo
	*/
	const handleWordClick = (word: OptionWord): MouseEventHandler<HTMLDivElement> => {
		return (event: any) => {
			if (!isGameStarted) return;
			if (tempErrors >= gameConfig?.maxTries!) return;
			if (validateWord(criteria!, target!, word)) {
				rightGuess();
				setListenToPerseverativeErrors(false);
				if (isListeningToSetContinuationErrors) {
					gameData.setContinuationErrors++;
					setListenToSetContinuationErrors(false);
				}
				event.target.classList.remove('white-bg');
				event.target.classList.add('right-bg');
			} else {
				// Se comprueba si se ha seguido cualquier otro criterio y si se ha acertado al menos una vez
				// Si se cumple, se activa el contador de errores de continuación de serie
				if (followedAnyCategory(criterias, target!, word) && tempRightAnswers >= 1) {
					setListenToSetContinuationErrors(true);
				}

				// Se comprueba si se ha seguido el mismo criterio que en la ronda anterior, y si se ha fallado al menos dos veces
				// Si se cumple, lo cuenta como un error perseverativo
				// Si no, lo cuenta como un error no perseverativo
				if (
					followedLastCategory(lastCriteria, target!, word) &&
					isListeningToPerseverativeErrors === true &&
					tempErrors > 1
				) {
					gameData.perseverativeErrors++;
				} else {
					gameData.nonPerseverativeErrors++;
				}

				wrongGuess();
				// añade una clase de CSS que cambia el color de fondo de la palabra
				event.target.classList.remove('white-bg');
				event.target.classList.add('error-bg');
			}
			handleRoundChange();
			setTimeout(() => {
				// quita la clase de CSS que cambia el color de fondo de la palabra cuando han pasado 400 milisegundos
				event.target.classList.add('white-bg');
				event.target.classList.remove('error-bg');
				event.target.classList.remove('right-bg');
			}, 400);
		};
	};

	// Suma un error al resultado final, suma uno a los errores temporales y reinicia el contador de aciertos temporales
	const wrongGuess = () => {
		if (!isGameStarted) return;
		gameData.wrongGuesses++;
		tempErrors++;
		tempRightAnswers = 0;
	};

	// Suma un acierto al resultado final, suma uno a los aciertos temporales y reinicia el contador de errores temporales
	const rightGuess = () => {
		if (!isGameStarted) return;
		tempErrors = 0;
		tempRightAnswers++;
		gameData.rightGuesses++;
	};

	/* 
	Aumenta de ronda y guarda el tiempo de respuesta del usuario
	también controla el si hay que cambiar el criterio o 
	has cometido todos los errores permitidos	
	*/
	const handleRoundChange = () => {
		if (!isGameStarted) return;
		gameData.responseTime = [
			...gameData.responseTime,
			gameConfig?.maxSecondsPerQuestion! - roundTime!,
		];

		if (tempErrors >= gameConfig?.maxTries!) {
			clearInterval(roundTimer);
			clearInterval(gameTimer);
			console.log('has perdido');
			endGame();
			return;
		} // end game
		else if (tempRightAnswers >= gameConfig?.maxScorePerCategory!) {
			gameData.passedCategories++;
			tempRightAnswers = 0;
			if (gameData.passedCategories >= criterias.length) {
				// si has pasado todas las categorías, empieza a repetir
				// la lógica de esto es que la longitud de criterias es 3, y el número de categorías pasadas es 3, entonces
				// para volver a empezar, se tiene que poner el criterio en 0, que es el primero de la lista
				// y para eso se resta el número de categorías pasadas menos la longitud de criterias
				// 3 - 3 = 0 (el primer criterio) y 4 - 3 = 1 (el segundo criterio) y así sucesivamente
				setCriteria(criterias[gameData.passedCategories - criterias.length]);
			}
			// si no has pasado todas las categorías, procede con la siguiente
			else {
				setCriteria(criterias[gameData.passedCategories]);
			}
			setListenToPerseverativeErrors(true);
		}

		setRound(round + 1);
		return;
	};

	useEffect(() => {
		console.log(tempRightAnswers);
	}, [tempRightAnswers]);
	// Se ejecuta por cada segundo que pasa del timer global de 5 minutos
	useEffect(() => {
		if (!isGameStarted) return;
		if (gameTime === 0) {
			// end game
			clearInterval(gameTimer!);
			endGame();
		} else {
			// Decrementa el timer global cada segundo
			gameTimer = setInterval(() => {
				setGameTime(gameTime! - 1);
			}, 1000);
		}

		return () => clearInterval(gameTimer);
	}, [gameTime]);

	// Se ejecuta por cada segundo del timer de la ronda, controla las omisiones.
	useEffect(() => {
		if (!isGameStarted) return;
		if (tempErrors >= gameConfig?.maxTries!) {
			return clearInterval(roundTimer!);
		}
		if (roundTime! <= 0) {
			// Si se acaba el tiempo, se añade una omisión y se pasa a la siguiente ronda
			gameData.omissions = gameData.omissions + 1;
			gameData.wrongGuesses = gameData.wrongGuesses + 1;
			tempErrors++;
			handleRoundChange();
			setRoundTime(gameConfig?.maxSecondsPerQuestion);
		} else {
			// Decrementa el timer de la ronda cada segundo
			roundTimer = setInterval(() => {
				setRoundTime(roundTime! - 1);
			}, 1000);
		}
		return () => clearInterval(roundTimer);
	}, [roundTime]);

	// Cada ronda reinicia el timer y escoge una nueva palabra de la lista
	useEffect(() => {
		if (!isGameStarted) return;
		setRoundTime(gameConfig?.maxSecondsPerQuestion);
		const { newWordList, notSeenWord } = pickTarget(wordList, roundWords);
		setTarget(notSeenWord);
		setWordList(newWordList);
	}, [round]);

	/*
	Cierra los timers y te envía a la página de resultados cuando has completado todas las categorías acordadas,
	6 por defecto (2 cada una).
	*/
	useEffect(() => {
		if (!isGameStarted) return;
		setLastCriteria(criteria!);
		if (gameData.passedCategories >= gameConfig?.categories! * 2) {
			clearInterval(gameTimer);
			clearInterval(roundTimer);
			endGame();
		}
	}, [criteria]);

	return (
		<>
			<div>
				{gameTime} {roundTime}
			</div>
			<div className="min-h-screen flex flex-col">
				<div className="flex-1 flex flex-col xl:gap-40 sm:gap-0 items-center justify-center">
					<h1
						className="text-6xl font-bold text-black lg:text-8xl cursor-default select-none"
						style={{ fontFamily: target?.font }}
					>
						{target?.word.toUpperCase()}
					</h1>
					<div className="mt-4 max-w-7xl w-full mx-auto bg-gray-700 shadow-lg rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{roundWords.map((word) => (
							<div
								key={word.word}
								onClick={handleWordClick(word)}
								className="py-10 bg-white shadow-lg rounded-lg text-black font-bold text-lg text-center cursor-pointer select-none"
								style={{ fontFamily: word.font, fontSize: '36px' }}
							>
								{word.word}
							</div>
						))}
					</div>
				</div>
				<div className="h-1/5 bg-slate-50 flex items-end justify-center"></div>
			</div>
		</>
	);
};

export default WordGame;
