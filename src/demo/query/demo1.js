import ValidateGraphql from '../ValidateGraphql';
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from 'chalk';
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
      id: ID
      name: String  
    }

    extend type Query {
      getUser: User  
    }
    



    `,
        resolvers: {
            Mutation: {},
            Subscription: {},
            Query: {
                getUser: (root, parameter, source, fieldASTs) => {
                    console.log('root==', root);
                    console.log('parameter==', parameter);
                    console.log('source==',source)
                    console.log('fieldASTs==',fieldASTs)
                    return {
                        id: '123',
                        name: 'hello my name is zhang san ',
                    };
                },
            },
        },
    },
    clientSchema: {
        schema: `
    {
      getUser {
         name
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
