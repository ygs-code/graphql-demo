/*
 * @Date: 2022-05-20 14:22:51
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:34:24
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/index.js
 * @Description: 
 */
import { createApplication } from 'graphql-modules'  
import {
    graphql,
    Source,
    validateSchema,
    parse,
    validate,
    // execute,
    formatError,
    getOperationAST,
    specifiedRules,
    buildSchema,
    defaultFieldResolver,
  } from "graphql";
import { UserModule } from './user'
import { getGraphQLParameters, processRequest } from 'graphql-helix'
import { application } from './application'
import express from 'express'
import {graphqlHTTP} from './express-graphql'

console.log('graphqlHTTP=====',graphqlHTTP)


const execute = application.createExecution()
const schema = application.schema

const server = express() 

server.use(
  '/',
  graphqlHTTP({
    schema,
    customExecuteFn: execute,
    graphiql: true
  })
)

server.listen(7000, () => {
  console.log(`🚀 Server ready at http://localhost:7000/`)
})

// // const { operationName, query, variables } = getGraphQLParameters(request)
// const result =  processRequest({
//     operationName:'updateUser',
//     query:`
//     mutation {
//       # 没有参数不能写括号
//       updateUser{
//         id
//         name
//       }
//     }`,
//     variables:{},
//     request:{
//         setCooket:()=>{}
//     },
//     schema: application.schema,
//     execute: application.createExecution(),
//     subscribe: application.createSubscription()
//   })

// console.log('result======',result) 


 