// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  console.log(productDetails)
  const {imageUrl, brand, title, rating, price} = productDetails

  return (
    <li>
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <p>{brand}</p>
      <p>by {title}</p>
      <div>
        <p>{price}</p>
        <p>{rating}*3</p>
      </div>
    </li>
  )
}

export default SimilarProductItem
