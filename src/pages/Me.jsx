import Response from '../components/Response'
import Icon from '../components/Icons'
import { profile } from '../data/profile'

export default function Me() {
  return (
    <div className="hero">
      <div className="hero-text">
        <Response path="/me" />
        <h1 className="hero-name">{profile.name}</h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-intro">{profile.intro}</p>
        <div className="pills">
          <a className="pill" href={profile.github} target="_blank" rel="noreferrer"><Icon name="github" size={14} /> Github</a>
          <a className="pill" href={profile.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={13} /> Linkedin</a>
          <a className="pill" href={`mailto:${profile.email}`}><Icon name="mail" size={14} /> Email</a>
          <a className="pill" href={profile.resume} download><Icon name="download" size={14} /> Resume</a>
        </div>
      </div>

      <div className="hero-figure">
        <div className="hero-glow" />
        <img className="hero-photo" src={profile.avatar} alt={profile.fullName} />
        <span className="tag tag-right">{profile.badges[0]}</span>
        <span className="tag tag-left">{profile.badges[1]}</span>
      </div>
    </div>
  )
}
