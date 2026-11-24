import ContentDetail from "@/components/ContentDetail";

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return <ContentDetail section="project" id={decodeURIComponent(params.id)} />;
}
