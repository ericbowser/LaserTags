## backend-laser

A Node.js back-end for LaserTags. This backend provides the API and data management for the LaserTags application.

## Description

This Node.js backend application serves as the core data and logic layer for the LaserTags project. It handles user authentication, contact management, and integrates with external services like OpenAI and Anthropic for AI-powered features. It also provides endpoints for image and URL data processing.

## Key Features

*   **User Authentication:** Secure user login and authentication.
*   **Contact Management:** Create, retrieve, and update contact information.
*   **AI Integration:**
    *   Integrates with OpenAI's API for chat completions.
    *   Integrates with Anthropic's API for Claude prompts.
*   **Data Processing:**
    *   Handles image data.
    *   Handles URL data.
*   **API Endpoints:** Provides a RESTful API for the LaserTags frontend to interact with.
* **Logging**: Uses `assistLog` to log information.

## Installation

**Clone the repository:**

git clone `this`

**Install dependencies:**

npm audit fix
npm install
--check for template.lodash vulnerability

## Environment Variables

The application requires 

the following environment variables. Create a `.env` file in the root directory of the project and add the following:

PORT=32638 
NODE_ENV=development 
HOST=127.0.0.1

OpenAI API Key
OPENAI_API_KEY=<your-openai-api-key>

Anthropic API Key

ANTHROPIC_API_KEY=<your-anthropic-api-key> 
CLAUDE_MODEL=<your-claude-model> 
CLAUDE_MESSAGES_URL=<your-claude-messages-url>

Auth0 Credentials

Other

GMAIL_APP_PASSWORD=<your-gmail-app-password> 
ASSIST_EMAIL_URL=http://127.0.0.1:32638/sendEmail 
ASSIST_CONTACT_URL=http://localhost:32638/getContact 
LASER_BACKEND_BASE_URL=http://localhost:32638 
SAVE_LASER_TAGS_URL=http://localhost:32638/saveLaserTag 
SENTRY_AUTH_TOKEN=<your-sentry-auth-token>


    This will start the server in development mode.

2.  **API Endpoints:**

    *   **`POST /login`:** Logs in a user.
    *   **`GET /getContact/{userid}`:** Gets a contact by user ID.
    *   **`POST /saveContact`:** Saves a new contact.
    *   **`POST /updateContact`:** Updates an existing contact.
    *   **`POST /askClaude`:** Sends a prompt to the Claude API.
    *   **`POST /askChat`:** Sends a prompt to the Chat API.
    *   **`POST /postImage`:** Sends an image to the API.
    *   **`POST /postUrlData`:** Sends URL data to the API.

## Contributing

If