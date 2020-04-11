import "reflect-metadata";
import { ApolloServer } from "apollo-server";

import {createConnection} from "typeorm";
import * as TypeORM from "typeorm";
import { Container } from "typedi";
import { buildSchema } from "type-graphql";

import { RecipeResolver } from "./resolvers/recipe-resolver";
import { RateResolver } from "./resolvers/rate-resolver";
import { User } from "./entity/user";
import { seedDatabase } from "./helpers";


export interface Context {
    user: User;
  }
  
TypeORM.useContainer(Container);


async function bootstrap() {
    try {
      // create TypeORM connection
      await createConnection();
  
      // seed database with some data
      const { defaultUser } = await seedDatabase();
  
      // build TypeGraphQL executable schema
      const schema = await buildSchema({
        resolvers: [RecipeResolver, RateResolver],
        container: Container,
      });
  
      // create mocked context
      const context: Context = { user: defaultUser };
  
      // Create GraphQL server
      const server = new ApolloServer({ schema, context });
  
      // Start the server
      const { url } = await server.listen(4000);
      console.log(`Server is running, GraphQL Playground available at ${url}`);
    } catch (err) {
      console.error(err);
    }
  }
  
  bootstrap();
