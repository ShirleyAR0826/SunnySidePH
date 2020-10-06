import express from 'express';
import User from '../models/userModel.js';
import { getToken, isAuth, isAdmin } from '../util.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const saltRounds = 10;
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = bcrypt.hashSync(req.body.password, saltRounds) || user.password;
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: getToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  });


router.post("/signin", async(req, res) =>{
    const signinUser = await User.findOne({
        email: req.body.email
    });
    const result = bcrypt.compareSync(req.body.password, signinUser.password);
        if (result){
            res.send({
                _id: signinUser.id,
                name: signinUser.name,
                email: signinUser.email,
                isAdmin: signinUser.isAdmin,
                token: getToken(signinUser)
            })
        }else{
            res.status(401).send({msg:'Invalid Email or Password'});
        }
    });

router.post("/register", async(req, res) =>{
    const saltRounds = 10;
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });
    const newUser = await user.save();
    if (newUser){
        res.send({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token: getToken(newUser)
        })
    }else{
        res.status(401).send({msg:'Invalid User Data'});
    }
})

router.get("/createadmin", async (req, res) =>{
    const saltRounds = 10;
    const password = 'admin2pass'
    try {
        const user = new User({
            name: 'Admin2',
            email: 'admin2@gmail.com',
            password: bcrypt.hashSync(password, saltRounds),
            isAdmin: true
        });
        const newUser = await user.save();
        res.send({msg: 'User Admin Created'}); 
    } catch (error) {
        res.send({msg: error.message})
    }
})

router.get('/', isAuth, isAdmin, async (req, res) => {
    const Users = await User.find({});
    if (Users){
        res.send(Users);
    }else{
        res.status(401).send({msg:'Users not Found'});
    }
  });

router.post("/save", isAuth, isAdmin, async(req, res) =>{
    const saltRounds = 10;
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: hash
    });
    const newUser = await user.save();
    if (newUser){
        res.send({msg: 'New User Created'})
    }else{
        res.status(401).send({msg:'Invalid User Data'});
    }
})

router.put('/update/:id', isAuth, isAdmin, async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    const saltRounds = 10;
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        user.password = bcrypt.hashSync(req.body.password, saltRounds) || user.password;
        const updatedUser = await user.save();
        res.send({msg: 'User Info Updated'});
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  });

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
    const deletedUser = await User.findById(req.params.id);
    if (deletedUser) {
      await deletedUser.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.send('Error in Deletion.');
    }
  });

export default router;