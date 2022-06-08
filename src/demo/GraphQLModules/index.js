/*
 * @Date: 2022-05-20 15:51:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-08 19:32:39
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/index.js
 * @Description:
 */
import UserModule from './user';
import UserModule2 from './user2';
import MarketingModule from './marketing';
import LogisticsModule from './logistics';
import ValidateGraphql, {
    validateGraphql,
} from '../../../graphql-modules-validate';

const $validateGraphql = validateGraphql({
    lang:'zh-CN',
    modules: [
        ...UserModule2,
        ...UserModule,
        ...MarketingModule,
        ...LogisticsModule,
    ],
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
            address
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
       address
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

const parameter = {
    id: 123,
    name: '更新用户',
};
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
        mutation {
          updateUser(id:${parameter.id}, name:"${parameter.name}") {
            name
            id

          }
        }
        `,
        variables: {
            userId: 123456,
            name: 'zhang san',
        },
        operationName: 'updateUser',
    },
}).then((data) => {
    console.log('updateUser======', data);
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
        mutation($id: ID! $name: String!) {
          updateDiscount(id: $id name: $name) {
            name
            id
          }
        }
        `,
        variables: {
            id: 123456,
            name: 'zhang san',
        },
        operationName: 'updateDiscount',
    },
}).then((data) => {
    console.log('updateDiscount======', data);
});
