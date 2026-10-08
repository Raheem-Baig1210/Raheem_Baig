import { profile } from '../data/profile'

export default function AvatarPanel({ status }) {
  return (
    <aside className="avatar-panel" aria-hidden="true">
      <div className="avatar-card">
        <span className="avatar-card-icon">
          <i /><i /><i />
        </span>
        <img src={profile.avatar} alt="" />
      </div>
      <p className="avatar-status" key={status}>
        <span className="pulse-dot" /> {status}
      </p>
    </aside>
  )
}
