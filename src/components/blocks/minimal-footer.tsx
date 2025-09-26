import { Link } from '@tanstack/react-router'

export const MinimalFooter = () => {
  return (
    <div className="flex h-8 w-full items-center justify-center gap-8 text-xs">
      <div>
        <p className="px-2">{new Date().getFullYear()} &copy; Emerz Inc.</p>
      </div>
      <div>
        <Link to="/terms-and-conditions">Terms & Conditions</Link>
      </div>
      <div>
        <Link to="/privacy-policy">Privacy</Link>
      </div>
      <div>
        <Link to="/disclaimer">Disclaimer</Link>
      </div>
    </div>
  )
}
