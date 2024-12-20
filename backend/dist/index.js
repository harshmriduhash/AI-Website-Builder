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
require("dotenv").config();
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const prompts_1 = require("./prompts");
const anthropic = new sdk_1.default();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = yield anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 100,
        temperature: 0,
        system: "Return a key word either 'node' or 'react' based on what do you think the project shoukd be. Only return single word and don't return anything else.",
        messages: [
            {
                content: req.body.prompt,
                role: "user",
            },
        ],
    });
    const answer = msg.content[0].text;
    if (answer === "react") {
        res.json({
            prompts: [
                prompts_1.BASE_PROMPT,
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [react_1.reactBasePrompt],
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [node_1.nodeBasePrompt],
        });
        return;
    }
    res.status(403).json("Can create only a react or node application");
    return;
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const msg = yield anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 8000,
        temperature: 0,
        system: (0, prompts_1.getSystemPrompt)(),
        messages: req.body.messages,
    });
    console.log(msg);
    res.json({ response: (_a = msg.content[0]) === null || _a === void 0 ? void 0 : _a.text });
}));
app.listen(3000);
