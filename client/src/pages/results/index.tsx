import { useRouter } from 'next/router';
import { IWordGame } from '../../interfaces/WordGame';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Extendemos el plugin de ChartJS para que se pueda mostrar el texto en el centro del gráfico.
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

import useAuthStore from '@/hooks/useAuthStore';
import ProtectedRoute from '@/components/ProtectedRoute';

// Interfaz de los datos de cada categoría.
export interface ResultItem {
	subject: string;
	A: number;
	fullMark: number;
	maxScore?: number;
	score?: number;
}

const maxTotalScore = 100; // Puntuación total máxima deseada
const decimalPlaces = 2; // Número de decimales a mostrar

// Función para calcular la puntuación de cada categoría.
// El funcionamiento es el siguiente:
// 1. Se calcula la puntuación de cada categoría con la fórmula: (A / fullMark) * maxTotalScore
// 2. Se calcula la puntuación total de todas las categorías.
// 3. Se calcula el factor de escala para que la puntuación total sea la deseada.
// 4. Se multiplica la puntuación de cada categoría por el factor de escala.
// 5. Se devuelve la lista de categorías con la puntuación calculada.
export function calculateScore(
	items: ResultItem[],
	maxTotalScore: number,
	decimalPlaces: number
): ResultItem[] {
	// const totalFullMark = items.reduce((total, item) => total + item.fullMark, 0);
	const scoredItems = items.map((item) => {
		const score = (item.A / item.fullMark) * maxTotalScore;
		return {
			...item,
			score: parseFloat(score.toFixed(decimalPlaces)),
		};
	});

	const totalScore = scoredItems.reduce((total, item) => total + item.score, 0);
	const scaleFactor = maxTotalScore / totalScore;

	scoredItems.forEach((item) => {
		item.score = parseFloat((item.score * scaleFactor).toFixed(decimalPlaces));
	});

	return scoredItems;
}

const Result = () => {
	// Resultados del juego de palabras.
	const [results, setResults] = useState<IWordGame>();

	// Datos de cada categoría, se calculan a partir de los resultados del juego y se utilizan para formatear los datos para asignarlos a los que se muestran en el gráfico.
	const [data, setData] = useState<ResultItem[]>([]);
	const router = useRouter();

	// Datos que se muestran en el gráfico.
	const [shownData, setShownData] = useState<any>([]);

	// Obtiene la sesión del usuario para indicar de qué usuario son los resultados.
	const session = useAuthStore((state) => state.session);

	// Obtiene los resultados del juego de palabras de la url.
	const {
		gameName,
		rightGuesses,
		wrongGuesses,
		omissions,
		passedCategories,
		perseverativeErrors,
		nonPerseverativeErrors,
		setContinuationErrors,
		responseTime,
	} = router.query;

	useEffect(() => {
		// Si no existen los resultados, no se hace nada.
		if (!router.query) return;
		if (
			!gameName ||
			!rightGuesses ||
			!wrongGuesses ||
			!omissions ||
			!passedCategories ||
			!perseverativeErrors ||
			!nonPerseverativeErrors ||
			!setContinuationErrors ||
			!responseTime
		)
			return;

		// Se asignan los resultados a la variable results.
		setResults({
			gameName: gameName as string,
			rightGuesses: Number(rightGuesses),
			wrongGuesses: Number(wrongGuesses),
			omissions: Number(omissions),
			passedCategories: Number(passedCategories),
			perseverativeErrors: Number(perseverativeErrors),
			nonPerseverativeErrors: Number(nonPerseverativeErrors),
			setContinuationErrors: Number(setContinuationErrors),
			responseTime: (responseTime as string).split(',').map((time) => Number(time)),
		} as IWordGame);
	}, [
		rightGuesses,
		wrongGuesses,
		omissions,
		passedCategories,
		perseverativeErrors,
		nonPerseverativeErrors,
		setContinuationErrors,
		responseTime,
		router.query,
	]);

	useEffect(() => {
		if (!results) return;

		// Se calcula la puntuación de cada categoría y se formatean los datos para asignarlos a la variable shownData.
		setData(
			calculateScore(
				[
					{
						subject: 'Cantidad de aciertos',
						A: results.rightGuesses,
						fullMark: results.rightGuesses + results.wrongGuesses,
					},

					{
						subject: 'Cantidad de fallos',
						A: results.wrongGuesses,
						fullMark: results.rightGuesses + results.wrongGuesses,
					},
					{
						subject: 'Omisiones',
						A: results.omissions,
						fullMark: results.rightGuesses + results.wrongGuesses,
					},
					{
						subject: 'Categorias superadas',
						A: results.passedCategories,
						fullMark: 6,
					},
					{
						subject: 'Errores perseverativos',
						A: results.perseverativeErrors,
						fullMark: results.wrongGuesses,
					},
					{
						subject: 'Errores no perseverativos',
						A: results.nonPerseverativeErrors,
						fullMark: results.wrongGuesses,
					},
					{
						subject: 'Errores de continuacion de serie',
						A: results.setContinuationErrors,
						fullMark: results.wrongGuesses,
					},
					{
						subject: 'Tiempo de respuesta',
						A:
							results.responseTime
								.map((time: number) => 5)
								.reduce((a: number, b: number) => a + b, 0) /
							results.responseTime.length /
							results.responseTime.reduce((a: number, b: number) => a + b, 0) /
							results.responseTime.length,
						fullMark:
							results.responseTime
								.map(() => 5)
								.reduce((a: number, b: number) => a + b, 0) /
							results.responseTime.length,
					},
				],
				maxTotalScore, // Puntuación total máxima deseada
				decimalPlaces // Número de decimales a mostrar
			)
		);
	}, [results]);

	useEffect(() => {
		// Se asignan los datos formateados a la variable shownData para mostrarlos en el gráfico.
		setShownData({
			datasets: [
				{
					// los datos de a mostrar en el gráfico
					data: data.map((item) => item.score),
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderWidth: 1,
					label: `Resultados de ${session?.firstName + ' ' + session?.lastName}`, // for legend
				},
			],
			labels: data.map((item) => item.subject),
		});
	}, [data]);

	// Si no se han cargado los datos, se muestra un mensaje de carga, aunque no puede ocurrir porque se comprueba que existan los datos antes de mostrar la página.
	if (!shownData || !data || !results) return <div>Loading...</div>;

	return (
		<ProtectedRoute>
			<div className="flex flex-col justify-center h-min bg-gray-200">
				<Radar
					data={shownData}
					width={100}
					height={50}
					options={{ maintainAspectRatio: false }}
				/>
			</div>
		</ProtectedRoute>
	);
};

export default Result;
