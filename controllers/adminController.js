const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//admin panel has a search bar to search for countries and then 2 methods for editing/deleting data
async function searchCountries(req, res) {
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
    res.json(countries);
  } catch (error) {
    console.error("Error searching countries:", error);
    res.status(500).send("Internal server error");
  }
}

async function updateData(req, res) {
  const { countryId } = req.params;
  const { date, confirmed, deaths, recovered, active } = req.body;
  try {
    const updatedData = await prisma.covidData.upsert({
      where: {
        id: countryId,
        date: new Date(date),
      },
      update: {
        confirmed: parseInt(confirmed, 10),
        deaths: parseInt(deaths, 10),
        recovered: parseInt(recovered, 10),
        active: parseInt(active, 10),
      },
      create: {
        countryId,
        date: new Date(date),
        confirmed: parseInt(confirmed, 10),
        deaths: parseInt(deaths, 10),
        recovered: parseInt(recovered, 10),
        active: parseInt(active, 10),
      },
    });

    res.json(updatedData);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Internal server error");
  }
}

async function deleteCountry(req, res) {
  const { countryId } = req.params;
  // due to foreign key constraints, we need to delete the covid data first
  // or we can include something like onDelete: Cascade in the prisma.schema but this is not recommended as I read
  try {
    await prisma.covidData.deleteMany({
      where: { countryId: countryId },
    });
    const deleteCountry = await prisma.country.delete({
      where: { id: countryId },
    });
    res.json(deleteCountry);
  } catch (error) {
    console.error("Error deleting country:", error);
    res.status(500).send("Internal server error");
  }
}


module.exports = { searchCountries, updateData, deleteCountry };
