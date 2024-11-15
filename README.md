# Todo App

A React-based Todo application that allows users to manage tasks efficiently with a clean and modern UI. The app supports user authentication, backend data persistence, task prioritization, and due date tracking.

## Demo

The app is hosted on GitHub Pages:
[https://fssonca.github.io/todoAppFront](https://fssonca.github.io/todoAppFront)

## Features

- **Authentication**: 
  - Users log in via email. A verification code is sent to the user's email to complete the login process, ensuring a secure and simple authentication flow.

- **Task Management**: 
  - Users can manage their tasks by:
    - Adding tasks with a name, description, priority, and an optional due date.
    - Marking tasks as complete or pending.
    - Deleting tasks they no longer need.
  - All tasks are persisted in a backend system, ensuring data consistency and availability across sessions.

- **Task Filtering**: 
  - Users can filter tasks by status:
    - **All**: View all tasks.
    - **Pending**: View only tasks that are not completed.
    - **Completed**: View only tasks that are marked as done.

- **Priority Levels**: 
  - Tasks can be assigned priority levels from `Lowest` to `Highest` to help users focus on what matters most.

- **Backend Integration**: 
  - All task operations (add, complete, and delete) are synchronized with the backend, ensuring that changes are saved and reflected accurately across devices.

- **Responsive Design**: 
  - The app is optimized for desktop and mobile devices, providing a seamless experience regardless of screen size.

- **Secure Data Handling**: 
  - Authentication tokens are securely stored in `localStorage` to maintain session integrity while interacting with the backend APIs.

## Technologies Used

- **Frontend**: React, TypeScript, Redux Toolkit, TailwindCSS
- **Backend**: AWS Lambda, DynamoDB
- **API**: Axios for HTTP requests
- **State Management**: Redux with Thunks for async actions
- **Testing**: Jest, React Testing Library
- **Icons**: SVG-based assets for loading, checkmark, and delete actions.

## Getting Started

### Prerequisites

- Node.js and npm installed locally.
- AWS account configured with DynamoDB tables: `Users` and `Todos`.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fssonca/todoAppFront.git
   cd todoAppFront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```dotenv
   REACT_APP_API_BASE_URL=https://your-api-gateway-endpoint
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Folder Structure

- `src/components`: React components (AddTodo, TodoItem, LoginForm, VerifyEmail, etc.)
- `src/redux`: Redux slices (`todoSlice.ts`, `userSlice.ts`) and store configuration.
- `src/api`: API abstraction layer (`todoApi.ts`).
- `src/assets`: Icons and other static assets.

## API Endpoints

### Base URL
`{API_BASE_URL}`

### Endpoints
- `POST /login`: Sends a verification code to the user's email.
- `POST /verify-email`: Verifies the code and returns an auth token.
- `GET /todos`: Fetches the user's todos.
- `POST /todos`: Creates a new todo.
- `PATCH /todos/{id}`: Updates a todo.
- `DELETE /todos/{id}`: Deletes a todo.


## Tests

Run unit tests:
```bash
npm test
```

## License

This project is licensed under the MIT License.