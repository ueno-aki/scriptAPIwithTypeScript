import { Player } from "@minecraft/server";

export function greet(target: Player) {
    target.sendMessage("Hello" + target.name + "!");
}
