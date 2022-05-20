/*
 * @Date: 2022-05-20 14:29:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 14:29:37
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/application.js
 * @Description:
 */
import { createApplication } from 'graphql-modules';
import { UserModule } from './user';
import { UserModule2 } from './user2';
import { MarketingModule } from './marketing';
import { LogisticsModule } from './logistics';
const {
    config: {
        id, // 模块id
        dirname, // 路劲
        typeDefs, //typeDefs
        resolvers = {},
    } = {},
} = MarketingModule;

const { Mutation = {}, Subscription = {}, Query = {} } = resolvers;

// This is your application, it contains your GraphQL schema and the implementation of it.
const application = createApplication({
    modules: [MarketingModule, UserModule, UserModule2, LogisticsModule],
});

console.log('id=', id);
console.log('dirname=', dirname);
console.log('typeDefs=', typeDefs);
console.log('resolvers=', resolvers);

// This is your actual GraphQL schema
const mySchema = application.schema;

export { application };
