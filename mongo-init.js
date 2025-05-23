db = db.getSiblingDB('calculator');
db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [{ role: "readWrite", db: "calculator" }]
});
