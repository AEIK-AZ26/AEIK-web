import ContentDetail from "@/components/ContentDetail";

export default function AnnouncementDetailPage({ params }: { params: { id: string } }) {
  return <ContentDetail section="announcement" id={decodeURIComponent(params.id)} />;
}
