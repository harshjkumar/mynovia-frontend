import Link from 'next/link'

export default function Button({ children, href, variant = 'gold', onClick, type = 'button', className = '', ...props }) {
  const base = variant === 'gold' ? 'btn-gold' :
    variant === 'gold-filled' ? 'btn-gold-filled' :
    variant === 'white' ? 'btn-white' :
    variant === 'dark' ? 'btn-dark' : 'btn-gold'

  if (href) {
    return (
      <Link href={href} className={`${base} ${className}`} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={`${base} ${className}`} {...props}>
      {children}
    </button>
  )
}
