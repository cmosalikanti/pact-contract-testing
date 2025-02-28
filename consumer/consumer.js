const axios = require('axios');

const getUser = async (userId) => {
  try {
    return await axios.get(`http://localhost:1234/user/${userId}`);
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getUsers = async () => {
  try {
    return await axios.get('http://localhost:1234/users');
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

module.exports = { getUser, getUsers };
