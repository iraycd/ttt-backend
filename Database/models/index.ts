import { Database } from "arangojs";
import configJSON from "../config/config";
const db = new Database({ url: configJSON.ARANGO_URL });
db.useDatabase(configJSON.ARANGO_DB);

import Game from "./game";
import Gamer from "./gamer";
import Room from "./room";
import Game2Room from "./game2room";
import Gamer2Room from "./gamer2room";
import Gamer2Game from "./gamer2game";
import Move from "./move";

const models = {
  Game: Game(db),
  Gamer: Gamer(db),
  Room: Room(db),
  Game2Room: Game2Room(db),
  Gamer2Room: Gamer2Room(db),
  Gamer2Game: Gamer2Game(db),
  Move: Move(db)
};

const ArangoDB = { ...models, ...db, db };

export default ArangoDB;
