import Gamemode from "../gamemodes/Gamemode";
import { ProviderContext } from "../providers/Provider";
import { Team } from "./Team";

export default class Game {

    private readonly gameMode: Gamemode;
    public readonly teams: Team[];
    private turnCount = 0;

    public constructor(gameMode: Gamemode, teams: Team[]) {
        this.gameMode = gameMode;
        this.teams = teams;
    }

    /**
     * Gives a list of all teams, from best performing to worst performing
     * @returns list of teams, sorted by descending performance
     */
    public getTeamsByScore(): Team[] {
        return this.teams.map(team => { return { team, performance: this.gameMode.calculatePerformance(team) }; })
            .sort((a, b) => a.performance - b.performance) // sort by score
            .map(({ team }) => team);
    }

    /**
     * Injects this Game's information into the given context
     * @param ctx Provider context
     * @returns `ctx`
     */
    public inject<Ctx extends ProviderContext>(ctx: Ctx): Ctx {
        // add general game info
        ctx.setNumberVar("game.numTeams", this.teams.length);
        ctx.setNumberVar("game.turnCount", this.turnCount);

        // add team info
        for (let i = 0; i < this.teams.length; i++) {
            const team = this.teams[i];

            ctx.setStringVar(`game.team${i}.name`, team.name);
            ctx.setNumberVar(`game.team${i}.size`, team.size);
            ctx.setNumberVar(`game.team${i}.points`, team.points);
            ctx.setNumberVar(`game.team${i}.performance`, this.gameMode.calculatePerformance(team));
            ctx.setStringArrayVar(`game.team${i}.memberNames`, team.members.map(p => p.name));
        }

        // add team info sorted by score
        const teamsByScore = this.getTeamsByScore();
        for (let i = 0; i < this.getTeamsByScore.length; i++) {
            const team = teamsByScore[i];

            ctx.setStringVar(`game.teamN${i}.name`, team.name);
            ctx.setNumberVar(`game.teamN${i}.size`, team.size);
            ctx.setNumberVar(`game.teamN${i}.points`, team.points);
            ctx.setNumberVar(`game.teamN${i}.performance`, this.gameMode.calculatePerformance(team));
            ctx.setStringArrayVar(`game.teamN${i}.memberNames`, team.members.map(p => p.name));
        }

        return ctx;
    }

}