const cors = require("cors");
const express = require("express");
const routes = require("./modules/auth/auth.routes.js");
const orgRoutes=require("./modules/organizations/organizations.routes.js");
const projRoutes= require("./modules/projects/projects.routes.js");
const taskRoutes= require("./modules/tasks/tasks.routes.js");
const authenticate = require("./middlewares/auth.middleware");
const requireOrg= require("./middlewares/org.middleware.js");
const requireRole= require("./middlewares/role.middleware.js");
const globalErrorHandler = require("./middlewares/error.middleware.js");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/protected", authenticate, (req, res) => {
  res.json({ message: "Access Granted", user: req.user });
});

app.use("/user", routes);
app.use("/org",orgRoutes);
app.use("/proj",projRoutes);
app.use("/tasks",taskRoutes);
app.get(
  "/org-test",
  authenticate,
  requireOrg,
  requireRole("OWNER"),
  (req, res) => {
    res.json({
      message: "Org access granted",
      org: req.org,
    });
  }
);
app.use(globalErrorHandler);

module.exports = app;
