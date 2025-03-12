const { OpenAI } = require("openai");
const env = require("../config/env");

const openai = new OpenAI({ aresponse_formatpiKey: env.OPENAI_API_KEY });

async function openAIService(prompt) {
  try {
    console.log("🔹 Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract leave request details from the user's message and return a structured JSON object.",
        },
        {
          role: "user",
          content: `User Message: "${prompt}"\n\nFormat the response as JSON with keys: start_time, end_time, duration, category.`,
        },
      ],
      temperature: 0.5,
      max_tokens: 150,
    });

    // console.log("🔹 OpenAI Raw Response:", JSON.stringify(response, null, 2));

    const reply = response.choices[0]?.message?.content.trim();
    console.log("✅ Parsed reply Details:", reply);

    if (!reply) {
      console.log("⚠️ No valid response from OpenAI");
      return [];
    }

    let cleanedReply = reply.replace(/^```json\n?/, "").replace(/\n?```$/, ""); // Remove backticks if present

    console.log("✅ Parsed Leave Details:", cleanedReply);

    try {
      const parsedData = JSON.parse(cleanedReply);
      console.log("✅ Parsed Leave Details:", parsedData);

      return [
        {
          ...parsedData,
          is_valid: true,
          original: prompt,
        },
      ];
    } catch (error) {
      console.error("❌ JSON Parsing Error:", error);
      return [];
    }
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    return [];
  }
}

module.exports = openAIService;
