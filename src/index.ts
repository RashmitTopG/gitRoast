import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express"
import axios from "axios"
import {generateRoast} from "./gemini";

const app = express()
const PORT = 3000;
const roastPrompt = process.env.ROAST_PROMPT;

app.get("/" , (req,res)=>{
    res.send("Hello World")
})


app.listen(PORT , ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})

app.get("/roast/:username", async (req, res) => {

    try {
        const { username } = req.params;

    const [user, repos] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`),
        axios.get(`https://api.github.com/users/${username}/repos`)
    ]);

    const userData = user.data;
    const repoData = repos.data;

    const roastData = {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        accountCreated: userData.created_at,
        repos: repoData
          .slice(0, 100)
          .map((r: any) => ({
            name: r.name,
            language: r.language,
            stars: r.stargazers_count
          }))
      };
    
    console.log(userData);
    console.log(repoData);

    const prompt = `${roastPrompt} for ${JSON.stringify(roastData)}`;

    const roastRes = await generateRoast(prompt);
    res.send(roastRes);
    } catch (e) {
        console.error(e);
    }
    
});