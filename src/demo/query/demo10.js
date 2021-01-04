import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
import { GraphQLEnumType } from "graphql";
import { Kind } from "graphql/language";

const parameter = {
  id: "123",
  name: "hi hello",
};

 

//查询传参
new CheckGraphql({
  // directiveResolvers,
  context: {
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schema: `
    enum Gender {
      MALE
      FEMALE
      NONE
    }
    
    type User {
      name: String!
      gender: Gender!
      tags: [String!]!
    }

   extend type Query{
      #"查询所有用户列表"
      users: [User!]!
      #"根据 name 查询对应的用户信息"
      user(name: String!): User!
   }
    `,
    resolvers: {
      Mutation: {},
      Subscription: {},
      Query: {
        users: (root, parameter, source, fieldASTs) => {
          return [
            { name: "Jack", gender: "MALE", tags: ["Alibaba", "teng xun "] },
          ];
        },
        user: (root, parameter, source, fieldASTs) => {
          const { name } = parameter;
          return { name, gender: "NONE", tags: ["Alibaba"] };
        },
      },
    },
  },
  clientSchema: {
    schema: `
       #给默认值 你好
      query ($name:String!="你好"){
        users {
          name
          gender
          tags
        }
        # 或者这样给默认值也行  user(name:"你好")
        user(name:$name){
          name
          gender
          tags
        }
      }
    `,
    // 查询传参必须在函数中传参，不可以从variables变量传参
    // variables: {
    //   name: 'zhang san',
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
