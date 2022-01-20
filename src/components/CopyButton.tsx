import React, { FC, useEffect, useState } from 'react'
import { Button } from './inputs'

type CopyButtonProps = {
  getContent: () => string
} & React.HTMLProps<HTMLButtonElement>

export const CopyButton: FC<CopyButtonProps> = ({
  getContent,
  children,
  ...rest
}) => {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    const content = getContent()
    navigator.clipboard.writeText(content)
    setCopied(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    // @ts-ignore
    <Button {...rest} onClick={onCopy}>
      {copied ? 'Copied!' : children}
    </Button>
  )
}
