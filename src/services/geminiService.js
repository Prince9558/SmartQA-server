const axios = require('axios');

const callGemini = async (questions) => {
    const prompt = `
    Given the following list of questions from an audience,
    group them if they are similar, and return a sorted list 
    with the most frequently asked or relevant questions summarized:

    ${questions.map(
        (ques, index) => `${index+1}, ${ques.content}`
    ).join("\n")}

    Respond with only the summarized list, one per line.
    `;

    console.log("Using API Key:", process.env.GEMINI_API_KEY ? "Yes" : "No");
    const url= `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const requestBody= {
        contents: [{
            parts: [{ text: prompt}]
        }]
    };
    const requestHeaders = {
        headers: {
        "Content-Type": "application/json"
        }
    };

    const response = await axios.post(url, requestBody, requestHeaders);

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    //Filtering is optional, this is additional check to ensure there is no
    //empty line returned in the response
    //we're spliting by new line character as in the prompt, we requested for
    //questions on new lines.
    return text.split("\n").filter((line) => line.trim() !== "");
};

module.exports = { callGemini };


//Example format of the questions we're going to send in the prompt.
// 1. What is MERN
// 2. What is React