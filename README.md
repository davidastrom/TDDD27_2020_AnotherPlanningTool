# TDDD27_2021_AnotherPlanningTool

Project from 2020 course to be finished during 2021 course

A Trello-like planning tool made as a part of the course TDDD27 Advanced Web Programming at Linköping University

## Midterm Screencast link

https://liuonline-my.sharepoint.com/:v:/g/personal/davas593_student_liu_se/EREsbXoOz01Gmn6Vw1xjPMAB6UXAHC5mbcTFd3G3yNEeDg?e=zxEzlb

## Functional Specifications

The app will be a project planning tool for teams. The main feature will be a kanban-board similar to Trello. The user will be able to log in with google account, create teams with others, and create projects, either personal or in teams.
The project consists mainly of the kanban-board, which contains lists with items similar to Trello. The items can be dragged and dropped between lists, with changes automatically syncing between users.

### Possible Extensions depending on time

- Tracking changes and creating stats pages, for example showing completed items by time and users.
- Implementing a simple live chat in teams
- More to come...

## Technical Specifications

As one could argue that most major stacks can do most tasks relatively well, the technical specifications are mainly based on personal interests and what technologies and frameworks I want to learn and explore in the project.
The stack is based on a MEAN-stack, but expanded to use Typescript for backend instead of regular JS, and GraphQL instead of REST as Web API.

### Front End

- Angular
  - Apollo Angular - for GraphQL support
  - Graphql codegen - for syncing queries to backend
  - Bootstrap - for coherent style elements

### Back End

- Node.js
  - Express
  - TypeScript - To use strong typing on the backend
  - Apollo Server Express - To set up a GraphQL endpoint to query
  - GraphQL - To set up GraphQL-server
  - TypeGraphQL - Framework to use GraphQL with Typescript.
  - Mongoose - To handle server-db communication
  - TypeGoose - To combine Typescript and Mongoose

### Database

- MongoDB

### Server Client Communication

- GraphQL - Client -> Server requests. GraphQL-subscriptions for Server -> Client communication

### Development Tools

- ~~GitLab CI/CD - Syncs pushes to GitHub and handle automatic tests and build on push~~
- ~~Docker - Runs the application in an isolated environment.~~
- ~~Prettier - For automated code styling~~
