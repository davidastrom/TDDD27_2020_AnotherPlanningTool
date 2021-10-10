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

export type AssignUserInput = {
  boardId: Scalars['ID'];
  listId: Scalars['ID'];
  taskId: Scalars['ID'];
  userId?: Maybe<Scalars['ID']>;
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
  input: AssignUserInput;
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
  assigned?: Maybe<User>;
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

export type GetBoardQueryVariables = Exact<{
  boardId: Scalars['ObjectId'];
}>;


export type GetBoardQuery = { __typename?: 'Query', board: { __typename?: 'Board', _id: string, name: string, members: Array<{ __typename?: 'User', _id: string, username: string, picture?: string | null | undefined }>, lists: Array<{ __typename?: 'List', _id: string, name: string, items: Array<{ __typename?: 'Task', _id: string, title: string, description?: string | null | undefined, assigned?: { __typename?: 'User', _id: string, username: string, picture?: string | null | undefined } | null | undefined }> }>, team?: { __typename?: 'Team', members: Array<{ __typename?: 'User', _id: string, username: string, picture?: string | null | undefined }> } | null | undefined } };

export type AddTaskMutationVariables = Exact<{
  taskInput: TaskInput;
}>;


export type AddTaskMutation = { __typename?: 'Mutation', addTask: { __typename?: 'Board', _id: string } };

export type AddListMutationVariables = Exact<{
  listInput: ListInput;
}>;


export type AddListMutation = { __typename?: 'Mutation', addList: { __typename?: 'List', _id: string } };

export type AssignUserMutationVariables = Exact<{
  input: AssignUserInput;
}>;


export type AssignUserMutation = { __typename?: 'Mutation', assignUser: { __typename?: 'Task', _id: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', _id: string, email: string, username: string, picture?: string | null | undefined, boards: Array<{ __typename?: 'Board', _id: string, name: string, members: Array<{ __typename?: 'User', _id: string }> }>, teams: Array<{ __typename?: 'Team', _id: string, name: string, members: Array<{ __typename?: 'User', _id: string }> }> } };

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type UserByIdQuery = { __typename?: 'Query', user: { __typename?: 'User', _id: string, email: string, username: string, picture?: string | null | undefined, boards: Array<{ __typename?: 'Board', _id: string, name: string, members: Array<{ __typename?: 'User', _id: string }> }>, teams: Array<{ __typename?: 'Team', _id: string, name: string, members: Array<{ __typename?: 'User', _id: string }> }> } };

export type CreateBoardMutationVariables = Exact<{
  input: BoardInput;
  teamId?: Maybe<Scalars['ObjectId']>;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', createBoard: { __typename?: 'Board', _id: string, name: string } };

export type CreateTeamMutationVariables = Exact<{
  input: TeamInput;
}>;


export type CreateTeamMutation = { __typename?: 'Mutation', createTeam: { __typename?: 'Team', _id: string, name: string } };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', _id: string, username: string }> };

export type GetTeamQueryVariables = Exact<{
  id: Scalars['ObjectId'];
}>;


export type GetTeamQuery = { __typename?: 'Query', team: { __typename?: 'Team', name: string, members: Array<{ __typename?: 'User', _id: string, username: string, picture?: string | null | undefined }>, boards: Array<{ __typename?: 'Board', _id: string, name: string }> } };

export type AddTeamMemberMutationVariables = Exact<{
  userId: Scalars['ObjectId'];
  teamId: Scalars['ObjectId'];
}>;


export type AddTeamMemberMutation = { __typename?: 'Mutation', addTeamMember: { __typename?: 'Team', _id: string } };

export type RemoveTeamMemberMutationVariables = Exact<{
  userId: Scalars['ObjectId'];
  teamId: Scalars['ObjectId'];
}>;


export type RemoveTeamMemberMutation = { __typename?: 'Mutation', removeTeamMember: { __typename?: 'Team', _id: string } };

export const GetBoardDocument = gql`
    query getBoard($boardId: ObjectId!) {
  board(boardId: $boardId) {
    _id
    name
    members {
      _id
      username
      picture
    }
    lists {
      _id
      name
      items {
        _id
        title
        description
        assigned {
          _id
          username
          picture
        }
      }
    }
    team {
      members {
        _id
        username
        picture
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetBoardGQL extends Apollo.Query<GetBoardQuery, GetBoardQueryVariables> {
    document = GetBoardDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddTaskDocument = gql`
    mutation addTask($taskInput: TaskInput!) {
  addTask(task: $taskInput) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddTaskGQL extends Apollo.Mutation<AddTaskMutation, AddTaskMutationVariables> {
    document = AddTaskDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddListDocument = gql`
    mutation addList($listInput: ListInput!) {
  addList(list: $listInput) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddListGQL extends Apollo.Mutation<AddListMutation, AddListMutationVariables> {
    document = AddListDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AssignUserDocument = gql`
    mutation assignUser($input: AssignUserInput!) {
  assignUser(input: $input) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AssignUserGQL extends Apollo.Mutation<AssignUserMutation, AssignUserMutationVariables> {
    document = AssignUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
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
      members {
        _id
      }
    }
    teams {
      _id
      name
      members {
        _id
      }
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
      members {
        _id
      }
    }
    teams {
      _id
      name
      members {
        _id
      }
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
    mutation createBoard($input: BoardInput!, $teamId: ObjectId) {
  createBoard(board: $input, teamId: $teamId) {
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
export const GetAllUsersDocument = gql`
    query getAllUsers {
  allUsers {
    _id
    username
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetAllUsersGQL extends Apollo.Query<GetAllUsersQuery, GetAllUsersQueryVariables> {
    document = GetAllUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetTeamDocument = gql`
    query getTeam($id: ObjectId!) {
  team(teamId: $id) {
    name
    members {
      _id
      username
      picture
    }
    boards {
      _id
      name
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetTeamGQL extends Apollo.Query<GetTeamQuery, GetTeamQueryVariables> {
    document = GetTeamDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AddTeamMemberDocument = gql`
    mutation addTeamMember($userId: ObjectId!, $teamId: ObjectId!) {
  addTeamMember(userId: $userId, teamId: $teamId) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddTeamMemberGQL extends Apollo.Mutation<AddTeamMemberMutation, AddTeamMemberMutationVariables> {
    document = AddTeamMemberDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const RemoveTeamMemberDocument = gql`
    mutation removeTeamMember($userId: ObjectId!, $teamId: ObjectId!) {
  removeTeamMember(userId: $userId, teamId: $teamId) {
    _id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveTeamMemberGQL extends Apollo.Mutation<RemoveTeamMemberMutation, RemoveTeamMemberMutationVariables> {
    document = RemoveTeamMemberDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const namedOperations = {
  Query: {
    getBoard: 'getBoard',
    currentUser: 'currentUser',
    userById: 'userById',
    getAllUsers: 'getAllUsers',
    getTeam: 'getTeam'
  },
  Mutation: {
    addTask: 'addTask',
    addList: 'addList',
    assignUser: 'assignUser',
    createBoard: 'createBoard',
    createTeam: 'createTeam',
    addTeamMember: 'addTeamMember',
    removeTeamMember: 'removeTeamMember'
  }
}