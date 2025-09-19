import ResultsDisplay from '../ResultsDisplay'

export default function ResultsDisplayExample() {
  const mockGaugeData = {
    units: 'inches' as const,
    stitchGauge: 5.5,
    rowGauge: 7.5
  };

  return <ResultsDisplay gaugeData={mockGaugeData} />
}