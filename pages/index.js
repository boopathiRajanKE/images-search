import * as React from "react"
import Link from "next/link"
import fetch from "isomorphic-unfetch"
import { searchIcon } from "../assets/icons"

const makeAPi = async (pagination = 1, searchTerm = "") => {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=${pagination}&per_page=9&query=${searchTerm}&client_id=yCDCyEWwgxj4ia8yDdzCKKmiUpQu_K31jdK5DvWr0Do`
  )
  return await response.json()
}

function Index() {
  const [inputValue, setInputValue] = React.useState("")
  const [mount, setMount] = React.useState(false)
  const [pagination, setPagination] = React.useState(1)
  const [dataResponse, setDataResponse] = React.useState({})

  const inputRef = React.useRef(null)

  const onInputChange = () => {
    setInputValue(inputRef.current.value)
  }

  const onSubmit = React.useCallback(async () => {
    const response = await makeAPi(pagination, inputValue)
    setDataResponse({ ...dataResponse, ...response })
  }, [pagination, inputValue])

  const onLoadMore = React.useCallback(() => {
    setPagination((prevState) => prevState + 1)
  }, [])

  React.useEffect(() => {
    setMount(true)
  }, [])

  React.useEffect(() => {
    if (mount) {
      ;(async () => {
        const response = await makeAPi(pagination, inputValue)
        const { results = [] } = response
        const { results: prevResults = [] } = dataResponse
        const newResults = [...prevResults, ...results]
        setDataResponse({ ...dataResponse, results: newResults })
      })()
    }
  }, [pagination])

  const renderImage = (item, index) => {
    const {
      id = "",
      alt_description = "",
      urls: { small: image = "" } = {},
      user: { name = "", profile_image: { medium: profilePic = "" } = {} },
    } = item

    return (
      <li
        index={index}
        key={`image-item-${index}`}
        className="zt-image-item-wrapper"
      >
        <Link href="/photo/[id]" as={`/photo/${id}`}>
          <a>
            <div className="zt-image-block">
              <img
                src={image}
                alt={alt_description}
                className="sz-image-element"
              />
            </div>
            <div className="zt-user-block">
              <img src={profilePic} alt={name} className="sz-user-image" />
              <div className="sz-user-name-element">
                Image by <span> {name}</span>
              </div>
            </div>
          </a>
        </Link>
      </li>
    )
  }

  return (
    <div className="zt-assignment">
      <div className="zt-input-block">
        <input
          ref={inputRef}
          value={inputValue}
          onChange={onInputChange}
          className="zt-input-element"
          placeholder="Search for images here..."
        />
        <button onClick={onSubmit} className="zt-search-icon">
          {searchIcon()}
        </button>
      </div>

      {dataResponse.results && dataResponse.results.length > 0 && (
        <div className="zt-image-block">
          <ul className="zt-images-container">
            {dataResponse.results.map(renderImage)}
          </ul>

          {dataResponse.results.length < dataResponse.total && (
            <button onClick={onLoadMore} className="zt-load-more-button">
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Index
