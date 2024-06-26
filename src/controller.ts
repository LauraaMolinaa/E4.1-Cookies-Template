import { IncomingMessage, ServerResponse } from "http";
import { database } from "./model";
import { renderTemplate } from "./view";

/**
 * All of these function have a TODO comment. Follow the steps in the
 * instructions to know which function to work on, and in what order.
 */

export const getHome = async (req: IncomingMessage, res: ServerResponse) => {
    /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Welcome message to the view based on the language.
     */

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Set-Cookie", [
        "likes=movies",
        "lovesWebDev=true",
        "hungry=true", 
        "language=fr"
    ]);

    const cookies = getCookies(req)
    let message; 

    if (cookies["language"] == "en")
    {
        res.end(
            await renderTemplate("src/views/HomeView.hbs", {
                title: "Welcome!",
                cookies: req.headers.cookie?.toString(),
            }),
        );
        return 
    }
    if (cookies["language"] == "fr")
    {
        res.end(
            await renderTemplate("src/views/HomeView.hbs", {
                title: "Bienvenue!",
                cookies: req.headers.cookie?.toString(),
            }),
        );
        return 
    }

    //add getCookies here 
    //test 
    
};

export const changeLanguage = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /** TODO:
     * 1. Parse the body of the request.
     * 2. Extract the language from the body. This data is coming from a form submission.
     * 3. Set the language cookie.
     * 4. Redirect the user back to the previous page using the referer header.
     *    @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer
     * 5. End the response.
     */
};

export const getOnePokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Pokemon data to the view based on the language.
     */
    const id = Number(req.url?.split("/")[2]);
    const foundPokemon = database.find((pokemon) => pokemon.id === id);

    if (!foundPokemon) {
        res.statusCode = 404;
        res.end(
            await renderTemplate("src/views/ErrorView.hbs", {
                title: "Error",
                message: "Pokemon not found!",
            }),
        );
        return;
    }

    const cookies = getCookies(req)
    //let lang = cookies["language"]

    if (cookies["language"] == "fr")
    {
        const frenchPokemon = {
            name: foundPokemon.name.fr, 
            type: foundPokemon.type.fr, 
            info: foundPokemon.info.fr, 
            image: foundPokemon.image
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ShowView.hbs", {
                pokemon: frenchPokemon
            }),
        );
        return
    }
    if (cookies["language"] == "en")
    {
        const englishPokemon = {
            name: foundPokemon.name.en, 
            type: foundPokemon.type.en, 
            info: foundPokemon.info.en, 
            image: foundPokemon.image
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ShowView.hbs", {
                pokemon: englishPokemon
            }),
        );
        return
    }
    
};

export const getAllPokemon = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    /** TODO:
     * 1. Grab the language cookie from the request.
     * 2. Get the language from the cookie.
     * 3. Send the appropriate Pokemon data to the view based on the language.
     */

    const cookies = getCookies(req)

    if (cookies["language"] == "fr")
    {
        let frenchPokemons = database.map((item) => {
            return {
                id: item.id, 
                name: item.name.fr, 
                type: item.type.fr, 
                image: item.image
            }
        })

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ListView.hbs", {
                pokemon: frenchPokemons,
            }),
        );
        return
    }

    if (cookies["language"] == "en")
    {
        let englishPokemons = database.map((item) => {
            return {
                id: item.id, 
                name: item.name.en, 
                type: item.type.en, 
                image: item.image
            }
        })

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(
            await renderTemplate("src/views/ListView.hbs", {
                pokemon: englishPokemons,
            }),
        );
        return
    }
};

const parseBody = async (req: IncomingMessage) => {
    return new Promise<string>((resolve) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            resolve(body);
        });
    });
};

/**
 * @returns The cookies of the request as a Record type object.
 * @example name=Pikachu;type=Electric => { "name": "Pikachu", "type": "Electric" }
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cookie
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type
 */
const getCookies = (req: IncomingMessage): Record<string, string> => {
    /** TODO:
     * 1. Get the cookie header from the request.
     * 2. Parse the cookie header into a Record<string, string> object.
     *    - Split the cookie header by the semicolon.
     *    - Split each cookie by the equals sign.
     *    - Assign the name as the key and the value as the value.
     * 3. Return the object.
     */
    type cookies = Record<string, string>
    let cooks: cookies = { }

    let temp_header = req.headers.cookie?.toString()
    let cookie = temp_header?.split("; ")
    let cookie_keys_values = []

    for(let i = 0; i < (cookie?.length || 1); i++)
    {
        cookie_keys_values.push(cookie![i].split("="))
    }

    //how do i add to a Record?
    for(let i = 0; i < cookie_keys_values.length; i++)
    {
        for (let j = 0; j < cookie_keys_values[i].length - 1; j++)
        {
            cooks[cookie_keys_values[i][j]] =  cookie_keys_values[i][j + 1]
        }
        
    }
    

    //let parsed_header= req.headers
    return cooks;
};
