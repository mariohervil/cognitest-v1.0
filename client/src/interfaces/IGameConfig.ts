export interface IGameConfig {
	id?: string;
	gameName: string;
	configName?: string;
	categories: number;
	maxTries: number;
	maxScorePerCategory: number;
	maxTimePerGame: number;
	maxSecondsPerQuestion: number;
	[key: string]: any;
}

export interface IResults {
	configs?: IGameConfig[];
	buttonFlagUpdate?: boolean;
}
