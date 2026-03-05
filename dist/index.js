"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const gemini_1 = require("./gemini");
const app = (0, express_1.default)();
const PORT = 3000;
const roastPrompt = process.env.ROAST_PROMPT;
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
app.get("/roast/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const [user, repos] = yield Promise.all([
            axios_1.default.get(`https://api.github.com/users/${username}`),
            axios_1.default.get(`https://api.github.com/users/${username}/repos`)
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
                .map((r) => ({
                name: r.name,
                language: r.language,
                stars: r.stargazers_count
            }))
        };
        console.log(userData);
        console.log(repoData);
        const prompt = `${roastPrompt} for ${JSON.stringify(roastData)}`;
        const roastRes = yield (0, gemini_1.generateRoast)(prompt);
        res.send(roastRes);
    }
    catch (e) {
        console.error(e);
    }
}));
