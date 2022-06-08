const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const cors = require('cors');
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
// const reviewsRoute = require("./routes/reviews");
const postRoute = require("./routes/post");
const productReviewRoute = require("./routes/productReview");
const slideRoute = require("./routes/slide");
const testimonialRoute = require("./routes/testimonial");

    dotenv.config();

    mongoose
    .connect(process.env.MONGO_URL)
    .then(() => { console.log("DBConnection Successfull") })
    .catch((err) => {
        console.log(err);
    });

    app.use(express.json());
    app.use(cors());
    app.use("/api/users", userRoute);
    app.use("/api/auth", authRoute);
    app.use("/api/products", productRoute);
    app.use("/api/orders", orderRoute);
    // app.use("/api/reviews", reviewsRoute);
    app.use("/api/blogPosts", postRoute);
    app.use("/api/productReview", productReviewRoute);
    app.use("/api/slides", slideRoute);
    app.use("/api/testimonials", testimonialRoute);

    
    app.listen(process.env.PORT || 5000, () => {
        console.log("Backend server running at port 5000");
    });



