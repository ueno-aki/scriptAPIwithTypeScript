import { world } from "@minecraft/server";
import { greet } from "./function";

world.beforeEvents.chatSend.subscribe((ev) => {
    greet(ev.sender);
    console.log(ev.message);
});
