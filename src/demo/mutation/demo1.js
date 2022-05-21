/*
 * @Date: 2020-12-30 11:25:45
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 11:11:42
 * @FilePath: /graphql-demo/src/demo/mutation/demo1.js
 * @Description: 
 */
import ValidateGraphql from "../ValidateGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
new ValidateGraphql({
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
      name: String!   
      id: ID!
    }

    extend type Mutation {
      updateUser: User
    }



    
    `,
    resolvers: {
      Mutation: {
        updateUser(root, parameter, source, fieldASTs) {
          console.log("root==", root);
          console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            name: "你 好",
            id: 123,
          };
        },
      },
      Subscription: {},
      Query: {},
    },
  },
  clientSchema: {
    schema: `
    mutation {
      # 没有参数不能写括号
      updateUser{
        id
        name
      }
    }
    `,
    variables: {
      // userId: 123,
      
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
