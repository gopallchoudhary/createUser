const express = require("express");
const user = require("./models/user");
const app = express();
const port = 3000;
const path = require("path");
const { resourceLimits } = require("worker_threads");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const deleteUser = await user.findOneAndDelete({ name: "  " });
  res.render("index");
});

app.get("/read", async (req, res) => {
  let users = await user.find();
  users.forEach((item) => {
    if (item.name && item.email) {
      //console.log("YES")
    } else {
      //console.log("NO")
    }
  });
  res.render("read", { users });
});

///<--show-->
app.get("/show", async (req, res) => {
  let showUsers = await user.find();
  res.send(showUsers);
});

///<--delete-->
app.get("/delete/:id", async (req, res) => {
  let deleteUser = await user.findOneAndDelete({ _id: `${req.params.id}` });
  res.redirect("/read");
});

///DELETE ALL
app.get("/deleteall", async (req, res) => {
  let deleteall = await user.deleteMany({});
  res.send(deleteall);
});

//!<--Edit-->
app.get("/edit/:userid", async (req, res) => {
  let users = await user.findOne({ _id: req.params.userid });
  res.render("edit", { users });
});

//! <--UPDATE-->
app.post("/update/:userid", async (req, res) => {
  const { name, email, image } = req.body;
  const updatedUser = await user.findOneAndUpdate(
    { _id: req.params.userid },
    { name, email, image },
    { new: true }
  );
  res.redirect("/read");
  console.log(updatedUser);
});

//.<--CREATE-->
app.post("/create", async (req, res) => {
  const { name, email, image } = req.body;

  let createdUser = await user.create({
    name,
    email,
    image,
  });

  if (createdUser.name && createdUser.email) {
    res.redirect("/read");
  } else {
    res.redirect("/");
  }

  console.log(createdUser.name, " ", createdUser.email);
});

//?l...LISTEN...
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
