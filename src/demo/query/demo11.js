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
    schemas: [
      `
  # 定义接口    
  interface IUser{
      id:ID!
      name:String!
      address:String!
   }
  # 实现接口
  type User implements IUser {
   id: ID!
   name: String! 
   address:String!
   gender:Int!
 }

 extend type Query {
   getUser: User  
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
            id: "123",
            name: "hello my name is zhang san",
            address: "广东",
            gender:1
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    {
      getUser { 
         id
         name
         address
         gender
      }
    }
    `,
    variables: {},
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
