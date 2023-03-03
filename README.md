# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



## Setup

### Dependencies

- Run `npm install` in project directory. This will install server-related dependencies such as `express`.
- `cd client` and run `npm install`. This will install client dependencies (React).



### Database Prep

- Access the MySQL interface in your terminal by running `mysql -u root -p`
- Create a new database: `create database name_of_database`
- Add a `.env` file to the project folder of this repository containing the MySQL authentication information for MySQL user. For example:

```bash
  DB_HOST=localhost
  DB_USER=root
  DB_NAME=name_of_database
  DB_PASS=YOURPASSWORD
```

- Run `npm run migrate` in the project folder of this repository, in a new terminal window. This will create a table called 'collabs' and a table called 'influencers' in your database.

- The influencer table will only contain the data that is there upon creation in this way, so don't worry if new additions to the collabs table don't show up in the search results for the form. I didn't have the time to change the code so that it would re-create the table upon change.


### Development

- Run `npm start` in project directory to start the Express server on port 5000
- In another terminal, do `cd client` and run `npm start` to start the client in development mode with hot reloading in port 3000.



