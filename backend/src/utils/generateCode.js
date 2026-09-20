function generateCode() {
  const mainString =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let shortCode = "";
  for (let i = 0; i < 6; i++) {
    shortCode += mainString.charAt(Math.floor(Math.random() * 62));
  }

  return shortCode;
}

export default generateCode;
