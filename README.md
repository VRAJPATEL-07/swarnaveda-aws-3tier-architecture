# SwarnaVeda

Luxury jewellery e-commerce demo (SwarnaVeda).

## Quickstart

1. Install dependencies

```bash
npm install
```

2. Create `.env` from `.env.example` and set `MONGO_URI` (MongoDB Atlas recommended).

3. Run development server

```bash
npm run dev
```

4. Open `http://localhost:5000` in your browser.

## MongoDB Atlas example

Create a cluster on MongoDB Atlas, then create a database user and whitelist your IP. Use a connection string like:

```
mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/swarnaVeda?retryWrites=true&w=majority
```

Set this value as `MONGO_URI` in your `.env`.

## Deploy on AWS EC2 (basic steps)

1. Launch an EC2 instance (Ubuntu 22.04). Open ports 22, 80, 443, 5000.
2. SSH into the instance.
3. Install Node.js, npm, and MongoDB client.
4. Clone this repo.
5. Create `.env` with your MongoDB Atlas URI and `PORT=5000`.
6. Install dependencies: `npm install`.
7. Use a process manager like `pm2` to run `npm start`.
8. Optionally configure Nginx as a reverse proxy for port 80/443.

## Project Structure

```
swarnaVeda/
├── server/
├── frontend/
├── package.json
└── README.md
```
