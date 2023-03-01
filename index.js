const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceUserHTML = (template, user) => {
	let output = template.replace(/{%IMAGE%}/g, user.image);
	output = output.replace(/{%USERID%}/g, user.id);
	output = output.replace(/{%USERNAME%}/g, user.name);
	output = output.replace(/{%USERACCNAME%}/g, user.username);
	output = output.replace(/{%USEREMAIL%}/g, user.email);
	output = output.replace(/{%USERPHONE%}/g, user.phone);
	output = output.replace(/{%STREET%}/g, user.address.street);
	output = output.replace(/{%SUITE%}/g, user.address.suite);
	output = output.replace(/{%CITY%}/g, user.address.city);
	output = output.replace(/{%ZIPCODE%}/g, user.address.zipcode);
	output = output.replace(/{%COMPANYNAME%}/g, user.company.name);
	output = output.replace(/{%WEBSITE%}/g, user.website);
	return output;
};

const userTemplate = fs.readFileSync(
	`${__dirname}/templates/users.html`,
	"utf-8"
);
const userCard = fs.readFileSync(
	`${__dirname}/templates/user-card.html`,
	"utf-8"
);
const userDetail = fs.readFileSync(
	`${__dirname}/templates/user-detail.html`,
	"utf-8"
);

const apiData = fs.readFileSync(`${__dirname}/api/data.json`, "utf-8");
const jsonData = JSON.parse(apiData);

const server = http.createServer((req, res) => {
	//Getting query path from url
	const { query, pathname } = url.parse(req.url, true);	

	// Home Page
	if (pathname === "/" || pathname === '/users') {
		res.writeHead(200, {
			"Content-type": "text/html",
		});
		const userHtml = jsonData
			.map((el) => replaceUserHTML(userCard, el))
			.join("");
		const cardOutput = userTemplate.replace("{%USERCARD%}", userHtml);
		res.end(cardOutput);
	}
	//User Detail Page
	else if (pathname === "/user-detail") {
		res.writeHead(200, {
			"Content-type": "text/html",
		});
		const userDetailPage = jsonData[query.id];
		const userDetailOutput = replaceUserHTML(userDetail, userDetailPage);
		res.end(userDetailOutput);
	}
	//API
	else if (pathname === "/api") {
		res.writeHead(200, {
			"Content-type": "application/json",
		});
		res.end(apiData);
	}
	//Not Found
	else {
		res.writeHead(404, {
			"Content-type": "text/html",
		});
		res.end("Page not Found");
	}
});

server.listen(9000, "127.0.0.1", () => {
	console.log("Port 9000 is running");
});
