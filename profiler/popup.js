document.addEventListener('DOMContentLoaded', function () {

    // prevent popup from closing when clicked outside or even if the tab is changed

    const loginForm = document.getElementById('login-form');
    const scraperContent = document.getElementById('scraper-content');
    const loginError = document.getElementById('login-error');
    const logoutButton = document.getElementById('logout-button');
    let selectedRoleData = null;
    let selectedRoleId = null;
    const scrapingURL = 'https://f3cf-182-176-99-238.ngrok-free.app'
    const crm_api_url = 'http://localhost:5000/api/extension';
    loginForm.style.display = 'block'; // Show login form initially
    scraperContent.style.display = 'none'; // Hide scraper content initially

    // // prevent copy paste
    document.addEventListener('copy', function (e) {
        e.preventDefault();
    });
    // prevent right click
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    // prevent selection of text
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
    });

    // if user is already logged in, show scraper content
    const userId = parseInt(localStorage.getItem('userId'));
    if (userId) {
        
        loginForm.style.display = 'none'; // Hide login
        scraperContent.style.display = 'block'; // Show scraper content
        // get roles for the user using post request
        fetch(`${crm_api_url}/getInProgressRolesByUserId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const roleDetailsContainer = document.getElementById('dvContainer');

                // Clear any existing content in the container
                roleDetailsContainer.innerHTML = '';

                // Populate the select element with role options
                var roleOptions = []
                data.newRoles.forEach(role => {
                    
                    roleOptions.push(role);
                });

                // Create a DropDown element
                var dropdown = document.createElement("SELECT");

                // Add options to the DropDown element
                roleOptions.forEach(role => {
                    var option = document.createElement("option");
                    option.innerHTML = role.title;
                    option.value = role.title;
                    dropdown.options.add(option);
                });

                // Reference the container element
                var container = document.getElementById("dvContainer");

                // add droptdownlist to div
                var div = document.createElement("div");
                div.appendChild(dropdown);
                container.appendChild(div);

                // Add event listener to the dropdown
                dropdown.addEventListener('change', async function () {
                    const selectedRole = dropdown.options[dropdown.selectedIndex].value;
                    selectedRoleData = roleOptions.find(role => role.title === selectedRole);
                    // make roleSelected div visible and populate the data
                    const roleSelectedDiv = document.getElementById('roleSelected');
                    roleSelectedDiv.style.display = 'block';
                    // set fontsize
                    roleSelectedDiv.style.fontSize = '11px';
                    selectedRoleId = selectedRoleData.id;
                    roleSelectedDiv.innerHTML = `Role: ${selectedRoleData.title} &nbsp; (${selectedRoleData.location})`;
                });
            })
            .catch(error => {
               
            });

    }
    document.getElementById('login-button').addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Perform login actions
        const isLoggedIn = await performLogin(username, password);
        if (isLoggedIn) {
            loginForm.style.display = 'none'; // Hide login
            scraperContent.style.display = 'block'; // Show scraper content
        }
    })

    console.log("hjsjfbsdk",selectedRoleId)
    // Login function
    async function performLogin(username, password) {
        // Call login API
        const api_url = `${crm_api_url}/extensionLogin`

        try {
            const response = await fetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                const roleDetailsContainer = document.getElementById('dvContainer');

                // Clear any existing content in the container
                roleDetailsContainer.innerHTML = '';

                // Populate the select element with role options
                var roleOptions = []
                data.newRoles.forEach(role => {
                    roleOptions.push(role);
                });

                // Create a DropDown element
                var dropdown = document.createElement("SELECT");

                // Add options to the DropDown element
                roleOptions.forEach(role => {
                    var option = document.createElement("option");
                    option.innerHTML = role.title;
                    option.value = role.title;
                    dropdown.options.add(option);
                });

                // Reference the container element
                var container = document.getElementById("dvContainer");

                // add droptdownlist to div
                var div = document.createElement("div");
                div.appendChild(dropdown);
                container.appendChild(div);

                // Add event listener to the dropdown
                dropdown.addEventListener('change', async function () {
                    const selectedRole = dropdown.options[dropdown.selectedIndex].value;
                    selectedRoleData = roleOptions.find(role => role.title === selectedRole);
                    // make roleSelected div visible and populate the data
                    const roleSelectedDiv = document.getElementById('roleSelected');
                    roleSelectedDiv.style.display = 'block';
                    // set fontsize
                    roleSelectedDiv.style.fontSize = '11px';
                    selectedRoleId = selectedRoleData.id;
                    roleSelectedDiv.innerHTML = `Role: ${selectedRoleData.title} &nbsp; (${selectedRoleData.location})`;
                });
                
                // HTTP status code is in the range 200-299
                // set userid in local storage
                localStorage.setItem('userId', data.userId);
                return true;
            } else {

                // HTTP status code is not in the success range
                // Handle error
                console.error('Error:', data);
                loginError.innerText = data.message;
                return false;
            }
        } catch (error) {
            // Network error or other unexpected errors
            console.error('Error:', error);
            return false;
        }
    }

    // implement logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('userId');
        loginForm.style.display = 'block'; // Show login form
        scraperContent.style.display = 'none'; // Hide scraper content
    });

    const urlDisplay = document.getElementById('url-display');
    const fetchButton = document.getElementById('fetch-button');
    //my code akash ahmad
    const publicprofile = document.getElementById('public-profile');
    //my code akash
    const moveTocrm = document.getElementById('download-button');
    const closeButton = document.getElementById('close-button');
    const responseDiv = document.getElementById('response');
    const emailInput = document.getElementById('business-email'); // Updated
    const phoneInput = document.getElementById('business-phone'); // Updated
    const personalEmailInput = document.getElementById('personal-email');
    const personalPhoneInput = document.getElementById('personal-phone');
    const workEmailInput = document.getElementById('work-email');
    const workPhoneInput = document.getElementById('work-phone');


    let fileName = null;
    // Function to generate CV HTML from API response data
    function generateCV_for_rec(profileData) {
        fileName = profileData.name;
        let html = `
            <div class="cv">
                <h2>${profileData.name}</h2>
                <p><strong>Email (Business):</strong> ${emailInput.value}</p>
                <p><strong>Phone (Business):</strong> ${phoneInput.value}</p>
                <p><strong>Email (Personal):</strong> ${personalEmailInput.value}</p>
                <p><strong>Phone (Personal):</strong> ${personalPhoneInput.value}</p>
                <p><strong>Email (Work):</strong> ${workEmailInput.value}</p>
                <p><strong>Phone (Work):</strong> ${workPhoneInput.value}</p>
                <p><strong>Location:</strong> ${profileData.location}</p>
                <p><strong>Headlines:</strong> ${profileData.headlines}</p>
                <p><strong>Public Profile URL:</strong> ${profileData.public_profile_url}</p>
                <p><strong>Current Eduation:</strong> ${profileData.latest_education}</p>
                <p><strong>Industry:</strong> ${profileData.industry}</p>
                <p><strong>About:</strong></p>
                <p>${profileData.about}</p>
                <h3>Experience</h3>
                <ul>
        `;
        profileData.experience.forEach(experience => {
            html += `
                <li>
                    <strong>${experience[0]}</strong> -
                    ${experience[1]} (${experience[2]}) - 
                    ${experience[3]} 
                    ${experience[4]}
                    ${experience[5]}
                </li>
            `;
        });

        html += `
                </ul>
                <h3>Education</h3>
                <ul>
        `;

        profileData.Education.forEach(education => {
            html += `
                <li>
                    <strong>${education[0]}</strong> -
                    ${education[1]} (${education[2]}) (${education[3]}) (${education[4]})
                </li>
            `;
        });

        html += `
                </ul>
            </div>
        `;

        return html;
    }

    function generateCV_for_pub(profileData) {
        fileName = profileData.name;
        let html = `
            <div class="cv">
                <h2>${profileData.name}</h2>
                <p><strong>Email (Business):</strong> ${emailInput.value}</p>
                <p><strong>Phone (Business):</strong> ${phoneInput.value}</p>
                <p><strong>Email (Personal):</strong> ${personalEmailInput.value}</p>
                <p><strong>Phone (Personal):</strong> ${personalPhoneInput.value}</p>
                <p><strong>Email (Work):</strong> ${workEmailInput.value}</p>
                <p><strong>Phone (Work):</strong> ${workPhoneInput.value}</p>
                <p><strong>Location:</strong> ${profileData.location}</p>
                <p><strong>Headlines:</strong> ${profileData.headlines}</p>
                <p><strong>About:</strong></p>
                <p>${profileData.about}</p>
                <h3>Experience</h3>
                <ul>
        `;
        profileData.experience.forEach((experience, index) => {
            html += `
                <li>
                    <strong>${experience[index]}</strong> -
                </li>
            `;
        });

        html += `
                </ul>
                <h3>Education</h3>
                <ul>
        `;

        profileData.Education.forEach(education => {
            html += `
                <li>
                    <strong>${education[0]}</strong> -
                    ${education[1]} (${education[2]}) (${education[3]})
                </li>
            `;
        });

        html += `
                </ul>
            </div>
        `;

        return html;
    }


    // Function to check if the URL is a valid LinkedIn profile URL
    function isValidLinkedInUrl(url) {
        return url.includes('linkedin.com');
    }

    // Function to validate email
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Function to download HTML content as PDF
    function downloadPDF(cvHtml) {
        const blob = new Blob([cvHtml], { type: 'text/html' }); // Set type to 'text/html'
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName + '.html'; // Change extension to '.html'
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    }


    // Hide download button until API response is received
    moveTocrm.style.display = 'none';

    fetchButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const currentUrl = currentTab.url;
            urlDisplay.textContent = 'Profile URL: ' + currentUrl;

            // Check if the URL is a valid LinkedIn profile URL
            if (!isValidLinkedInUrl(currentUrl)) {
                responseDiv.innerText = 'Error: This is not a valid LinkedIn profile URL.';
                return;
            }

            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();

            if (!validateEmail(email)) {
                responseDiv.innerText = 'Error: Please enter a valid email address.';
                return;
            }

            fetch(`${scrapingURL}/linkedinRecruiter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: currentUrl })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const cvHtml = generateCV_for_rec(data);
                    responseDiv.innerHTML = cvHtml;
                    moveTocrm.style.display = 'inline-block'; // Show download button
                })
                .catch(error => {
                    responseDiv.innerText = 'Error: ' + error.message;
                });
        });
    });

    // my code akash

    moveTocrm.style.display = 'none';

    publicprofile.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTab = tabs[0];
            const currentUrl = currentTab.url;
            urlDisplay.textContent = 'Profile URL: ' + currentUrl;

            // Check if the URL is a valid LinkedIn profile URL
            if (!isValidLinkedInUrl(currentUrl)) {
                responseDiv.innerText = 'Error: This is not a valid LinkedIn profile URL.';
                return;
            }

            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();

            if (!validateEmail(email)) {
                responseDiv.innerText = 'Error: Please enter a valid email address.';
                return;
            }

            fetch(`${scrapingURL}/linkedinPublic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: currentUrl })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const cvHtml = generateCV_for_pub(data);
                    responseDiv.innerHTML = cvHtml;
                    moveTocrm.style.display = 'inline-block'; // Show download button
                })
                .catch(error => {
                    responseDiv.innerText = 'Error: ' + error.message;
                });
        });
    });

    // my code akash



    moveTocrm.addEventListener('click', function () {
        // post data to server
        if (selectedRoleId === null) {
            responseDiv.innerText = 'Error: Please select a role before proceeding.';
            return;
        }
        // get the selected option from select id of cvType
        const cvType = document.getElementById('cvType');
        const selectedCVType = cvType.options[cvType.selectedIndex].value;
        const url = urlDisplay.textContent;
        const payload = {
            profile_link: url,
            personalEmail: personalEmailInput.value,
            businessEmail: emailInput.value,
            businessNumber: phoneInput.value,
            personalContact: personalPhoneInput.value,
            profileType: selectedCVType,
            profileStatus: "active",
            LIStatus: true,
            LIRejectionReason: "",
            profileHTML: responseDiv.innerHTML,
            resourcerId: selectedRoleId,
            roleId: 2
        }

        fetch('http://localhost:5000/api/extension/addDataToLIProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                responseDiv.innerText = 'Data added successfully';
            })
            .catch(error => {
                responseDiv.innerText = 'Error: ' + error.message;
            });
    });
});
