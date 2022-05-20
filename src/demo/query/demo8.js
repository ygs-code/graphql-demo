import CheckGraphql from "../CheckGraphql";
// import gql from "graphql-tag";
import { ApolloServer, gql, SchemaDirectiveVisitor } from "apollo-server";
import {
  graphql,
  Source,
  validateSchema,
  parse,
  validate,
  execute,
  formatError,
  getOperationAST,
  specifiedRules,
  buildSchema,
  defaultFieldResolver,
} from "graphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";

const parameter = {
  id: "123",
  name: "hi hello",
};


// 2. Directive 實作
// //服务端创建指令
class UpperCaseDirective extends SchemaDirectiveVisitor {
  // 2-1. ovveride field Definition 的實作
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    // 2-2. 更改 field 的 resolve function
    field.resolve = async function(...args) {
      // 2-3. 取得原先 field resolver 的計算結果 (因為 field resolver 傳回來的有可能是 promise 故使用 await)
      const result = await resolve.apply(this, args);
      // 2-4. 將得到的結果再做預期的計算 (toUpperCase)
      if (typeof result === 'string') {
        return result.toUpperCase();
      }
      console.log('result======',result)
      // 2-5. 回傳最終值 (給前端)
      return result;
    };
  }
}

//查询传参
new CheckGraphql({
  schemaDirectives:{
    upper: UpperCaseDirective
  },
  rootValue:{
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schema: `
    directive @upper on FIELD_DEFINITION

    type FriendsType{
      name:String
    }

 

    type User{
      name:String
      friends: FriendsType @upper
      ids:[String]!
 
    }
    extend  type Query {
      hello(id:ID): User   
    }
    
    `,
    resolvers: {
      Mutation: {
      },
      Subscription: {},
      Query: {
        hello(root, parameter, source, fieldASTs){
          console.log('parameter=',parameter)
          return  {
            name:'你好',
            ids:['1','2','3'],
            friends:{
              name:'friends name'
            }
          }
        }
    
      },
    },
  },
  clientSchema: {
    schema: `
    query ($id:ID){
      hello(id:$id){
         ids
         name
         friends  {
          name
        }
      }
    }
       
    `,
    // 查询传参必须在函数中传参，不可以从variables变量传参
      variables: {
        // withFriends:true,
        id:123
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
