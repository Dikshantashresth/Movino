"use server";

import axios from "axios";


export async function getMood(query: string) {
  const LLMQuery = `You are an assistant that maps user moods or movie requests to TMDB genres.

TMDB_GENRES = ["Action","Adventure","Animation","Comedy","Crime","Documentary","Drama","Family","Fantasy","History","Horror","Music","Mystery","Romance","Science Fiction","TV Movie","Thriller","War","Western"]

Rules:
1. Modes:
   - Mood mode: user describes how they feel or what vibe they want (e.g., "I feel happy", "I want something mind-bending").
   - Movie mode: user asks for "movies like X" or gives a movie title.

2. For Mood mode:
   - Normalize the input (fix casual typos and synonyms).
   - Detect the main mood/vibe (single or compound). Recognize synonyms such as:
     - "mindpuzzling", "mind-bending", "thought-provoking", "intellectually stimulating", "cerebral", "philosophical" → treat as *thought-provoking*.
     - "happy", "joyful", "cheerful" → *happy/positive*.
     - "scared", "anxious", "terrified" → *fear/anxiety*.
     - "romantic", "in love" → *romance*.
     - (Use similar mapping for common moods; infer conservatively.)
   - Map the detected mood to up to **4** genres from TMDB_GENRES that best resonate emotionally.

3. For Movie mode:
   - If user says "like X" or gives a title, identify that movie's main genres and output those genres from TMDB_GENRES (up to 4).
   - If the title is ambiguous or not identifiable as a movie, attempt a conservative inference; if you cannot determine a safe mapping, return [].

4. Output rules (strict):
   - Output **only** a JSON array of genre names (strings), e.g.:
     ["Mystery","Science Fiction","Thriller"]
   - Use at most 4 genres.
   - Use ONLY genres from TMDB_GENRES.
   - If the input is irrelevant, malicious, outside scope, or you cannot map confidently → return an empty array: [].
   - No extra text, no explanation, no keys — only the JSON array.

5. Prioritization:
   - If the user provides both a mood and a movie title, prioritize the movie title mapping.
   - Prefer more specific genres where possible (e.g., "mind-bending psychological thriller" → ["Mystery","Thriller","Drama","Science Fiction"] rather than a generic ["Drama"]).

6. Examples:
   - Input: "I am happy today"
     Output: ["Comedy","Romance","Family"]
   - Input: "I feel scared and anxious"
     Output: ["Horror","Thriller","Mystery"]
   - Input: "I want something inspiring and motivating"
     Output: ["Drama","Documentary"]
   - Input: "Recommend me something like Fight Club"
     Output: ["Drama","Thriller","Mystery"]
   - Input: "Give me a movie like Frozen"
     Output: ["Animation","Family","Fantasy"]
   - Input: "What is 2+2?"
     Output: []

Special mapping note:
- Treat "mindpuzzling", "mind-bending", "think out of the box", "think outside the box", and "thought-provoking" as mapping primarily to:
  ["Mystery","Science Fiction","Thriller","Drama"]
  (Use up to 4 of these depending on strength of the wording.)

END`;
  const userQuery = `The User Input: ${query}`;
  console.log(userQuery);
     try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen3-235b-a22b:free",
        messages: [
          { role: "system", content: LLMQuery},
          { role: "user", content: userQuery }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY}`,
          "Content-Type": "application/json",
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (err: any) {
    console.error("Error:", err.response?.data || err.message);
  }
}
