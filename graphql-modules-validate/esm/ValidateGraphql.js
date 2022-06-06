import { createModule, gql, createApplication } from 'graphql-modules';
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

/*

 options 参数 说明


let $ValidateGraphql = new ValidateGraphql({
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

ValidateGraphql 对象方法，可以做单元测试
   集成调用    返回 ValidateGraphql 实例
    let  $ValidateGraphql = new ValidateGraphql({
         modules: [UserModule, UserModule2, MarketingModule, LogisticsModule],
     })
     
     // 再调用获取校验数据
  $ValidateGraphql.init({
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
       adderss

    }
  }
  `,
        variables: {},
        operationName: 'getUser',
    },
});

  高性能调用 
    这样做的好处就是只校验一次服务器的Schema 而上面每次调用接口都会校验一次服务器的Schema
     const $validateGraphql = validateGraphql({
           modules: [UserModule2, UserModule, MarketingModule, LogisticsModule],
      });


$validateGraphql({
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
       adderss

    }
  }
  `,
        variables: {},
        operationName: 'getUser',
    },
}).then((data) => {
    console.log('getUser======', data);
});

$validateGraphql({
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
        getUserTow {
       name
       id
       adderss
       type
    }
  }
  `,
        variables: {},
        operationName: 'getUserTow',
    },
}).then((data) => {
    console.log('getUserTow======', data);
});

 
     
*/

class ValidateGraphql {
    constructor(options = {}) {
        this.options = options;
    }
    async init(parameters) {
        const { clientSchema } = parameters;
        // 验证resolvers是否有重复
        // await this.validateResolvers();
        // 验证服务户端Schema
        this.validateSeverSchemas();
        // 验证客户端Schema
        let documentAST = await this.validateClientSchema({ clientSchema });
        // 一起验证客户端服务端Schema
        await this.validateSeverClientSchema({
            documentAST,
            clientSchema,
        });
        // 验证客户端请求与服务户端一起验证
        const data = await this.ValidateGraphql(parameters);
        return data;
    }

    // 验证resolvers是否有重复
    validateResolvers = () => {
        // this.options = {
        //     ...this.options,
        //     ...options,
        // };
        let { modules = [] } = this.options;

        let cacheRecord = [];
        let newModules = [];

        for (let [index, item] of modules.entries()) {
            const {
                // config: {
                id, // 模块id
                dirname, // 路劲
                typeDefs = [], //typeDefs
                resolvers = {},
                // } = {},
            } = item;

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
                                `模块ID:${id}，路径：${dirname}与模块ID:${prevData.id}，路径：${prevData.dirname}。它们resolvers.Mutation.${key}发生重名冲突，请重新修改。`
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
                                `模块ID:${id}，路径：${dirname}与模块ID:${prevData.id}，路径：${prevData.dirname}。中的resolvers.Query.${key}发生重名冲突，请重新修改。`
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
                                `模块ID:${id}，路径：${dirname}与模块ID:${prevData.id}，路径：${prevData.dirname}。中的resolvers.Subscription.${key}发生重名冲突，请重新修改。`
                            )
                        );
                    }
                    nowRecord.Subscription.push(key);
                }
            }
            //创建模块Schema
            newModules.push(createModule(this.validateSeverSchema(item)));
            // 记录缓存
            cacheRecord.push(nowRecord);
        }

        this.options = {
            ...this.options,
            modules: newModules,
        };
    };

    //验证单个SeverSchema
    validateSeverSchema = (config) => {
        let {
            typeDefs = [],
            id, // id不能与其他模块重名
            dirname,
        } = config;

        let serverRootSchema = `
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

        let serverSchema = serverRootSchema + typeDefs.join(' ');
        try {
            // 验证 SeverSchema
            const validateSeverSchemaInfo = validateSchema(
                buildSchema(serverSchema)
            );
            if (validateSeverSchemaInfo.length > 0) {
                throw validateSeverSchemaInfo;
            }

            console.log(chalk.rgb(36, 114, 199)('服务器schema验证通过'));
        } catch (error) {
            // console.error(
            //     chalk.red(
            //         `服务器schema验证失败，错误信息:${error} 模块ID：${id}，路径:${dirname}`
            //     )
            // );
            throw new Error(
                chalk.red(
                    `服务器schema验证失败，错误信息:\n${error}\n模块ID：${id}，路径:${dirname} `
                )
            );
        }

        config.typeDefs = typeDefs.map((item) => {
            return gql(serverRootSchema + item);
        });
        return config;
    };

    // 验证 服务器SeverSchema
    validateSeverSchemas = (options = {}) => {
        // this.options = {
        //     ...this.options,
        //     ...options,
        // };

        this.validateResolvers();

        let {
            modules = [],
            serverSchema: { schema: serverSchema = '', resolvers = {} } = {},
        } = this.options;

        // This is your application, it contains your GraphQL schema and the implementation of it.
        this.application = createApplication({
            modules,
        });
        // 获取验证函数
        this.executeFn = this.application.createExecution();

        this.options = {
            ...this.options,
            serverSchema: {
                ...serverSchema,
                schema: this.application.schema,
            },
        };

        try {
            // validateSchema(buildSchema(serverSchema));
            // 验证 SeverSchema
            const validateSeverSchemaInfo = validateSchema(
                this.application.schema
                // buildSchema(this.application.schema)
            );
            if (validateSeverSchemaInfo.length > 0) {
                throw validateSeverSchemaInfo;
            }
            console.log(chalk.rgb(36, 114, 199)('服务器schema验证通过'));
        } catch (error) {
            // console.error(chalk.red('服务器schema验证失败:', error));
            throw new Error(chalk.red('服务器schema验证失败:\n' + error));
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
const validateGraphql = (options) => {
    const { modules = [] } = options;
    let $validateGraphql = new ValidateGraphql({
        modules,
    });

    $validateGraphql.validateSeverSchemas();

    return async (parameters) => {
        const { clientSchema } = parameters;
        let documentAST = await $validateGraphql.validateClientSchema(
            parameters
        );

        await $validateGraphql.validateSeverClientSchema({
            documentAST,
            clientSchema,
        });
        return await $validateGraphql.validateGraphql({
            ...parameters,
            documentAST,
        });
    };
};
export { validateGraphql };
export default ValidateGraphql;
