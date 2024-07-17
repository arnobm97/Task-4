const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Fetching users failed!' });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { ids, status } = req.body;
  try {
    await User.update({ status }, { where: { id: ids } });
    res.status(200).json({ message: 'Users updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Updating users failed!' });
  }
};

exports.deleteUsers = async (req, res) => {
  const { ids } = req.body;
  try {
    await User.destroy({ where: { id: ids } });
    res.status(200).json({ message: 'Users deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Deleting users failed!' });
  }
};
