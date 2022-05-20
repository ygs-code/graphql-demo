/*
 * @Date: 2022-05-20 15:51:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:28:48
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/index2.js
 * @Description:
 */
import express from 'express'
import { getGraphQLParameters, processRequest } from 'graphql-helix'
import bodyParser from 'body-parser'
import { application } from './application'

const app = express()
// app.use(express.json())
let port = 7000
console.log('application=', application)
app.use(express.urlencoded({extended:false}))

// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())

app.use('/graphql', async (req, res) => {
  const request = {
    body: {},
    headers: req.headers,
    method: req.method,
    query: req.body.query,
  }

  console.log('req.body=',  req.body.query)
  console.log('req.query=', req.query) 
  //  console.log('req.query=',req)

  const { operationName, query, variables } = getGraphQLParameters(request)

  console.log('req.body.operationName=',req.body.operationName)
  console.log('req.body.query=',req.body.query)
  console.log('variables=',variables)

  const result = await processRequest({
    operationName:req.body.operationName,
    query:req.body.query,  //
    variables,
    request,
    schema: application.schema,
    execute: application.createExecution(),
    subscribe: application.createSubscription(),
  })
  console.log('result=',result)

  result.headers.forEach(({ name, value }) => res.setHeader(name, value))
  res.status(result.status)
  res.json(result.payload)
})

app.listen(port, () => {
  console.log(`GraphQL server is running on port ${port}.`)
})
