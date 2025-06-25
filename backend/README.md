# Portfolio Backend API

This document provides instructions for setting up and running the backend server for the portfolio website, along with detailed documentation for the API endpoints.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Projects](#projects)
  - [Testimonials](#testimonials)

## Prerequisites
- Node.js and npm
- MongoDB (a local instance or a cloud service like MongoDB Atlas)

## Setup and Installation

1.  **Navigate to the `backend` directory** of the project.

2.  **Create a `.env` file** in the `backend` root. This file is used to store sensitive information like your database connection string. Add your MongoDB URI to this file:
    ```
    MONGO_URI=your_mongodb_connection_string
    ```
    Replace `your_mongodb_connection_string` with your actual MongoDB connection URI.

3.  **Install dependencies** by running the following command in the `backend` directory:
    ```bash
    npm install
    ```

## Running the Server

To start the development server with hot-reloading, run the following command from the `backend` directory:
```bash
nodemon server.js
```
If you do not have `nodemon` installed globally, you can use `node` instead:
```bash
node server.js
```
The server will start and listen for connections on `http://localhost:5000`.

## API Endpoints

All API endpoints are prefixed with `/api`.

---

### Projects

#### 1. Get All Projects
- **Method:** `GET`
- **Endpoint:** `/api/projects`
- **Description:** Retrieves a list of all projects.
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "60c72b2f9b1d8c001f8e4b22",
      "title": "My First Project",
      "description": "This is a description of my first project.",
      "imageUrl": "https://example.com/image.png",
      "projectUrl": "https://example.com/project-live-demo",
      "tags": ["React", "Node.js", "MongoDB"],
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    }
  ]
  ```

#### 2. Add a New Project
- **Method:** `POST`
- **Endpoint:** `/api/projects/add`
- **Description:** Adds a new project to the database.
- **Request Body:**
  ```json
  {
    "title": "New Awesome Project",
    "description": "This project uses the latest technologies to solve a real-world problem.",
    "imageUrl": "https://example.com/image.jpg",
    "projectUrl": "https://github.com/user/repo",
    "tags": ["JavaScript", "API", "MERN"]
  }
  ```
- **Success Response (200 OK):**
  ```json
  "Project added!"
  ```

#### 3. Delete a Project
- **Method:** `DELETE`
- **Endpoint:** `/api/projects/:id`
- **Description:** Deletes a project by its unique ID.
- **URL Parameter:** `id` (The MongoDB `_id` of the project)
- **Success Response (200 OK):**
  ```json
  "Project deleted."
  ```

---

### Testimonials

#### 1. Get All Approved Testimonials
- **Method:** `GET`
- **Endpoint:** `/api/testimonials`
- **Description:** Retrieves a list of all testimonials that have been approved. This is the public-facing endpoint used by the frontend.
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "60c72b2f9b1d8c001f8e4b23",
      "clientName": "Jane Doe",
      "company": "Tech Solutions Inc.",
      "feedback": "A wonderful experience from start to finish.",
      "rating": 5,
      "approved": true,
      "createdAt": "2023-10-27T10:00:00.000Z",
      "updatedAt": "2023-10-27T10:00:00.000Z"
    }
  ]
  ```

#### 2. Get All Testimonials (Admin)
- **Method:** `GET`
- **Endpoint:** `/api/testimonials/all`
- **Description:** Retrieves a list of **all** testimonials, including those awaiting approval. This is intended for admin use.
- **Success Response (200 OK):**
  ```json
  [
    {
      "_id": "60c72b2f9b1d8c001f8e4b24",
      "clientName": "John Smith",
      "company": "Innovate Corp",
      "feedback": "Great work!",
      "rating": 4,
      "approved": false,
      "createdAt": "2023-10-27T11:00:00.000Z",
      "updatedAt": "2023-10-27T11:00:00.000Z"
    }
  ]
  ```

#### 3. Add a New Testimonial
- **Method:** `POST`
- **Endpoint:** `/api/testimonials/add`
- **Description:** Adds a new testimonial to the database. It will be saved as **unapproved** by default.
- **Request Body:**
  ```json
  {
    "clientName": "Alex Ray",
    "company": "Creative Minds LLC",
    "feedback": "The team's dedication and creativity were instrumental.",
    "rating": 5
  }
  ```
- **Success Response (200 OK):**
  ```json
  "Testimonial submitted for approval!"
  ```

#### 4. Approve a Testimonial
- **Method:** `POST`
- **Endpoint:** `/api/testimonials/approve/:id`
- **Description:** Approves a testimonial, making it visible on the public website.
- **URL Parameter:** `id` (The MongoDB `_id` of the testimonial to approve)
- **Success Response (200 OK):**
  ```json
  "Testimonial approved!"
  ```

#### 5. Delete a Testimonial
- **Method:** `DELETE`
- **Endpoint:** `/api/testimonials/:id`
- **Description:** Deletes a testimonial by its unique ID.
- **URL Parameter:** `id` (The MongoDB `_id` of the testimonial)
- **Success Response (200 OK):**
  ```json
  "Testimonial deleted."
  ```
