chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});

// Define an array of keywords to highlight
const keywordsToHighlight = [
  "Charity",
  "Charities",
  "Fund",
  "donation",
  "non profit",
  "Govt agency",
  "Recruit",
  "Hiring",
  "Hr",
  "Outsourcing",
  "Offshoring",
  "Staffing",
  "consultancy",
];

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  // Next state will always be the opposite
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  // Set the action badge to the next state
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState
  });

  if (nextState === 'ON') {
    // Insert the CSS file when the user turns the extension on
    await chrome.scripting.insertCSS({
      files: ['focus-mode.css'],
      target: { tabId: tab.id }
    });

    // Execute a content script to highlight the keywords on the page
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (keywords) => {
        const body = document.body;
        const text = body.innerHTML;
        let highlightedText = text;
        keywords.forEach(keyword => {
          highlightedText = highlightedText.replace(
            new RegExp(keyword, 'g'),
            `<span style="background-color: yellow;">${keyword}</span>`
          );
        });
        body.innerHTML = highlightedText;
      },
      args: [keywordsToHighlight]
    });
  } else if (nextState === 'OFF') {
    // Remove the CSS file when the user turns the extension off
    await chrome.scripting.removeCSS({
      files: ['focus-mode.css'],
      target: { tabId: tab.id }
    });
  }
});
