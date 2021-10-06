import { AuthChecker } from "type-graphql";
import { Context } from '../interfaces/context';

export const graphqlAuthChecker: AuthChecker<Context> = ({ context: { user }}, roles) => {
    return !!user;
}