/*
 * @Date: 2022-05-20 15:51:10
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-05-20 16:28:48
 * @FilePath: /graphql-demo/src/demo/GraphQLModules/index2.js
 * @Description:
 */
import { UserModule } from './user';
import { UserModule2 } from './user2';
import { MarketingModule } from './marketing';
import { LogisticsModule } from './logistics';
import ValidateGraphql from './ValidateGraphql';

let $ValidateGraphql = new ValidateGraphql({
    modules: [ UserModule2,UserModule, MarketingModule, LogisticsModule],
});

$ValidateGraphql.validateSeverSchema();

async function test(parameters) {
    // return new ValidateGraphql({
    //     modules: [UserModule, UserModule2, MarketingModule, LogisticsModule],
    // }).init(parameters);

    const { clientSchema } = parameters;
    let documentAST = await $ValidateGraphql.validateClientSchema(parameters);

    await $ValidateGraphql.validateSeverClientSchema({
        documentAST,
        clientSchema,
    });
    return await $ValidateGraphql.validateGraphql({
        ...parameters,
        documentAST,
    });
}

test({
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
       adderss

    }
  }
  `,
        variables: {},
        operationName: 'getUser',
    },
}).then((data) => {
    console.log('getUser======', data);
});



test({
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
       adderss
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
test({
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

test({
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

// test({
//     clientSchema: {
//         schema: `
//     query{
//         getUserTow {
//        name
//        id
//     }
//   }
//   `,
//         variables: {},
//         operationName: 'getUserTow',
//     },
// }).then((data) => {
//     console.log('getUserTow======', data);
// });

// test({
//     clientSchema: {
//         schema: `
//         query{
//             getLogistics {
//              name
//              id
//           }
//         }
//   `,
//         variables: {},
//         operationName: 'getLogistics',
//     },
// }).then((data) => {
//     console.log('getLogistics======', data);
// });

// test({
//     clientSchema: {
//         schema: `
//         query{
//             getDiscount {
//              name
//              id
//           }
//         }
//   `,
//         variables: {},
//         operationName: 'getDiscount',
//     },
// }).then((data) => {
//     console.log('getDiscount======', data);
// });
