import CheckGraphql from "../CheckGraphql";
// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";
new CheckGraphql({
  serverSchema: {
    schema: `
     type User {
      name: String  
    }

    extend type Query {
      hero(episode:String): User  
    }

 
    
    `,
    resolvers: {
      Mutation: {},
      Subscription: {},
      Query: {
        hero: (root, parameter, source, fieldASTs) => {
          console.log("root==", root);
          console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            id: "123",
            name: "hello my name is yao guan shou",
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    {
      jediHero: hero(episode: JEDI) {
        name
      }
    }
    `,
    variables: {},
  },
})
  .init()
  .then((data) => {
    console.log("data==", data);
  })
  .catch((error) => {
    console.log("error=", chalk.red(error));
  });

export default {};
