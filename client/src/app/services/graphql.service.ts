import {gql} from 'apollo-angular';

import { Injectable } from '@angular/core';

export type Maybe<T> = T | null;
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
  name: Scalars['String'];
  team?: Maybe<Team>;
  members: Array<User>;
  lists: Array<List>;
};

export type BoardInput = {
  name: Scalars['String'];
};

/** The List model. Submodel for Board */
export type List = {
  __typename?: 'List';
  _id: Scalars['ID'];
  name: Scalars['String'];
  items: Array<Task>;
};

export type ListInput = {
  name: Scalars['String'];
  boardId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  createBoard: Board;
  addList: List;
  moveList: Board;
  moveTask: Board;
  addTask: Board;
  createTeam: Team;
  addTeamMember: Team;
  removeTeamMember: Team;
  assignUser: Task;
};


export type MutationCreateUserArgs = {
  user: UserInput;
};


export type MutationCreateBoardArgs = {
  teamId?: Maybe<Scalars['ObjectId']>;
  board: BoardInput;
};


export type MutationAddListArgs = {
  list: ListInput;
};


export type MutationMoveListArgs = {
  index: Scalars['Int'];
  listId: Scalars['ObjectId'];
  boardId: Scalars['ObjectId'];
};


export type MutationMoveTaskArgs = {
  index: Scalars['Int'];
  taskId: Scalars['ObjectId'];
  goalListId: Scalars['ObjectId'];
  startListId: Scalars['ObjectId'];
  boardId: Scalars['ObjectId'];
};


export type MutationAddTaskArgs = {
  task: TaskInput;
};


export type MutationCreateTeamArgs = {
  data: TeamInput;
};


export type MutationAddTeamMemberArgs = {
  userId: Scalars['ObjectId'];
  teamId: Scalars['ObjectId'];
};


export type MutationRemoveTeamMemberArgs = {
  userId: Scalars['ObjectId'];
  teamId: Scalars['ObjectId'];
};


export type MutationAssignUserArgs = {
  userId: Scalars['ObjectId'];
  taskId: Scalars['ObjectId'];
  listId: Scalars['ObjectId'];
  boardId: Scalars['ObjectId'];
};


export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  currentUser?: Maybe<User>;
  allUsers: Array<User>;
  board?: Maybe<Board>;
  allBoards: Array<Board>;
  team?: Maybe<Team>;
  allTeams: Array<Team>;
};


export type QueryUserArgs = {
  userId: Scalars['ObjectId'];
};


export type QueryBoardArgs = {
  boardId: Scalars['ObjectId'];
};


export type QueryTeamArgs = {
  teamId: Scalars['ObjectId'];
};

/** The Task model. Submodel of List */
export type Task = {
  __typename?: 'Task';
  _id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  assigned: Array<User>;
};

export type TaskInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  listId: Scalars['ID'];
  boardId: Scalars['ID'];
};

/** The Team model */
export type Team = {
  __typename?: 'Team';
  _id: Scalars['ID'];
  name: Scalars['String'];
  members: Array<User>;
  boards: Array<Board>;
};

export type TeamInput = {
  name: Scalars['String'];
};

/** The User model */
export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  username: Scalars['String'];
  email: Scalars['String'];
  teams: Array<Team>;
  boards: Array<Board>;
};

export type UserInput = {
  email: Scalars['String'];
};

export type GetCurrentUserQueryVariables = {};


export type GetCurrentUserQuery = (
  { __typename?: 'Query' }
  & { currentUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, '_id'>
  )> }
);

export const GetCurrentUserDocument = gql`
    query getCurrentUser {
  currentUser {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCurrentUserGQL extends Apollo.Query<GetCurrentUserQuery, GetCurrentUserQueryVariables> {
    document = GetCurrentUserDocument;
    
  }