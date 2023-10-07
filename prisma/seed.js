const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//map lat and long, populate countries table (lat, long, name, iso codes) and populate covid data table from csv files found at:
//https://www.kaggle.com/datasets/imdevskp/corona-virus-report & https://www.kaggle.com/datasets/andradaolteanu/iso-country-codes-global

async function populateCountries() {
  const countryCoords = {};

  const existingCountries = await prisma.country.findMany();
  if (existingCountries.length > 0) {
    console.log("Countries already seeded");
    return;
  }

  await new Promise((resolve, reject) => {
    fs.createReadStream("./prisma/covid_19_clean_complete.csv")
      .pipe(csv())
      .on("data", (row) => {
        countryCoords[row["Country/Region"]] = {
          lat: parseFloat(row["Lat"]),
          long: parseFloat(row["Long"]),
        };
      })
      .on("end", resolve)
      .on("error", reject);
  });

  await new Promise((resolve, reject) => {
    fs.createReadStream("./prisma/wikipedia-iso-country-codes.csv")
      .pipe(csv())
      .on("data", async (row) => {
        const countryName = row["English short name lower case"];
        const coords = countryCoords[countryName];
        if (coords) {
          await prisma.country.create({
            data: {
              name: countryName,
              isoCode: row["ISO 3166-2"],
              latitude: coords.lat,
              longitude: coords.long,
            },
          });
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });
}

async function populateCovidData() {
  const existingCovidData = await prisma.covidData.findMany();
  if (existingCovidData.length > 0) {
    console.log("Covid data already seeded");
    return;
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream("./prisma/covid_19_clean_complete.csv")
      .pipe(csv())
      .on("data", async (row) => {
        const country = await prisma.country.findUnique({
          where: { name: row["Country/Region"] },
        });

        if (country) {
          await prisma.covidData.create({
            data: {
              countryId: country.id,
              date: new Date(row["Date"]),
              confirmed: parseInt(row["Confirmed"]),
              deaths: parseInt(row["Deaths"]),
              recovered: parseInt(row["Recovered"]),
              active: parseInt(row["Active"]),
            },
          });
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });
}

populateCountries()
  .then(() => {
    prisma.$connect();
    return populateCovidData();
  })
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
