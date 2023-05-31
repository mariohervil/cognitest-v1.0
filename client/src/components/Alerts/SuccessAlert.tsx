import { useEffect, useState } from 'react';

const SuccessAlert = (props: { visibility: boolean }) => {
	const [visibility, setVisibility] = useState(props.visibility);
	const [progress, setProgress] = useState(0);
	const [timer, setTimer] = useState<NodeJS.Timer | null>();

	useEffect(() => {
		if (props.visibility) setVisibility(true);
	}, [props.visibility]);

	useEffect(() => {
		if (visibility) {
			clearInterval(timer!);
			const startTime = Date.now();
			setTimer(
				setInterval(() => {
					const elapsedTime = Date.now() - startTime;
					const newProgress = (elapsedTime / 4000) * 100;
					if (newProgress <= 100) {
						setProgress(newProgress);
					} else {
						setVisibility(false);
						clearInterval(timer!);
						setProgress(0);
					}
				}, 10)
			);
		} else {
			clearInterval(timer!);
			setProgress(0);
		}
	}, [visibility]);

	return (
		<div
			className={`${
				visibility ? 'visible' : 'hidden'
			} alert alert-success shadow-lg flex flex-col`}
		>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span className="text-left">Se ha guardado la configuración!</span>
			</div>
			<div className="h-1 bg-transparent dark:bg-opacity-50 rounded-xl overflow-hidden">
				<div className="h-full bg-green-600 rounded-xl" style={{ width: `${progress}%` }}>
					{/* TODO: Encontrar la manera de que sea visible sin escribir nada, funciona si escribes dentro del div */}
					AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
				</div>
			</div>
		</div>
	);
};

export default SuccessAlert;
