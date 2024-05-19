# Telegram Wishlist MiniApp

With [Telegram Wishlist MiniApp](https://t.me/wishboxbot), you can effortlessly create and manage your own wishlist, filled with all the things you desire. Share your wishes with your friends, and they can reserve them for you.

Key Features:
- 📜 Create Wishlist: Organize your wishes into separate lists for different occasions or categories.
- 🔗 Share with Ease: Generate a unique link to your wishlist and share it with friends.
- 🤝 Friends Can Reserve: Your friends can easily reserve the items they want to gift you.
- 🎁 Keep Surprises Alive: Friends can see reserved items, but the final choice remains a surprise.

Try it now: https://t.me/wishboxbot

## Getting started
Backend is required to run the application. [Backend repository](https://github.com/grulex/go-wishlist)

Also, you need install Node.js and npm. [Node.js download page](https://nodejs.org/en/download/)

### Starting MiniApp locally
```bash
# copy default env file
cp .env.example .env
```
You can set unique `TUNNEL_SUBDOMAIN`, because it might conflict with other users of [localtunnel](https://theboroer.github.io/localtunnel-www/).
```dotenv
TUNNEL_SUBDOMAIN=my-unique-wishlist-subdomain
```

Then you can start application:

```bash
# install dependencies
npm install

# start application
npm run dev
```
Application will be available on http://localhost:5173

Also, you can see tunnel url in output
```bash
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
  > Tunnel: https://my-unique-wishlist-subdomain.loca.lt
```
You can use this tunnel url in miniapp settings in BotFather.

### Creating application in [BotFather](https://t.me/BotFather)

As long as technically, Telegram Mini Apps are connected with Telegram bots, 
we should firstly create a Telegram bot. 
To do this, you need to find the father of all bots, the bot BotFather and use the command `/newbot`, 
then go through the proposed process, specifying all the necessary data.
Configure menu buttons for your bot in the bot settings
(`/mybots`-> `your bot name` -> `Bot Settings` -> `Menu Button`)
as url from localtunnel (`https://my-unique-wishlist-subdomain.loca.lt`). 

Also, you need enable **inline mode** (`/mybots`-> `your bot name` -> `Bot Settings` -> `Inline Mode`) 
— it's important for function "**Share**".

When the bot is created, it is required then to use the command `/newapp` 
and again go through the procedure of creating another entity - the Telegram Mini Apps application, 
linking it to the Telegram bot. You can use URL from localtunnel (`https://my-unique-wishlist-subdomain.loca.lt`) as `Web App URL` parameter.
From now on, the created application will be available via a direct link of the form `https://t.me/{mybot}/{miniapp_short_name}`.
Set this url as `TG_MINIAPP_URL` in the `.env` file and restart application — it's important for correct working "share" functions.

More info about Mini Apps here: [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

## Docker image for production

Building image:
```bash
docker build -t telegram-wishlist-frontend .
```

Starting app on port 3001:
```bash
docker run -d --init --restart=always -p 3001:3000 \
    -e BACKEND_HOST='{YOUR_BACKEND_HOST}' \
    -e TG_MINIAPP_URL='{YOUT_TG_MINIAPP_URL}' \
    telegram-wishlist-frontend
```
