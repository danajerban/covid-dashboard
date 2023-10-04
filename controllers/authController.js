const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    // bcrypt error because the password is not hashed in the database - i entered it manually
    // if (password !== admin.password) {
    //   return res.status(401).send("Invalid password");
    // }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).send("Invalid password");
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
}

const register = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  //check for username and password if it exists and then if it does not exist then create a new user
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(409).send("Username already taken");
    }

    await prisma.admin.create({
      data: { username, password: hashedPassword },
    });

    res.status(200).send("Registered successfully");
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { login, register };
