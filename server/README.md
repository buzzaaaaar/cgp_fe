# Content Generator Backend

This is the backend server for the Content Generator platform, providing APIs for content generation, user management, and project organization.

## Features

- User authentication and authorization
- Content generation using OpenAI's GPT-4
- Project and folder management
- SEO tools (meta titles, descriptions, keywords, etc.)
- Social media content generation (Facebook, Instagram, YouTube)
- Content organization and management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- OpenAI API key

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/content-generator
   JWT_SECRET=your_jwt_secret_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- PUT /api/users/password - Update password
- PUT /api/users/subscription - Update subscription
- DELETE /api/users/account - Delete account

### Projects
- POST /api/projects - Create new project
- GET /api/projects/my-projects - Get user's projects
- GET /api/projects/:id - Get project by ID
- PUT /api/projects/:id - Update project
- DELETE /api/projects/:id - Delete project

### Folders
- POST /api/folders - Create new folder
- GET /api/folders/my-folders - Get user's folders
- GET /api/folders/:id - Get folder by ID
- PUT /api/folders/:id - Update folder
- DELETE /api/folders/:id - Delete folder
- POST /api/folders/:id/move-content - Move content to folder

### Content
- POST /api/content/generate - Generate content
- GET /api/content/my-content - Get user's content
- GET /api/content/:id - Get content by ID
- PUT /api/content/:id - Update content
- DELETE /api/content/:id - Delete content

### SEO Tools
- POST /api/seo/meta-title - Generate meta title
- POST /api/seo/meta-description - Generate meta description
- POST /api/seo/keywords - Generate SEO keywords
- POST /api/seo/sub-keywords - Generate sub-keywords
- POST /api/seo/json-ld-faq - Generate JSON-LD FAQ
- POST /api/seo/topical-map - Generate topical map

### Social Media
- POST /api/social/facebook/caption - Generate Facebook caption
- POST /api/social/facebook/hashtags - Generate Facebook hashtags
- POST /api/social/instagram/caption - Generate Instagram caption
- POST /api/social/instagram/hashtags - Generate Instagram hashtags
- POST /api/social/youtube/title - Generate YouTube title
- POST /api/social/youtube/description - Generate YouTube description
- POST /api/social/youtube/tags - Generate YouTube tags
- POST /api/social/youtube/hashtags - Generate YouTube hashtags

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security

- JWT-based authentication
- Password hashing using bcrypt
- Input validation using express-validator
- CORS enabled
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 