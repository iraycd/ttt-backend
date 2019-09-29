import * as awilix from "awilix";
import CommandList from "./CommandList";
import QueryList from "./QueryList";
import ArangoDB from "./Database/models";
import CreateRoomCommand from "./Commands/Room/createRoom.Command";
import AddGamerCommand from "./Commands/Gamer/addGamer.Command";
import AddGamerToRoomCommand from "./Commands/Room/addGamerToRoom.Command";
import MakeMoveCommand from "./Commands/Game/makeMove.Command";
import CreateGameCommand from "./Commands/Game/createGame.Command";
import AddGamerToGameCommand from "./Commands/Game/addGamerToGame.Command";
import AddGameToRoomCommand from "./Commands/Room/addGameToRoom.Command";
import ListGameQuery from "./Query/Game/listGameQuery";
import GetGameDetailed from "./Query/Game/getGameQuery";

const { createContainer, asValue, asClass } = awilix;
const ContainerAwlix = createContainer();

const exporter = {
  arangoDI: asValue(ArangoDB)
};

exporter[CommandList.Room.CREATE_ROOM] = asClass(CreateRoomCommand);
exporter[CommandList.Room.ADD_GAME_TO_ROOM] = asClass(AddGameToRoomCommand);
exporter[CommandList.Room.ADD_GAMER_TO_ROOM] = asClass(AddGamerToRoomCommand);
exporter[CommandList.Game.CREATE_GAME] = asClass(CreateGameCommand);
exporter[CommandList.Gamer.ADD_GAMER] = asClass(AddGamerCommand);
exporter[CommandList.Game.ADD_GAMER_TO_GAME] = asClass(AddGamerToGameCommand);
exporter[CommandList.Game.MAKE_MOVE] = asClass(MakeMoveCommand);
exporter[QueryList.Game.LIST_GAME] = asClass(ListGameQuery);
exporter[QueryList.Game.GET_GAME_DETAILED] = asClass(GetGameDetailed);

ContainerAwlix.register(exporter);

const container = ContainerAwlix;
export default container;
