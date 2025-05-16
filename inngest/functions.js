import { supabase } from "@/services/Superbase";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const llmModel = inngest.createFunction(
  { id: "llm-model" },
  { event: "llm-model" },
  async ({ event, step }) => {
    const aiResp = await step.ai.infer("generate-ai-llm-model-call", {
      model: step.ai.models.gemini({
        model: "gemini-1.5-flash",
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Depends on the user input, summarizes and searches about the topic. Give a markdown text with proper formatting.\n\n" +
                  "User Input: " + event.data.searchInput + "\n\n" +
                  "Search Results:\n" + JSON.stringify(event.data.searchResult),
              },
            ],
          },
        ],
      },
    });

    const saveToDb = await step.run("saveToDb", async () => {
      const { data, error } = await supabase
        .from("Chats")
        .update({
          aiResp: aiResp?.candidates[0].content.parts[0].text,
        })
        .eq("id", event.data.recordId)
        .select();

      return aiResp;
    });
  }
);
