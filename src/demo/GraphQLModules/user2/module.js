/*
 * @Date: 2022-05-20 14:22:59
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:24:05
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/user/module.js
 * @Description:
 */
import { createModule, gql } from 'graphql-modules';

export const UserModule2 = createModule({
    id: 'user2-module', // id不能与其他模块重名
    dirname: __dirname,
    typeDefs: [
        gql`

            type User {
                id: ID
                name: String
                adderss: String!
                type:Int!
            }

            extend type Query {
                getUserTow: User
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
                console.log('source==',source)
                console.log('fieldASTs==',fieldASTs)
                return {
                    id: '2',
                    name: '用户2模块',
                    adderss: 'adderss',
                    type:2
                };
            },
        },
    },
});
