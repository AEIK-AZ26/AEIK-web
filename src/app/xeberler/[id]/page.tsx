import ContentDetail from "@/components/ContentDetail";

export default function NewsDetailPage({ params }: { params: { id: string } }) {
  return <ContentDetail section="news" id={decodeURIComponent(params.id)} />;
}
