const express = require("express");
const axios = require("axios");
const Sib = require("sib-api-v3-sdk");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

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

  // console.log(JSON.stringify(list, null, 2));

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      // subject: `random ${Math.floor(Math.random() * 11)}`,
      subject: `Tomorrow will be raining. ${new Date()}`,
      // textContent: `Time is ${new Date()}. ${list}`,
      textContent: `
        It may be {{params.description}}.
        `,
      // htmlContent: `
      //   <h1>Cules Coding</h1>
      //   <a href="https://cules-coding.vercel.app/">Visit</a>
      //           `,
      params: {
        description: tomorrow.weather.description,
      },
    })
    .then(console.log)
    .catch(console.log);

  console.log(tomorrow);
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
