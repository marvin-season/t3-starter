import React, { useEffect, useRef } from 'react'
import RichText from '../RichText'
import { useTypewriter, type Options } from '@/app/_hooks/useTypewriter'

export interface TypingBubbleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  content: string
  className?: string
  isRichText?: boolean
  options?: Options
  messageRender?: (content: string) => string
  onResize?: (el: HTMLDivElement) => void
  children?: React.ReactNode
}

export const TypingBubble = (props: TypingBubbleProps) => {
  const {
    content,
    className,
    isRichText,
    options,
    messageRender,
    onResize,
    children,
    ...other
  } = props
  const { typedContent, isTyping } = useTypewriter(
    messageRender ? messageRender(content) : content,
    options,
  )
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!('ResizeObserver' in window)) {
      return
    }

    // eslint-disable-next-line compat/compat
    const resizeObserver = new ResizeObserver(() => {
      onResize?.(bubbleRef.current!)
    })

    if (bubbleRef.current) {
      resizeObserver.observe(bubbleRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [onResize])

  const effect = isTyping ? 'typing' : null

  return (
    <div className={`Bubble richtext className`} {...other} ref={bubbleRef}>
      {typedContent &&
        (isRichText ? (
          <RichText />
        ) : (
          <div data-effect={effect}>
            <p>{typedContent}</p>
          </div>
        ))}
      {children}
    </div>
  )
}
