interface Dependencies {arangoDI}
export default class AddGameToRoomCommand {
    model
    value
    constructor({arangoDI}:Dependencies) {
        this.model = new arangoDI.Gamer2Room()
    };
    init(dto) {
        this.value = dto
    }
    async run() {
        return this.model.link(this.value)
    }
};