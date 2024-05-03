document.addEventListener("DOMContentLoaded", function () {
  // prevent popup from closing when clicked outside or even if the tab is changed

  const loginForm = document.getElementById("login-form");
  const scraperContent = document.getElementById("scraper-content");
  const loginError = document.getElementById("login-error");
  let fullName = "";
  // const logoutButton = document.getElementById('logout-button');
  let selectedRoleData = null;
  let selectedRoleId = null;
  const scrapingURL = "https://7cb5c95f11b10eba092510968890f4c4.loophole.site";
  const crm_api_url =
    "https://74d5-182-176-99-238.ngrok-free.app/api/extension";
  loginForm.style.display = "block"; // Show login form initially
  scraperContent.style.display = "none"; // Hide scraper content initially
  let currentUrl = null;
  let public_rec_url = null;

  // check for selectedRoleId in local storage
  const savedSelectedRoleId = localStorage.getItem("selectedRoleId");
  selectedRoleId = savedSelectedRoleId ? savedSelectedRoleId : null;
  const roleSelected = document.getElementById("roleSelected");
  const currentCompany = document.getElementById("current-company");
  const currentTitle = document.getElementById("current-title");

  // ............................................................................................ Functions ............................................................................................ //

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    currentUrl = currentTab.url;
    urlDisplay.textContent = "Profile URL: " + currentUrl;
  });
  // gbet role options from local storage
  const savedRoleOptions = localStorage.getItem("roleOptions");
  roleSelected.innerHTML = savedRoleOptions
    ? `${savedRoleOptions}`
    : "No role selected";
  roleSelected.style.display = "block";

  // // prevent copy paste
  document.addEventListener("copy", function (e) {
    e.preventDefault();
  });
  // prevent right click
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
  // prevent selection of text
  document.addEventListener("selectstart", function (e) {
    e.preventDefault();
  });

  // if user is already logged in, show scraper content
  const userId = parseInt(localStorage.getItem("userId"));
  if (userId) {
    loginForm.style.display = "none"; // Hide login
    scraperContent.style.display = "block"; // Show scraper content
    // get roles for the user using post request
    fetch(`${crm_api_url}/getInProgressRolesByUserId`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const roleDetailsContainer = document.getElementById("dvContainer");

        // Clear any existing content in the container
        roleDetailsContainer.innerHTML = "";

        // Populate the select element with role options
        var roleOptions = [];
        data.newRoles.forEach((role) => {
          roleOptions.push(role);
        });

        // Create a DropDown element
        var dropdown = document.createElement("SELECT");

        // Add options to the DropDown element
        roleOptions.forEach((role) => {
          var option = document.createElement("option");
          option.innerHTML =
            role.clientNumber + " - " + role.title + " - " + role.location;
          localStorage.setItem(
            "roleOptions",
            role.clientNumber + " - " + role.title + " - " + role.location
          );
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
        // Add event listener to the dropdown
        dropdown.addEventListener("change", async function () {
          const selectedRole = dropdown.options[dropdown.selectedIndex].value;
          selectedRoleData = roleOptions.find(
            (role) => role?.title === selectedRole
          );
          // make roleSelected div visible and populate the data
          const roleSelectedDiv = document.getElementById("roleSelected");
          roleSelectedDiv.style.display = "block";
          // set fontsize
          roleSelectedDiv.style.fontSize = "11px";
          selectedRoleId = selectedRoleData?.id;
          localStorage.setItem("selectedRoleId", selectedRoleData?.id);

          // Update localStorage with the selected role
          localStorage.setItem("roleOptions", selectedRole);

          // Update the content of roleSelectedDiv
          roleSelectedDiv.innerHTML = selectedRole
            ? selectedRole
            : "No role selected";
        });
      })
      .catch((error) => {});
  }
  document
    .getElementById("login-button")
    .addEventListener("click", async () => {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Perform login actions
      const isLoggedIn = await performLogin(username, password);
      if (isLoggedIn) {
        loginForm.style.display = "none"; // Hide login
        scraperContent.style.display = "block"; // Show scraper content
      }
    });

  // Login function
  async function performLogin(username, password) {
    // Call login API
    const api_url = `${crm_api_url}/extensionLogin`;

    try {
      const response = await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const roleDetailsContainer = document.getElementById("dvContainer");

        // Clear any existing content in the container
        roleDetailsContainer.innerHTML = "";

        // Populate the select element with role options
        var roleOptions = [];
        data.newRoles.forEach((role) => {
          roleOptions.push(role);
        });

        // Create a DropDown element
        var dropdown = document.createElement("SELECT");
        // save the role options in local storage
        // Add options to the DropDown element
        roleOptions.forEach((role) => {
          var option = document.createElement("option");
          option.innerHTML =
            role.clientNumber + " - " + role.title + " - " + role.location;
          localStorage.setItem(
            "roleOptions",
            role.clientNumber + " - " + role.title + " - " + role.location
          );
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
        // Add event listener to the dropdown
        dropdown.addEventListener("change", async function () {
          const selectedRole = dropdown.options[dropdown.selectedIndex].value;
          selectedRoleData = roleOptions.find(
            (role) => role?.title === selectedRole
          );
          // make roleSelected div visible and populate the data
          const roleSelectedDiv = document.getElementById("roleSelected");
          roleSelectedDiv.style.display = "block";
          // set fontsize
          roleSelectedDiv.style.fontSize = "11px";
          selectedRoleId = selectedRoleData?.id;
          localStorage.setItem("selectedRoleId", selectedRoleData?.id);

          // Update localStorage with the selected role
          localStorage.setItem("roleOptions", selectedRole);

          // Update the content of roleSelectedDiv
          roleSelectedDiv.innerHTML = selectedRole
            ? selectedRole
            : "No role selected";
        });

        // HTTP status code is in the range 200-299
        // set userid in local storage
        localStorage.setItem("userId", data.userId);
        return true;
      } else {
        // HTTP status code is not in the success range
        // Handle error
        console.error("Error:", data);
        loginError.innerText = data.message;
        return false;
      }
    } catch (error) {
      // Network error or other unexpected errors
      console.error("Error:", error);
      return false;
    }
  }

  // // implement logout functionality
  // logoutButton.addEventListener('click', () => {
  //     localStorage.removeItem('userId');
  //     loginForm.style.display = 'block'; // Show login form
  //     scraperContent.style.display = 'none'; // Hide scraper content
  // });

  const urlDisplay = document.getElementById("url-display");
  const fetchButton = document.getElementById("fetch-button");
  //my code akash ahmad
  const publicprofile = document.getElementById("public-profile");
  //my code akash
  const moveTocrm = document.getElementById("download-button");
  //   const closeButton = document.getElementById("close-button");
  const responseDiv = document.getElementById("response");
  const emailInput = document.getElementById("business-email"); // Updated
  const phoneInput = document.getElementById("business-phone"); // Updated
  const personalEmailInput = document.getElementById("personal-email");
  const personalPhoneInput = document.getElementById("personal-phone");
  //   const workEmailInput = document.getElementById("work-email");
  //   const workPhoneInput = document.getElementById("work-phone");

  let fileName = null;
  // Function to generate CV HTML from API response data
  function generateCV_for_rec(profileData) {
    console.log("hjsgfsdgfsdf",profileData)
    fileName = profileData.name;
    fullName = profileData.name;
    currentCompany.innerHTML = profileData.currentCompany;
    currentTitle.innerHTML = profileData.currentJobRole;
    public_rec_url = profileData.public_profile_url;
    let html = `
            <div class="cv">
                <h2>${profileData.name}</h2>
                <p><strong>Email (Business):</strong> ${emailInput?.value}</p>
                <p><strong>Phone (Business):</strong> ${phoneInput?.value}</p>
                <p><strong>Email (Personal):</strong> ${personalEmailInput?.value}</p>
                <p><strong>Phone (Personal):</strong> ${personalPhoneInput?.value}</p>
                <p><strong>Location:</strong> ${profileData?.location}</p>
                <p><strong>Headlines:</strong> ${profileData?.headlines}</p>
                <p><strong>Public Profile URL:</strong> ${profileData?.public_profile_url}</p>
                <p><strong>Current Eduation:</strong> ${profileData?.latest_education}</p>
                <p><strong>Industry:</strong> ${profileData?.industry}</p>
                <p><strong>About:</strong></p>
                <p>${profileData?.about}</p>
                <h3>Experience</h3>
                <ul>
        `;
    profileData.experience.forEach((experience) => {
      html += `
                <li>
                    <strong>${experience}</strong> 
                </li>
            `;
    });

    html += `
                </ul>
                <h3>Education</h3>
                <ul>
        `;

    profileData.Education.forEach((education) => {
      html += `
                <li>
                    <strong>${education}</strong>
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
    fullName = profileData.name;
    currentCompany.innerHTML = profileData.currentCompany;
    currentTitle.innerHTML = profileData.currentJobRole;
    // <p><strong>Email (Work):</strong> ${workEmailInput.value}</p>
    // <p><strong>Phone (Work):</strong> ${workPhoneInput.value}</p>
    let html = `
            <div class="cv">
                <h2>${profileData.name}</h2>
                <p><strong>Email (Business):</strong> ${emailInput?.value}</p>
                <p><strong>Phone (Business):</strong> ${phoneInput?.value}</p>
                <p><strong>Email (Personal):</strong> ${personalEmailInput?.value}</p>
                <p><strong>Phone (Personal):</strong> ${personalPhoneInput?.value}</p>
                <p><strong>Location:</strong> ${profileData?.location}</p>
                <p><strong>Headlines:</strong> ${profileData?.headlines}</p>
                <p><strong>About:</strong></p>
                <p>${profileData?.about}</p>
                <h3>Experience</h3>
                <ul>
        `;
    profileData?.experience.forEach((experience) => {
      html += `
                <li>
                    <strong>${experience}</strong> 
                </li>
            `;
    });

    html += `
                </ul>
                <h3>Education</h3>
                <ul>
        `;

    profileData.Education.forEach((education) => {
      html += `
                <li>
                    <strong>${education}</strong>
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
      return url.includes("linkedin.com");
    }

  // Function to validate email
  //   function validateEmail(email) {
  //     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     return regex.test(email);
  //   }

  // Function to download HTML content as PDF
  //   function downloadPDF(cvHtml) {
  //     const blob = new Blob([cvHtml], { type: "text/html" }); // Set type to 'text/html'
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = fileName + ".html"; // Change extension to '.html'
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     setTimeout(() => {
  //       URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     }, 0);
  //   }

  // Hide download button until API response is received
  moveTocrm.style.display = "none";

  fetchButton.addEventListener("click", function () {
    // // Check if the URL is a valid LinkedIn profile URL
    if (!isValidLinkedInUrl(currentUrl)) {
        responseDiv.innerText = 'Error: This is not a valid LinkedIn profile URL.';
        return;
    }

    // const email = emailInput.value.trim();
    // const phone = phoneInput.value.trim();

    // if (!validateEmail(email)) {
    //     responseDiv.innerText = 'Error: Please enter a valid email address.';
    //     return;
    // }

    fetch(`${scrapingURL}/linkedinRecruiter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: currentUrl }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const cvHtml = generateCV_for_rec(data);
        responseDiv.innerHTML = cvHtml;
        moveTocrm.style.display = "inline-block"; // Show download button
      })
      .catch((error) => {
        responseDiv.innerText = "Error in scraping API: " + error.message;
      });
  });

  // my code akash

  moveTocrm.style.display = "none";

  publicprofile.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      currentUrl = currentTab.url;
      urlDisplay.textContent = "Profile URL: " + currentUrl;

      //   // Check if the URL is a valid LinkedIn profile URL
        if (!isValidLinkedInUrl(currentUrl)) {
          responseDiv.innerText =
            "Error: This is not a valid LinkedIn profile URL.";
          return;
        }

      //   const email = emailInput.value.trim();
      //   const phone = phoneInput.value.trim();

      //   if (!validateEmail(email)) {
      //     responseDiv.innerText = "Error: Please enter a valid email address.";
      //     return;
      //   }

      fetch(`${scrapingURL}/linkedinPublic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: currentUrl }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const cvHtml = generateCV_for_pub(data);
          responseDiv.innerHTML = cvHtml;
          moveTocrm.style.display = "inline-block"; // Show download button
        })
        .catch((error) => {
          responseDiv.innerText = "Error: " + error.message;
        });
    });
  });

  // my code akash

  moveTocrm.addEventListener("click", function () {
    // post data to server
    if (selectedRoleId === null) {
      responseDiv.innerText = "Error: Please select a role before proceeding.";
      return;
    }
    // get the selected option from select id of cvType
    const cvType = document.getElementById("cvType");
    const selectedCVType = cvType.options[cvType.selectedIndex].value;
    const url = currentUrl;
    const payload = {
      profile_link: public_rec_url ? public_rec_url : url ? url : "",
      personalEmail: personalEmailInput.value,
      fullName: fullName,
      businessEmail: emailInput.value,
      businessNumber: phoneInput.value,
      personalContact: personalPhoneInput.value,
      profileType: selectedCVType,
      profileStatus: "active",
      LIStatus: true,
      currentCompany: currentCompany?.innerText,
      currentTitle: currentTitle?.innerText,
      LIRejectionReason: "",
      profileHTML: responseDiv.innerHTML,
      resourcerId: userId,
      roleId: selectedRoleId,
    };

    fetch(`${crm_api_url}/addDataToLIProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        responseDiv.innerText = "Data added successfully";
      })
      .catch((error) => {
        responseDiv.innerText = "Error: " + error.message;
      });
  });
});
