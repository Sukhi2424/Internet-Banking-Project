Internet Banking Application - Capstone Project

This project is a full-stack Internet Banking Application developed as a capstone project. It enables customers to perform basic banking transactions online and provides administrators with tools to manage users and view system activity.

Project Overview

This application simulates a modern internet banking platform, allowing users to register, manage accounts, and perform transactions, while administrators oversee user approvals and system reporting.

Features

Customer Features

Registration: New users can register for an account (pending admin approval).

Login: Secure login for approved customers and administrators.

Account Dashboard:

View Account Summary (Savings & Term accounts with balances).

View Mini Statement (last 5 transactions).

Download Full PDF Statement (jsPDF).

Transactions:

Deposit funds.

Withdraw funds (with checks for balance and Term Account restrictions).

Transfer funds between accounts.

Account Management: Open new Term Accounts.

Profile Management: View and update personal details (Name, Email).

Notifications: Professional pop-up alerts for transaction success/failure (SweetAlert2).

Admin Features

Role-Based Access: Separate login and dashboard for administrators.

Analytics Dashboard:

View key statistics (Total Customers, Pending Approvals, Total Deposits, Total Withdrawals) in cards.

Visualize transaction volume with a Bar Chart (Chart.js).

User Approval: View list of pending customer registrations and Approve/Decline them.

User Management: View a list of all registered customers (including total balance) and delete users.

Interest Calculation: Calculate interest due for a specific account ID.

Transaction Reports: Generate transaction reports with advanced filtering by Account ID, Transaction Type, and Date Range.

Technology Stack

Backend:

Java 17

Spring Boot 3.x

Spring Data JPA (Hibernate)

Maven

Database:

MySQL 8.x

Frontend:

React 18.x (using Vite)

JavaScript (ES6+)

Material-UI (MUI) v5 for UI components and styling

React Router v6 for navigation

Axios for API calls

Chart.js & react-chartjs-2 for charts

SweetAlert2 for notifications

jsPDF & jspdf-autotable for PDF generation

Development Tools:

Spring Tool Suite (STS) for backend

Visual Studio Code (VS Code) for frontend

MySQL Workbench for database management

Git & GitHub for version control

Postman (or similar) for API testing

Setup and Running the Application

Prerequisites

Java Development Kit (JDK) 17 or later installed.

Maven installed.

Node.js and npm (or yarn) installed.

MySQL Server installed and running.

Git installed.

Backend Setup

Clone the Repository: git clone <your-backend-repo-url>

Navigate to Directory: cd internet-banking-backend (or your chosen name)

Database Configuration:

Create a MySQL database named ibs_db.

Create a MySQL user named ibs_user with a password (e.g., password).

Grant all privileges on ibs_db to ibs_user.

Update the database URL, username, and password in src/main/resources/application.properties if they differ from the defaults (jdbc:mysql://localhost:3306/ibs_db, ibs_user, password).

Build the Project: mvn clean install

Run the Application: mvn spring-boot:run

Alternatively, import the project into STS and run it as a Spring Boot App.

The backend server will start on http://localhost:8080.

Frontend Setup

Clone the Repository: git clone <your-frontend-repo-url>

Navigate to Directory: cd internet-banking-ui

Install Dependencies: npm install

Run the Development Server: npm run dev

The frontend application will be accessible at http://localhost:5173 (or another port if 5173 is busy).

Admin User Creation

To log in as an admin, you need to create an admin user manually in the database after starting the backend for the first time:

Connect to your ibs_db using MySQL Workbench.

Run the following SQL script:

-- Create the user login record
INSERT INTO users (password) VALUES ('adminpass'); 
-- Create the admin record, automatically linking the user ID
INSERT INTO admins (admin_name, admin_contact, admin_email_id, user_id) 
VALUES ('Main Admin', '9876543210', 'admin@bank.com', LAST_INSERT_ID());


You can now log in using admin@bank.com and adminpass.

Project Structure

Backend (internet-banking): Standard Spring Boot project structure with controllers, services, repositories, models (entities), and DTOs.

Frontend (internet-banking-ui): Standard Vite React project structure. All components and layout files are organized under the src folder.

Developed by Sukhi M

