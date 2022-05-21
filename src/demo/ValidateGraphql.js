import gql from "graphql-tag";
// import { ApolloServer, gql, SchemaDirectiveVisitor } from "apollo-server";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
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
import { makeExecutableSchema } from "graphql-tools";
import requireGraphQLFile from 'require-graphql-file'

// 2. Directive 實作
// class UpperCaseDirective extends SchemaDirectiveVisitor {
//   // 2-1. ovveride field Definition 的實作
//   visitFieldDefinition(field) {
//     console.log("field======", field);
//     const { resolve = defaultFieldResolver } = field;
//     // 2-2. 更改 field 的 resolve function
//     field.resolve = async function (...args) {
//       // 2-3. 取得原先 field resolver 的計算結果 (因為 field resolver 傳回來的有可能是 promise 故使用 await)
//       const result = await resolve.apply(this, args);
//       // 2-4. 將得到的結果再做預期的計算 (toUpperCase)
//       if (typeof result === "string") {
//         return result.toUpperCase();
//       }
//       console.log("result======", result);
//       // 2-5. 回傳最終值 (給前端)
//       return result;
//     };
//   }
// }

/*

 options 参数 说明

{  
  returnFirst:false, //是 graphql 查询时候返回参数，是否取第一个，如果是true 那么客户端不能使用别名，也不能多接口方法查询，默认是false
  rootValue:{  //这个参数是node 上下文 可以传递request，respons，next等
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {  // 服务器 serverSchema
    schema: `
    type User {
      name: String!   
      id: ID!
    }
    extend type Mutation {
      updateUser: User
    }
    `,
    resolvers: {  // 服务器 resolvers
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
  },
  clientSchema: {  // 客户端 clientSchema
    schema: `
    mutation {
      # 没有参数不能写括号
      updateUser{
        id
        name
      }
    }
    `,
    variables: {   // 客户端 发送参数
      // userId: 123,
      
    },
  },
}

ValidateGraphql 对象方法，可以做单元测试
  
    // 验证服务户端Schema
    await this.validateSeverSchema();
    // 验证客户端Schema
    await this.validateClientSchema();
    // 一起验证客户端服务端Schema
    await this.validateSeverClientSchema();
    // 验证客户端请求与服务户端一起验证 返回 查询resolvers参数
    const data = await this.ValidateGraphql();
    //会执行以上几个方法并且返回查询resolvers参数
    async  init()
*/

class ValidateGraphql {
  constructor(options) {
    this.serverRootSchema = `
    type Query {
        dummy: String
    }
    type Mutation {
        dummy: String
    }
    type Subscription {
        dummy: String
    }
    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
  `;

    let {
      serverSchema: {
        schema: serverSchema = "",
        schemas = [],
        resolvers = {},
      } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = options;
    if (schemas.length >= 1 && serverSchema.trim()) {
      throw new Error(
        chalk.red(
          "serverSchema的schemas与schema参数只能二选一，只能传递其中一个。"
        )
      );
    }
    if (schemas.length >= 1) {
      serverSchema = schemas.reduce((acc, next) => {
        acc += next;
        return acc;
      }, "");
    }
    serverSchema = ` ${this.serverRootSchema} \n ${serverSchema}`;

    this.options = {
      ...options,
      serverSchema: {
        schema: serverSchema,
        resolvers,
      },
    };
  }
  async init() {
    // 验证服务户端Schema
    await this.validateSeverSchema();
    // 验证客户端Schema
    await this.validateClientSchema();
    // 一起验证客户端服务端Schema
    await this.validateSeverClientSchema();
    // 验证客户端请求与服务户端一起验证
    const data = await this.validateGraphql();

    return data;
  }

  // 验证 SeverSchema
  validateSeverSchema = async () => {
    let {
      directiveResolvers = {},
      schemaDirectives = {},
      serverSchema: {
        schema: serverSchema = "",
        schemas = [],
        resolvers = {},
      } = {},
      clientSchema: {
        schema: clientSchema = "",

        variables = {},
      } = {},
    } = this.options;

    try {
      // 验证 SeverSchema
      const validateSeverSchemaInfo = validateSchema(buildSchema(serverSchema));
      if (validateSeverSchemaInfo.length > 0) {
        throw validateSeverSchemaInfo;
      }

      const typeDefs = schemas.length
        ? [this.serverRootSchema,schemas].map((item) => gql(item))
        : [gql(serverSchema)];
      // 验证 SeverSchema
      this.serverSchema = makeExecutableSchema({
        typeDefs,
        resolvers, // 可以做验证resolvers 中 Mutation，Subscription，Query
        // 4. 將 schema 的 directive 與實作連接並傳進 ApolloServer。
        directiveResolvers, // 自定义指令
        schemaDirectives, // 自定义指令
      });
      console.log(chalk.rgb(36, 114, 199)("服务器schema验证通过"));
    } catch (error) {
      console.error(chalk.red("服务器schema验证失败:", error));
      throw new Error(chalk.red("服务器schema验证失败:" + error));
    }
  };

  validateClientSchema = async () => {
    let {
      serverSchema: { schema: serverSchema = "", resolvers = {} } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = this.options;

    const source = new Source(clientSchema, "GraphQL request");
    try {
      // 验证客户端 schema
      this.documentAST = parse(source);
      console.log(chalk.rgb(36, 114, 199)("验证客户端schema通过"));
    } catch (syntaxError) {
      console.error(chalk.red("验证客户端schema失败:", syntaxError));
      throw new Error(chalk.red("验证客户端schema失败:" + syntaxError));
    }
  };

  validateSeverClientSchema = async () => {
    let {
      serverSchema: { schema: serverSchema = "", resolvers = {} } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = this.options;
    try {
      //服务端的schema和客户端的schema 一起验证
      const validationErrors = validate(
        this.serverSchema,
        this.documentAST,
        specifiedRules
      );
      if (validationErrors.length > 0) {
        throw validationErrors;
      }
      console.log(
        chalk.rgb(36, 114, 199)("服务端的schema和客户端的schema一起验证通过")
      );
    } catch (syntaxError) {
      console.error(
        chalk.red("服务端的schema和客户端的schema一起验证失败:", syntaxError)
      );
      throw new Error(
        chalk.red("服务端的schema和客户端的schema一起验证失败:" + syntaxError)
      );
    }
  };
  // 客户端Schema和请求参数与服务器的Schema校验
  validateGraphql = async () => {
    let {
      returnFirst = false,
      rootValue = {},
      serverSchema: { schema: serverSchema = "", resolvers = {} } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = this.options;

    try {
      // 校验客户端Schema请求参数与服务器的Schema是否匹配
      // console.log('  this.serverSchema=',  this.serverSchema)
      console.log('clientSchema=',  clientSchema)
      const value = await graphql(
        this.serverSchema, //加载服务端 schema
        clientSchema,
        rootValue,
        {
          //需要再次加载resolvers
          ...resolvers.Mutation,
          ...resolvers.Subscription,
          ...resolvers.Query,
        },
        variables
      );
      const { errors, data = {} } = value;
      if (errors) {
        throw errors;
      }
      //   console.log("data======", data);
      const keys = Object.keys(data);
      console.log(
        chalk.rgb(
          36,
          114,
          199
        )("客户端Schema和请求参数与服务器的Schema校验通过")
      );
      return returnFirst
        ? {
            ...data[keys[0]],
          }
        : data;
    } catch (errors) {
      console.error(
        chalk.red(
          "客户端Schema和请求参数与服务器的Schema校验失败errors:" + errors
        )
      );
      throw new Error(
        chalk.red(
          "客户端Schema和请求参数与服务器的Schema校验失败errors:" + errors
        )
      );
    }
  };
}

export default ValidateGraphql;
