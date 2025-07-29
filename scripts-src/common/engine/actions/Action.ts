import Game from "../games/Game";
import { NullaryProvider, ProviderContext } from "../providers/Provider";

/** An Action is a function that modifies a Context, and gives it back after some time. */
type Action = (ctx: Action.Context) => Promise<Action.Context>;

namespace Action {

    export class Context {
        public readonly game: Game;
        private readonly _providerContext: ProviderContext;
        public get providerContext() {
            // make sure provider context variables are up-to-date
            return this.game.inject(this._providerContext);
        }

        public constructor(game: Game, providerContext = new ProviderContext()) {
            this.game = game;
            this._providerContext = providerContext;
        }
    }


    /** The Action that does nothing */
    export const EMPTY_ACTION: Action = ctx => Promise.resolve(ctx);

    /**
     * Creates an Action that waits for some time.
     * @param millis number of milliseconds to wait for
     * @returns an Action that waits for the specified number of milliseconds
     */
    export function wait(millis: number): Action {
        return ctx => new Promise(resolve => setTimeout(() => resolve(ctx), millis));
    }

    /**
     * Creates an Action that performs one of the two given Actions, based on a condition.
     * @param condition condition to evaluate
     * @param ifTrue the Action that is performed if the condition evaluates to `true`
     * @param ifFalse the Action that is performed if the condition evaluates to `false`
     * @returns the conditional Action
     */
    export function conditional(condition: NullaryProvider<boolean>, ifTrue = EMPTY_ACTION, ifFalse = EMPTY_ACTION): Action {
        return ctx => {
            if (condition.apply(ctx.providerContext)) return ifTrue(ctx);
            else return ifFalse(ctx);
        }
    }

    /**
     * Creates an Action that performs the give action while the condition evaluates to `true`.
     * @param condition condition to evaluate
     * @param action Action to perform
     * @returns the looping Action
     */
    export function loopWhile(condition: NullaryProvider<boolean>, action: Action): Action {
        return ctx => new Promise(async resolve => {
            while (condition.apply(ctx.providerContext)) ctx = await action(ctx);

            resolve(ctx);
        });
    }

}

export default Action;