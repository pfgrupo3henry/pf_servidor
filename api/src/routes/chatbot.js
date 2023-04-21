const Router = require('express');
const router = Router();
const {
  Configuration,
  OpenAIApi,
} = require("openai");
const GPT3TokenizerImport= require ("gpt3-tokenizer");

const GPT3Tokenizer= typeof GPT3TokenizerImport === "function"
    ? GPT3TokenizerImport
    : GPT3TokenizerImport.default;

const tokenizer = new GPT3Tokenizer({ type: "gpt3" });

function getTokens(input) {
  const tokens = tokenizer.encode(input);
  return tokens.text.length;
};


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post("/", async (req, res) => {
  const requestMessages= req.body.messages;

  try {
    let tokenCount = 0;

    requestMessages.forEach((msg) => {
      const tokens = getTokens(msg.content);
      tokenCount += tokens;
    });

    const moderationResponse = await openai.createModeration({
      input: requestMessages[requestMessages.length - 1].content,
    });
    if (moderationResponse.data.results[0]?.flagged) {
      return res.status(400).send("Message is inappropriate");
    }

    const prompt =
    `Eres un asistente útil en una página web que vende videojuegos. Analiza y utiliza el siguiente json con datos de videojuegos disponibles en la tienda, para responder lo que se solicita pero no menciones este json o la palabra JSON en tu respuesta: 
   
    {"nombre":"A Way Out","precio":10680,"plataforma":"PS4"},{"nombre":"A Way Out Retro","precio":10080,"plataforma":"PS5"},{"nombre":"Alien
Isolation","precio":11160,"plataforma":"PS4"},{"nombre":"Alien
Isolation","precio":7348,"plataforma":"PS3"},{"nombre":"Alien Isolation PS5
Retro","precio":10080,"plataforma":"PS5"},{"nombre":"Among Us","precio":1800,"plataforma":"PS4"},{"nombre":"Among Us
PS5","precio":2400,"plataforma":"PS5"},{"nombre":"Anthem","precio":13440,"plataforma":"PS4"},{"nombre":"Anthem PS5
Retro","precio":19600,"plataforma":"PS5"},{"nombre":"ARK Survival
Evolved","precio":7280,"plataforma":"PS4"},{"nombre":"ARK Survival Evolved PS5
Retro","precio":6800,"plataforma":"PS5"},{"nombre":"Army of Two The Devils
Cartel","precio":4520,"plataforma":"PS3"},{"nombre":"Assassins
Creed","precio":3440,"plataforma":"PS3"},{"nombre":"Asassins Creed
3","precio":4972,"plataforma":"PS3"},{"nombre":"Assassins Creed 4 Black
Flag","precio":11160,"plataforma":"PS4"},{"nombre":"Assassins Creed 4 Black Flag PS5
Retro","precio":10080,"plataforma":"PS5"},{"nombre":"Back 4 Blood","precio":12200,"plataforma":"PS4"},{"nombre":"Back 4
Blood PS5","precio":21360,"plataforma":"PS5"},{"nombre":"Batman Arkham
City","precio":2000,"plataforma":"PS3"},{"nombre":"Batman Arkham
Knight","precio":8320,"plataforma":"PS4"},{"nombre":"Batman Arkham Knight PS5
Retro","precio":6800,"plataforma":"PS5"},{"nombre":"Batman Arkham
Origins","precio":4520,"plataforma":"PS3"},{"nombre":"Battlefield
5","precio":14080,"plataforma":"PS4"},{"nombre":"Battlefield 5 PS5
Retro","precio":13120,"plataforma":"PS5"},{"nombre":"Bayonetta","precio":4520,"plataforma":"PS3"},{"nombre":"Call of
Duty Advanced Warfare Gold Edition PS5 Retro","precio":19600,"plataforma":"PS5"},{"nombre":"Call Of Duty Black Ops 2
Revolution Map Pack","precio":11000,"plataforma":"PS3"},{"nombre":"Cal of Duty Black Ops
3","precio":11000,"plataforma":"PS3"},{"nombre":"Cal of Duty Black Ops 3 PS5
Retro","precio":19600,"plataforma":"PS5"},{"nombre":"Call of Duty Black Ops
3","precio":20320,"plataforma":"PS4"},{"nombre":"Call of Duty Black Ops 3 Zombies Chronicles
Edition","precio":20440,"plataforma":"PS4"},{"nombre":"Call of Duty Black Ops 3 Zombies Chronicles Edition PS5
Retro","precio":19600,"plataforma":"PS5"},{"nombre":"Call of Duty Black Ops
4","precio":19600,"plataforma":"PS4"},{"nombre":"Call of Duty Black Ops 4 PS5
Retro","precio":19600,"plataforma":"PS5"},{"nombre":"CTR Crash Team
Racing","precio":2400,"plataforma":"PS3"},{"nombre":"Crash Bandicoot N Sane
Trilogy","precio":13120,"plataforma":"PS4"},{"nombre":"Crash Team Racing Nitro
Fueled","precio":13360,"plataforma":"PS4"},{"nombre":"Cuphead","precio":4480,"plataforma":"PS4"},{"nombre":"Cuphead PS5
Retro","precio":6800,"plataforma":"PS5"},{"nombre":"Devil May Cry HD
Collection","precio":4520,"plataforma":"PS3"},{"nombre":"Devil May Cry HD Collection PS5
Retro","precio":10080,"plataforma":"PS5"},{"nombre":"Diablo 3 Eternal
Collection","precio":24480,"plataforma":"PS4"},{"nombre":"Diablo 3 Eternal Collection PS5
Retro","precio":19600,"plataforma":"PS5"},{"nombre":"Diablo 3 Reaper of Souls Ultimate Evil
Edition","precio":6680,"plataforma":"PS3"},{"nombre":"Digimon World Next
Order","precio":23040,"plataforma":"PS4"},{"nombre":"Digimon World Next Order PS5
Retro","precio":23040,"plataforma":"PS5"},{"nombre":"DUCATI 90th Anniversary PS5
Retro","precio":3480,"plataforma":"PS5"},{"nombre":"DUCATI 90th
Anniversary","precio":4160,"plataforma":"PS4"},{"nombre":"DUCATI 90th Anniversary PS5
Retro","precio":3480,"plataforma":"PS5"},{"nombre":"eFootball PES
2020","precio":13600,"plataforma":"PS4"},{"nombre":"eFootball PES 2020 PS5
Retro","precio":6800,"plataforma":"PS5"},{"nombre":"eFootball PES
2021","precio":11160,"plataforma":"PS4"},{"nombre":"eFootball PES 2021
PS5","precio":10080,"plataforma":"PS5"},{"nombre":"Elden Ring","precio":19600,"plataforma":"PS4"},{"nombre":"Elden Ring
PS5","precio":19600,"plataforma":"PS5"},{"nombre":"Fifa 20","precio":19600,"plataforma":"PS4"},{"nombre":"Fifa 20 PS5
Retro","precio":6800,"plataforma":"PS5"},{"nombre":"Fifa 21","precio":17880,"plataforma":"PS4"},{"nombre":"Fifa 21
PS5","precio":19600,"plataforma":"PS5"},{"nombre":"Fifa 22","precio":19760,"plataforma":"PS4"},{"nombre":"Fifa 22
PS5","precio":19760,"plataforma":"PS5"},{"nombre":"Fifa 23","precio":20000,"plataforma":"PS4"},{"nombre":"Fifa 23
PS5","precio":20000,"plataforma":"PS5"},{"nombre":"Final Fantasy VII
Remake","precio":20880,"plataforma":"PS4"},{"nombre":"Final Fantasy VII Remake
PS5","precio":26080,"plataforma":"PS5"},{"nombre":"Final Fantasy XV","precio":12160,"plataforma":"PS4"},{"nombre":"Final
Fantasy XV PS5","precio":15160,"plataforma":"PS5"},{"nombre":"Five Nights at Freddys Security
Breach","precio":13280,"plataforma":"PS4"},{"nombre":"Five Nights at Freddys Security
Breach","precio":14000,"plataforma":"PS5"},{"nombre":"God of War
Ragnarok","precio":19600,"plataforma":"PS4"},{"nombre":"God of War Ragnarok
PS5","precio":19120,"plataforma":"PS5"},{"nombre":"GTA IV Complete
Edition","precio":6680,"plataforma":"PS3"},{"nombre":"GTA San Andreas","precio":3440,"plataforma":"PS3"},{"nombre":"GTA
The Trilogy The Definitive Edition","precio":19840,"plataforma":"PS4"},{"nombre":"GTA The Trilogy The Definitive Edition
PS5","precio":19600,"plataforma":"PS5"},{"nombre":"GTA V","precio":4520,"plataforma":"PS3"},{"nombre":"GTA V
PS4","precio":10080,"plataforma":"PS4"},{"nombre":"GTA V PS5","precio":10080,"plataforma":"PS5"},{"nombre":"GTA Vice
City","precio":2400,"plataforma":"PS3"},{"nombre":"Just Dance 2017","precio":13960,"plataforma":"PS4"},{"nombre":"Just
Dance 2017 PS5","precio":13960,"plataforma":"PS5"},{"nombre":"Just Dance
2018","precio":13360,"plataforma":"PS4"},{"nombre":"Just Dance 2018
PS5","precio":6800,"plataforma":"PS5"},{"nombre":"Just Dance 2020","precio":13120,"plataforma":"PS4"},{"nombre":"Just
Dance 2020 PS5","precio":13120,"plataforma":"PS5"},{"nombre":"Just Dance
2021","precio":17440,"plataforma":"PS4"},{"nombre":"Just Dance 2021
PS5","precio":21760,"plataforma":"PS5"},{"nombre":"LEGO Jurassic
World","precio":7840,"plataforma":"PS4"},{"nombre":"LEGO Jurassic World
PS5","precio":6800,"plataforma":"PS5"},{"nombre":"LEGO Marvel
Avengers","precio":8080,"plataforma":"PS4"},{"nombre":"LEGO Marvel Avengers PS5
Retro","precio":4160,"plataforma":"PS5"},{"nombre":"LEGO Marvel Super
Heroes","precio":6920,"plataforma":"PS4"},{"nombre":"LEGO Marvel Super Heroes PS5
Retro","precio":6800,"plataforma":"PS5"},{"nombre":"LEGO Marvel Super Heroes
2","precio":7920,"plataforma":"PS4"},{"nombre":"LEGO Marvel Super Heroes 2 PS5
Retro","precio":8000,"plataforma":"PS5"},{"nombre":"Rise of the Tomb
Raider","precio":10080,"plataforma":"PS4"},{"nombre":"Rise of the Tomb
Raider","precio":10080,"plataforma":"PS5"},{"nombre":"Rocket League","precio":7080,"plataforma":"PS4"},{"nombre":"Rocket
League","precio":6800,"plataforma":"PS5"},{"nombre":"Saint Seiya Soldiers
Soul","precio":8840,"plataforma":"PS3"},{"nombre":"Saint Seiya Soldiers
Soul","precio":19800,"plataforma":"PS4"},{"nombre":"Saint Seiya Soldiers
Soul","precio":19600,"plataforma":"PS5"},{"nombre":"Saints Row 4 National Treasure
Edition","precio":4520,"plataforma":"PS3"},{"nombre":"South Park Retaguardia en
Peligro","precio":16360,"plataforma":"PS5"},{"nombre":"Spec Ops The
Line","precio":6680,"plataforma":"PS3"},{"nombre":"Spyro Reignited
Trilogy","precio":14480,"plataforma":"PS4"},{"nombre":"Spyro Reignited
Trilogy","precio":13120,"plataforma":"PS5"},{"nombre":"STAR WARS
Battlefront","precio":9200,"plataforma":"PS4"},{"nombre":"STAR WARS Battlefront
2","precio":9200,"plataforma":"PS4"},{"nombre":"STAR WARS Battlefront
    2","precio":6800,"plataforma":"PS5"}`

    tokenCount += getTokens(prompt);
    if (tokenCount > 4000) {
      return res.status(400).json({message: "Message is too long", tokens: tokenCount});
    }

    const apiRequestBody= {
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt },
      {role: "system", content: `El mail de la tienda es:  henrygamestore08@gmail.com , la tienda cuenta con 3 sucursales ubicadas en CABA:  1) Av. Libertador 4321, 2) O'Higgins 2341, 3)Carlos Paz 6897. Cuando te consulten por las sucursales indica que las puede ver en detalle desde la barra de navegación -->Conózcanos-->Contacto` },
      {role: "system", content: "No menciones en tu respuesta la palabra json o que estás usando un archivo"},
      {role: "system", content: "El videojuego Fifa 23 está disponible en nuestra tienda, proporciona la información brindada sobre este juego cuando el usuario te consulte sobre este"},
      {role: "user", content: "¿Con qué medio de pago puedo abonar?"},
      {role: "assistant", content: "Podés realizar la compra a través de la tienda online y abonar mediante MercadoPago con tarjeta de débito o crédito o podés acercarte a nuestras sucursales y abonar con efectivo o tarjeta"},
      ...requestMessages],
      temperature: 0.6,
    };
    const completion = await openai.createChatCompletion(apiRequestBody);

    res.json(completion.data);
  } catch (error) {
   
    res.status(500).json({message: "Something went wrong", error: error});
  }
});







module.exports = router;