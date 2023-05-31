import { IGameConfig } from "./IGameConfig";

interface ICardProps{
    gameConfig: IGameConfig;
    onDelete?: () => void;
    flagUpdate: () => void;

}

export default ICardProps;