const { Builder, By, until } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
// const { sleep } = require('sleep');
const { JSDOM } = require('jsdom');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

async function recScrapping(personProfileUrl) {
    console.log("I am running very fast. Please wait for me to finish.")
    const chromeOptions = new Options();
    // Add argument to disable infobars if needed
    chromeOptions.addArguments('--disable-infobars');
    // Add argument to connect to the remote debugging port
    // chromeOptions.addArguments('--remote-debugging-port=9223');
    chromeOptions.debuggerAddress('localhost:9223');
  
    // Start Chrome with the modified options
    const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

      try {
        await driver.get(personProfileUrl);
        await driver.sleep(4000);

        // Person name
        let name;
        try {
            name = await driver.findElement(By.xpath("(//span[@data-test-row-lockup-full-name and @data-live-test-row-lockup-full-name])[1]")).getText();
        } catch (error) {
            name = '';
        }

        // Headlines
        let headlines;
        try {
            headlines = await driver.findElement(By.xpath("(//span[@data-test-row-lockup-headline and @data-live-test-row-lockup-headline])[1]")).getText();
        } catch (error) {
            headlines = '';
        }

        // Latest Education
        let latestEducation;
        try {
            latestEducation = await driver.findElement(By.xpath("//span[@data-test-latest-education]")).getText();
        } catch (error) {
            latestEducation = '';
        }

        // Location
        let location;
        try {
            location = await driver.findElement(By.xpath("(//div[@data-test-row-lockup-location and @data-live-test-row-lockup-location])[1]")).getText();
        } catch (error) {
            location = '';
        }

        // Industry
        let industry;
        try {
            industry = await driver.findElement(By.xpath("//span[@data-test-current-employer-industry and @data-live-test-current-employer-industry]")).getText();
        } catch (error) {
            industry = '';
        }

        // LinkedIn URL
        let linkedinUrl;
        try {
            linkedinUrl = await driver.findElement(By.xpath("//span[@data-test-personal-info-profile-link-text]")).getText();
        } catch (error) {
            linkedinUrl = '';
        }

        // Summary
        await driver.sleep(1000);
        let about;
        try {
            try {
                let button = await driver.findElement(By.xpath("(//a[text() = 'See more of summary'])[1]"));
                await driver.executeScript("arguments[0].click();", button);
            } catch (error) {
                let button2 = await driver.findElement(By.css("button#topcard-public-profile-hoverable-btn"));
                await driver.executeScript("arguments[0].click();", button2);
            }
            await driver.sleep(1000);
            about = await driver.findElement(By.xpath("(//blockquote[@data-test-summary-card-text]//span)[1]")).getText();
        } catch (error) {
            about = '';
        }

        // Experience
        let listOfExperience = [];
        try {
            let number = await driver.findElements(By.xpath("(//section/div[contains(@class,'experience-card')])[1]//ul/li"));
            let totalExperience = number.length;

            for (let i = 1; i <= totalExperience; i++) {
                let exp = [];
                let element = await driver.findElement(By.xpath(`(//section/div[contains(@class,'experience-card')])[1]//ul/li[${i}]`));
                let elementHtml = await element.getAttribute("outerHTML");
                let dom = new JSDOM(elementHtml);
                let document = dom.window.document;

                try {
                    let positionTitle = document.querySelector('h3.background-entity__summary-definition--title').textContent.trim();
                    if (positionTitle) exp.push(positionTitle);
                } catch (error) { }

                try {
                    let companyName = document.querySelector('a.position-item__company-link').textContent.trim();
                    if (companyName) exp.push(companyName);
                } catch (error) { }

                try {
                    let datesEmployed = document.querySelector('span.background-entity__date-range').textContent.trim();
                    if (datesEmployed) exp.push(datesEmployed);
                } catch (error) { }

                try {
                    let duration = document.querySelector('span.background-entity__duration').textContent.trim();
                    if (duration) exp.push(duration);
                } catch (error) { }

                try {
                    let loc = document.querySelector('dd.background-entity__summary-definition--location').textContent.trim();
                    if (loc) exp.push(loc);
                } catch (error) { }

                try {
                    let positionSummary = document.querySelector('dd.background-entity__summary-definition--description').textContent.trim();
                    if (positionSummary) exp.push(positionSummary);
                } catch (error) { }

                if (exp.length !== 0) {
                    listOfExperience.push(exp);
                } else {
                    try {
                        let companyName = document.querySelector('strong[data-test-grouped-position-entity-company-name]').textContent.trim();
                        if (companyName) exp.push(companyName);
                    } catch (error) { }

                    try {
                        let totalTime = document.querySelector('div[data-test-grouped-position-entity-date-overall-range]').textContent.trim();
                        if (totalTime) exp.push(totalTime);
                    } catch (error) { }

                    try {
                        let positionTitle = document.querySelector('a.ember-view.position-item__position-title-link').textContent.trim();
                        if (positionTitle) exp.push(positionTitle);
                    } catch (error) { }

                    try {
                        let datesEmployed = document.querySelector('span[data-test-grouped-position-entity-date-range]').textContent.trim();
                        if (datesEmployed) exp.push(datesEmployed);
                    } catch (error) { }

                    try {
                        let duration = document.querySelector('span[data-test-grouped-position-entity-duration]').textContent.trim();
                        if (duration) exp.push(duration);
                    } catch (error) { }

                    try {
                        let positionSummary = document.querySelector('div[data-test-position-skills]').textContent.trim();
                        if (positionSummary) exp.push(positionSummary);
                    } catch (error) { }

                    listOfExperience.push(exp);
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }

        // Education
        let listOfEducation = [];
        try {
            let lengthOfEducation = await driver.findElements(By.xpath("//div[@data-test-education-card and @data-live-test-education-card]//li"));
            let totalEducation = lengthOfEducation.length;

            for (let i = 1; i <= totalEducation; i++) {
                let edu = [];
                let element = await driver.findElement(By.xpath(`//div[@data-test-education-card and @data-live-test-education-card]//li[${i}]`));
                let elementHtml = await element.getAttribute("outerHTML");
                let dom = new JSDOM(elementHtml);
                let document = dom.window.document;

                try {
                    let collegeName = document.querySelector('h3.background-entity__summary-definition--title').textContent.trim();
                    if (collegeName) edu.push(collegeName);
                } catch (error) { }

                try {
                    let degree = document.querySelector('span[data-test-education-entity-degree-name]').textContent.trim();
                    if (degree) edu.push(degree);
                } catch (error) { }

                try {
                    let fieldOfStudy = document.querySelector('span[data-test-education-entity-field-of-study]').textContent.trim();
                    if (fieldOfStudy) edu.push(fieldOfStudy);
                } catch (error) { }

                try {
                    let dateOfDegree = document.querySelector('dd.background-entity__summary-definition--date-duration').textContent.trim();
                    if (dateOfDegree) edu.push(dateOfDegree);
                } catch (error) { }

                try {
                    let descriptionOfEdu = document.querySelector('dd.background-entity__summary-definition--description').textContent.trim();
                    if (descriptionOfEdu) edu.push(descriptionOfEdu);
                } catch (error) { }

                listOfEducation.push(edu);
            }
        } catch (error) {
            listOfEducation = '';
        }

        let currentJobRole = listOfExperience.length ? listOfExperience[0][0] : '';

        let currentCompany = '';
        try {
            let totalText = listOfExperience[0][1];
            let listOfText = totalText.split(' · ');
            let current = listOfText[0];

            function containsNumber(string) {
                return /\d/.test(string);
            }

            function processString(string) {
                if (!containsNumber(string)) {
                    return string;
                }
                return '';
            }

            currentCompany = processString(current) || listOfExperience[0][1];
        } catch (error) {
            currentCompany = listOfExperience.length ? listOfExperience[0][1] : '';
        }

        let profileData = {
            name: name,
            currentJobRole: currentJobRole,
            currentCompany: currentCompany,
            location: location,
            latestEducation: latestEducation,
            headlines: headlines,
            industry: industry,
            publicProfileUrl: linkedinUrl,
            about: about,
            experience: listOfExperience,
            Education: listOfEducation
        };

        await driver.navigate().back();
        return profileData;

    } finally {
        await driver.quit();
    }
}

// Example usage:
recScrapping('https://www.linkedin.com/talent/profile/AEMAAAEMUeoBlcPxMptQHFZAQL58CnRrp98FaRU?trk=SEARCH_GLOBAL').then(profileData => {
    console.log(profileData);
}).catch(error => {
    console.error('Error:', error);
});
