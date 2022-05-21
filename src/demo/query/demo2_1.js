import ValidateGraphql from '../ValidateGraphql';
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from 'chalk';
// 构造类型
new ValidateGraphql({
    rootValue: {
        ctx: {
            request: {},
            respons: {},
        },
        next: () => {},
    },
    serverSchema: {
        schema: ` 
        type User {
            id: String 
            name: String 
        } 
        extend  type Query {
            user(id: String): User 
         }
    `,
        resolvers: {
            Mutation: {},
            Subscription: {},
            Query: {
                user: function (root, { id }, source, fieldASTs) {
                    // Maps id to User object
                    var fakeDatabase = {
                        a: {
                            id: 'a',
                            name: 'alice',
                        },
                        b: {
                            id: 'b',
                            name: 'bob',
                        },
                    };

                    return fakeDatabase[id];
                },
            },
        },
    },
    clientSchema: {
        schema: `
        {
            user(id:"a"){
              name,
              id
            }
          }  
    `,
        variables: {},
    },
})
    .init()
    .then((data) => {
        console.log('data==', data);
    })
    .catch((error) => {
        console.log('error=', chalk.red(error));
    });

export default {};
