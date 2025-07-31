import * as React from "react"
import type { SVGProps } from "react"

const Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={64}
    height={64}
    viewBox="0 0 64 64"
    fill="none"
    {...props}
  >
    <circle
      cx="32"
      cy="32"
      r="28"
      fill="currentColor"
      fillOpacity="0.1"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      fill="currentColor"
      d="M32 12L45 46H39L36 38H28L25 46H19L32 12Z"
    />
    <path
      fill="currentColor"
      d="M29.5 32H34.5L32 26L29.5 32Z"
    />
  </svg>
)
export default Icon