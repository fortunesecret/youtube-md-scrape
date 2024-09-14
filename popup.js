document.addEventListener("DOMContentLoaded", async () => {
    // Get the active tab
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Function to check if videos exist on the current page
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            // Check for the presence of YouTube video titles on the page
            let videos = document.querySelectorAll('a#video-title');
            return videos.length;  // Return the count of videos found
        }
    }, (results) => {
        let videoCount = results[0].result;  // Get the result from the content script
        
        // Get the span and button elements
        const validUrlElement = document.getElementById('valid-url');
        const scrapeButton = document.getElementById('scrape');

        if (videoCount > 0) {
            // Set the message and change the font color to green
            validUrlElement.textContent = `We found ${videoCount} videos here! We can scrape!`;
            validUrlElement.style.color = '#006400';  // Dark green
            
            // Enable the scrape button
            scrapeButton.disabled = false;
            scrapeButton.style.backgroundColor = '#336dab';  // Restore the button's background color
        } else {
            // Set the message and change the font color to red
            validUrlElement.textContent = "No videos to scrape...";
            validUrlElement.style.color = '#8B0000';  // Dark red
            
            // Disable the scrape button
            scrapeButton.disabled = true;
            scrapeButton.style.backgroundColor = '#d3d3d3';  // Set button background to a disabled gray
        }
    });

    // Toggle "About" paragraph visibility
    const aboutParagraph = document.getElementById('about');
    const toggleAboutButton = document.getElementById('toggle-about');

    toggleAboutButton.addEventListener('click', () => {
        if (aboutParagraph.style.display === 'none') {
            aboutParagraph.style.display = 'block';  // Show the paragraph
            toggleAboutButton.textContent = 'Hide About';  // Change button text
        } else {
            aboutParagraph.style.display = 'none';  // Hide the paragraph
            toggleAboutButton.textContent = 'Show About';  // Change button text
        }
    });
});

document.getElementById("scrape").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Inject and execute content.js in the active tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']  // Load and execute content.js
    });
});
