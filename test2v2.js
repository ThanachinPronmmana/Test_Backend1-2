const express = require("express")
const app = express()
const axios = require("axios")
const pokemon_URL = "https://pokeapi.co/api/v2/pokemon/"
const pokemon_from_URL = "https://pokeapi.co/api/v2/pokemon-form/"

app.use(express.json())

app.get("/api/:id",async(req,res)=>{
    try{
        const {id} = req.params
        const pokemon_URL = `https://pokeapi.co/api/v2/pokemon/${id}`
        const pokemon_from_URL = `https://pokeapi.co/api/v2/pokemon-form/${id}`
        const [ pokemonres,formres] = await Promise.all([
            axios.get(pokemon_URL),
            axios.get(pokemon_from_URL)
        ]
        )
        const pokemonData = pokemonres.data
        const formData = formres.data
        const stats = pokemonData.stats.map((stat)=>({
            base_stat:stat.base_stat,
            effort:stat.effort,
            stat:{
                name:stat.name,
                url:stat.url
            }
        }))
        res.json({
            id:pokemonData.id,
            name:formData.name,stats,
            sprites:formData.sprites,
        })
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error"
        })
    }

})



app.listen(9000,()=> console.log("On port 9000"))