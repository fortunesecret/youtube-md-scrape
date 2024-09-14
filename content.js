// Function to auto-scroll and load all video elements
async function autoScroll() {
    let totalHeight = 0;
    let distance = 100;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    while (document.documentElement.scrollHeight > totalHeight) {
        window.scrollBy(0, distance);
        totalHeight = document.documentElement.scrollHeight;
        await delay(500);
    }
}

// Function to extract video titles and links from the page
function getVideoTitlesAndLinks() {
    let videos = Array.from(document.querySelectorAll('a#video-title'));
    return videos.map(video => ({
        title: video.textContent.trim(),
        link: `https://www.youtube.com${video.getAttribute('href')}`
    }));
}

// Function to download a file
function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// Run the script: scroll the page, get the titles, and download them
(async () => {
    await autoScroll();  // Scroll to load all videos
    let videos = getVideoTitlesAndLinks();  // Get all video titles and links
    
    // Format the output as a markdown table
    let markdownContent = "| No. | Video Title | Link |\n| --- | ----------- | ---- |\n";
    videos.forEach((video, index) => {
        markdownContent += `| ${index + 1} | ${video.title.replace(/\|/g, "\\|")} | [Link](${video.link}) |\n`;
    });
    
    // Download as markdown file
    downloadFile(markdownContent, 'YouTube_Video_Titles.md', 'text/markdown');
})();
