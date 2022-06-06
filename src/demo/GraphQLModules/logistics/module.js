/*
 * @Date: 2022-05-20 14:22:59
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:24:05
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/user/module.js
 * @Description:
 */
import { createModule, gql } from 'graphql-modules';

export const LogisticsModule = {
    id: 'logistics-module',
    dirname: __dirname,
    typeDefs: [
        `
            type Logistics {
                id: ID
                name: String
            }

            extend type Query {
                getLogistics: Logistics
            }
        `,
    ],
    resolvers: {
        Mutation: {},
        Subscription: {},
        Query: {
            getLogistics: (root, parameter, source, fieldASTs) => {
                console.log('root==', root);
                console.log('parameter==', parameter);
                // console.log('source==',source)
                // console.log('fieldASTs==',fieldASTs)
                return {
                    id: '1',
                    name: '恭喜你获得100积分',
                };
            },
        },
    },
}
