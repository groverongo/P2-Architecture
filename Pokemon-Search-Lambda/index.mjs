import axios from "axios";
import { DateTime } from "luxon";

axios.interceptors.request.use(
  function (config) {
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);



axios.interceptors.response.use(
  function (response) {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  },
);

// Make axios get request  and return json body
function get_pokemon(api_url, pokemon_name, poke_api = false) {
  // Lower-case
  if (poke_api) {
    pokemon_name = pokemon_name.toLowerCase();
  }

  return axios.get(api_url + pokemon_name).catch(function (error) {
    return {data: {}, status: error.status, duration: error.duration}
  });
}

export const handler = async (event) => {
  // TODO implement

  let pokemon_name = JSON.parse(event.body).pokemon_name;
  
  try {
    const [poke_api, poke_image, poke_stats] = await Promise.all([
      await get_pokemon(process.env.POKE_API_URL, pokemon_name, true),
      await get_pokemon(process.env.POKE_IMAGE_URL, pokemon_name),
      await get_pokemon(process.env.POKE_STATS_URL, pokemon_name),
    ]);
    
     const all_responses = [
    { response: poke_api, name: "PokeAPI" },
    { response: poke_stats, name: "PokeStats" },
    { response: poke_image, name: "PokeImages" },
  ];

  for (const { response, name } of all_responses) {
    const status = response.status !== 200 ? "fail" : "success";
    const currentDate = DateTime.now()
      .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
      .toFormat("dd/MM/yyyy");
    console.log(name, `(${status},${response.duration}ms,${currentDate})`);
  }

  const [poke_stats_data, poke_image_data, poke_api_data] = [
    poke_stats.data,
    poke_image.data,
    poke_api.data,
  ];

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      poke_stats_data,
      poke_image_data,
      poke_api_data,
    }),
  };
  return response;
  } catch (error){
    console.log(error)
  }

 
};
