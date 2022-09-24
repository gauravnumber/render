const express = require("express");
const axios = require("axios");
const Sib = require("sib-api-v3-sdk");
const helmet = require("helmet");
const morgan = require("morgan");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.json({ hello: "world" });
});

app.get("/hello", (req, res) => {
  res.json({ awesome: "world" });
});

app.get("/weather", async (req, res) => {
  const url = process.env.WEATHER_URL;

  const { data: { data: list } } = await axios.get(url);

  const tomorrow = list[1];
  const weather = tomorrow.weather.code;
  const description = tomorrow.weather.description;
  const isRain = weather >= 200 && weather <= 522;

  if (isRain) {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: process.env.SENDER_EMAIL,
      name: "Gaurav",
    };

    const receivers = [
      {
        email: process.env.RECEIVER_EMAIL,
      },
    ];

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: `Rain Alert`,
        textContent: `
        It may be {{params.description}}. Chances of raining is {{params.percentage}}%
        `,
        // htmlContent: `
        //   <h1>Cules Coding</h1>
        //   <a href="https://cules-coding.vercel.app/">Visit</a>
        //           `,
        params: {
          description: tomorrow.weather.description,
          percentage: tomorrow.pop,
        },
      })
      .then(console.log)
      .catch(console.log);
  }

  res.json(list);
});

app.get("/anime", async (req, res) => {
  const { data } = await axios.get("https://animechan.vercel.app/api/random");

  const client = Sib.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

  const tranEmailApi = new Sib.TransactionalEmailsApi();

  const sender = {
    email: process.env.SENDER_EMAIL,
    name: "Anime",
  };

  const receivers = [
    {
      email: process.env.RECEIVER_EMAIL,
    },
  ];

  const email = await tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: data.anime,
      textContent: `
        ${data.quote}.
        `,
    });

  res.json(email);
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
