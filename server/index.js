const express =require('express')
const mongoose =require("mongoose")
const  cors =require('cors')
const bcrypt =require('bcrypt')
const dotenv =require('dotenv')
const jwt = require("jsonwebtoken");
const UserModel =require("./model/User");

dotenv.config();
const app =express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Allow both common ports
    credentials: true
}));


mongoose.connect(process.env.MONGO_URI)
.then(() =>console.log("Connected to  Mongodb"))
.catch(err => console.log("Failed to connect  to  MongoDB",err))
 
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});

app.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword, expertise, experience } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match!" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = expertise ? "mentor" : "mentee"; //  Identify mentor or mentee

        //  Store expertise & experience only for mentors
        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            role,
            ...(role === "mentor" && { expertise, experience }) // Only add these fields for mentors
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!", role });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found!" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password!" });
        }

        //  Generate a token
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.status(200).json({ message: `Login successful as ${user.role}!`, role: user.role, token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
