const http = require("http");
const fs = require("fs");
const path = require("path");

let teams = [
  {
    name: "Chiefs",
    sport: "football",
    location: "Kansas City",
    logo: "https://i.ebayimg.com/images/g/kn4AAOSwbIRZbmlo/s-l500.jpg"
  },
  {
    name: "Royals",
    sport: "baseball",
    location: "Kansas City",
    logo:
      "https://cdn.shopify.com/s/files/1/0394/9549/products/kansas-city-royals-logo-3CD6169129-seeklogo.com.png?v=1607722562"
  }
];

http
  .createServer(function (request, response) {
    console.log("request starting...");

    console.log(request.method); // listens for request methods - get, post, etc.
    // listen for API to be in URL and then will do special thing when we do that
    if (request.method === "POST") {
      console.log("this was a POST");
      let body = "";
      request.on("data", function (data) {
        body += data; // turned data into a string
        // console.log(typeof body); // now have to take this string and turn it into JSON - parse
        teams.push(JSON.parse(body)); // whatever is submitted from form adds it to end of teams array - push method
      });
      request.on("end", function () {
        response.end();
      });
      return;
    }

    console.log(request.method); // listens for request methods - get, post, etc.
    // using Javascript shift method to delete first element
    if (request.method === "DELETE") {
      teams.shift();
      request.on("end", function () {
        response.end();
      });
      return;
    }

    const dirname = path.dirname(request.url); // new variable, dirname, reads directory name from whatever URL is passed to it
    console.log({ dirname });

    if (dirname === "/api") {
      // if directory name = api, we set our content type and write out to page - I can't send JavaScript from server; I have to send up JSON. Stringify turns JS into JSON string
      response.writeHead(200, { "Content-Type": "application/json" });
      response.write(JSON.stringify(teams));
      response.end();
      return; // stops execution of JS, says we're done with this function. It would keep going down code.
    }

    let filePath = "." + request.url;
    if (filePath === "./") filePath = "./index.html";

    const extname = path.extname(filePath);

    let contentType = "text/html"; // switch statement to set content type
    switch (extname) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
      case ".wav":
        contentType = "audio/wav";
        break;
      default:
    }
    console.log(contentType);
    fs.readFile(filePath, function (
      error,
      content // node uses file system API to read files on your computer. Read file at your file path.
    ) {
      if (error) {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end("Error");
      } else {
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });
  })
  .listen(8080);
console.log("Server is running!");
