import { gql } from 'apollo-angular';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Mongo object id scalar type */
  ObjectId: any;
};

/** The Board model */
export type Board = {
  __typename?: 'Board';
  _id: Scalars['ID'];
  lists: Array<List>;
  members: Array<User>;
  name: Scalars['String'];
  team?: Maybe<Team>;
};

export type BoardInput = {
  name: Scalars['String'];
};

/** The List model. Submodel for Board */
export type List = {
  __typename?: 'List';
  _id: Scalars['ID'];
  items: Array<Task>;
  name: Scalars['String'];
};

export type ListInput = {
  boardId: Scalars['ID'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addList: List;
  addTask: Board;
  addTeamMember: Team;
  assignUser: Task;
  createBoard: Board;
  createTeam: Team;
  createUser: User;
  moveList: Board;
  moveTask: Board;
  removeTeamMember: Team;
};


export type MutationAddListArgs = {
  list: ListInput;
};


export type MutationAddTaskArgs = {
  task: TaskInput;
};


export type MutationAddTeamMemberArgs = {
  teamId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
};


export type MutationAssignUserArgs = {
  boardId: Scalars['ObjectId'];
  listId: Scalars['ObjectId'];
  taskId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
};


export type MutationCreateBoardArgs = {
  board: BoardInput;
  teamId?: Maybe<Scalars['ObjectId']>;
};


export type MutationCreateTeamArgs = {
  data: TeamInput;
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationMoveListArgs = {
  boardId: Scalars['ObjectId'];
  index: Scalars['Int'];
  listId: Scalars['ObjectId'];
};


export type MutationMoveTaskArgs = {
  boardId: Scalars['ObjectId'];
  goalListId: Scalars['ObjectId'];
  index: Scalars['Int'];
  startListId: Scalars['ObjectId'];
  taskId: Scalars['ObjectId'];
};


export type MutationRemoveTeamMemberArgs = {
  teamId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
};

export type Query = {
  __typename?: 'Query';
  allBoards: Array<Board>;
  allTeams: Array<Team>;
  allUsers: Array<User>;
  board?: Maybe<Board>;
  currentUser?: Maybe<User>;
  team?: Maybe<Team>;
  user?: Maybe<User>;
};


export type QueryBoardArgs = {
  boardId: Scalars['ObjectId'];
};


export type QueryTeamArgs = {
  teamId: Scalars['ObjectId'];
};


export type QueryUserArgs = {
  userId: Scalars['ObjectId'];
};

/** The Task model. Submodel of List */
export type Task = {
  __typename?: 'Task';
  _id: Scalars['ID'];
  assigned: Array<User>;
  description?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type TaskInput = {
  boardId: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  listId: Scalars['ID'];
  title: Scalars['String'];
};

/** The Team model */
export type Team = {
  __typename?: 'Team';
  _id: Scalars['ID'];
  boards: Array<Board>;
  members: Array<User>;
  name: Scalars['String'];
};

export type TeamInput = {
  name: Scalars['String'];
};

/** The User model */
export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  boards: Array<Board>;
  email: Scalars['String'];
  teams: Array<Team>;
  username: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
};
