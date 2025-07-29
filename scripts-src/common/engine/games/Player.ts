
export class Player {
    public readonly name: string;
    public points: number;

    public constructor(name: string, points = 0) {
        this.name = name;
        this.points = points;
    }
}
