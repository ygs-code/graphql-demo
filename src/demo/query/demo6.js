import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
const parameter = {
  id: "123",
  name: "hi hello",
};


// //服务端创建指令 可以用来拦截
// const directiveResolvers = {
//   // 感觉只能做中间件拦截
//   upper: (next, source, {role}, ctx) => {
//     console.log('next==',next)
//     console.log('source==',source)
//     console.log('role==',role)
//     console.log('ctx==',ctx)

//      return next();
//     //  throw new Error(`Must have role: `)
//   },
  
// }

//查询传参
new CheckGraphql({
  // directiveResolvers,
  context:{
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schema: `
  

    type FriendsType{
      name:String
    }

    type User{
      name:String
      friends: FriendsType  
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
    // 前端指令可用来显示或者隐藏接受参数
    schema: `
    query ($id:ID, $withFriends: Boolean!){
      hello(id:$id){
        name
        friends @skip(if: $withFriends) {
          name
        }
      }
    }
       
    `,
     //  @skip(if: Boolean) 如果参数为 true，跳过此字段
      variables: {
        withFriends:false,
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
