// const { spawn } = require('child_process');
// Need to change this to import syntax
// const pythonScript = '/path/to/script.py';
import ColorThief from './colorthief/dist/color-thief.mjs'

let email;
let indexingUrl;
let randText = "Here is a respectful observation of your brand. Here is a respectful observation of your brand. Here is a respectful observation of your brand";
let brandImageAssets = [
  "https://www.nike.com/images/nike-logo.png",
  "https://www.coca-cola.com/content/dam/brands/global/coca-cola/logo/logo-red.png",
  "https://www.apple.com/ac/structured-data/images/open_graph_logo.png"
];
let brandColorsArray = [
  '#' + Math.floor(Math.random() * 16777215).toString(16),
  '#' + Math.floor(Math.random() * 16777215).toString(16),
  '#' + Math.floor(Math.random() * 16777215).toString(16),
  '#' + Math.floor(Math.random() * 16777215).toString(16)
];
const colorThief = new ColorThief();

brandImageAssets.forEach((imageURL) => {
  const img = new Image();
  let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  img.crossOrigin = 'Anonymous';
  img.src = googleProxyURL + encodeURIComponent(imageURL);

  if (img.complete) {
    processImage(img);
  } else {
    img.addEventListener('load', function() {
      processImage(img);
    });
  }
});

function processImage(img) {
  const colorPalette = colorThief.getPalette(img);
  const hexCodes = colorPalette.map(rgb => rgbToHex(rgb));
  brandColorsArray = hexCodes;
  // Process the color palette for each image here
}

function rgbToHex(rgb) {
  const hex = rgb.map(component => {
    const hexValue = component.toString(16);
    return hexValue.length === 1 ? "0" + hexValue : hexValue;
  });

  return "#" + hex.join("");
}

function typewriter(text, textElement, i = 0) {
  if (i < text.length) {
    textElement.value += text.charAt(i);
    i++;
    setTimeout(() => typewriter(text, textElement, i), 20);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // getting references to these elements
  const webpageInput = document.getElementById('webpageInput');
  const runCommandBtn = document.getElementById('runCommandBtn');

  webpageInput.addEventListener('keydown', function(e) {
    if (e.key === "Enter" || e.key === "Return") {
      runCommandBtn.click();
    }
  });

  runCommandBtn.addEventListener('mouseover', function() {
    runCommandBtn.style.backgroundColor = "#4aa92a";
    runCommandBtn.style.transform = 'translate(0, -2px)';
    runCommandBtn.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
  })

  runCommandBtn.addEventListener('mouseout', function() {
    runCommandBtn.style.backgroundColor = "#88EA66";
    runCommandBtn.style.transform = 'translate(0, 2px)';
    runCommandBtn.style.boxShadow = 'none';
  })

  runCommandBtn.addEventListener('click', function() {
    // getting email value from input field
    email = webpageInput.value;

    // getting references to relevant elements
    const inputField = document.getElementById('webpageInput');
    const actionButton = document.getElementById('runCommandBtn');
    const targetDiv = document.getElementById('input-field');

    // reformat email to url
    indexingUrl = `www.${email.split('@')[1]}`;

    // just in case, getting root url
    const hostnameParts = indexingUrl.split('.');
    let iconRefUrl;
    if (hostnameParts.length > 2) {
      iconRefUrl = hostnameParts.slice(1).join('.');
    } else {
      iconRefUrl = indexingUrl;
    }

    // Sending HTTP Request to Firebase function with variable of URL to get brand image link
    // Needs to be Firebase function because of CORS issues
    fetch(`https://us-central1-moviechat-c0e74.cloudfunctions.net/getFavIcon?url=${iconRefUrl}`).then(async (icon_json) => {
      try {
        // receive brand image url back
        const data = await icon_json.text();

        // create image (placeholder for animation) of that URL and add it into relevant place in document
        const brandIcon = document.createElement('img');
        brandIcon.id = 'loading-brand-icon';
        brandIcon.src = data;
        targetDiv.insertBefore(brandIcon, actionButton);
      } catch (error) {
        console.log(error);
      }
    });
    
    // Minimize input field
    inputField.style.width = 0;
    inputField.style.padding = 0;
    inputField.style.paddingLeft = 0;

    // // Create loading animation
    // const loader = document.createElement('img');
    // loader.src = './imgs/splash-logo.png';

    // Call the scrape function which will return assets in .py script on URL
    scrapeToGen(indexingUrl);
  });
});

async function scrapeToGen(url) {
  // referencing relevant elements
  const targetDiv = document.getElementById('input-field');
  const headerText = document.getElementById('playtest-header-text');

  // adding white background div which will contain the assets
  const assetContainerDiv = document.createElement('div');
  assetContainerDiv.id = "asset-container-div";
  targetDiv.appendChild(assetContainerDiv);
  
  // const pythonProcess = spawn('python3', [pythonScript]);

  // pythonProcess.stdin.write(url); // Write the image buffer to Python script's stdin
  // pythonProcess.stdin.end();

  // Expand dark blue original container (note: make this run upon getting .py data back)
  await new Promise(resolve => setTimeout(resolve, 3000));
  targetDiv.style.width = '92%';
  targetDiv.style.height = "85%";

  // Expand white asset container after 0.2 second wait
  await new Promise(resolve => setTimeout(resolve, 200));
  assetContainerDiv.style.width = '88%'
  assetContainerDiv.style.height = '72%'

  // transform "Playtest" header after 0.2 second wait
  await new Promise(resolve => setTimeout(resolve, 200));
  headerText.style.left = "90px";
  headerText.style.top = "44px";
  headerText.style.color = "#ffffff";

  // Creating three divs to be laid out top to bottom inside assetContainerDiv
  const smallTextRow = document.createElement('div');
  smallTextRow.id = "small-text-row";

  const brandSection = document.createElement('div');
  brandSection.id = "brand-section";
  const campaignIdentityRow= document.createElement('div');
  campaignIdentityRow.id = "campaign-identity-row";
  assetContainerDiv.appendChild(smallTextRow);
  assetContainerDiv.appendChild(brandSection);
  assetContainerDiv.appendChild(campaignIdentityRow);

  //update your generated content BUTTON
  const contentButton = document.createElement('button');
  contentButton.textContent = 'Update Generated Content';
  contentButton.id = 'updateButton';
  contentButton.style.fontSize = '20px';
  contentButton.style.position = 'absolute';
  contentButton.style.bottom = '20px';
  contentButton.style.right = '20px';
  contentButton.style.width = "250px";
  contentButton.style.height = '100px';
  assetContainerDiv.appendChild(contentButton)

  
  // Small text row components
  const urlText = document.createElement('p');
  urlText.textContent = indexingUrl;
  urlText.style.color = "#232323";
  const emailText = document.createElement('p');
  emailText.textContent = email;
  emailText.style.color = "#232323";
  emailText.style.textAlign = "right";
  smallTextRow.appendChild(urlText);
  smallTextRow.appendChild(emailText);

  // Creating the brand info row
  const brandHeader = document.createElement('p');
  brandHeader.id = "brand-header";
  brandHeader.textContent = "Your Brand";
  brandHeader.style.fontSize = "30px";
  brandHeader.style.color = "#232323"; // off-black color
  brandSection.appendChild(brandHeader);
  
  const brandRow = document.createElement('div');
  brandRow.id = "brand-row";
  brandSection.appendChild(brandRow);

  // assets column
  const assetsColumn = document.createElement('div');
  assetsColumn.id = "assets-column";
  assetsColumn.style.width = "750px";
  brandRow.appendChild(assetsColumn);

  const assetsHeader = document.createElement('p');
  assetsHeader.textContent = "Assets";
  assetsHeader.className = "section-header";
  assetsHeader.style.color = "#232323";
  const imageAssetsRow = document.createElement('div');
  imageAssetsRow.id = "image-assets-row";
  const colorAssetsRow = document.createElement('div');
  colorAssetsRow.id = "color-assets-row";
  assetsColumn.appendChild(assetsHeader);
  assetsColumn.appendChild(imageAssetsRow);
  assetsColumn.appendChild(colorAssetsRow);

  for (let i = 0; i < brandColorsArray.length; i++) {
    let hoverHex = document.createElement('p');
    let hexAsString = brandColorsArray[i].toString();
    hoverHex.textContent = hexAsString;
    hoverHex.style.position = "absolute";
    hoverHex.className = "hex-color";
    hoverHex.style.color = "#141134";
    hoverHex.style.transform = 'translate(0, -30px)';
    hoverHex.addEventListener('mouseover', (event) => {
      event.preventDefault();
    });
    hoverHex.addEventListener('mouseout', (event) => {
      event.preventDefault();
    });

    const circle = document.createElement('div');
    circle.style.width = '40px';
    circle.style.height = '40px';
    circle.style.borderRadius = '50%';
    circle.style.backgroundColor = brandColorsArray[i];

    circle.addEventListener("mouseover", function() {
      circle.appendChild(hoverHex);
      hoverHex.style.opacity = 1.0;
    });

    circle.addEventListener("mouseout", async function() {
      hoverHex.style.opacity = 0.0;
      await new Promise(resolve => setTimeout(resolve, 300));
      hoverHex.remove();
    });
    circle.addEventListener("click", async function() {
      hoverHex.textContent = "Copied!";
      navigator.clipboard.writeText(hexAsString);
      await new Promise(resolve => setTimeout(resolve, 2000));
      hoverHex.textContent = hexAsString;
    });
    
    colorAssetsRow.appendChild(circle);
  }

  // keywords column
  const keywordsColumn = document.createElement('div');
  keywordsColumn.id = "keywords-column";
  keywordsColumn.style.width = "1000px";
  brandRow.appendChild(keywordsColumn);

  const keywordsHeader = document.createElement('p');
  keywordsHeader.textContent = "Keywords";
  keywordsHeader.style.color = "#232323";
  keywordsHeader.className = "section-header";
  const keywordsField = document.createElement('input');
  keywordsField.id = "keywords-field";
  keywordsColumn.appendChild(keywordsHeader);
  keywordsColumn.appendChild(keywordsField);

  // space for Mat to write row #3
  const campaignHeader = document.createElement('p');
  const campaignInputField = document.createElement('input');
  campaignHeader.textContent = "Campaign Identity";
  campaignHeader.style.fontSize = "30px";
  campaignInputField.style.fontSize = "20px";
  campaignInputField.style.color = "#232323";
  campaignInputField.style.paddingTop = '5px';
  campaignInputField.style.height = "200px";
  campaignInputField.style.width = "500px";
  
  campaignIdentityRow.appendChild(campaignHeader);
  campaignIdentityRow.appendChild(campaignInputField);
  typewriter(randText, campaignInputField);

}