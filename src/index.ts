import express from 'express';
import jwt from 'jsonwebtoken';
import { ContentModel, UserModel } from './db';
import { JWT_SECRET } from './config';
import { userMiddleware } from './middleware';

const app = express();
app.use(express.json());

app.post('/api/v1/signup', async (req, res) => {
    // TODO: zod validation, hash the password 
    const username = req.body.username;
    const password = req.body.password;

    try {

        await UserModel.create({
            username: username,
            password: password
        })
        
        res.json({
            message: "User signed up"
        })
    } catch (error) {
        res.status(411).json({
            message: "User already exists"
        })
    }
});

app.post('/api/v1/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password
    const existingUser = await UserModel.findOne({
        username,
        password
    });
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id,
        }, JWT_SECRET);

        res.json({
            token
        });
    } else {
        res.status(403).json({
            message: "Invalid credentials"
        });
    }
});

app.post('/api/v1/content', userMiddleware , async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;

    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });

    res.json({
        message: "Content created"
    });
});

app.get('/api/v1/content', userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId
    }).populate("userId", "username");
    res.json(content);
});

app.delete('/api/v1/content', userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

    await ContentModel.deleteMany({
        contentId,
        // @ts-ignore
        userId: req.userId
    });

    res.json({
        message: "Content deleted"
    });
});

app.post('/api/v1/brain/share', (req, res) => {

});

app.get('/api/v1/brain/:shareLink', (req, res) => {

});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});