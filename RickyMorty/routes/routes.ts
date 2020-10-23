import { Router } from 'https://deno.land/x/oak/mod.ts';
import { home } from "../src/home.ts";
import { getCharacters, getCharacterById } from "../src/characters.ts";
import { getEpisodes, getEpisodeById } from "../src/episodes.ts";
import { getLocations, getLocationById } from "../src/locations.ts";
 

const router = new Router();
router.get("/", home);

//CHARACTERS
router
    .get("/characters", getCharacters)
    .get("/characters/:id", getCharacterById)
   
//EPISODES
router
    .get("/episodes", getEpisodes)
    .get("/episodes/:id", getEpisodeById)
   

//LOCATIONS
router  
    .get("/locations", getLocations)
    .get("/locations/:id", getLocationById)
    

export default router;