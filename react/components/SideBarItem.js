import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FormattedMessage } from 'react-intl'

import { withRuntimeContext } from 'vtex.render-runtime'
import { IconMinus, IconPlus } from 'vtex.dreamstore-icons'

import categoryMenu from '../categoryMenu.css'


class SideBarItem extends Component {
  static propTypes = {
    /** Sidebar's item. */
    item: PropTypes.object.isRequired,
    /** Link values to create the redirect. */
    linkValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Closes sidebar. */
    onClose: PropTypes.func.isRequired,
    /** Runtime context. */
    runtime: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    /** Tree level. */
    treeLevel: PropTypes.number,
    /** Whether to show subcategories or not */
    showSubcategories: PropTypes.bool,
  }

  static defaultProps = {
    treeLevel: 1
  }

  state = {
    open: false,
  }

  get hasChildren(){
    const { item: { children }, showSubcategories } = this.props
    return showSubcategories && children && children.length > 0
  } 

  handleItemClick = () => {
    if (this.hasChildren) {
      this.setState({ open: !this.state.open })
    } else {
      this.navigateToPage()
    }
  }

  navigateToPage(){
    const {onClose, linkValues, runtime } = this.props
    
    const [department, category, subcategory] = linkValues
    const params = { department }
    
    if (category) params.category = category
    if (subcategory) params.subcategory = subcategory
    
    const page = category
      ? (subcategory ? 'store.search#subcategory' : 'store.search#category')
      : 'store.search#department'

    runtime.navigate({
      page,
      params,
      fallbackToWindowLocation: false,
    })
    onClose()
  }

  handleDepartmentClick = () => {
    const { runtime, onClose, linkValues } = this.props
    const [department] = linkValues
    const params = { department }
    const page = 'store.search#department'
    runtime.navigate({
      page,
      params,
      fallbackToWindowLocation: false,
    })
    onClose()
  }

  renderItemHeader(){
    const { item, treeLevel } = this.props
    const { open: isOpened } = this.state

    const sideBarItemTitleClasses = classNames('', {
      'ml5': treeLevel === 3,
      't-heading-4 lh-solid': treeLevel === 1
    })

    return (
      <div className="flex justify-between items-center pa5 pl5 pointer"
        onClick={this.handleItemClick}
      >
        <span className={sideBarItemTitleClasses}>
          {item.name}
        </span>
        {
          this.hasChildren && (
            <span className={treeLevel === 1 ? 'c-on-base' : 'c-muted-3'}>
              {isOpened
                ? <IconMinus size={16} />
                : <IconPlus size={16} />
              }
            </span>
          )
        }
      </div>
    )
  }

  renderChildren(){
    const { 
      item: { children }, 
      runtime,
      linkValues,
      onClose,
      treeLevel,
      showSubcategories } = this.props
    return (
      <ul>
        <li className="pl4 pointer t-body c-muted-2"
            onClick={this.handleDepartmentClick}>
            <FormattedMessage id="category-menu.all-category.title" />
        </li>
        {children.map(child => (
          <li key={child.id}>
            <SideBarItem
              showSubcategories={showSubcategories}
              item={child}
              linkValues={[...linkValues, child.slug]}
              onClose={onClose}
              treeLevel={treeLevel + 1}
              runtime={runtime}
            />
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const { treeLevel } = this.props
    
    const sideBarItemClasses = classNames(
      categoryMenu.sidebarItem, {
        'c-muted-2 pl4 t-body': treeLevel > 1,
        'c-on-base': treeLevel === 1
      }
    )
    const sideBarItemTitleClasses = classNames('', {
      't-heading-4 lh-solid': treeLevel === 1
    })
    return (
      <div className={sideBarItemClasses}>
        {this.renderItemHeader()}
        {this.hasChildren && this.state.open && this.renderChildren()}
      </div>
    )
  }
}

export default withRuntimeContext(SideBarItem)
