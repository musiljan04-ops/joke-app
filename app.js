import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://v2.jokeapi.dev/joke/";

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", {
    selectedCategories: [
      "programming",
      "misc",
      "dark",
      "pun",
      "spooky",
      "christmas",
    ],
    selectedLanguage: "en",
    selectedFlags: [],
  });
});

app.get("/joke", async (req, res) => {
  const category = [].concat(req.query.category || []).join(",") || "Any";
  const language = req.query.language || "en";
  const flag = [].concat(req.query.flag || []).join(",");
  const flagParam = flag ? `&blacklistFlags=${flag}` : "";
  const selectedCategories = [].concat(req.query.category || []);
  const selectedFlags = [].concat(req.query.flag || []);

  try {
    const result = await axios.get(
      API_URL + category + `?lang=${language}` + flagParam,
    );

    let joke;
    if (result.data.error) {
      joke = "No joke found. Try fewer filters.";
    } else if (result.data.type === "single") {
      joke = result.data.joke;
    } else {
      joke = result.data.setup + "\n" + result.data.delivery;
    }

    res.render("index", {
      joke: joke,
      selectedCategories: selectedCategories,
      selectedLanguage: language,
      selectedFlags: selectedFlags,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.render("index", {
      joke:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      selectedCategories: selectedCategories,
      selectedLanguage: language,
      selectedFlags: selectedFlags,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
