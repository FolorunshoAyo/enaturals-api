const router = require("express").Router();
const puppeteer = require("puppeteer");
const axios = require("axios");

const scrape = async (url) => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disabled-setuid-sandbox ']}); //prevent non needed issues.
    const page = await browser.newPage(); //create request for the new page to obtain...

    await page.goto(url);
    await page.waitForSelector(".ODSEW-ShBeI-text"); 


    const result = await page.evaluate(() => {
        let reviewAuthorNamesClasses = document.getElementsByClassName("ODSEW-ShBeI-title");
        let reviewAuthorNames = [];

        for (let elements of reviewAuthorNamesClasses) {
            reviewAuthorNames.push(elements.innerText);
        }

        let datesClasses = document.getElementsByClassName('ODSEW-ShBeI-RgZmSc-date');
        let dates = [];

        for(let elements of datesClasses) {
            dates.push(elements.innerText);
        }

        let ratingsClasses = document.getElementsByClassName('ODSEW-ShBeI-H1e3jb');
        let ratings = [];

        for (let elements of ratingsClasses) {
            ratings.push(elements.children.length);
        }

        let reviewsContentClasses = document.getElementsByClassName('ODSEW-ShBeI-text');
        let reviewsContent = [];

        for(let elements of reviewsContentClasses) {
            reviewsContent.push(elements.innerText);
        }

        let ownerResponseDateContentClasses = document.getElementsByClassName('ODSEW-ShBeI-QClCJf-QYOpke-VdSJob');
        let ownerResponseDate = [];

        for(let elements of ownerResponseDateContentClasses) {
            ownerResponseDate.push(elements.innerText);
        }

        // let postDate = document.querySelector(".ODSEW-ShBeI-RgZmSc-date").innerText;
        // let starRating = document.querySelector(".ODSEW-ShBeI-H1e3jb").getAttribute("aria-label");
        // let postReview = document.querySelector(".ODSEW-ShBeI-text").innerText;
        // let ownerResponseDate = document.querySelector(".ODSEW-ShBeI-QClCJf-QYOpke-VdSJob").innerText;
        // const ownerResponse = document.querySelector(".ODSEW-ShBeI-text").innerText;


        return {
            reviewAuthorNames,
            dates,
            ratings,
            reviewsContent,
            ownerResponseDate
        }
    });

    browser.close(); // Close the browser.

    return result; // Return the results with the review

};

router.get("/", async (req, res) => {

    scrape('https://www.google.com/maps/place/E-naturals+Skincare/@6.5823909,3.5234596,17z/data=!3m1!4b1!4m5!3m4!1s0x103bef4c501d27d3:0x1c062c7f5a8960e!8m2!3d6.5823909!4d3.5256483')
    .then(value => {

        try{
            res.status(200).json(value); // Return the data upon client request.
        }catch(err){
            res.status(500).json(err);
        }

    });

    axios.get("")
    .then(function (response) {
        // handle success
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    });
});

module.exports = router;
