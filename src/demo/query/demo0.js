// import ValidateGraphql from '../CheckGraphql';
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
         
        type objName {
            name:String
        }
        extend  type Query {
            hello:objName
        }


    `,
        resolvers: {
            Mutation: {},
            Subscription: {},
            Query: {
                hello: () => { return { name: 'hello world' } },
            },
        },
    },
    clientSchema: {
        schema: `
        {
            hello {
              name
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
