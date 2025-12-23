import { gql } from 'apollo-server-express';

export const themeTypeDefs = gql`
  scalar JSON

  type ThemeStats {
    downloads: Int
    rating: Float
  }

  type ThemeConfig {
    styles: JSON
    defaultLayouts: JSON
  }

  type Theme {
    id: ID!
    name: String!
    description: String
    previewImage: String
    price: Float
    category: String!
    stats: ThemeStats
    config: ThemeConfig
    isApproved: Boolean
    createdAt: String
  }

  input ThemeInput {
    name: String!
    description: String
    price: Float
    category: String!
    config: JSON!
  }

  type Query {
    getThemes(category: String): [Theme]
    getThemeById(id: ID!): Theme
  }

  type Mutation {
    submitTheme(input: ThemeInput!): Theme
    approveTheme(id: ID!): Theme
  }
`;
