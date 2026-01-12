/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query ContentStatistics {\n      # Количество фильмов\n      filmCount: allFilms {\n        totalCount\n      }\n\n      # Количество персонажей\n      peopleCount: allPeople {\n        totalCount\n      }\n\n      # Количество планет\n      planetCount: allPlanets {\n        totalCount\n      }\n\n      # Количество видов\n      speciesCount: allSpecies {\n        totalCount\n      }\n\n      # Количество звездолетов\n      starshipCount: allStarships {\n        totalCount\n      }\n\n      # Количество транспортных средств\n      vehicleCount: allVehicles {\n        totalCount\n      }\n    }\n  ": typeof types.ContentStatisticsDocument,
    "\n  query ContentStatistics4Films {\n    filmCount: allFilms {\n      films {\n        id\n        title\n        director\n        openingCrawl\n        releaseDate\n      }\n    }\n  }\n": typeof types.ContentStatistics4FilmsDocument,
};
const documents: Documents = {
    "\n    query ContentStatistics {\n      # Количество фильмов\n      filmCount: allFilms {\n        totalCount\n      }\n\n      # Количество персонажей\n      peopleCount: allPeople {\n        totalCount\n      }\n\n      # Количество планет\n      planetCount: allPlanets {\n        totalCount\n      }\n\n      # Количество видов\n      speciesCount: allSpecies {\n        totalCount\n      }\n\n      # Количество звездолетов\n      starshipCount: allStarships {\n        totalCount\n      }\n\n      # Количество транспортных средств\n      vehicleCount: allVehicles {\n        totalCount\n      }\n    }\n  ": types.ContentStatisticsDocument,
    "\n  query ContentStatistics4Films {\n    filmCount: allFilms {\n      films {\n        id\n        title\n        director\n        openingCrawl\n        releaseDate\n      }\n    }\n  }\n": types.ContentStatistics4FilmsDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n    query ContentStatistics {\n      # Количество фильмов\n      filmCount: allFilms {\n        totalCount\n      }\n\n      # Количество персонажей\n      peopleCount: allPeople {\n        totalCount\n      }\n\n      # Количество планет\n      planetCount: allPlanets {\n        totalCount\n      }\n\n      # Количество видов\n      speciesCount: allSpecies {\n        totalCount\n      }\n\n      # Количество звездолетов\n      starshipCount: allStarships {\n        totalCount\n      }\n\n      # Количество транспортных средств\n      vehicleCount: allVehicles {\n        totalCount\n      }\n    }\n  "): (typeof documents)["\n    query ContentStatistics {\n      # Количество фильмов\n      filmCount: allFilms {\n        totalCount\n      }\n\n      # Количество персонажей\n      peopleCount: allPeople {\n        totalCount\n      }\n\n      # Количество планет\n      planetCount: allPlanets {\n        totalCount\n      }\n\n      # Количество видов\n      speciesCount: allSpecies {\n        totalCount\n      }\n\n      # Количество звездолетов\n      starshipCount: allStarships {\n        totalCount\n      }\n\n      # Количество транспортных средств\n      vehicleCount: allVehicles {\n        totalCount\n      }\n    }\n  "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ContentStatistics4Films {\n    filmCount: allFilms {\n      films {\n        id\n        title\n        director\n        openingCrawl\n        releaseDate\n      }\n    }\n  }\n"): (typeof documents)["\n  query ContentStatistics4Films {\n    filmCount: allFilms {\n      films {\n        id\n        title\n        director\n        openingCrawl\n        releaseDate\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;