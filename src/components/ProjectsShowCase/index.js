import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import ProjectCard from '../ProjectCard'
import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  in_Progress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProjectsShowCase extends Component {
  state = {
    categoriesList: [],
    projectsList: [],
    apiStatus: apiConstants.initial,
    selectedOption: '',
  }

  componentDidMount() {
    const {categoriesList} = this.props
    const selectedOption = categoriesList[0].id
    this.setState({categoriesList, selectedOption}, this.getProjects)
  }

  getProjects = async () => {
    this.setState({apiStatus: apiConstants.in_Progress})
    const {selectedOption} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${selectedOption}`
    const response = await fetch(apiUrl)
    const fetchedData = await response.json()
    if (response.ok === true) {
      const updatedData = fetchedData.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  onChangeSelectOption = event => {
    this.setState({selectedOption: event.target.value}, this.getProjects)
  }

  renderDropdown = () => {
    const {categoriesList, selectedOption} = this.state
    return (
      <select
        className="select-input"
        onChange={this.onChangeSelectOption}
        value={selectedOption}
      >
        {categoriesList.map(category => (
          <option key={category.id} value={category.id}>
            {category.displayText}
          </option>
        ))}
      </select>
    )
  }

  renderProjectCard = () => {
    const {projectsList} = this.state
    return (
      <ul className="card-container">
        {projectsList.map(project => (
          <ProjectCard cardDetails={project} key={project.id} />
        ))}
      </ul>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader height={50} width={50} type="ThreeDots" color="#328af2" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getProjects}>
        Retry
      </button>
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case 'SUCCESS':
        return this.renderProjectCard()
      case 'IN_PROGRESS':
        return this.renderLoader()
      case 'FAILURE':
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="projects-showcase-container">
          <div className="responsive-container">
            {this.renderDropdown()}
            {this.renderApiStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default ProjectsShowCase
