const axios = require("axios");

const getGeoLocation = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    req.geo = response.data;
    next();
  } catch (error) {
    console.error(error);
    req.geo = { countryCode: "US" };
    next();
  }
};

module.exports = { getGeoLocation };
