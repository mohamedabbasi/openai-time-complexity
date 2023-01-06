import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { prompt } = req.body;
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
        ${prompt}

        The time complexity of this function is
        ###
      `,
      temperature: 0,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"],
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    const { response, message } = error;
    if (response) {
      console.error(response.status, response.data);
      res.status(response.status).json(response.data);
    } else {
      console.error(`Error with OpenAI API request: ${message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}
