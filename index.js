const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectToMongoDB = require('./connect');
const URL = require('./models/url');
const urlRoutes = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const {restrictToLoggedinUserOnly,checkAuth} = require('./middlewares/auth');

const app = express();
const PORT = 7337;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/url', restrictToLoggedinUserOnly, urlRoutes);
app.use('/user', userRoute);
app.use('/', checkAuth, staticRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId: shortId,

        },
        {
            $push: {
                visitHistory:{
                    timestamp: Date.now(),
                } 
            }
        }
    )
    if (!entry) return res.status(404).json({ error: 'Short URL not found' });
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});