import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'

import getCategories from './queries/categoriesQuery.gql'
import CategoryItem from './CategoryItem'

/**
 * Component that represents the menu containing the categories of the store
 */
class CategoryMenu extends Component {
  render() {
    const { data } = this.props

    return (
      <div className="h3 bg-near-white">
        <nav className="flex w-two-thirds center h0">
          {data.categories.map(category => (
            <CategoryItem key={category.id} id={category.id} />
          ))}
        </nav>
      </div>
    )
  }
}

CategoryMenu.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
    }),
  }),
}

export default graphql(getCategories)(CategoryMenu)
