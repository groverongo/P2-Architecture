import postgres from 'postgres';


let connection_options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME
}

export const handler = async (event) => {
    // Connect to database
    const sql = postgres(connection_options);
    
    let pokemon_name = event.pathParameters.pokemon

    // Query pokemon from table pokestats
    let pokemon = await sql`SELECT * FROM pokestats WHERE name = ${pokemon_name}`;
    
    if (pokemon.length == 0) {
      const response = {
        statusCode: 404,
        body: JSON.stringify("Pokemon not found"),
      };
      return response;
    }
    
    const response = {
      statusCode: 200,
      body: JSON.stringify(pokemon.at(0)),
    };
    return response;
  };
  