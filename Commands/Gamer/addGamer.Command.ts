interface Dependencies {arangoDI}
export default class AddGamerCommand {
    model
    value
    constructor({arangoDI}:Dependencies) {
        this.model = new arangoDI.Gamer()
    };
    init(dto) {
        this.value = dto
    }
    async run() {
        return this.model.save(this.value)
    }
};