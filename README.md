# Ethereum transaction address

This is test check API for getting Ethereum transaction address with biggest abs value for the last 100 blocks. It creates a background process that runs every 1 minute to get and save transaction from 17583000 block. And return an address with biggest abs value by get request.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [PostgreSQL](https://www.postgresql.org/download/)

## Installing

1. Сlone repo

```
git clone https://github.com/KhanaevaM/eth-tracker
```

2. Install dependencies

```
npm install
```

3. Create .env file with your db settings

DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=postgres
DB_HOST=localhost
DB_PORT=your_port

4. Create migration

```
npx typeorm migration:generate test -d src\data-source\DataSource.ts
npx typeorm migration:create src\migrations\test
```

5. Run locally

```
npm run start
```

6. Request address (using [curl](https://curl.se/) or else)

```
curl http://localhost:3000/balance/top
```

7. Enjoy!
