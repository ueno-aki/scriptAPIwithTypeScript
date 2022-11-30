import { Player } from "@minecraft/server";

export function greet(target: Player) {
    target.tell("Hello" + target.name + "!");
}
