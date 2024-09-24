import './index.css'

const ProjectCard = props => {
  const {cardDetails} = props
  const {name, imageUrl} = cardDetails
  return (
    <li className="card-item">
      <img src={imageUrl} alt={name} className="project-image" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectCard
