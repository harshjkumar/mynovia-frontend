import { ikUrl } from '@/lib/imagekit'

export default function ImageKitImage({ src, alt, width, height, transforms, className = '', ...props }) {
  const url = ikUrl(src, transforms)

  return (
    <img
      src={url}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      {...props}
    />
  )
}
