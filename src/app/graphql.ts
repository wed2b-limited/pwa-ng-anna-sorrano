import { gql } from 'apollo-angular';

export const GET_COLLECTIONS = gql `query getProducts($page: Int, $pageSize: Int, $brandId: String, $brandCollectionId: String) {
    products(filter: { brand: { eq: $brandId }, brand_collection: { eq: $brandCollectionId } }, pageSize: $pageSize, currentPage: $page, sort: {price: DESC}) {
    total_count,
    page_info {
      page_size
      current_page
    }
    items {
     id
      sku
      url_key
      name
      attribute_set_id
      stock_status
      small_image {
        disabled
        label
        position
        url
      }
      media_gallery {
        url
        label
        position
      }
      description{
        html
      }
      short_description{
        html
      }
      price_range{
        minimum_price{
          regular_price{
            value
            currency
          }
        }
      },
      image {
        url
        label
      }
    }
  }
}`;

export const GET_ALL_COLLECTIONS = gql `query getProducts($page: Int, $pageSize: Int, $brandId: String, $brandCollectionId: [String!]) {
  products(filter: { brand: { eq: $brandId }, brand_collection: { in: $brandCollectionId } }, pageSize: $pageSize, currentPage: $page, sort: {price: DESC}) {
    total_count,
    page_info {
      page_size
      current_page
    }
    items {
      id
      sku
      url_key
      name
      attribute_set_id
      stock_status
      small_image {
        disabled
        label
        position
        url
      }
      media_gallery {
        url
        label
        position
      }
      description{
        html
      }
      short_description{
        html
      }
      price_range{
        minimum_price{
          regular_price{
            value
            currency
          }
        }
      },
      image {
        url
        label
      }
    }
  }
}`;
export const GET_AVAILABLE_ATTRIBUTE_DATA = gql `query getProducts($brandId: String) {
  products(filter: { brand: { eq: $brandId }}, pageSize: 100, currentPage: 1) {
    aggregations {
      label
      attribute_code
      options {
        count
        label
        value
      }
    }
    total_count
  }
}`;

export const GET_ATTRIBUTE_OPTION_SETTING_BY_VALUE = gql `query getAttributeOptionSettingByValue($value: String!) {
  getAttributeOptionSettingByValue(value: $value) {
    id
    value
    description
  }
}`;

export const GET_PRODUCT = gql `query getProducts($url_key: String!) {
  products(filter: {url_key: {eq: $url_key}}) {
    total_count
    aggregations {
      attribute_code
      count
      label
      options {
        label
        value
        count
      }
    }
    items {
      id
      sku
      url_key
      name
      stock_status
      price_range{
        minimum_price{
          regular_price{
            value
            currency
          }
        }
      }
      ... on ConfigurableProduct {
      configurable_options {
          id
          attribute_id
          label
          position
          use_default
          attribute_code
          values {
            value_index
            label
            swatch_data{
              value
            }
          }
          product_id
        }
        variants {
          product {
            name
            sku
            url_key
            stock_status
            price_range {
              minimum_price {
                regular_price {
                  value
                  currency
                }
              }
            }
          }
          attributes {
            label
            code
            value_index
          }
        }
      }
      media_gallery {
        url
        label
        position
        ... on ProductVideo {
          video_content {
            video_url
          }
        }
      }
      small_image {
        disabled
        label
        position
        url
      }
      image {
        url
      }
      description{
        html
      }
      short_description{
        html
      }
    }
  }
}`;

export const GET_SHOPS = gql `query GetShop($store_id: Int) {
  shop(store_id: $store_id) {
    shop_id
    is_active
    title
    name
    town
    postcode
    telephone
    opening_hours
    url_key
    file
    line_address_1
    line_address_2
    line_address_3
    shop_main_territory
  }
}`;
