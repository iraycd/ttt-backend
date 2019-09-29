interface Dependencies {arangoDI}
export default class CreateRoomCommand {
    model
    value
    constructor({arangoDI}:Dependencies) {
        this.model = new arangoDI.Room()
    };
    init(dto) {
        this.value = dto
    }
    async run() {
        return this.model.save(this.value)
    }
};