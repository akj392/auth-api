const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production'
    ? 'prod.env' : 'dev.env';

dotenv.config({ path: path.resolve(__dirname, 'environments', envFile) });


const PORT = 3000;
const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', userRoutes);

server.listen(PORT, () => {
    console.log(`server is running at PORT: ${PORT}`);
});