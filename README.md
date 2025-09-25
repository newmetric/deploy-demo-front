# Next.js Deployment App

This project is a Next.js application that allows users to log in, deploy projects from GitHub, and view the status of their deployed projects.

## Features

- **Login Page**: Users can log in by entering their ID.
- **Main Page**: Users can input a GitHub link to deploy projects and view a list of previously deployed projects.
- **Deployment Page**: Displays a list of all deployed projects. Each project can be clicked to view its details.
- **Detail Page**: Shows the status of a specific project and allows for RPC calls.

## Project Structure

```
nextjs-deployment-app
├── src
│   ├── pages
│   │   ├── _app.tsx          # Custom App component
│   │   ├── index.tsx         # Main page for deploying projects
│   │   ├── login.tsx         # Login page for user authentication
│   │   └── deployments
│   │       ├── [id].tsx      # Dynamic route for project details
│   │       └── index.tsx     # List of deployed projects
│   ├── components
│   │   ├── Layout.tsx        # Layout component for consistent structure
│   │   └── ProjectList.tsx    # Component to render list of projects
│   ├── lib
│   │   └── mockApi.ts        # Mock API functions for user and project data
│   └── styles
│       └── globals.css       # Global CSS styles
├── package.json               # npm configuration file
├── tsconfig.json              # TypeScript configuration file
└── README.md                  # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd nextjs-deployment-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage Guidelines

- Navigate to the login page to authenticate.
- After logging in, you can deploy projects by entering a GitHub link on the main page.
- View your deployed projects on the deployment page and click on any project to see its details.

## Contributing

Feel free to submit issues or pull requests for any improvements or features you would like to see!