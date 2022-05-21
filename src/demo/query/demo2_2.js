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
  

    extend type  Query {
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
    `,
        resolvers: {
            Mutation: {},
            Subscription: {},
            Query: {
                rollDice: function (root, parameter, source, fieldASTs) {
                    const { numDice, numSides } = parameter;
                    console.log('parameter=', parameter);
                    var output = [];
                    for (var i = 0; i < numDice; i++) {
                        output.push(
                            1 + Math.floor(Math.random() * (numSides || 6))
                        );
                    }
                    return output;
                },
            },
        },
    },
    clientSchema: {
        schema: `
        {
            rollDice(numDice:3,numSides:6)
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
