// const { spawn } = require('child_process');
// Need to change this to import syntax
// const pythonScript = '/path/to/script.py';
import ColorThief from './colorthief/dist/color-thief.mjs'

let email;
let indexingUrl;
let randText = "Here is a respectful observation of your brand";
let brandImageAssets = [
  "https://i.pinimg.com/550x/f0/4b/08/f04b08afcbef3dd40ef1e692d8443ec1.jpg",
  "https://static.vecteezy.com/system/resources/previews/017/792/880/original/coca-cola-logo-popular-drink-brand-logo-free-vector.jpg",
  "https://www.apple.com/ac/structured-data/images/open_graph_logo.png"
];
let assetsArray = [];
for (let i = 0; i < brandImageAssets.length; i++) {
  let img = document.createElement('img');
  img.src = brandImageAssets[i];
  assetsArray.push(img);
}
let brandColorsArray = [];
let distilledColorsArray = [];
let keywordsArray = [
  'bold',
  'energetic',
  'adventurous'
];
const colorThief = new ColorThief();

let promises = [];
function distillColors() {
  brandImageAssets.forEach((imageURL) => {
    const promise = new Promise((resolve) => {
      const img = new Image();
      let googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
      img.crossOrigin = 'Anonymous';
      img.src = googleProxyURL + encodeURIComponent(imageURL);
  
      if (img.complete) {
        resolve(processImage(img));
      } else {
        img.addEventListener('load', function() {
          resolve(processImage(img));
        });
      }
    });
  
    // Add the Promise to the array
    promises.push(promise);
  });
  Promise.all(promises).then(() => {
    while (distilledColorsArray.length < 6) {
      const randomIndex = Math.floor(Math.random() * brandColorsArray.length);
      const randomElement = brandColorsArray[randomIndex];
      distilledColorsArray.push(randomElement);
      brandColorsArray.splice(randomIndex, 1);
    }
    console.log(distilledColorsArray);
    // Your code here
  }).catch((error) => {
    console.error(error);
  });
}

distillColors();

function processImage(img) {
  const colorPalette = colorThief.getPalette(img);
  const hexCodes = colorPalette.map(rgb => rgbToHex(rgb));
  console.log(hexCodes)
  brandColorsArray = brandColorsArray.concat(hexCodes);
  console.log(brandColorsArray);
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
    runCommandBtn.style.backgroundColor = "#49A81C";
    runCommandBtn.style.transform = 'translate(0, -2px)';
    runCommandBtn.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2)';
  })

  runCommandBtn.addEventListener('mouseout', function() {
    runCommandBtn.style.backgroundColor = "#7EB744";
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

async function readJsonFile(filename) {
  const response = await fetch(filename);
  const data = await response.json();
  return data;
}

async function scrapeToGen(url) {
  // referencing relevant elements
  const targetDiv = document.getElementById('input-field');
  const headerText = document.getElementById('playtest-header-text');

  // adding white background div which will contain the assets
  const assetContainerDiv = document.createElement('div');
  assetContainerDiv.style.width = "0%";
  assetContainerDiv.style.height = "0%";
  assetContainerDiv.id = "asset-container-div";
  targetDiv.appendChild(assetContainerDiv);
  
  // const pythonProcess = spawn('python3', [pythonScript]);

  // pythonProcess.stdin.write(url); // Write the image buffer to Python script's stdin
  // pythonProcess.stdin.end();

  const brandKeywordsJsonFilename = "brand_scraper/cleaned_brand_keywords.json"
  keywordsArray = await readJsonFile(brandKeywordsJsonFilename)

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

  await new Promise(resolve => setTimeout(resolve, 200));

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
  contentButton.style.position = 'absolute';
  contentButton.style.bottom = '20px';
  contentButton.style.right = '20px';
  contentButton.style.width = "320px";
  contentButton.style.height = "50px";
  contentButton.style.fontSize = "20px";
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
  smallTextRow.style.opacity = 1.0;

  await new Promise(resolve => setTimeout(resolve, 600));

  // Creating the brand info row
  const brandHeader = document.createElement('p');
  brandHeader.id = "brand-header";
  brandHeader.textContent = "Your Brand";
  brandHeader.style.marginBottom = "6px";
  brandHeader.style.fontSize = "20px";
  brandHeader.style.color = "#232323"; // off-black color
  brandSection.appendChild(brandHeader);
  
  const brandRow = document.createElement('div');
  brandRow.id = "brand-row";
  brandSection.appendChild(brandRow);
  brandSection.style.opacity = 1.0;

  await new Promise(resolve => setTimeout(resolve, 600));

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
  assetsColumn.style.opacity = 1.0;

  await new Promise(resolve => setTimeout(resolve, 600));
  createImagesWithDelay(imageAssetsRow);

  await new Promise(resolve => setTimeout(resolve, 1800));
  createCirclesWithDelay(colorAssetsRow);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // keywords column
  const keywordsColumn = document.createElement('div');
  keywordsColumn.id = "keywords-column";
  keywordsColumn.style.width = "1000px";
  brandRow.appendChild(keywordsColumn);

  const keywordsHeader = document.createElement('p');
  keywordsHeader.textContent = "Keywords";
  keywordsHeader.style.color = "#232323";
  keywordsHeader.className = "section-header";

  const keywordsContainer = document.createElement('div');
  keywordsContainer.id = 'keywords-container';
  keywordsContainer.style.display = "flex";
  keywordsContainer.style.flexDirection = "column";
  const keywordsField = document.createElement('input');
  keywordsField.id = "keywords-field";
  keywordsField.addEventListener('keydown', function(e) {
    let newTag = keywordsField.value;
    if (e.key === "Enter" || e.key === "Return") {
      createKeywordTag(newTag)
      keywordsField.value = '';
    }
  });
  keywordsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('delete-button')) {
      // Get the parent tag element and remove it
      const tag = target.parentElement;
      tag.remove();
    }
  });
  const keywordsRow = document.createElement('div');
  keywordsRow.id = 'keywords-row';
  keywordsContainer.appendChild(keywordsField);
  keywordsContainer.appendChild(keywordsRow);
  keywordsColumn.appendChild(keywordsHeader);
  keywordsColumn.appendChild(keywordsContainer);
  keywordsColumn.style.opacity = 1.0;

  console.log(keywordsArray)

  await createKeywordTagOnDelay(keywordsArray);

  await new Promise(resolve => setTimeout(resolve, 1200));

  // space for Mat to write row #3
  const campaignHeader = document.createElement('p');
  const campaignInputField = document.createElement('input');
  campaignHeader.textContent = "Campaign Identity";
  campaignHeader.style.fontSize = "20px";
  campaignHeader.style.marginBottom = "6px";
  campaignHeader.style.color = "#232323";
  campaignInputField.style.height = '160px';
  campaignInputField.style.width = '700px';
  
  campaignIdentityRow.appendChild(campaignHeader);
  campaignIdentityRow.appendChild(campaignInputField);
  campaignIdentityRow.style.opacity = 1.0;
  typewriter(randText, campaignInputField);
  await new Promise(resolve => setTimeout(resolve, 1800));
  contentButton.style.opacity = 1.0;
  contentButton.addEventListener('click', function() {
    const overlay = document.createElement('div');
    overlay.id = "overlay";
    const vidContainer = document.createElement('div');
    const video = document.createElement('video');
    video.addEventListener('click', function() {
      video.play();
    });
    video.src = "pixel_test.mp4";
    video.style.width = "600px";
    video.style.height = "300px";
    video.style.position = "absolute";
    const canvas = document.createElement('canvas');
    canvas.style.transform = "translateY(150px)";
    canvas.style.zIndex = "100";
    canvas.style.position = "absolute";
    const colors = distilledColorsArray.slice(2, 5);
    document.body.appendChild(overlay);
    document.body.appendChild(vidContainer);

    // Add event listener for 'play' event
    video.addEventListener('play', function() {
      // Start the animation when the video starts playing
      document.body.appendChild(canvas);
      animate();
    });

    // Get the canvas context
    const ctx = canvas.getContext('2d');

    // Set the canvas dimensions
    canvas.width = 300;
    canvas.height = 200;
    canvas.style.borderRadius = "30px";

    // Define the animation duration and update interval
    const duration = 4000; // Adjust this for speed
    const interval = 10;

    // Define the start and end angles for the sine curve
    const startAngle = 0;
    const endAngle = 720;

    // Calculate the number of frames and the angle increment per frame
    const frames = Math.ceil(duration / interval);
    const angleIncrement = (endAngle - startAngle) / frames;


    function animate() {
      // Clear the canvas
      if (video.ended) {
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate the current angle based on time elapsed
      const elapsed = performance.now();
      const currentAngle = startAngle + ((elapsed / duration) * (endAngle - startAngle));

      // Set the line cap style to round
      ctx.lineCap = 'round';

      // Draw the lines
      for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        const offset = i * 30; // Modify this value to set the vertical offset between the lines

        ctx.beginPath();
        ctx.moveTo(-currentAngle, canvas.height / 2 + offset);

        for (let x = 0; x <= canvas.width; x++) {
          const angle = ((x - currentAngle) / canvas.width) * endAngle;
          const y = 0.1 * Math.sin((angle * Math.PI) / 180) * (canvas.height / 2) + (canvas.height / 2) + offset;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 30;
        ctx.stroke();
      }

      // Repeat the animation until reaching the end angle
      if (currentAngle < endAngle + canvas.width) {
        requestAnimationFrame(animate);
      }
    }
  });
}

async function createKeywordTagOnDelay(arr) {
  for (let i = 0; i < arr.length; i++) {
    const keyword = arr[i];
    await createKeywordTag(keyword);
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

async function createKeywordTag(keyword) {
  const keywordsRow = document.getElementById("keywords-row");
  const keywordsContainer = document.getElementById("keywords-container");
  const tag = document.createElement('span');
  tag.className = 'keyword-tag';
  tag.textContent = keyword;

  // Create the delete button for the tag
  const deleteButton = document.createElement('span');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'x';

  // Append the delete button to the tag
  tag.appendChild(deleteButton);

  // Append the tag to the keywords field
  keywordsRow.appendChild(tag);
}

async function createImagesWithDelay(row) {
  for (let i = 0; i < assetsArray.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const imgAsset = assetsArray[i];
    imgAsset.className = "image-asset";
    imgAsset.style.height = "66px";
    imgAsset.style.borderRadius = "8px";
    imgAsset.style.opacity = 1.0;
    row.appendChild(imgAsset);
  }
  await new Promise((resolve) => setTimeout(resolve, 300));

  // add the upload button here
  const uploadButton = document.createElement('label');
  uploadButton.id = 'upload-picture-button';
  uploadButton.classList.add('upload-button');

  // Create the input element for file upload
  const uploadInput = document.createElement('input');
  uploadInput.id = 'image-upload-input';
  uploadInput.type = 'file';
  uploadInput.accept = 'image/*';
  uploadInput.style.display = 'none';

  // Add event listener to handle file selection
  uploadInput.addEventListener('change', handleFileUpload);

  // Create a span element for the plus symbol
  const plusSymbol = document.createElement('span');
  plusSymbol.id = 'plus-icon-clickable';
  plusSymbol.textContent = '+';

  // Append the plus symbol to the upload button
  uploadButton.appendChild(plusSymbol);
  // Append the upload input to the upload button
  uploadButton.appendChild(uploadInput);

  // Append the upload button to the image assets row
  row.appendChild(uploadButton);
}

function handleFileUpload(event) {
  const uploadButton = document.getElementById('upload-picture-button');
  const row = document.getElementById('image-assets-row');
  const file = event.target.files[0];
  if (file) {
    // Create an image element
    const image = document.createElement('img');

    // Set up a FileReader to read the uploaded file as data URL
    const reader = new FileReader();
    reader.onload = function (e) {
      // Set the source of the image to the data URL
      image.src = e.target.result;
      image.className = "image-asset";
      image.style.height = "66px";
      image.style.borderRadius = "8px";
      image.style.opacity = 1.0;
      // Insert the image before the upload button in the image assets row
      row.insertBefore(image, uploadButton);
    };

    // Read the uploaded file as data URL
    reader.readAsDataURL(file);
  }
}

async function createCirclesWithDelay(row) {
  for (let i = 0; i < distilledColorsArray.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let hoverHex = document.createElement('div');
    let hexAsString = distilledColorsArray[i].toString();
    hoverHex.textContent = hexAsString;
    // hoverHex.style.position = "absolute";
    hoverHex.className = "hex-color";
    // hoverHex.style.color = "#141134";
    // hoverHex.style.transform = 'translate(0, -30px)';
    hoverHex.addEventListener('mouseover', (event) => {
      event.preventDefault();
    });
    hoverHex.addEventListener('mouseout', (event) => {
      event.preventDefault();
    });

    const circle = document.createElement('div');
    circle.classList.add("hex-circle");
    circle.style.backgroundColor = distilledColorsArray[i];

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
    
    row.appendChild(circle);
    circle.style.opacity = 1.0;
  }
  await new Promise(resolve => setTimeout(resolve, 300));

    // Create the add hex color
  const uploadButton = document.createElement('div');
  uploadButton.classList.add('upload-button');
  uploadButton.id = 'hex-color-picker';

  // Create the input element for file upload
  uploadButton.addEventListener("click", () => {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.addEventListener("change", handleColorSelection);
    colorPicker.click();
  });

  // Create a span element for the plus symbol
  const plusSymbol = document.createElement('span');
  plusSymbol.id = 'hex-plus-clickable';
  plusSymbol.textContent = '+';

  // Append the plus symbol to the upload button
  uploadButton.appendChild(plusSymbol);

  // Append the upload button to the image assets row
  row.appendChild(uploadButton);
}

function handleColorSelection(event) {
  const row = document.getElementById('color-assets-row');
  const uploadButton = document.getElementById('hex-color-picker');
  const color = event.target.value;
  const colorCircle = document.createElement("div");
  colorCircle.style.backgroundColor = color;
  colorCircle.classList.add("hex-circle");
  row.insertBefore(colorCircle, uploadButton);
  colorCircle.style.opacity = 1.0;
}