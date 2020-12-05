import express from "express";
import socketIo from "socket.io";
import http from "http";
import redis from "redis";
import friendlyWords from "friendly-words";
import bodyParser from "body-parser";

const app = express();

const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
redisClient.on("error", (e) => console.error(e));

const server = http.createServer(app);
const io = socketIo(server, {
  transports: ['polling'],
  allowUpgrades: false
});

app.use(
  express.json({
    type: ["application/json", "text/plain"],
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/api/random-room", (req, res) => {
  const { predicates, objects } = friendlyWords;
  const numberOfPredicates = predicates.length;
  const numbersOfObjects = objects.length;

  const randomPredicate =
    predicates[Math.floor(Math.random() * numberOfPredicates)];
  const randomObject = objects[Math.floor(Math.random() * numbersOfObjects)];

  const output = `${randomPredicate}-${randomObject}`;
  res.json({
    "random-room": output,
    OK: true,
  });
});

app.get("/api/state/:room", (req, res) => {
  redisClient.get(req.params.room, (err, reply) => {
    if (err) console.error(err);

    res.send(reply);
  });
});

app.post("/api/state/:room", (req, res) => {
  redisClient.set(
    `${req.params.room}-board`,
    JSON.stringify(req.body),
    "EX",
    60 * 60 * 24
  );
  io.to(`${req.params.room}-board`).emit("current", req.body);
  res.send('{"ok": true}');
});

io.on("connect", (socket) => {
  socket.on("disconnect", () => { })

  socket.on("join", (room) => {
    socket.join(room);
    redisClient.get(room, (err, reply) => {
      if (err) console.error(err);
      io.to(room).emit("current", JSON.parse(reply));
    });
  });

  socket.on("change", (data) => {
    const { state, room } = data;
    redisClient.set(room, JSON.stringify(state), "EX", 60 * 60 * 24);
    io.to(room).emit("change", state);
  });
});

const listener = server.listen(process.env.PORT || 8080, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

