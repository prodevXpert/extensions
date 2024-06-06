// pubScrapping.js

const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = chrome;
const { parse: parseHTML } = require('node-html-parser');

async function pubScrapping(personProfileUrl) {
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
        await driver.sleep(2000);

        let name = '';
        try {
            name = await driver.findElement(By.xpath("//a/h1[@class = 'text-heading-xlarge inline t-24 v-align-middle break-words']")).getText();
        } catch (error) {
        }

        let headlines = '';
        try {
            headlines = await driver.findElement(By.xpath("//div[@class = 'text-body-medium break-words']")).getText();
        } catch (error) {
        }

        let location = '';
        try {
            location = await driver.findElement(By.xpath("//div/span[@class = 'text-body-small inline t-black--light break-words']")).getText();
        } catch (error) {
        }

        let about = '';
        try {
            const pageSource = await driver.getPageSource();
            const html = parseHTML(pageSource);
            about = html.querySelector("div[class='display-flex ph5 pv3']  span[class='visually-hidden']").text;
        } catch (error) {
        }

        let list_of_experience = [];
        try {
            const number_of_experience = await driver.findElements(By.xpath("(//section/div[@id='experience']/ancestor::section//div[@class ='display-flex flex-row justify-space-between'])"));
            const total_experience = number_of_experience.length;
            for (let i = 1; i <= total_experience; i++) {
                try {
                    const span_element1 = await driver.findElement(By.xpath(`(//section/div[@id='experience']/ancestor::section//div[@class ='display-flex flex-row justify-space-between'])[${i}]`));
                    const full_element_html = await span_element1.getAttribute('outerHTML');
                    const soup = parseHTML(full_element_html);
                    const unique_texts = soup.text.trim().split('\n');
                    const new_st = unique_texts.filter((text, index) => unique_texts.indexOf(text) === index);
                    list_of_experience.push(new_st);
                } catch (error) {
                }
            }
        } catch (error) {
        }

        let list_of_education = [];
        try {
            const length_of_education = await driver.findElements(By.xpath("(//section/div[@id='education']/ancestor::section//div[@class ='display-flex flex-row justify-space-between'])"));
            const total_education = length_of_education.length;
            for (let i = 1; i <= total_education; i++) {
                try {
                    const span_element1 = await driver.findElement(By.xpath(`(//section/div[@id='education']/ancestor::section//div[@class ='display-flex flex-row justify-space-between'])[${i}]`));
                    const full_element_html = await span_element1.getAttribute('outerHTML');
                    const soup = parseHTML(full_element_html);
                    const unique_texts = soup.text.trim().split('\n');
                    const new_st = unique_texts.filter((text, index) => unique_texts.indexOf(text) === index);
                    list_of_education.push(new_st);
                } catch (error) {
                }
            }
        } catch (error) {
        }

        let profile_status = '';
        try {
            const span_element1 = await driver.findElement(By.xpath("//img[contains(@class,'profile-picture__image')]"));
            const full_element_html = await span_element1.getAttribute('outerHTML');
            const soup = parseHTML(full_element_html);
            const img_tag = soup.querySelector('img');
            const opentowork_value = img_tag.getAttribute('title');
            if (opentowork_value.includes('OPEN_TO_WORK')) {
                profile_status = "Open to work";
            }
        } catch (error) {
        }

        let current_job_role = '';
        let current_company = '';
        try {
            current_job_role = list_of_experience[0][0];
            const total_text = list_of_experience[0][1];
            const list_of_text = total_text.split(' · ');
            const current = list_of_text[0];
            function containsNumber(string) {
                return /\d/.test(string);
            }
            function processString(string) {
                if (containsNumber(string)) {
                    return null;
                } else {
                    return string;
                }
            }
            current_company = processString(current);
        } catch (error) {
        }

        const profile_data = {
            'name': name,
            'profile_status': profile_status,
            'currentJobRole': current_job_role,
            'currentCompany': current_company,
            'location': location,
            'headlines': headlines,
            'about': about,
            'experience': list_of_experience,
            'education': list_of_education
        };
        await driver.navigate().back();
        return profile_data;
    } catch (error) {
    } finally {
        await driver.quit();
    }
}


// Usage example:
const personProfileUrl = 'https://www.linkedin.com/in/fawad-m-4b09b3157/';
pubScrapping(personProfileUrl).then(profileData => {
    console.log(profileData);
}).catch(error => {
    console.error(error);
});
