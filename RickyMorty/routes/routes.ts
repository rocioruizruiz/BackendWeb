import { Router } from 'https://deno.land/x/oak/mod.ts';
import { status } from "../src/status.ts";
import { getCharacters, getCharacterById, updateCharacterById, deleteCharacterById } from "../src/characters.ts";
import { getEpisodes, getEpisodeById, deleteEpisodeById } from "../src/episodes.ts";
import { getLocations, getLocationById, deleteLocationById } from "../src/locations.ts";
 

const router = new Router();
router.get("/", (ctx:any) => {
    ctx.response.body = "Homeeeeeee";
    ctx.response.status = 200;
        
});
router.get("/status", status);

//CHARACTERS
router
    .get("/characters", getCharacters)
    .get("/characters/:id", getCharacterById)
    .put("/characters/:id", updateCharacterById)
    .delete("/characters/:id", deleteCharacterById);

//EPISODES
router
    .get("/episodes", getEpisodes)
    .get("/episodes/:id", getEpisodeById)
    .delete("/episodes/:id", deleteEpisodeById);

    //LOCATIONS
router  
    .get("/locations", getLocations)
    .get("/locations/:id", getLocationById)
    .delete("/locations/:id", deleteLocationById);

export default router;