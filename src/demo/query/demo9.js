import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
import { GraphQLScalarType } from "graphql";
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
  """
  自定义日期类型
  """
  scalar Date

  #自定义输入类型
  scalar Input

  type Notice {
    content: String!
    """
    消息时间
    """
    noticeTime: Date!
  }
  extend type Query{
    hello(name:Input):Notice
  }
    
    `,
    resolvers: {
      Input: new GraphQLScalarType({
        name: 'Input',
        description: 'Date custom scalar type',
        parseValue(value) {
          console.log('parseValue==')
          console.log('value==',value)
          return '你名字是：'+value // value from the client
        },
        serialize(value) {
          console.log('serialize==',value)
          console.log('serialize==')
          return  '你名字是：'+value
          // return new Date(value) // value sent to the client
        },
        parseLiteral(ast) {
          console.log('parseLiteral==')
          if (ast.kind === Kind.INT) {
             return parseInt(ast.value, 10) // ast value is always in string format
          }
          return null
        }
      }),
      Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
          console.log('parseValue==')
          return new Date(value) // value from the client
        },
        serialize(value) {
          console.log('serialize==',value)
          console.log('serialize==')
          return new Date(value).getTime()
          // return new Date(value) // value sent to the client
        },
        parseLiteral(ast) {
          console.log('parseLiteral==')
          if (ast.kind === Kind.INT) {
             return parseInt(ast.value, 10) // ast value is always in string format
          }
          return null
        }
      }),
      Mutation: {},
      Subscription: {},
      Query: {
        hello(root, parameter, source, fieldASTs) {
          console.log("parameter=", parameter);
          return {
            content: "你好",
            noticeTime:'2020-10-12'
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    query ($name:Input){
      hello(name:$name){
        content
        noticeTime
      }
    }   
    `,
    // 查询传参必须在函数中传参，不可以从variables变量传参
    variables: {
      name: 'zhang san',
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
