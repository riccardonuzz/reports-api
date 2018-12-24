module.exports = {
    host: "localhost",
    port: process.env.PORT || 3090,
    database: {
        uri: "mongodb://127.0.0.1",
        port: "27017",
        name: "reports",
        username: "",
        password: ""
    },
    jwtSecret: "kj2487fhioesdjnf74f"
};
