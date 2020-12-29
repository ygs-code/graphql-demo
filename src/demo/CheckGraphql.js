import gql from "graphql-tag";
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
} from "graphql";
import { makeExecutableSchema } from "graphql-tools";
class CheckGraphql {
  constructor(options) {
    const serverRootSchema = `
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
      serverSchema: { schema: serverSchema = "", resolvers = {} } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = options;
    serverSchema = ` ${serverRootSchema} \n ${serverSchema}`;

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
      serverSchema: { schema: serverSchema = "", resolvers = {} } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = this.options;

    try {
      // 验证 SeverSchema
      const validateSeverSchemaInfo = validateSchema(buildSchema(serverSchema));
      if (validateSeverSchemaInfo.length > 0) {
        throw validateSeverSchemaInfo;
      }

      // 验证 SeverSchema
      this.serverSchema = makeExecutableSchema({
        typeDefs: [gql(serverSchema)],
        resolvers, // 可以做验证resolvers 中 Mutation，Subscription，Query
      });
      console.log(chalk.rgb(36, 114, 199)("服务器schema验证通过"));
    } catch (error) {
      throw "服务器schema验证失败:" + error;
      //   console.error(chalk.red("服务器SeverSchema验证失败:", error));
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
      //   console.error(chalk.red("验证客户端schema失败:", syntaxError));
      throw "验证客户端schema失败:" + syntaxError;
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
      //   console.error(
      //     "服务端的schema和客户端的schema 一起验证失败:",
      //     syntaxError
      //   );
      throw "服务端的schema和客户端的schema一起验证失败:" + syntaxError;
    }
  };
  validateGraphql = async () => {
    let {
      serverSchema: { schema: serverSchema = "", resolvers = {} } = {},
      clientSchema: { schema: clientSchema = "", variables = {} } = {},
    } = this.options;

    try {
      const app = {
        ctx: {
          request: {},
          respons: {},
        },
        next: () => {},
      };
      // 校验客户端Schema请求参数与服务器的Schema是否匹配
      const value = await graphql(
        this.serverSchema, //加载服务端 schema
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
      const { errors, data = {} } = value;
      if (errors) {
        throw errors;
      }
      const keys = Object.keys(data);
      console.log(chalk.rgb(36, 114, 199)("graphql验证通过"));
      return {
        ...data[keys[0]],
      };
    } catch (errors) {
      throw "graphql验证失败 errors:" + errors;
    }
  };
}

export default CheckGraphql;
