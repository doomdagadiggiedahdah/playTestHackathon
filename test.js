fetch(`https://besticon-demo.herokuapp.com/allicons.json?url=redbull.com`).then(async (icon_json) => {
  try {
    const data = await icon_json.json();
    console.log(data);
  } catch (error) {
    icon_url = '../images/default_favicon.png';
  }
});

async function fetchAsync (url) {
  let response = await fetch(url, { credentials: "include" });
  console.log(response)
  let data = await response.json();
  console.log(data)
  return data;
}