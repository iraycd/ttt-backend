interface Dependencies {
  arangoDI;
}
export default class AddGameToRoomCommand {
  model;
  value;
  constructor({ arangoDI }: Dependencies) {
    this.model = new arangoDI.Game2Room();
  }
  init(dto) {
    this.value = dto;
  }
  async run() {
    return this.model.link(this.value);
  }
}
