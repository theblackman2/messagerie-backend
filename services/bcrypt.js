import bcrypt from "bcrypt";
const saltRounds = 10;

export const encrypt = async (textPassword) => {
  const hashed = await bcrypt.hash(textPassword, saltRounds);
  return hashed;
};

export const compare = (textPassword, hashedPassword) =>
  bcrypt.compare(textPassword, hashedPassword);
