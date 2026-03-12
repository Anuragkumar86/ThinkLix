import ClientResultsPage from '@/components/ClientResultPage';

export default async function ResultsPage({ params }: { params: Promise<{ attemptId: string }> }) {
  
  const { attemptId } = await params;


  return <ClientResultsPage attemptId={attemptId} />;
}