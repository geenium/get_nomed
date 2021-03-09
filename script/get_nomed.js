document.body.onload = init;

// Sets the username to be the same as channel if it doesn't exist
function init() {
	if (!CONFIG.username) CONFIG.username = CONFIG.channel;
	connectChat();
}

function connectChat() {
	addToPage("Connecting to chat...");

	const socket = new WebSocket("wss://irc-ws.chat.twitch.tv:443");
	const re = new RegExp("^\\u0001ACTION .*\\u0001$");

	// Signs in to chat and joins the channel
	socket.onopen = (() => {
		socket.send(`PASS ${CONFIG.oauth}`);
		socket.send(`NICK ${CONFIG.username}`);
		socket.send(`JOIN #${CONFIG.channel}`);
		socket.send("CAP REQ :twitch.tv/tags");
	});

	socket.onmessage = (event => {
		event.data.split("\r\n").forEach(data => {
			// Messages end with \r\n so the final item in the array will be an empty string
			if (data) {
				// Sends a pong message if the connection is PING-ed
				if (data.startsWith("PING")) socket.send("PONG :tmi.twitch.tv");
				else if (data.startsWith("@")) {
					let parsed = parseMessage(data);
					if (parsed.command == "PRIVMSG" && re.test(parsed.message) && !parsed.allow) {
						socket.send(`PRIVMSG #${CONFIG.channel} :${CONFIG.message.replace("{user}", parsed.user)}`);
						addToPage(`${parsed.user} has been Nomed!`);
					}
				} else {
					// These are general messages without tags
					console.log(data);
					// Checks for the 353 command which is given after joining a chat channel
					if (parseMessage(data, false).command == "353") addToPage(`Successfully joined chat: ${CONFIG.channel}`);
				};
			}
		});
	});

	// Attempts to reconnect to chat if connection is lost
	socket.onclose = (event => {
		if (event.code == 1006) {
			addToPage("Socket closed unexpectedly, attempting reconnect");
			setTimeout(connectChat, 2000);
		}
	});
}

function parseMessage(msg, has_tags=true) {
	let add = 0;
	let parsed = {};
	let split_msg = msg.split(" ");

	if (has_tags) {
		add = 1;
		for (let tag of split_msg[0].substring(1).split(";")) {
			if (tag.startsWith("badges")) {
				let badges = tag.substring(7).split(",");
				parsed.allow = (
					badges.includes("broadcaster/1") ||
					badges.includes("moderator/1") ||
					badges.includes("vip/1")
				);
				break;
			}
		}
	}

	parsed.user = split_msg[0 + add].split("!")[0].substring(1);
	parsed.command = split_msg[1 + add];
	parsed.message = split_msg.slice(3 + add).join(" ").substring(1);

	return parsed;
}

// Adds text to the webpage as a log
function addToPage(text) {
	let p = document.createElement("p");
	p.appendChild(document.createTextNode(text));
	document.body.appendChild(p);
}
