/*
 * @Date: 2022-05-20 14:29:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 14:29:37
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/application.js
 * @Description: 
 */
import { createApplication } from 'graphql-modules'
import { UserModule } from './user'

// This is your application, it contains your GraphQL schema and the implementation of it.
const application = createApplication({
  modules: [UserModule]
})

// This is your actual GraphQL schema
const mySchema = application.schema


export  { application}