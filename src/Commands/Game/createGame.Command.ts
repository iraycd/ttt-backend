interface Dependencies {
  arangoDI;
}
export default class CreateGameCommand {
  model;
  value;
  constructor({ arangoDI }: Dependencies) {
    this.model = new arangoDI.Game();
  }
  init(dto) {
    this.value = dto;
  }
  async run() {
    return this.model.save(this.value);
  }
}
