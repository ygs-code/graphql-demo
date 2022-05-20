GraphQL 教程

## 中文文档

https://graphql.cn/learn

## 英文文档

http://spec.graphql.org/

### 其他参考文档

- [Facebook GraphQL Specification: Type-System.Directives](https://links.jianshu.com/go?to=https%3A%2F%2Ffacebook.github.io%2Fgraphql%2FJune2018%2F%23sec-Type-System.Directives)
- [Apollo Draft specification for GraphQL Schema Decorators](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fapollographql%2Fgraphql-tools%2Fblob%2Fmaster%2Fdesigns%2Fgraphql-decorator-spec.md)
- [The power of GraphQL directives](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.callstack.io%2Fthe-power-of-graphql-directives-81f4987fd76d)
- **[Apollo - Resuable GraphQL schema directives](https://links.jianshu.com/go?to=https%3A%2F%2Fblog.apollographql.com%2Freusable-graphql-schema-directives-131fb3a177d1)**
- [Prisma: GraphQL Directive Permissions — Authorization Made Easy](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.prisma.io%2Fblog%2Fgraphql-directive-permissions-authorization-made-easy-54c076b5368e%2F)
- [Apollo - Schema Directives](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.apollographql.com%2Fdocs%2Fgraphql-tools%2Fschema-directives.html%23What-about-directiveResolvers)
- [Apollo - directiveResolvers](https://links.jianshu.com/go?to=https%3A%2F%2Fwww.apollographql.com%2Fdocs%2Fgraphql-tools%2Fdirective-resolvers.html)
- [Issue - graphql-constraint-directive](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fconfuser%2Fgraphql-constraint-directive%2Fissues%2F2)
- https://blog.csdn.net/zhulin2609/article/details/71439542
- https://spec.graphql.cn/
- https://www.jianshu.com/p/3cc79d1f1394
- https://www.graphql-modules.com/

## Java 使用例子

https://www.cnblogs.com/llsj/p/13462133.html



## GraphQL 主要组成部分：

### 客户端 Schema

   客户端 Schema 由查询的字段和方法名称，还有参数variables组成

### 服务器Schema

服务器Schema 由  type 和resolve 组成，其中type就是Schema中数据类型，

resolve就是响应的回调函数



GraphQL对数据支持的操作有：

- 查询（Query）：获取数据的基本查询。
- 变更（Mutation）：支持对数据的增删改等操作。
- 订阅（Subscription）：用于监听数据变动、并靠websocket等协议推送变动的消息给对方。

![图片](https://s4.51cto.com/images/blog/202012/17/bfab7e2a2b9b91f346b1cd2244ad6a33.gif)





Rest接口

- GET  /api/v1/articles/
- GET /api/v1/article/:id/
- POST /api/v1/article/
- DELETE /api/v1/article/:id/
- PATCH /api/v1/article/:id/

GraphQL Query

- 

  ```swift
  query  {
    articles():[Article!]!
    article(id: Int!): Article!
  }
  ```

- 

  ```swift
  mutation {
    createArticle(): Article!
    updateArticle(id: Int): Article!
    deleteArticle(id: Int): Article!
  }
  ```

#### Resolve

上述的描述并未说明如何返回相关操作（query、mut tion、subscription）的数据逻辑。所有此处引入一个更核心的概念**Resolve(解析函数)**

  



旧版本GraphQLSchema与新版本buildSchema差异

## buildSchema和GraphQLSchema之间的差异

## buildSchema ? GraphQLSchema ?

??通过不同版本中的示例，来了解其中的差异：

#### buildSchema 新版版 GraphQL

```java
const { graphql, buildSchema } = require('graphql');
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);
const root = { hello: () => 'Hello world!' };
graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});
12345678910
```

#### GraphQLSchema 旧版本 对象形式

```java
const { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello world!'
      }
    })
  })
});
graphql(schema, '{ hello }').then((response) => {
  console.log(response);
});
123456789101112131415
```

⬇️⬇️
buildSchema函数采用`SDL`（模式定义语言）的架构，并返回一个GraphQLSchema对象。

`buildSchema通常不建议使用，因为它会严重限制架构的功能`。

使用buildSchema以下内容生成的架构：

- 无法为单个字段指定解析功能
- 无法为类型指定resolveType或isTypeOf属性，因此无法使用Unions和Interfaces
- 无法使用自定义标量
- buildSchema不允许您为架构中的任何字段指定解析器功能。这包括Query和Mutation类型上的字段。使用的示例buildSchema通过依赖GraphQL的默认解析器行为并传递root值来解决此问题。
-  默认情况下，如果字段没有resolve函数，则GraphQL将检查父值（由父字段的解析器返回），并且（假设它是一个Object）将尝试在该父值上查找与名称相匹配的属性。如果找到匹配项，则将字段解析为该值。如果匹配恰好是一个函数，它将首先调用该函数，然后解析为该函数返回的值。
-  在上面的示例hello中，第一个架构中的字段没有解析程序。GraphQL是在根传递值，根值有一个叫做hello，这是一个函数，所以它调用的函数，然后解析为函数的返回值。您只需将hello属性设为String而不是函数，就可以达到相同的效果。

```java
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      hello: {
        type: GraphQLString,
      }
    })
  })
});

const root = { hello: () => 'Hello world!' };

graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});
12345678910111213141516
```

尽管通过根传递解析器是一个巧妙的技巧，但它再次仅适用于根级字段（如Query，Mutation或Subscription类型上的字段）。如果您想为其他类型的字段提供解析器，则无法使用buildSchema。

但是如果还想利用SDL生成模式 ，可以使用：例如apollo-server，makeExecutableSchema。makeExecutableSchema允许您使用SDL定义架构，同时还提供单独的resolvers对象。

- buildSchema从模式语言构建模式对象.它只需要一大串Type定义作为参数.
- makeExecutableSchema将模式和解析器组合在一起以生成可执行模式.

所以使用以下方式就可以实现效果：

```java
const typeDefs = `
  type Query {
    hello: String
  }
`
const resolvers = {
  Query: {
    hello: () => 'Hello!',
  }
}
const schema = makeExecutableSchema({ typeDefs, resolvers })
  
     const app = {
        ctx: {
          request: {},
          respons: {},
        },
        next: () => {},
      };
   // 校验客户端Schema请求参数与服务器的Schema是否匹配
      const value = await graphql(
        schema, //加载服务端 schema
        clientSchema,
        app,
        {
          //需要再次加载resolvers
          ...resolvers.Mutation,
          ...resolvers.Subscription,
          ...resolvers.Query,
        },
        variables
      );  
  
  
```



## 操作名称（Operation name） 

这之前，我们都使用了简写句法，省略了 `query` 关键字和查询名称，但是生产中使用这些可以使我们代码减少歧义。

下面的示例包含了作为**操作类型**的关键字 `query` 以及**操作名称** `HeroNameAndFriends`：



## 查询（query） [#](https://graphql.cn/learn/queries/#mutations)

一般用来查询数据 不会修改后台数据 用get会多一点，当然也可以用post方式

//没有参数的时候

### query查询

clientSchema

```
query {
     getUser {
       name
       id
   }
}

或者直接
  getUser {
       name
       id
   }

```

如果有参数的时候

clientSchema

```
    query ($id:ID){
      getUser(id:$id){
         name
        friends  {
          name
        }
      }
    }
```



整体例子

serverSchema

```
     type User {
       id: ID!
       name: String!   
     }

    extend type Query {
      getUser(id:String!,name:String!): User
    }
```



serverResolvers

```
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
```



clientSchema

```
    query{
      getUser (id:"${parameter.id}",name:"${parameter.name}") {
         name
         id
      }
    }
```













## 变更（Mutations） [#](https://graphql.cn/learn/queries/#mutations)

GraphQL 的大部分讨论集中在数据获取，但是任何完整的数据平台也都需要一个改变服务端数据的方法。

REST 中，任何请求都可能最后导致一些服务端副作用，但是约定上建议不要使用 `GET` 请求来修改数据。GraphQL 也是类似 —— 技术上而言，任何查询都可以被实现为导致数据写入。然而，建一个约定来规范任何导致写入的操作都应该显式通过变更（mutation）来发送。

就如同查询一样，如果任何变更字段返回一个对象类型，你也能请求其嵌套字段。获取一个对象变更后的新状态也是十分有用的。我们来看看一个变更例子：

###  突变查询mutation

clientSchema 没有参数的时候

```
    mutation  {
      getUser{
         name
        friends  {
          name
        }
      }
    }
```

clientSchema 有参数的时候

````
    mutation ($id:ID){
      getUser(id:$id){
         name
        friends  {
          name
        }
      }
    }
````



整体例子

serverSchema

```
    type User {
      name:String!
      id: ID!
    }
    
    extend type Mutation {
      updateUser(userId: ID!, name: String!): User!
    }
```

serverResolvers

```
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
```



serverSchema

```
  mutation($userId: ID! $name: String!) {
      updateUser(userId: $userId name: $name) {
        name
        id
      }
    }
```

variables

```
 {

       userId: 123456,

       name: "y g s",

   },


```

 







## 字段（Fields）

简单而言，GraphQL 是关于请求对象上的特定字段。我们以一个非常简单的查询以及其结果为例

serverSchema

```
  type User {
      name: String!   
      id: ID!
    }

    extend type Mutation {
      updateUser: User
    }
```

serverResolvers

```
 resolvers: {
      Mutation: {
        updateUser(root, parameter, source, fieldASTs) {
          console.log("root==", root);
          console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            name: "你 好",
            id: 123,
          };
        },
      },
      Subscription: {},
      Query: {},
    },
```

clientSchema

```
    mutation {
      # 没有参数不能写括号
      updateUser{
        id
        name
      }
    }
```



## 参数（Arguments） [#](https://graphql.cn/learn/queries/#arguments)

在类似 REST 的系统中，你只能传递一组简单参数 —— 请求中的 query 参数和 URL 段。但是在 GraphQL 中，每一个字段和嵌套对象都能有自己的一组参数，从而使得 GraphQL 可以完美替代多次 API 获取请求。甚至你也可以给 标量（scalar）字段传递参数，用于实现服务端的一次转换，而不用每个客户端分别转换。

### 例子  默认传参 形参传参 方式

serverSchema

```
     type User {
       id: ID!
       name: String!   
     }

    extend type Query {
      getUser(id:String!,name:String!): User
    }
    
```

serverResolvers

```
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
```

clientSchema

```
   // 参数
  const parameter = {
     id: "123",
     name: "hi hello",
   };
   

    {
      getUser (id:"${parameter.id}",name:"${parameter.name}") {
         name
         id
      }
    }
```



### variables 参数方式

除了传递Schema外，    在提供一个variables对象参数传递给后台。

serverSchema

```
     type User {
       id: ID!
       name: String!
     }

     extend type Query {
      getUser(userId:ID!,name:String!): User
    }
```





serverResolvers

```
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
            id: 123,
            ...parameter,
          };
        },
      },
    },
```



clientSchema

```
    query($userId: ID! $name: String!) {
      getUser(userId: $userId name: $name) {
        name
        id
      }
    }
```

variables 参数

```
      {
      userId: 12345,
      name: "zhang san",
     } 
```



### 输入类型（Input Types） 

输入类型主要简化了当参数很多的时候, clientSchema 不需要一个个定义，而是引用后端写好的Schema Input 输入变量即可，例子

serverSchema

```
   
      #定义输入类型
       input UserInput {
         account: String!
         password: String!
       }

       type User{
          id : ID!
          email : String!
          name : String!
          phone: String!
        }

        extend type Query {
          getUser(user:UserInput!):User
        }
```

serverResolvers

```
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
            id: 1,
            email: "281113270@qq.com",
            name: "张三",
            phone: '18529531779',
          };
        },
      },
    },
```

clientSchema

```
  query($user:UserInput!){
      getUser(user:$user){
        id 
        email 
        name 
        phone 
      }
    }
```

variables 参数

```
   user:{
        account: "abc",
        password: "123456"
      }
```









## 别名（Aliases） [#](https://graphql.cn/learn/queries/#aliases) 

在类似 REST 的系统中，你只能传递一组简单参数 —— 请求中的 query 参数和 URL 段。但是在 GraphQL 中，每一个字段和嵌套对象都能有自己的一组参数，从而使得 GraphQL 可以完美替代多次 API 获取请求。甚至你也可以给 标量（scalar）字段传递参数，用于实现服务端的一次转换，而不用每个客户端分别转换。如果一次查询多个相同对象，但是值不同，这个时候就需要起别名了，否则json的语法就不能通过了。



例子：

比如我们有一个接口是获取用户信息的 根据不同的用户id获取不同的数据

serverSchema

```
    type User {
      msg: String  
    }

    extend type Query {
      getUser(id:ID): User
    }
```



serverResolvers

```
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
```

clientSchema

```
    query {
      xiaomingUser: getUser(id: 1) {
        msg
      }
      zhansanUser: getUser(id: 2) {
        msg
      }
    }
```

后台返回参数

```
{
    xiaomingUser:  { msg: '返回第一个别名参数' },
    zhansanUser:  { msg: '返回第二个别名参数' } 
  }
```



## 片段（Fragments） [#](https://graphql.cn/learn/queries/#fragments)

如果你查询的字段返回的是接口或者联合类型，那么你可能需要使用**内联片段**来取出下层具体类型的数据：

- !（叹号）代表参数不能为空。

serverSchema

```
    type User {
      name: String! #! 为必须      
      address: String
     }
    extend type Query{
      getUser(id:ID):User
    } 
```

serverResolvers

```
    resolvers: {
      Mutation: {},
      Subscription: {},
      Query: {
        getUser: (root, parameter, source, fieldASTs) => {
          const { id } = parameter;
          // console.log("root==", root);
          // console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            name: "y g s",
            address: "guang xi ",
          };
        },
      },
    },
```

clientSchema

```
    # 声明片段 User 需要映射服务端的 User   type User
    fragment UserFrag on User {
      name
      address
    }

    query {
      getUser(id: 1) {
      #展开片段
        ...UserFrag
      }
    }
```

## 设置默认值 

serverSchema serverResolvers 同上

clientSchema

```
    # 声明片段 User 需要映射服务端的 User   type User
    fragment UserFrag on User {
      name
      address
    }
    #设置默认值id为3
    query($id:ID = "3"){
      getUser(id: 1) {
        ...UserFrag
      }
      getUserList(id: $id ) {
        ...UserFrag
      }
 
    }
```











## 指令（Directives） [#](https://graphql.cn/learn/queries/#directives)

我们上面讨论的变量使得我们可以避免手动字符串插值构建动态查询。传递变量给参数解决了一大堆这样的问题，但是我们可能也需要一个方式使用变量动态地改变我们查询的结构。譬如我们假设有个 UI 组件，其有概括视图和详情视图，后者比前者拥有更多的字段。

我们来构建一个这种组件的查询：

其实就是前段动态控制是否要返回参数字段 感觉作用不是很大

尝试修改上面的变量，传递 `true` 给 `withFriends`，看看结果的变化。

我们用了 GraphQL 中一种称作**指令**的新特性。一个指令可以附着在字段或者片段包含的字段上，然后以任何服务端期待的方式来改变查询的执行。GraphQL 的核心规范包含两个指令，其必须被任何规范兼容的 GraphQL 服务器实现所支持：

- `@include(if: Boolean)` 仅在参数为 `true` 时，包含此字段。
- `@skip(if: Boolean)` 如果参数为 `true`，跳过此字段。

指令在你不得不通过字符串操作来增减查询的字段时解救你。服务端实现也可以定义新的指令来添加新的特性。

例子 前端指令

serverSchema

```
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
```



serverResolvers

```
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
```

#### @include 指令

clientSchema

```
    query ($id:ID, $withFriends: Boolean!){
      hello(id:$id){
        name
        friends @include(if: $withFriends) {
          name
        }
      }
    }
```



variables

```
// 前端指令可用来显示或者隐藏接受参数 @include(if: Boolean) 仅在参数为 true 时，包含此字段。
      variables: {
        withFriends:false,
        id:123
      },
```

#### @skip指令 

服务端serverSchema和serverResolvers一样

clientSchema

```
    query ($id:ID, $withFriends: Boolean!){
      hello(id:$id){
        name
        friends @skip(if: $withFriends) {
          name
        }
      }
    }
```



variables

```
// 前端指令可用来显示或者隐藏接受参数 @include(if: Boolean) 仅在参数为 true 时，包含此字段。
      variables: {
        withFriends:false,
        id:123
      },
```

### 服务端创建指令有两种方式

#### 服务端指令1

只要在客户端指令写一个指令，并且服务端serverResolvers中注入一个回调函数即可，改回调函数有字段中间件拦截功能

例子



serverSchema

```
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
```

serverResolvers

```
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
```



clientSchema

```
    query ($id:ID){
      hello(id:$id){
         name
        friends  {
          name
        }
      }
    }
```

variables 参数

```
   query ($id:ID){
      hello(id:$id){
         name
        friends  {
          name
        }
      }
    }
```

创建指令

```
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


//注入指令
    // 验证 SeverSchema
      this.serverSchema = makeExecutableSchema({
        typeDefs,
        resolvers, // 可以做验证resolvers 中 Mutation，Subscription，Query
        // 4. 將 schema 的 directive 與實作連接並傳進 ApolloServer。
        directiveResolvers, // 自定义指令
        schemaDirectives, // 自定义指令
      });

```





#### 服务端指令2

创建指令2 的一些参数 clientSchema，serverSchema，variables和上面一样

创建指令

```
import { ApolloServer, gql, SchemaDirectiveVisitor } from "apollo-server";


 
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

// 注入指令

      // 验证 SeverSchema
      this.serverSchema = makeExecutableSchema({
        typeDefs,
        resolvers, // 可以做验证resolvers 中 Mutation，Subscription，Query
        // 4. 將 schema 的 directive 與實作連接並傳進 ApolloServer。
          directiveResolvers, // 自定义指令
          schemaDirectives:{
             upper: UpperCaseDirective
         },  // 自定义指令
      });


```







## 数据类型

### 类型系统（Type System） 

如果你之前见到过 GraphQL 查询，你就知道 GraphQL 查询语言基本上就是关于选择对象上的字段。因此，例如在下列查询中：

客户端  clientSchema

```
{
  hero {
    name
    appearsIn
  }
}
```

hero 为调用后台api函数，name和appearsIn为后台返回的接口参数

###  对象类型和字段（Object Types and Fields） 

一个 GraphQL schema 中的最基本的组件是对象类型，它就表示你可以从服务上获取到什么类型的对象，以及这个对象有什么字段。使用 GraphQL schema language，我们可以这样表示它：

服务端 serverSchema

```
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

虽然这语言可读性相当好，但我们还是一起看看其用语，以便我们可以有些共通的词汇：

- `Character` 是一个 **GraphQL 对象类型**，表示其是一个拥有一些字段的类型。你的 schema 中的大多数类型都会是对象类型。
- `name` 和 `appearsIn` 是 `Character` 类型上的**字段**。这意味着在一个操作 `Character` 类型的 GraphQL 查询中的任何部分，都只能出现 `name` 和 `appearsIn` 字段。
- `String` 是内置的**标量**类型之一 —— 标量类型是解析到单个标量对象的类型，无法在查询中对它进行次级选择。后面我们将细述标量类型。
- `String!` 表示这个字段是**非空的**，GraphQL 服务保证当你查询这个字段后总会给你返回一个值。在类型语言里面，我们用一个感叹号来表示这个特性。
- `[Episode!]!` 表示一个 `Episode` **数组**。因为它也是**非空的**，所以当你查询 `appearsIn` 字段的时候，你也总能得到一个数组（零个或者多个元素）。且由于 `Episode!` 也是**非空的**，你总是可以预期到数组中的每个项目都是一个 `Episode` 对象。

现在你知道一个 GraphQL 对象类型看上去是怎样，也知道如何阅读基础的 GraphQL 类型语言了。

## serverSchema 声明定义

### type变量定义对象

```
type User{
   name:String 
}
```

type 定义的是一个对象

![图片](https://s4.51cto.com/images/blog/202012/17/0e3537ddf18adc73e4fc954b9e73cb89.jpeg)

### [] 定义数组

```
type User{
   ids:[String] 
}
```

### GraphQL默认标量类型：

- `Int`：有符号 32 位整数。
- `Float`：有符号双精度浮点值。
- `String`：UTF‐8 字符序列。
- `Boolean`：`true` 或者 `false`。
- `ID`：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

### 定义自定义值 **scalar**

大部分的 GraphQL 服务实现中，都有自定义标量类型的方式。例如，我们可以定义一个 `Date` 类型：

scalar Date 自定义类型

#### 步骤

#### 1. 引用 `graphql` `graphql/language`

```js
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";
```

- `GraphQLScalarType` 用来声明 `Scalar`
- `Kind` 类型检查

serverSchema

```
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
```

- `scalar Date`   scalar Input 定义了自定义类型

- `Notice.noticeTime` 字段使用自定义 `Date` 类型

  

serverResolvers

```
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
             return parseInt(ast.value, 10) // ast value is always in string               format
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
```

- 中间件拦截钩子函数
- `parseValue(value) {...` 客户端输入
- `serialize(value) {...` 打印给客户端
- `parseLiteral(value) {...` 检查类型

clientSchema

```
    query ($name:Input){
      hello(name:$name){
        content
        noticeTime
      }
    }   
```

variables 参数

```
  variables: {
      name: 'y g s',
    },
```

返回参数

```
hello:
   [Object: null prototype] { content: '你好', noticeTime: 1602460800000 } }
```

可以看到客户端拿到参数已经被转换

### 枚举类型（Enumeration Types） 

也称作**枚举（enum）**，枚举类型是一种特殊的标量，它限制在一个特殊的可选值集合内。这让你能够：

 

1. 验证这个类型的任何参数是可选值的的某一个
2. 与类型系统沟通，一个字段总是一个有限值集合的其中一个值。

下面是一个用 GraphQL schema 语言表示的 enum 定义：

```
    enum Gender {
      MALE
      FEMALE
      NONE
    }
```



总体例子

serverSchema

```
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
```

serverResolvers

```
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
```

clientSchema

```
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
```

gender 字段会返回 MALE， FEMALE，NONE 三个值的其中一个

















### 类型修饰符 非空

![图片](https://s4.51cto.com/images/blog/202012/17/56e46068d9657ca96102149ddf6f2331.jpeg)

![图片](https://s4.51cto.com/images/blog/202012/17/f0de90c8962960139e8f4ffaf261c44e.jpeg)

![图片](https://s4.51cto.com/images/blog/202012/17/336f621904466a79e02745eb930002fa.jpeg)

类型修饰符，当前的类型修饰符有两种，分别是**List和Required** ，语法分别为[Type]和[Type!]，两者可以组合：

- [Type]! ：列表本身为必填项，但内部元素可以为空

- [Type!] ：列表本身可以为空，但是其内部元素为必填

- [Type!]! ：列表本身和内部元素均为必填

- ```
  type Character {
    name: String!
    appearsIn: [Episode]!
  }
  ```

  此处我们使用了一个 `String` 类型，并通过在类型名后面添加一个感叹号`!`将其标注为**非空**。这表示我们的服务器对于这个字段，总是会返回一个非空值，如果它结果得到了一个空值，那么事实上将会触发一个 GraphQL 执行错误，以让客户端知道发生了错误。

非空和列表修饰符可以组合使用。例如你可以要求一个非空字符串的数组：

```
myField: [String!]
```

这表示**数组本身**可以为空，但是其不能有任何空值成员。用 JSON 举例如下：

```
myField: null // 有效
myField: [] // 有效
myField: ['a', 'b'] // 有效
myField: ['a', null, 'b'] // 错误
```

然后，我们来定义一个不可为空的字符串数组：

```
myField: [String]!
```

 这表示数组本身不能为空，但是其可以包含空值成员：

```
myField: null // 错误
myField: [] // 有效
myField: ['a', 'b'] // 有效
myField: ['a', null, 'b'] // 有效
```

### 接口（Interfaces） [#](https://graphql.cn/learn/schema/#interfaces)

跟许多类型系统一样，GraphQL 支持接口。一个**接口**是一个抽象类型，它包含某些字段，而对象类型必须包含这些字段，才能算实现了这个接口。

例如，你可以用一个 `Character` 接口用以表示《星球大战》三部曲中的任何角色：

```
interface IUser {
  id: ID!
  name: String!
  address: String!
}
#实现接口类

```

例子

serverSchema

```
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
```

serverResolvers

```
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
```

clientSchema

```
    {
      getUser { 
         id
         name
         address
         gender
      }
    }
```



### union 联合类型

GraphQL联合表示一个对象的类型是对象类型列表中之一，但不保证这些类型之间的字段。另一个区别于接口的方面是，对象会声明其实现的接口，而不知道它被包含的联合。

对于接口和对象，只可以直接查询在其中被定义的字段，如果要查询接口的其他字段，必须使用类型片段。对于联合也是一样，但是联合不定义任何字段，所以联合上**不**允许查询任何字段，除非使用类型片段。

例如，我们有以下类型系统：

serverSchema

```

        union SearchResult = Photo | Person

        type Person {
          name: String!
          age: Int!
        }

        type Photo {
          height: Float!
          width: Int!
        }

        extend type Query {
          firstSearchResult(unionName:String,name:String): SearchResult
        }
```

serverResolvers

```
 resolvers: {
      // 实现联合类型SearchResult
      SearchResult: {
        __resolveType(obj, context, info){
          // console.log('__resolveType==')
          // console.log('obj==',obj)
          // console.log('context==',context)
          // console.log('info==',info)
          // console.log(obj, context, info)
          // 根据unionName参数返回不同的union 模式  Person或者Photo
          if(obj.unionName=='Photo'){
            return 'Photo'
          }
          if(obj.unionName=='Person'){
            return 'Person'
          }
          return null
        }
      },
      Mutation: {},
      Subscription: {},
      Query: {
        firstSearchResult: (root, parameter, source, fieldASTs) => {
          console.log("root==", root);
          console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            unionName:parameter.unionName,
            name:parameter.name,
            age:18,
            height:1.7
          };
        },
      },
    },
```

当查询`SearchQuery`类型的`firstSearchResult`字段时，查询可能需要片段的所有字段来判断类型。如果结果是`Person`，那请求其`name`，如果是`photo`，那请求`height`。下列案例是错的，因为联合上不定义任何字段：

```
query{
  firstSearchResult(unionName:"Person",name:"张三") {
    name
    height
  }
}
```

而正确的查询应该是：

clientSchema

```
   query{
      # 根据unionName参数返回不同的union 模式  Person或者Photo
      firstSearchResult(unionName:"Person",name:"张三") {
        ... on Person {
          name
          age
        }
        ... on Photo {
          height
        }
      }
    }
```



还有种情况是比如某一个pixel字段 他的类型可能是 String（"15px"）或者是Int(15)那么 我们只能后台转一次数据格式，或者不用后台转用联合类型

serverSchema

```
type Style{
   pixel:String  | Int  # 这样写是报错的
}

# 正确写法是

union UunitStyle = unitString | unitInt
    # 字符串型
    type unitString {
          pixel: String 
        }
       # 整形
        type unitInt {
          pixel: Int 
        }
   extend type Query {
          getStyle(unit:String): UunitStyle
        }



```





​	文档接口说明与注释

注释用

```
# 注释
```



单行文档说明 

```
 """
    分类
 """
  type Category {
    "分类更新时间"
    updateTime: String
    "分类创建时间"
    createTime: String
    "分类名称"
    category_name: String
    "分类id"
    category_id: String
    "分类名称-英文（自建站的url路径需要匹配英文）"
    category_name_en: String
    _id: String
  }
```

多行文档说明 

```
 "分类"
  type Category {
    "分类更新时间"
    updateTime: String
    "分类创建时间"
    createTime: String
    "分类名称"
    category_name: String
    "分类id"
    category_id: String
    "分类名称-英文（自建站的url路径需要匹配英文）"
    category_name_en: String
    _id: String
  }
 
```

文档说明用markdown

```
  """
    **文章**
  """
  type Page {
    "pageId，标记page的id"
    pageId: String
  }
```



```
"""
Query 查询
"""
type Query {
  dummy: String
}

"""
 Mutation 突变查询
"""
type Mutation {
  dummy: String
}
"""
Subscription  服务器推送
"""
type Subscription {
  dummy: String
}

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}


extend type Query {
    hello: String
  }


  "**返回用户数据**" 
  type UserData{
    """
      名称
    """
    name:String !
    """
      用户ID
    """
    id: ID !
  }

   """
    updateUser 返回参数
   """
  type User {
    """
       返回状态
    """
    code:Int !
    """
       返回状态信息
    """
    mgs:String !
    """
      返回数据
    """
    data:UserData !
  }

  extend type Mutation {
    """
       updateUser 更新用户接口
    """
    updateUser(
       """
          用户userId
       """
       userId: ID !
       """
          用户名称
       """
       name: String !
       ): User !
  }
```

