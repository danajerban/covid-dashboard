# Covid-19 Dashboard

## Project Description

This project is a data dashboard to visualize COVID-19 statistics from different countries all around the world based on a dataset with range dates from 22 Jan, 2020 until 27, Aug 2020. The dashboard will exhibit metrics such as total cases, deaths, recoveries, and daily trends in an interactive and visually appealing manner. Through this project, a blend of data analysis, data manipulation, and interactive visualization is used, including charts and global maps.

### Entities

- **Country**: Holds details about different countries, like country names and ISO codes.
- **COVID-19 Data**: Maintains time-series data of COVID-19 statistics for each country, encompassing the date, total cases, total deaths, total recoveries, and active cases.

### Relationships

- **One-to-Many**: Each country can have multiple entries in the COVID-19 Data collection, representing daily statistics.

## Technology Stack
- React
- Node.js
- Express
- Axios (for API calls)
- JSON Web Tokens (for authentication)
- Postgresql 15 & Prisma ORM
- Chart.js
- Leaflet
- Jest (for testing back-end)
- React Toast (for notifications)
- Docker

## Running this app

### For local run:

1. Clone the repository: `git clone https://github.com/your-repo.git`
2. Navigate to the project directory: `cd covid19-dashboard`
3. Install dependencies: `npm install`
4. Set up the environment variables:
   - Create a `.env` file in the root directory with the following format:

     ```
     DATABASE_URL='POSTGRESQL LOCAL CONNECTION URL'
     JWT_SECRET='YOUR KEY OF CHOICE'
     ```

5. Run Back-End and Seed the Database from the .csv files: `npx prisma migrate dev && npx prisma db seed && npm run start`
6. Open a new terminal and go to client folder: `cd client`
7. Run Front-End: `npm run start`

### For Docker run:

1. Open Docker Desktop app
2. Set up the environment variables:
   - Create a `.env` file in the root directory with the following format:

     ```
     DATABASE_URL='postgresql://covid:covid@db/covid_dashboard?schema=public&connection_limit=5&pool_timeout=120'
     JWT_SECRET='YOUR KEY OF CHOICE'
     ```

3. Run the 3 containers: `docker compose build && docker compose up -d`

### Other:

1. To explore the database: `npx prisma studio`
2. For testing the back-end: `npm run test`

### Screenshots:

![GitHub Image](/screenshots/Choropleth-Map.png)
![GitHub Image](/screenshots/Global-Heatmap.png)
![GitHub Image](/screenshots/Line-Chart.png)
![GitHub Image](/screenshots/Pie-Chart.png)
![GitHub Image](/screenshots/Admin-Panel.png)
![GitHub Image](/screenshots/Login-Register.png)
![GitHub Image](/screenshots/Data-Range-Selectors.png)
![GitHub Image](/screenshots/Tooltips-Zooming.png)
