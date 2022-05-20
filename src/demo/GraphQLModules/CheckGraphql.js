import { createModule, gql, createApplication } from 'graphql-modules';
// import { createApplication } from 'graphql-modules';
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from 'chalk';
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
} from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { off } from 'process';
import requireGraphQLFile from 'require-graphql-file';

/*

 options 参数 说明


let $checkGraphql = new CheckGraphql({
    modules: [UserModule, UserModule2, MarketingModule, LogisticsModule],
});


{  
  modules:[], // 每一个子模块的 application
  returnFirst:false, //是 graphql 查询时候返回参数，是否取第一个，如果是true 那么客户端不能使用别名，也不能多接口方法查询，默认是false
  rootValue:{  //这个参数是node 上下文 可以传递request，respons，next等
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
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
    operationName: 'getUser',  // 请求方法名称
  },
}

CheckGraphql 对象方法，可以做单元测试
   集成调用    返回 promise 对象 获取数据  
    new CheckGraphql({
         modules: [UserModule, UserModule2, MarketingModule, LogisticsModule],
     }).init(parameters);

  高性能调用 
    这样做的好处就是只校验一次服务器的Schema 而上面每次调用接口都会校验一次服务器的Schema
   let $checkGraphql = new CheckGraphql({
       modules: [UserModule, UserModule2, MarketingModule, LogisticsModule],
   });

   $checkGraphql.validateSeverSchema();
 async function test(parameters) {
    const { clientSchema } = parameters;
    let documentAST = await $checkGraphql.validateClientSchema(parameters);

    await $checkGraphql.validateSeverClientSchema({
        documentAST,
        clientSchema,
    });
    return await $checkGraphql.validateGraphql({
        ...parameters,
        documentAST,
    });
}

test({
    rootValue: {
        ctx: {
            request: {
                setCookie() {},
            },
        },
        next: () => {},
    },
    clientSchema: {
        schema: `
    query{
      getUser {
       name
       id
    }
  }
  `,
        variables: {},
        operationName: 'getUser',
    },
}).then((data) => {
    console.log('getUser======', data);
});
     
*/

class CheckGraphql {
    constructor(options = {}) {
        this.options = options;
    }
    async init(parameters) {
        const { clientSchema } = parameters;
        // 验证resolvers是否有重复
        // await this.validateResolvers();
        // 验证服务户端Schema
        await this.validateSeverSchema();
        // 验证客户端Schema
        let documentAST = await this.validateClientSchema({ clientSchema });
        // 一起验证客户端服务端Schema
        await this.validateSeverClientSchema({
            documentAST,
            clientSchema,
        });
        // 验证客户端请求与服务户端一起验证
        const data = await this.validateGraphql({
            documentAST,
            clientSchema,
        });
        return data;
    }

    // 验证resolvers是否有重复
    validateResolvers = async () => {
        // this.options = {
        //     ...this.options,
        //     ...options,
        // };
        let { modules = [] } = this.options;
        this.serverRootSchema = gql`
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

        let cacheRecord = [];

        for (let [index, item] of modules.entries()) {
            const {
                config: {
                    id, // 模块id
                    dirname, // 路劲
                    typeDefs, //typeDefs
                    resolvers = {},
                } = {},
            } = item;

            modules[index].config.typeDefs = [
                this.serverRootSchema,
                ...typeDefs,
            ];
            const { Mutation = {}, Subscription = {}, Query = {} } = resolvers;
            let nowRecord = {
                id, // 模块id
                dirname, // 路劲
                typeDefs, //typeDefs
                Mutation: [],
                Subscription: [],
                Query: [],
            };

            // cacheRecord.push({
            //     id, // 模块id
            //     dirname, // 路劲
            //     typeDefs, //typeDefs
            //     Mutation: [],
            //     Subscription: [],
            //     Query: [],
            // });

            for (let key in Mutation) {
                if (Mutation.hasOwnProperty(key)) {
                    let prevData = cacheRecord.find((item) => {
                        return item.Mutation.includes(key);
                    });
                    if (prevData) {
                        throw new Error(
                            chalk.red(
                                `当前的模块ID:${id}，路径：${dirname}与模块ID:${prevData.id}，路径：${prevData.dirname}。中的resolvers.Mutation.${key}发生重名冲突，请重新修改。`
                            )
                        );
                    }
                    nowRecord.Mutation.push(key);
                }
            }
            for (let key in Query) {
                if (Query.hasOwnProperty(key)) {
                    let prevData = cacheRecord.find((item) => {
                        return item.Query.includes(key);
                    });
                    if (prevData) {
                        throw new Error(
                            chalk.red(
                                `当前的模块ID:${id}，路径：${dirname}与模块ID:${prevData.id}，路径：${prevData.dirname}。中的resolvers.Query.${key}发生重名冲突，请重新修改。`
                            )
                        );
                    }
                    nowRecord.Query.push(key);
                }
            }
            for (let key in Subscription) {
                if (Subscription.hasOwnProperty(key)) {
                    let prevData = cacheRecord.find((item) => {
                        return item.Subscription.includes(key);
                    });
                    if (prevData) {
                        throw new Error(
                            chalk.red(
                                `当前的模块ID:${id}，路径：${dirname}与模块ID:${prevData.id}，路径：${prevData.dirname}。中的resolvers.Subscription.${key}发生重名冲突，请重新修改。`
                            )
                        );
                    }
                    nowRecord.Subscription.push(key);
                }
            }

            cacheRecord.push(nowRecord);
        }

        this.options = {
            ...this.options,
            modules,
        };
    };

    // 验证 服务器SeverSchema
    validateSeverSchema = async (options = {}) => {
        // this.options = {
        //     ...this.options,
        //     ...options,
        // };

        await this.validateResolvers();

        let {
            modules = [],
            serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
        } = this.options;

        // This is your application, it contains your GraphQL schema and the implementation of it.
        this.application = createApplication({
            modules,
        });

        this.executeFn = this.application.createExecution();

        this.options = {
            ...this.options,
            serverSchema: {
                ...serverSchema,
                schema: this.application.schema,
            },
        };

        try {
            // 验证 SeverSchema
            const validateSeverSchemaInfo = validateSchema(
                this.application.schema
            );
            if (validateSeverSchemaInfo.length > 0) {
                throw validateSeverSchemaInfo;
            }
            console.log(chalk.rgb(36, 114, 199)('服务器schema验证通过'));
        } catch (error) {
            // console.error(chalk.red('服务器schema验证失败:', error));
            throw new Error(chalk.red('服务器schema验证失败:' + error));
        }
    };

    // 验证 客户端ClientSchema
    validateClientSchema = async (options = {}) => {
        // this.options = {
        //     ...this.options,
        //     ...options,
        // };
        let {
            serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
            // clientSchema: {
            //     schema: clientSchema = '',
            //     variables = {},
            //     operationName,
            // } = {},
        } = this.options;

        let {
            // serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
            clientSchema: {
                schema: clientSchema,
                variables = {},
                operationName,
            } = {},
        } = options;

        let documentAST = null;

        if (operationName === undefined) {
            // console.error(chalk.red('验证客户端schema失败,operationName不能为空'));
            throw new Error(
                chalk.red('验证客户端schema失败,operationName不能为空')
            );
        }

        const source = new Source(clientSchema, 'GraphQL request');
        try {
            // 验证客户端 schema
            documentAST = parse(source);
            console.log(chalk.rgb(36, 114, 199)('验证客户端schema通过'));
        } catch (syntaxError) {
            // console.error(chalk.red('验证客户端schema失败:', syntaxError));
            throw new Error(chalk.red('验证客户端schema失败:' + syntaxError));
        }

        return documentAST;
    };
    // 验证 服务端，客户端SeverClientSchema
    validateSeverClientSchema = async (options = {}) => {
        // this.options = {
        //     ...this.options,
        //     ...options,
        // };
        let {
            serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
            // clientSchema: { schema: clientSchema = '', variables = {} } = {},
        } = this.options;

        let {
            // serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
            clientSchema: { schema: clientSchema = '', variables = {} } = {},
            documentAST,
        } = options;

        try {
            //服务端的schema和客户端的schema 一起验证
            const validationErrors = validate(
                serverSchema,
                documentAST,
                specifiedRules
            );
            if (validationErrors.length > 0) {
                throw validationErrors;
            }
            console.log(
                chalk.rgb(
                    36,
                    114,
                    199
                )('服务端的schema和客户端的schema一起验证通过')
            );
        } catch (syntaxError) {
            // console.error(
            //     chalk.red(
            //         '服务端的schema和客户端的schema一起验证失败:',
            //         syntaxError
            //     )
            // );
            throw new Error(
                chalk.red(
                    '服务端的schema和客户端的schema一起验证失败:' + syntaxError
                )
            );
        }
    };
    // 客户端Schema和请求参数与服务器的Schema校验
    validateGraphql = async (options = {}) => {
        let {
            serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
        } = this.options;
        let {
            clientSchema: { schema: clientSchema = '', variables = {} } = {},
            documentAST,
            returnFirst = false,
            context = {},
            rootValue = {},
        } = options;

        try {
            // 校验客户端Schema请求参数与服务器的Schema是否匹配

            const value = await this.executeFn({
                schema: serverSchema,
                document: documentAST,
                rootValue: rootValue,
                contextValue: context,
                variableValues: variables,
            });

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
                )('客户端Schema和请求参数与服务器的Schema校验通过')
            );
            return returnFirst
                ? {
                      ...data[keys[0]],
                  }
                : data;
        } catch (errors) {
            // console.error(
            //     chalk.red(
            //         '客户端Schema和请求参数与服务器的Schema校验失败errors:' +
            //             errors
            //     )
            // );
            throw new Error(
                chalk.red(
                    '客户端Schema和请求参数与服务器的Schema校验失败errors:' +
                        errors
                )
            );
        }
    };
}

export default CheckGraphql;
