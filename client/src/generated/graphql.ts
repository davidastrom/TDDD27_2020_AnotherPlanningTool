import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
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
  addBoardMember: Board;
  addList: List;
  addTask: Board;
  addTeamMember: Team;
  assignUser: Task;
  createBoard: Board;
  createTeam: Team;
  moveList: Board;
  moveTask: Board;
  removeBoardMember: Board;
  removeTeamMember: Team;
};


export type MutationAddBoardMemberArgs = {
  boardId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
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


export type MutationRemoveBoardMemberArgs = {
  boardId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
};


export type MutationRemoveTeamMemberArgs = {
  teamId: Scalars['ObjectId'];
  userId: Scalars['ObjectId'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  board: Board;
  currentUser: User;
  team: Team;
  user: User;
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
  picture?: Maybe<Scalars['String']>;
  teams: Array<Team>;
  username: Scalars['String'];
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', _id: string, email: string, username: string, picture?: string | null | undefined, boards: Array<{ __typename?: 'Board', _id: string, name: string }>, teams: Array<{ __typename?: 'Team', _id: string, name: string }> } };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type UserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', _id: string, email: string, username: string, picture?: string | null | undefined, boards: Array<{ __typename?: 'Board', _id: string, name: string }>, teams: Array<{ __typename?: 'Team', _id: string, name: string }> } };

export type CreateBoardMutationVariables = Exact<{
  input: BoardInput;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', createBoard: { __typename?: 'Board', _id: string, name: string } };

export type CreateTeamMutationVariables = Exact<{
  input: TeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', _id: string, name: string } };

export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    _id
    email
    username
    picture
    boards {
      _id
      name
    }
    teams {
      _id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CurrentUserGQL extends Apollo.Query<CurrentUserQuery, CurrentUserQueryVariables> {
    document = CurrentUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UserByIdDocument = gql`
    query userById($id: ObjectId!) {
  user(userId: $id) {
    _id
    email
    username
    picture
    boards {
      _id
      name
    }
    teams {
      _id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UserByIdGQL extends Apollo.Query<UserByIdQuery, UserByIdQueryVariables> {
    document = UserByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateBoardDocument = gql`
    mutation createBoard($input: BoardInput!) {
  createBoard(board: $input) {
    _id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateBoardGQL extends Apollo.Mutation<CreateBoardMutation, CreateBoardMutationVariables> {
    document = CreateBoardDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateTeamDocument = gql`
    mutation createTeam($input: TeamInput!) {
  createTeam(data: $input) {
    _id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateTeamGQL extends Apollo.Mutation<CreateTeamMutation, CreateTeamMutationVariables> {
    document = CreateTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const namedOperations = {
  Query: {
    currentUser: 'currentUser',
    userById: 'userById'
  },
  Mutation: {
    createBoard: 'createBoard',
    createTeam: 'createTeam'
  }
}