import mongoose from 'mongoose';
import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import config from './config.js';
import routes from './REST/routes.js';
import jwt from 'jsonwebtoken';
import {Server} from "socket.io";
import http from "http";
import business from './business/business.container.js';



const app = express();
app.use(express.static('./public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '2048kb'}));
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://park--smart.herokuapp.com",
        methods: ["GET", "POST"]
    }
});



routes(app);

mongoose.connect(config.databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    if (error) {
        console.error(error);
    }
    else {
        console.info('Connect with database established');
    }
});

const interval = [];

async function authorisedSend(socket) {
   try {
     const sections = await business.getSectionManager().query();
     const spaces = await business.getSpaceManager().query();
     const history = await business.getHistoryManager().query();


     await socket.emit("sections", {"sections": sections, "spaces": spaces});
      await socket.emit("history", {"sections": sections, "spaces": spaces, "history": history});

   } catch (error) {
       console.log(error);
   }
};

async function anonymousSend(socket) {
   try {
       const sections = await business.getSectionManager().query();
       const spaces = await business.getSpaceManager().query();

       await socket.emit("sections", {"sections": sections, "spaces": spaces});

   } catch (error) {
       console.log(error);
   }
};

io.on("connection", (socket) => {
  console.log(socket.id+" Connected")
  try{
     jwt.verify(socket.handshake.auth.token, config.JwtSecret);
     if (interval[socket.id])
         clearInterval(interval[socket.id]);
     interval[socket.id] = setInterval(() => authorisedSend(socket), 1000);
  }
  catch(error){
    if (interval[socket.id])
        clearInterval(interval[socket.id]);
    interval[socket.id] = setInterval(() => anonymousSend(socket), 1000);
  }
  finally{
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval[socket.id]);
    });
  }


});




process.on('SIGINT', () => {
    mongoose.connection.close(function () {
        console.error('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

server.listen(config.port);
