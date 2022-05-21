import ValidateGraphql from "../ValidateGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
// const userId=12345;
const parameter = {
  id: 123,
  name: "hi hello",
};
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
      name:String!    
      id: ID! 
    }
    # 不管前端从variables传参还是从函数调用中传参，这里接受参数不会变。
    extend type Mutation {
      updateUser(id:ID, name:String!): User!
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
    mutation {
      updateUser(id:${parameter.id}, name:"${parameter.name}") {
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
