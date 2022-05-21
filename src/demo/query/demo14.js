/*
 * @Author: your name
 * @Date: 2020-12-31 13:39:27
 * @LastEditTime: 2021-08-13 11:15:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /graphql-demo/src/demo/query/demo14.js
 */
import ValidateGraphql from "../ValidateGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
new ValidateGraphql({
  rootValue: {
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    //输入类型
    schemas: [
      `#定义输入类型
      input UserInput {
        account: String!
        password: String!
      }
      `,
      `
       type User{
          id : ID!
          email : String!
          name : String!
          phone: String!
        }

        extend type Query {
          getUser(user:UserInput!):User
        }
     `,
    ],
    schema: ` `,
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
            id: 1,
            email: "281113270@qq.com",
            name: "张三",
            phone: "18529531779",
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    query($user:UserInput!){
      getUser(user:$user){
        id 
        email 
        name 
        phone 
      }
    }
    `,
    variables: {
      user: {
        account: "abc",
        password: "123456",
      },
    },
  },
})
  .init()
  .then((data) => {
    console.log("data==", data);
  })
  .catch((error) => {
    // console.log("error=", chalk.red(error));
  });

export default {};
