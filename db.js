const mongoose = require("mongoose");
//uesXvwrTjMlItbtE
const dbURL = "mongodb+srv://techiesaman07:uesXvwrTjMlItbtE@cluster0.zuhiuxo.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURL)
    .then(()=>{
        console.log("Connected to mongo");
    })
    .catch(()=>{
        console.log("Error in mongo connection");
    })

module.exports = mongoose;