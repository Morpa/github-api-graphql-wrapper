const axios = require('axios').default;
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const MY_REST_URL = 'https://api.github.com/repos/frontendbr/vagas'

const MY_REST_URL_LIMIT = 'https://api.github.com/rate_limit'

const typeDefs = gql`

  type Labels {
    name: String!
    color: String!
  }

  type Job {
    id: Int!
    title: String!
    html_url: String!
    created_at: String!
    labels: [Labels]!
  }

  type Count {
    open_issues_count: Int!
  }

  type RateLimit {
    limit: Int!
    remaining: Int!
  }

  type Query {
    getJobs(limit: Int!, currentPage: Int, filter:[String]): [Job]!
    countJobs: Count!
    getQuantity(filter:[String]): Int
    rateLimit: RateLimit
  }
`;

const resolvers = {
    Query: {
      getJobs: async (_, { currentPage, limit, filter }) => {
        if (!!filter) {
          const { data } = await axios.get(MY_REST_URL + `/issues?state=open&per_page=${limit}&page=${currentPage}` + `&labels=${filter}`);
        return data;
        } else {
          const { data } = await axios.get(MY_REST_URL + `/issues?state=open&per_page=${limit}&page=${currentPage}`+ '&labels' );
        return data; 
        }
      },
        
      countJobs: async () => {
        const { data } = await axios.get(MY_REST_URL);
        return data;
      },
        
      getQuantity: async (_, { filter }) => {
        const { data } = await axios.get(MY_REST_URL + `/issues?state=open&per_page=500` + `&labels=${filter}`);

        const response = data.length

        return response;
      },
      
      rateLimit: async () => {
        const { data } = await axios.get(MY_REST_URL_LIMIT);
        return data.rate;
      },
    }
};

const schema = new ApolloServer({ typeDefs, resolvers });

schema.listen({ port: process.env.PORT || 3333} ).then(({ url }) => {
    console.log(`schema ready at ${url}`);
});

