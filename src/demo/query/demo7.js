/*
 * @Author: your name
 * @Date: 2020-12-30 18:01:15
 * @LastEditTime: 2021-08-18 09:44:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /graphql-demo/src/demo/query/demo7.js
 */
import ValidateGraphql from "../ValidateGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
const parameter = {
  id: "123",
  name: "hi hello",
};


//服务端创建指令
const directiveResolvers = {
  // 感觉只能做中间件拦截
  upper: (next, source, {role}, ctx) => {
    // console.log('next==',next)
    // console.log('source==',source)
    // console.log('role==',role)
    // console.log('ctx==',ctx)
     // 这里可以做字段中间件拦截器
     console.log('这里可以做字段中间件拦截器')
     return next();
    //  throw new Error(`Must have role: `)
  },
  
}

//查询传参
new ValidateGraphql({
  directiveResolvers,
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
      helloc{
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
