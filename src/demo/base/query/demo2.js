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
      getUser(id:String!,name:String!): User
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
          return parameter;
          // return {
          //   name: "hello my name is yao guan shou",
          // };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    {
      getUser (id:"${parameter.id}",name:"${parameter.name}") {
         name
         id
      }
    }
    `,
    // 查询传参必须在函数中传参，不可以从variables变量传参
    // variables: {
    //   name:'你好1'
    // },
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
