const express = require('express');
const connectToMongoDB = require('./connect');
const urlRoutes = require('./routes/url');
const URL = require('./models/users');

const app = express();
const PORT = 7337;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.use(express.json());

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
    res.redirect(entry.redirectURL);
});
app.use('/url', urlRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});