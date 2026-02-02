const { OpenRouter } = require("@openrouter/sdk");
require("dotenv").config();

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Generates a README based on project details using OpenRouter.
 * Uses the 'stepfun/step-3.5-flash:free' model by default.
 */
const generateReadme = async ({ stack, features, projectName, projectDescription, projectTitle }) => {
    try {
        const prompt = `
You are an expert developer. Generate a professional README.md for a project with the following details:
Stack: ${stack}
Project Name: ${projectName}
Title: ${projectTitle || projectName}
Description: ${projectDescription}
Features: ${features.join(", ")}

The README must be in Markdown format and include:
- Project Title and Description
- Tech Stack & Features list
- Prerequisites & Installation Instructions (specific to ${stack})
- Usage Guide
- Project Structure (brief overview)

Do not include any "Here is your README" conversational text. Return ONLY the markdown content.
    `;

        // Stream the response to get reasoning tokens in usage
        const stream = await openrouter.chat.send({
            model: "stepfun/step-3.5-flash:free",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            stream: true
        });

        let response = "";

        // Iterate through the stream chunks
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                response += content;
                // Optional: print to stdout if needed for debugging
                // process.stdout.write(content); 
            }

            // Usage information comes in the final chunk (if available/supported by model)
            if (chunk.usage) {
                console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
            }
        }

        // Sanitize: Remove markdown code fences if present at start/end
        response = response.replace(/^```markdown\s*/, "").replace(/^```\s*/, "").replace(/```$/, "");

        return response;

    } catch (error) {
        console.error("OpenRouter README Generation Failed:", error.message);
        throw error;
    }
};

module.exports = { generateReadme };
