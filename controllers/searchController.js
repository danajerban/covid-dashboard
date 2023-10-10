const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function searchCountry(req, res) {
  const query = req.query.q;
  try {
    const countries = await prisma.country.findMany({
      where: {
        name: {
          startsWith: query,
          mode: "insensitive",
        },
      },
    });
    res.json(countries, );
  } catch (error) {
    console.error("Error searching country:", error);
    res.status(500).send("Internal server error");
  }
}

async function getCountryData(req, res) {
  const countryId = req.params.countryId;
  try {
    const covidData = await prisma.covidData.findMany({
      where: {
        countryId: countryId,
      },
      orderBy: {
        date: 'asc',  //order by date ascending for charts - get total
      },
      include: {
        country: true,  // include the related country data
      },
    });
    res.json(covidData);
  } catch (error) {
    console.error("Error fetching country data:", error);
    res.status(500).send("Internal server error");
  }
}

async function getCountryTotalCases(req, res) {
  const countryId = req.params.countryId;
  try {
    const covidData = await prisma.covidData.findFirst({
      where: {
        countryId: countryId,
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        country: true,  
      },
    });
    res.json(covidData);
  } catch (error) {
    console.error("Error fetching country data:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { searchCountry, getCountryData, getCountryTotalCases };
