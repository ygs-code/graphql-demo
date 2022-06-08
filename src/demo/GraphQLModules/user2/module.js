/*
 * @Date: 2022-05-20 14:22:59
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-08 19:33:50
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/user2/module.js
 * @Description:
 */
import { createModule, gql } from 'graphql-modules';

export const UserModule2 = {
    id: 'user2-module', // id不能与其他模块重名
    dirname: __dirname,
    typeDefs: [
        `
 
            type UserTow {
                id: ID
                name: String
                address: String!
                type:Int!
            }

            extend type Query {
                getUserTow: UserTow
            }
        `,
    ],
    // 这里并没有校验resolvers重复性，所以需要我们自己实现校验
    resolvers: {
        Mutation: {},
        Subscription: {},
        Query: {
            getUserTow: (root, parameter, source, fieldASTs) => {
                console.log('root==', root);
                console.log('parameter==', parameter);
                // console.log('source==',source)
                // console.log('fieldASTs==',fieldASTs)
                return {
                    id: '2',
                    name: '用户2模块',
                    address: 'address',
                    type:2
                };
            },
        },
    },
}
