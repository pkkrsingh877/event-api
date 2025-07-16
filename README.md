# Event Management API

This is a RESTful API for managing events and user registrations, built with Node.js, Express, and PostgreSQL. It demonstrates robust backend development practices, including business logic implementation, data validation, and handling of concurrent requests.

## Features

-   **Event Management**: Create and view events with details like title, date, location, and capacity.
-   **User Management**: Create users with a name and unique email.
-   **Registration System**: Users can register for and cancel their registration for events.
-   **Business Logic**: Enforces rules such as event capacity, no duplicate registrations, and no registration for past events.
-   **Custom Sorting**: Lists upcoming events sorted first by date and then by location.
-   **Concurrency Handling**: Safely handles simultaneous registrations for the same event using database transactions.
-   **Data Validation**: All inputs are properly validated.

---

## 🛠️ Setup and Installation

### Prerequisites

-   Node.js (v16 or higher)
-   PostgreSQL

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd event-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Database

1.  Start your PostgreSQL server.
2.  Create a new database. You can use a GUI like pgAdmin or the `psql` command line:

    ```sql
    CREATE DATABASE your_database_name;
    ```

3.  Connect to your new database and run the schema setup script to create the necessary tables:

    ```bash
    psql -U your_postgres_user -d your_database_name -f db-setup.sql
    ```

### 4. Configure Environment Variables

Create a `.env` file in the root of the project and add your database credentials. You can copy the example file:

```bash
cp .env.example .env
```

Now, edit the `.env` file with your specific configuration:

```env
# Application Port
PORT=3000

# PostgreSQL Database Connection
DB_USER=your_postgres_user
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

### 5. Start the Server

You can run the server in two modes:

-   **Production mode:**
    ```bash
    npm start
    ```
-   **Development mode** (with `nodemon` for auto-reloading):
    ```bash
    npm run dev
    ```

The API will be running at `http://localhost:3000`.

---

## 🚀 API Endpoints

**Note:** For a complete test, you should first create a few users and events. You will need their generated `id`s for registration calls.

### User Management

#### Create a User

-   **Endpoint**: `POST /api/users`
-   **Description**: Creates a new user.
-   **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```
-   **Success Response (201)**:
    ```json
    {
      "id": "a1b2c3d4-e5f6-...",
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

---

### Event Management

#### Create an Event

-   **Endpoint**: `POST /api/events`
-   **Description**: Creates a new event.
-   **Request Body**:
    ```json
    {
      "title": "Annual Tech Summit",
      "date": "2025-08-15T09:00:00Z",
      "location": "Metropolis Grand Hall",
      "capacity": 750
    }
    ```
-   **Success Response (201)**:
    ```json
    {
      "message": "Event created successfully",
      "eventId": "f1e2d3c4-b5a6-..."
    }
    ```

#### Get Event Details

-   **Endpoint**: `GET /api/events/:id`
-   **Description**: Retrieves full details for a single event, including a list of registered users.
-   **Success Response (200)**:
    ```json
    {
        "id": "f1e2d3c4-b5a6-...",
        "title": "Annual Tech Summit",
        "date": "2025-08-15T09:00:00.000Z",
        "location": "Metropolis Grand Hall",
        "capacity": 750,
        "registrations": [
            {
                "id": "a1b2c3d4-e5f6-...",
                "name": "John Doe",
                "email": "john.doe@example.com"
            }
        ]
    }
    ```

#### List Upcoming Events

-   **Endpoint**: `GET /api/events/upcoming`
-   **Description**: Returns a list of all future events, sorted by date (ascending) and then location (alphabetical).
-   **Success Response (200)**:
    ```json
    [
        {
            "id": "...",
            "title": "Art & Design Workshop",
            "date": "2024-09-25T14:00:00.000Z",
            "location": "Community Hall",
            "capacity": 100
        },
        {
            "id": "...",
            "title": "Tech Conference 2024",
            "date": "2024-10-20T09:00:00.000Z",
            "location": "Convention Center",
            "capacity": 500
        }
    ]
    ```

#### Get Event Statistics

-   **Endpoint**: `GET /api/events/:id/stats`
-   **Description**: Returns key statistics for an event.
-   **Success Response (200)**:
    ```json
    {
        "totalRegistrations": 150,
        "remainingCapacity": 600,
        "capacityUsedPercentage": "20.00%"
    }
    ```

---

### Registration Management

#### Register for an Event

-   **Endpoint**: `POST /api/events/:id/register`
-   **Description**: Registers a user for a specific event.
-   **Request Body**:
    ```json
    {
      "userId": "a1b2c3d4-e5f6-..."
    }
    ```
-   **Success Response (201)**:
    ```json
    {
      "message": "Successfully registered for the event"
    }
    ```
-   **Failure Responses**:
    -   `400 Bad Request`: Event is full or in the past.
    -   `404 Not Found`: Event or user does not exist.
    -   `409 Conflict`: User is already registered for the event.

#### Cancel a Registration

-   **Endpoint**: `DELETE /api/events/:id/register`
-   **Description**: Cancels a user's registration for an event.
-   **Request Body**:
    ```json
    {
      "userId": "a1b2c3d4-e5f6-..."
    }
    ```
-   **Success Response (200)**:
    ```json
    {
      "message": "Registration cancelled successfully"
    }
    ```
-   **Failure Response (404 Not Found)**: If the user was not registered for the event.

### API Test Results

```
GET http://127.0.0.1:3000/api/events/upcoming: {
  "Network": {
    "addresses": {
      "local": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 62938
      },
      "remote": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 3000
      }
    }
  },
  "Request Headers": {
    "user-agent": "PostmanRuntime/7.44.1",
    "accept": "*/*",
    "postman-token": "d0eac2c5-7e3c-4cfe-a13a-b508da27a2d7",
    "host": "127.0.0.1:3000",
    "accept-encoding": "gzip, deflate, br",
    "connection": "keep-alive"
  },
  "Request Body": "",
  "Response Headers": {
    "x-powered-by": "Express",
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8",
    "content-length": "166",
    "etag": "W/\"a6-TlthbpYkRL3M8AlUJIde/Swmjks\"",
    "date": "Wed, 16 Jul 2025 02:45:47 GMT",
    "connection": "keep-alive",
    "keep-alive": "timeout=5"
  },
  "Response Body": "[{\"id\":\"5881e488-5362-45da-a1ed-22b9b3e2de0b\",\"title\":\"Developer Conference 2025\",\"date\":\"2025-09-20T10:00:00.000Z\",\"location\":\"Tech Park Auditorium\",\"capacity\":300}]"
}
GET http://127.0.0.1:3000/api/users: {
  "Network": {
    "addresses": {
      "local": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 62941
      },
      "remote": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 3000
      }
    }
  },
  "Request Headers": {
    "user-agent": "PostmanRuntime/7.44.1",
    "accept": "*/*",
    "postman-token": "e7432bc4-fbd5-4358-9ccd-95d33baf03bf",
    "host": "127.0.0.1:3000",
    "accept-encoding": "gzip, deflate, br",
    "connection": "keep-alive"
  },
  "Request Body": "",
  "Response Headers": {
    "x-powered-by": "Express",
    "access-control-allow-origin": "*",
    "content-security-policy": "default-src 'none'",
    "x-content-type-options": "nosniff",
    "content-type": "text/html; charset=utf-8",
    "content-length": "148",
    "date": "Wed, 16 Jul 2025 02:46:10 GMT",
    "connection": "keep-alive",
    "keep-alive": "timeout=5"
  },
  "Response Body": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /api/users</pre>\n</body>\n</html>\n"
}
POST http://127.0.0.1:3000/api/users: {
  "Network": {
    "addresses": {
      "local": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 62946
      },
      "remote": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 3000
      }
    }
  },
  "Request Headers": {
    "content-type": "application/json",
    "user-agent": "PostmanRuntime/7.44.1",
    "accept": "*/*",
    "postman-token": "20eea09c-9aa5-4ecf-8bd4-cbb182148170",
    "host": "127.0.0.1:3000",
    "accept-encoding": "gzip, deflate, br",
    "connection": "keep-alive",
    "content-length": "71"
  },
  "Request Body": "{\r\n    \"name\": \"Prabhat Kumar\",\r\n    \"email\": \"prabhatdie@gmail.com\"\r\n}",
  "Response Headers": {
    "x-powered-by": "Express",
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8",
    "content-length": "99",
    "etag": "W/\"63-C2dFL42Ya+ydnCdUlyPaIqH0MQ0\"",
    "date": "Wed, 16 Jul 2025 02:47:09 GMT",
    "connection": "keep-alive",
    "keep-alive": "timeout=5"
  },
  "Response Body": "{\"id\":\"ea27d9af-cd3c-4408-ad02-7f72398220e0\",\"name\":\"Prabhat Kumar\",\"email\":\"prabhatdie@gmail.com\"}"
}
POST http://127.0.0.1:3000/api/events/5881e488-5362-45da-a1ed-22b9b3e2de0b/register: {
  "Network": {
    "addresses": {
      "local": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 62973
      },
      "remote": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 3000
      }
    }
  },
  "Request Headers": {
    "content-type": "application/json",
    "user-agent": "PostmanRuntime/7.44.1",
    "accept": "*/*",
    "postman-token": "057d72c5-e2c3-47a4-aff7-c735fba47cfb",
    "host": "127.0.0.1:3000",
    "accept-encoding": "gzip, deflate, br",
    "connection": "keep-alive",
    "content-length": "58"
  },
  "Request Body": "{\r\n    \"userId\": \"ea27d9af-cd3c-4408-ad02-7f72398220e0\"\r\n}",
  "Response Headers": {
    "x-powered-by": "Express",
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8",
    "content-length": "51",
    "etag": "W/\"33-/xSRX/NY0NxmcFxtq2RA11en7z8\"",
    "date": "Wed, 16 Jul 2025 02:48:38 GMT",
    "connection": "keep-alive",
    "keep-alive": "timeout=5"
  },
  "Response Body": "{\"message\":\"Successfully registered for the event\"}"
}
GET http://127.0.0.1:3000/api/events/5881e488-5362-45da-a1ed-22b9b3e2de0b/: {
  "Network": {
    "addresses": {
      "local": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 62977
      },
      "remote": {
        "address": "127.0.0.1",
        "family": "IPv4",
        "port": 3000
      }
    }
  },
  "Request Headers": {
    "user-agent": "PostmanRuntime/7.44.1",
    "accept": "*/*",
    "postman-token": "52094f49-73eb-4549-9d00-e67314dd679d",
    "host": "127.0.0.1:3000",
    "accept-encoding": "gzip, deflate, br",
    "connection": "keep-alive"
  },
  "Request Body": "",
  "Response Headers": {
    "x-powered-by": "Express",
    "access-control-allow-origin": "*",
    "content-type": "application/json; charset=utf-8",
    "content-length": "282",
    "etag": "W/\"11a-zExPY/pzEbO9FlrEne5XbWNE134\"",
    "date": "Wed, 16 Jul 2025 02:49:05 GMT",
    "connection": "keep-alive",
    "keep-alive": "timeout=5"
  },
  "Response Body": "{\"id\":\"5881e488-5362-45da-a1ed-22b9b3e2de0b\",\"title\":\"Developer Conference 2025\",\"date\":\"2025-09-20T10:00:00.000Z\",\"location\":\"Tech Park Auditorium\",\"capacity\":300,\"registrations\":[{\"id\":\"ea27d9af-cd3c-4408-ad02-7f72398220e0\",\"name\":\"Prabhat Kumar\",\"email\":\"prabhatdie@gmail.com\"}]}"
}
```