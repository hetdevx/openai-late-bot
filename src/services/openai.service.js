const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const env = require("../config/env");

const openai = new ChatOpenAI({
  openAIApiKey: env.OPENAI_API_KEY,
  modelName: "gpt-4o-mini",
  temperature: 0.5,
});

function getCurrentDateTime() {
  const now = new Date();
  return now.toLocaleString(); // Example: 2025-03-13T14:30:00.000Z
}

async function openAIService(prompt) {
  try {
    console.log("🔹 Sending prompt to OpenAI:", prompt);

    const currentDateTime = getCurrentDateTime();

    const messages = [
      new SystemMessage(
        `Extract leave request details from the user's message and return a structured JSON object.
        Consider today's date and time as: ${currentDateTime}. If the message refers to 'today' or 'tomorrow', resolve it accordingly. and my job time is 9am to 6 pm so consider this and acc to that make response and also under stand work like ooo as out of office means resolve short term word also and OOO	Out of Office
        AFK	Away from Keyboard
        EL	Early Leave
        SL	Sick Leave
        PL	Personal Leave
        AL	Annual Leave
        CL	Casual Leave
        BL	Bereavement Leave
        ML	Maternity Leave
        PTO	Paid Time Off
        UL	Unpaid Leave
        WFH	Work From Home
        OOO	Out of Office
        BRB	Be Right Back (Short Break)
        like this word also understand them if there is any short form then understand word also
        there are many short forms like this word also understand them and find it if it is not here and then do parsing of it

        `,
      ),
      new HumanMessage(
        `User Message: "${prompt}"\n\nFormat the response as JSON with keys: start_time, end_time, duration, category.`,
      ),
    ];

    const response = await openai.call(messages);
    const reply = response.content?.trim();

    if (!reply) {
      console.log("⚠️ No valid response from OpenAI");
      return [];
    }

    let cleanedReply = reply.replace(/^```json\n?/, "").replace(/\n?```$/, "");

    try {
      const parsedData = JSON.parse(cleanedReply);
      return [{ ...parsedData, is_valid: true, original: prompt }];
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
