import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Create a new connection pool
let db_name =
  process.env.NODE_ENV === "test" ? "roles_db_test" : process.env.db_name;

// Create a new connection pool
export const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env["db_host"],
  user: process.env["db_user"],
  password: process.env["db_password"],
  database: db_name, // Set the database name here
});

/**
 * DBConnection class
 * Handles the database connection and setup
 */
export class DBConnection {
  /*
   * Connects to the database, creates the database and tables if they don't exist
   */
  static connectDB() {
    return new Promise<void>((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Error connecting to database:", err);
          reject(err);
          return;
        }

        // Create database if it doesn't exist
        connection.query(
          `CREATE DATABASE IF NOT EXISTS ${db_name}`,
          (err, result) => {
            if (err) {
              console.error("Error creating database:", err);
              connection.release();
              reject(err);
              return;
            }

            console.log(`Connected to ${db_name} successfully.`);

            // Use the database
            connection.query(`USE ${db_name}`, (err) => {
              if (err) {
                console.error("Error selecting database:", err);
                connection.release();
                reject(err);
                return;
              }

              // Create user table
              connection.query(
                `CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                firstname VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )`,
                (err) => {
                  if (err) {
                    console.error("Error creating users table:", err);
                  } else {
                    console.log("Users table created");
                  }
                }
              );

              // Create roles table
              connection.query(
                `CREATE TABLE IF NOT EXISTS roles (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                role_title VARCHAR(255) NOT NULL
              )`,
                (err) => {
                  if (err) {
                    console.error("Error creating roles table:", err);
                  } else {
                    console.log("Roles table created");
                  }
                }
              );

              // Create user_roles table
              connection.query(
                `CREATE TABLE IF NOT EXISTS user_roles (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                userid INT,
                roleid INT,
                status VARCHAR(255) NOT NULL,
                date_assigned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (userid) REFERENCES users(id),
                FOREIGN KEY (roleid) REFERENCES roles(id)
              )`,
                (err) => {
                  if (err) {
                    console.error("Error creating user_roles table:", err);
                  } else {
                    console.log("User roles table created");
                  }
                }
              );

              // Release the connection after all queries are executed
              connection.release();
              resolve();
            });
          }
        );
      });
    });
  }

  static destroyDB() {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to database:", err);
        return;
      }

      // Create database if it doesn't exist
      connection.query(`DROP DATABASE IF EXISTS ${db_name}`, (err, result) => {
        if (err) {
          console.error("Error creating database:", err);
          connection.release();
          return;
        }

        console.log(`Database ${db_name} dropped successfully.`);
        connection.release();
      });
    });
  }
}
