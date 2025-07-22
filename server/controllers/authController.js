const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role
    });

    const token = jwt.sign({ id: user.id, role:role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role:user.role
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

const login = async (req, res) => { 
  try {
    const { email, password } = req.body;
    if (!email || !password) { 
      return res.status(400).json({message:"Please provide email and password"});
    };

    let user = await User.findOne({ where: { email } });
    user = user.dataValues;
    if (!user) {
      return res.status(400).json({message:"User not found"});
    };
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) { 
      return res.status(400).json({message:"Incorrect password"});
    };
    const token = jwt.sign({ id: user.id, role:user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role:user.role
        }
      }
    });
  }
  catch (err) {
    return res.status(400).json({message:"Some error occured"});
  }
};

module.exports = { register, login };