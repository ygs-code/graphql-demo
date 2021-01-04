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
} from "graphql";
import { makeExecutableSchema } from "graphql-tools";

const serverRootSchema = `
  type Query {
      dummy: String
  }
  type Mutation {
      dummy: String
  }
  type Subscription {
      dummy: String
  }
  schema {
      query: Query
      mutation: Mutation
      subscription: Subscription
  }
`;
const serverSchema = `
  ${serverRootSchema} \n 

  extend type Query {
    me: User
  }
  type User {
    id: ID
    name: String
  }

  
  `;

try {
  // 验证 SeverSchema
  const validateSeverSchemaInfo = validateSchema(buildSchema(serverSchema));
  if (validateSeverSchemaInfo.length == 0) {
    console.log("服务器SeverSchema验证通过");
  } else {
    throw validateSeverSchemaInfo;
  }
} catch (error) {
  console.error("服务器SeverSchema验证失败:", error);
}

//验证客户端schema

// Construct a schema, using GraphQL schema language
var $serverSchema = buildSchema(serverSchema);
var root = {
  hello: () => "Hello world!",
};

let validationRules = specifiedRules;

// 客户端参数
const params = {
  query: `{
    me{
      name
    }
  }`,
  variables: {
    name: "123",
  },
  operationName: "me",
};

// Get GraphQL params from the request and POST body data.
const clientSchema = params.query;
const variables = params.variables;

// GraphQL source.
const source = new Source(clientSchema, "GraphQL request");
let documentAST;
// Parse source to AST, reporting any syntax error.
try {
  // 验证客户端 schema
  documentAST = parse(source);
  console.log("验证客户端schema通过");
} catch (syntaxError) {
  console.error("验证客户端schema失败:", syntaxError);
}
try {
  //服务端的schema和客户端的schema 一起验证
  const validationErrors = validate(
    $serverSchema,
    documentAST,
    validationRules
  );
  if (validationErrors.length == 0) {
    console.log(
      "服务端的schema和客户端的schema 一起验证通过",
      validationErrors
    );
  } else {
    throw validationErrors;
  }
} catch (syntaxError) {
  console.error("服务端的schema和客户端的schema 一起验证失败:", syntaxError);
}

const app = {
  ctx: {
    request: () => {},
    response: () => {},
  },
  next: () => {},
};

const resolvers = {
  Mutation: {},
  Query: {
    me: (root, data, source, fieldASTs) => {
      console.log("root==", root);
      console.log("data==", data);
      // console.log('source==',source)
      // console.log('fieldASTs==',fieldASTs)
      return {
        name: "hello my name is zhang san",
      };
    },
  },
  Subscription: {},
};

$serverSchema = makeExecutableSchema({
  typeDefs: [serverSchema],
  resolvers: resolvers,
});

// 客户端schema与参数请求服务器校验
graphql($serverSchema, clientSchema, app, variables)
  .then((value) => {
    const { errors, data = {} } = value;
    const keys = Object.keys(data);
    if (errors) {
      console.error("graphql验证失败 errors:", errors);
      return;
    }
    console.log("客户端schema与参数请求服务器校验通过 data==", data[keys[0]]);
  })
  .catch((error) => {
    console.log("error==", error);
  });

export default {};
