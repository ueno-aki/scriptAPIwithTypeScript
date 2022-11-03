import { Player, world } from "@minecraft/server";
import { showMainMenu } from "./Form/ContainerMenu/index";
world.events.beforeItemUseOn.subscribe((ev) => {
    const { blockLocation, source } = ev;
    const block = source.dimension.getBlock(blockLocation);
    if (block.typeId === "minecraft:chest") {
        ev.cancel = true;
        showMainMenu(<Player>source);
    }
});
