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
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getCountries };
