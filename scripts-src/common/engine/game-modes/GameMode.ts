import { Team } from "../games/Team";
import { NullaryProvider, ProviderContext } from "../providers/Provider";

class GameMode {

    public static readonly TEAM_NAME_VARNAME = "team.name";
    public static readonly TEAM_SIZE_VARNAME = "team.size";
    public static readonly TEAM_POINTS_VARNAME = "team.points";
    public static readonly TEAM_MEMBER_NAMES_VARNAME = "team.memberNames";


    public readonly name: string;
    public readonly description: string;

    public readonly performanceMetric: NullaryProvider<number>;

    public constructor(init: GameMode.Init) {
        this.name = init.name;
        this.description = init.description;
        this.performanceMetric = init.performanceMetric;
    }


    /**
     * Calculates a metric that indicates how well a team is performing.
     * Lower values correspond to better performance.
     * @param team Team to evaluate performance for
     */
    public calculatePerformance(team: Team, ctx?: ProviderContext): number {
        ctx = ctx ? ctx.copy() : new ProviderContext();

        ctx.setStringVar(GameMode.TEAM_NAME_VARNAME, team.name);
        ctx.setNumberVar(GameMode.TEAM_SIZE_VARNAME, team.size);
        ctx.setNumberVar(GameMode.TEAM_POINTS_VARNAME, team.points);
        ctx.setStringArrayVar(GameMode.TEAM_MEMBER_NAMES_VARNAME, team.members.map(p => p.name));

        return this.performanceMetric.apply(ctx);
    }

}

namespace GameMode {

    export interface Init {
        name: string,
        description: string,
        performanceMetric: NullaryProvider<number>
    }

}

export default GameMode;