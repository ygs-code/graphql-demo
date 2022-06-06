/*
 * @Date: 2022-05-20 15:51:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:28:48
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/index2.js
 * @Description:
 */
import express from 'express';
import { getGraphQLParameters, processRequest } from 'graphql-helix';
import bodyParser from 'body-parser';
// import graphql from 'graphql';
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
import { application } from './application';
import { graphqlHTTP } from './express-graphql';

console.log('graphql=', graphql);
let executeFn = application.createExecution();
const schema = application.schema;

// const { query, variables, operationName } = {
//     query: `
//     query{
//       getLogistics {
//        name
//        id
//     }
//   }
//   `,
//     variables: {},
//     // operationName: 'getUser',
// };

async function test(parameters) {
    const { query, variables, operationName } = parameters;

    // Validate Schema 验证服务端Schema
    const schemaValidationErrors = validateSchema(schema);
    if (schemaValidationErrors.length > 0) {
        // Return 500: Internal Server Error if invalid schema.
        throw 'GraphQL schema validation error.';
    }

    const parseFn = parse;
    const validateFn = validate;
    executeFn = executeFn ? executeFn : execute;
    const validationRules = [];
    // Parse source to AST, reporting any syntax error.
    let documentAST;
    try {
        // 验证客户端Schema
        documentAST = parseFn(new Source(query, 'GraphQL request'));
    } catch (syntaxError) {
        // Return 400: Bad Request if any syntax errors errors exist.
        throw 'GraphQL syntax error.';
    }

    // Validate AST, reporting any errors.
    // 服务端和客户端一起验证
    const validationErrors = validateFn(schema, documentAST, [
        ...specifiedRules,
        ...validationRules,
    ]);

    if (validationErrors.length > 0) {
        // Return 400: Bad Request if any validation errors exist.
        throw 'GraphQL validation error.';
    }

    // Determine if this GET request will perform a non-query.
    // const operationAST = graphql_1.getOperationAST(documentAST, operationName);

    let result = {};

    // Perform the execution, reporting any errors creating the context.
    try {
        console.log('executeFn=====', executeFn);
        console.log('operationName=====', operationName);
        result = await executeFn({
            schema,
            document: documentAST,
            rootValue: {
                req: {
                    setCooket: () => {},
                },
            },
            contextValue: {},
            variableValues: variables,
            // operationName,
            // fieldResolver,
            // typeResolver,
        });

        // console.log('result=====', result);
    } catch (contextError) {
        console.log('contextError=====', contextError);
        // Return 400: Bad Request if any execution context errors exist.
        throw 'GraphQL execution context error.';
    }
    // result.then((value) => {
    //     console.log('value=======', value);
    // });
    return result;
}

test({
    query: `
  query{
    getUser {
     name
     id
  }
}
`,
    variables: {},
    operationName: 'getUser',
}).then((value) => {
    console.log('getUser=======', value);
});

test({
    query: `
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
}).then((value) => {
    console.log('getUser=======', value);
});

test({
    query: `
  query{
    getLogistics {
     name
     id
  }
}
`,
    variables: {},
    operationName: 'getLogistics',
}).then((value) => {
    console.log('getLogistics=======', value);
});

test({
    query: `
  query{
    getDiscount {
     name
     id
  }
}
`,
    variables: {},
    operationName: 'getDiscount',
}).then((value) => {
    console.log('getDiscount=======', value);
});
