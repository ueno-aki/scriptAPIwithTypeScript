import { world } from "@minecraft/server";
import { greet } from "./function";

world.events.beforeChat.subscribe((ev) => {
    greet(ev.sender);
    console.log(ev.message);
});
