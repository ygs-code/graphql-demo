import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
new CheckGraphql({
  rootValue:{
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schema: `

    type User {
      name:String!
      id: ID!
    }
    
    extend type Mutation {
      updateUser(userId: ID!, name: String!): User!
    }
    
    `,
    resolvers: {
      Mutation: {
        updateUser(root, parameter, source, fieldASTs) {
          console.log("root==", root);
          console.log("parameter==", parameter);
          return {
            name: "你好",
            id: "123",
          };
        },
      },
      Subscription: {},
      Query: {},
    },
  },
  clientSchema: {
    schema: `
    mutation($userId: ID! $name: String!) {
      updateUser(userId: $userId name: $name) {
        name
        id
      }
    }
    `,
    variables: {
      userId: 123456,
      name: "zhang san",
    },
  },
})
  .init()
  .then((data) => {
    console.log("data==", data);
  })
  .catch((error) => {
    console.log("error=", chalk.red(error));
  });

export default {};
