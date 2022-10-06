const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.encrypt = async (textPassword) => {
  const hashed = await bcrypt.hash(textPassword, saltRounds);
  return hashed;
};

module.exports.compare = async (textPassword, hashedPassword) => {
  const match = await bcrypt.compare(textPassword, hashedPassword);
  return match;
};
