const fetch = require('node-fetch');
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const MY_REST_URL = 'https://api.github.com/repos/frontendbr/vagas/issues?state=open'

const typeDefs = gql`

type Labels {
  node_id: String
  name: String
  color: String
}

  type Job {
    id: Int
    title: String
    url: String
    created_at: String
    labels: [Labels]
  }

  type Query {
    getJobs(limit: Int!): [Job]
  }
`;

const resolvers = {
    Query: {
      getJobs: async (_, {limit}) => {
        const response = await fetch(MY_REST_URL+ `&per_page=${limit}` + '&labels');
            return response.json();
        },
    }
};

const schema = new ApolloServer({ typeDefs, resolvers });

schema.listen({ port: process.env.PORT || 3333} ).then(({ url }) => {
    console.log(`schema ready at ${url}`);
});

