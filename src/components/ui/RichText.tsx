import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const RichText = ({
  data,
  className = '',
}: {
  data?: SerializedEditorState | null
  className?: string
}) => {
  if (!data) return null
  return (
    <div className={`richtext ${className}`}>
      <LexicalRichText data={data} />
    </div>
  )
}
