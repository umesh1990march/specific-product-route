// Write your code here
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProdcutItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: {},
    similarProducts: [],
    noOfProduct: 1,
  }

  componentDidMount() {
    this.setState({apiStatus: apiStatusConstants.loading})
    this.getProductDetails()
  }

  getUpdateDetails = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    price: data.price,
    description: data.description,
    rating: data.rating,
    availability: data.availability,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.getUpdateDetails(data)
      //  console.log(updatedData)
      const similarData = data.similar_products.map(each =>
        this.getUpdateDetails(each),
      )
      console.log(similarData)
      this.setState({
        productDetails: updatedData,
        similarProducts: similarData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductView = () => {
    const {productDetails, similarProducts, noOfProduct} = this.state

    const {
      title,
      price,
      description,
      rating,
      availability,
      brand,
      totalReviews,
      imageUrl,
    } = productDetails
    return (
      <>
        <div className="product-item-container">
          <img src={imageUrl} className="product-image" alt="product" />
          <div>
            <h1>{title}</h1>
            <p>Rs. {price}/-</p>

            <p>{rating}</p>

            <p>
              {totalReviews} <span>Reviews</span>
            </p>

            <p>{description}</p>
            <p>Availability: {availability}</p>
            <p>Brand: {brand}</p>
          </div>
          <div>
            <button
              type="button"
              data-testid="minus"
              onClick={this.decrementNoOfProduct}
            >
              <BsDashSquare />
            </button>
            <p>{noOfProduct}</p>
            <button
              type="button"
              data-testid="plus"
              onClick={this.incrementNoOfProduct}
            >
              <BsPlusSquare />
            </button>
          </div>
          <button type="button">ADD TO CART</button>
        </div>
        <div className="similar-products">
          <h1>Similar Products</h1>
          <ul>
            {similarProducts.map(product => (
              <SimilarProdcutItem productDetails={product} key={product.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderProductPage = () => {
    const {history} = this.props
    return history.push('/products')
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="not-found-img"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.renderProductPage}>
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  incrementNoOfProduct = () => {
    this.setState(prevState => ({noOfProduct: prevState.noOfProduct + 1}))
  }

  decrementNoOfProduct = () => {
    const {noOfProduct} = this.state
    if (noOfProduct > 1) {
      this.setState(prevState => ({noOfProduct: prevState.noOfProduct - 1}))
    }
  }

  renderSpecificView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductView()
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderSpecificView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
