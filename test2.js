const express = require('express')
const axios = require('axios')
const app = express()
const POKEMON_STATS = "https://pokeapi.co/api/v2/pokemon/1"
const POKEMON_NAME_PRITES = "https://pokeapi.co/api/v2/pokemon-form/1"

app.use(express.json())

app.post("/api", async (req, res) => {
    try {
        const { id } = req.body
        if (!id) {
            return res.status(400).json({
                message: "Pokemon ID required"
            })
        }
        const pokemonres = await axios.get(`${POKEMON_STATS}${id}`)
        const formres = await axios.get(`${POKEMON_NAME_PRITES}${id}`)
        const pokemonData = pokemonres.data
        const formData = formres.data

        const stats = pokemonData.stats.map((stat) => ({
            base_stat: stat.base_stat,
            effort: stat.effort,
            stat: {
                name: stat.stat.name,
                url: stat.stat.url
            }
        }))
        res.json({
            stats,
            name: formData.name,
            sprites: {
                back_default: formData.sprites.back_default,
                back_female: formData.sprites.back_female,
                back_shiny_female: formData.sprites.back_shiny_female,
                front_default: formData.sprites.front_default,
                front_female: formData.sprites.front_female,
                front_shiny: formData.sprites.front_shiny,
                front_shiny_female: formData.sprites.front_shiny_female,
            }
        })

    } catch (err) {

        res.status(500).json({
            message: "Server Error"
        })
    }
})

app.listen(5000, () => console.log("On port 5000"))