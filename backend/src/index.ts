require("dotenv").config();
import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import cors from "cors";
import express from "express";
import { nodeBasePrompt } from "./defaults/node";
import { reactBasePrompt } from "./defaults/react";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";

const anthropic = new Anthropic();
const app = express();
app.use(cors());

app.use(express.json());

app.post("/template", async (req, res) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 100,
    temperature: 0,
    system:
      "Return a key word either 'node' or 'react' based on what do you think the project shoukd be. Only return single word and don't return anything else.",
    messages: [
      {
        content: req.body.prompt,
        role: "user",
      },
    ],
  });
  const answer = (msg.content[0] as TextBlock).text;
  if (answer === "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }
  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
    return;
  }
  res.status(403).json("Can create only a react or node application");
  return;
});

app.post("/chat", async (req, res) => {
  const msg = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 8000,
    temperature: 0,
    system: getSystemPrompt(),
    messages: req.body.messages,
  });
  console.log(msg);
  res.json({ response: (msg.content[0] as TextBlock)?.text });
});

app.listen(3000);
