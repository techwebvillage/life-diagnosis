export default function ArticleBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-green prose-sm max-w-none mt-6">
      {children}
    </div>
  )
}
