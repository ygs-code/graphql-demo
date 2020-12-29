 module.exports=
 `
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
type User {
    name: String!
    id: ID!
}
extend type Mutation {
    updateUser(userId: ID!, name: String!): User
}
`