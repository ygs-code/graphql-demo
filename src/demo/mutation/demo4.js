/*
 * @Date: 2022-05-20 12:27:51
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 15:48:23
 * @FilePath: /graphql-demo/src/demo/mutation/demo4.js
 * @Description: 
 */
import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
new CheckGraphql({
  context:{
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
      data:{
        userId: 123456,
        name: "zhang san",
      }

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
