import GameConfigForm from '../GameConfigurationForm';
import { useState } from 'react';

const SidebarConfig = () => {
	return (
		<>
			<h1 className="my-5 text-3xl font-bold text-center">WORDGAME</h1>
			<div>
				<GameConfigForm />
			</div>
		</>
	);
};

export default SidebarConfig;
