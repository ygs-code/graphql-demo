import CheckGraphql from "../CheckGraphql";
import {
  graphql,
  Source,
  validateSchema,
  parse,
  validate,
  execute,
  formatError,
  getOperationAST,
  specifiedRules,
  buildSchema,
  defaultFieldResolver,
  GraphQLUnionType,
} from "graphql";

// chalk插件，用来在命令行中输入不同颜色的文字
import chalk from "chalk";

// var searchResultItemType = new GraphQLUnionType({
//   name: 'SearchResultItems',
//   types: [ packageOfferItem, tileItem ],
//   resolveType: function (value) {
//     if (value.type === 'packageOffer') {
//       return packageOfferItem;
//     } else if (value.type === 'tile') {
//       return tileItem;
//     } else {
//       return null;
//     }
//   }
// });

new CheckGraphql({
  rootValue: {
    ctx: {
      request: {},
      respons: {},
    },
    next: () => {},
  },
  serverSchema: {
    schemas: [
      `
        # 联合类型变量 
        union Uunit = unitString | unitInt
       # 字符串类型
        type unitString {
          height: String 
          width: String 
        }
       # 整形
        type unitInt {
          height: Int 
          width: Int 
        }
        
      # 属性
       type Attribute{
         style:Uunit
         class:String
       }

       # 查询方法
        extend type Query {
          getAttr(unit:String): Attribute
          
        }
     `,
    ],
    schema: ` `,
    resolvers: {

      Attribute: {
        style:{
          Uunit:{
            __resolveType(obj, rootValue, info) {
              // console.log('__resolveType==')
              // console.log('obj==',obj)
              // console.log('rootValue==',rootValue)
              // console.log('info==',info)
              // console.log(obj, rootValue, info)
              // 根据unionName参数返回不同的union 模式  Person或者Photo
              if (obj.unionName == "Photo") {
                return "Photo";
              }
              if (obj.unionName == "Person") {
                return "Person";
              }
              return null;
            }
          },
          __resolveType(obj, rootValue, info) {
            // console.log('__resolveType==')
            // console.log('obj==',obj)
            // console.log('rootValue==',rootValue)
            // console.log('info==',info)
            // console.log(obj, rootValue, info)
            // 根据unionName参数返回不同的union 模式  Person或者Photo
            if (obj.unionName == "Photo") {
              return "Photo";
            }
            if (obj.unionName == "Person") {
              return "Person";
            }
            return null;
          },
        },
        __resolveType(obj, rootValue, info) {
          // console.log('__resolveType==')
          // console.log('obj==',obj)
          // console.log('rootValue==',rootValue)
          // console.log('info==',info)
          // console.log(obj, rootValue, info)
          // 根据unionName参数返回不同的union 模式  Person或者Photo
          if (obj.unionName == "Photo") {
            return "Photo";
          }
          if (obj.unionName == "Person") {
            return "Person";
          }
          return null;
        },
      },
      Uunit: { 
        __resolveType(obj, rootValue, info) {
          // console.log('__resolveType==')
          // console.log('obj==',obj)
          // console.log('rootValue==',rootValue)
          // console.log('info==',info)
          // console.log(obj, rootValue, info)
          // 根据unionName参数返回不同的union 模式  Person或者Photo
          if (obj.unionName == "Photo") {
            return "Photo";
          }
          if (obj.unionName == "Person") {
            return "Person";
          }
          return null;
        },
      },
      Mutation: {},
      Subscription: {},
      Query: {
        getAttr: (root, parameter, source, fieldASTs) => {
          console.log("root==", root);
          console.log("parameter==", parameter);
          // console.log('source==',source)
          // console.log('fieldASTs==',fieldASTs)
          return {
            unionName: parameter.unionName,
            name: parameter.name,
            age: 18,
            height: 1.7,
            style: {},
            class: "box-class",
          };
        },
      },
    },
  },
  clientSchema: {
    schema: `
    query{
      # 根据unionName参数返回不同的union 模式  Person或者Photo
      getAttr(unit:"string") {
        class
        style {
          ... on unitString {
            width
          }
          ... on unitInt {
            height
          }
        }

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
    // console.log("error=", chalk.red(error));
  });

export default {};
