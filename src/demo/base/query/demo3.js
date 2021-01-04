import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
const parameter = {
  id: "123",
  name: "hi hello",
};
//查询传参
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
       id: ID!
       name: String!
     }

     extend type Query {
      getUser(userId:ID!,name:String!): User
    }

   
    `,
    resolvers: {
      Mutation: {},
      Subscription: {},
      Query: {
        getUser: (root, parameter, source, fieldASTs) => {
          console.log("root==", root);
          console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            id: 123,
            ...parameter,
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    query($userId: ID! $name: String!) {
      getUser(userId: $userId name: $name) {
        name
        id
      }
    }
    `,
    // 查询传参必须在函数中传参，不可以从variables变量传参
    variables: {
      userId: 12345,
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
