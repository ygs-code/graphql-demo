import ValidateGraphql from '../ValidateGraphql';
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from 'chalk';

// 于对象类型的例子
class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }
    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }
    roll({ numRolls }) {
        var output = [];
        for (var i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

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
         type RandomDie {
            numSides: Int! 
            rollOnce: Int! 
            roll(numRolls: Int!): [Int] 
           } 
         extend type Query { 
             getDie(numSides: Int): RandomDie 
         } 
       `,
        resolvers: {
            Mutation: {},
            Subscription: {},
            Query: {
                getDie: function (root, { numSides }, source, fieldASTs) {
                    return new RandomDie(numSides || 6);
                },
            },
        },
    },
    clientSchema: {
        schema: `
        {
            getDie(numSides:3){
              roll(numRolls:2)
              rollOnce
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
