import json

def lambda_handler(event, context):
    
    pokemon_name = event.get("pathParameters").get("pokemon")
    pokemon_name = pokemon_name[0].upper() + pokemon_name[1:]
    
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps({
            "image_url": f'https://firebasestorage.googleapis.com/v0/b/software-e0e07.appspot.com/o/pokemons%2F{pokemon_name}%2F0.jpg?alt=media'
        })
    }
