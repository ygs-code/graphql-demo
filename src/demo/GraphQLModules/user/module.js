/*
 * @Date: 2022-05-20 14:22:59
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:24:05
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/user/module.js
 * @Description:
 */
import { createModule, gql } from 'graphql-modules'

export const UserModule = createModule({
  id: 'user-module',
  dirname: __dirname,
  typeDefs: [
    gql`
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
      """
      用户信息数据
      """
      type UserData {
        """
        用户昵称
        """
        name: String
        """
        用户手机号码
        """
        phone: String
      }

      """
      用户信息
      """
      type UserInfo {
        """
        请求状态
        """
        code: Int
        """
        用户信息数据
        """
        data: UserData
        """
        请求信息
        """
        message: String
      }

      #union UnionUserId = String | ID

      extend type Query {
        #! 是必填参数
        getUserInfo(id: ID): UserInfo
      }
    `,
  ],
  resolvers: {
    Mutation: {},
    Subscription: {},
    Query: {
      getUserInfo(root, parameter, source, fieldASTs) {
        // const { ctx: { request, response } = {} } = root
        // const { id } = parameter || {}
        // console.log("parameter=", parameter);
        // outHttpLog({
        //   source,
        //   response,
        //   __filename,
        // });
    

    
        return {
          code: 200,
          message: '请求成功',
          data: {
            name:'2134',
            phone:'234',
          },
        }
      },
    },
  },
})
