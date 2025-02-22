from fastapi import FastAPI, HTTPException
import httpx
from pydantic import BaseModel
class PokemonRequest(BaseModel):
    id: int
app = FastAPI()

POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon/"
POKEMON_FORM_API_URL = "https://pokeapi.co/api/v2/pokemon-form/"

@app.post("/get_pokemon/")
async def get_pokemon(request: PokemonRequest):
    id = request.id
    async with httpx.AsyncClient() as client:
  
        pokemon_response = await client.get(f"{POKEMON_API_URL}{id}/")

        form_response = await client.get(f"{POKEMON_FORM_API_URL}{id}/")


    if pokemon_response.status_code != 200:
        raise HTTPException(status_code=404, detail="Pokémon not found")
    if form_response.status_code != 200:
        raise HTTPException(status_code=404, detail="Pokémon form not found")

    pokemon_data = pokemon_response.json()
    form_data = form_response.json()

    stats = [
        {
            "base_stat": stat["base_stat"],
            "effort": stat["effort"],
            "stat": {
                "name": stat["stat"]["name"],
                "url": stat["stat"]["url"],
            },
        }
        for stat in pokemon_data["stats"]
    ]

    return {
        "stats": stats,
        "name": form_data["name"],
        "sprites": {
            "back_default": form_data["sprites"]["back_default"],
            "back_female": form_data["sprites"].get("back_female"),
            "back_shiny": form_data["sprites"].get("back_shiny"),
            "back_shiny_female": form_data["sprites"].get("back_shiny_female"),
            "front_default": form_data["sprites"]["front_default"],
            "front_female": form_data["sprites"].get("front_female"),
            "front_shiny": form_data["sprites"].get("front_shiny"),
            "front_shiny_female": form_data["sprites"].get("front_shiny_female"),
        },
    }