const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function getCountries(req, res) {
  try {
    const data = await prisma.country.findMany({
      include: {
        covidData: false,
      },
    });
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function getTotalCases(req, res) {
  try {
    // get a list of all countries, find the latest CovidData entry for each by sorting by date, return combined information for each country
    // this is for the maps and charts

    const countries = await prisma.country.findMany({
      include: {
        covidData: false,
      },
    });

    const latestDataPromises = countries.map(async (country) => {
      const latestData = await prisma.covidData.findFirst({
        where: {
          countryId: country.id,
        },
        orderBy: {
          date: "desc",
        },
      });

      return {
        country: country.name,
        latitude: country.latitude,
        longitude: country.longitude,
        confirmed: latestData.confirmed,
        deaths: latestData.deaths,
        recovered: latestData.recovered,
        active: latestData.active,
      };
    });

    const latestData = await Promise.all(latestDataPromises);

    return res.json(latestData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server Error");
  }
}

module.exports = { getCountries, getTotalCases };
