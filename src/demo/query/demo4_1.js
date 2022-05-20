import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
// 别名
new CheckGraphql({
  rootValue: {
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schema: `
    type User {
      msg: String  
    }

    extend type Query {
      getUser(id:ID): User
    }
    `,
    resolvers: {
      Mutation: {},
      Subscription: {},
      Query: {
        getUser: (root, parameter, source, fieldASTs) => {
          const { id } = parameter;
          // console.log("root==", root);
          // console.log("parameter==", parameter);
          const mapData = {
            1: "返回第一个别名参数",
            2: "返回第二个别名参数",
          };
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            msg: mapData[id],
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    query {
      xiaomingUser: getUser(id: 1) {
        msg
      }
      zhansanUser: getUser(id: 2) {
        msg
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
    console.log("error=", chalk.red(error));
  });

export default {};
