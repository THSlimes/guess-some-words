import { Player } from "./Player";


export class Team {

    public readonly name: string;
    public readonly members: Readonly<Player[]>;
    public get size() {
        return this.members.length;
    }

    public get points(): number {
        return this.members.reduce((sum, p) => sum + p.points, 0);
    }

    public constructor(name: string, members: Player[]) {
        this.name = name;
        this.members = Object.freeze(members);
    }

}
