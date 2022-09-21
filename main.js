require("dotenv").config();
const express = require("express");
const cl = require("cloudinary").v2;
const app = express();
const seasons = require("./seasons.json");

app.get("/", (request, response) => {
  response.sendFile("./website/home.html", { root: __dirname });
});

app.get(["/api/random", "/api"], async (request, response) => {
  const season_index = Math.floor(Math.random() * (19 - 0) + 0);
  const season = seasons[season_index];
  const episode_index = Math.floor(Math.random() * (season.length - 1) + 1);
  const episode = season.find((episode) => episode.id === episode_index);
  const picture_index = Math.floor(Math.random() * (episode.no_pics - 1) + 1);
  const public_id = `s${season_index + 1}e${episode_index}f${picture_index}`;
  console.log(public_id);
  const image = await cl.api.resource(public_id);
  response.send({ url: image.url });
});

app.get("/api/season/:season", async (request, response) => {
  if (request.params.season > 20) {
    // Invalid request
    response.status(404).send({
      error: {
        name: "Error",
        status: 404,
        message: "Invalid Request - Season Doesn't Exist",
        statusCode: 404,
      },
    });
  } else {
    const season_index = request.params.season;
    const episode_index = Math.floor(
      Math.random() * (seasons[season_index - 1].length - 1) + 1
    );
    const episode = seasons[season_index - 1].find(
      (episode) => episode.id === episode_index
    );
    const picture_index = Math.floor(Math.random() * (episode.no_pics - 1) + 1);
    const public_id = `s${season_index}e${episode_index}f${picture_index}`;
    const image = await cl.api.resource(public_id);
    response.send({ url: image.url });
  }
});

app.get("/api/season/:season/episode/:episode", async (request, response) => {
  if (request.params.season > 20) {
    response.status(404).send({
      error: {
        name: "Error",
        status: 404,
        message: "Invalid Request - Season Doesn't Exist",
        statusCode: 404,
      },
    });
  }
  const season_index = request.params.season;
  const episode_index = parseInt(request.params.episode);
  const episode = seasons[season_index - 1].find(
    (episode) => episode.id === episode_index
  );
  if (request.params.episode > seasons[season_index - 1].length) {
    if (request.params.season > 20) {
      response.status(404).send({
        error: {
          name: "Error",
          status: 404,
          message: "Invalid Request - Episode Doesn't Exist",
          statusCode: 404,
        },
      });
    }
  } else {
    const picture_index = Math.floor(Math.random() * (episode.no_pics - 1) + 1);
    const public_id = `s${season_index}e${episode_index}f${picture_index}`;
    const image = await cl.api.resource(public_id);
    response.send({ url: image.url });
  }
});

app.use((error, req, res, next) => {
  // Invalid request
  res.status(404).send({
    error: {
      name: "Error",
      status: 404,
      message: "Invalid Request",
      statusCode: 404,
    },
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
