import CheckGraphql from "../CheckGraphql";
import gql from "graphql-tag";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";

const userFrag = gql`
  fragment UserFrag on User {
    name
    age
  }
`;

// 别名
new CheckGraphql({
  context: {
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schema: `
    type User {
      name: String! #! 为必须      
      address: String
     }
    extend type Query{
      getUser(id:ID):User
      getUserList(id:ID):User
    } 

    extend type Mutation{
      setUser(id:ID):User
    } 
     
    `,
    resolvers: {
      Mutation: {
        setUser: (root, parameter, source, fieldASTs) => {
          const { id } = parameter;
          // console.log("root==", root);
          // console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            name: "zhang san",
            address: "guang xi ",
          };
        },
      },
      Subscription: {},
      Query: {
        getUser: (root, parameter, source, fieldASTs) => {
          const { id } = parameter;
          // console.log("root==", root);
          // console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            name: "zhang san",
            address: "guang xi ",
          };
        },
        getUserList: (root, parameter, source, fieldASTs) => {
          const { id } = parameter;
          // console.log("root==", root);
          // console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            name: "zhang san",
            address: "guang xi ",
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    # 声明片段 User 需要映射服务端的 User   type User
    fragment UserFrag on User {
      name
      address
    }
    #设置默认值
    query($id:ID = "3"){
      getUser(id: 1) {
        ...UserFrag
      }
      getUserList(id: $id ) {
        ...UserFrag
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
