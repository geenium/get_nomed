# Get Nomed
Twitch chat bot to stop the /me command

[Download this repository](https://github.com/geenium/get_nomed/archive/main.zip)  
Generate an [Oauth Token](https://twitchapps.com/tmi/) and place this generated token into *config.js* in place of `<oauth>`  
Enter your channel name in *config.js* in place of `<channel>`   

ie: `const CONFIG = {
  'oauth': 'oauth:123abc...',  
  'channel': 'geenium96',  
  'message': '/timeout {user} 60 Using /me'  
}`

`'message'` is what your account that you authorised the OAuth token for will post into chat  
The default is set to a 60 second timeout command  
`{user}` will be replaced with the username of the person who used the /me command

Opening the html page *get_nomed.html* in a browser will start the bot  
Moderators, vips and the broadcaster for the channel will not trigger the bot

If you are using OBS Studio you can use the *get_nomed.html* as a custom dock

___

### OBS Studio Custom Dock

In OBS Studio go to **View** > **Docks** > **Custom Browser Docks...**  
Give the dock a name then set the *URL* to the file location of *get_nomed.html*
> Example: C:\Users\Owner\Desktop\get_nomed\get_nomed.html

The bot will run as long as the browser dock is open
